# Production log — heyanaya-script3

## 2026-11-04T01:57:01+0530 — Project created
- Flow: storyboard. Next: add the script to 00_script/script.md (see AGENTS.md → Two flows)

## 2026-11-04 — Harness test setup
- Clips were generated before this storyboard (Veo 3.1 Fast in Flow), one per line, 7 clips:
  hook (2 sentences), "One at your first clinic…", "Each one could be…", "Now imagine…",
  "Hey Anaya responds…", "Because growing…", "It's about turning…". They are in 04_clips/.
- They came back in the podcast studio, host centred, with black pillarbox bars and a Veo mark.
- The storyboard must use exactly these 7 lines as its clips.

## 2026-11-04T02:01:41+0530 — Storyboard (storyboarder)
- 02_storyboard/storyboard.json + storyboard.md: 7 clips (podcast-host, CHAR_HOST, LOC_STUDIO_HOST), lines word for word from script.md.
- Layout: full→split · pip · full→split · full→pip · full→split(+LogoBug) · full→pip · split → end card.
- Scenes: UnansweredInbox, ClinicNetworkMap, LostLeadTrail, MissedMonthHeatmap, LogoBug, AnayaBooksIt, LeakyFunnel, SealedFunnel. Thread: the same Arabic patient enquiry (hook) and empty Thu 4:30 slot (03) are answered and filled in 05.
- 03_prompts/clip-01…07 rendered (tools/storyboard-prompts.mjs). Harness fix: schemas/scene-prompt.schema.json now accepts clip-NN ids/output paths (storyboard flow), which the validator previously rejected.
- Known warning: clip 05 is 22 words (~8.1 s vs 7.4 s budget) — kept as the existing clip; check at ingest that "appointments" isn't clipped.
- Illustrative placeholders: branch names, patient name, AED 95/lead, 960 missed/month, "Replied in 3 s". Needed: real numbers, branches, Arabic check, CTA URL.
- Next: user approves storyboard.md (gate), then stage generate → ingest (clips already in 04_clips/).

## 2026-11-04 — Storyboard approved for the harness test by the orchestrator (not the user); clips already exist → ingest

## 2026-11-04 — Scenes (scene-builder)
- Built in remotion/src/projects/heyanaya-script3/ (+ kit.tsx, funnel.tsx shared helpers; index.tsx → SCENES, registered):
  - UnansweredInbox — front-desk chat list (3 unread, one Arabic), settles on "deal", fans into a 7-phone deck on "multiply", branch tags pop in.
  - ClinicNetworkMap — stylised UAE coast, dim branch dots light up as amber pins with "No reply" bubbles on first/second/rest, teal links on "network"; count top-left (clear of pip + captions).
  - LostLeadTrail — bubble → patient card, "AED 95 per lead" stamp (Illustrative), dotted path stalls on "never", Thu 4:30 slot stamped "Not booked".
  - MissedMonthHeatmap — 8 clinics × 30 days (transposed in 9:16), rows build to "chain", cells fill in deepening amber, counter lands on 960 (Illustrative).
  - AnayaBooksIt — Mariam's phone: instant reply + "Replied in 3 s" chip, EN→AR flip, slots highlighted + quick replies, tap, Booked card drops into the same Thu 4:30 slot; HeyAnaya lockup in the panel.
  - LeakyFunnel / SealedFunnel — deterministic dot simulation; tap doubles, leaks spill / HeyAnaya patches seal, tap back to "Same ad spend", week calendar fills on "bookings".
- Storyboard deviations (word timings measured at ingest leave too little hold before the cut):
  - 01 UnansweredInbox.tags "locations" → "across" (branch names need ≥1.3 s; "locations" left 0.87 s).
  - 03 LostLeadTrail.empty "booking+0.3" → "converted" ("booking+0.3" = 5.96 s in a 6.07 s beat: "Not booked" was on screen 0.1 s).
  - 04 MissedMonthHeatmap.fill "missing" → "could", total "month+0.3" → "over" (total landed 0.04 s before the cut; now holds 0.9 s).
  - 06 LeakyFunnel.spill "leads+0.3" → "leads" (0.4 s → 0.7 s before the cut).
  - 05 LogoBug removed: the engine draws it at 12% of frame height, which in 9:16 is the host's eyes for the whole beat (pip→full spring, then split). The brand now lands in the AnayaBooksIt panel (logo + "HeyAnaya" lockup) as he finishes "Hey Anaya". Engine follow-up: make LogoBug aspect-aware (e.g. inside the panel or below the face in 9:16).
- QC: 3 full still passes in both aspects + a cue pass (24 moments either side of cues). framing left as is (face well placed in split and pip).
- Next: editor renders (tools/render.sh heyanaya-script3).

## 2026-11-04 — Stills reviewed by the orchestrator (harness test), both sheets clean → render
