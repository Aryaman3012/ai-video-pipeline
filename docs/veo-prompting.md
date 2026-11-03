# Veo Prompting Reference (Google Flow)

Target model: **Veo 3.1 Fast** in Google Flow. Facts below are from the HeyAnaya productions
(Oct 2026); re-verify in Flow's model settings when the model changes, and update
[`generators.json`](../templates/prompts/generators.json) with it.

## Model facts

| | Veo 3.1 Fast (Flow) |
|---|---|
| Modes | Text-to-video; Frames-to-video (first frame = I2V); Ingredients |
| Duration | 8 s per clip (trim in the edit) |
| Aspect | 16:9, 9:16 |
| Audio | **Generated**: dialogue lip-synced to the speaker, room tone, SFX |
| Generation | By hand in Flow — the pipeline writes the prompt and waits for the clip |
| Watermark | Flow may add a Veo mark (plan-dependent). Crop or cover it in Remotion |

Consequences:
- Every speaking clip is harvested VO (rule 12): **all** lines are generated in Veo, one
  voice per character, never mixed with TTS.
- Scenes longer than 8 s are split in the breakdown.
- `clip_audio: true` on every EDL segment that uses the clip's own speech (rule 11).

## Prompt structure

Use the templates in [`templates/prompts/`](../templates/prompts/README.md) — they are the
HeyAnaya prompts with the varying parts turned into slots. The order that works:

```
Model: Veo 3.1 Fast. Duration: 8 seconds.

Use the reference image as the first frame. Keep <cast lock>, <set> exactly as shown. <framing>.

Speaker: <who>, <role>, talking to <listener / the lens>.
Only the <man> in the reference image speaks. <single speaker, no narrator>.
Line:
0.0–3.0s: "first half of the line"
3.0–6.0s: "second half"
6.0–8.0s: [PAUSE]
Delivery: <voice block, verbatim> <the read of this line>.
Pause: during [PAUSE] he stops talking completely, mouth closed, and listens … Only room tone.
He speaks only the words inside quotation marks. The timestamps and [PAUSE] are not spoken.

Audio: <broadcast podcast / close-mic presenter / ambience only>.
Avoid: <accent>, on-screen text, subtitles, extra people, a second voice, …
```

Rules that made it work:
- **Negative phrasing is fine.** Veo follows an `Avoid:` line and "no music, no other voices".
- **Say who speaks, and that nobody else does.** Without the speaker lock Veo invents an
  off-screen narrator or gives the listener a line.
- **Timestamp the line.** 2–3 beats per clip, ≈ 2.7 words/s, speech ends by 7.8 s, a
  `[PAUSE]` or `[SILENCE]` tail (and a 0.4 s `[SILENCE]` head for presenter clips) so every
  clip has clean cut points. Tell it the markers are not spoken.
- **Paste the voice block verbatim** in every clip of a character; the accent drifts otherwise.
- **First frame for every cast clip.** One still per character (the podcast still, or a
  `keyframe-still`), used as the first frame of every take.
- **State framing explicitly** — placement, locked-off, full-frame — and avoid bars.
- **Silent shots say so twice:** "No dialogue, no voiceover, no music. Nobody on screen speaks
  or moves their lips."
- **No readable text, logos or real app UI**; "a generic green messaging app", never WhatsApp.

## Fixing takes

| Problem | Fix |
|---|---|
| Accent drifts | Regenerate. Still off → generate silent, dub with the locked voice, lip-sync |
| One clip's voice differs from the rest | Run all clips through one speech-to-speech voice (keeps timing) |
| Muffled / boomy voice | Post, not regen: HPF 90 Hz, −4 dB @ 250 Hz, +4–5 dB @ 3.5 kHz, +3 dB shelf from 7.5 kHz, −16 LUFS |
| Host drifts toward centre / camera moves | Regenerate — graphics sit at fixed positions |
| Pillarbox bars | Check the first-frame still fills the frame; regenerate it at the project aspect |
| Last word clipped | Shorten the line or move its beat earlier; end speech by 7.8 s |
