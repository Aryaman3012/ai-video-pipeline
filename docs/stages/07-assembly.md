# Stage ⑦ — Assembly, Unification & Iteration (Remotion)

**Agent:** `assembly-editor` · **Input:** breakdown + reviews + broll-design + accepted clips + audio · **Output:** `06_edit/edl.json`, `renders/<slug>_vNN.mp4`

Three jobs: cut the film on the measured grid, unify footage and graphics into one look,
then **iterate** — the plan ends at v01, the video ends when watching it stops finding problems.

## 1. Build the EDL (`schemas/edl.schema.json`)

From `breakdown.json` in timeline order:

- `A_ROLL` accepted → `{kind: "clip", src, in_s, out_s}` using the reviewer's trim.
  A `stitch` decision becomes **consecutive clip segments**, one per stitch entry, joined by
  hard cuts — each join placed on the action the reviewer named, covered by an SFX accent,
  a b-roll insert, or a 2–4 frame dissolve.
- `B_ROLL` or `fallback` → `{kind: "broll", template, props}` — props and timing come from
  **`05_broll/broll-design.json`**, not from the breakdown's sketch.
- Copy `transition_in` and the word-timed `overlays`.
- **Timeline rule:** every segment starts at the sum of the previous `duration_s`, so VO
  stays in sync. A non-cut transition into segment *i+1* overlaps the **tail** of segment *i*
  (default 12 frames). A clip followed by a fade/slide/wipe therefore needs a handle:
  `in_s + duration_s + transition_frames/fps ≤ clip length`. Prompts round durations up for this.
- Add `audio` tracks: VO (`00_script/vo.*`), music (with `volume` and ducking under VO), SFX.
  Every hard cut that the vision board's accent policy names gets its SFX hit placed 1–2
  frames **after** the picture cut (see [editing-principles.md](../editing-principles.md)).
  If the VO came from the clips themselves, extract it to `00_script/vo/` and put it on the
  `audio` track anyway — audio on its own track is what lets picture cut away underneath it.
  Reserve `clip_audio: true` for stretches where a clip's own sound plays and nothing cuts away.
- Add `theme` from the vision board (palette, fonts, motion tokens) **and `theme.unify`** (below).

## 2. Unification pass (`theme.unify`)

AI clips drift in temperature and contrast between generations, and clean vector graphics
intercut with raw generated footage reads as two different films. Close the gap in order:

1. **Per-clip correction first:** balance exposure/white balance per segment with `grade`
   (`brightness`/`contrast`/`saturate`) so one shared look can serve the whole timeline.
2. **Shared grade at reduced strength** — pick the hero clip, match the others to it; keep
   corrections gentle (the clips arrive with contrast already baked in).
3. **De-sheen:** `theme.unify.clip_blur_px` ≈ 0.3–0.6 — a sub-pixel soften on clip segments
   only, to kill the AI micro-sharpening (also hides the 720p→1080p upscale).
4. **One grain layer over everything:** `theme.unify.grain_opacity` ≈ 0.08–0.15, rendered on
   top of footage **and** b-roll alike. The uniform grain is what makes stitched shots and
   vector cards read as one continuous film.

## 3. Preview & editorial pass

- `tools/sync-media.sh <slug>` copies accepted clips and audio into
  `remotion/public/projects/<slug>/`. EDL `src` paths are relative to `remotion/public/`.
- `cd remotion && npx remotion studio` → composition `Main`, `--props=../projects/<slug>/06_edit/edl.json`.
- Watch it through against [editing-principles.md](../editing-principles.md):
  - Cuts land on VO phrase boundaries; b-roll text appears within ±2 frames of its word.
  - A visual change at least every ~4 s; nothing animates through a marked breath.
  - Speed ramps only if the vision board allows; `playbackRate` 0.8–1.2 max on A-roll,
    eased in and out, never a hard speed switch.
  - No jump in colour between adjacent clips; stitch joins invisible at full speed.
  - Captions readable (≥ 4.5:1 contrast, within title-safe area, reading-time formula holds).

## 4. Render

```bash
cd remotion
npx tsc --noEmit   # fix errors before rendering
npx remotion render src/index.ts Main ../projects/<slug>/renders/<slug>_v01.mp4 \
  --props=../projects/<slug>/06_edit/edl.json
```
Add `--scale=0.5` for quick drafts. In sandboxed environments without a Remotion-managed
browser, pass `--browser-executable=<path to chrome-headless-shell>`.
Music is ducked to `duck_under_vo` for the whole track whenever a VO track exists — for
finer ducking, pre-mix or split the music track in the EDL.

## 5. QC, then iterate

- Extract frames at every cut (`tools/extract-frames.sh --at-cuts`) and look at them;
  check duration equals EDL total; audio peaks ≤ −1 dBTP, loudness ≈ −14 LUFS.
- **Watch → diagnose → revise.** Every problem gets a root cause in `log.md` (measure it —
  frame numbers, dB, ms offsets), a fix **in the EDL** (never in components), and a new
  version number. Expect real iteration: the reference production took 15 versions, and
  that loop is where the quality was manufactured. Never overwrite a render.

## Gate 🔍 & hand-off

The user watches the current version and signs off (`approved.final: true`) — or names what
to fix, which starts the next iteration. Log each version: runtime, what changed, open notes.
On sign-off, set `state.json → "stage": "done"`.
