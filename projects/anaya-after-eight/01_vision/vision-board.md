# Vision Board — Anaya · "After Eight"

> **Status: written unattended — the user approves this board, I do not.**
> `state.json` stays at `stage: vision`, `approved.vision: false`.

## Assumptions (please confirm or overrule)

1. **VO pace is ~165 wpm, not the 150 wpm default.** 116 words in 42 s. The read is brisk and
   level; it is not rushed. If the recorded VO runs long, the 21–32 s SOLUTION block is the one
   with slack to absorb it — protect the 0–3 s hook and the 36–42 s CTA at their written lengths.
2. **Presenter is a male doctor** in his late 30s, Middle Eastern, in an open white clinician's coat
   over a light-blue collared shirt. Decided by the user, replacing the earlier assumed female presenter
   in a blazer. A clinician addressing clinic owners reads as a peer rather than a spokesperson, which
   suits a script whose turn is "it's not your team."
3. **The ad runs in English, with one Arabic proof moment** inside the phone mockup at 21–32 s
   (an Arabic enquiry answered in Arabic), landing exactly on the line "in Arabic or English".
   A fully Arabic-first cut is a separate pass, not a crop of this one.
4. **Every screen is a phone screen.** Ads Manager is shown in its mobile app form, not desktop,
   so all three screen blocks live on the same device the presenter holds in the hook.
5. **Logos, app UI and all on-screen text are Remotion-composited.** Runway is never asked to
   render a readable screen, a brand mark, or a word.
6. **The invented A-roll insert was cut.** An earlier draft of this board added a 3 s shot of the
   empty front desk at night on "Your front desk never saw her." It existed to lift the A-roll share to
   0.48. It illustrated the VO line rather than advancing it, interrupted the proof-of-spend argument
   mid-block, and cost a second keyframe for the least informative shot in the film. The honest ratio is
   **0.40**, and AGITATE's pacing is carried by motion inside the Remotion card instead.

## Spine

| | |
|---|---|
| Audience | Owners and managers of private clinics (dental, derm, aesthetics, IVF) in a Gulf market, running Meta lead ads, personally answerable for cost-per-booking. Bilingual Arabic/English. |
| Purpose | sell |
| One takeaway | You are already paying for the enquiries that arrive after 8 pm — Anaya answers them in under five minutes so they book with you instead of the clinic that replied first. |
| Emotional arc | unease → recognition (it is not your team) → relief → confidence |
| Runtime target | 42 s (116 words ≈ 165 wpm) |
| Format | **9:16 · 1080×1920 · 24 fps** · Meta (Reels / Stories / Feed), plus a **1:1 1080×1080 cutdown** rendered from the same EDL |

**Because the project is 9:16, every A-roll take must be `image_to_video` with a keyframe in
`03_prompts/keyframes/`.** There are no text-to-video takes in this project. Budget one keyframe
generation pass before stage ③ starts.

**1:1 safe area is a hard constraint, not a nicety.** The square crop keeps only the centre of
the 9:16 frame — y 420–1500 of 1920. Every word of on-screen text, the presenter's face, and the
CTA pointing gesture must sit inside **x 54–1026, y 470–1450** (central square minus 5 % margins).
Anything outside that box exists for the 9:16 cut only and must be decorative.

## Look

**Theme: "clean night."** Contemporary clinical calm. The film is set after hours, but after
hours in a *working modern clinic* — lights down, surfaces clean, everything current. Period
and noir cues (brass, dust in the air, film grain, deep shadow) read as neglect in a healthcare
setting, so the look deliberately avoids all of them.

**One ground.** Every frame in this film — A-roll and B-roll alike — sits in the same room. The
B-roll cards render over `PLATE_CLINIC_DEFOCUSED`, a still of the clinic reception pulled from the
presenter master and blurred, rather than over flat `#0B1622`. The phone UI, the counters and the
kinetic type float *in the clinic at night*, so a cut from the presenter to a screen stays in one
continuous space instead of dropping into a graphic void.

*This board previously specified two grounds and never reconciled them:* the palette called
`#0B1622` "the whole film sits on this" and the B-roll frames sat on near-black, while the A-roll
sat in a lit clinic falling to soft desaturated slate. The film would have alternated between a
room and a void on every cut. `#0B1622` is now the deepest value inside the plate and the chrome
colour inside the phone UI — which is what it should have been from the start.

- **Visual style:** contemporary clinical calm — a real modern private clinic after closing,
  shot the way a competent corporate film would shoot it. Matte white and pale grey surfaces,
  brushed steel, a glass partition, low greenery. One subject in frame, shallow depth of field,
  natural performance, everything in the room current and well kept.
- **Lighting:** night interior, high-key for a night scene. Soft even ambient slightly on the
  cool side, motivated by recessed ceiling lights dimmed to their night setting and corridor
  light through a glass partition. A soft broad key just left of camera at eye height keeps the
  face evenly readable at phone size. The background falls to soft desaturated slate, holding
  separation while staying open. One modern matte-black LED task lamp and a faint monitor glow
  sit in the background as the only warm and cool accents; skin stays neutral. The identical
  setup holds across all five A-roll shots so separate generations cut together.

  *Why not the amber-key / teal-fill setup this board originally specified:* it contradicted the
  documentary-realism brief (it is the orange-and-teal blockbuster grade), it was physically
  unmotivated — a small desk lamp cannot key a waist-up medium at 45 degrees, so Runway invents a
  different resolution every generation and attacks the identity lock — and it graded the footage
  in the two colours the graphics need to sit against, costing the overlays their contrast. Deep
  shadow also turns to mud after Meta's compression on a phone in daylight.
- **Camera language:** eye-level medium shots, 50 mm at f/2.8, locked-off or a slow 5-8 % push-in.
  One brief handheld micro-drift on the hook. One camera move and one action per take. Subject
  centred inside the 1:1 square safe area.
- **Cut grammar:** REASSURE (32–36 s) cuts straight into CTA (36–42 s) — the only A-roll-to-A-roll
  cut in the film. Identical framing on both sides would read as a jump cut, so the two differ by a
  clear step: REASSURE is a locked-off medium, CTA opens out to a medium-wide with a slow push-in.
  Opening out on the last shot also makes room for the pointing gesture and the end card. Every
  other A-roll shot is separated by B-roll, so matching framing there is an asset.
- **Texture:** clean digital capture, neutral white balance, minimal noise, crisp surfaces. The
  720p A-roll against native 1080p graphics is reconciled in Remotion at stage 5 with a light
  uniform soften on the A-roll layer, rather than baked into generation as grain.

### Reference frames (the quality ceiling)

1. Modern clinic reception at night, overhead lights dimmed. A man in an open white clinician's coat
   stands beside the counter holding a dark phone at waist height, his face evenly lit and clearly
   readable. A matte-black LED task lamp glows small in the background; a glass partition carries
   corridor light. Medium shot, 50 mm, fixed framing.
2. Low three-quarter insert of the same counter, unoccupied and immaculate: a closed laptop, a
   matte-black task lamp lit low, a chair turned away, the corridor beyond in soft slate. Clean
   surfaces, stillness, one thin highlight along the counter edge.
3. The presenter lowers the phone and looks straight to lens, chin level, one small nod. Steady,
   unhurried, composed. Medium close-up, eye level, face evenly lit.
4. Same man, same light, a small confident smile arriving; he holds the lens, settled and certain.
   Medium shot, locked-off.
5. *(B-roll ceiling)* A 9:16 phone screen filling most of the frame, floating over the softly
   defocused clinic reception at night so the room stays readable behind and around it. Chat rows on
   `#0B1622` chrome, contact names replaced by soft slate blur bars, timestamps 8:12 PM / 9:04 PM /
   10:37 PM in amber, teal unread pips. The list scrolls up at reading pace, then stops dead on 10:37 PM.
6. *(B-roll ceiling)* A teal card reading "Overnight · 22 enquiries handled · 6 booked" sitting over
   the same softly defocused clinic plate, the two numbers counting up and landing, a thin teal bar
   filling underneath.

## Palette & type

| Role | Hex | Swatch | Job |
|---|---|---|---|
| background | `#0B1622` | ███ night navy-black | the deepest value in the clinic plate, and the phone-UI chrome — never a full-frame fill |
| primary | `#14A0A8` | ███ Anaya teal | the solution, the agent, everything answered |
| accent | `#F5A524` | ███ after-eight amber | the timestamps, the unanswered - in graphics, never on skin |
| text | `#F2F6F8` | ███ off-white | all copy |
| muted | `#7C8B99` | ███ slate | timestamps, labels, blurred name bars |

**The palette is the narrative, and it lives in the graphics.** Amber owns 0–17 s (unread timestamps, the accusation).
Teal takes over from 21 s and holds through the CTA. The 17–21 s reframe block is the crossfade —
it is the warmest-lit shot in the film, because that is the moment the ad stops accusing.
All five colours clear 4.5:1 against the background, muted included (5.2:1), so timestamps in the
phone mockup stay legible after Meta's compression.

Deliberately **not** in the palette: red (tips accusation into scolding) and WhatsApp green as a
*brand* accent. A green appears only inside the phone mockup where a chat UI would naturally have
one — see the brand-imitation risk below.

**Heading font:** IBM Plex Sans Arabic SemiBold (600), sentence case for statements, ALL CAPS only
for the two-word stabs ("PAID LEADS. NO REPLY."). **Body font:** IBM Plex Sans Arabic Regular (400).
One family for both, chosen because its Arabic and Latin are designed as a matched pair — the
Arabic chat bubble at 21–32 s must not look like a different film. Load via `@remotion/google-fonts`
at stage ⑤. Minimum 48 px body / 96 px headline at 1080 wide.

**Motion:** spring, damping 26 / stiffness 220, 8-frame entrances. Snappy, no bounce, no overshoot —
the film is calm and certain, and springy UI would undercut that. Cuts land on the music pulse.

## Cast & world bible — paste these strings verbatim

> **The identity lock, in one rule: ONE master keyframe, four motion prompts.**
> Do not generate four presenter images. Generate a single master still at ≥1440×2560, get it
> approved, and use *that same file* (or a crop of it) as the input keyframe for all four
> on-camera takes. Wardrobe, hair, skin tone, lighting and room then match by construction rather
> than by hope. The four blocks differ only in camera move and body language:
> hook = he lowers the phone and speaks; reframe = he shakes his head once, gently, and speaks.
> Every generation is a locked-off static camera on fixed framing — camera moves are added in
> Remotion afterwards, so Runway is asked for the performance and nothing else.
> Crops are permitted down to **720×1280 of the master** — tighter than that and Runway is
> upscaling a face, which is exactly when identity drifts. Reject any take where the face,
> hairline, earrings or blazer lapel changes.

| Key | Descriptor (verbatim) | Reference image |
|---|---|---|
| `CHAR_PRESENTER` | Medium shot, waist up, eye level, centred, 50 mm lens at f/2.8 with a softly defocused background: a man in his late 30s of Middle Eastern appearance with warm olive skin, short neatly cut dark hair, a closely trimmed dark beard, slim build, wearing a crisp open white clinician's coat over a plain light-blue collared shirt, standing beside a clean modern clinic reception counter at night, holding a dark slim smartphone in his right hand at waist height, looking straight into the lens with a calm level expression. Soft even lighting slightly on the cool side with a broad key just left of camera at eye height, his face evenly lit and clearly readable, the background falling to soft desaturated slate. | **to generate** -> `03_prompts/keyframes/char-presenter-master.png` |
| `LOC_CLINIC_RECEPTION_NIGHT` | a small contemporary private-clinic reception at night, matte white counter with a closed laptop and a slim matte-black LED task lamp lit low, brushed steel details, a glass partition to a lit corridor behind, a low shelf of green plants, ceiling lights dimmed to a soft even night level, surfaces clean and current | derived from the presenter master |
| `PLATE_CLINIC_DEFOCUSED` | a still frame of the clean modern clinic reception at night, pulled from the approved presenter master with the presenter absent or cropped out, blurred to a soft defocus: matte white counter, brushed steel, a glass partition carrying corridor light, a slim matte-black LED task lamp lit low, the space settling to soft desaturated slate with #0B1622 as its deepest value. This is the background layer under every B-roll card in the film. | derived from the presenter master |
| `PROP_PHONE` | a dark slim smartphone with a plain black bezel and a smooth blank screen, held upright in one hand | part of the presenter master |
| `UI_PHONE_SCREEN` | a 9:16 phone screen built in Remotion: `#0B1622` chrome, 8 px corner radius, rows divided by 1 px `#7C8B99` lines at 20 % opacity, unread pips in `#14A0A8`, timestamps in `#F5A524`, contact names replaced by soft blurred slate bars, IBM Plex Sans Arabic throughout, one Arabic message bubble in the 21–32 s block | Remotion-rendered, never prompted |
| `BRAND_LOGO` | the Anaya wordmark, composited in Remotion only, first and only appearance on the 40–42 s end card | Remotion-rendered, never prompted |

`PROP_PHONE` keeps a **blank** screen on purpose. Every readable pixel in this film is Remotion's.

## A-roll / B-roll strategy

**Target A-roll ratio: 0.40** — set deliberately, overriding the 60–70 % house default, and describing
the edit rather than driving it.

The reason is structural, not stylistic: three of the seven script blocks (PROBLEM 3–10 s,
AGITATE 10–17 s, SOLUTION 21–32 s) are *proof* blocks whose entire job is to show a screen the
viewer recognises — their own WhatsApp Business inbox, their own Ads Manager, the Anaya dashboard.
That is 25 of 42 seconds, and Runway cannot produce believable app UI (it is the #1 known weak
spot), so those seconds are Remotion B-roll by necessity and by preference. Forcing the house
ratio would mean inventing A-roll the script does not want. The validator's rhythm check compares
the stage ② breakdown against this number, so it is set to what the script actually needs.

Expected shape: A-roll 17 s (hook 4.5 + reframe 4.5 + reassure 4 + CTA 6), B-roll 25 s. That is 0.40.
Four A-roll shots, all of them the presenter, all off the single master keyframe — so the project needs
one keyframe rather than two, which simplifies its highest-risk part.

**A-roll is for:** a human being accountable to you. The presenter exists to make the accusation
survivable — "it's not your team" only works coming from a face. That is the whole of the A-roll.

**B-roll is for:** proof the viewer can check against their own phone. Numbers, timestamps,
message bubbles, the dashboard.

**Rhythm guards for stage ②:** the SOLUTION block is 11 s and must split into no more than three
B-roll scenes so the "3 consecutive B-roll" rule holds. The 10–17 s AGITATE block is where the
front-desk A-roll insert goes — it breaks the longest B-roll run and lands on its own VO line.

**Templates:** `PhoneUI` *(new — see risk 3)*, `KineticText`, `StatCounter`, `BulletList`, `CTA`,
with `Caption` and `CalloutTag` as overlays on the A-roll blocks.

- `Caption` — burned-in subtitle on every VO line, all 42 s. This ad will be watched muted.
- `CalloutTag` — "PAID LEADS. NO REPLY." over the inbox scroll; "8:12 PM" pinned in the corner.
- `KineticText` — "Your agency counted it. Nobody replied." at ~15 s.
- `StatCounter` — "22 enquiries handled" / "6 booked" / "under 5 minutes".
- `BulletList` — "Your number · Your team · Your EMR" at 32–36 s over the reassure A-roll.
- `CTA` — end card 40–42 s: headline "Tap Send Message", action "your free reply audit", logo.

## Audio

- **VO tone:** calm, level, adult, mid-chest. A peer speaking to a peer at the end of a long day.
  Statements land flat and stop — the accusation works because it is delivered without heat.
  Warmth arrives at "It's not your team." and stays. English with a light regional accent.
- **Music:** sparse minor-key electronic. 90 BPM. A single low sustained synth and a soft ticking
  pulse under 0–17 s; the pulse drops out at 17 s for the reframe; a warm teal pad enters at 21 s
  and opens up through the CTA. Music holds under the last line rather than swelling over it.
- **SFX:** one soft phone-notification buzz at ~3 s, quiet night room tone throughout, a single
  soft chime as the dashboard counter lands at ~24 s. Cuts are carried by the music pulse and the
  grain, so hard cuts read as intentional.

## Do

1. Reuse the single approved `char-presenter-master.png` as the input keyframe for all four
   on-camera takes, and describe *motion only* in those prompts.
2. Keep every word of on-screen text, the presenter's face, and the CTA gesture inside
   x 54–1026, y 470–1450 so the 1:1 cutdown works from the same EDL.
3. Keep all screens blank in Runway prompts and add every readable pixel in Remotion.
4. Hold the same lighting words — "soft even lighting slightly on the cool side, a broad key just
   left of camera at eye height, the background falling to soft desaturated slate" — in all five
   A-roll prompts. Keep brand amber and teal in the graphics and small background practicals only,
   leaving skin and surfaces neutral so the overlays keep their contrast.
5. Blur every patient name, phone number, treatment name and spend figure in the phone mockups,
   and keep the ad's claims to response time and follow-up.

## Don't

0. Avoid brass fittings, visible dust in the air, heavy film grain and deep shadow. *(Instead:
   keep the clinic current, clean and evenly lit — period and noir cues read as neglect in a
   healthcare setting, and crushed blacks turn to mud after Meta's compression.)*

1. Avoid close-ups of the presenter's mouth; frame at medium or medium-close so lip-sync is not
   the thing the eye is judging. *(Instead: let the burned-in caption carry the words.)*
2. Avoid red, alarm SFX and rising VO inflection. *(Instead: amber, a ticking pulse, and a level
   read — accusatory, never scolding.)*
3. Avoid reproducing WhatsApp's and Meta's actual product UI pixel-for-pixel. *(Instead: build a
   recognisable generic chat and ads UI in the film's own palette.)*
4. Avoid long or compound camera paths and multi-action prompts. *(Instead: one camera move and
   one action per take, 3–6 s.)*
5. Avoid prompting Runway for the Anaya wordmark or any lettering. *(Instead: composite the logo
   once, on the end card, in Remotion.)*

## Risks, ranked

**1 · Presenter identity drift across four takes — the project's highest risk.**
Two separate generations of "the same man" will not be the same man. The mitigation is the
one-master-keyframe rule above, and it is non-negotiable: if the four takes are generated from
four different stills, this ad cannot be cut. Review gate: put frames from all four accepted takes
side by side before assembly and check face, hairline, earrings and lapel. If drift appears,
re-crop from the master rather than re-rolling the prompt.

**2 · Lip-sync — a genuine conflict with the locked direction.**
`docs/runway-prompting.md` lists "lip-sync / talking to camera" as a known weak spot and advises
avoiding dialogue close-ups. This ad has 17 s of presenter on camera over VO. Mitigations, in
order: medium framing so the mouth is small; burned-in captions carrying every word; keeping each
on-camera block to 3–6 s; and designing the body language so the eye has somewhere else to go
(the phone in the hook, the head-shake in the reframe, the point-down in the CTA). Escalation if
three takes still look wrong on a block: reframe that block as the presenter looking at the phone
or at the desk with VO over action, per the weak-spot table, and log it. The 17–21 s reframe block
is the most exposed, because it is the one line that must feel spoken *to* the viewer.

**3 · No Remotion template exists for app UI.** The registry has eight card templates and three
overlays; none of them render a phone screen. The three proof blocks — 25 s, more than half the
film — depend on a template that has to be written. Recommendation: build **one** `PhoneUI`
template with a `variant` prop (`inbox`, `thread`, `ads`, `dashboard`), which needs an entry in
`remotion/src/broll/registry.tsx`, a row in `docs/remotion-broll.md`, and an addition to the
`templateRef` enum in `schemas/edl.schema.json`. Scope this into stage ⑤ now, not at render time.
Zero-code fallback if the user rejects the new template: `BulletList` + `StatCounter` + `KineticText`
cards standing in for the screens — cheaper, materially less persuasive, and it weakens the
"open your own inbox tonight" proof.

**4 · The 1:1 cutdown silently breaks the CTA.** "Pointing down to the button" is a 9:16 gesture;
in the square crop the lower third is gone. The gesture must be framed to stay inside the central
square, and the end-card CTA text must too. Cheapest insurance: review the 1:1 crop of the CTA
keyframe *before* generating the take.

**5 · Resolution mismatch.** Runway delivers 720×1280; the composition is 1080×1920, a 1.5×
upscale on A-roll only, intercut with natively crisp B-roll. The shared grain-and-vignette pass is
the fix. If it still reads soft at review, the fallback is to master the whole film at 720×1280
and let Meta upscale — acceptable for Reels, and worth deciding before stage ⑤ rather than during.

**6 · Platform and privacy compliance.** Healthcare advertising on Meta is sensitive: every patient
name, number and treatment name stays blurred, the claims stay operational ("replies in under five
minutes", "follows up for three weeks") rather than clinical, and the UI mockups stay visibly
generic rather than impersonating Meta's own products in an ad served on Meta.

**7 · Tone drift toward insult.** The script absolves the staff explicitly at 17 s, but palette,
cut rhythm and VO can all re-accuse them. The guard is in the board: no red, level read, and the
reframe block lit warmest in the film.
