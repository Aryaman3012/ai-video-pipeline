---
description: Run or resume the full video pipeline for a project
argument-hint: <project-slug>
---

Produce the video for project `$ARGUMENTS` following `AGENTS.md`.

1. If `projects/$ARGUMENTS` doesn't exist, run `./tools/new-project.sh $ARGUMENTS` and ask the
   user for the script (save it to `00_script/script.md`). Stop until it exists.
2. Read `projects/$ARGUMENTS/state.json` and the last entry of `log.md`. Resume from `stage`.
   If the validator reports the stage is stale against the artifacts on disk, reconcile
   `state.json` with the user before dispatching anything.
3. Dispatch by stage:
   - `audit` → `script-auditor` subagent (locks format first if `state.json.format` is empty).
     The format lock includes the **generator**: ask the user `runway` | `veo` | `other` and the
     model (e.g. "Veo 3.1 Fast"), and record `format.generator: {name, model}`.
     Show `audit.md` + the annotated script and wait for approval (`approved.audit`).
   - `vision` → `vision-director` subagent. Show the board, confirm the VO is locked and
     `00_script/vo.words.json` exists. Wait for approval (`approved.vision`).
   - `breakdown` → `script-breakdown` subagent. Show the `breakdown.md` table and wait for
     approval (`approved.breakdown`).
   - `prompting` → `scene-prompter` for `current_scene` only. Show the prompt to the user
     (`03_prompts/<scene>.prompt.md`). Wait until the clip exists at
     `04_clips/<scene>_take-NN.mp4`, then set `stage: review`.
     - `runway`: the user generates it in Runway, or the API script does.
     - any other generator: the user generates it by hand (e.g. in Google Flow) and drops it in.
       Never attempt generation; just say where to save it and stop.
   - `review` → `clip-reviewer` for that clip. If `regenerate`, go back to `prompting` (same
     scene, next take — offering `stitch` before take 3). If resolved (accept / accept_trim /
     stitch / fallback), advance to the next A_ROLL scene, or `broll` if none remain.
   - `broll` → `broll-designer` subagent. Show `storyboard.md` and wait for approval
     (`approved.broll`).
   - `assembly` → `assembly-editor`. After each render, show the version and its QC notes;
     iterate on the user's feedback until they sign off (`approved.final`), then set
     `stage: done`.
4. After each stage, validate (`node tools/validate.mjs $ARGUMENTS`) and print a one-line status:
   `stage · generator · scene n/N · takes used · runtime`.
