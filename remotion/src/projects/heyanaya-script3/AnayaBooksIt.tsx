// Beat 05 (beside): the product is the hero. On Mariam's phone, HeyAnaya does each thing he names:
// replies instantly, switches to her language, offers two concrete slots, she taps one, and the
// booking drops into the very slot that was left empty in beat 03.
import React from "react";
import { interpolate } from "remotion";
import { MONO, SANS, useCues, usePalette } from "../../explainer/context";
import { useGeometry } from "../../explainer/Host";
import { BoltIcon, Bubble, CalIcon, ChatBody, ChatHeader, Check, GlobeIcon, Phone, Typing } from "../../explainer/primitives";
import { AR_FONT, BrandMark, bounce, clamp01, Illustrative, pop, ramp, useClock } from "./kit";

type Props = {
  patient?: string;
  incoming_ar?: string;
  incoming_en?: string;
  reply_ar?: string;
  reply_en?: string;
  response_chip?: string;
  language_chip?: string;
  quick_replies?: string[];
  booking?: { title: string; detail: string; doctor: string };
  highlights_ar?: string[];
  highlights_en?: string[];
  clinic?: string;
};

/** Wraps each highlight phrase in a soft teal marker that sweeps in with `p`. */
const Marked: React.FC<{ text: string; marks: string[]; p: number; color: string; wash: string }> = ({ text, marks, p, color, wash }) => {
  if (p <= 0 || !marks.length) return <>{text}</>;
  const re = new RegExp(`(${marks.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return (
    <>
      {text.split(re).map((part, i) =>
        marks.includes(part) ? (
          <span key={i} style={{ background: `color-mix(in srgb, ${wash} ${Math.round(100 * p)}%, transparent)`, color: p > 0.5 ? color : undefined, borderRadius: 4, padding: "0 2px", fontWeight: 700, whiteSpace: "nowrap" }}>{part}</span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
};

export const AnayaBooksIt: React.FC<Props> = ({
  patient = "Mariam A.",
  incoming_ar = "مرحبا، عندكم موعد هالأسبوع؟",
  incoming_en = "Hi, any appointment this week?",
  reply_ar = "أهلاً مريم! عندنا موعد مع د. ليلى يوم الخميس ٤:٣٠ أو السبت ١١ الصبح. أي واحد يناسبك؟",
  reply_en = "Hi Mariam! Dr. Layla has Thu 4:30 PM or Sat 11 AM. Which suits you?",
  response_chip = "Replied in 3 s",
  language_chip = "EN → AR",
  quick_replies = ["Thu 4:30 PM", "Sat 11:00 AM"],
  booking = { title: "Booked", detail: "Thu 4:30 PM · Dermatology · Jumeirah", doctor: "Dr. Layla" },
  highlights_ar = ["د. ليلى", "الخميس ٤:٣٠", "السبت ١١"],
  highlights_en = ["Dr. Layla", "Thu 4:30 PM", "Sat 11 AM"],
  clinic = "Jumeirah Clinic",
}) => {
  const { frame, fps, t } = useClock();
  const cue = useCues();
  const C = usePalette();
  const { panel, u, vertical } = useGeometry();

  const tIn = cue("incoming", 0.5);
  const tReply = cue("reply", 2.0);
  const tLang = cue("language", 3.8);
  const tCraft = cue("craft", 4.5);
  const tTap = cue("tap", 5.5);
  const tConfirm = cue("confirm", 6.6);
  const tCal = cue("calendar", 7.3);

  const k = vertical ? 1.2 : 1.1;
  const s = u * k;
  const cu = u * (vertical ? 1.05 : 1.1); // column scale
  const colW = (vertical ? 492 : 500) * cu;
  const gap = (vertical ? 36 : 40) * u;

  // chat
  const sent = pop(frame, fps, tIn, 7);
  const typing = t > tIn + 0.35 && t < tReply;
  const reply = pop(frame, fps, tReply, 7);
  // EN → AR flip: squash closed, swap text, open
  const flipT = (t - tLang) / 0.24;
  const isAr = flipT >= 0.5;
  const flipScale = flipT > 0 && flipT < 1 ? Math.abs(Math.cos(flipT * Math.PI)) : 1;
  const craft = ramp(t, tCraft, 0.35);
  const buttons = pop(frame, fps, tCraft + 0.12, 8);
  const press = ramp(t, tTap - 0.06, 0.16);
  const pressDip = Math.sin(clamp01((t - tTap + 0.06) / 0.25) * Math.PI);
  const answer = pop(frame, fps, tTap + 0.3, 7);
  const replyGlow = craft * (1 - ramp(t, tTap, 0.4));

  // column
  const chip1 = bounce(frame, fps, tReply + 0.05);
  const chip2 = bounce(frame, fps, tLang);
  const chip2Flip = clamp01((t - tLang) / 0.3);
  const cardOut = pop(frame, fps, tConfirm, 11);
  const drop = pop(frame, fps, tCal - 0.04, 6);
  const filled = ramp(t, tCal + 0.1, 0.12);
  const lockup = pop(frame, fps, tIn - 0.06, 9); // brand lands as he finishes "Hey Anaya"

  const avatar = (
    <div style={{ width: 50 * s, height: 50 * s, borderRadius: 999, background: "#fff", display: "grid", placeItems: "center", border: `1px solid ${C.line}` }}>
      <BrandMark size={30 * s} />
    </div>
  );

  const chipStyle = (p: number): React.CSSProperties => ({
    display: "inline-flex", alignItems: "center", gap: 10 * cu, background: C.raised, border: `1px solid ${C.line}`, borderRadius: 14 * cu, padding: `${12 * cu}px ${18 * cu}px`,
    boxShadow: "0 16px 30px -22px rgba(31,36,48,0.4)", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 14 * cu}px) scale(${0.85 + 0.15 * p})`, fontSize: 25 * cu, fontWeight: 700, color: C.ink, whiteSpace: "nowrap",
  });

  const ROW_H = 58 * cu;
  const SLOT_TOP = 20 * cu + 34 * cu + 16 * cu + ROW_H + 12 * cu; // card padding + header + gap + row 1 + row gap
  // booked card travel: from over the phone's chat → hover above the slot → into the slot
  const travelX = interpolate(cardOut, [0, 1], [colW * 0.95 + gap, 0]);
  const hoverY = -150 * cu;
  const cardY = interpolate(drop, [0, 1], [hoverY, 0]);
  const cardScale = interpolate(drop, [0, 1], [1, 0.82]);

  return (
    <div style={{ width: panel.w, height: panel.h, display: "flex", alignItems: "center", justifyContent: "center", gap, fontFamily: SANS }}>
      {/* capability column + calendar */}
      <div style={{ width: colW, alignSelf: "stretch", display: "flex", flexDirection: "column", justifyContent: vertical ? "center" : "flex-end", gap: (vertical ? 40 : 26) * cu, paddingBottom: (vertical ? 0 : 70) * cu }}>
        <div style={{ marginBottom: vertical ? 20 * cu : "auto", marginTop: vertical ? 0 : 120 * cu, display: "flex", alignItems: "center", gap: 16 * cu, opacity: lockup, transform: `translateY(${(1 - lockup) * 14 * cu}px)` }}>
          <div style={{ width: 64 * cu, height: 64 * cu, borderRadius: 16 * cu, background: C.night, display: "grid", placeItems: "center" }}><BrandMark size={40 * cu} light /></div>
          <div>
            <div style={{ fontSize: 36 * cu, fontWeight: 700, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1 }}>HeyAnaya</div>
            <div style={{ fontSize: 18 * cu, color: C.ink3, marginTop: 6 * cu }}>Answering for Jumeirah Clinic</div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 * cu, minHeight: 70 * cu, alignItems: "flex-start" }}>
          {chip1 > 0.001 && (
            <div style={chipStyle(chip1)}>
              <span style={{ width: 38 * cu, height: 38 * cu, borderRadius: 10 * cu, background: C.money, display: "grid", placeItems: "center" }}><BoltIcon size={22 * cu} color="#fff" /></span>
              {response_chip}
            </div>
          )}
          {chip2 > 0.001 && (
            <div style={{ ...chipStyle(chip2), transform: `${chipStyle(chip2).transform} rotateX(${(1 - chip2Flip) * 90}deg)` }}>
              <span style={{ width: 38 * cu, height: 38 * cu, borderRadius: 10 * cu, background: C.money, display: "grid", placeItems: "center" }}><GlobeIcon size={24 * cu} color="#fff" /></span>
              <span style={{ fontFamily: MONO, fontWeight: 500 }}>
                {language_chip.split("→")[0]}→<span style={{ color: C.money, fontWeight: 500 }}>{language_chip.split("→")[1] ?? ""}</span>
              </span>
            </div>
          )}
          {chip1 > 0.5 && <Illustrative size={14} style={{ alignSelf: "center", opacity: chip1 }} />}
        </div>

        {/* clinic calendar — the same Thu 4:30 slot that stayed empty in beat 03 */}
        <div style={{ position: "relative", background: C.raised, border: `1px solid ${C.line}`, borderRadius: 20 * cu, padding: `${20 * cu}px ${22 * cu}px`, boxShadow: "0 22px 44px -26px rgba(31,36,48,0.32)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 * cu, height: 34 * cu, marginBottom: 16 * cu }}>
            <CalIcon size={26 * cu} color={C.ink2} />
            <span style={{ fontSize: 22 * cu, fontWeight: 700, color: C.ink2 }}>Clinic calendar · Thursday</span>
          </div>
          {["3:30 PM", "4:30 PM", "5:30 PM"].map((row, i) => {
            const slot = i === 1;
            return (
              <div key={row} style={{ display: "grid", gridTemplateColumns: `${118 * cu}px 1fr`, alignItems: "center", gap: 12 * cu, marginTop: i ? 12 * cu : 0, height: ROW_H }}>
                <span style={{ fontFamily: MONO, fontSize: 20 * cu, color: slot ? C.ink : C.ink3 }}>{row}</span>
                {slot ? (
                  <div style={{ position: "relative", height: ROW_H, borderRadius: 12 * cu, border: `${3 * cu}px ${filled > 0.5 ? "solid" : "dashed"} ${filled > 0.5 ? C.money : C.alert}`, background: filled > 0.5 ? C.money : C.alertWash, display: "flex", alignItems: "center", gap: 10 * cu, paddingLeft: 14 * cu, overflow: "hidden" }}>
                    {filled > 0.5 ? (
                      <>
                        <span style={{ width: 30 * cu, height: 30 * cu, borderRadius: 99, background: "#fff", display: "grid", placeItems: "center", transform: `scale(${filled})` }}><Check size={20 * cu} color={C.money} /></span>
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: 21 * cu, whiteSpace: "nowrap" }}>{patient} · {booking.doctor}</span>
                      </>
                    ) : (
                      <span style={{ color: C.alert, fontWeight: 800, fontSize: 21 * cu }}>Not booked</span>
                    )}
                  </div>
                ) : (
                  <div style={{ height: 46 * cu, borderRadius: 10 * cu, background: C.sunken, display: "flex", alignItems: "center", paddingLeft: 14 * cu, fontSize: 18 * cu, color: C.ink3 }}>{i === 0 ? "Booked · Ahmed K." : "Booked · Fatima S."}</div>
                )}
              </div>
            );
          })}

          {/* the booking card: slides out of the chat, then drops into the slot */}
          {cardOut > 0.001 && filled < 1 && (
            <div
              style={{
                position: "absolute", left: 22 * cu + 118 * cu + 12 * cu - 30 * cu, top: SLOT_TOP - 30 * cu, width: colW - 140 * cu + 30 * cu,
                transform: `translate(${travelX}px, ${cardY}px) scale(${cardScale})`, transformOrigin: "50% 50%", opacity: Math.min(1, cardOut * 2) * (filled > 0.5 ? 0 : 1),
                background: C.money, color: "#fff", borderRadius: 16 * cu, padding: `${14 * cu}px ${18 * cu}px`, boxShadow: "0 26px 40px -18px rgba(14,143,128,0.55)", zIndex: 2,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 * cu }}>
                <span style={{ width: 32 * cu, height: 32 * cu, borderRadius: 99, background: "#fff", display: "grid", placeItems: "center" }}><Check size={22 * cu} color={C.money} /></span>
                <span style={{ fontSize: 27 * cu, fontWeight: 800 }}>{booking.title}</span>
                <span style={{ marginLeft: "auto", fontSize: 18 * cu, opacity: 0.85 }}>{booking.doctor}</span>
              </div>
              <div style={{ fontSize: 19 * cu, marginTop: 6 * cu, opacity: 0.95, whiteSpace: "nowrap" }}>{booking.detail}</div>
            </div>
          )}
        </div>
      </div>

      {/* Mariam's phone */}
      <Phone k={k}>
        <ChatHeader
          k={k}
          avatar={avatar}
          name={clinic}
          sub={typing ? "typing…" : "Answered by HeyAnaya · 24/7"}
        />
        <ChatBody k={k}>
          <div style={{ alignSelf: "center", marginBottom: "auto", opacity: 1 - ramp(t, tTap, 0.3), background: "#fff", color: "#667781", fontSize: 15 * s, fontWeight: 600, borderRadius: 8 * s, padding: `${5 * s}px ${12 * s}px`, boxShadow: "0 1px 1px rgba(0,0,0,0.06)" }}>TODAY</div>
          <Bubble k={k} out p={sent} time="9:48 PM" ticks={reply > 0 ? "blue" : "grey"} rtl>
            <span style={{ fontFamily: AR_FONT, fontSize: 21 * s }}>{incoming_ar}</span>
            <div dir="ltr" style={{ fontFamily: SANS, fontSize: 15 * s, color: "#667781", textAlign: "left" }}>{incoming_en}</div>
          </Bubble>
          {typing && <Typing k={k} out={false} />}
          {reply > 0 && (
            <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", alignItems: "flex-start", transform: `scaleY(${flipScale})`, transformOrigin: "50% 100%" }}>
              <Bubble k={k} p={reply} time="9:48 PM" rtl={isAr} glow={replyGlow}>
                {isAr ? (
                  <>
                    <span style={{ fontFamily: AR_FONT, fontSize: 21 * s }}><Marked text={reply_ar} marks={highlights_ar} p={craft} color={C.money} wash={C.moneyWash} /></span>
                    <div dir="ltr" style={{ fontFamily: SANS, fontSize: 15 * s, color: "#667781", textAlign: "left", marginTop: 4 * s, lineHeight: 1.3 }}>
                      <Marked text={reply_en} marks={highlights_en} p={craft} color={C.money} wash={C.moneyWash} />
                    </div>
                  </>
                ) : (
                  reply_en
                )}
              </Bubble>
              {buttons > 0.001 && (
                <div style={{ width: "84%", display: "grid", gap: 6 * s, marginTop: 6 * s, opacity: buttons, transform: `translateY(${(1 - buttons) * 10 * s}px)` }}>
                  {quick_replies.map((q, i) => {
                    const on = i === 0 && press > 0.5;
                    return (
                      <div key={q} style={{ background: on ? C.money : "#fff", color: on ? "#fff" : C.money, borderRadius: 12 * s, padding: `${11 * s}px 0`, textAlign: "center", fontWeight: 700, fontSize: 20 * s, boxShadow: "0 1px 1px rgba(0,0,0,0.1)", transform: `scale(${i === 0 ? 1 - 0.05 * pressDip : 1})` }}>
                        {q}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          <Bubble k={k} out p={answer} time="9:49 PM" ticks="blue">
            {quick_replies[0]}
          </Bubble>
        </ChatBody>
      </Phone>
    </div>
  );
};
