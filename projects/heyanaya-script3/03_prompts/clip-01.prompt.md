# clip-01 · take 01 · podcast-host

Hook: A few unanswered WhatsApp enquiries don't seem like a big deal. Now multiply that across all your clinic locations.

| | |
|---|---|
| Generator | Veo 3.1 Fast (veo, generate by hand) |
| View | podcast-host |
| Mode | image-to-video — first frame: `01_vision/refs/host_podcast.jpg` |
| Duration / aspect | 8 s · 16:9 |
| Save the clip to | `04_clips/clip-01_take-01.mp4` |

## Prompt

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

## Acceptance criteria

- Same person, wardrobe and set as the first frame
- Every word is spoken, in order, lip-synced
- Locked-off camera, framing as the template states; nothing new enters the shot
- Silent head and tail: mouth closed and relaxed

When the clip is in `04_clips/`, tell the pipeline to continue (stage ⑤ reviews it).
