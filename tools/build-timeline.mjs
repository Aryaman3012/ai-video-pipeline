#!/usr/bin/env node
// Storyboard + ingest → 06_edit/timeline.json, the Explainer composition's props.
// usage: node tools/build-timeline.mjs <slug>
// Every time in the storyboard is a reference to a spoken word; this resolves them against
// the measured words of the ingested clip, so regenerating a clip moves its graphics with it.
//   cue ref:  2.4          seconds
//             "multiply"   first "multiply" in the clip      "leads#2"  second "leads"
//             "deal-0.6"   0.6 s before "deal"               "@end-0.5" 0.5 s before the clip ends
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2];
if (!slug) { console.error("usage: node tools/build-timeline.mjs <slug>"); process.exit(2); }
const P = path.join(ROOT, "projects", slug);
const read = (f) => JSON.parse(fs.readFileSync(path.join(P, f), "utf8"));
const sb = read("02_storyboard/storyboard.json");
const ing = read("05_ingest/ingest.json");
const norm = (w) => w.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "");

let errors = 0;
const fail = (m) => { errors++; console.log(`  ✗ ${m}`); };

const REF = /^(@start|@end|.+?)(?:#(\d+))?([+-]\d*\.?\d+)?$/;
function resolve(ref, words, dur, where) {
  if (typeof ref === "number") return ref;
  const m = String(ref).trim().match(REF);
  if (!m) { fail(`${where}: bad cue "${ref}"`); return 0; }
  const [, key, nth, off] = m;
  let t;
  if (key === "@start") t = 0;
  else if (key === "@end") t = dur;
  else {
    const hits = words.filter((w) => norm(w.w) === norm(key));
    const n = nth ? Number(nth) : 1;
    if (hits.length < n) {
      fail(`${where}: "${key}"${nth ? `#${nth}` : ""} is not spoken in this clip — heard: ${words.map((w) => w.w).join(" ")}`);
      return 0;
    }
    t = hits[n - 1].s;
  }
  return Math.round(Math.min(dur, Math.max(0, t + (off ? Number(off) : 0))) * 100) / 100;
}

const emph = sb.captions?.emphasis ?? {};
const tag = (w) => {
  const n = norm(w);
  if ((emph.pos ?? []).some((x) => norm(x) === n)) return "pos";
  if ((emph.neg ?? []).some((x) => norm(x) === n)) return "neg";
  return undefined;
};
const chunk = (words) => {
  const chunks = [];
  let cur = [];
  for (const w of words) {
    const k = tag(w.w);
    cur.push(k ? { ...w, k } : { ...w });
    if (cur.length >= 4 || (/[,.?!]$/.test(w.w) && cur.length >= 2)) { chunks.push(cur); cur = []; }
  }
  if (cur.length) cur.length === 1 && chunks.length ? chunks[chunks.length - 1].push(...cur) : chunks.push(cur);
  return chunks;
};

const timelineFraming = () => ({ face_x: 0.5, face_y: 0.28, body_y: 0.4, ...(sb.framing ?? {}) });
const beats = [];
for (const c of sb.clips) {
  const got = ing.clips.find((x) => x.id === c.id);
  if (!got) { fail(`${c.id}: not ingested (run tools/ingest.py ${slug})`); continue; }
  const { words, duration_s: dur } = read(`05_ingest/words/${c.id}.json`);
  const e = c.edit ?? {};
  const host = (e.host ?? [["@start", "full"]]).map(([r, mode], i) => [resolve(r, words, dur, `${c.id} host[${i}]`), mode]);
  const scenes = (e.scenes ?? []).map((s) => {
    let props = s.props;
    if (s.name === "Footage") { // built-in: silent generated b-roll, referenced by its storyboard id
      const b = (ing.broll ?? []).find((x) => x.id === s.props?.clip);
      if (!b) fail(`${c.id} Footage: b-roll "${s.props?.clip}" not ingested`);
      else props = { ...s.props, src: b.src, size: b.size, duration_s: b.duration_s };
    }
    return { name: s.name, layer: s.layer, ...(props ? { props } : {}), cues: resolveCues(s) };
  });
  function resolveCues(s) {
    return Object.fromEntries(Object.entries(s.cues ?? {}).map(([k, r]) => [k, resolve(r, words, dur, `${c.id} ${s.name}.${k}`)]));
  }
  beats.push({
    id: c.id,
    src: got.src,
    dur,
    host,
    ...(e.from ? { from: e.from } : {}),
    ...(e.push ? { push: e.push } : {}),
    ...(e.framing ? { framing: { ...timelineFraming(), ...e.framing } } : {}),
    grade: e.grade ?? "neutral",
    ...(e.captions === false ? {} : { captions: chunk(words) }),
    scenes,
  });
}

const prevFile = path.join(P, "06_edit/timeline.json");
const prev = fs.existsSync(prevFile) ? JSON.parse(fs.readFileSync(prevFile, "utf8")) : null;
const pub = (f) => (f ? `projects/${slug}/${f}` : undefined);
const music = fs.readdirSync(path.join(P, "00_script")).find((f) => f.startsWith("music."));
const timeline = {
  slug,
  version: 0,
  fps: sb.fps ?? 24,
  source: ing.source,
  framing: { face_x: 0.5, face_y: 0.28, body_y: 0.4, ...(sb.framing ?? {}) },
  ...(sb.palette ? { palette: sb.palette } : {}),
  brand: { name: sb.brand?.name ?? "", logo_light: pub(sb.brand?.logo_light && `brand/${sb.brand.logo_light}`), logo_dark: pub(sb.brand?.logo_dark && `brand/${sb.brand.logo_dark}`) },
  ...(sb.end_card ? { end_card: sb.end_card } : {}),
  ...(music ? { music: { src: pub(music), volume: sb.music_volume ?? 0.1 } } : {}),
  captions: { landscape: sb.captions?.landscape ?? true, vertical: sb.captions?.vertical ?? true },
  beats,
};
const same = prev && JSON.stringify({ ...prev, version: 0 }) === JSON.stringify(timeline);
timeline.version = same ? prev.version : (prev?.version ?? 0) + 1;

if (errors) { console.log(`\n${errors} error(s) — timeline not written`); process.exit(1); }
fs.mkdirSync(path.dirname(prevFile), { recursive: true });
fs.writeFileSync(prevFile, JSON.stringify(timeline, null, 1) + "\n");
const fps = timeline.fps;
const talk = beats.reduce((a, b) => a + Math.floor(b.dur * fps), 0) / fps;
console.log(`→ 06_edit/timeline.json v${timeline.version}${same ? " (unchanged)" : ""} · ${beats.length} beats · ${talk.toFixed(1)} s + ${sb.end_card?.seconds ?? 0} s end card`);
