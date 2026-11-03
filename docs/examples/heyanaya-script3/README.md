# Example: HeyAnaya Script 3 (the quality bar)

A ~49 s explainer for UAE clinic-chain owners: one Emirati host, 7 Veo 3.1 Fast clips made in
Google Flow, and every other element built in Remotion. Delivered 16:9 + 9:16 (and 1.2×).
**Reference only** — learn how each visual was chosen; design new visuals for a new script.

Files: `original-plan.md` (the plan written before generation) · `as-built-timeline.ts` (what was
actually cut: per-clip durations, host layout keyframes, word cues) · `scenes/` (the scene code,
written against an earlier standalone project, so imports differ from the engine's).

## What each beat shows, and why

| # | Line | Host | Graphic | Why this graphic |
|---|---|---|---|---|
| 1 | A few unanswered WhatsApp enquiries don't seem like a big deal. Now multiply that across all your clinic locations. | full → split on "WhatsApp" → pip on "multiply" | One clinic's phone: a patient asks for a slot, a red "Unanswered" clock runs. On "multiply" it becomes a 3×3 grid of branches, each unanswered, a counter ticking with them. | The line is about scale. One concrete message first (the viewer recognises it), then the multiplication *happens on screen* on the word. |
| 2 | One at your first clinic. Another at your second. And more across the rest of your network. | pip | Night city map; a pin drops on "first", another on "second", the rest cascade on "more across". Count top-left. | "First / second / the rest" is a spatial list — a map lets each word land a pin. |
| 3 | Each one could be a potential patient you paid to attract, but never converted into a booking. | split (springs out of pip) | One lead's journey Ad → Enquiry → Reply → Booking. A patient token travels; "You paid for this lead" stamps on "paid"; the line snaps red on "never"; "Never booked". | The sentence is a causal chain with a break in it. Draw the chain, break it on the word. |
| 4 | Now imagine how many booking opportunities your entire chain could be missing over a month. | full with push-in → pip on "chain" | Dark screen, red bubbles pour into a counter that rolls to 1,240 while a 30-day strip fills. "Illustrative". | "Imagine" earns a beat of just the face (push-in); then the abstract "how many" becomes a number growing over a month. |
| 5 | Hey Anaya responds to all your leads instantly and in their preferred language, crafts messages that convert, and then schedules the appointments. | full (logo bug on "Hey Anaya") → split | A real-feeling chat: an Arabic enquiry, typing dots, instant Arabic reply with "Replied in 2 s"; quick-reply slots appear on "crafts messages that convert"; patient taps 10:30; "Appointment booked" on "schedules". Beside it four capability rows light on their words. | The solution beat shows the product doing each thing he names, in order, one cue per capability. Arabic proves "their preferred language" instead of saying it. |
| 6 | Because growing a clinic chain isn't just about generating more leads. | pip (springs out of split) | The map returns, every pin flips green and links into a network; "Just more leads" lands and is struck through on "leads". | Calls back beat 2's map — same place, problem solved. The strike-through is the "isn't just". |
| 7 | It's about turning more of the leads you already have into bookings. | split | The line typeset: "Turn more of / the leads you already have / into bookings. ✓", "already have" underlined. | The close is the message — kinetic type is right here and only here. |
| — | end card 3.2 s | — | Connected map dimmed; logo, headline, "Book a demo". | |

Patterns worth reusing as *reasoning*: concrete-then-multiply; let a list of places become a map;
draw causal chains and break them on the negative word; give the product beat one cue per
capability; call back an earlier graphic to show the problem solved; alternate full / split / pip
so the face returns every other beat; keep kinetic type for the close.

## What went wrong, and the rule it became

- **The clips came back different from the plan** (podcast set, host centred, black pillarbox bars
  and a Veo mark) → ingest crops one film-wide box; layouts reframe the host instead of relying on
  empty space in the shot; templates now state framing explicitly.
- **A new solution line was written after the plan** → the storyboard is rebuilt from the clips'
  real words; cues are words, so graphics followed the new line automatically.
- **Chat overflowed the phone** → chats are bottom-anchored (`ChatBody`), like a real chat.
- **Captions straddled the host panel in split** → captions follow the host into his panel.
- **Panel graphics read small at first** → design `beside` scenes to fill the panel (phone ≈ 1.0–1.1×).
