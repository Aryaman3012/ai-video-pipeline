# View: broll-silent.location

An **empty place**: reception, office, corridor, waiting room. Nobody in frame; the story is
the absence (an unanswered phone, an unattended desk). Signs stay blank — Veo invents
lettering on counters and walls. Source: HeyAnaya Script 3, shot 2.

```json meta
{
  "view": "broll-silent.location",
  "extends": "broll-silent",
  "defaults": {
    "size": "Medium-wide shot",
    "place": "{{location}}",
    "details": "",
    "camera": "locked-off, shallow depth of field, cinematic commercial look",
    "ambience": "quiet clinic ambience"
  },
  "avoid": ["readable text", "logos", "people", "subtitles", "warped screen"]
}
```

## Slots

| Slot | Example (Script 3 shot 2) |
|---|---|
| `size` | `Medium-wide shot` |
| `location` | vision board `LOC_…` key, or `place` written out: `an empty reception desk in a second modern premium clinic in Dubai` |
| `details` | `white and warm wood interior, a small plant, a branded-looking but blank sign on the wall` |
| `action` | `A smartphone on the desk lights up with a new chat message and buzzes. No receptionist is there to answer it.` |

## Blocks

### shot
```any
{{size}} of {{place}}[[: {{details}}]]. {{action}}
```
