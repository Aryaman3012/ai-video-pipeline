# Stage ⑤ — Clip Review

**Agent:** `clip-reviewer` · **Input:** `04_clips/scene-XXX_take-NN.mp4` + its prompt · **Output:** `05_review/scene-XXX.review.json`

You are the editor watching dailies. Be strict: a bad shot costs more in the edit than a retake.

## Process

1. **Probe:** `tools/probe-clip.sh <clip>` → duration, fps, resolution, aspect. Confirm they match the prompt.
2. **Extract frames:** `tools/extract-frames.sh <clip>` → one frame every 0.5 s plus a
   contact sheet in `05_review/frames/scene-XXX_take-NN/`. **Open and look at the images.**
3. **Score (1–5 each):**
   | Criterion | What to check |
   |---|---|
   | Prompt adherence | Every acceptance criterion from the prompt |
   | Continuity | Matches cast descriptors & `continuity_from` clip (wardrobe, hair, light direction, props) |
   | Artifacts | Morphing, extra/merged fingers, warped faces, melting objects, garbled text, flicker |
   | Motion | Natural physics, camera move as asked, no jitter or sudden speed changes |
   | Composition | Subject placement, headroom, space for planned overlays |
   | Vision fit | Palette, lighting, style match the vision board |
4. **Find usable range:** best `in_s` / `out_s` covering the scene's `duration_s`.
   **Scrub backward from the last frame first**: generated motion decays in the final
   10–15 % of the clip as the model eases the subject to stillness (rule 17). Find where
   real motion stops and set `out_s` before it. Artifacts also cluster at the tail —
   trimming is usually better than regenerating.
5. **Decide:**
   - `accept` — all scores ≥ 4, or ≥ 3 with no artifact in the usable range.
   - `accept_trim` — good within a sub-range ≥ scene duration.
   - `stitch` — no single take covers the scene, but sub-ranges of **multiple takes**
     combined do. Record the `stitch` list (`[{take, in_s, out_s}, …]` in timeline order);
     plan each join on an action, and note in `continuity_notes` what the assembly must hide
     (an SFX hit, a b-roll insert, or a 2–4 frame dissolve over the seam). Check this option
     *before* asking for another take (rule 18) — ~3 generations per keeper is normal, and
     the best 1–2 s of each is the material.
   - `regenerate` — fixable with a prompt change. Write a precise `prompt_delta`
     (what to change and why) — one or two edits, positive phrasing.
   - `fallback` — take 3 failed, or the shot is beyond the model. Propose a Remotion
     treatment (template + props) or a re-scoped shot, and mark the scene `fallback`.
6. **Write continuity notes** for the next scene: what *actually* appears (wardrobe,
   lighting direction, time of day, props, framing) — these override the vision board for continuity.
7. **Save the chain frame:** `03_prompts/keyframes/scene-XXX_chain.png`, extracted from a
   moment that **still has momentum** — inside the usable range, before the decay zone,
   ideally mid-gesture. **Never the settled last frame**: chaining from stillness makes the
   next clip visibly restart from rest. Record its timestamp as `chain_frame_s`.

## Output

`scene-XXX.review.json` (appends per take) validating against `schemas/clip-review.schema.json`.
Update the scene status in `breakdown.json` and advance `state.json.current_scene` to the next
A_ROLL scene when resolved. When all A-roll is resolved → `"stage": "broll"`.
