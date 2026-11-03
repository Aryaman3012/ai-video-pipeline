# View: broll-silent.interaction

**Two people interacting** — a greeting, a handover, a nod at reception. Keep it to two
people in focus (crowds and 3+ interacting people break); background people stay soft.
Silent: their exchange is mimed, the VO carries the words. Source: HeyAnaya Script 3, shot 7.

```json meta
{
  "view": "broll-silent.interaction",
  "extends": "broll-silent",
  "defaults": {
    "camera": "locked-off medium-wide shot, bright natural daylight, cinematic commercial look",
    "ambience": "warm clinic ambience, soft footsteps"
  },
  "avoid": ["readable text", "logos", "signage text", "extra people in focus", "warped faces or hands", "subtitles"]
}
```

## Slots

| Slot | Example (Script 3 shot 7) |
|---|---|
| `people` | `A patient, a smiling man in smart casual clothes,` (paste vision board descriptors verbatim) |
| `action` | `walks into the same bright modern premium clinic in Dubai and is warmly greeted at the white marble reception desk by a friendly receptionist in a neat uniform. He nods, appointment confirmed.` |
| `camera` | `smooth gimbal pull-back, bright natural daylight, cinematic commercial look` |

## Blocks

### shot
```any
{{people}} {{action}}
```
