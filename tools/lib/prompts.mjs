// Generator profiles + per-view prompt templates (templates/prompts/).
// A template is fixed blocks with {{slots}}; each block has one fence per rendering
// (```veo / ```runway / ```any). The project's generator profile picks the rendering.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const TPL = path.join(ROOT, "templates/prompts");

// Runway only follows positive instructions. Words inside double quotes (dialogue) are exempt.
export const NEGATIVE_RE = /\b([Nn]o|[Nn]ot|[Ww]ithout|[Aa]void|[Dd]on't|[Nn]ever)\b(?=(?:[^"]*"[^"]*")*[^"]*$)/;

export const PROFILES = JSON.parse(fs.readFileSync(path.join(TPL, "generators.json"), "utf8"));
const AVOID_POSITIVE = JSON.parse(fs.readFileSync(path.join(TPL, "avoid-positive.json"), "utf8")).map;

/** Resolve a project's generator from state.json format → vision board format → runway. */
export function projectGenerator(state, vision) {
  const g = state?.format?.generator ?? vision?.format?.generator ?? { name: "runway" };
  const base = PROFILES[g.name];
  if (!base) throw new Error(`unknown generator "${g.name}" (expected ${Object.keys(PROFILES).filter((k) => !k.startsWith("$")).join("|")})`);
  const { name, model, ...overrides } = g;
  return { name, model: model ?? base.default_model, profile: { ...base, ...overrides } };
}

export const AUDIO_MODES = ["dialogue", "voiceover", "none"];

/**
 * The project's audio answer (format.audio, asked when the video is created) against the
 * generator and a scene's view. dialogue = the clips speak the lines; voiceover = a separate
 * VO track over the clips; none = no voice at all (music / SFX / ambience only).
 */
export function audioIssues({ audio, generator, view }) {
  const errors = [], warnings = [];
  if (audio == null) return { errors, warnings };
  if (!AUDIO_MODES.includes(audio)) errors.push(`format.audio "${audio}" — expected ${AUDIO_MODES.join(" | ")}`);
  // Project-level check: only when no view is given, so it is reported once, not per scene.
  if (!view && audio === "dialogue" && !generator.profile.dialogue)
    errors.push(`format.audio is dialogue but ${generator.name} doesn't generate speech — choose voiceover (VO track + lip-sync) or a generator that speaks`);
  const speaks = view ? loadTemplate(view).meta.speaks : false;
  if (speaks && audio === "none") errors.push(`${view} is a speaking view, but this video has no voice (format.audio: none) — use a broll-silent view`);
  if (speaks && audio === "voiceover") warnings.push(`${view} under a separate VO: the clip's own sound is discarded and the mouth must be lip-synced to the VO track`);
  return { errors, warnings };
}

export const VIEWS = fs.readdirSync(TPL).filter((f) => f.endsWith(".md") && f !== "README.md").map((f) => f.slice(0, -3));

const cache = new Map();
/** Parse templates/prompts/<view>.md (following `extends`). */
export function loadTemplate(view) {
  if (cache.has(view)) return cache.get(view);
  const file = path.join(TPL, `${view}.md`);
  if (!fs.existsSync(file)) throw new Error(`no template for view "${view}" (have: ${VIEWS.join(", ")})`);
  const src = fs.readFileSync(file, "utf8");
  const m = src.match(/```json meta\n([\s\S]*?)```/);
  if (!m) throw new Error(`${view}.md: missing \`\`\`json meta block`);
  const meta = JSON.parse(m[1]);
  const blocks = {};
  const body = src.split(/^## Blocks\s*$/m)[1] ?? "";
  for (const sec of body.split(/^### /m).slice(1)) {
    const id = sec.match(/^(\w+)/)[1];
    blocks[id] = {};
    for (const f of sec.matchAll(/```(veo|runway|any)[ \t]*\n([\s\S]*?)```/g)) blocks[id][f[1]] = f[2].replace(/\n$/, "");
  }
  let t = { view, meta, blocks };
  if (meta.extends) {
    const p = loadTemplate(meta.extends);
    t = {
      view,
      meta: { ...p.meta, ...meta, defaults: { ...p.meta.defaults, ...meta.defaults }, layout: { ...p.meta.layout, ...meta.layout } },
      blocks: { ...p.blocks, ...blocks },
    };
  }
  cache.set(view, t);
  return t;
}

/** A take's slots with the scene's first CHAR_ / LOC_ cast keys as defaults. */
export function sceneSlots(scene, slots = {}) {
  const cast = scene?.cast ?? [];
  const d = {};
  const ch = cast.find((k) => k.startsWith("CHAR_")), lo = cast.find((k) => k.startsWith("LOC_"));
  if (ch) d.cast = ch;
  if (lo) d.location = lo;
  return { ...d, ...slots };
}

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const isEmpty = (v) => v == null || (typeof v === "string" && v.trim() === "");
const fmt = (n) => Number(n).toFixed(1);
const PRONOUNS = { he: ["he", "his", "him"], she: ["she", "her", "her"], they: ["they", "their", "them"] };

function fill(str, ctx, depth = 0) {
  if (depth > 6) throw new Error(`slot recursion too deep in "${str.slice(0, 40)}…"`);
  const get = (n) => {
    let v = ctx[n];
    if (v === undefined && /^[A-Z]/.test(n)) { const lo = ctx[n[0].toLowerCase() + n.slice(1)]; if (lo !== undefined) v = cap(fill(String(lo), ctx, depth + 1)); }
    return v == null ? v : fill(String(v), ctx, depth + 1);
  };
  // [[ … ]] is optional: dropped when any slot inside it is empty. Innermost first, so they nest.
  const OPT = /\[\[((?:(?!\[\[)[\s\S])*?)\]\]/g;
  while (OPT.test(str)) {
    OPT.lastIndex = 0;
    str = str.replace(OPT, (_, inner) => {
      const names = [...inner.matchAll(/\{\{(\w+)\}\}/g)].map((x) => x[1]);
      return names.some((n) => isEmpty(get(n))) || (!names.length && !inner.trim()) ? "" : inner;
    });
  }
  return str.replace(/\{\{(\w+)\}\}/g, (_, n) => {
    const v = get(n);
    if (v === undefined) throw new Error(`unfilled slot {{${n}}}`);
    return v ?? "";
  });
}

/**
 * Render one prompt.
 * @param o.view       template name, e.g. "podcast-host", "broll-silent.screen"
 * @param o.generator  { name, model, profile } from projectGenerator()
 * @param o.slots      scene-specific slot values (see each template's slot table)
 * @param o.vision     vision-board.json (cast + world descriptors are read from here verbatim)
 * @param o.duration_s, o.aspect
 * @returns { text, mode, keyframe, warnings }
 */
export function renderPrompt({ view, generator, slots = {}, vision = {}, duration_s, aspect = "16:9" }) {
  const t = loadTemplate(view);
  const { profile } = generator;
  const R = profile.render_as;
  const warnings = [];
  const ctx = { ...t.meta.defaults, model: generator.model, duration_s: String(duration_s), aspect };

  // Cast: the descriptor strings come from the vision board, never retyped.
  const castKey = slots.cast ?? null;
  const c = castKey ? vision.cast?.[castKey] : null;
  if (castKey && !c) throw new Error(`cast key ${castKey} not in vision board`);
  if (t.meta.needs_cast && !c) throw new Error(`view ${view} needs slots.cast (a CHAR_… key from the vision board)`);
  if (c) {
    const [he, his, him] = PRONOUNS[c.pronoun ?? "they"] ?? PRONOUNS.they;
    Object.assign(ctx, { he, his, him, descriptor: c.descriptor });
    for (const k of ["noun", "wardrobe", "speaker", "role", "voice"]) if (c[k] != null) ctx[k] = c[k];
    if (c.noun && c.wardrobe) ctx.keep_cast = `the ${c.noun}, ${his} ${c.wardrobe}`;
    ctx.voice_line = c.voice_as === "voice_line" ? c.voice ?? "" : "";
    ctx.voice_prefix = c.voice_as === "voice_line" ? "" : c.voice ?? "";
  }
  const locKey = slots.location ?? null;
  const loc = locKey ? vision.cast?.[locKey] : null;
  if (locKey && !loc) throw new Error(`location key ${locKey} not in vision board`);
  if (loc) { ctx.location = loc.descriptor; if (loc.keep) ctx.location_keep = loc.keep; }
  ctx.keep = [ctx.keep_cast, ctx.location_keep].filter(Boolean).join(", ");

  // Scene slots override defaults and derived values (string-valued ones only).
  for (const [k, v] of Object.entries(slots)) if (typeof v === "string" && k !== "cast" && k !== "location") ctx[k] = v;

  // Mode + first frame
  const keyframe = slots.first_frame ?? (t.meta.first_frame_from_cast ? c?.reference_image ?? null : null);
  const mode = t.meta.kind === "image" ? "image" : keyframe ? "image_to_video" : "text_to_video";
  ctx.first_frame = keyframe ?? "";
  if (t.meta.first_frame_from_cast && !keyframe) warnings.push(`${view}: no first-frame reference (slots.first_frame or the cast reference_image) — identity will drift`);
  if (profile.first_frame_for_cast && c && mode === "text_to_video") warnings.push(`${generator.name}: a cast member is on screen but there is no first-frame reference — consistency needs one`);

  // Line → timestamped beats ([PAUSE] / [SILENCE])
  const line = slots.line ?? [];
  if (t.meta.speaks && !line.length) throw new Error(`view ${view} needs slots.line`);
  ctx.line = line.map((b) => `${fmt(b.from)}–${fmt(b.to)}s: ${b.say != null ? `"${b.say}"` : b.silence ? "[SILENCE]" : "[PAUSE]"}${b.note ? ` (${b.note})` : ""}`).join("\n");
  ctx.pause_each = line.filter((b) => b.pause).length > 1 ? "each " : "";
  const beats = [];
  for (const b of line) {
    const kind = b.say != null ? "speak" : b.silence ? "silence" : "pause";
    const last = beats[beats.length - 1];
    if (last && last.kind === kind && kind === "speak") last.to = b.to; else beats.push({ kind, from: b.from, to: b.to });
  }
  ctx.line_beats = beats.map((b) => `[${fmt(b.from)}–${fmt(b.to)}s] ${fill(`{{runway_${b.kind}}}`, ctx)}`).join("\n");

  // Avoid list: cast voice avoids (speaking views) + the view's list + scene extras.
  const drop = new Set((slots.avoid_remove ?? []).map((s) => s.toLowerCase()));
  const avoid = [...(t.meta.cast_avoid ? c?.avoid ?? [] : []), ...(t.meta.avoid ?? []), ...(slots.avoid_extra ?? [])]
    .filter((a) => !drop.has(a.toLowerCase()));
  ctx.avoid = avoid.length ? `${avoid.join(", ")}.` : "";
  if (R === "runway") {
    const unmapped = avoid.filter((a) => !(a.toLowerCase() in AVOID_POSITIVE));
    if (unmapped.length) throw new Error(`runway: no positive rewrite for avoid item(s) ${unmapped.map((a) => `"${a}"`).join(", ")} — add them to templates/prompts/avoid-positive.json`);
    const pos = [...new Set(avoid.map((a) => AVOID_POSITIVE[a.toLowerCase()]).filter(Boolean))];
    ctx.avoid_positive = pos.length ? `${cap(pos.join(", "))}.` : "";
  }

  // Blocks → layout
  const block = (id) => {
    const b = t.blocks[id];
    if (!b) throw new Error(`${view}: layout names unknown block "${id}"`);
    const src = b[R] ?? b.any;
    return src == null ? "" : fill(src, ctx).trim();
  };
  const layout = t.meta.layout[R] ?? t.meta.layout.veo;
  const text = layout.split(/\n\s*\n/).map((para) => para.split("\n").map((ln) =>
    ln.trim().split(/\s+/).filter(Boolean).map(block).filter(Boolean).join(" ")).filter(Boolean).join("\n"))
    .filter(Boolean).join("\n\n");

  warnings.push(...lint({ t, text, line, avoid, generator, duration_s }));
  return { text, mode, keyframe, warnings };
}

/** Timing + HeyAnaya lessons. Returns warning strings; never throws. */
export function lint({ t, text, line, avoid, generator, duration_s }) {
  const w = [], sp = generator.profile.speech, R = generator.profile.render_as;
  if (R === "runway" && NEGATIVE_RE.test(text)) w.push("runway: negative phrasing in the rendered prompt — rewrite the slot positively");
  if (text.length > generator.profile.prompt_max_chars) w.push(`prompt is ${text.length} chars, ${generator.name} limit ${generator.profile.prompt_max_chars}`);
  const says = line.filter((b) => b.say != null);
  for (const b of says) {
    if (/\d|%/.test(b.say)) w.push(`line "${b.say.slice(0, 30)}…": spell numbers out ("twenty percent") so the model pronounces them`);
    if (/HeyAnaya/i.test(b.say)) w.push(`line "${b.say.slice(0, 30)}…": write "Hey Anaya" as two words`);
  }
  if (t.meta.kind !== "image" && /whatsapp/i.test(text.replace(/"[^"]*"/g, ""))) w.push(`visual description names WhatsApp — call it "a generic green messaging app" so no warped logo is drawn`);
  if (!avoid.some((a) => /text|lettering|subtitle|label/i.test(a))) w.push("avoid list has nothing keeping text out of the shot — add on-screen text / subtitles");
  if (sp && generator.profile.dialogue && says.length) {
    const words = (s) => s.split(/\s+/).filter(Boolean).length;
    for (const b of says) {
      const rate = words(b.say) / (b.to - b.from);
      if (rate > sp.words_per_s * 1.25) w.push(`beat ${fmt(b.from)}–${fmt(b.to)}s: ${rate.toFixed(1)} words/s, budget ~${sp.words_per_s} — give it more time or trim`);
    }
    const talk = says.reduce((a, b) => a + (b.to - b.from), 0);
    const total = says.reduce((a, b) => a + words(b.say), 0);
    if (total / talk > sp.words_per_s * 1.1) w.push(`line averages ${(total / talk).toFixed(1)} words/s, budget ~${sp.words_per_s} (≈ ${Math.floor(sp.words_per_s * (sp.max_speech_end_s ?? duration_s))} words per clip)`);
    const end = Math.max(...says.map((b) => b.to));
    if (sp.max_speech_end_s != null && end > sp.max_speech_end_s + 1e-6) w.push(`speech runs to ${fmt(end)}s — end by ${sp.max_speech_end_s}s so the last word is never clipped`);
    const tail = line[line.length - 1];
    if (tail.say != null) w.push("line ends on speech — finish with a [PAUSE]/[SILENCE] tail for a clean cut");
    if (Math.abs(tail.to - duration_s) > 0.05) w.push(`line ends at ${fmt(tail.to)}s, clip is ${duration_s}s`);
    if (t.meta.head_silence && sp.head_silence_s && (line[0].say != null || line[0].to < sp.head_silence_s - 1e-6))
      w.push(`open with ≥ ${sp.head_silence_s}s of [SILENCE] so the clip has a clean in-point`);
  }
  return w;
}

/** Copy-paste-ready markdown for one take (written next to the prompt.json). */
export function promptMarkdown({ p, take, generator, keyframePrompt }) {
  const n = String(take.take).padStart(2, "0");
  const rows = [
    ["Generator", `${generator.model} (${generator.name}${generator.profile.generation === "manual" ? ", generate by hand" : ""})`],
    ["View", p.view ?? "—"],
    ["Mode", take.mode === "image_to_video" ? `image-to-video — first frame: \`${take.keyframe}\`` : "text-to-video"],
    ["Duration / aspect", `${take.duration_s} s · ${take.aspect_ratio}`],
    ["Save the clip to", `\`${take.output_path}\``],
  ];
  let md = `# ${p.scene_id} · take ${n}${p.view ? ` · ${p.view}` : ""}\n\n${p.intent}\n\n| | |\n|---|---|\n${rows.map((r) => `| ${r[0]} | ${r[1]} |`).join("\n")}\n`;
  if (keyframePrompt) md += `\n## 1. First-frame still (generate this first)\n\nSave it to \`${keyframePrompt.output_path}\`.\n\n\`\`\`text\n${keyframePrompt.prompt}\n\`\`\`\n`;
  md += `\n## ${keyframePrompt ? "2. " : ""}Prompt\n\n\`\`\`text\n${take.prompt}\n\`\`\`\n`;
  md += `\n## Acceptance criteria\n\n${p.acceptance_criteria.map((a) => `- ${a}`).join("\n")}\n`;
  if (take.prompt_delta_applied) md += `\n## Change from the previous take\n\n${take.prompt_delta_applied}\n`;
  md += `\nWhen the clip is in \`04_clips/\`, tell the pipeline to continue (stage ⑤ reviews it).\n`;
  return md;
}
