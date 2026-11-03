# Production log — anaya-after-eight

## 2026-09-16T17:27:14+0530 — Project created
- Next: add script to 00_script/script.md, then vision-director

## 2026-09-16T17:30:00+0530 — Script added
- Produced: 00_script/script.md (VO only, 42 s target), 00_script/script-annotated.md (timings, visual direction, on-screen TEXT)
- Assumptions: none — script supplied verbatim by the user
- Next: vision-director → 01_vision/
- Open questions: aspect ratio (Meta feed 4:5 vs Reels 9:16), and whether the on-camera presenter is real footage or Runway-generated

## 2026-09-16T17:34:00+0530 — Direction locked (user decision, pre-stage ①)
- Format: 9:16 primary, plus a 1:1 cutdown rendered from the same EDL/clips.
- Presenter: Runway-generated, not filmed. Must hold identity across the 4 on-camera
  scenes (hook, reframe, reassure, CTA) — vision board needs a cast bible entry with a
  single locked keyframe reused for every take.
- Consequence (validator-enforced): project is non-16:9, so EVERY A-roll take must be
  mode `image_to_video` with a keyframe in 03_prompts/keyframes/. No text-to-video takes.
- Consequence: the three screen-recording blocks (WhatsApp inbox, Ads Manager, Anaya
  dashboard) are Remotion B_ROLL UI mockups, not Runway. Expect A-roll ratio near 0.5;
  set `strategy.a_roll_ratio` on the vision board accordingly so the rhythm check agrees.
- Next: vision-director → 01_vision/

## 2026-09-16T17:36:25+05:30 — Stage ① complete (vision-director), awaiting user approval
- Produced: 01_vision/vision-board.md + 01_vision/vision-board.json (validates clean: 0 errors, 0 warnings)
- Locked direction honoured: 9:16 · 1080×1920 · 24 fps primary with a 1:1 1080×1080 cutdown from the same EDL; presenter is Runway-generated; every A-roll take is image_to_video; the three screen blocks are Remotion B_ROLL.
- strategy.a_roll_ratio set to 0.48 (overrides the 60–70 % house default). Expected shape: A-roll 20 s (hook 3 + front-desk insert 3 + reframe 4 + reassure 4 + CTA 6) vs B-roll 22 s = 0.476, so the stage ② rhythm check should pass.
- Identity lock: ONE master keyframe (char-presenter-master.png, ≥1440×2560) reused as the input image for all four on-camera takes; crops permitted down to 720×1280 of the master; takes differ only in camera move and body language.
- Assumptions (listed at the top of the board, unattended): VO pace ~165 wpm; presenter cast as a woman in her mid-30s, Middle Eastern, no headscarf; English ad with one Arabic proof moment inside the phone mockup; Ads Manager shown in its mobile app form; one A-roll insert added — the empty front desk at night on "Your front desk never saw her."
- Next: user approves tone / look / palette / cast descriptors / A-B ratio, then script-breakdown → 02_breakdown/
- Open questions: (1) lip-sync — 17 s of presenter on camera conflicts with Runway's documented talking-to-camera weak spot; mitigations and a fallback are on the board. (2) No Remotion template renders app UI; a new `PhoneUI` template (variant: inbox | thread | ads | dashboard) must be added to registry.tsx, docs/remotion-broll.md and the templateRef enum in schemas/edl.schema.json, or the three proof blocks fall back to existing cards. (3) Presenter casting (gender, headscarf) is cheap to change now and expensive after the master keyframe is approved.

## 2026-09-16T18:05:00+0530 — Vision board revised: theme locked as "clean night"
- Trigger: user flagged A-02 reading retro and inconsistent lighting across prompts.
- Root cause: look.visual_style ("unglamorous documentary realism, no stylisation") contradicted
  look.lighting (amber key / teal fill = the orange-and-teal blockbuster grade). Retro cues —
  brass lamp, dust in the beam, 35 mm grain, deep navy falloff — all inherited from the board.
  The desk-lamp key was also physically unmotivated for a waist-up medium, so Runway resolved it
  differently each generation, attacking the one-master-keyframe identity lock. And grading the
  footage amber/teal left the amber/teal graphics with no ground to sit against.
- Changed in 01_vision/vision-board.{json,md}: look.visual_style, look.lighting, look.texture,
  look.theme_name ("clean night"), reference_frames 1-2, cast descriptors for CHAR_PRESENTER /
  LOC_CLINIC_RECEPTION_NIGHT / LOC_FRONT_DESK_EMPTY, palette accent row, do #4, new dont #0.
- Grain dropped, so the 720p-vs-1080p fix moves to Remotion at stage 5 (light uniform soften on
  the A-roll layer). Flag for assembly-editor.
- All five A-roll prompts regenerated on the new theme; earlier prompt files marked superseded.
- Validator: 0 errors, 0 warnings. state.json still stage vision, approved.vision false.
- Next: user approves the revised board, then script-breakdown.

## 2026-09-16T18:40:00+0530 — One ground; desk insert cut; jump cut fixed
- Trigger: user — "the cuts should be based on the same background".
- Root cause (second unreconciled contradiction in this board): palette declared #0B1622 "the whole
  film sits on this" and the B-roll frames sat on near-black, while the A-roll sat in a lit clinic
  falling to soft desaturated slate. The film would have alternated between a room and a void on
  every cut.
- Fix: look.ground added. Every B-roll card renders over PLATE_CLINIC_DEFOCUSED (new cast entry —
  the presenter master, presenter removed, blurred). #0B1622 demoted from full-frame fill to the
  deepest value in that plate and the phone-UI chrome.
- Found while checking: REASSURE (32-36s) cuts straight into CTA (36-42s), the only A-roll-to-A-roll
  cut in the film, and both were locked-off mediums of the same subject in the same spot — a jump
  cut. look.cut_grammar added; CTA opens out to medium-wide with a slow push-in.
- A-02 desk insert cut. It was invented to lift the ratio to 0.48. strategy.a_roll_ratio now 0.40,
  describing the edit rather than driving it. LOC_FRONT_DESK_EMPTY removed — the project now needs
  one keyframe instead of two. AGITATE pacing moves inside the Remotion card (columns populating,
  lead count climbing while replies hold at zero).
- Four A-roll shots remain: hook, reframe, reassure, CTA. Prompts regenerated.
- Validator: 0 errors, 0 warnings. state.json still stage vision, approved.vision false.

## 2026-09-16T19:20:00+0530 — Presenter recast as a male doctor
- User decision: presenter is now a male doctor, not a woman in a blazer.
- CHAR_PRESENTER rewritten: man, late 30s, Middle Eastern, warm olive skin, short dark hair,
  closely trimmed beard, crisp open white clinician's coat over a light-blue collared shirt.
- Checked and deliberately NOT changed: the "she / her" in the AGITATE VO refers to the
  prospective patient, not the presenter. Those three references stay exactly as scripted.
- Board swept for female-coded presenter references — assumptions[2], reference frames 1/3/4,
  cast row, identity-lock block and risk 1 all updated. Zero remain.
- assumptions[6] was still describing the desk insert as present; corrected to match the md,
  which had already recorded it as cut.
- All seven generation prompts regenerated. Vanilla confirmed: 0 camera moves or baked effects.
  VO coverage still exactly the 121 scripted words.
- Validator: 0 errors, 0 warnings. state.json still stage vision, approved.vision false.

## 2026-09-16T21:15:00+0530 — Stage ⑤ v03: vertical b-roll system + copy change
- Trigger: user rejected v01 as visually poor; asked for a slick modern look with real animation,
  b-roll on our own components, CTA changed from a free audit to a demo, and the Anaya VO refocused
  on instant answers and converting leads.
- Root cause of v01: every template in cards.tsx/data.tsx is sized for landscape. At 720 wide the
  Stage padding leaves 576px and BarChart reserves 560px of fixed columns, so bars drew at 16px —
  effectively invisible. Fonts were never loaded either, so everything fell back to serif.
- Built remotion/src/broll/vertical.tsx — a 9:16 system with one idea: TIME IS THE SYSTEM. Every
  card is anchored to a clock; nothing fades in, things arrive by counting. Amber counts up
  (elapsed, unanswered); teal fills or resolves (answered, converted). Components: ChatInbox,
  CountUp, SpendBars, OvernightReport, ReplyThread, CapabilityTicks, EndCard, plus VCaption and
  VTag overlays. No fixed pixel columns, so layout holds at any vertical size.
- ONE GROUND implemented for real: remotion/public/.../plates/clinic-defocused.jpg, pulled from
  scene-004 above the presenter's head, blurred and darkened. Every b-roll card renders over it,
  so cuts stay in the same room. #0B1622 is now the deepest tone in that plate, never a flat fill.
- Fonts wired: @remotion/google-fonts IBM Plex Sans Arabic (installed, was missing).
- Registry + schemas/edl.schema.json enums extended with the seven new templates and two overlays.
- Copy: CTA is now "Tap for a demo" (free reply audit removed from VO, TEXT and end card).
  SOLUTION VO rewritten to lead with instant answers and lead conversion. Script is 111 words.
- Fixed after first pass: OvernightReport label overran its ring (moved below); ReplyThread beats
  were timed past the end of a 3.5 s segment (tightened to land by 1.7 s).
- Renders: v01 (rejected), v02, v03. v03 is current. Validator 0 errors, 0 warnings, typecheck clean.
- STILL OPEN: b-roll carries no audio — 4 of 7 VO generations do not exist. Hook clip wardrobe
  (grey tee) mismatches scenes 004/008 (blue shirt). Clip scene-001 has invented "...TH CLINIC"
  lettering on the counter.

## 2026-09-16T22:10:00+0530 — Harness updated with this project's learnings
Written back into the pipeline contract so the next project starts from these, not from scratch.

- AGENTS.md: A-roll is no longer defined as silent picture (models generate synced speech); VO
  added to the vocabulary and to the pipeline diagram as an input; five new hard rules —
  (11) check for model audio before designing the pipeline, (12) one VO source for the whole
  film, (13) b-roll shows rather than restates, (14) generate vanilla clips, (15) cut b-roll as
  an L-cut with audio on its own track.
- docs/runway-prompting.md: new sections on model audio + VO harvesting, the sequenced-beat
  prompt format with the byte-identical preamble rule, and vanilla-clip generation. Two observed
  weak spots added to the table: invented brand signage ("...TH CLINIC" on a counter) and
  wardrobe drift between takes.
- docs/editing-principles.md: new "Placing B-roll" section — cut away mid-thought, L-cut/J-cut
  at 1-2 s offset (3 s breaks it), hold cutaways 2-5 s, decouple audio from picture. B-roll
  ceiling tightened to a hard 2-5 s.
- docs/remotion-broll.md: aspect-ratio warning with the measured failure (BarChart drew 16 px
  bars at 720 wide because fixed columns ate 560 of 576 usable px), font-loading requirement,
  and how to build a ground plate from a clip with ffmpeg. Adding a template now also requires
  updating the edl schema enum.
- docs/stages/01-vision-board.md: self-consistency check before hand-off — look vs lighting,
  palette ground vs look ground, motivated light, brand colour as light, shots that exist only
  to hit a ratio, cast bible vs shot list.
- docs/stages/02-script-breakdown.md: prefer measured audio (estimates ran ~15 % short); check
  every block, not just the total; derive a_roll_ratio rather than inheriting it.
- docs/stages/05-assembly.md: VO goes on the audio track even when harvested from clips;
  clip_audio is only for stretches where nothing cuts away.
- schemas/scene-prompt.schema.json: the negative-phrasing rule now ignores text inside quotes,
  so VO dialogue like "It's not your team" validates while real negative prompting still fails.
  Verified against four cases (2 must-pass, 2 must-fail) — all correct.
- remotion/src/types.ts + Main.tsx: clip_audio / clip_volume (added earlier this session).

## 2026-09-16T23:30:00+0530 — v05: L-cut edit with the messaging b-roll system
- Audio decoupled from picture. Clip audio extracted to 00_script/vo/{hook,reframe,reassure}.wav
  and placed on the EDL audio[] track at 0.00 / 19.56 / 36.46. Clips are now muted picture, so
  the picture can cut away while the voice continues. This is what AGENTS.md rule 15 requires.
- Two real L-cuts, both at ~1.5 s offset (the 1-2 s sweet zone): the hook picture cuts to the
  inbox at 3.60 s while his voice runs to 5.06 s; verified in the render — silencedetect shows
  unbroken audio to 5.07 s across a picture cut at 3.60 s.
- New b-roll system in remotion/src/broll/thread.tsx: ChatList, ChatThread, AdsRow, CalendarSlot.
  Spine is one enquiry followed through six states — arrives 9:04 PM unread, a competitor answers
  it at 9:11 PM, it becomes a highlighted row in a spend report, it is still unread at 7:00 AM,
  Anaya answers it at 9:04 PM in Arabic, it is qualified and booked into Thursday 6:30 pm, then
  followed up on day 5. The UI holds the same screen position across those states so the cuts
  between them read as match cuts.
- Colour carries the argument: amber = unanswered/elapsed, teal = answered/converted, slate =
  someone else's clinic.
- 13 picture segments, 47.51 s, A-roll 14.23 s (30%). Cutaway holds 2.26-4.20 s, all inside the
  2-5 s rule; the 6 s end card is a card, not a cutaway.
- A-roll is uninterrupted at the three moments where a person is the content: hook, reframe,
  reassurance.
- Fixed during QC: the scrolling list rendered over the app header (z-order), and the Ads Manager
  panel sat high with dead space beneath it.
- Registry + edl schema enum extended with the four new templates.
- Validator 0/0, typecheck clean. Renders v04 then v05; v05 is current.
- STILL OPEN: 4 of 7 VO generations do not exist, so 5.07-19.62 s and 26.53-36.46 s and the end
  card play silent. Picture is locked; those tracks drop straight into audio[] when generated.

## 2026-09-17T00:40:00+0530 — v06: cards built individually, then combined
- Workflow changed at the user's direction: each b-roll screen was built and rendered on its own
  before anything was combined. Added a "Card" composition to remotion/src/Root.tsx so a single
  templateRef renders as a still or clip — reviewing one screen no longer costs a 47 s render.
- New file remotion/src/broll/wa.tsx. WhatsApp Business dark mode in WhatsApp's OWN palette
  (#0B141A ground, #202C33 panels, #005C4B outgoing, #00A884 badges, #53BDEB read ticks), not the
  brand palette. Reason: the b-roll only works if the viewer recognises their own inbox; a screen
  in our teal reads as a graphic. Brand colour now appears only on the end card.
- Three defects the user identified in v05, all fixed:
  1. UI colours were the brand's, not WhatsApp's.
  2. Contacts were blurred grey bars, which read as redaction rather than an inbox. Now real
     names, coloured initial avatars, distinct preview text, unread counts.
  3. Bubble sides were wrong because the film changed whose phone it was showing. Perspective is
     now fixed and documented in the WAMsg type: every screen is the CLINIC'S account, patient
     incoming (left), clinic/Anaya outgoing (right).
- Competitor scene CUT. It was the only screen that could not be the clinic's own account, so it
  forced the perspective flip. "She booked elsewhere" is carried by the ads row and the
  still-unread thread instead.
- Components: WAInbox, WAThread, WACalendar (second surface, different app), MetaAds (Meta's own
  greys and blue). Status bar, conversation header, date chips, typing indicator, input bar —
  the chrome is most of what makes a mockup read as a screen.
- Placeholder: "Al Noor Dental" appears in exactly two props (inbox account, ads account).
- Timeline: 12 picture segments, 47.52 s, A-roll 14.23 s (30%). Cutaway holds 2.26-4.66 s, none
  outside the 2-5 s rule. Hook L-cut verified in the render: picture cuts at 3.60 s, audio
  unbroken to 5.07 s.
- Validator 0/0, typecheck clean.
- STILL OPEN: 4 of 7 VO generations missing, so the b-roll stretches play silent. VO-C/D/E need
  regenerating against the revised Anaya and CTA copy.

## 2026-09-17T01:05:00+0530 — v07: real VO track, picture cut to the transcript
- User supplied "Flo Voice Labs (16).wav" — a single 43.11 s read of the whole script — and asked
  for the A-roll to be matched to it.
- Transcribed it locally with whisper.cpp (brew) + ggml-base.en pulled to the scratchpad. The
  transcript matches 00_script/script.md exactly. This mattered: my earlier mapping, inferred
  from pause structure alone, put REFRAME at 19.45-24.02 s when it actually runs 21.52-25.92 s —
  roughly 2 s out. Word-level timings (-ml 1) gave the cut points.
- Audio normalised to -14 LUFS / -1.5 TP. The source peaked at 0.0 dBFS (clipping); it now peaks
  at -4.4 dB in the render, inside the board's <= -1 dBTP target.
- Picture re-cut so all 13 segment boundaries land on real word boundaries. 12 of the 13 VO lines
  begin exactly on a picture cut; the 13th is the hook, which starts 0.665 s into the film while
  his face is already on screen.
- LIP SYNC, measured and reported honestly: this is a different performer from the voice inside
  the Runway clips, so true sync is impossible. Retiming to fill each block would have needed
  0.77x / 1.27x / 1.92x playback — all visible. Instead every clip is TRIMMED to fit its block at
  natural speed (hook 4.18 s of 5.06 s, reframe 4.40 of 5.57, reassure 2.63 of 5.06), so nothing
  is stretched and his mouth moves only while speech is happening. Phoneme-level mismatch remains
  and is unavoidable without an audio-driven lip-sync pass.
- New shot b4-gone covers "By morning, she's booked with whichever clinic replied first." — her
  thread now carries a second incoming message, "Never mind — I've booked somewhere else." Visible
  in the clinic's own account, so the single-perspective rule holds and the competitor screen
  stays cut.
- 13 segments, 43.11 s, A-roll 11.21 s (26%). Validator 0/0.
- Trade-off taken: the day-5 follow-up card was dropped. The VO gives "books the slot into your
  calendar and follows up until they show" only 4.88 s, which will not carry three cards above the
  2 s floor. The calendar card covers the booking; the follow-up claim is now unillustrated.

## 2026-09-17T01:20:00+0530 — v08 (current): head silence trimmed
- Measured the lead-in at four thresholds: exactly 0.665 s of head silence, not the 1-1.5 s
  estimated. Trimmed the VO to flo-vo.wav (42.448 s) and took the same 0.665 s off the opening
  A-roll segment so every downstream cut keeps its word alignment.
- Re-verified after the shift: 13/13 VO lines now begin exactly on a picture cut (was 12/13 —
  the hook now starts on its first word instead of 0.665 s into the film).
- Render: 42.47 s, peaks -4.4 dB, head silence down to 0.18 s (the breath inside the first word).
- Validator 0/0.

## 2026-09-17T01:50:00+0530 — v09 (current): clips matched to the VO word for word
- Transcribed the three A-roll clips with whisper.cpp. TWO OF THE THREE WERE IN THE WRONG PLACE
  for the entire edit up to v08 — my earlier mapping was inferred from pause patterns and was wrong:
    scene-001 = HOOK        (correct all along)
    scene-004 = PROBLEM     "Scroll to everything that came in after eight..."  (had it as REFRAME)
    scene-008 = REFRAME     "It's not your team. The desk closes at eight..."   (had it as REASSURE)
  There is NO reassurance clip. The three-burst pattern I read as "Same number / Same team /
  Same system" was "It's not your team / The desk closes at eight / The enquiries don't."
- Each clip is now under the VO line whose words its lips are actually forming, with a
  least-squares fit of clip word times to VO word times:
    a2-problem  playback_rate 0.901, mean residual 83 ms (2.0 frames)
    a3-reframe  playback_rate 1.128, mean residual 95 ms (2.3 frames)
  Both retimes are ~10-13%, at the edge of perceptible; the sync is the best achievable without
  an audio-driven lip-sync pass.
- The hook clip cannot sync: it needs rate 0.684 (32% slow) for a 216 ms mean residual, AND the
  Runway take omits a word — it says "open your WhatsApp tonight" where the VO says "open your
  WhatsApp Business tonight". So it is used for 1.5 s only, where drift stays under ~130 ms, then
  L-cuts away. Face opens the film without carrying a line it cannot lip-sync.
- REASSURE has no clip, so the day-5 follow-up thread carries "Same number. Same team. Same
  system." That also restores the follow-up card dropped in v07.
- Head silence re-measured in 20 ms windows: the VO's first phoneme is at 0.04 s. There is no
  removable lead-in left; the -120 dB gaps at 0.14-0.28 s are inside the word "Clinic" (this TTS
  writes true digital silence between phonemes).
- 14 segments, 42.45 s, A-roll 8.90 s (21%). Validator 0/0.

## 2026-09-17T02:10:00+0530 — v10 (current): hook pauses spliced out
- The perceived "second of delay" was never head silence — the first phoneme sits at 0.04 s. It
  was the delivery: a 0.79 s gap between "Clinic owners," and "if you're running", and 1.00 s of
  total silence inside the first 8 s.
- Compressed four pauses in the hook to 50 ms each (0.63-0.81, 1.26-1.46, 4.08-4.24, 6.17-6.46),
  removing 0.630 s. Left the 0.09-0.25 s gap alone — it is between the phonemes of "Clinic" and
  cutting it would clip the word.
- flo-vo-tight.wav is 41.818 s (was 42.448). Silence in the first 8 s: 1.76 s -> 1.23 s.
- Every segment boundary remapped through the splice, so all word alignment and both clip fits
  (a2-problem 0.901, a3-reframe 1.128) still hold. EDL total matches the VO exactly.
- 14 segments, 41.82 s. Validator 0/0.

## 2026-09-17T02:30:00+0530 — v11 (current): hook clip cut, film opens on the inbox
- User reported the hook clip's mouth running ~0.5 s ahead of the VO. Measured the cause:
    word      VO duration   clip duration
    Clinic       0.62 s        0.23 s
    owners       0.20 s        0.48 s
  The two readings are INVERTED. The TTS drags "Clinic" across 0.62 s in three fragments with
  digital silence between phonemes, then says "owners" in 0.20 s; the clip does the reverse.
  No single offset or playback rate aligns both words — fixing one puts the other ~280 ms out.
- My own splice in v10 made it worse: I compressed the pause after "Clinic owners," which the
  clip still contains, so picture and voice diverged exactly where the face was on screen.
- a1-hook removed. The film now opens on the clinic's own inbox at 11:52 PM; the two inbox cards
  absorb the freed 1.220 s. First face is a2-problem at 5.95 s, the shot whose word-level fit is
  0.901 with 2.0 frames of mean drift.
- A-roll 7.40 s of 41.82 s (18%). 13 segments. Validator 0/0.
- Standing conclusion: of the three Runway clips, only two can carry a line against this VO.
  The hook needs either a re-generated take timed to this read, or a lip-sync pass.

## 2026-09-17T02:45:00+0530 — v12 (current): hook restored, aligned to the loud onset
- User was right that the lag was real. Measured the word at 5 ms resolution:
    0.000-0.095  "Cl"   -13 dB | 0.100-0.255 silence | 0.260-0.335 "i" -17 dB
    0.340-0.395  silence | 0.400-0.615 "nic" -8 dB   | 0.700-0.875 "owners"
  The ear registers the word at 0.40 s where it gets loud, not at 0.00 s — that is the ~0.5 s lag.
- A clean 0.5 s cut is impossible: it lands mid-phoneme inside "nic". Instead trimmed 0.100 s
  (the leading "Cl" click, a clean boundary) and DELAYED the clip to meet the loud onset:
  in_s 0.280 so his mouth starts at 0.300 s, exactly where the voice lands.
- Result: "owners" drifts only -60 ms (1.4 frames). Hook clip runs 1.100 s, cutting away before
  "if you're running" where the two readings diverge past 190 ms.
- a1-hook restored. A-roll back to 8.50 s (20%), 14 segments, 41.718 s. Validator 0/0.
