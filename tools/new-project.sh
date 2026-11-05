#!/usr/bin/env bash
# Create a new project from projects/_template
# usage: new-project.sh <slug> [--flow storyboard|film] [--generator runway|veo|other]
#                              [--model "Veo 3.1 Fast"] [--audio dialogue|voiceover|none]
# Flow defaults to storyboard. --generator/--model/--audio are the new-video intake answers
# (AGENTS.md → Starting a project); they are written into state.json → format.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
USAGE="usage: new-project.sh <slug> [--flow storyboard|film] [--generator runway|veo|other] [--model NAME] [--audio dialogue|voiceover|none]"
SLUG="${1:?$USAGE}"; shift
FLOW=storyboard GENERATOR="" MODEL="" AUDIO=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --flow) FLOW="${2:?--flow needs storyboard or film}"; shift 2 ;;
    --generator) GENERATOR="${2:?--generator needs runway, veo or other}"; shift 2 ;;
    --model) MODEL="${2:?--model needs a name}"; shift 2 ;;
    --audio) AUDIO="${2:?--audio needs dialogue, voiceover or none}"; shift 2 ;;
    *) echo "$USAGE"; exit 1 ;;
  esac
done
[[ "$FLOW" == storyboard || "$FLOW" == film ]] || { echo "flow must be storyboard or film"; exit 1; }
[[ -z "$GENERATOR" || "$GENERATOR" =~ ^(runway|veo|other)$ ]] || { echo "generator must be runway, veo or other"; exit 1; }
[[ -z "$AUDIO" || "$AUDIO" =~ ^(dialogue|voiceover|none)$ ]] || { echo "audio must be dialogue, voiceover or none"; exit 1; }
[[ "$SLUG" =~ ^[a-z0-9-]+$ ]] || { echo "slug must be lowercase letters, digits, dashes"; exit 1; }
DEST="$ROOT/projects/$SLUG"
[[ -e "$DEST" ]] && { echo "projects/$SLUG already exists"; exit 1; }
cp -R "$ROOT/projects/_template" "$DEST"
NOW="$(date +%Y-%m-%dT%H:%M:%S%z)"
STAGE=$([[ "$FLOW" == storyboard ]] && echo storyboard || echo audit)
sed -i.bak -e "s/__SLUG__/$SLUG/g" -e "s/__NOW__/$NOW/g" -e "s/__FLOW__/$FLOW/g" -e "s/__STAGE__/$STAGE/g" "$DEST/state.json" "$DEST/log.md" && rm -f "$DEST"/*.bak
if [[ -n "$GENERATOR$AUDIO" ]]; then
  GENERATOR="$GENERATOR" MODEL="$MODEL" AUDIO="$AUDIO" node -e '
    const fs = require("fs"), f = process.argv[1], st = JSON.parse(fs.readFileSync(f, "utf8"));
    const { GENERATOR: g, MODEL: m, AUDIO: a } = process.env;
    st.format = { ...(st.format ?? {}), ...(g ? { generator: { name: g, model: m || null } } : {}), ...(a ? { audio: a } : {}) };
    fs.writeFileSync(f, JSON.stringify(st, null, 2) + "\n");' "$DEST/state.json"
fi
if [[ "$FLOW" == storyboard ]]; then
  mkdir -p "$DEST/02_storyboard" "$DEST/05_ingest" "$DEST/01_vision/brand"
  echo "Created projects/$SLUG (storyboard flow) — add 00_script/script.md, the cast still to 01_vision/refs/, logos to 01_vision/brand/, then run the storyboarder"
else
  echo "Created projects/$SLUG (film flow) — add the script to projects/$SLUG/00_script/script.md"
fi
