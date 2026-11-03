# Production log — harness-selftest

## 2026-11-04T02:22:12+0530 — Project created
- Flow: storyboard. Next: add the script to 00_script/script.md (see AGENTS.md → Two flows)

## 2026-11-04 — Harness self-test
- Exercises: keyframe + b-roll prompts, silent b-roll ingest, stitch override (05_ingest/overrides.json),
  per-beat framing, built-in Footage (under + beside) and LogoBug, end card, stills in both aspects.
- Needs clips not in git: copy two heyanaya-script3 clips (d1151a30, 98f359da) into 04_clips/ and
  make a test-pattern b-roll: ffmpeg -f lavfi -i testsrc2=size=1280x720:rate=24:duration=6 04_clips/broll-b01_take-01.mp4
- Run: python3 tools/ingest.py harness-selftest --model small.en && node tools/build-timeline.mjs harness-selftest && tools/stills.sh harness-selftest both 1 3.5 9 15
