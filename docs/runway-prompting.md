# Runway Prompting Reference

Target model: **Runway Gen-4.5** (fallback: Gen-4 / Gen-4 Turbo). Specs below were checked
against Runway's help centre in Sept 2026 — re-verify when a new model ships and update this file.

This is the `runway` generator profile ([generators.md](generators.md)); its machine-readable
rules are in `templates/prompts/generators.json`. Prompts are rendered from the view templates
in `templates/prompts/` — the Runway rendering puts the camera first, turns the timed line into
action beats, rewrites every avoid item positively and drops the audio and dialogue blocks.
Veo projects use [veo-prompting.md](veo-prompting.md) instead.

## Model facts

| | Gen-4.5 |
|---|---|
| Modes | Text-to-video, Image-to-video |
| Duration | 2–10 s |
| Output | 720p, 24 or 25 fps |
| Aspect (T2V) | 16:9 only (1280×720) |
| Aspect (I2V) | 16:9, 9:16, 1:1, 4:3, 3:4, 21:9 |
| Cost | ~12 credits/s (+5/s for ProRes or PNG export) |
| Strengths | Sequenced instructions, camera choreography, precise timing, atmospheric change |

Consequences for this pipeline:
- **Vertical/square videos → image-to-video only.** Every A-roll scene needs a keyframe.
- **Scenes > 10 s must be split** in the breakdown.
- Deliverables are upscaled/letterboxed by Remotion to the target resolution (default 1920×1080).

## Core principles (from Runway's Gen-4 prompting guide)

1. **Positive phrasing only.** Negative prompts aren't supported and can produce the opposite.
   ✗ "no camera movement" → ✓ "locked-off static camera"
   ✗ "no people in background" → ✓ "an empty street"
2. **Concrete physical actions, not concepts.**
   ✗ "embodies the essence of joy" → ✓ "she smiles and raises both arms"
3. **Image-to-video: describe motion, not the image.** Refer to "the subject", "the man" — don't
   re-list what's already visible.
4. **Text-to-video: describe visuals *and* motion.**
5. **Start simple, then add one layer at a time:** subject motion → camera → scene effects → style.
6. **Descriptive, not conversational.** No "please", no "can you make".
7. **One shot, one primary motion** (at most one secondary). Compound motion — a camera move
   *while* the subject does two things — is the top cause of morphing. Multi-scene narratives
   in one prompt conflict.
8. **Camera instruction first.** Models weight early tokens more heavily; open the prompt
   with the shot size and camera behaviour.

## The degradation zone (plan every clip around it)

Generated motion decays in the **final 10–15 %** of a clip: the model eases the subject
toward stillness before the clip ends, and artifacts cluster in the same tail.

- **Generate long, use short.** Request comfortably more than the scene needs (within
  2–10 s); the edit uses the best 2–4 s. Simple single actions → shorter durations; only
  genuinely multi-step motion earns the top of the range.
- **Find `out_s` by scrubbing backward** from the last frame to where real motion stops.
- **Chain from momentum.** The next scene's I2V keyframe comes from *inside* the motion
  (mid-gesture, before the decay) — never the settled last frame, or the next clip visibly
  restarts from rest. The reviewer saves this as `scene-XXX_chain.png` + `chain_frame_s`.

## Stitching (expect ~3 generations per keeper)

A scene does not need one perfect take — it needs coverage. When no single take survives
review, combine the best 1–2 s sub-ranges of several takes (`decision: stitch`). Place each
join on an action, an SFX accent, or under a b-roll insert; a 2–4 frame dissolve absorbs
small mismatches. Keep the seed between takes so the material stays combinable.

## Does the model generate audio?

Check before anything else — it decides the shape of the whole pipeline.

- **If it does:** the clip carries synced speech, so lip-sync stops being a problem and the VO
  can be *harvested* from generations. Put the spoken line inside the prompt, split across the
  beats. Set `clip_audio: true` on EDL segments that use a clip's own sound.
- **If it does not:** A-roll is silent picture, the VO is a separate asset, and any
  talking-to-camera shot needs an audio-driven lip-sync step between stages ⑤ and ⑥.

**Harvesting VO.** A generation whose picture you discard is still a valid way to produce a
line — the take only has to sound right. But the voice must come from one source for the whole
film (AGENTS.md rule 12), so every line has to be generated, not just the ones you show.
Pack lines into as few takes as the duration cap allows; fewer takes means less voice drift.

```bash
ffmpeg -i clip.mp4 -vn -acodec pcm_s16le -ar 48000 vo.wav
```

## Sequenced-beat prompt format (preferred)

Prose prompts leave timing to the model. A beat list does not, and Gen-4.5 follows it well:

```
[one paragraph: format, setting, subject descriptor, lighting, lens, sound policy]

**[0-1s]** He lowers the phone and looks to lens, speaking: "Clinic owners,"
**[1-2s]** Holding the lens, calm and level: "if you're running Meta ads,"
**[2-3s]** Continuing, steady: "open your WhatsApp Business"
```

Rules that make it work:
- The opening paragraph is **byte-identical across every prompt in the project**. That, more
  than anything else, is what holds cast, wardrobe, room and light together across generations.
- Split the spoken line **across** the beats so the model gets a word-to-second mapping.
- One action per beat.
- Quoted dialogue is exempt from the positive-phrasing rule — `tools/validate.mjs` only flags
  negative words outside quotes, so a VO line like "It's not your team" validates. The check
  applies to generators whose profile sets `negative_phrasing: false` (Runway).

## Generate vanilla clips

Ask for the performance and nothing else: `Locked-off static camera, fixed framing`. No
push-ins, pans, grade, grain or vignette. Every one of those is free and reversible in Remotion
and costs a re-roll if baked in. A slow push-in is a scale ramp; film grain is a filter.

## Prompt formulas

**Text-to-video**
```
[Camera: shot size + movement]. [Subject descriptor] [action] in [setting].
[Lighting]. [Style/texture].
```
> Slow dolly-in, medium shot. A woman in her 40s with short grey hair, navy scrubs and round
> glasses reviews a tablet at a clinic reception desk, then looks up and smiles. Soft warm
> window light from the left. Cinematic, naturalistic, shallow depth of field, subtle film grain.

**Image-to-video**
```
[Camera movement]. [Subject motion, sequenced]. [Environmental motion]. [Pacing/feel].
```
> The camera slowly pushes in. The woman looks up from the tablet, then smiles toward the
> entrance. Background patients move gently out of focus. Calm, steady pacing.

**Sequenced timing** (Gen-4.5 handles this well)
> At first the phone lies still on the desk. Then the screen lights up with an incoming call.
> Finally a hand enters from the right and picks it up. Locked-off overhead shot.

## Camera vocabulary

| Size | Movement | Angle |
|---|---|---|
| extreme wide, wide, full, medium wide, medium, medium close-up, close-up, extreme close-up, insert | locked-off, slow dolly-in / dolly-out, truck left/right, pan, tilt, tracking, orbit, crane up/down, handheld, whip pan, push-in, rack focus | eye-level, low angle, high angle, overhead / top-down, over-the-shoulder, POV, dutch angle |

## Consistency tactics

- Reuse the **exact** cast descriptor string from the vision board in every T2V prompt.
- Prefer I2V from a shared reference still per character/location.
- Chain shots: use the accepted previous clip's **chain frame** (a momentum frame from
  inside the usable range — see the degradation zone above) as the next keyframe when the
  shot is continuous.
- Keep lighting direction and time-of-day words identical across a sequence.
- Record the seed; when a take is close, keep the seed and change only the prompt delta.

## Known weak spots → plan around them

| Weakness | Mitigation |
|---|---|
| Legible text/UI inside the shot | Keep screens blank or out of focus; add text/UI as a Remotion overlay |
| Hands doing fine manipulation | Frame wider, or cut away before the action completes |
| Lip-sync / talking to camera | Avoid dialogue close-ups; use VO over action |
| Logos & brand marks | Add in Remotion, never prompt for them |
| Crowds / many interacting people | Limit to 1–2 subjects in focus |
| Long, complex camera paths | Split into two scenes |
| Invented brand names / signage on set surfaces | Observed: a counter rendered "…TH CLINIC" unprompted. Check every take for invented lettering; crop or cover it |
| Wardrobe drift between takes | Observed: same man, same jacket, shirt changed between generations. One master keyframe, and compare takes side by side before assembly |

## Parameters to record per take

`model, mode, prompt, keyframe, duration_s, aspect_ratio, fps, seed, credits_estimate, generated_at, output_path`
