# HeyAnaya Explainer – Script 3 – Google Flow + Remotion Build

Oct 29, 2026 · @ARYAMAN

## How it's split

The person is the only thing made in Google Flow. Everything else is built in Remotion and laid over or cut together with his clips.

| Made in | What |
| --- | --- |
| **Google Flow (Veo 3.1 Fast)** | 1 keyframe still of the host, then 7 talking-to-camera clips with his lip-synced voice. Nothing else appears in these shots: no phones, screens or props. |
| **Remotion** | Chat screens, the branch grid, city map and pins, missed-enquiry counter, multi-branch dashboard, booking flow, feature chips, captions, colour grade, punch-ins, picture-in-picture, transitions, SFX, music, HeyAnaya logo and CTA end card. |

This replaces the 8 B-roll shots in *Script 3 – Google Flow Prompts*. The host now delivers the voiceover on camera, so there's no separate voiceover track.

### Why it's built this way

- **Locked-off camera with empty space on the right of frame.** The host stays in the left third of every clip and the right two-thirds stay a plain, out-of-focus wall. Remotion graphics go in that space, so you don't need to key or rotoscope anything.
- **No green screen.** Keying AI video gives you flickering edges on the ghutra and green spill. A soft, real-looking background with planned empty space is cleaner and looks more premium.
- **One continuous host track.** His 7 clips play back to back as the bottom layer for the whole video. Remotion only changes how he's framed: left third, punch-in close-up, or a circle picture-in-picture during full-screen graphics. His voice never cuts, even when graphics take over the frame.
- **Graphics timed to his words.** Each clip is transcribed with whisper.cpp to get word timestamps, and every pop, pin and counter tick is tied to a word, such as "first", "second", "WhatsApp" or "calls". If you regenerate a clip and his timing shifts, the graphics move with it.

## Step 1 – Host keyframe (Flow image)

Generate one still in Flow from the host's podcast still (use it as an ingredient or reference). Every clip uses this still as its first frame, so his face, outfit and set stay identical.

```text
Use the reference image for the man's face, white kandura and ghutra with black agal. Keep him exactly the same person.

He stands in a bright, modern premium clinic lounge in Dubai, facing the camera, relaxed and confident, hands loosely together at waist height. Medium shot from mid-thigh up, eye level. He is placed in the left third of the frame. The right two-thirds of the frame is a plain, softly out-of-focus warm white wall with a hint of warm wood panelling at the edge, completely empty: no art, no screens, no plants, no signage.
Soft daylight from frame left, gentle fill, clean skin tones, shallow depth of field, cinematic commercial look, 16:9, high detail.

Avoid: text, logos, signage, phones, screens, props, extra people, objects in the right side of the frame, warped hands.
```

Check before moving on: the right side is clean and evenly lit, his hands are fully in frame, and there's headroom above the ghutra. Remotion needs that space for punch-ins and the 9:16 crop.

## Step 2 – Host clips (Flow video)

7 clips, 8 seconds each, Veo 3.1 Fast, with the keyframe as the **first frame** of every clip. Each clip opens with 0.4s of silence and closes with a silent tail, which gives Remotion clean cut points.

| Clip | Section | Line | Speaks | Tone | Remotion layout |
| --- | --- | --- | --- | --- | --- |
| 1 | Hook | A few unanswered WhatsApp enquiries don't seem like a big deal. Now multiply that across all your clinic locations. | 0.4–7.4s | Measured, slightly serious | Host left, chat card, then branch grid |
| 2 | Build | One at your first clinic. Another at your second. And more across the rest of your network. | 0.4–6.6s | Measured | Full-screen city map, host in picture-in-picture |
| 3 | Build | Each one could be a potential patient you paid to attract, but never converted into a booking. | 0.4–6.4s | Serious | Host left, broken lead journey |
| 4 | Scale | Now imagine how many booking opportunities your entire chain could be missing over a month. | 0.4–6.0s | Serious, slower | Punch-in, then full-screen counter and dashboard |
| 5 | Solution | Hey Anaya helps your clinics handle patient enquiries across WhatsApp and calls, support appointment bookings, and respond around the clock. | 0.4–7.8s | Brighter, assured | Host left, booking flow and feature chips |
| 6 | Close | Because growing a clinic chain isn't just about generating more leads. | 0.4–4.8s | Assured | Full-screen connected network, host in picture-in-picture |
| 7 | Close | It's about turning more of the leads you already have into bookings. | 0.4–4.8s | Warm, confident, final | Punch-in close-up, kinetic text, then end card |

Script notes:
- Clip 1 uses "don't" instead of "doesn't" in the Google Doc, because "enquiries" is plural. Change it back if the client wants their exact wording.
- The close is split across two clips (6 and 7) because the full sentence is about 24 words. That's too long for 8 seconds at a calm pace.
- "Hey Anaya" is written as two words so it's pronounced right.
- Runtime is about 44–46s with the 3s end card. To get closer to 42s, trim the silent tails tighter.

### Shared clip block

Every clip prompt below uses this same framing, speaker, audio and avoid block, so the clips stay consistent. Only the line, delivery and gesture change.

### Clip 1

```text
Model: Veo 3.1 Fast. Duration: 8 seconds.

Use the reference image as the first frame. Keep the man, his white kandura and ghutra with black agal, and the bright clinic lounge exactly as shown. He stays in the left third of the frame; the right two-thirds stays a plain, empty, softly out-of-focus wall for the whole clip. Locked-off camera, no camera movement, eye-level medium shot, shallow depth of field, cinematic commercial look, 16:9.

Speaker: the Emirati man, an Arabic-accented English speaker from the UAE, speaking directly into the camera lens like a presenter.
Only the man in the reference image speaks. Every spoken word comes from his mouth, lip-synced to his lips. There is no narrator or voice-over.
Line:
0.0–0.4s: [SILENCE]
0.4–3.8s: "A few unanswered WhatsApp enquiries don't seem like a big deal."
3.8–7.4s: "Now multiply that across all your clinic locations."
7.4–8.0s: [SILENCE]
Delivery: clear Emirati-accented English, soft Gulf Arabic intonation, lightly rolled r's, calm, deep, confident male voice. Measured and slightly serious, a small knowing half-smile on "big deal", then more pointed on "multiply".
Gesture: on "multiply that across all your clinic locations" he opens his hand and sweeps it gently toward frame right, then returns to rest.
Silence: during [SILENCE] his mouth stays closed and relaxed, eyes on the lens. Only room tone.
He speaks only the words inside quotation marks. The timestamps and [SILENCE] are not spoken.

Audio: crisp, clear, close-mic presenter voice, bright and present with clean consonants, like a professionally mixed commercial voiceover. Quiet room tone, no music, no notification sounds, no other voices.
Avoid: American or British accent, on-screen text, subtitles, logos, phones, screens or any object appearing in the right side of the frame, camera movement or zoom, extra people, a second voice, narrator, lips out of sync, warped hands, cutting off the last word, muffled or distant voice.
```

### Clip 2

```text
Model: Veo 3.1 Fast. Duration: 8 seconds.

Use the reference image as the first frame. Keep the man, his white kandura and ghutra with black agal, and the bright clinic lounge exactly as shown. He stays in the left third of the frame; the right two-thirds stays a plain, empty, softly out-of-focus wall for the whole clip. Locked-off camera, no camera movement, eye-level medium shot, shallow depth of field, cinematic commercial look, 16:9.

Speaker: the Emirati man, an Arabic-accented English speaker from the UAE, speaking directly into the camera lens like a presenter.
Only the man in the reference image speaks. Every spoken word comes from his mouth, lip-synced to his lips. There is no narrator or voice-over.
Line:
0.0–0.4s: [SILENCE]
0.4–1.9s: "One at your first clinic."
1.9–3.4s: "Another at your second."
3.4–6.6s: "And more across the rest of your network."
6.6–8.0s: [SILENCE]
Delivery: clear Emirati-accented English, soft Gulf Arabic intonation, lightly rolled r's, calm, deep, confident male voice. Measured, building rhythm, a small beat after each of the first two sentences.
Gesture: a small open-palm tap on "first", another on "second", then both hands open outward on "the rest of your network".
Silence: during [SILENCE] his mouth stays closed and relaxed, eyes on the lens. Only room tone.
He speaks only the words inside quotation marks. The timestamps and [SILENCE] are not spoken.

Audio: crisp, clear, close-mic presenter voice, bright and present with clean consonants, like a professionally mixed commercial voiceover. Quiet room tone, no music, no notification sounds, no other voices.
Avoid: American or British accent, on-screen text, subtitles, logos, phones, screens or any object appearing in the right side of the frame, camera movement or zoom, extra people, a second voice, narrator, lips out of sync, warped hands, extra fingers, cutting off the last word, muffled or distant voice.
```

### Clip 3

```text
Model: Veo 3.1 Fast. Duration: 8 seconds.

Use the reference image as the first frame. Keep the man, his white kandura and ghutra with black agal, and the bright clinic lounge exactly as shown. He stays in the left third of the frame; the right two-thirds stays a plain, empty, softly out-of-focus wall for the whole clip. Locked-off camera, no camera movement, eye-level medium shot, shallow depth of field, cinematic commercial look, 16:9.

Speaker: the Emirati man, an Arabic-accented English speaker from the UAE, speaking directly into the camera lens like a presenter.
Only the man in the reference image speaks. Every spoken word comes from his mouth, lip-synced to his lips. There is no narrator or voice-over.
Line:
0.0–0.4s: [SILENCE]
0.4–3.6s: "Each one could be a potential patient you paid to attract,"
3.6–6.4s: "but never converted into a booking."
6.4–8.0s: [SILENCE]
Delivery: clear Emirati-accented English, soft Gulf Arabic intonation, lightly rolled r's, calm, deep, confident male voice. Serious and sincere, a slight emphasis on "paid", a small regretful shake of the head on "never".
Gesture: hands rest loosely together; one hand lifts slightly toward frame right on "paid to attract".
Silence: during [SILENCE] his mouth stays closed and relaxed, eyes on the lens. Only room tone.
He speaks only the words inside quotation marks. The timestamps and [SILENCE] are not spoken.

Audio: crisp, clear, close-mic presenter voice, bright and present with clean consonants, like a professionally mixed commercial voiceover. Quiet room tone, no music, no notification sounds, no other voices.
Avoid: American or British accent, on-screen text, subtitles, logos, phones, screens or any object appearing in the right side of the frame, camera movement or zoom, extra people, a second voice, narrator, lips out of sync, warped hands, cutting off the last word, muffled or distant voice.
```

### Clip 4

```text
Model: Veo 3.1 Fast. Duration: 8 seconds.

Use the reference image as the first frame. Keep the man, his white kandura and ghutra with black agal, and the bright clinic lounge exactly as shown. He stays in the left third of the frame; the right two-thirds stays a plain, empty, softly out-of-focus wall for the whole clip. Locked-off camera, no camera movement, eye-level medium shot, shallow depth of field, cinematic commercial look, 16:9.

Speaker: the Emirati man, an Arabic-accented English speaker from the UAE, speaking directly into the camera lens like a presenter.
Only the man in the reference image speaks. Every spoken word comes from his mouth, lip-synced to his lips. There is no narrator or voice-over.
Line:
0.0–0.4s: [SILENCE]
0.4–3.4s: "Now imagine how many booking opportunities"
3.4–6.0s: "your entire chain could be missing over a month."
6.0–8.0s: [SILENCE]
Delivery: clear Emirati-accented English, soft Gulf Arabic intonation, lightly rolled r's, calm, deep, confident male voice. Slower and weightier, a slight lean toward the lens on "imagine", a firm, quiet landing on "over a month".
Gesture: minimal; he holds still and steady eye contact for impact.
Silence: during [SILENCE] his mouth stays closed and relaxed, eyes on the lens, a slight raised eyebrow. Only room tone.
He speaks only the words inside quotation marks. The timestamps and [SILENCE] are not spoken.

Audio: crisp, clear, close-mic presenter voice, bright and present with clean consonants, like a professionally mixed commercial voiceover. Quiet room tone, no music, no notification sounds, no other voices.
Avoid: American or British accent, on-screen text, subtitles, logos, phones, screens or any object appearing in the right side of the frame, camera movement or zoom, extra people, a second voice, narrator, lips out of sync, warped hands, cutting off the last word, muffled or distant voice.
```

### Clip 5

```text
Model: Veo 3.1 Fast. Duration: 8 seconds.

Use the reference image as the first frame. Keep the man, his white kandura and ghutra with black agal, and the bright clinic lounge exactly as shown. He stays in the left third of the frame; the right two-thirds stays a plain, empty, softly out-of-focus wall for the whole clip. Locked-off camera, no camera movement, eye-level medium shot, shallow depth of field, cinematic commercial look, 16:9.

Speaker: the Emirati man, an Arabic-accented English speaker from the UAE, speaking directly into the camera lens like a presenter.
Only the man in the reference image speaks. Every spoken word comes from his mouth, lip-synced to his lips. There is no narrator or voice-over.
Line:
0.0–0.4s: [SILENCE]
0.4–1.2s: "Hey Anaya"
1.2–4.4s: "helps your clinics handle patient enquiries across WhatsApp and calls,"
4.4–7.8s: "support appointment bookings, and respond around the clock."
7.8–8.0s: [SILENCE]
Delivery: clear Emirati-accented English, soft Gulf Arabic intonation, lightly rolled r's, deep, confident male voice, now brighter and assured with a warm smile. "Hey Anaya" is said as two words, clearly, with a small lift.
Gesture: on "Hey Anaya" he opens his hand toward frame right, presenting it; small light gestures through the rest of the line.
Silence: during [SILENCE] his mouth stays closed, a warm smile, eyes on the lens. Only room tone.
He speaks only the words inside quotation marks. The timestamps and [SILENCE] are not spoken.

Audio: crisp, clear, close-mic presenter voice, bright and present with clean consonants, like a professionally mixed commercial voiceover. Quiet room tone, no music, no notification sounds, no other voices.
Avoid: American or British accent, on-screen text, subtitles, logos, phones, screens or any object appearing in the right side of the frame, camera movement or zoom, extra people, a second voice, narrator, lips out of sync, warped hands, rushing, cutting off the last word, muffled or distant voice.
```

### Clip 6

```text
Model: Veo 3.1 Fast. Duration: 8 seconds.

Use the reference image as the first frame. Keep the man, his white kandura and ghutra with black agal, and the bright clinic lounge exactly as shown. He stays in the left third of the frame; the right two-thirds stays a plain, empty, softly out-of-focus wall for the whole clip. Locked-off camera, no camera movement, eye-level medium shot, shallow depth of field, cinematic commercial look, 16:9.

Speaker: the Emirati man, an Arabic-accented English speaker from the UAE, speaking directly into the camera lens like a presenter.
Only the man in the reference image speaks. Every spoken word comes from his mouth, lip-synced to his lips. There is no narrator or voice-over.
Line:
0.0–0.4s: [SILENCE]
0.4–4.8s: "Because growing a clinic chain isn't just about generating more leads."
4.8–8.0s: [SILENCE]
Delivery: clear Emirati-accented English, soft Gulf Arabic intonation, lightly rolled r's, calm, deep, confident male voice. Assured and thoughtful, a gentle emphasis on "isn't just".
Gesture: a small, relaxed hand movement on "more leads", then rest.
Silence: during [SILENCE] his mouth stays closed and relaxed, eyes on the lens, slight nod. Only room tone.
He speaks only the words inside quotation marks. The timestamps and [SILENCE] are not spoken.

Audio: crisp, clear, close-mic presenter voice, bright and present with clean consonants, like a professionally mixed commercial voiceover. Quiet room tone, no music, no notification sounds, no other voices.
Avoid: American or British accent, on-screen text, subtitles, logos, phones, screens or any object appearing in the right side of the frame, camera movement or zoom, extra people, a second voice, narrator, lips out of sync, warped hands, cutting off the last word, muffled or distant voice.
```

### Clip 7

```text
Model: Veo 3.1 Fast. Duration: 8 seconds.

Use the reference image as the first frame. Keep the man, his white kandura and ghutra with black agal, and the bright clinic lounge exactly as shown. He stays in the left third of the frame; the right two-thirds stays a plain, empty, softly out-of-focus wall for the whole clip. Locked-off camera, no camera movement, eye-level medium shot, shallow depth of field, cinematic commercial look, 16:9.

Speaker: the Emirati man, an Arabic-accented English speaker from the UAE, speaking directly into the camera lens like a presenter.
Only the man in the reference image speaks. Every spoken word comes from his mouth, lip-synced to his lips. There is no narrator or voice-over.
Line:
0.0–0.4s: [SILENCE]
0.4–4.8s: "It's about turning more of the leads you already have into bookings."
4.8–8.0s: [SILENCE]
Delivery: clear Emirati-accented English, soft Gulf Arabic intonation, lightly rolled r's, deep, confident male voice. Warm, certain and final, emphasis on "already have", a confident smile on "bookings".
Gesture: hands come together calmly at the end; he holds a warm, confident look into the lens.
Silence: during [SILENCE] his mouth stays closed, a warm smile, steady eye contact. Only room tone.
He speaks only the words inside quotation marks. The timestamps and [SILENCE] are not spoken.

Audio: crisp, clear, close-mic presenter voice, bright and present with clean consonants, like a professionally mixed commercial voiceover. Quiet room tone, no music, no notification sounds, no other voices.
Avoid: American or British accent, on-screen text, subtitles, logos, phones, screens or any object appearing in the right side of the frame, camera movement or zoom, extra people, a second voice, narrator, lips out of sync, warped hands, cutting off the last word, muffled or distant voice.
```

### Checking the clips (QC)

- **Framing drift:** the right side must stay empty and the camera must not move. Remotion graphics sit at fixed positions, so regenerate any clip where he drifts toward the centre.
- **Voice consistency:** Veo creates the voice fresh for each clip. Play all 7 back to back. If one sounds like a different man, regenerate it. If they still don't match, run all 7 through one speech-to-speech voice (for example ElevenLabs Voice Changer). This keeps the timing, so the lip-sync holds.
- **Audio clean-up:** use the Script 1 chain. High-pass at 90 Hz, cut 250 Hz by 4 dB, boost 3.5 kHz by 4–5 dB, add a high shelf of +3 dB from 7.5 kHz, then normalise to -16 LUFS. Remotion can apply volume but not EQ, so do this on the clips before you drop them into `public/host/`.

## Step 3 – Remotion build

### Project layout

```text
heyanaya-script3/
  public/
    host/clip1.mp4 … clip7.mp4        ← Flow clips (EQ'd)
    captions/clip1.json … clip7.json  ← whisper.cpp word timestamps
    brand/logo.svg                    ← HeyAnaya logo (needed)
    sfx/notify.mp3  chime.mp3  whoosh.mp3  tick.mp3  call-ring.mp3
    music/bed.mp3                     ← light corporate bed, licensed
  scripts/transcribe.ts               ← runs whisper.cpp on every host clip
  src/
    Root.tsx            ← Script3 (1920×1080) and Script3Vertical (1080×1920)
    Script3.tsx         ← host track + scene graphics + audio
    timeline.ts         ← per-clip trims; scene starts derived from them
    cues.ts             ← word → beat lookups ("first", "WhatsApp", …)
    theme.ts            ← colours, fonts, radii, springs
    host/HostTrack.tsx  ← <Series> of the 7 clips + layout keyframes
    scenes/  S1Hook  S2Map  S3Journey  S4Scale  S5Solution  S6Network  S7Close  EndCard
    components/  ChatCard  BranchGrid  CityMap  Pin  Counter  Dashboard  BookingCard
                 CallCard  FeatureChip  KineticText  Captions  PipFrame
```

- `calculateMetadata` reads each clip's real duration and the trims in `timeline.ts`, so the total length updates when you swap in a clip.
- `cues.ts` finds each word in that clip's whisper JSON and returns a frame number. A scene places a beat with something like `cue('clip2', 'second')`, never a hard-coded frame.

### Layer stack (bottom → top)

1. **Brand background:** a soft off-white/teal gradient. It only shows when the host is in picture-in-picture.
2. **Host track:** the 7 clips back to back, using `OffthreadVideo`. Each scene sets one of three layouts, and the host animates between them with a spring (about 12 frames):
   - `left`: full frame, as generated.
   - `punch`: scaled to 1.35× and centred on his face, for a close-up feel.
   - `pip`: a 340px circle at bottom left with a white ring and soft shadow.
   - Grade is a CSS filter: problem sections (clips 1–4) are slightly cooler and less saturated (`saturate(0.9) hue-rotate(-4deg)`), and the solution and close (clips 5–7) are warmer and brighter (`brightness(1.05) saturate(1.08)`).
3. **Scene graphics:** each scene's components, kept inside the right-side safe zone (x from about 760 to 1840) when the host is `left`, or full frame when he's `pip`.
4. **Captions:** word-by-word, bottom centre, and the key word in each line in brand teal. They're off by default for 16:9 and on for 9:16.
5. **SFX and music:** the bed sits at -24 LUFS under his voice and ducks 3 dB more while he speaks.

### Scene plan

Times are relative to the start of each clip. Every beat is tied to a word through `cues.ts`.

| Scene | Clip | Host layout | Graphics and beats |
| --- | --- | --- | --- |
| S1 Hook | 1 | `left` | 0.3s: a phone-style chat card slides up on the right, with a green header, a generic chat icon and the clinic name. On "enquiries", a patient bubble pops in ("Hi, do you have a slot this week?") with `notify.mp3`. A grey "No reply · 2h" timer starts ticking. On "multiply", the card shrinks and copies itself into a 3×3 grid of branch cards (Jumeirah, Marina, Al Barsha, Deira, JLT, Mirdif, Business Bay, Karama, Silicon Oasis), filling in at a 3-frame stagger, each with its own unanswered bubble and timer. |
| S2 Map | 2 | `pip` | The grid zooms into a full-screen stylised dark-navy city map made of vector roads and a coastline, with no real map data or labels. On "first", pin 1 drops with its bubble pulsing. On "second", pin 2 drops. On "rest of your network", 10 more pins cascade in. About a third of the pin bubbles turn grey and fade, the "left hanging" ones. The camera drifts slowly across the map. |
| S3 Journey | 3 | `left` | On the right, a horizontal lead journey: Ad → Enquiry → Reply → Booking. On "patient", a patient avatar card travels along the line. On "paid to attract", an "Ad spend" tag stamps on. On "never", the line snaps at "Reply" with a red ✕, the avatar fades, and the "Booking" node stays empty and dashed. |
| S4 Scale | 4 | `punch`, then `pip` from "chain" onward | First half: the close-up of him with no graphics, plus a slow 2% scale creep for tension. On "chain", he shrinks to `pip` and grey unanswered bubbles stream in from the edges into a big central counter that rolls up to the month total. A calendar strip below runs Day 1 → 30 while it counts. On "month", the counter slides up and a multi-branch dashboard builds below: one row per branch with Enquiries, Replied and Booked bars, and the gap between enquiries and bookings highlighted in red. |
| S5 Solution | 5 | `left`, warm grade | On "Hey Anaya", the HeyAnaya logo mark pops in at the top right. Then a chat card: an enquiry arrives, the typing dots run for 0.4s, an instant reply comes in ("Hi Sara! We have 10:30 or 4:00 tomorrow. Which suits you?"), the patient answers "10:30", and a **booking confirmed** card lands with a green check and `chime.mp3`. Feature chips stack beside the card, each timed to its word: "WhatsApp" (chat icon), "calls" (a call card answered with a live waveform), "bookings" (calendar), "around the clock" (24/7 clock with a moon). |
| S6 Network | 6 | `pip` | The S2 city map comes back, now bright. Grey pins turn teal one by one with small check marks, and thin light lines connect them into a network. On "more leads", a light kinetic line appears: "More leads ≠ more growth". |
| S7 Close | 7 | `punch`, centred | Kinetic text appears word by word beside him: "the leads you **already have**" → "into **bookings**". The second line uses brand teal and rises with a soft spring. |
| End card | – | the host freezes on the last frame, then blurs and dims | 3s: HeyAnaya logo, a one-line tagline, CTA button ("Book a demo") and the URL. The logo resolves with `whoosh.mp3` and the music bed resolves. |

### Look and motion

- **Palette:** off-white `#F7F8F6`, ink `#0E1B24`, brand teal `#14B8A6` (placeholder until we have the HeyAnaya brand kit), chat green `#1FA855`, missed grey `#9AA4AB`, alert red `#E5484D`.
- **Type:** one sans family, Inter or the brand font, at two weights. Use tabular numbers on the counter and dashboard.
- **Cards:** 24px radius, soft shadow, white surfaces. Phone frames are minimal: rounded rectangles with no device branding.
- **Motion:** use `spring({ damping: 200 })` for UI entrances and a snappier spring for pins. Keep the 3-frame stagger across grids. Nothing should move while he's delivering the punch line in S4's first half or S7.
- **Chat UI:** WhatsApp-*style* but generic, with no WhatsApp logo or wordmark. He says "WhatsApp" on screen anyway, so the visual doesn't need the trademark.

### 9:16 version

`Script3Vertical` uses the same scenes and timeline. Because he's in the left third of the frame, a 9:16 crop window sits on him (about x 120–728 of the 1080p plate, scaled up). The graphics go above and below him in stacked layouts instead of beside him, and captions are turned on.

### Commands

```bash
npx create-video@latest heyanaya-script3 --blank
```

```bash
npx remotion studio
```

```bash
npx remotion render Script3 out/heyanaya-script3-16x9.mp4
```

## Needed from the team

- The HeyAnaya logo (SVG), brand colours and font.
- The CTA wording and URL for the end card.
- Branch names to use, either real ones or the placeholder list above.
- The S4 counter total and the dashboard figures. These are **illustrative only** and should be signed off before release so the ad doesn't imply a real statistic.
- A licensed music bed.
