#!/usr/bin/env python3
"""Ingest generated clips for a storyboard-flow project.

usage: python3 tools/ingest.py <slug> [--model medium] [--force]

For every .mp4 in projects/<slug>/04_clips/ (any file names):
  1. transcribe with Whisper (word timestamps), primed with the storyboard lines;
  2. match it to a storyboard clip by text similarity (best take wins, others are listed);
  3. detect black bars / generator marks (cropdetect) and the speech bounds;
  4. trim + crop + clean the audio (high-pass, denoise, EQ, loudnorm -16 LUFS) into
     remotion/public/projects/<slug>/clips/<id>.mp4;
  5. write per-clip word timings (relative to the trimmed clip), with the storyboard's
     spelling restored, to 05_ingest/words/<id>.json, and a report to 05_ingest/ingest.json.
Silent b-roll (storyboard `broll`, files named broll-bNN….mp4) is cropped and muted, not transcribed.
05_ingest/overrides.json pins what the automatic pass got wrong, per clip id:
  {"03": {"take": "file.mp4"}}                       use this take
  {"03": {"trim": {"start": 0.4, "end": 6.2}}}       use this trim
  {"03": {"stitch": [{"file": "a.mp4", "in": 0.3, "out": 3.1}, {"file": "b.mp4", "in": 3.0, "out": 6.4}]}}
                                                     join sub-ranges of takes (re-transcribed after)
  {"b01": {"trim": {"start": 0.5, "end": 5.0}}}      b-roll range
It also copies 01_vision/brand/* and 00_script/music.* into remotion/public/projects/<slug>/.
Never edits the storyboard or the source clips.
"""
import difflib, json, math, os, re, shutil, struct, subprocess, sys, wave
from collections import Counter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
args = sys.argv[1:]
if not args:
    sys.exit(__doc__)
slug = args[0]
model = args[args.index("--model") + 1] if "--model" in args else "medium"
force = "--force" in args
P = os.path.join(ROOT, "projects", slug)
PUB = os.path.join(ROOT, "remotion", "public", "projects", slug)
ING = os.path.join(P, "05_ingest")
for d in (ING, os.path.join(ING, "raw"), os.path.join(ING, "words"), os.path.join(ING, "wav"), os.path.join(PUB, "clips")):
    os.makedirs(d, exist_ok=True)

sb = json.load(open(os.path.join(P, "02_storyboard", "storyboard.json")))
clips = sb["clips"]
FPS = sb.get("fps", 24)
norm = lambda s: re.sub(r"[^a-z0-9 ]+", " ", s.lower().replace("’", "'").replace("'", "")).split()


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, capture_output=True, text=True, **kw)


def probe(f):
    out = run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height:format=duration", "-of", "json", f]).stdout
    j = json.loads(out)
    v = next(s for s in j["streams"] if s["codec_type"] == "video")
    has_a = any(s["codec_type"] == "audio" for s in j["streams"])
    return float(j["format"]["duration"]), v["width"], v["height"], has_a


def cropdetect(f, dur, w, h):
    out = subprocess.run(["ffmpeg", "-ss", str(max(0, dur / 2 - 1)), "-i", f, "-t", "2", "-vf", "cropdetect=limit=24:round=2", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    crops = re.findall(r"crop=(\d+):(\d+):(\d+):(\d+)", out)
    if not crops:
        return None
    cw, ch, cx, cy = map(int, Counter(crops).most_common(1)[0][0])
    # bars are symmetric-ish; round inward to a clean, centred box
    if cw >= w * 0.98 and ch >= h * 0.98:
        return None
    side = max(cx, w - cw - cx)
    top = max(cy, h - ch - cy)
    side += side % 2
    top += top % 2
    return {"w": w - 2 * side, "h": h - 2 * top, "x": side, "y": top}


def envelope(wav_path, win=0.05):
    w = wave.open(wav_path)
    n, rate = w.getnframes(), w.getframerate()
    d = struct.unpack("<%dh" % n, w.readframes(n))
    step = int(rate * win)
    out = []
    for i in range(0, n, step):
        s = d[i:i + step]
        r = math.sqrt(sum(x * x for x in s) / max(1, len(s)))
        out.append(20 * math.log10(r / 32768 + 1e-9))
    return out, win


def speech_bounds(env, win, dur, words):
    """Head: first loud window (room tone and breaths sit under peak-24 dB). Tail: Whisper's last
    word end + 0.35 s, never past the last loud window + 0.3 s, never inside the word."""
    srt = sorted(env)
    floor = srt[int(len(srt) * 0.1)]
    thr = max(floor + 12, srt[-1] - 24)
    on = [i for i, v in enumerate(env) if v > thr]
    if not on:
        return 0.0, dur
    start = max(0.0, on[0] * win - 0.12)
    end = min(dur, (on[-1] + 1) * win + 0.3)
    if words:
        last = words[-1]["end"]
        end = min(end, last + 0.35)
        end = max(end, min(dur, last + 0.1))
        # a long quiet lead-in (breath, room tone) before the first word: start 0.25 s before it.
        # Whisper smears the first word back to 0.00, so use its end - 0.3 s as the onset then.
        w0 = words[0]
        onset = w0["end"] - 0.3 if w0["start"] < 0.05 else w0["start"]
        start = max(start, onset - 0.25)
    return round(start, 2), round(end, 2)


def restore_spelling(wwords, line):
    """Map Whisper's words onto the storyboard line's words (its spelling and punctuation win)."""
    target = line.split()
    a = [" ".join(norm(w["word"])) for w in wwords]
    b = [" ".join(norm(t)) for t in target]
    out = []
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op == "equal":
            out += [{"w": target[j1 + k], "s": wwords[i1 + k]["start"], "e": wwords[i1 + k]["end"]} for k in range(i2 - i1)]
        elif op == "replace":
            s, e = wwords[i1]["start"], wwords[i2 - 1]["end"]
            n = j2 - j1
            out += [{"w": target[j1 + k], "s": s + (e - s) * k / n, "e": s + (e - s) * (k + 1) / n} for k in range(n)]
        elif op == "insert":  # storyboard word Whisper missed: squeeze it in at the gap
            t = out[-1]["e"] if out else (wwords[i1]["start"] if i1 < len(wwords) else 0)
            out += [{"w": target[j1 + k], "s": t, "e": t} for k in range(j2 - j1)]
        # delete: Whisper heard something the line doesn't have — drop it
    return out


# ---------- 1. sort files: silent b-roll by name, everything else is a speaking take ----------
BROLL_RE = re.compile(r"^(?:broll-)?(b\d{2})(?:[_\-. ]|$)", re.I)
srcs = sorted(f for f in os.listdir(os.path.join(P, "04_clips")) if f.lower().endswith(".mp4"))
if not srcs:
    sys.exit(f"no clips in projects/{slug}/04_clips")
broll_ids = {b["id"] for b in sb.get("broll", [])}
broll_files = {f: BROLL_RE.match(f).group(1).lower() for f in srcs if BROLL_RE.match(f) and BROLL_RE.match(f).group(1).lower() in broll_ids}
speak = [f for f in srcs if f not in broll_files]
over_file = os.path.join(ING, "overrides.json")
overrides = json.load(open(over_file)) if os.path.exists(over_file) else {}

def to_wav(path, stem):
    wav = os.path.join(ING, "wav", stem + ".wav")
    if force or not os.path.exists(wav):
        run(["ffmpeg", "-v", "error", "-y", "-i", path, "-ac", "1", "-ar", "16000", wav])
    return wav

def transcribe(wavs):
    if wavs:
        prompt = " ".join(c["line"] for c in clips)[:800]
        print(f"transcribing {len(wavs)} file(s) with whisper {model}…")
        run(["whisper", *wavs, "--model", model, "--language", "en", "--word_timestamps", "True", "--output_format", "json",
             "--output_dir", os.path.join(ING, "raw"), "--fp16", "False", "--initial_prompt", prompt])

def raw_words(stem):
    j = json.load(open(os.path.join(ING, "raw", stem + ".json")))
    return [w for s in j["segments"] for w in s.get("words", [])]

transcribe([to_wav(os.path.join(P, "04_clips", f), os.path.splitext(f)[0]) for f in speak
            if force or not os.path.exists(os.path.join(ING, "raw", os.path.splitext(f)[0] + ".json"))])

takes = []
for f in speak:
    stem = os.path.splitext(f)[0]
    to_wav(os.path.join(P, "04_clips", f), stem)
    words = raw_words(stem)
    text = " ".join(w["word"].strip() for w in words)
    scores = {c["id"]: difflib.SequenceMatcher(None, norm(text), norm(c["line"])).ratio() for c in clips}
    best = max(scores, key=scores.get)
    takes.append({"file": f, "stem": stem, "words": words, "text": text, "clip": best, "similarity": round(scores[best], 3)})

# ---------- 2. match: best take per clip (05_ingest/overrides.json can pin a take, a trim, or a stitch) ----------
report = {"slug": slug, "model": model, "clips": [], "broll": [], "missing": [], "unused_takes": [], "source": None}
chosen = []
for c in clips:
    ov = overrides.get(c["id"], {})
    cands = sorted((t for t in takes if t["clip"] == c["id"]), key=lambda t: -t["similarity"])
    if ov.get("take"):
        pinned = [t for t in takes if t["file"] == ov["take"]]
        if not pinned:
            sys.exit(f"overrides.json: {c['id']} take {ov['take']} not found in 04_clips")
        cands = pinned + [t for t in cands if t["file"] != ov["take"]]
    if not cands and not ov.get("stitch"):
        report["missing"].append(c["id"])
        continue
    if ov.get("stitch"):
        t = None
        src = os.path.join(P, "04_clips", ov["stitch"][0]["file"])
    else:
        t = cands[0]
        report["unused_takes"] += [{"file": o["file"], "clip": c["id"], "similarity": o["similarity"]} for o in cands[1:]]
        src = os.path.join(P, "04_clips", t["file"])
    dur, w, h, has_a = probe(src)
    chosen.append((c, t, src, dur, w, h, has_a, cropdetect(src, dur, w, h), ov))

# One crop for the whole film: generator bars are fixed per model, and a hand gesture can
# fool cropdetect on a single clip. The most common detection wins.
votes = Counter(json.dumps(x[7], sort_keys=True) for x in chosen if (x[4], x[5]) == (chosen[0][4], chosen[0][5])) if chosen else Counter()
crop = json.loads(votes.most_common(1)[0][0]) if votes else None
VF = lambda cr: (f"crop={cr['w']}:{cr['h']}:{cr['x']}:{cr['y']}," if cr else "") + f"fps={FPS}"
AF = ("highpass=f=90,afftdn=nf=-25,equalizer=f=250:t=q:w=1:g=-4,equalizer=f=3500:t=q:w=1:g=4,highshelf=f=7500:g=3,"
      "loudnorm=I=-16:TP=-1.5:LRA=7")
ENC = ["-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p"]
sizes = set()
for c, t, src, dur, w, h, has_a, _, ov in chosen:
    out = os.path.join(PUB, "clips", f"{c['id']}.mp4")
    cw, ch = (crop["w"], crop["h"]) if crop else (w, h)
    sizes.add((cw, ch))
    if ov.get("stitch"):
        # ---------- 3a. stitch sub-ranges of several takes, 2-frame audio crossfade-free hard cuts ----------
        segs = ov["stitch"]
        ins, fc = [], []
        for k, sg in enumerate(segs):
            ins += ["-ss", str(sg["in"]), "-t", str(round(sg["out"] - sg["in"], 3)), "-i", os.path.join(P, "04_clips", sg["file"])]
            fc.append(f"[{k}:v]{VF(crop)},setpts=PTS-STARTPTS[v{k}];[{k}:a]asetpts=PTS-STARTPTS[a{k}]")
        fc.append("".join(f"[v{k}][a{k}]" for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=1[v][a0];[a0]{AF}[a]")
        run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fc), "-map", "[v]", "-map", "[a]",
             "-ar", "48000", "-c:a", "aac", "-b:a", "256k", *ENC, out])
        length = round(sum(sg["out"] - sg["in"] for sg in segs), 3)
        stem = f"_stitched_{c['id']}"
        if os.path.exists(os.path.join(ING, "raw", stem + ".json")):
            os.remove(os.path.join(ING, "raw", stem + ".json"))
        wav = os.path.join(ING, "wav", stem + ".wav")
        run(["ffmpeg", "-v", "error", "-y", "-i", out, "-ac", "1", "-ar", "16000", wav])
        transcribe([wav])
        ww, start, end = raw_words(stem), 0.0, length
        take_desc, sim = " + ".join(f"{sg['file']}[{sg['in']}-{sg['out']}]" for sg in segs), None
        heard = " ".join(x["word"].strip() for x in ww)
    else:
        # ---------- 3b. trim, crop, clean one take ----------
        env, win = envelope(os.path.join(ING, "wav", t["stem"] + ".wav"))
        start, end = speech_bounds(env, win, dur, t["words"])
        if ov.get("trim"):
            start, end = ov["trim"].get("start", start), ov["trim"].get("end", end)
        length = round(end - start, 3)
        af = f"{AF},afade=t=in:d=0.03,afade=t=out:st={max(0, length - 0.06):.3f}:d=0.06"
        cmd = ["ffmpeg", "-v", "error", "-y", "-ss", str(start), "-t", str(length), "-i", src, "-vf", VF(crop)]
        cmd += (["-af", af, "-ar", "48000", "-c:a", "aac", "-b:a", "256k"] if has_a else ["-an"])
        run(cmd + ENC + [out])
        ww = [dict(x, start=max(0.0, x["start"] - start), end=max(0.0, x["end"] - start)) for x in t["words"]]
        take_desc, sim, heard = t["file"], t["similarity"], t["text"]

    # ---------- 4. words, relative to the output clip, storyboard spelling ----------
    words = restore_spelling(ww, c["line"])
    if words:  # Whisper smears the first word back to 0.00
        words[0]["s"] = max(words[0]["s"], words[0]["e"] - 0.3)
    words = [{"w": x["w"], "s": round(x["s"], 2), "e": round(x["e"], 2)} for x in words]
    json.dump({"clip": c["id"], "duration_s": length, "words": words}, open(os.path.join(ING, "words", f"{c['id']}.json"), "w"), indent=1)
    if sim is None:
        sim = round(difflib.SequenceMatcher(None, norm(heard), norm(c["line"])).ratio(), 3)
    report["clips"].append({
        "id": c["id"], "take": take_desc, "similarity": sim, "heard": heard, "override": ov or None,
        "trim": {"start": start, "end": end}, "duration_s": length, "crop": crop, "audio": has_a,
        "src": f"projects/{slug}/clips/{c['id']}.mp4",
    })
    flag = "" if sim >= 0.8 else "   <- check: the take may not say the storyboard line"
    print(f"  {c['id']} <- {take_desc}  sim {sim:.2f}  trim {start:.2f}-{end:.2f}s  {length:.2f}s{' (override)' if ov else ''}{flag}")

print(f"  crop: {crop}")
if len(sizes) > 1:
    print(f"  ! clips have different picture sizes: {sorted(sizes)} - the host framing assumes one size")
if sizes:
    report["source"] = dict(zip(("w", "h"), max(sizes)))

# ---------- 3c. silent b-roll: own crop, no audio, whole clip unless overridden ----------
for f, bid in sorted(broll_files.items(), key=lambda x: x[1]):
    if any(b["id"] == bid for b in report["broll"]):
        print(f"  i {f}: another take of {bid} already used — rename or delete extras")
        continue
    src = os.path.join(P, "04_clips", f)
    dur, w, h, _ = probe(src)
    bc = cropdetect(src, dur, w, h)
    ov = overrides.get(bid, {})
    start, end = ov.get("trim", {}).get("start", 0.0), ov.get("trim", {}).get("end", round(dur * 0.88, 2))  # generated motion decays in the last ~12 %
    run(["ffmpeg", "-v", "error", "-y", "-ss", str(start), "-t", str(round(end - start, 3)), "-i", src, "-vf", VF(bc), "-an", *ENC,
         os.path.join(PUB, "clips", f"{bid}.mp4")])
    report["broll"].append({"id": bid, "take": f, "duration_s": round(end - start, 3), "crop": bc,
                            "size": {"w": bc["w"] if bc else w, "h": bc["h"] if bc else h}, "src": f"projects/{slug}/clips/{bid}.mp4"})
    print(f"  {bid} <- {f}  silent b-roll  {start:.2f}-{end:.2f}s")
for b in sb.get("broll", []):
    if not any(x["id"] == b["id"] for x in report["broll"]):
        report["missing"].append(b["id"])

# ---------- 5. assets ----------
brand = os.path.join(P, "01_vision", "brand")
if os.path.isdir(brand):
    os.makedirs(os.path.join(PUB, "brand"), exist_ok=True)
    for f in os.listdir(brand):
        shutil.copy2(os.path.join(brand, f), os.path.join(PUB, "brand", f))
for f in os.listdir(os.path.join(P, "00_script")):
    if f.startswith("music."):
        shutil.copy2(os.path.join(P, "00_script", f), os.path.join(PUB, f))

json.dump(report, open(os.path.join(ING, "ingest.json"), "w"), indent=1)
for m in report["missing"]:
    print(f"  ✗ {m}: no take found in 04_clips" + (" (b-roll files must be named broll-" + m + "….mp4)" if m.startswith("b") else ""))
for u in report["unused_takes"]:
    print(f"  i {u['file']} is a weaker take of {u['clip']} (sim {u['similarity']:.2f}) — unused")
print(f"→ 05_ingest/ingest.json · {len(report['clips'])}/{len(clips)} clips, {len(report['broll'])}/{len(sb.get('broll', []))} b-roll")
sys.exit(1 if report["missing"] else 0)
