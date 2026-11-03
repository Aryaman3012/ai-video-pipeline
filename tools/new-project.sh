#!/usr/bin/env bash
# Create a new project from projects/_template
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SLUG="${1:?usage: new-project.sh <slug>}"
[[ "$SLUG" =~ ^[a-z0-9-]+$ ]] || { echo "slug must be lowercase letters, digits, dashes"; exit 1; }
DEST="$ROOT/projects/$SLUG"
[[ -e "$DEST" ]] && { echo "projects/$SLUG already exists"; exit 1; }
cp -R "$ROOT/projects/_template" "$DEST"
NOW="$(date +%Y-%m-%dT%H:%M:%S%z)"
sed -i.bak -e "s/__SLUG__/$SLUG/g" -e "s/__NOW__/$NOW/g" "$DEST/state.json" "$DEST/log.md" && rm -f "$DEST"/*.bak
echo "Created projects/$SLUG — add the script to projects/$SLUG/00_script/script.md"
