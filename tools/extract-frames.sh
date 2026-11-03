#!/usr/bin/env bash
# Extract review frames + a contact sheet from a clip (needs ffmpeg).
#   extract-frames.sh <clip.mp4> [--every 0.5] [--out DIR]
#   extract-frames.sh <render.mp4> --edl <edl.json> [--out DIR]   # one frame either side of every cut
set -euo pipefail
CLIP="${1:?usage: extract-frames.sh <clip> [--every S] [--edl edl.json] [--out DIR]}"; shift
EVERY=0.5; EDL=""; OUT=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --every) EVERY="$2"; shift 2;;
    --edl) EDL="$2"; shift 2;;
    --out) OUT="$2"; shift 2;;
    *) echo "unknown arg $1"; exit 1;;
  esac
done
BASE="$(basename "${CLIP%.*}")"
if [[ -z "$OUT" ]]; then
  # projects/<slug>/04_clips/x.mp4 -> projects/<slug>/05_review/frames/x
  PROJ="$(cd "$(dirname "$CLIP")/.." && pwd)"
  OUT="$PROJ/05_review/frames/$BASE"
fi
mkdir -p "$OUT"

if [[ -n "$EDL" ]]; then
  TIMES=$(node -e '
const e = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
let t = 0; const out = [];
for (const s of e.segments) { if (t > 0) out.push(Math.max(0, t - 0.1).toFixed(2), (t + 0.1).toFixed(2)); t += s.duration_s; }
console.log(out.join(" "));' "$EDL")
  i=0
  for ts in $TIMES; do
    ffmpeg -v error -y -ss "$ts" -i "$CLIP" -frames:v 1 "$OUT/cut_$(printf %03d $i)_${ts}s.png"; i=$((i+1))
  done
  echo "Wrote $i cut frames to $OUT"
else
  ffmpeg -v error -y -i "$CLIP" -vf "fps=1/$EVERY" "$OUT/f_%03d.png"
  ffmpeg -v error -y -sseof -0.05 -i "$CLIP" -frames:v 1 -update 1 "$OUT/last.png"
  N=$(ls "$OUT"/f_*.png | wc -l)
  COLS=5; ROWS=$(( (N + COLS - 1) / COLS ))
  ffmpeg -v error -y -i "$CLIP" \
    -vf "fps=1/$EVERY,scale=384:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.6,tile=${COLS}x${ROWS}" \
    -frames:v 1 "$OUT/contact_sheet.png" 2>/dev/null \
  || ffmpeg -v error -y -i "$CLIP" -vf "fps=1/$EVERY,scale=384:-1,tile=${COLS}x${ROWS}" -frames:v 1 "$OUT/contact_sheet.png"
  echo "Wrote $N frames, last.png and contact_sheet.png to $OUT (frame k is at $(echo "$EVERY")*(k-1) s)"
fi
