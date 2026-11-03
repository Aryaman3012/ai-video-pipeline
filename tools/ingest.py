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
    srt = sorted(env)
    floor = srt[int(len(srt) * 0.1)]
    peak = srt[-1]
    thr = max(floor + 12, peak - 32)
    on = [i for i, v in enumerate(env) if v > thr]
    if not on:
        return 0.0, dur
    start = max(0.0, on[0] * win - 0.15)
    end = min(dur, (on[-1] + 1) * win + 0.3)
    if words:  # never cut inside a transcribed word
        end = max(end, min(dur, words[-1]["end"] + 0.15))
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


# ---------- 1. transcribe ----------
srcs = sorted(f for f in os.listdir(os.path.join(P, "04_clips")) if f.lower().endswith(".mp4"))
if not srcs:
    sys.exit(f"no clips in projects/{slug}/04_clips")
todo = []
for f in srcs:
    stem = os.path.splitext(f)[0]
    wav = os.path.join(ING, "wav", stem + ".wav")
    if force or not os.path.exists(wav):
        run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(P, "04_clips", f), "-ac", "1", "-ar", "16000", wav])
    if force or not os.path.exists(os.path.join(ING, "raw", stem + ".json")):
        todo.append(wav)
if todo:
    prompt = " ".join(c["line"] for c in clips)[:800]
    print(f"transcribing {len(todo)} clip(s) with whisper {model}…")
    run(["whisper", *todo, "--model", model, "--language", "en", "--word_timestamps", "True", "--output_format", "json",
         "--output_dir", os.path.join(ING, "raw"), "--fp16", "False", "--initial_prompt", prompt])

takes = []
for f in srcs:
    stem = os.path.splitext(f)[0]
    j = json.load(open(os.path.join(ING, "raw", stem + ".json")))
    words = [w for s in j["segments"] for w in s.get("words", [])]
    text = " ".join(w["word"].strip() for w in words)
    scores = {c["id"]: difflib.SequenceMatcher(None, norm(text), norm(c["line"])).ratio() for c in clips}
    best = max(scores, key=scores.get)
    takes.append({"file": f, "stem": stem, "words": words, "text": text, "clip": best, "similarity": round(scores[best], 3)})

# ---------- 2. match: best take per clip ----------
report = {"slug": slug, "model": model, "clips": [], "missing": [], "unused_takes": [], "source": None}
chosen = []
for c in clips:
    cands = sorted((t for t in takes if t["clip"] == c["id"]), key=lambda t: -t["similarity"])
    if not cands:
        report["missing"].append(c["id"])
        continue
    t = cands[0]
    report["unused_takes"] += [{"file": o["file"], "clip": c["id"], "similarity": o["similarity"]} for o in cands[1:]]
    src = os.path.join(P, "04_clips", t["file"])
    dur, w, h, has_a = probe(src)
    chosen.append((c, t, src, dur, w, h, has_a, cropdetect(src, dur, w, h)))

# One crop for the whole film: generator bars are fixed per model, and a hand gesture can
# fool cropdetect on a single clip. The most common detection wins.
votes = Counter(json.dumps(x[7], sort_keys=True) for x in chosen if (x[4], x[5]) == (chosen[0][4], chosen[0][5]))
crop = json.loads(votes.most_common(1)[0][0]) if votes else None
sizes = set()
for c, t, src, dur, w, h, has_a, _ in chosen:
    env, win = envelope(os.path.join(ING, "wav", t["stem"] + ".wav"))
    start, end = speech_bounds(env, win, dur, t["words"])
    length = round(end - start, 3)
    cw, ch = (crop["w"], crop["h"]) if crop else (w, h)
    sizes.add((cw, ch))

    # ---------- 3. trim, crop, clean ----------
    out = os.path.join(PUB, "clips", f"{c['id']}.mp4")
    vf = (f"crop={crop['w']}:{crop['h']}:{crop['x']}:{crop['y']}," if crop else "") + f"fps={FPS}"
    af = (f"highpass=f=90,afftdn=nf=-25,equalizer=f=250:t=q:w=1:g=-4,equalizer=f=3500:t=q:w=1:g=4,highshelf=f=7500:g=3,"
          f"loudnorm=I=-16:TP=-1.5:LRA=7,afade=t=in:d=0.03,afade=t=out:st={max(0, length - 0.06):.3f}:d=0.06")
    cmd = ["ffmpeg", "-v", "error", "-y", "-ss", str(start), "-t", str(length), "-i", src, "-vf", vf]
    cmd += (["-af", af, "-ar", "48000", "-c:a", "aac", "-b:a", "256k"] if has_a else ["-an"])
    cmd += ["-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", out]
    run(cmd)

    # ---------- 4. words, relative to the trimmed clip, storyboard spelling ----------
    ww = [dict(w, start=max(0.0, w["start"] - start), end=max(0.0, w["end"] - start)) for w in t["words"]]
    words = restore_spelling(ww, c["line"])
    if words:  # Whisper smears the first word back to 0.00
        words[0]["s"] = max(words[0]["s"], words[0]["e"] - 0.3)
    words = [{"w": w["w"], "s": round(w["s"], 2), "e": round(w["e"], 2)} for w in words]
    json.dump({"clip": c["id"], "duration_s": length, "words": words}, open(os.path.join(ING, "words", f"{c['id']}.json"), "w"), indent=1)

    report["clips"].append({
        "id": c["id"], "take": t["file"], "similarity": t["similarity"], "heard": t["text"],
        "trim": {"start": start, "end": end}, "duration_s": length, "crop": crop, "audio": has_a,
        "src": f"projects/{slug}/clips/{c['id']}.mp4",
    })
    flag = "" if t["similarity"] >= 0.8 else "   <- check: the take may not say the storyboard line"
    print(f"  {c['id']} <- {t['file']}  sim {t['similarity']:.2f}  trim {start:.2f}-{end:.2f}s  {length:.2f}s{flag}")

print(f"  crop: {crop}")
if len(sizes) > 1:
    print(f"  ! clips have different picture sizes: {sorted(sizes)} - the host framing assumes one size")
if sizes:
    report["source"] = dict(zip(("w", "h"), max(sizes)))

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
    print(f"  ✗ {m}: no take found in 04_clips")
for u in report["unused_takes"]:
    print(f"  i {u['file']} is a weaker take of {u['clip']} (sim {u['similarity']:.2f}) — unused")
print(f"→ 05_ingest/ingest.json · {len(report['clips'])}/{len(clips)} clips ingested")
sys.exit(1 if report["missing"] else 0)
