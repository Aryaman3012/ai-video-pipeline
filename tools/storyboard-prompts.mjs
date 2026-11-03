#!/usr/bin/env node
// Render every storyboard clip's prompt from its view template for the project's generator.
// usage: node tools/storyboard-prompts.mjs <slug>
// Reads 02_storyboard/storyboard.json (clips[].view + clips[].prompt = the template's slots) and
// 01_vision/vision-board.json (cast/location descriptors, generator). Writes
// 03_prompts/clip-NN.prompt.json and the copy-paste 03_prompts/clip-NN.prompt.md. Never generates.
import fs from "node:fs";
import path from "node:path";
import { ROOT, projectGenerator, renderPrompt, promptMarkdown } from "./lib/prompts.mjs";

const slug = process.argv[2];
if (!slug) { console.error("usage: node tools/storyboard-prompts.mjs <slug>"); process.exit(2); }
const P = path.join(ROOT, "projects", slug);
const read = (f) => JSON.parse(fs.readFileSync(path.join(P, f), "utf8"));
const state = read("state.json");
const vision = read("01_vision/vision-board.json");
const sb = read("02_storyboard/storyboard.json");
const gen = projectGenerator(state, vision);
const aspect = vision.format?.aspect_ratio ?? "16:9";
const duration_s = gen.profile.duration_s.max;
fs.mkdirSync(path.join(P, "03_prompts"), { recursive: true });

let bad = 0;
const index = [];
for (const c of sb.clips) {
  const id = `clip-${c.id}`;
  const slots = c.prompt ?? {};
  // the spoken text in the slots must be the storyboard line, word for word
  const said = (slots.line ?? []).filter((l) => l.say).map((l) => l.say).join(" ").replace(/\s+/g, " ").trim();
  if (said && said !== c.line.trim()) { bad++; console.log(`✗ ${id}: prompt line ≠ storyboard line\n    line:   ${c.line}\n    prompt: ${said}`); continue; }
  let out;
  try { out = renderPrompt({ view: c.view, generator: gen, slots, vision, duration_s, aspect }); }
  catch (e) { bad++; console.log(`✗ ${id}: ${e.message}`); continue; }
  const take = {
    take: 1, slots, duration_s, aspect_ratio: aspect, fps: sb.fps ?? 24, seed: null, prompt_delta_applied: null, generated_at: null,
    model: gen.model, mode: out.mode, prompt: out.text, keyframe: out.keyframe, output_path: `04_clips/${id}_take-01.mp4`,
  };
  const p = {
    scene_id: id, intent: `${c.section ?? ""}${c.section ? ": " : ""}${c.line}`, view: c.view, generator: gen.name,
    continuity_inputs: out.keyframe ? [out.keyframe] : [],
    acceptance_criteria: [
      "Same person, wardrobe and set as the first frame",
      "Every word is spoken, in order, lip-synced",
      "Locked-off camera, framing as the template states; nothing new enters the shot",
      "Silent head and tail: mouth closed and relaxed",
    ],
    takes: [take],
  };
  fs.writeFileSync(path.join(P, `03_prompts/${id}.prompt.json`), JSON.stringify(p, null, 2) + "\n");
  fs.writeFileSync(path.join(P, `03_prompts/${id}.prompt.md`), promptMarkdown({ p, take, generator: gen }));
  index.push(`## ${c.id} · ${c.section ?? ""}\n\n> ${c.line}\n\n\`\`\`text\n${out.text}\n\`\`\`\n`);
  console.log(`✓ ${id} · ${c.view} · ${out.mode}${out.warnings.length ? `  (${out.warnings.join("; ")})` : ""}`);
}
// First-frame stills (image prompts) — made before any clip
const pre = [];
for (const k of sb.keyframes ?? []) {
  try {
    const r = renderPrompt({ view: k.view ?? "keyframe-still", generator: gen, slots: k.prompt ?? {}, vision, duration_s, aspect });
    pre.push(`## Still ${k.id} → save as \`${k.output}\`\n\n\`\`\`text\n${r.text}\n\`\`\`\n`);
    console.log(`✓ still ${k.id} · ${k.view ?? "keyframe-still"}`);
  } catch (e) { bad++; console.log(`✗ still ${k.id}: ${e.message}`); }
}
// Silent generated b-roll — used under/beside the host by the built-in Footage scene
const broll = [];
for (const b of sb.broll ?? []) {
  const id = `broll-${b.id}`;
  let out;
  try { out = renderPrompt({ view: b.view, generator: gen, slots: b.prompt ?? {}, vision, duration_s, aspect }); }
  catch (e) { bad++; console.log(`✗ ${id}: ${e.message}`); continue; }
  const take = { take: 1, slots: b.prompt ?? {}, duration_s, aspect_ratio: aspect, fps: sb.fps ?? 24, seed: null, prompt_delta_applied: null, generated_at: null,
    model: gen.model, mode: out.mode, prompt: out.text, keyframe: out.keyframe, output_path: `04_clips/${id}_take-01.mp4` };
  const p = { scene_id: id, intent: b.purpose ?? "Silent b-roll", view: b.view, generator: gen.name, continuity_inputs: out.keyframe ? [out.keyframe] : [],
    acceptance_criteria: ["Matches the purpose and the vision board's look", "Readable text, logos and UI absent", "Usable motion through at least 5 s"], takes: [take] };
  fs.writeFileSync(path.join(P, `03_prompts/${id}.prompt.json`), JSON.stringify(p, null, 2) + "\n");
  fs.writeFileSync(path.join(P, `03_prompts/${id}.prompt.md`), promptMarkdown({ p, take, generator: gen }));
  broll.push(`## ${b.id} · silent b-roll — save as \`04_clips/${id}….mp4\`\n\n> ${b.purpose ?? ""}\n\n\`\`\`text\n${out.text}\n\`\`\`\n`);
  console.log(`✓ ${id} · ${b.view} · ${out.mode}`);
}
fs.writeFileSync(path.join(P, "03_prompts/ALL-PROMPTS.md"),
  `# ${slug} — prompts (${gen.model})\n\n` +
  (pre.length ? `# 1. First-frame stills (make these first)\n\n${pre.join("\n")}\n# 2. Speaking clips\n\n` : "") +
  `First frame for every clip: the cast still in \`01_vision/refs/\`. Save clips into \`04_clips/\` (any name).\n\n${index.join("\n")}` +
  (broll.length ? `\n# ${pre.length ? 3 : 2}. Silent b-roll\n\nName each file \`broll-bNN…\` so ingest can find it.\n\n${broll.join("\n")}` : ""));
console.log(`→ 03_prompts/ALL-PROMPTS.md`);
process.exit(bad ? 1 : 0);
