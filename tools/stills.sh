#!/usr/bin/env bash
# QC stills for a storyboard-flow project: key frames of every beat in both aspects,
# plus a contact sheet per aspect. LOOK at the sheets before rendering.
# usage: tools/stills.sh <slug> [16x9|9x16|both] [second ...]
#   default times: each beat at +0.3 s, its middle, and −0.4 s from its end; plus the end card.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
slug="$1"; aspect="${2:-both}"; shift $(( $# > 1 ? 2 : 1 )) || true
TL="$ROOT/projects/$slug/06_edit/timeline.json"
OUT="$ROOT/projects/$slug/05_review/stills"
[ -f "$TL" ] || { echo "no timeline — run tools/build-timeline.mjs $slug"; exit 1; }
source "$ROOT/tools/lib/chrome.sh"
frames=$(node -e '
const t = require(process.argv[1]); const fps = t.fps; const extra = process.argv.slice(2).map(Number);
let at = 0; const out = [];
if (extra.length) out.push(...extra.map((s) => Math.round(s * fps)));
else {
  for (const b of t.beats) { const n = Math.floor(b.dur * fps); out.push(at + Math.round(0.3 * fps), at + Math.round(n / 2), at + n - Math.round(0.4 * fps)); at += n; }
  if (t.end_card) out.push(at + Math.round(t.end_card.seconds * fps * 0.7));
}
console.log(out.join(" "));' "$TL" "$@")
mkdir -p "$OUT"; rm -f "$OUT"/*.jpg
BUNDLE=$(mktemp -d)/bundle
( cd "$ROOT/remotion" && npx remotion bundle src/index.ts --out-dir="$BUNDLE" >/dev/null )
for a in 16x9 9x16; do
  [ "$aspect" = both ] || [ "$aspect" = "$a" ] || continue
  scale=$([ $a = 16x9 ] && echo 0.5 || echo 0.4)
  for fr in $frames; do
    ( cd "$ROOT/remotion" && npx remotion still "$BUNDLE" "Explainer$a" "$OUT/${a}_$(printf %05d $fr).jpg" --props="$TL" --frame="$fr" --scale=$scale "${BROWSER_ARGS[@]}" >/dev/null )
  done
  cols=$([ $a = 16x9 ] && echo 3 || echo 6)
  ffmpeg -v error -y -pattern_type glob -i "$OUT/${a}_*.jpg" -vf "tile=${cols}x$(( ( $(ls "$OUT"/${a}_*.jpg | wc -l) + cols - 1 ) / cols ))" -frames:v 1 "$OUT/sheet_$a.jpg"
  echo "→ $OUT/sheet_$a.jpg ($(ls "$OUT"/${a}_*.jpg | wc -l | tr -d ' ') frames)"
done
