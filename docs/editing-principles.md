# Editing Principles

The rules the breakdown, b-roll design and assembly agents check against.

## Structure
- **Hook in the first 3 s** — the strongest visual or line goes first.
- **Arc:** hook → problem → turn → proof → payoff → CTA (adapt to the script's own arc).
- End each section on a visual that sets up the next.
- Retention drop-off spikes around 25–35 s — place a strong pattern interrupt (location,
  format or music change) there, not another card.

## Rhythm
- Default shot length: 3–6 s; mood shots up to 10 s; B-roll cutaways 2–5 s (hard ceiling — an
  8 s card goes dead; split it into two). Retention-optimised short-form cuts every 2–4 s.
- Change *something* at least every ~4 s (cut, overlay, camera move, text beat).
- **Cut density tracks information density, not a metronome.** Fast cadence for setup and
  lists; deliberately held 4–6 s shots for payoffs — the contrast is itself a pattern interrupt.
- Mix: 60–70 % A-roll / 30–40 % B-roll by runtime unless the vision board overrides.
- No more than 3 consecutive B-roll scenes; no more than 20 s of A-roll without an overlay or cutaway.
- Speed up the pace toward the payoff; let the CTA breathe.

## Shot grammar
- Progress shot sizes within a sequence (wide → medium → close) and avoid cutting between two
  near-identical sizes/angles of the same subject (jump cut) unless it's a deliberate style.
- Respect the 180° rule across A-roll scenes of the same space (note screen direction in continuity notes).
- Match on action or on eyeline where a cut joins two A-roll shots — and place cuts
  mid-movement, not on stillness: motion across the cut hides the edit.
- Motion into motion: end a camera move and start the next in a compatible direction.

## Placing B-roll (the part that is easy to get wrong)

The failure mode is laying the timeline out as slabs — a whole A-roll block, then a whole
B-roll block, then another A-roll block. It reads as a slideshow with a person in it.

- **Cut away mid-thought, not between thoughts.** For each complete point the speaker makes,
  cut to 1–2 visuals *while they are still talking*, then return to their face for the
  conclusion of that point.
- **L-cut / J-cut, 1–2 s of offset.** An L-cut holds the speaker's audio while the picture
  moves to b-roll; a J-cut starts the next audio before its picture arrives. Past ~3 s of
  offset the viewer stops reading it as seamless and starts noticing the mismatch.
- **Hold a cutaway 2–5 s.** Long enough to register, short enough that the audio does not
  outrun the picture.
- **This requires audio decoupled from picture.** Put the VO on the EDL `audio[]` track with a
  `start_s` and let picture segments cut freely underneath it. If a clip's audio only plays
  while that clip's picture is on screen, a cutaway kills the voice and L-cuts are impossible.
  Use `clip_audio: true` only when a clip's own sound is the source for that stretch *and*
  nothing cuts away during it.
- **B-roll also covers seams.** Trimming a pause out of A-roll creates a jump cut; a stitch
  of two takes creates a join. A cutaway over either hides it — which is why seam-covering
  cards are position-locked in the b-roll design.
- **Land the b-roll on the word.** The visual that proves a claim arrives with the claim.

## Cutting to VO (all times from vo.words.json — never estimated)
- Cut on phrase boundaries, a few frames *before* the stressed word.
- B-roll text lands within ±2 frames of the word it shows; **emphasis leads its word by 1–2
  frames** (the eye confirms what the ear is about to say); reveals that answer a setup
  **lag it by 200–500 ms** (anticipation, then confirmation).
- Breaths (gaps ≥ 250 ms) are no-animate zones: nothing enters or exits during them; new
  sections start on the breath.
- **Reading time is law:** on-screen text holds `(characters ÷ 12) + 0.5` seconds after its
  entrance finishes. Too little window → cut words, never the hold.
- Leave 6–12 frames of air after a section's last word before the transition.

## Transitions
- Hard cut is the default — 90 %+ of professional transitions. What reads as "expensive" is
  not the transition type but that every cut is motivated, motion-matched, and carries an
  audio accent.
- **Audio accents:** the SFX hit / music downbeat lands 1–2 frames *after* the picture cut —
  see first, then hear; the impact feels stronger.
- **Masked transitions:** a b-roll panel or foreground element sweeping across frame can
  *be* the transition — the single most useful seam-hider for AI footage.
- Fades for time jumps or section breaks. Slides/wipes only for B-roll ↔ B-roll or when the
  vision board calls for a graphic style. Transition length 8–15 frames, always eased —
  never linear spatial motion.
- Speed ramps: eased velocity curves only, never a hard speed switch; `playbackRate`
  0.8–1.2 max on A-roll.
- Never a cross-dissolve between unrelated shots; no preset wipes/pushes "for variety".

## Motion (b-roll and overlays)
- Entrances ease-out, exits ease-in, on-screen moves ease-in-out. **Never linear** for
  anything spatial (linear is for counters and progress only).
- Entrances ≤ 400 ms (~10 frames at 24 fps) and 30–50 % longer than exits.
- Staggers 2–5 frames per element; whole cascade ≤ 12 frames; at most ⅓ of on-screen
  elements moving at once.
- Overshoot by personality: premium 0 % (`overshoot_clamp`), corporate ≤ 3 %, playful 10–20 %.
- Every polished card has three layers: primary (the hero element), secondary
  (follow-through, ~50 ms behind), ambient (subtle background life). Missing layers read as flat.

## Sound
- VO is king: music ducks to ~20–30 % under VO.
- Music changes or hits align with section breaks.
- Loudness target ~ −14 LUFS for social/web; peaks ≤ −1 dBTP.
