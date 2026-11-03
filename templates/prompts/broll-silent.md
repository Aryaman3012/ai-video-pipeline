# View: broll-silent (base)

Silent generated cutaways: **no dialogue, ambient sound only**. The VO is a separate track
(or the host's clips), so these shots carry picture and room tone and nothing else. Use one
of the variants — this file holds the blocks they share:

| Variant | For | HeyAnaya Script 3 shots |
|---|---|---|
| [`broll-silent.screen`](broll-silent.screen.md) | phone / chat / screen close-ups | 1, 4, 6 |
| [`broll-silent.location`](broll-silent.location.md) | an empty place (reception, office, corridor) | 2 |
| [`broll-silent.aerial`](broll-silent.aerial.md) | aerial / drone city or building shots | 3, 8 |
| [`broll-silent.person`](broll-silent.person.md) | one person in an environment, doing one thing | 5 |
| [`broll-silent.interaction`](broll-silent.interaction.md) | two people interacting (greeting, handover) | 7 |

These are **A_ROLL** scenes in the breakdown (photoreal, generated) — "B-roll" here is the
editorial role, not Remotion. Keep readable text, UI, logos and numbers out of the shot;
the edit adds them as graphics. For a shared location, generate one shot first and reuse its
last frame as `first_frame` for the others.

```json meta
{
  "view": "broll-silent",
  "kind": "video",
  "speaks": false,
  "needs_cast": false,
  "cast_avoid": false,
  "first_frame_from_cast": false,
  "defaults": {
    "camera": "locked-off, shallow depth of field, cinematic commercial look",
    "ambience": "quiet room ambience"
  },
  "avoid": ["readable text", "logos", "subtitles"],
  "layout": {
    "veo": "model\n\nreference shot\ncamera\n\naudio\navoid",
    "runway": "camera reference shot avoid"
  }
}
```

## Slots (shared)

| Slot | Example |
|---|---|
| `camera` | `slow push-in toward the phone, shallow depth of field, cinematic commercial look` (Runway: rule 14, prefer locked-off and move in Remotion) |
| `ambience` | `soft message notification sound, quiet clinic ambience` |
| `first_frame` | optional — the last frame of an earlier shot in the same place |
| `location` | optional vision board `LOC_…` key, pasted verbatim as `{{location}}` |
| `avoid_extra`, `avoid_remove` | list edits |

## Blocks

### model
```veo
Model: {{model}}. Duration: {{duration_s}} seconds.
```

### reference
```veo
[[Use the reference image as the first frame ({{first_frame}}). Keep the setting, light and objects exactly as shown.]]
```
```runway
```

### shot
```any
{{shot}}
```

### camera
```veo
Camera: {{camera}}, {{aspect}}.
```
```runway
{{Camera}}.
```

### audio
```veo
Audio: {{ambience}}. No dialogue, no voiceover, no music. Nobody on screen speaks or moves their lips.
```

### avoid
```veo
Avoid: {{avoid}}
```
```runway
{{avoid_positive}}
```
