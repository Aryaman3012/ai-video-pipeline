#!/usr/bin/env bash
# Copy a project's clips and audio into remotion/public/projects/<slug>/
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SLUG="${1:?usage: sync-media.sh <slug>}"
SRC="$ROOT/projects/$SLUG"; DEST="$ROOT/remotion/public/projects/$SLUG"
mkdir -p "$DEST/clips" "$DEST/audio"
shopt -s nullglob
cp "$SRC"/04_clips/*.mp4 "$DEST/clips/" 2>/dev/null || true
for f in "$SRC"/00_script/*.{mp3,wav,m4a,aac}; do cp "$f" "$DEST/audio/"; done
echo "Synced to remotion/public/projects/$SLUG (use src paths like projects/$SLUG/clips/scene-001_take-01.mp4)"
