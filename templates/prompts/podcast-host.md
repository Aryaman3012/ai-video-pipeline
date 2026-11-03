# View: podcast-host

The host at the studio mic, talking to an **unseen guest slightly off-camera**. One clip per
host line, each ending in a `[PAUSE]` you cut on to insert the guest's reply
(`podcast-guest`). Source: HeyAnaya Scripts 1 and 2 (Veo 3.1 Fast in Flow), every host clip.

```json meta
{
  "view": "podcast-host",
  "kind": "video",
  "speaks": true,
  "needs_cast": true,
  "cast_avoid": true,
  "first_frame_from_cast": true,
  "defaults": {
    "listener": "guest",
    "listener_side": "",
    "placement": "{{He}} sits centred in the frame",
    "frame_fill": "Full-frame {{aspect}} picture that fills the frame edge to edge",
    "delivery": "",
    "gesture": "",
    "pause_action": "listens to the {{listener}} with a slight nod and steady eye contact",
    "runway_speak": "{{He}} talks to the {{listener}} with natural hand gestures, lips moving in conversation.",
    "runway_pause": "{{He}} stops talking, mouth closed, and {{pause_action}}.",
    "runway_silence": "{{He}} holds still, mouth closed and relaxed."
  },
  "avoid": [
    "on-screen text", "subtitles", "black bars, pillarbox or letterbox borders", "extra people",
    "a second voice", "off-screen speaker or narrator", "lips out of sync with the words",
    "warped hands", "talking during the pause", "cutting off the last word",
    "muffled, muddy, boomy, bass-heavy, distant or low-quality voice"
  ],
  "layout": {
    "veo": "model\n\nreference framing\n\nspeaker\nspeaker_lock\nline\nvoice\ndelivery\ngesture\npause\nspoken_only\n\naudio\navoid",
    "runway": "framing speaker\nline\ngesture\navoid"
  }
}
```

## Slots

| Slot | From | Example |
|---|---|---|
| `cast` | breakdown `cast[0]` → vision board `CHAR_…` key. Supplies `noun`, `pronoun`, `wardrobe`, `speaker`, `role`, `voice`, `voice_as`, `avoid`, `reference_image` **verbatim** | `CHAR_HOST` |
| `location` | vision board `LOC_…` key; its `keep` is appended to the lock sentence | `LOC_PODCAST_STUDIO` |
| `line` | `[{from,to,say}…, {from,to,pause:true}]`, timed on the scene's words. Last entry is the `[PAUSE]` tail | see Script 1 clip 1 |
| `delivery` | optional, the emotional read of this line (goes after the voice) | `Matter-of-fact and assured.` |
| `gesture` | optional, one gesture tied to a word | `on "multiply" he opens his hand toward frame right` |
| `pause_action` | optional, what he does in the pause | `holds steady eye contact with the guest, as if about to continue` |
| `placement`, `frame_fill` | framing lock (defaults state it explicitly: centred, full frame) | `He sits in the right third of the frame` |
| `first_frame` | optional, overrides the cast `reference_image` | `01_vision/refs/host_podcast.png` |
| `avoid_extra`, `avoid_remove` | optional list edits | `["extra fingers"]` |

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
Locked-off medium shot, shallow depth of field, cinematic podcast look.[[ {{placement}}.]][[ {{frame_fill}}.]]
```
```runway
Locked-off static camera, medium shot, shallow depth of field, cinematic podcast look.[[ {{placement}}.]]
```

### speaker
```veo
Speaker: {{speaker}} at the mic, {{role}}, talking to an unseen {{listener}} slightly off-camera{{listener_side}}.
```
```runway
{{Speaker}} at the mic talks to an unseen {{listener}} slightly off-camera{{listener_side}}.
```

### speaker_lock
```veo
Only the {{noun}} in the reference image speaks. {{He}} is the single speaker in this clip: every spoken word comes from {{his}} mouth, lip-synced to {{his}} lips. The unseen {{listener}} stays completely silent and off-camera, and there is no narrator or voice-over.
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
Delivery: [[{{voice_prefix}} ]][[{{delivery}} ]]Natural conversational podcast pace, natural hand gestures while speaking.
```

### gesture
```any
[[Gesture: {{gesture}}]]
```
```runway
[[{{Gesture}}.]]
```

### pause
```veo
Pause: during {{pause_each}}[PAUSE] {{he}} stops talking completely, mouth closed, and {{pause_action}}. Only room tone.
```

### spoken_only
```veo
{{He}} speaks only the words inside quotation marks. The timestamps and [PAUSE] are not spoken.
```

### audio
```veo
Audio: crisp, clear, broadcast-quality podcast voice from a studio microphone. Bright and present, with clean, distinct consonants and natural high-end detail, like a professionally mixed podcast. Acoustically treated room, quiet room tone, no music, no other voices.
```

### avoid
```veo
Avoid: {{avoid}}
```
```runway
{{avoid_positive}}
```
