# scene-002 · take 01 · podcast-guest

Owner reacts: surprise, then the real question

| | |
|---|---|
| Generator | Veo 3.1 Fast (veo, generate by hand) |
| View | podcast-guest |
| Mode | image-to-video — first frame: `01_vision/refs/owner_podcast.png` |
| Duration / aspect | 8 s · 16:9 |
| Save the clip to | `04_clips/scene-002_take-01.mp4` |

## Prompt

```text
Model: Veo 3.1 Fast. Duration: 8 seconds.

Use the reference image as the first frame. Keep the woman, her long dark hair, black blazer over a white top, gold hoop earrings, the mic, black mug, wooden table, floor lamp, plants and warm dark studio exactly as shown. Locked-off medium shot, shallow depth of field, cinematic podcast look. She sits centred in the frame. Full-frame 16:9 picture that fills the frame edge to edge.

Speaker: the woman at the mic, a clinic chain owner, talking to an unseen host slightly off-camera to her right.
Only the woman in the reference image speaks. She is the single speaker in this clip: every spoken word comes from her mouth, lip-synced to her lips. The unseen host stays completely silent and off-camera, and there is no narrator or voice-over.
Line:
0.0–2.5s: "Twenty percent? Without increasing our marketing budget?"
2.5–3.5s: "How?"
3.5–4.5s: [PAUSE] (slight pause, a brief thoughtful beat)
4.5–7.8s: "But how do I actually see that across all my clinics?"
7.8–8.0s: [PAUSE]
Voice: natural human female voice, not synthetic or AI-sounding. English-speaking, with a clear Arabic (Gulf) accent: soft Arabic intonation, lightly rolled r's, slightly rounded vowels. Warm, mid-pitched, confident businesswoman tone. Natural breaths and small inflections, like a real person in conversation. Don't muffle the audio, it should be clear.
Delivery: Surprised and intrigued, a little skeptical on "How?", then a brief thoughtful beat, then curious and practical, genuinely asking. Natural conversational podcast pace, natural hand gestures while speaking.
Pause: during each [PAUSE] she stops talking completely, mouth closed, and listens to the host with a slight nod and steady eye contact. Only room tone.
She speaks only the words inside quotation marks. The timestamps and [PAUSE] are not spoken.

Audio: crisp, clear, broadcast-quality podcast voice from a studio microphone. Bright and present, with clean, distinct consonants and natural high-end detail, like a professionally mixed podcast. Acoustically treated room, quiet room tone, no music, no other voices.
Avoid: robotic or AI-sounding voice, American, British or Indian accent, on-screen text, subtitles, black bars, pillarbox or letterbox borders, extra people, a second voice, off-screen speaker or narrator, lips out of sync with the words, warped hands, talking during the pause, cutting off the last word, muffled, muddy, boomy, bass-heavy, distant or low-quality voice.
```

## Acceptance criteria

- Same person, wardrobe and set as the first frame
- Every word is spoken, in order, lip-synced
- Mouth closed and listening through the [PAUSE] tail
- Locked-off medium shot, full frame, nothing new in shot

When the clip is in `04_clips/`, tell the pipeline to continue (stage ⑤ reviews it).
