# AI Video Pipeline

Two flows (see [AGENTS.md → Two flows](AGENTS.md)):

- **Storyboard flow** (default) — a generated person speaks the script; everything else is Remotion.
  Script → `storyboarder` agent designs clips, prompts and a word-cued visual for every beat → you
  generate the clips (or `runway-generate.mjs`) → ingest (transcribe, match, crop, trim, clean) →
  `scene-builder` agent writes this video's scenes → stills QC in 16:9 + 9:16 → render, master,
  speed variants. Guide: [docs/flow-storyboard.md](docs/flow-storyboard.md).
- **Film flow** — narrated films with a separate VO and cut b-roll:
  script → format lock & feasibility audit → look + VO lock (word-timed) → scene breakdown → A-roll from per-view prompt templates for the chosen generator (Runway, or prompt-only Veo/other; one scene at a time) → clip review (trim / stitch / retake) → word-timed b-roll design → Remotion assembly with a unification pass, iterated version by version.

**Agents and humans: start with [AGENTS.md](AGENTS.md).**

## Quick start

```bash
npm install                    # validator deps
(cd remotion && npm install)   # Remotion
# needs ffmpeg + ffprobe on PATH

./tools/new-project.sh my-video                # storyboard flow (default); --flow film for the other
# script → 00_script/script.md · cast still → 01_vision/refs/ · logos → 01_vision/brand/
# then in Claude Code:
#   /produce my-video
# needs: ffmpeg/ffprobe, openai-whisper CLI (`whisper`) for ingest
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

### Storyboard flow

| Command | Does |
|---|---|
| `node tools/storyboard-prompts.mjs <slug>` | Render every storyboard clip / still / b-roll prompt for the generator → `03_prompts/` + `ALL-PROMPTS.md` |
| `node tools/runway-generate.mjs <slug> [ids] [--dry-run]` | Runway profile only: generate clips via the API (`RUNWAYML_API_SECRET`) |
| `python3 tools/ingest.py <slug>` | Transcribe + match takes to clips, crop bars, trim to speech, clean audio, word timings; silent b-roll; `05_ingest/overrides.json` for take/trim/stitch |
| `node tools/register-scenes.mjs` | Register `remotion/src/projects/<slug>/` scene components |
| `node tools/build-timeline.mjs <slug>` | Resolve every word cue → `06_edit/timeline.json` (versioned) |
| `tools/stills.sh <slug> [16x9\|9x16\|both] [sec …]` | QC stills + contact sheets → `05_review/stills/` |
| `tools/render.sh <slug> [--speed 1.2] [--draft]` | Render both aspects, master to −14 LUFS / −1 dBTP → `renders/<slug>_vNN_<aspect>.mp4` |

Worked example (reference, not a template): [docs/examples/heyanaya-script3](docs/examples/heyanaya-script3/).
