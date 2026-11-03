#!/usr/bin/env bash
# Render a storyboard-flow project in both aspects, master loudness (−14 LUFS / −1 dBTP),
# and optionally make speed variants. Never overwrites: files are named by timeline version.
# usage: tools/render.sh <slug> [--aspect 16x9|9x16|both] [--speed 1.2] [--draft]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
slug="$1"; shift
aspect=both; speed=""; draft=""
while [ $# -gt 0 ]; do case "$1" in
  --aspect) aspect="$2"; shift 2;; --speed) speed="$2"; shift 2;; --draft) draft="--scale=0.5"; shift;;
  *) echo "unknown option $1"; exit 2;; esac; done
TL="$ROOT/projects/$slug/06_edit/timeline.json"
R="$ROOT/projects/$slug/renders"
[ -f "$TL" ] || { echo "no timeline — run tools/build-timeline.mjs $slug"; exit 1; }
v=$(node -e 'console.log(String(require(process.argv[1]).version).padStart(2,"0"))' "$TL")
source "$ROOT/tools/lib/chrome.sh"
mkdir -p "$R"
for a in 16x9 9x16; do
  [ "$aspect" = both ] || [ "$aspect" = "$a" ] || continue
  out="$R/${slug}_v${v}_${a}${draft:+_draft}.mp4"
  [ -e "$out" ] && { echo "✗ $out exists — change the storyboard and rebuild the timeline (new version) first"; exit 1; }
  raw=$(mktemp -d)/raw.mp4
  ( cd "$ROOT/remotion" && npx remotion render src/index.ts "Explainer$a" "$raw" --props="$TL" --codec=h264 --crf=16 --pixel-format=yuv420p --jpeg-quality=95 $draft "${BROWSER_ARGS[@]}" ) | grep -E "^\+|Rendered [0-9]+/[0-9]+, time remaining: 0s" | tail -1 || true
  "$ROOT/tools/master.sh" "$raw" "$out"
  echo "→ $out"
  if [ -n "$speed" ]; then
    sout="${out%.mp4}_${speed}x.mp4"
    ffmpeg -v error -y -i "$out" -filter_complex "[0:v]setpts=PTS/$speed,fps=30[v];[0:a]atempo=$speed[a]" -map "[v]" -map "[a]" \
      -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -c:a aac -b:a 320k -ar 48000 -movflags +faststart "$sout"
    echo "→ $sout"
  fi
done
