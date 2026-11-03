#!/usr/bin/env node
// Render a scene's prompt from its view template + slots, for the project's generator.
// usage: node tools/render-prompt.mjs <slug> <scene-id> [--take N]
// Reads 03_prompts/<scene>.prompt.json (view + takes[].slots), fills the template from
// templates/prompts/, writes takes[N].prompt/mode/keyframe back, and writes the
// copy-paste-ready 03_prompts/<scene>.prompt.md. Never generates anything.
import fs from "node:fs";
import path from "node:path";
import { ROOT, projectGenerator, renderPrompt, promptMarkdown, sceneSlots } from "./lib/prompts.mjs";

const [slug, sceneId, ...rest] = process.argv.slice(2);
if (!slug || !sceneId) { console.error("usage: node tools/render-prompt.mjs <slug> <scene-id> [--take N]"); process.exit(2); }
const P = path.join(ROOT, "projects", slug);
const read = (f) => JSON.parse(fs.readFileSync(path.join(P, f), "utf8"));
const opt = (k) => { const i = rest.indexOf(k); return i >= 0 ? rest[i + 1] : undefined; };

const state = read("state.json");
const vision = read("01_vision/vision-board.json");
const bd = fs.existsSync(path.join(P, "02_breakdown/breakdown.json")) ? read("02_breakdown/breakdown.json") : null;
const pf = `03_prompts/${sceneId}.prompt.json`;
const p = read(pf);
const gen = projectGenerator(state, vision);
const scene = bd?.scenes.find((s) => s.id === sceneId);
const view = p.view ?? scene?.view;
if (!view) { console.error(`${sceneId}: no view on the prompt or the breakdown scene`); process.exit(1); }
if (scene?.view && p.view && scene.view !== p.view) { console.error(`${sceneId}: prompt view ${p.view} ≠ breakdown view ${scene.view}`); process.exit(1); }

const n = opt("--take") ? Number(opt("--take")) : Math.max(...p.takes.map((t) => t.take));
const take = p.takes.find((t) => t.take === n);
if (!take) { console.error(`${pf}: no take ${n}`); process.exit(1); }
const aspect = take.aspect_ratio ?? vision.format.aspect_ratio;
const duration_s = take.duration_s ?? gen.profile.duration_s.max;
const slots = sceneSlots(scene, take.slots);

let out;
try { out = renderPrompt({ view, generator: gen, slots, vision, duration_s, aspect }); }
catch (e) { console.error(`✗ ${sceneId} take ${n}: ${e.message}`); process.exit(1); }

Object.assign(take, {
  model: take.model ?? gen.model,
  mode: out.mode,
  prompt: out.text,
  keyframe: out.keyframe,
  duration_s,
  aspect_ratio: aspect,
  output_path: take.output_path ?? `04_clips/${sceneId}_take-${String(n).padStart(2, "0")}.mp4`,
});
p.view = view;
p.generator = gen.name;

// Optional first-frame still to generate before the clip
let kf = null;
if (p.keyframe_prompt) {
  const k = p.keyframe_prompt;
  try {
    const r = renderPrompt({ view: k.view ?? "keyframe-still", generator: gen, slots: { cast: slots.cast, location: slots.location, ...k.slots }, vision, duration_s, aspect });
    k.prompt = r.text;
    out.warnings.push(...r.warnings.map((w) => `keyframe: ${w}`));
    kf = k;
  } catch (e) { console.error(`✗ ${sceneId} keyframe: ${e.message}`); process.exit(1); }
}

fs.writeFileSync(path.join(P, pf), JSON.stringify(p, null, 2) + "\n");
fs.writeFileSync(path.join(P, `03_prompts/${sceneId}.prompt.md`), promptMarkdown({ p, take, generator: gen, keyframePrompt: kf }));

console.log(`${sceneId} take ${n} · ${view} · ${gen.model} (${gen.name}) · ${take.mode} · ${duration_s}s ${aspect}`);
for (const w of out.warnings) console.log(`  ! ${w}`);
if (kf) console.log(`\n--- first-frame still → ${kf.output_path}\n${kf.prompt}`);
console.log(`\n--- prompt\n${take.prompt}\n\n→ save the clip to projects/${slug}/${take.output_path}`);
