// Beat 01 (beside): one clinic's front-desk inbox — three polite, unanswered enquiries.
// On "multiply" identical phones fan out from behind it; on "locations" each gets a branch tag.
import React from "react";
import { Easing, interpolate } from "remotion";
import { MONO, SANS, useCues, usePalette } from "../../explainer/context";
import { useGeometry } from "../../explainer/Host";
import { AR_FONT, bounce, lerp, pop, ramp, tones, useClock } from "./kit";

type Chat = { name: string; text_ar?: string; text_en: string; ago: string };
type Props = { clinic?: string; time?: string; chats?: Chat[]; unread?: number; deck_locations?: string[] };

const DEFAULT_CHATS: Chat[] = [
  { name: "Mariam", text_ar: "مرحبا، عندكم موعد هالأسبوع؟", text_en: "Hi, any appointment this week?", ago: "2h" },
  { name: "+971 50 ••• 4417", text_en: "How much is laser hair removal?", ago: "3h" },
  { name: "Khalid", text_ar: "الدكتورة سارة موجودة السبت؟", text_en: "Is Dr. Sara in on Saturday?", ago: "Yesterday" },
];

// Phone in design px (k = 1). The parent scales everything by `u`.
const PW = 380;
const PH = 720;
const PIVOT = 1020; // fan pivot, measured down from the phone's top edge
const FAN = [-18, -12, -6, 6, 12, 18];
const TAG_LIFT: Record<number, number> = { 6: 46, 12: 136, 18: 46 }; // stagger heights so tags never touch

const Inbox: React.FC<{ clinic: string; time: string; chats: Chat[]; unread: number; rowP: (i: number) => number; badgeP: number }> = ({ clinic, time, chats, unread, rowP, badgeP }) => {
  const C = usePalette();
  const green = C.money;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", fontFamily: SANS, color: C.ink }}>
      {/* status bar */}
      <div style={{ position: "absolute", top: 16, left: 30, right: 30, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 600 }}>
        <span style={{ fontFamily: MONO }}>{time}</span>
        <span style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
          {[6, 9, 12, 15].map((h) => <span key={h} style={{ width: 3.5, height: h, background: C.ink, borderRadius: 1 }} />)}
          <span style={{ width: 24, height: 12, border: `1.5px solid ${C.ink}`, borderRadius: 3, marginLeft: 6, padding: 1.5 }}><span style={{ display: "block", width: "40%", height: "100%", background: C.ink, borderRadius: 1 }} /></span>
        </span>
      </div>
      <div style={{ position: "absolute", top: 50, left: 20, right: 20 }}>
        <div style={{ fontSize: 14, color: C.ink3, fontWeight: 600, letterSpacing: "0.04em" }}>{clinic.toUpperCase()} CLINIC · FRONT DESK</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
          <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em" }}>Chats</span>
          <span style={{ background: C.alert, color: "#fff", fontWeight: 700, fontSize: 16, borderRadius: 99, minWidth: 26, height: 26, display: "grid", placeItems: "center", padding: "0 7px", transform: `scale(${badgeP})`, opacity: Math.min(1, badgeP * 2) }}>{unread}</span>
        </div>
        <div style={{ marginTop: 10, background: C.sunken, borderRadius: 10, height: 34, display: "flex", alignItems: "center", padding: "0 12px", color: C.ink3, fontSize: 15 }}>Search</div>
      </div>
      <div style={{ position: "absolute", top: 172, left: 0, right: 0 }}>
        {chats.map((c, i) => {
          const p = rowP(i);
          return (
            <div key={i} style={{ display: "flex", gap: 12, padding: "11px 18px", borderBottom: `1px solid ${C.line}`, opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
              <div style={{ width: 46, height: 46, borderRadius: 99, background: ["#c9d6df", "#dfd3c3", "#cfd8cf"][i % 3], display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontSize: 19, flexShrink: 0 }}>
                {c.name.startsWith("+") ? "•" : c.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, fontSize: 18, whiteSpace: "nowrap" }}>{c.name}</span>
                  <span style={{ fontSize: 13, color: green, fontWeight: 600 }}>{c.ago}</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 3 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {c.text_ar && <div dir="rtl" style={{ fontFamily: AR_FONT, fontSize: 17, color: C.ink, lineHeight: 1.35, textAlign: "right" }}>{c.text_ar}</div>}
                    <div style={{ fontSize: c.text_ar ? 13 : 15.5, color: c.text_ar ? C.ink3 : C.ink2, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.text_en}</div>
                  </div>
                  <span style={{ background: green, color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 99, width: 21, height: 21, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 2 }}>1</span>
                </div>
              </div>
            </div>
          );
        })}
        {/* older, already-handled chats: the inbox looks normal, which is the point */}
        {[
          { n: "Noura H.", m: "Thanks, see you then", t: "Mon" },
          { n: "Lab results", m: "Report sent to patient", t: "Sun" },
          { n: "Omar R.", m: "Your follow-up is confirmed", t: "Sat" },
          { n: "Reception team", m: "Shift swap for Friday", t: "Fri" },
          { n: "Hessa M.", m: "Invoice attached", t: "Thu" },
        ].map((r, i) => (
          <div key={r.n} style={{ display: "flex", gap: 12, padding: "11px 18px", borderBottom: `1px solid ${C.line}`, opacity: 0.5 * rowP(2) }}>
            <div style={{ width: 46, height: 46, borderRadius: 99, background: C.sunken, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600, fontSize: 17 }}>{r.n}</span>
                <span style={{ fontSize: 13, color: C.ink3 }}>{r.t}</span>
              </div>
              <div style={{ fontSize: 15, color: C.ink3, marginTop: 3 }}><span style={{ marginRight: 5 }}>{i === 0 ? "✓✓" : "✓"}</span>{r.m}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 62, borderTop: `1px solid ${C.line}`, background: "#fbfbfa", display: "flex", justifyContent: "space-around", alignItems: "center", paddingBottom: 8, fontSize: 12, fontWeight: 600, color: C.ink3 }}>
        {["Updates", "Calls", "Chats", "Settings"].map((n) => (
          <div key={n} style={{ display: "grid", justifyItems: "center", gap: 4, color: n === "Chats" ? C.ink : C.ink3 }}>
            <span style={{ width: 22, height: 18, borderRadius: 6, background: n === "Chats" ? C.money : C.line }} />
            {n}
          </div>
        ))}
      </div>
    </div>
  );
};

const Shell: React.FC<{ children: React.ReactNode; dim?: number }> = ({ children, dim = 0 }) => (
  <div style={{ width: PW, height: PH, borderRadius: 56, background: "#111", padding: 11, boxShadow: "0 40px 70px -34px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06) inset" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 46, overflow: "hidden", position: "relative" }}>
      {children}
      {dim > 0 && <div style={{ position: "absolute", inset: 0, background: "#0b1218", opacity: dim }} />}
    </div>
  </div>
);

export const UnansweredInbox: React.FC<Props> = ({ clinic = "Jumeirah", time = "9:48 PM", chats = DEFAULT_CHATS, unread = 3, deck_locations = ["Al Barsha", "Dubai Marina", "Business Bay", "Mirdif", "Sharjah", "Abu Dhabi"] }) => {
  const { frame, fps, t } = useClock();
  const cue = useCues();
  const C = usePalette();
  const T = tones(C);
  const { panel, u, vertical } = useGeometry();

  const tPhone = cue("phone", 1.2);
  const tChats = cue("chats", 1.5);
  const tSettle = cue("settle", 3.2);
  const tMulti = cue("multiply", 4.5);
  const tTags = cue("tags", 5.3);

  const enter = pop(frame, fps, tPhone - 0.05, 9);
  const rowP = (i: number) => pop(frame, fps, tChats + i * (3 / fps), 8);
  const badgeP = bounce(frame, fps, tChats + 0.25);
  const settle = ramp(t, tSettle, 0.7, Easing.inOut(Easing.cubic));
  const fan = pop(frame, fps, tMulti - 0.04, 12);

  const sBig = vertical ? 1.3 : 1.18;
  const sFan = vertical ? 0.96 : 0.92;
  const s = lerp(sBig * (1 - 0.03 * settle), sFan, fan) * u;
  const lift = lerp(settle * 10, 30, fan); // the fan's tags sit above the phones, so the phones drop a little

  const allTags = [{ name: clinic, angle: 0 }, ...deck_locations.slice(0, FAN.length).map((n, i) => ({ name: n, angle: FAN[i] }))];
  const order = [...allTags.keys()].sort((a, b) => Math.abs(allTags[a].angle) - Math.abs(allTags[b].angle));

  const Tag: React.FC<{ name: string; angle: number; i: number }> = ({ name, angle, i }) => {
    const p = bounce(frame, fps, tTags + order.indexOf(i) * (3 / fps));
    if (p <= 0.001) return null;
    const lifted = angle === 0 ? 136 : TAG_LIFT[Math.abs(angle)];
    return (
      <div style={{ position: "absolute", left: PW / 2, top: -lifted, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 1.5), whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, background: angle === 0 ? C.night : "#fff", color: angle === 0 ? "#fff" : C.ink, borderRadius: 99, padding: "8px 16px 8px 12px", fontFamily: SANS, fontSize: 21, fontWeight: 700, boxShadow: "0 10px 24px -12px rgba(14,27,36,0.5)", border: `1px solid ${C.line}` }}>
          <span style={{ width: 12, height: 12, borderRadius: 99, background: T.amber, boxShadow: `0 0 0 4px color-mix(in srgb, ${C.pending} 22%, transparent)` }} />
          {name}
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative", width: panel.w, height: panel.h, opacity: enter, transform: `translateY(${(1 - enter) * 110 * u}px)` }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 0, height: 0, transform: `scale(${s})` }}>
        <div style={{ position: "absolute", left: -PW / 2, top: -PH / 2 + lift }}>
          {/* back phones, outermost first so the inner ones sit on top */}
          {[...FAN.keys()].sort((a, b) => Math.abs(FAN[b]) - Math.abs(FAN[a])).map((i) => {
            const stagger = interpolate(fan, [0, 1], [0, 1]) * clampStagger(frame, fps, tMulti, Math.abs(FAN[i]) / 6 - 1);
            const a = FAN[i] * stagger;
            if (fan <= 0.001) return null;
            return (
              <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${a}deg)`, transformOrigin: `${PW / 2}px ${PIVOT}px`, opacity: Math.min(1, fan * 3) }}>
                <Shell dim={0.12 + 0.05 * (Math.abs(FAN[i]) / 6)}>
                  <Inbox clinic={deck_locations[i] ?? clinic} time={time} chats={chats} unread={unread} rowP={() => 1} badgeP={1} />
                </Shell>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <Shell>
              <Inbox clinic={clinic} time={time} chats={chats} unread={unread} rowP={rowP} badgeP={badgeP} />
            </Shell>
          </div>
          {/* branch tags ride on their phone's rotation */}
          {allTags.map((tg, i) => {
            const a = tg.angle * (i === 0 ? 0 : clampStagger(frame, fps, tMulti, Math.abs(tg.angle) / 6 - 1) * fan);
            return (
              <div key={tg.name} style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, transform: `rotate(${a}deg)`, transformOrigin: `${PW / 2}px ${PIVOT}px` }}>
                <Tag name={tg.name} angle={tg.angle} i={i} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** Fan stagger: ring n (0 = closest to the front) starts 2 frames after ring n-1. */
function clampStagger(frame: number, fps: number, t0: number, ring: number) {
  return interpolate(frame, [t0 * fps + ring * 2, t0 * fps + ring * 2 + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
}
