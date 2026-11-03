# View: broll-silent.person

**One person in an environment** doing one thing (studying a dashboard, reading a phone,
walking in). Silent: nobody speaks or moves their lips. The person's descriptor comes from
the vision board verbatim; any screen they look at shows shapes, never numbers. Source:
HeyAnaya Script 3, shot 5.

```json meta
{
  "view": "broll-silent.person",
  "extends": "broll-silent",
  "needs_cast": true,
  "defaults": {
    "camera": "locked-off medium shot, shallow depth of field, cinematic commercial look",
    "ambience": "quiet office ambience"
  },
  "avoid": ["readable text or numbers on the screen", "logos", "extra people", "warped hands", "subtitles"]
}
```

## Slots

| Slot | Example (Script 3 shot 5) |
|---|---|
| `cast` | `CHAR_OWNER` → `{{descriptor}}` = "a woman in a black blazer over a white top, with long dark hair and gold hoop earrings" |
| `role` | `A clinic chain owner` |
| `position` | `sits in a modern glass-walled clinic office in Dubai at evening` |
| `action` | `She studies a large monitor showing a clean analytics dashboard with several location panels. She leans forward, concerned, realising the gap.` |
| `camera` | `over-the-shoulder shot easing to her side profile, shallow depth of field, cinematic commercial look` |

## Blocks

### shot
```any
[[{{Role}}, ]]{{descriptor}}, {{position}}. {{action}}
```
