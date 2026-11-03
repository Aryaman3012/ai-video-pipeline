# Stage ③ — Script Breakdown

**Agent:** `script-breakdown` · **Input:** annotated script + vision board + `vo.words.json` · **Output:** `02_breakdown/breakdown.json` + `breakdown.md`

Turn prose into a shot list. Every scene is tagged **A_ROLL** (the project's generator) or **B_ROLL** (Remotion),
and every duration comes from the measured VO, not an estimate (rule 16).

## Process

1. **Split into beats.** One idea per beat. Keep the exact VO text on each beat, and start
   from the audit's per-line routing (seeable/sayable) — it is advisory, the breakdown decides.
2. **Time each beat from `vo.words.json`.** A beat's window is
   `first word start → last word end`, snapped outward to the nearest breath (gap ≥ 250 ms).
   Record `vo_start_s` / `vo_end_s` on every scene. Never use words-per-minute math — the
   word file exists precisely because estimates ran ~15 % short. Add ~0.5 s breathing room
   at section breaks (there is usually a real breath there; use it).
3. **Derive `a_roll_ratio`, do not inherit it.** The ratio describes the edit; it is not a
   target the edit is bent to meet. If the vision board's number disagrees with the breakdown,
   the breakdown is usually right — change the board.
4. **Split beats into scenes.** A scene is one continuous shot, **2–10 s**, and never longer
   than one clip of the project's generator (Veo: 8 s — a talking line must also fit ~21 words).
   A 14 s beat becomes 2 scenes (e.g. 8 s + 6 s). Prefer 3–6 s for energy, 6–10 s for mood.
   A stretch of A-roll longer than 10 s is a **chain**: consecutive scenes linked by
   `continuity_from`, planned here so stage ④ knows which shot hands its chain frame to which.
5. **Classify each scene** — ask in order:
   - Does the line carry a number, list, comparison, name, quote, process or claim? → **B_ROLL**
   - Does it need a person/place/action/emotion to be *seen*? → **A_ROLL**
   - Is it a hook, title, section break or CTA? → usually **B_ROLL** (title/kinetic) — or A_ROLL with a text overlay.
   - Would photoreal footage explain it better than graphics? → **A_ROLL insert**
   - Did the audit flag this line as a generator weak spot? → its mitigation applies here.
6. **Layer overlays.** A-roll scenes may carry Remotion overlays (lower third, caption, stat
   callout) — record them in `overlays`, they don't count as B-roll time.
7. **Check rhythm** against [editing-principles.md](../editing-principles.md):
   ratio within target, ≤ 3 consecutive B-roll, no > 20 s of bare A-roll, a visual change at
   least every ~4 s, shot sizes vary (WS → MS → CU progression), hook in first 3 s.
8. **Plan transitions** between scenes: `cut` (default), `fade`, `slide`, `wipe`, `match-cut`.
   Note which cuts get an audio accent (see the cut-accent policy on the vision board).
9. **Pick a view per A_ROLL scene** from the table in
   [templates/prompts/README.md](../../templates/prompts/README.md). A talking line is
   `podcast-*` or `presenter-to-camera`; a cutaway is a `broll-silent.*` variant (still
   A_ROLL — it is generated footage).
10. **Continuity chain.** For each A-roll scene note `continuity_from` (previous A-roll scene it
   must match) and which cast/world descriptors it uses.

## Scene fields (see `schemas/breakdown.schema.json`)

| Field | Notes |
|---|---|
| `id` | `scene-001`, zero-padded, in timeline order |
| `beat_id` | parent beat |
| `vo_text` | exact words spoken over this scene |
| `vo_start_s` / `vo_end_s` | measured window from `vo.words.json` |
| `duration_s` | 2–10, = `vo_end_s − vo_start_s` (± breathing room) |
| `type` | `A_ROLL` or `B_ROLL` |
| `intent` | *why* this shot exists, one sentence |
| `shot` | A-roll: `{size, angle, movement, subject, action, location}` |
| `broll` | B-roll: `{template, props}` — template from the Remotion library |
| `overlays` | optional list of `{template, props, from_s, to_s}` |
| `transition_in` | `cut` / `fade` / `slide` / `wipe` / `match-cut` |
| `view` | A_ROLL: the prompt template — `podcast-host`, `podcast-guest`, `presenter-to-camera`, `broll-silent.<screen\|location\|aerial\|person\|interaction>` ([templates/prompts](../../templates/prompts/README.md)) |
| `continuity_from` | scene id or null |
| `cast` | descriptor keys from the vision board |
| `status` | `planned` → `prompted` → `generated` → `accepted` / `fallback` |

## Output

- `breakdown.json` (validated).
- `breakdown.md` — a table: `# | time | type | VO | visual | transition`, plus totals
  (runtime, A/B ratio, scene count, estimated generator cost = A-roll seconds (or clips) × rate × expected takes ≈ ×3).

## Gate 🔍

This is the highest-leverage review in the pipeline: structure is nearly free to change on
paper and brutal to change after generation. Present `breakdown.md` and get approval on
**coverage, rhythm, and the A/B split** (`approved.breakdown: true`).

Coverage check: concatenating every `vo_text` reproduces the script. Every scene 2–10 s.
Validate. Update `state.json` → `"stage": "prompting"`, `"current_scene": "<first A_ROLL id>"`.
