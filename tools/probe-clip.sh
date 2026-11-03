#!/usr/bin/env bash
# Print duration, fps, resolution of a clip as JSON (needs ffprobe)
set -euo pipefail
CLIP="${1:?usage: probe-clip.sh <clip.mp4>}"
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate,nb_frames:format=duration \
  -of json "$CLIP" | node -e '
const j = JSON.parse(require("fs").readFileSync(0, "utf8"));
const s = j.streams[0]; const [n, d] = s.r_frame_rate.split("/").map(Number);
console.log(JSON.stringify({
  duration_s: +(+j.format.duration).toFixed(3),
  fps: +(n / d).toFixed(3),
  width: s.width, height: s.height,
  frames: s.nb_frames ? +s.nb_frames : null
}, null, 2));'
