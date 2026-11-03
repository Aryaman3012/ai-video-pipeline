# harness-selftest — prompts (Veo 3.1 Fast)

# 1. First-frame stills (make these first)

## Still host → save as `01_vision/refs/host_still.png`

```text
Use the reference image for the man's face, white kandura and ghutra with black agal. Keep him exactly the same person.

He stands in a warm, dark podcast studio with a studio mic, a mug and a table, facing the camera, relaxed and confident, hands loosely together at waist height. Medium shot from mid-thigh up, eye level. He is placed in the left third of the frame. The right two-thirds of the frame is a plain, softly out-of-focus warm white wall, completely empty: no art, no screens, no plants, no signage.
Soft daylight from frame left, gentle fill, clean skin tones, shallow depth of field, cinematic commercial look, 16:9, high detail.

Avoid: text, logos, signage, phones, screens, props, extra people, objects in the right side of the frame, warped hands.
```

# 2. Speaking clips

First frame for every clip: the cast still in `01_vision/refs/`. Save clips into `04_clips/` (any name).

## 01 · Hook

> A few unanswered WhatsApp enquiries don't seem like a big deal. Now multiply that across all your clinic locations.

```text
Model: Veo 3.1 Fast. Duration: 8 seconds.

Use the reference image as the first frame. Keep the man, his white kandura and ghutra with black agal, the mic, mug, table and warm dark studio exactly as shown. Locked-off medium shot, shallow depth of field, cinematic podcast look. He sits centred in the frame. Full-frame 16:9 picture that fills the frame edge to edge.

Speaker: the Emirati man at the mic, an Arabic-accented English speaker from the UAE, talking to an unseen guest slightly off-camera.
Only the man in the reference image speaks. He is the single speaker in this clip: every spoken word comes from his mouth, lip-synced to his lips. The unseen guest stays completely silent and off-camera, and there is no narrator or voice-over.
Line:
0.0–0.4s: [SILENCE]
0.4–4.5s: "A few unanswered WhatsApp enquiries don't seem like a big deal."
4.6–7.7s: "Now multiply that across all your clinic locations."
7.7–8.0s: [PAUSE]
Delivery: clear Emirati-accented English, soft Gulf Arabic intonation, lightly rolled r's, calm, deep, confident male voice. Easy and conversational, slightly wry on "don't seem like a big deal", then leaning in with weight on "multiply". Natural conversational podcast pace, natural hand gestures while speaking.
Gesture: on "WhatsApp" he turns one open palm toward frame right; on "multiply" he spreads both hands apart above the table.
Pause: during [PAUSE] he stops talking completely, mouth closed, and listens to the guest with a slight nod and steady eye contact. Only room tone.
He speaks only the words inside quotation marks. The timestamps and [PAUSE] are not spoken.

Audio: crisp, clear, broadcast-quality podcast voice from a studio microphone. Bright and present, with clean, distinct consonants and natural high-end detail, like a professionally mixed podcast. Acoustically treated room, quiet room tone, no music, no other voices.
Avoid: American or British accent, on-screen text, subtitles, black bars, pillarbox or letterbox borders, extra people, a second voice, off-screen speaker or narrator, lips out of sync with the words, warped hands, talking during the pause, cutting off the last word, muffled, muddy, boomy, bass-heavy, distant or low-quality voice.
```

## 02 · Build the problem

> One at your first clinic. Another at your second. And more across the rest of your network.

```text
Model: Veo 3.1 Fast. Duration: 8 seconds.

Use the reference image as the first frame. Keep the man, his white kandura and ghutra with black agal, the mic, mug, table and warm dark studio exactly as shown. Locked-off medium shot, shallow depth of field, cinematic podcast look. He sits centred in the frame. Full-frame 16:9 picture that fills the frame edge to edge.

Speaker: the Emirati man at the mic, an Arabic-accented English speaker from the UAE, talking to an unseen guest slightly off-camera.
Only the man in the reference image speaks. He is the single speaker in this clip: every spoken word comes from his mouth, lip-synced to his lips. The unseen guest stays completely silent and off-camera, and there is no narrator or voice-over.
Line:
0.0–0.4s: [SILENCE]
0.4–2.4s: "One at your first clinic."
2.5–4.1s: "Another at your second."
4.2–7.2s: "And more across the rest of your network."
7.2–8.0s: [PAUSE]
Delivery: clear Emirati-accented English, soft Gulf Arabic intonation, lightly rolled r's, calm, deep, confident male voice. Counting off, unhurried, a small beat between each clinic, building on "the rest of your network". Natural conversational podcast pace, natural hand gestures while speaking.
Gesture: on "first" he places one hand on the table, on "second" a little further along it, and on "network" he sweeps that hand wide across the table.
Pause: during [PAUSE] he stops talking completely, mouth closed, and listens to the guest with a slight nod and steady eye contact. Only room tone.
He speaks only the words inside quotation marks. The timestamps and [PAUSE] are not spoken.

Audio: crisp, clear, broadcast-quality podcast voice from a studio microphone. Bright and present, with clean, distinct consonants and natural high-end detail, like a professionally mixed podcast. Acoustically treated room, quiet room tone, no music, no other voices.
Avoid: American or British accent, on-screen text, subtitles, black bars, pillarbox or letterbox borders, extra people, a second voice, off-screen speaker or narrator, lips out of sync with the words, warped hands, talking during the pause, cutting off the last word, muffled, muddy, boomy, bass-heavy, distant or low-quality voice.
```

# 3. Silent b-roll

Name each file `broll-bNN…` so ingest can find it.

## b01 · silent b-roll — save as `04_clips/broll-b01….mp4`

> Test pattern standing in for an aerial shot

```text
Model: Veo 3.1 Fast. Duration: 8 seconds.

Medium-wide shot of a warm, dark podcast studio with a studio mic, a mug and a table. a slow, steady drift across the empty studio
Camera: locked-off, shallow depth of field, cinematic commercial look, 16:9.

Audio: quiet clinic ambience. No dialogue, no voiceover, no music. Nobody on screen speaks or moves their lips.
Avoid: readable text, logos, people, subtitles, warped screen.
```
