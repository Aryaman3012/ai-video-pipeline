# Remotion B-roll Library

B-roll is code. Every template lives in `remotion/src/broll/` and is registered in
`remotion/src/broll/registry.tsx`. The breakdown and EDL reference templates **by name** with props.
All templates read colours, fonts and easing from the EDL `theme`, so the vision board styles
everything in one place.

## Templates — landscape (16:9) system (`cards.tsx`, `data.tsx`)

| Template | Use for | Props |
|---|---|---|
| `TitleCard` | Hook, section breaks, video title | `title`, `subtitle?` |
| `KineticText` | Punchy lines, emphasis, word-by-word reveals | `text`, `highlight?` (words to accent) |
| `StatCounter` | A single number that matters | `value`, `prefix?`, `suffix?`, `label` |
| `BulletList` | 2–5 point lists, features, steps | `title?`, `items[]` |
| `QuoteCard` | Testimonials, citations | `quote`, `author?` |
| `SplitCompare` | Before/after, us vs them | `leftTitle`, `leftItems[]`, `rightTitle`, `rightItems[]` |
| `BarChart` | Comparing 2–6 values | `title?`, `bars[{label, value}]`, `unit?` |
| `CTA` | End screen | `headline`, `action`, `url?` |

## Templates — vertical (9:16) system (`vertical.tsx`)

Sized and stacked for 1080×1920. **Use these, not the landscape set, on vertical projects.**

| Template | Use for |
|---|---|
| `ChatInbox` | A messaging inbox filling with conversations |
| `CountUp` | Vertical stat counter |
| `SpendBars` | Stacked spend/comparison bars |
| `OvernightReport` | A summary/report card |
| `ReplyThread` | A conversation thread playing out |
| `CapabilityTicks` | Feature list with animated ticks |
| `EndCard` | Vertical end screen / CTA |

## Templates — messaging & WhatsApp systems (`thread.tsx`, `wa.tsx`)

One enquiry followed through its states, and real WhatsApp dark-mode UI built card by card.

| Template | Use for |
|---|---|
| `ChatList` / `ChatThread` | Generic messaging list / thread |
| `AdsRow` | An ads-manager row |
| `CalendarSlot` | A booking landing in a calendar |
| `WAInbox` / `WAThread` / `WACalendar` | WhatsApp-styled inbox / thread / booking |
| `MetaAds` | Meta Ads Manager mobile UI |

Check `registry.tsx` for the exact prop shapes — **the registry is the source of truth**; if
this file and the registry disagree, fix this file.

## Overlays (sit on top of A-roll)

| Template | Use for | Props |
|---|---|---|
| `LowerThird` | Names, places, context | `title`, `subtitle?` |
| `Caption` | Burned-in subtitle for a line | `text` |
| `CalloutTag` | A stat or label pinned to a corner | `text`, `position?` (`tl`,`tr`,`bl`,`br`) |
| `VCaption` / `VTag` | Vertical-sized caption / tag | `text` |

## Motion tokens (set once on the vision board, read from `theme.motion`)

| Preset | spring config | Feel / use |
|---|---|---|
| `snappy` | `{damping: 20, stiffness: 200, mass: 0.5}` | Default explainer entrance, minimal bounce |
| `pop` | `{damping: 12, stiffness: 300, mass: 0.8}` | Icons, badges, emphasis accents |
| `bouncy` | `{damping: 8, stiffness: 100, mass: 1}` | Playful brands only |
| `elegant` | `{damping: 15, stiffness: 50, mass: 2}` | Hero/logo reveals, slow builds |
| `premium` | `snappy` + `overshootClamping: true` | No bounce at all |

- Easing for `interpolate()`: `Easing.bezier(0.2, 0, 0, 1)` default; `(0.05, 0.7, 0.1, 1)`
  for entrances; `(0.3, 0, 1, 1)` for exits. **Never linear for spatial movement**; always
  `extrapolateLeft/Right: "clamp"`.
- Entrances ≤ 10 frames at 24 fps and 30–50 % longer than exits; staggers
  `theme.motion.stagger_frames` (2–5); cascade ≤ 12 frames; ≤ ⅓ of elements moving at once.
- Word timing comes from `05_broll/broll-design.json` (stage ⑥) — templates take their beat
  times as props, they do not guess them.

## Adding a template

0. Check the project's aspect ratio first and put vertical templates in `vertical.tsx`.
1. Create `remotion/src/broll/MyTemplate.tsx` — a component taking `{theme, ...props}`.
   Animate with `useCurrentFrame()` + `spring()`/`interpolate()`; never CSS transitions.
2. Register it in `registry.tsx`.
3. Add a row to the tables above so the breakdown agent knows it exists, **and** add the name
   to the `template` enum in `schemas/edl.schema.json` — the EDL fails validation otherwise.
4. Keep durations driven by the EDL — templates must look complete at any length ≥ 2 s
   (entrance in the first ~12 frames, hold, optional exit in the last ~8 frames).

## Aspect ratio — read this before using any template

**The templates above are sized for landscape.** They use fixed pixel columns, so they break
silently at 9:16: in a 720-wide frame the `Stage` padding leaves 576 px and `BarChart` alone
reserves 560 px for its label and value columns, which drew its bars at 16 px — present in the
DOM, invisible on screen, no error anywhere.

For a vertical project use `remotion/src/broll/vertical.tsx`, or follow its rules when adding
templates:

- **No fixed pixel column widths.** Use flex/percentage so the layout holds at any width.
- **Stack, do not put things side by side.** A bar's label goes *above* its track, not beside it.
- **Test at the project's real dimensions**, not at 1920×1080. Render one frame and look at it.

## Fonts

Fonts must be loaded explicitly or everything falls back to a serif and nothing warns you:

```ts
import { loadFont } from "@remotion/google-fonts/IBMPlexSansArabic";
const { fontFamily } = loadFont();
```

`@remotion/google-fonts` is not installed by default — add it at the same version as `remotion`.

## Ground

B-roll on a flat colour fill cuts badly against A-roll — the film alternates between a room and
a void. Render b-roll over a **plate** derived from the A-roll instead, so every cut stays in
one space. Build the plate from a clip, cropping away from the subject:

```bash
ffmpeg -ss 3 -i clip.mp4 -frames:v 1 \
  -vf "crop=iw:ih*0.22:0:0,scale=720:1280,gblur=sigma=42,eq=brightness=-0.30:saturation=0.45" \
  remotion/public/projects/<slug>/plates/ground.jpg
```

The background colour then becomes the deepest value *inside* that plate rather than a fill.

## Unification

B-roll inherits the film's texture, not the other way round: `theme.unify.grain_opacity`
renders one grain layer over footage **and** graphics (see
[stage ⑦](stages/07-assembly.md)), and cards can carry 1–2 % chromatic softness. Perfectly
clean vectors intercut with filmic AI footage is an amateur tell from both directions.

## Style rules

- Title-safe: keep text inside 90 % of the frame (5 % margins).
- Minimum text size: 48 px at 1080p for body, 96 px+ for headlines.
- Contrast ≥ 4.5:1 against the background.
- Max ~12 words on screen at once. One idea per card.
- Text appears within ±2 frames of its spoken word (emphasis leads by 1–2 frames), and holds
  `(characters ÷ 12) + 0.5` seconds after its entrance finishes — the validator warns when a
  scene is too short for its own text.
