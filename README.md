# AI Video Pipeline

Script → format lock & feasibility audit → look + VO lock (word-timed) → scene breakdown → A-roll from per-view prompt templates for the chosen generator (Runway, or prompt-only Veo/other; one scene at a time) → clip review (trim / stitch / retake) → word-timed b-roll design → Remotion assembly with a unification pass, iterated version by version.

**Agents and humans: start with [AGENTS.md](AGENTS.md).**

## Quick start

```bash
npm install                    # validator deps
(cd remotion && npm install)   # Remotion
# needs ffmpeg + ffprobe on PATH

./tools/new-project.sh my-video
# write projects/my-video/00_script/script.md, then in Claude Code:
#   /produce my-video
```

## Try the example

`projects/example-clinic` is a complete 33 s run-through (vision board → 8 scenes → prompts incl. a
retake → reviews → EDL). Its clips are ffmpeg test patterns, so you can see how the pipeline
works without spending Runway credits.

```bash
node tools/validate.mjs example-clinic
./tools/sync-media.sh example-clinic
cd remotion && npx remotion studio          # compositions: Main, BrollGallery
npx remotion render src/index.ts Main ../projects/example-clinic/renders/example-clinic_v02.mp4 \
  --props=../projects/example-clinic/06_edit/edl.json --scale=0.5
```

## Tools

| Command | Does |
|---|---|
| `tools/new-project.sh <slug>` | New project from `projects/_template` |
| `tools/probe-clip.sh <clip>` | Duration / fps / resolution as JSON |
| `tools/extract-frames.sh <clip>` | Review frames every 0.5 s + contact sheet + last frame |
| `tools/extract-frames.sh <render> --edl <edl>` | Frames either side of every cut (render QC) |
| `tools/sync-media.sh <slug>` | Copy clips/audio into `remotion/public/` |
| `node tools/render-prompt.mjs <slug> <scene>` | Render a scene's prompt from its view template for the project's generator → `.prompt.json` + copy-paste `.prompt.md` |
| `node tools/validate.mjs <slug>` | Schema + editorial checks for every hand-off file |
