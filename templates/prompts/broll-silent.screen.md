# View: broll-silent.screen

Close-up of a phone, chat or screen. The app is always **a generic green messaging app**
(never named — Veo draws a warped WhatsApp logo), and the screen carries glow, bubbles and
motion, never readable words: the real chat UI is a Remotion overlay or a swapped-in screen
recording. Source: HeyAnaya Script 3, shots 1, 4, 6.

```json meta
{
  "view": "broll-silent.screen",
  "extends": "broll-silent",
  "defaults": {
    "device": "a smartphone",
    "app": "a generic green messaging app",
    "camera": "locked-off, very slow push-in, shallow depth of field, cinematic commercial look",
    "ambience": "soft message notification sound, quiet clinic ambience"
  },
  "avoid": ["readable text", "real app logos", "hands", "subtitles", "warped screen"]
}
```

## Slots

| Slot | Example (Script 3 shot 1) |
|---|---|
| `device` | `a smartphone` |
| `placement` | `lying face up on a clean white marble reception desk in a modern premium clinic in Dubai` |
| `setting` | `Soft daylight, warm wood and white interior softly blurred behind.` |
| `action` | `a new incoming chat bubble pops up with a gentle glow. Nobody picks up the phone. The message sits there, unanswered, and the screen slowly dims.` |
| `app` | default `a generic green messaging app` |

## Blocks

### shot
```any
Close-up of {{device}} {{placement}}. {{setting}} The screen shows {{app}}; {{action}}
```
