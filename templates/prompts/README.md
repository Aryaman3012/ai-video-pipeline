# Prompt templates (one per view)

Each A-roll scene in `breakdown.json` has a **view**. The view picks a template here; stage ④
fills its slots and `tools/render-prompt.mjs` renders it for the project's generator
(`state.json → format.generator`). The templates are built from the HeyAnaya prompts that
worked in Google Flow with Veo 3.1 Fast (Scripts 1–3).

```bash
node tools/render-prompt.mjs <slug> scene-004            # latest take
node tools/render-prompt.mjs <slug> scene-004 --take 2
```

It writes `takes[N].prompt` into `03_prompts/scene-004.prompt.json` and a copy-paste-ready
`03_prompts/scene-004.prompt.md`. It never generates anything.

## Which view

| View | Use when | Speaks | First frame |
|---|---|---|---|
| [`podcast-host`](podcast-host.md) | Host at the mic, talking to an off-camera guest. One clip per host line, `[PAUSE]` tail to cut to the reply | yes | the host's podcast still |
| [`podcast-guest`](podcast-guest.md) | The guest's side of the same conversation (e.g. the clinic owner) | yes | the guest's podcast still |
| [`presenter-to-camera`](presenter-to-camera.md) | Host speaks into the lens; locked-off frame with empty space for Remotion graphics | yes | a `keyframe-still` |
| [`broll-silent.screen`](broll-silent.screen.md) | Phone / chat / screen close-up | no | optional |
| [`broll-silent.location`](broll-silent.location.md) | An empty place: reception, office, corridor | no | optional (reuse for the same place) |
| [`broll-silent.aerial`](broll-silent.aerial.md) | Aerial / drone city or building | no | – |
| [`broll-silent.person`](broll-silent.person.md) | One person in an environment, doing one thing | no | recommended (cast) |
| [`broll-silent.interaction`](broll-silent.interaction.md) | Two people interacting (greeting at reception) | no | optional |
| [`keyframe-still`](keyframe-still.md) | **Image** prompt: the first-frame still every clip of a character starts from | – | the cast `reference_image` |

Podcast or presenter? Podcast when the ad is a conversation (two people, shot/reverse shot,
the reply is cut in at each `[PAUSE]`). Presenter when one voice carries the whole film and
graphics need the frame: the empty side is where they sit.

## How a template is built

Fixed blocks, in a fixed order, with named slots (`{{slot}}`; `[[ … ]]` is dropped when a
slot inside it is empty):

| Block | Holds | Veo | Runway |
|---|---|---|---|
| `model` | `Model: Veo 3.1 Fast. Duration: 8 seconds.` | ✓ | dropped (set in the UI/API) |
| `reference` | first-frame lock: "Use the reference image as the first frame. Keep {{keep}} exactly as shown." | ✓ | dropped (I2V keyframe carries it) |
| `framing` | camera + placement, stated explicitly | ✓ | ✓ **first** (camera instruction first) |
| `speaker`, `speaker_lock` | who speaks; single speaker; no narrator | ✓ | who, without the dialogue lock |
| `line` | timestamped `Line:` with `[PAUSE]` / `[SILENCE]` | ✓ | rewritten as `[0.0–6.0s]` action beats |
| `voice`, `delivery`, `gesture` | voice block (verbatim from the cast), the read, one gesture | ✓ | gesture only |
| `pause` / `silence`, `spoken_only` | what happens in the gaps; "timestamps are not spoken" | ✓ | in the beats |
| `audio` | broadcast / presenter / ambience audio | ✓ | dropped (no audio) |
| `avoid` | `Avoid: …` | ✓ | each item rewritten positively via [`avoid-positive.json`](avoid-positive.json); audio-only items dropped |

Generator rules (durations, aspects, negative phrasing, whether it does audio/dialogue)
live in [`generators.json`](generators.json). `other` renders like Veo; override profile
fields per project in `format.generator` (e.g. `"audio": false`).

### Cast and voice come from the vision board, verbatim

Never retype a descriptor. `slots.cast` (default: the scene's first `CHAR_…`) and
`slots.location` (first `LOC_…`) pull these fields from `vision-board.json → cast`:

| Field | HeyAnaya host |
|---|---|
| `noun`, `pronoun` | `man`, `he` |
| `wardrobe` | `white kandura and ghutra with black agal` → lock: "Keep **the man, his white kandura and ghutra with black agal**, …" |
| `speaker`, `role` | `the Emirati man`, `an Arabic-accented English speaker from the UAE` |
| `voice` | `clear Emirati-accented English, soft Gulf Arabic intonation, lightly rolled r's, calm, deep, confident male voice.` |
| `voice_as` | `delivery_prefix` (start of `Delivery:`) or `voice_line` (own `Voice:` line — the clinic owner) |
| `avoid` | `["American or British accent"]` |
| `reference_image` | the podcast still — the first frame of every clip |
| `descriptor` | used by Runway text-to-video and silent shots of the person |
| location `keep` | `the mic, mug, table and warm dark studio` |

## Timing rules (speaking views)

- **≈ 2.7 words/s** at a natural pace. An 8 s clip holds ~21 words; more and the model rushes
  or clips the last word. Split long lines across two clips (Script 3 split a 24-word close).
- **Speech ends by 7.8 s** of an 8 s clip — always leave a tail.
- **Silence head and tail for clean cuts.** Presenter clips open with `0.0–0.4s: [SILENCE]`
  and end with `[SILENCE]`; podcast clips end with a `[PAUSE]` (longer when the reply is cut
  in there, e.g. 6.0–8.0 s).
- Split the line into 2–3 timestamped beats so the model gets a word-to-second map.
- The renderer warns when a beat runs > 25 % over budget, the line averages > 10 % over,
  speech runs past 7.8 s, or the line doesn't end on a pause/silence.

## Lessons from the HeyAnaya files

- **Spell numbers out** in dialogue: "twenty percent", "P and L's". Digits get misread.
- **"Hey Anaya" is two words** in every spoken line, or it's mispronounced.
- **Never name WhatsApp in a visual description** — say "a generic green messaging app".
  Veo draws a warped logo. (Saying "WhatsApp" in dialogue is fine.)
- **Keep text out of AI shots.** Readable text, UI, numbers, labels, logos and signage are
  added in Remotion. Every template's avoid list has a text item; keep it.
- **State the framing explicitly.** Real podcast clips came back centred with pillarbox bars:
  the templates now say where the person sits and that the picture fills the frame, and avoid
  bars. A still with bars produces clips with bars — check the first frame. The Veo mark Flow
  adds on some plans can't be prompted away: crop or cover it in the edit.
- **One first frame per character, every clip.** Voice and face drift between generations;
  play all clips back to back. If one voice is off, regenerate; if they still don't match,
  run all of them through one speech-to-speech voice (keeps the timing, so lip-sync holds).
- **Muffled audio is fixed in post, not by regenerating:** high-pass 90 Hz, −4 dB at 250 Hz,
  +4–5 dB at 3.5 kHz, +3 dB high shelf from 7.5 kHz, normalise to −16 LUFS.
