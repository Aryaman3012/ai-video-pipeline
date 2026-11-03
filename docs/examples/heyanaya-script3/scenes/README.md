# Reading these scenes

They were written for the standalone Script 3 project, before the engine existed, so they
**do not compile here** — read them for technique. Mapping to the engine
(`remotion/src/explainer/`):

| Here | Engine |
|---|---|
| `CUE.b01.multiply` (hard-coded word times) | `const cue = useCues(); cue("multiply")` — names from the storyboard |
| `C.ink`, `C.money` … (theme.ts) | `const C = usePalette()` |
| `useLayout()`, `useIn()`, `at()` (components/bits) | same names, from `explainer/context.tsx` |
| `Phone`, `Bubble`, `ChatHeader`, `ChatBody`, `Typing` (components/Phone) | `explainer/primitives.tsx` |
| `Label`, `Mono`, `Card`, `Check`, `ChatIcon`, `CalIcon` (components/bits) | `explainer/primitives.tsx` |
| `usePipAmount(BEATS[3])` | `usePipAmount(useBeat())` from `explainer/Host.tsx` (the engine already fades `under` scenes with pip) |
| `LogoBug`, `EndCard` | built in (`explainer/Chrome.tsx`) |
| `staticFile('logo-black.png')` | `staticFile(useTimeline().brand.logo_dark!)` |
