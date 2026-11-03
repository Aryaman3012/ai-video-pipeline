// Beat 03 (beside): one of those bubbles becomes a person you paid for. The ad stamps its cost,
// a dotted path heads for a calendar slot, stalls on "never", and the slot stays "Not booked".
import React from "react";
import { interpolate } from "remotion";
import { MONO, SANS, useCues, usePalette } from "../../explainer/context";
import { useGeometry } from "../../explainer/Host";
import { CalIcon, MegaphoneIcon } from "../../explainer/primitives";
import { AR_FONT, bounce, clamp01, Illustrative, pop, ramp, useClock } from "./kit";

type Props = {
  patient?: { name: string; wanted: string; via: string };
  cost_tag?: string;
  illustrative?: boolean;
  slot?: { label: string; state: string };
  message_ar?: string;
};

export const LostLeadTrail: React.FC<Props> = ({
  patient = { name: "Mariam A.", wanted: "Dermatology consult", via: "Social media ad" },
  cost_tag = "AED 95 per lead",
  illustrative = true,
  slot = { label: "Thu · 4:30 PM", state: "Not booked" },
  message_ar = "مرحبا، عندكم موعد هالأسبوع؟",
}) => {
  const { frame, fps, t } = useClock();
  const cue = useCues();
  const C = usePalette();
  const { panel, u, vertical } = useGeometry();
  const s = u * (vertical ? 1.38 : 1.2);

  const tCard = cue("card", 1.9);
  const tPaid = cue("paid", 2.6);
  const tAttract = cue("attract", 3.0);
  const tNever = cue("never", 4.2);
  const tEmpty = cue("empty", 4.6);

  const bubble = pop(frame, fps, tCard - 0.05, 7);
  const grow = pop(frame, fps, tCard + 0.12, 10);
  const ad = pop(frame, fps, tCard + 0.2, 9);
  const stamp = bounce(frame, fps, tPaid);
  const cal = pop(frame, fps, tAttract - 0.05, 9);
  // path draws toward the slot, then stalls short of it
  const draw = interpolate(t, [tAttract, tNever], [0, 0.62], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stall = ramp(t, tNever, 0.5);
  const empty = bounce(frame, fps, tEmpty);
  const W = (vertical ? 680 : 660) * s;
  const PATH = 118 * s;

  const ink = C.ink;
  const card: React.CSSProperties = { background: C.raised, border: `1px solid ${C.line}`, borderRadius: 20 * s, boxShadow: "0 1px 2px rgba(31,36,48,0.05), 0 22px 44px -26px rgba(31,36,48,0.32)" };

  return (
    <div style={{ width: panel.w, height: panel.h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: SANS, color: ink }}>
      {/* ad source + cost stamp */}
      <div style={{ ...card, width: W, padding: `${18 * s}px ${22 * s}px`, display: "flex", alignItems: "center", gap: 16 * s, opacity: ad, transform: `translateY(${(1 - ad) * -14 * s}px)`, position: "relative" }}>
        <div style={{ width: 58 * s, height: 58 * s, borderRadius: 14 * s, background: C.sunken, display: "grid", placeItems: "center" }}>
          <MegaphoneIcon size={30 * s} color={C.ink2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15 * s, fontWeight: 700, letterSpacing: "0.1em", color: C.ink3 }}>LEAD SOURCE</div>
          <div style={{ fontSize: 27 * s, fontWeight: 700 }}>{patient.via}</div>
        </div>
        <div style={{ display: "grid", justifyItems: "end", gap: 6 * s, opacity: Math.min(1, stamp * 1.5), transform: `rotate(${-5 + 2 * (1 - stamp)}deg) scale(${1.5 - 0.5 * stamp})` }}>
          <div style={{ border: `${3 * s}px solid ${C.alert}`, color: C.alert, borderRadius: 10 * s, padding: `${6 * s}px ${14 * s}px`, fontSize: 25 * s, fontWeight: 800, letterSpacing: "0.01em", background: C.alertWash, whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: MONO, fontWeight: 500 }}>{cost_tag.split(" ").slice(0, 2).join(" ")}</span> {cost_tag.split(" ").slice(2).join(" ")}
          </div>
          {illustrative && <Illustrative size={13} />}
        </div>
      </div>

      {/* connector */}
      <div style={{ width: 3 * s, height: 30 * s, background: C.lineStrong, opacity: ad }} />

      {/* the bubble that becomes a person */}
      <div style={{ ...card, width: W, padding: `${20 * s}px ${22 * s}px`, opacity: bubble, transform: `scale(${0.92 + 0.08 * bubble})`, boxShadow: grow > 0.5 ? (card.boxShadow as string) : "none", borderColor: grow > 0.05 ? C.line : "transparent", background: grow > 0.05 ? C.raised : "transparent" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 * s, height: 70 * s * grow, opacity: grow, overflow: "hidden", marginBottom: 14 * s * grow }}>
          <div style={{ width: 64 * s, height: 64 * s, borderRadius: 99, background: C.moneyWash, color: C.money, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 25 * s, flexShrink: 0 }}>
            {patient.name.split(" ").map((w) => w[0]).join("")}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 30 * s, fontWeight: 700, lineHeight: 1.1 }}>{patient.name}</div>
            <div style={{ fontSize: 21 * s, color: C.ink2, marginTop: 4 * s }}>{patient.wanted}</div>
          </div>
          <div style={{ fontSize: 16 * s, fontWeight: 700, letterSpacing: "0.08em", color: C.ink3, alignSelf: "flex-start", marginTop: 6 * s }}>NEW PATIENT</div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <div style={{ background: C.waBg, borderRadius: 16 * s, padding: `${10 * s}px ${16 * s}px`, maxWidth: "88%" }}>
            <div dir="rtl" style={{ fontFamily: AR_FONT, fontSize: 25 * s, lineHeight: 1.35 }}>{message_ar}</div>
            <div style={{ fontSize: 16 * s, color: C.ink3 }}>Hi, any appointment this week?</div>
          </div>
        </div>
      </div>

      {/* dotted path toward the slot — stalls and fades on "never" */}
      <div style={{ position: "relative", width: 40 * s, height: PATH }}>
        <svg width={40 * s} height={PATH} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: 1 - 0.7 * stall }}>
          <line x1={20 * s} y1={0} x2={20 * s} y2={PATH * draw} stroke={stall > 0.05 ? C.alert : C.money} strokeWidth={5 * s} strokeDasharray={`${2 * s} ${13 * s}`} strokeLinecap="round" />
        </svg>
        {draw > 0.01 && (
          <div style={{ position: "absolute", left: 20 * s, top: PATH * draw, transform: "translate(-50%,-50%)", width: 22 * s, height: 22 * s, borderRadius: 99, background: stall > 0.05 ? C.alert : C.money, opacity: 1 - 0.75 * stall, boxShadow: `0 0 0 ${6 * s}px ${stall > 0.05 ? C.alertWash : C.moneyWash}` }} />
        )}
        {stall > 0.01 && (
          <div style={{ position: "absolute", left: 50 * s, top: PATH * draw, transform: "translateY(-50%)", whiteSpace: "nowrap", fontSize: 19 * s, fontWeight: 700, color: C.alert, opacity: stall * (1 - 0.4 * ramp(t, tEmpty, 0.4)) }}>
            No reply
          </div>
        )}
      </div>

      {/* the calendar slot it never reaches */}
      <div style={{ ...card, width: W, padding: `${18 * s}px ${22 * s}px`, opacity: cal, transform: `translateY(${(1 - cal) * 16 * s}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 * s, marginBottom: 12 * s }}>
          <CalIcon size={26 * s} color={C.ink2} />
          <span style={{ fontSize: 21 * s, fontWeight: 700, color: C.ink2 }}>Jumeirah · Dermatology</span>
        </div>
        {["3:30 PM", slot.label, "5:30 PM"].map((row, i) => {
          const isSlot = i === 1;
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: `${172 * s}px 1fr`, alignItems: "center", gap: 14 * s, marginTop: i ? 10 * s : 0 }}>
              <span style={{ fontFamily: MONO, fontSize: (isSlot ? 21 : 18) * s, whiteSpace: "nowrap", color: isSlot ? ink : C.ink3, fontWeight: isSlot ? 500 : 400 }}>{isSlot ? row : `Thu · ${row}`}</span>
              {isSlot ? (
                <div style={{ position: "relative", height: 58 * s, borderRadius: 12 * s, border: `${3 * s}px dashed ${empty > 0.3 ? C.alert : C.lineStrong}`, background: empty > 0.3 ? C.alertWash : "transparent", display: "flex", alignItems: "center", paddingLeft: 18 * s }}>
                  <span style={{ fontSize: 21 * s, color: C.ink3, opacity: 1 - clamp01(empty * 2) }}>Open slot</span>
                  <span style={{ position: "absolute", left: 18 * s, fontSize: 25 * s, fontWeight: 800, color: C.alert, opacity: Math.min(1, empty * 1.5), transform: `scale(${1.3 - 0.3 * empty})`, transformOrigin: "left center" }}>{slot.state}</span>
                </div>
              ) : (
                <div style={{ height: 44 * s, borderRadius: 10 * s, background: C.sunken, display: "flex", alignItems: "center", paddingLeft: 16 * s, fontSize: 18 * s, color: C.ink3 }}>{i === 0 ? "Booked · Ahmed K." : "Booked · Fatima S."}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
