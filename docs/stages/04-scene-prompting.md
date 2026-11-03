# Stage ④ — Scene Prompting (one scene at a time)

**Agent:** `scene-prompter` · **Input:** one A_ROLL scene + vision board + reviews of earlier accepted scenes · **Output:** `03_prompts/scene-XXX.prompt.json` + `scene-XXX.prompt.md`

The generator is the project's (`state.json → format.generator`, see
[generators.md](../generators.md)). Its profile decides clip length, aspect, phrasing and
whether the line is spoken by the model. **Runway:** generate as before (web app or API).
**Every other generator:** write the prompt, show it, and wait for the user to drop the clip
into `04_clips/` — never attempt generation.

## The one-scene rule

Open **exactly one** scene (`state.json → current_scene`). Write its prompt, show it to the
user, wait for the generated clip, let stage ⑤ resolve it, then advance. Do not pre-write
prompts for later scenes: each accepted clip updates the continuity notes (actual wardrobe,
light direction, framing) the next prompt must match.

## Process for the current scene

1. **Load context**
   - The scene object from `breakdown.json`.
   - Cast/world descriptors from `vision-board.json` (copy verbatim).
   - `continuity_notes` and the **chain frame** from the review of the `continuity_from`
     scene, if any.
2. **Pick the view** — the scene's `view` from `breakdown.json` (one of the templates in
   [templates/prompts/](../../templates/prompts/README.md): `podcast-host`, `podcast-guest`,
   `presenter-to-camera`, `broll-silent.<screen|location|aerial|person|interaction>`). If it
   is missing, choose one by that README's table and write it back to the breakdown.
3. **Choose the mode**
   - **Image-to-video (preferred)** when a character/location must stay consistent, or the
     aspect ratio isn't 16:9. Needs a keyframe in `03_prompts/keyframes/scene-XXX.png` —
     the previous clip's *chain frame* (a momentum frame, see stage ⑤), a reference image,
     or a generated still. Veo: **required** whenever a cast member is on screen.
   - **Text-to-video** for standalone shots, in the aspects the profile allows (Runway 16:9 only).
   - No still yet? Add a `keyframe_prompt` (`view: keyframe-still`, `output_path`
     `03_prompts/keyframes/…png`) — it is rendered first in the `.prompt.md`.
4. **Fill the template's slots** into `takes[N].slots` — never write prompt prose by hand:
   - `line`: `[{from,to,say}, …, {from,to,pause:true}]` (podcast) or with `silence:true`
     head and tail (presenter), timed on the scene's words; ≈ 2.7 words/s, speech ends by 7.8 s.
   - `delivery`, `gesture`, `pause_action` / `silence_action` for this line only.
   - `cast` / `location` default to the scene's first `CHAR_` / `LOC_` keys; descriptors, the
     wardrobe lock and the voice block are pasted from the vision board by the renderer.
   - Silent views: `action`, `place`/`placement`, `camera`, `ambience`.
   - `avoid_extra` / `avoid_remove` for this shot only.
5. **What the rendering does** (from the profile — check it, don't redo it):
   Veo keeps the fixed HeyAnaya blocks and the `Avoid:` line. Runway follows
   [runway-prompting.md](../runway-prompting.md):
   - **Camera instruction first** — models weight early tokens more heavily.
   - T2V: `[camera] + [subject descriptor] + [action] + [setting] + [lighting] + [style]`
   - I2V: `[camera movement] + [subject motion] + [scene motion/effects] + [pacing]` — describe
     motion, don't re-describe the image.
   - Positive phrasing only. Concrete physical actions. **One primary motion** (plus at most
     one secondary) — compound motion is the top cause of morphing.
   - Sequence timing if useful: "At first…, then…, finally…".
   The Runway rendering applies these: camera first, the line becomes action beats, avoid
   items are rewritten positively, the audio and dialogue blocks are dropped.
6. **Set parameters:** model, duration, aspect ratio, seed (record it), fps.
   **Generate long, use short:** request comfortably more than the scene needs (round up,
   within the profile's range: Runway 2–10 s, Veo 8 s) — the edit uses the best part and the
   tail decays anyway (rule 17).
   A transition after the scene also needs a handle: `in_s + duration_s + transition_frames/fps`
   must fit inside the usable range.
7. **Record intent & acceptance criteria** — 3–5 checkable statements the reviewer will test
   ("subject's face stays consistent", "camera ends on the laptop screen", "screen stays blank
   for the overlay"). These criteria are the contract stage ⑤ enforces.
8. **Render:** `node tools/render-prompt.mjs <slug> scene-XXX` writes the prompt into the take
   and `scene-XXX.prompt.md`. Fix every warning it prints (timing, numbers, "Hey Anaya",
   WhatsApp in a visual, text in shot, negative phrasing on Runway), re-render, validate.
9. **Show the prompt to the user 🔍** (the `.prompt.md`), with the exact save path
   `04_clips/scene-XXX_take-NN.mp4`.
   - Runway: generate via the web app (human) or API (if configured).
   - Manual generators: stop and wait for the clip. Do not call any generation API.
   When the clip exists, update `state.json` (`stage: review`) and scene `status: generated`.

## Retakes

When stage ⑤ returns `regenerate`, write take N+1 into the `takes` array — never delete
earlier takes — as a copy of take N's `slots` with the delta applied, then re-render with
`--take N+1`. Apply the reviewer's `prompt_delta` precisely: change one or two things, not
everything, and keep the seed when the take was close. **Before requesting take 3, check the
stitch option with the reviewer** — the best sub-ranges of takes 1+2 may already cover the
scene (rule 18). After take 3, stop and apply the fallback.

## Output

`scene-XXX.prompt.json` validating against `schemas/scene-prompt.schema.json` (with `view`,
`generator` and each take's `slots`), and `scene-XXX.prompt.md` for copy-paste. The validator
re-renders every take from its slots and warns when the stored prompt is stale.
