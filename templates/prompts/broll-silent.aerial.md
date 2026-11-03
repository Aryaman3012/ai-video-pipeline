# View: broll-silent.aerial

**Aerial or drone** shot of a city, district or building. Markers, glows and light lines are
fine; labels, street names and map text are not (add them in Remotion). Leave open sky when
the shot carries an end card. Source: HeyAnaya Script 3, shots 3 and 8.

```json meta
{
  "view": "broll-silent.aerial",
  "extends": "broll-silent",
  "defaults": {
    "size": "High aerial view",
    "place": "{{location}}",
    "camera": "slow overhead drone glide, cinematic",
    "ambience": "low ambient city hum"
  },
  "avoid": ["readable text", "map labels", "street names", "logos", "subtitles"]
}
```

## Slots

| Slot | Example (Script 3 shot 3) |
|---|---|
| `size` | `High aerial view` / `Drone shot pulling up and back` |
| `place` | `a modern Gulf city at dusk, Dubai-style skyline and road grid, deep blue sky with warm city lights` |
| `action` | `One by one, soft glowing teal location markers appear on rooftops across the city, each pulsing gently like an incoming message.` |

## Blocks

### shot
```any
{{size}} of {{place}}. {{action}}
```
