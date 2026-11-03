# Stage ⑥ — B-roll Design

**Agent:** `broll-designer` · **Input:** breakdown + `vo.words.json` + vision board + accepted A-roll reviews · **Output:** `05_broll/broll-design.json` + `05_broll/storyboard.md`

The breakdown chose *which* template each B_ROLL scene uses. This stage designs *what the
card actually does, when, to the word* — before anything renders. B-roll planned without
word timing is a slideshow; this stage is why it isn't.

## Process

1. **Load** every `B_ROLL` scene and every `overlays` entry from `breakdown.json`, the theme
   and motion tokens from the vision board, and `00_script/vo.words.json`.
2. **For each card, choreograph against the words:**
   - **Beats.** Each element of the card (headline, a bar, a list item, a stat) gets an
     `at_s` — the measured start of the word it belongs to, **led by 1–2 frames** (the eye
     confirms what the ear is about to say). Reveals that *answer* a setup line lag it by
     200–500 ms instead.
   - **Reading time.** Text must hold `(characters ÷ 12) + 0.5` seconds *after* its entrance
     finishes. If the VO window is too short for the text, cut the text — never squeeze the hold.
   - **Entrances ≤ 400 ms** (≈ 10 frames at 24 fps), using the vision board's motion tokens.
     Staggers 2–5 frames per element, whole cascade ≤ 12 frames. At most a third of the
     card's elements moving at once.
   - **Breaths are no-animate zones.** Nothing enters or exits during a marked VO gap; gaps
     are where cards settle, and where cuts into/out of B-roll land.
   - **One idea per visual state.** New clause with new information → the card changes;
     elaboration of the same idea → the card evolves (secondary motion), never resets.
3. **Check every card against its neighbours:** it renders over the ground plate (not a flat
   fill), its palette/type come from the theme, and the cut into it lands on a phrase
   boundary from the words file. Where a card covers an A-roll seam (a stitch join or jump
   cut), say so — that placement is load-bearing and assembly must not move it.
4. **Overlays too:** captions, lower thirds and callouts on A-roll scenes get the same
   word-timed `at_s` treatment, and their `from_s`/`to_s` in the breakdown are updated to the
   measured values.
5. **Write the outputs:**
   - `broll-design.json` — per scene: template, final props, and the beat list
     (validates against `schemas/broll-design.schema.json`).
   - `storyboard.md` — human-readable: one block per card, `time | element | word it lands on`,
     so the user can review the choreography without reading JSON.

## Gate 🔍

Present `storyboard.md`. The user approves the choreography (`approved.broll: true`).
Cheap to change now; a re-render and a re-review to change later.
Update `state.json` → `"stage": "assembly"`.
