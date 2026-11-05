# Video generators

The A-roll generator is a project option, locked at stage ⓪ with the format:

```json
"format": { "platform": "Meta feed", "aspect_ratio": "16:9", "fps": 24, "runtime_target_s": 60,
            "generator": { "name": "veo", "model": "Veo 3.1 Fast" } }
```

The same object goes in `vision-board.json → format.generator`; the validator errors if they
disagree. A project with no generator is a **Runway** project (every project made before this
option existed).

| | `runway` | `veo` | `other` |
|---|---|---|---|
| Doc | [runway-prompting.md](runway-prompting.md) | [veo-prompting.md](veo-prompting.md) | this file |
| Stage ④ | write prompt → generate (web app or API) → clip | **write prompt only** → user generates by hand → drops clip in `04_clips/` | as Veo |
| Phrasing | positive only (validator error) | `Avoid:` line allowed | `Avoid:` allowed |
| Clip length | 2–10 s | 8 s | 1–60 s |
| Text-to-video aspect | 16:9 only | 16:9, 9:16 | any |
| Audio / dialogue | none: VO is a separate asset, lip-sync is its own step | generated, lip-synced | assumed yes |
| Consistency | I2V keyframe preferred | **first-frame reference required** for any cast member | first frame |
| Prompt rendering | camera first, one paragraph + action beats, avoids rewritten positively | the fixed HeyAnaya block structure | Veo rendering |

The rules come from [`templates/prompts/generators.json`](../templates/prompts/generators.json).
To change one for a single project, add the field next to `name`/`model` in
`format.generator` (e.g. `"audio": false` for an `other` model without sound,
`"duration_s": {"min": 4, "max": 8}`). To add a generator, add a profile there, a doc here,
and a `render_as` (`veo` or `runway`) — or a new fence name in the templates.

## Audio (asked for every new video)

`format.audio` is a separate answer from the generator, because the same generator makes
videos with and without a voice:

| `format.audio` | Meaning | Rules the tools enforce |
|---|---|---|
| `dialogue` | The generated clips speak the lines, lip-synced; the clips are the VO (rule 12) | Error if the generator can't speak (Runway) |
| `voiceover` | A separate VO track over the clips | Speaking views warn: the clip's sound is discarded and the mouth needs lip-sync to the VO |
| `none` | No voice: music, SFX, ambience | Speaking views are an error — use `broll-silent.*`; `clip_audio` on in the EDL warns |

The storyboard flow assumes `dialogue`; the validator warns otherwise.

## Manual generation (every generator except Runway)

1. `scene-prompter` writes `03_prompts/scene-XXX.prompt.json` and renders it with
   `node tools/render-prompt.mjs <slug> scene-XXX`, which also writes
   `03_prompts/scene-XXX.prompt.md`: the prompt in a copy-paste block, the first-frame still
   (if one must be made first), the model, duration, aspect and the exact save path.
2. The prompt is shown to the user. **The pipeline never attempts generation.**
3. The user generates in the tool (Flow, …) and saves the clip as
   `04_clips/scene-XXX_take-NN.mp4`. Stage ⑤ starts when that file exists.
