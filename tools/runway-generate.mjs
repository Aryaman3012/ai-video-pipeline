#!/usr/bin/env node
// Generate clips through the Runway API for projects whose generator is `runway`.
// usage: RUNWAYML_API_SECRET=… node tools/runway-generate.mjs <slug> [prompt-id …] [--dry-run]
//   prompt-id: e.g. clip-03, broll-b01 (default: every 03_prompts/*.prompt.json whose latest take
//   has no clip on disk yet). Writes each result to the take's output_path and stamps generated_at.
//
// Image-to-video only (the first frame is the cast still / keyframe, as every take in this
// pipeline uses). Model and ratio come from templates/prompts/generators.json → runway
// (`api_model`, default gen4_turbo). API: https://docs.dev.runwayml.com — re-check the model
// ids and ratios there when Runway ships a new model. NOT exercised against the live API in this
// repo yet: run one clip with --dry-run first, then one for real, and check the output.
import fs from "node:fs";
import path from "node:path";
import { ROOT, projectGenerator } from "./lib/prompts.mjs";

const argv = process.argv.slice(2);
const slug = argv[0];
const dry = argv.includes("--dry-run");
const only = argv.slice(1).filter((a) => !a.startsWith("--"));
if (!slug) { console.error("usage: node tools/runway-generate.mjs <slug> [prompt-id …] [--dry-run]"); process.exit(2); }
const P = path.join(ROOT, "projects", slug);
const read = (f) => JSON.parse(fs.readFileSync(path.join(P, f), "utf8"));
const gen = projectGenerator(read("state.json"), read("01_vision/vision-board.json"));
if (gen.name !== "runway") { console.error(`generator is ${gen.name}: paste 03_prompts/*.prompt.md into it by hand`); process.exit(1); }
const key = process.env.RUNWAYML_API_SECRET;
if (!key && !dry) { console.error("set RUNWAYML_API_SECRET (Runway developer portal → API keys)"); process.exit(1); }

const API = "https://api.dev.runwayml.com/v1";
const HEAD = { Authorization: `Bearer ${key}`, "X-Runway-Version": "2024-11-06", "Content-Type": "application/json" };
const model = gen.profile.api_model ?? "gen4_turbo";
const RATIO = { "16:9": "1280:720", "9:16": "720:1280", "1:1": "960:960", "4:3": "1104:832", "3:4": "832:1104", "21:9": "1584:672" };
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

const files = fs.readdirSync(path.join(P, "03_prompts")).filter((f) => f.endsWith(".prompt.json"));
const jobs = [];
for (const f of files) {
  const id = f.replace(/\.prompt\.json$/, "");
  if (only.length && !only.includes(id)) continue;
  const p = read(`03_prompts/${f}`);
  const take = p.takes[p.takes.length - 1];
  if (!only.length && fs.existsSync(path.join(P, take.output_path))) continue;
  jobs.push({ f, id, p, take });
}
if (!jobs.length) { console.log("nothing to generate"); process.exit(0); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failed = 0;
for (const { f, id, p, take } of jobs) {
  if (take.mode !== "image_to_video" || !take.keyframe) { console.log(`✗ ${id}: needs an image_to_video take with a keyframe`); failed++; continue; }
  const img = path.join(P, take.keyframe);
  if (!fs.existsSync(img)) { console.log(`✗ ${id}: first frame ${take.keyframe} not found`); failed++; continue; }
  const duration = take.duration_s <= 5 ? 5 : 10;
  const body = {
    model,
    promptImage: `data:${MIME[path.extname(img).toLowerCase()] ?? "image/png"};base64,${fs.readFileSync(img).toString("base64")}`,
    promptText: take.prompt.slice(0, gen.profile.prompt_max_chars ?? 1000),
    ratio: RATIO[take.aspect_ratio] ?? "1280:720",
    duration,
    ...(take.seed != null ? { seed: take.seed } : {}),
  };
  console.log(`→ ${id} · ${model} · ${body.ratio} · ${duration}s${dry ? " (dry run)" : ""}`);
  if (dry) { console.log(`  prompt: ${body.promptText.slice(0, 160)}…`); continue; }
  try {
    const r = await fetch(`${API}/image_to_video`, { method: "POST", headers: HEAD, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
    const { id: task } = await r.json();
    let t;
    for (;;) {
      await sleep(6000);
      t = await (await fetch(`${API}/tasks/${task}`, { headers: HEAD })).json();
      if (["SUCCEEDED", "FAILED", "CANCELLED"].includes(t.status)) break;
      process.stdout.write(".");
    }
    if (t.status !== "SUCCEEDED") throw new Error(`task ${t.status}: ${t.failure ?? ""}`);
    const out = path.join(P, take.output_path);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, Buffer.from(await (await fetch(t.output[0])).arrayBuffer()));
    take.generated_at = new Date().toISOString();
    take.api_task = task;
    fs.writeFileSync(path.join(P, `03_prompts/${f}`), JSON.stringify(p, null, 2) + "\n");
    console.log(`\n  ✓ ${take.output_path}`);
  } catch (e) { console.log(`\n  ✗ ${id}: ${e.message}`); failed++; }
}
process.exit(failed ? 1 : 0);
