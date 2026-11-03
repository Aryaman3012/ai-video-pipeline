# clip-06 · take 01 · podcast-host

Close: Because growing a clinic chain isn't just about generating more leads.

| | |
|---|---|
| Generator | Veo 3.1 Fast (veo, generate by hand) |
| View | podcast-host |
| Mode | image-to-video — first frame: `01_vision/refs/host_podcast.jpg` |
| Duration / aspect | 8 s · 16:9 |
| Save the clip to | `04_clips/clip-06_take-01.mp4` |

## Prompt

```text
Model: Veo 3.1 Fast. Duration: 8 seconds.

Use the reference image as the first frame. Keep the man, his white kandura and ghutra with black agal, the mic, mug, table and warm dark studio exactly as shown. Locked-off medium shot, shallow depth of field, cinematic podcast look. He sits centred in the frame. Full-frame 16:9 picture that fills the frame edge to edge.

Speaker: the Emirati man at the mic, an Arabic-accented English speaker from the UAE, talking to an unseen guest slightly off-camera.
Only the man in the reference image speaks. He is the single speaker in this clip: every spoken word comes from his mouth, lip-synced to his lips. The unseen guest stays completely silent and off-camera, and there is no narrator or voice-over.
Line:
0.0–0.4s: [SILENCE]
0.4–2.4s: "Because growing a clinic chain"
2.5–4.8s: "isn't just about generating more leads."
4.8–8.0s: [PAUSE]
Delivery: clear Emirati-accented English, soft Gulf Arabic intonation, lightly rolled r's, calm, deep, confident male voice. Calm and certain, sharing a conviction, a thoughtful beat before "generating more leads". Natural conversational podcast pace, natural hand gestures while speaking.
Gesture: on "generating" he makes a small pouring motion with one hand above the table, then lowers it.
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
