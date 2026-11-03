# View: presenter-to-camera

The host speaks **straight into the lens** like a presenter, in a locked-off frame with
planned **empty space** (default: host in the left third, right two-thirds a plain
out-of-focus wall) where Remotion graphics sit — no keying, no rotoscoping. Every clip opens
with a short `[SILENCE]` head and closes with a silent tail, which gives the edit clean cut
points. Generate the first frame with [`keyframe-still`](keyframe-still.md) first and use it
for every clip. Source: *HeyAnaya Script 3 – Flow + Remotion Build*, step 2.

```json meta
{
  "view": "presenter-to-camera",
  "kind": "video",
  "speaks": true,
  "needs_cast": true,
  "cast_avoid": true,
  "first_frame_from_cast": true,
  "head_silence": true,
  "defaults": {
    "placement": "left third",
    "empty_side": "right two-thirds",
    "empty_surface": "a plain, empty, softly out-of-focus wall",
    "look": "cinematic commercial look",
    "delivery": "",
    "gesture": "",
    "silence_action": "{{his}} mouth stays closed and relaxed, eyes on the lens",
    "runway_speak": "{{He}} speaks to the lens, lips moving, with small natural gestures.",
    "runway_pause": "{{He}} stops talking, mouth closed, eyes on the lens.",
    "runway_silence": "{{He}} holds still, {{silence_action}}."
  },
  "avoid": [
    "on-screen text", "subtitles", "logos",
    "phones, screens or any object appearing in the right side of the frame",
    "camera movement or zoom", "black bars, pillarbox or letterbox borders", "extra people",
    "a second voice", "narrator", "lips out of sync", "warped hands",
    "cutting off the last word", "muffled or distant voice"
  ],
  "layout": {
    "veo": "model\n\nreference framing\n\nspeaker\nspeaker_lock\nline\nvoice\ndelivery\ngesture\nsilence\nspoken_only\n\naudio\navoid",
    "runway": "framing speaker\nline\ngesture\navoid"
  }
}
```

## Slots

| Slot | From | Example |
|---|---|---|
| `cast` | vision board `CHAR_…` (verbatim `noun`, `pronoun`, `wardrobe`, `speaker`, `role`, `voice`, `avoid`, `reference_image`) | `CHAR_HOST` |
| `location` | vision board `LOC_…`; its `keep` closes the lock sentence | `LOC_CLINIC_LOUNGE` (`keep`: "and the bright clinic lounge") |
| `first_frame` | the keyframe still from `keyframe-still` | `03_prompts/keyframes/host_presenter.png` |
| `line` | `[{from:0,to:0.4,silence:true}, {from,to,say}…, {from,to:8,silence:true}]` | Script 3 clip 1 |
| `delivery` | the read of this line (after the voice) | `Measured and slightly serious, a small knowing half-smile on "big deal".` |
| `gesture` | one gesture tied to a word, toward the empty side | `on "multiply" he opens his hand and sweeps it gently toward frame right, then returns to rest.` |
| `silence_action` | optional | `his mouth stays closed, a warm smile, eyes on the lens` |
| `placement`, `empty_side`, `empty_surface` | the framing lock — keep identical across every clip of the film | `left third`, `right two-thirds` |
| `avoid_extra`, `avoid_remove` | optional list edits | `["extra fingers"]` |

Note: when the empty side changes, update the avoid item about objects on that side too.

## Blocks

### model
```veo
Model: {{model}}. Duration: {{duration_s}} seconds.
```

### reference
```veo
Use the reference image as the first frame. Keep {{keep}} exactly as shown.
```

### framing
```veo
{{He}} stays in the {{placement}} of the frame; the {{empty_side}} stays {{empty_surface}} for the whole clip. Locked-off camera, no camera movement, eye-level medium shot, shallow depth of field, {{look}}, {{aspect}}.
```
```runway
Locked-off static camera, eye-level medium shot, shallow depth of field, {{look}}. {{He}} stays in the {{placement}} of the frame; the {{empty_side}} stays {{empty_surface}} for the whole clip.
```

### speaker
```veo
Speaker: {{speaker}}, {{role}}, speaking directly into the camera lens like a presenter.
```
```runway
{{Speaker}} speaks directly into the camera lens like a presenter.
```

### speaker_lock
```veo
Only the {{noun}} in the reference image speaks. Every spoken word comes from {{his}} mouth, lip-synced to {{his}} lips. There is no narrator or voice-over.
```

### line
```veo
Line:
{{line}}
```
```runway
{{line_beats}}
```

### voice
```veo
[[Voice: {{voice_line}}]]
```

### delivery
```veo
Delivery: [[{{voice_prefix}} ]]{{delivery}}
```

### gesture
```veo
[[Gesture: {{gesture}}]]
```
```runway
[[{{Gesture}}]]
```

### silence
```veo
Silence: during [SILENCE] {{silence_action}}. Only room tone.
```

### spoken_only
```veo
{{He}} speaks only the words inside quotation marks. The timestamps and [SILENCE] are not spoken.
```

### audio
```veo
Audio: crisp, clear, close-mic presenter voice, bright and present with clean consonants, like a professionally mixed commercial voiceover. Quiet room tone, no music, no notification sounds, no other voices.
```

### avoid
```veo
Avoid: {{avoid}}
```
```runway
{{avoid_positive}}
```
