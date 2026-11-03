# Stage ② — Look + VO Lock

**Agent:** `vision-director` · **Input:** approved `script-annotated.md`, `audit.md`, anything in `01_vision/refs/` · **Output:** `01_vision/vision-board.md` + `vision-board.json`, `00_script/vo.*` + `00_script/vo.words.json`

Two locks, one gate. **Look:** what should this video feel like, and how will it look
consistently from the first frame to the last? **VO:** the final voice track, measured to
the word, *before* anything downstream is timed. Everything after this stage reads from
these two artifacts.

## A. Look lock

1. **Identify the spine:** audience, purpose (explain / persuade / entertain / sell),
   the single takeaway, emotional arc (e.g. *frustration → curiosity → relief → confidence*).
2. **Define the look** — each item must be concrete enough to paste into a prompt:
   - **Visual style:** e.g. "cinematic live-action, naturalistic, shallow depth of field".
   - **Lighting:** e.g. "soft warm window light, golden hour exteriors" — every light motivated.
   - **Colour palette:** 4–6 hex codes with roles (bg, primary, accent, text, highlight).
   - **Ground:** the surface the film sits on. B-roll renders over a plate derived from the
     A-roll (see [remotion-broll.md → Ground](../remotion-broll.md)), never a flat void.
   - **Camera language:** default lens feel & movement.
   - **Texture:** grain, film stock feel, cleanliness — delivered by the stage-⑦ unification
     pass, *not* prompted into Runway (rule 14).
   - **Typography (b-roll):** heading font, body font, weight, case.
   - **Motion language (b-roll):** pick named presets from the
     [motion tokens table](../remotion-broll.md) — e.g. `snappy` entrances, `premium` (no
     overshoot), stagger interval — and record them in `theme.motion`.
3. **Cast & world bible** — for every recurring character, location, prop:
   a fixed *descriptor string* reused verbatim in every prompt
   (e.g. `CHAR_DOCTOR = "a woman in her 40s with short grey hair, navy scrubs, round glasses"`).
   One **master keyframe** per character, reused for every take; wardrobe described down to
   the garment, because it does drift. For the prompt templates also record, per character:
   `noun`, `pronoun`, `wardrobe`, `speaker`, `role`, the **voice block** (`voice`, pasted
   verbatim into every speaking clip), `voice_as` and voice `avoid` items; per location the
   `keep` phrase for first-frame locks ([templates/prompts/README.md](../../templates/prompts/README.md)).
4. **A-roll / B-roll strategy:** target ratio, what A-roll is *for* in this video,
   which b-roll templates fit — check the registry tables for the project's aspect ratio.
5. **Mood references:** 3–6 short written shot descriptions that define the ceiling of
   quality. Add images to `01_vision/refs/` if available.
6. **Audio direction:** VO tone, music genre/BPM, SFX style — including the cut-accent policy
   (which cuts get an SFX hit, see [editing-principles.md](../editing-principles.md)).
7. **Do / Don't list** — 5 each, positive phrasing for anything that feeds prompts.

## B. VO lock

The VO is recorded, synthesised, or (if harvested from Runway) fully planned **now** — not
at assembly. Timing estimates run ~15 % short of real delivery; the film is timed against
the real waveform or it is mistimed.

1. **Get the audio.** User supplies it, or it is generated from the approved script.
   Save to `00_script/vo.wav` (or `.mp3`). One source for the whole film (rule 12).
2. **Word-align it** → `00_script/vo.words.json`:
   ```json
   { "source": "vo.wav", "duration_s": 41.82,
     "words": [ { "w": "Clinic", "start": 0.04, "end": 0.66 },
                { "w": "owners,", "start": 0.70, "end": 0.90 } ] }
   ```
   Any aligner works — `whisperx vo.wav --output_format json`, `stable-ts`, or a manual pass
   in an audio editor for short scripts. Convert to the shape above. Sanity-check: play 3
   random words at their timestamps before trusting the file.
3. **Mark the breaths:** gaps ≥ 250 ms between words are section candidates and no-animate
   zones. List the major ones in the vision board's audio section.
4. **Record measured runtime** in `vision-board.json → runtime_target_s` (the real number,
   not the estimate).

## Self-consistency check (run before handing the board over)

A board is written section by section and the sections can contradict each other. Every
contradiction found so far was invisible inside its own section and only surfaced when a
prompt was written from it. Check at least:

- **Look vs lighting.** Does the lighting spec match the stated visual style? "Unglamorous
  documentary realism" and a two-source amber/teal gel setup are not the same film.
- **Palette ground vs look ground.** If the palette claims the film "sits on" a colour while
  the A-roll sits in a lit location, the film alternates between a room and a void on every cut.
- **Is every light motivated?** A key with no plausible source in the room gets resolved
  differently in every generation, which attacks cast consistency.
- **Do brand colours appear as light?** If so the graphics have nothing to contrast against.
  Keep brand colour in the graphics and in small background practicals.
- **Does the cast bible survive the shot list?** One master keyframe per character; compare
  against the audit's risk flags — a shot the audit marked risky must not be load-bearing here.
- **Does the VO delivery fit the arc?** If the read races where the arc says "let it breathe",
  flag it now — a VO problem found at assembly costs a re-record and a full re-time.

## Output

- `vision-board.md` — human-readable, one screen, with a palette strip and the cast bible.
- `vision-board.json` — machine-readable, validates against `schemas/vision-board.schema.json`
  (includes the `vo` block pointing at the audio and word file). Template: `templates/vision-board.md`.
- `00_script/vo.*` + `00_script/vo.words.json`.

## Gate 🔍

Present the board and play/point to the VO. The user approves: **tone, look, palette, cast
descriptors, A/B ratio, and the voice itself** (`approved.vision: true`). If unattended,
proceed and list assumptions at the top of `vision-board.md`.
Update `state.json` → `"stage": "breakdown"`.
