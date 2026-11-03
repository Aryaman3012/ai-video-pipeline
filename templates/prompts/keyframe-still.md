# View: keyframe-still (image prompt)

One **still image** that every clip of a character uses as its first frame, so face, outfit,
set and framing stay identical. Make it from the cast `reference_image` (Flow: add it as an
ingredient/reference), check it, then use it as `first_frame` for `presenter-to-camera`,
`podcast-host`/`podcast-guest` or `broll-silent.person`. Source: *HeyAnaya Script 3 – Flow +
Remotion Build*, step 1.

**Check before moving on:** the empty side is clean and evenly lit, the hands are fully in
frame, there is headroom above the head (punch-ins and a 9:16 crop need it), and the still
fills the frame edge to edge — a still with bars produces clips with bars.

```json meta
{
  "view": "keyframe-still",
  "kind": "image",
  "speaks": false,
  "needs_cast": true,
  "cast_avoid": false,
  "first_frame_from_cast": false,
  "defaults": {
    "stance": "stands",
    "pose": "facing the camera, relaxed and confident, hands loosely together at waist height",
    "framing": "Medium shot from mid-thigh up, eye level",
    "placement": "left third",
    "empty_side": "right two-thirds",
    "empty_surface": "a plain, softly out-of-focus warm white wall",
    "empty_clear": "completely empty: no art, no screens, no plants, no signage",
    "light": "Soft daylight from frame left, gentle fill, clean skin tones",
    "look": "cinematic commercial look"
  },
  "avoid": ["text", "logos", "signage", "phones", "screens", "props", "extra people", "objects in the right side of the frame", "warped hands"],
  "layout": {
    "veo": "reference\n\nsubject framing placement\nlight\n\navoid",
    "runway": "framing reference subject placement light avoid"
  }
}
```

## Slots

| Slot | Example (Script 3 host keyframe) |
|---|---|
| `cast` | `CHAR_HOST` → `noun`, `wardrobe`, `pronoun` verbatim |
| `location` | `LOC_CLINIC_LOUNGE` → `{{location}}` = "a bright, modern premium clinic lounge in Dubai" |
| `stance`, `pose` | `stands` · `facing the camera, relaxed and confident, hands loosely together at waist height` |
| `framing` | `Medium shot from mid-thigh up, eye level` |
| `placement`, `empty_side`, `empty_surface` | must match the clips that will use this still |
| `empty_details` | optional: `with a hint of warm wood panelling at the edge` |
| `light` | `Soft daylight from frame left, gentle fill, clean skin tones` |

For a podcast still: `stance: "sits at a podcast table with a studio mic in front of him"`,
`placement: "centre"` and set `empty_side: ""` to drop the empty-space sentences.

## Blocks

### reference
```veo
Use the reference image for the {{noun}}'s face, {{wardrobe}}. Keep {{him}} exactly the same person.
```
```runway
The same person as the reference image: {{descriptor}}.
```

### subject
```veo
{{He}} {{stance}} in {{location}}, {{pose}}.
```
```runway
{{He}} {{stance}} in {{location}}, {{pose}}.
```

### framing
```veo
{{framing}}.
```
```runway
{{framing}}.
```

### placement
```veo
{{He}} is placed in the {{placement}} of the frame.[[ The {{empty_side}} of the frame is {{empty_surface}}[[ {{empty_details}}]], {{empty_clear}}.]]
```
```runway
{{He}} is placed in the {{placement}} of the frame.[[ The {{empty_side}} of the frame is {{empty_surface}}, clean and bare.]]
```

### light
```any
{{light}}, shallow depth of field, {{look}}, {{aspect}}, high detail.
```

### avoid
```veo
Avoid: {{avoid}}
```
```runway
{{avoid_positive}}
```
