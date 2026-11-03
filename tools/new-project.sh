#!/usr/bin/env bash
# Create a new project from projects/_template
# usage: new-project.sh <slug> [--flow storyboard|film]   (default: storyboard)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SLUG="${1:?usage: new-project.sh <slug> [--flow storyboard|film]}"
FLOW=storyboard
[[ "${2:-}" == "--flow" ]] && FLOW="${3:?--flow needs storyboard or film}"
[[ "$FLOW" == storyboard || "$FLOW" == film ]] || { echo "flow must be storyboard or film"; exit 1; }
[[ "$SLUG" =~ ^[a-z0-9-]+$ ]] || { echo "slug must be lowercase letters, digits, dashes"; exit 1; }
DEST="$ROOT/projects/$SLUG"
[[ -e "$DEST" ]] && { echo "projects/$SLUG already exists"; exit 1; }
cp -R "$ROOT/projects/_template" "$DEST"
NOW="$(date +%Y-%m-%dT%H:%M:%S%z)"
STAGE=$([[ "$FLOW" == storyboard ]] && echo storyboard || echo audit)
sed -i.bak -e "s/__SLUG__/$SLUG/g" -e "s/__NOW__/$NOW/g" -e "s/__FLOW__/$FLOW/g" -e "s/__STAGE__/$STAGE/g" "$DEST/state.json" "$DEST/log.md" && rm -f "$DEST"/*.bak
if [[ "$FLOW" == storyboard ]]; then
  mkdir -p "$DEST/02_storyboard" "$DEST/05_ingest" "$DEST/01_vision/brand"
  echo "Created projects/$SLUG (storyboard flow) — add 00_script/script.md, the cast still to 01_vision/refs/, logos to 01_vision/brand/, then run the storyboarder"
else
  echo "Created projects/$SLUG (film flow) — add the script to projects/$SLUG/00_script/script.md"
fi
