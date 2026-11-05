# Project Structure & State

```
ai-video-pipeline/
├── AGENTS.md                  ← the contract (read first)
├── CLAUDE.md                  ← points to AGENTS.md
├── .claude/
│   ├── agents/                ← one subagent per stage
│   └── commands/produce.md    ← /produce <slug> orchestrator
├── docs/
│   ├── stages/01…07           ← how to run each stage
│   ├── generators.md
│   ├── runway-prompting.md
│   ├── veo-prompting.md
│   ├── remotion-broll.md
│   ├── editing-principles.md
│   └── project-structure.md   ← this file
├── schemas/                   ← JSON Schemas for every hand-off file
├── templates/
│   ├── vision-board.md
│   └── prompts/               ← one prompt template per view + generator profiles
├── tools/                     ← new-project, probe, frames, sync, render-prompt, validate
├── remotion/                  ← film flow: renders the EDL · storyboard flow: Explainer16x9/9x16
│   └── src/
│       ├── explainer/         ← storyboard-flow engine: host layouts, captions, end card, primitives
│       └── projects/<slug>/   ← that video's scenes (scene-builder), registered in projects/index.ts
└── projects/
    ├── _template/             ← copied by tools/new-project.sh
    └── <slug>/
        ├── state.json
        ├── log.md
        ├── 00_script/         script.md, script-annotated.md, audit.md,
        │                      vo.wav|mp3, vo.words.json, music.mp3 (optional)
        ├── 01_vision/         vision-board.md, vision-board.json, refs/
        ├── 02_breakdown/      breakdown.json, breakdown.md
        ├── 03_prompts/        scene-XXX.prompt.json, scene-XXX.prompt.md (copy-paste),
        │                      keyframes/ (incl. *_chain.png)
        ├── 04_clips/          scene-XXX_take-NN.mp4
        ├── 05_review/         scene-XXX.review.json, frames/
        ├── 05_broll/          broll-design.json, storyboard.md
        ├── 02_storyboard/     storyboard.json, storyboard.md            (storyboard flow)
        ├── 05_ingest/         ingest.json, words/NN.json, overrides.json (storyboard flow)
        ├── 05_review/stills/  QC stills + sheet_16x9.jpg, sheet_9x16.jpg   (storyboard flow)
        ├── 06_edit/           edl.json (film) · timeline.json (storyboard)
        └── renders/           <slug>_vNN.mp4
```

## state.json

```json
{
  "slug": "clinic-explainer",
  "stage": "prompting",
  "format": { "platform": "reels", "aspect_ratio": "9:16", "fps": 24, "runtime_target_s": 45,
              "generator": { "name": "veo", "model": "Veo 3.1 Fast" }, "audio": "dialogue" },
  "current_scene": "scene-004",
  "current_take": 2,
  "approved": { "audit": true, "vision": true, "breakdown": true, "broll": false, "final": false },
  "updated_at": "2026-09-16T10:30:00+05:30"
}
```

`flow` ∈ `storyboard | film` (absent = film).
`stage` (film) ∈ `audit | vision | breakdown | prompting | review | broll | assembly | done`;
`stage` (storyboard) ∈ `storyboard | generate | ingest | scenes | edit | render | done`.
`waivers` (optional) — `{ "<stage>": "<reason>" }`: the only way past a skipped stage; the
validator errors otherwise.
`format.generator.name` ∈ `runway | veo | other` ([generators.md](generators.md)); absent means
`runway`. `format.audio` ∈ `dialogue | voiceover | none` (asked at intake). Both must match
`vision-board.json → format`.
Any agent resuming work reads `state.json` first, then the last entry in `log.md`.
The validator cross-checks `stage` against the artifacts on disk (rule 8) — an EDL or
renders with an earlier stage is an **error**, so a stale state cannot go unnoticed.

## vo.words.json

Written at stage ② (VO lock), the timing backbone for every later stage:

```json
{ "source": "vo.wav", "duration_s": 41.82,
  "words": [ { "w": "Clinic", "start": 0.04, "end": 0.66 } ] }
```

Gaps ≥ 250 ms between words are breaths: no-animate zones and natural cut points.

## Naming
- Scenes: `scene-001` (3 digits, timeline order). If a scene is inserted later, use `scene-004a`.
- Takes: `take-01`…`take-03`. A scene may resolve as a **stitch** of sub-ranges from several takes.
- Chain frames: `03_prompts/keyframes/scene-XXX_chain.png` — a momentum frame, never the settled tail.
- Renders: `<slug>_v01.mp4`, never overwritten.
