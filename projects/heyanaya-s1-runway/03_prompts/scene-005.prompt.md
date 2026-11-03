# scene-005 · take 01 · podcast-host

Host asks the conversion question

| | |
|---|---|
| Generator | gen4.5 (runway) |
| View | podcast-host |
| Mode | image-to-video — first frame: `01_vision/refs/host_podcast.png` |
| Duration / aspect | 8 s · 16:9 |
| Save the clip to | `04_clips/scene-005_take-01.mp4` |

## Prompt

```text
Locked-off static camera, medium shot, shallow depth of field, cinematic podcast look. He sits centred in the frame. The Emirati man at the mic talks to an unseen guest slightly off-camera.
[0.0–5.5s] He talks to the guest with natural hand gestures, lips moving in conversation.
[5.5–8.0s] He stops talking, mouth closed, and listens to the guest with a slight nod and steady eye contact.
Blank, unlettered surfaces, a clean picture free of captions, the picture fills the full frame edge to edge, a single person in frame, natural, well-formed hands.
```

## Acceptance criteria

- Same person, wardrobe and set as the first frame
- Every word is spoken, in order, lip-synced
- Mouth closed and listening through the [PAUSE] tail
- Locked-off medium shot, full frame, nothing new in shot

When the clip is in `04_clips/`, tell the pipeline to continue (stage ⑤ reviews it).
