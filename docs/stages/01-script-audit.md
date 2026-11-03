# Stage ⓪① — Format Lock & Script Audit

**Agent:** `script-auditor` · **Input:** `00_script/script.md` · **Output:** `00_script/script-annotated.md` + `00_script/audit.md`

Two questions, answered before anything is designed: *where will this play* (⓪) and
*can the generator actually shoot what the script asks for* (①). The concept never changes
here — only minor, scene-level rewording so every line is shootable.

## ⓪ Format lock (5 minutes, once)

Ask the user (or read from the brief) and record in `state.json → "format"`:

- **Platform** (YouTube, Reels, Meta feed, landing page…), which fixes:
- **Aspect ratio** — non-16:9 means *every* A-roll take is image-to-video with a keyframe,
  and b-roll must use the vertical template system. This is why format comes first.
- **Generator** — `runway` | `veo` | `other`, plus the model (e.g. `Veo 3.1 Fast`):
  `"generator": {"name": "veo", "model": "Veo 3.1 Fast"}`. It decides clip length, phrasing,
  whether the model speaks the lines, and whether the pipeline generates or only writes
  prompts ([generators.md](../generators.md)). Default when the user has no preference: ask —
  don't assume Runway.
- **fps** (default 24) and **target runtime**.
- Any secondary cutdown (e.g. 9:16 primary + 1:1 cutdown from the same EDL).

## ① Script audit

1. **Read the script twice** — once for story, once shot-by-shot.
2. **Route every line**: *seeable* (a person/place/action/feeling → future A-roll) or
   *sayable* (a number/list/name/process/claim → future B-roll). This routing note is not
   the breakdown — it just proves each line has a workable visual home.
3. **Check every seeable moment against the generator's failure list**
   ([runway-prompting.md → Known weak spots](../runway-prompting.md); for Veo also
   [veo-prompting.md](../veo-prompting.md) — talking clips are fine, lines must fit ~21 words
   per 8 s clip):
   - talking-to-camera close-ups / sustained lip-sync
   - legible on-screen text, UI, logos, signage
   - hands doing fine manipulation
   - crowds or 3+ interacting people
   - long or compound camera paths
   - any single continuous action longer than the generator's clip (Runway 10 s, Veo 8 s)
4. **Propose minor rewrites** where a line demands an unshootable image. Rewrites change the
   *staging*, never the concept: "she types the reply" → "she reads the reply and smiles"
   (typing hands are a failure mode; the reaction carries the same story point).
   Anything that can't be reworded gets flagged for B-roll or an overlay instead.
5. **Write the outputs:**
   - `script-annotated.md` — the script with per-line routing, risk flags, and the proposed
     rewording inline (original kept in strikethrough or a comment).
   - `audit.md` — a short table: line → risk → mitigation (reword / B-roll / overlay / accept
     the risk), plus the format-lock decisions and a feasibility verdict.

## Gate 🔍

Present `audit.md` and the annotated script. The user approves the refined script
(`state.json → approved.audit: true`). If unattended, proceed with assumptions listed at the
top of `audit.md`. Update `state.json → "stage": "vision"`.
