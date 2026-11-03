import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/IBMPlexSansArabic";
import type { TemplateProps } from "../types";

const { fontFamily } = loadFont();

/**
 * WhatsApp Business UI, dark mode, built to look like the real thing.
 *
 * Palette is WhatsApp's own, not the brand's — a mockup that uses our teal and navy reads as
 * a graphic, and the whole point of this b-roll is that the viewer recognises their own inbox.
 * Brand colour stays out of the phone and lives in the cards around it.
 *
 * PERSPECTIVE: every screen is the CLINIC'S account. Patients are incoming (left), the clinic
 * and Anaya are outgoing (right). Nothing in this film shows another clinic's inbox.
 */

export const WA = {
  bg: "#0B141A",
  panel: "#202C33",
  bubbleIn: "#202C33",
  bubbleOut: "#005C4B",
  text: "#E9EDEF",
  sub: "#8696A0",
  green: "#00A884",
  tick: "#53BDEB",
  divider: "#222D34",
} as const;

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const ramp = (frame: number, from: number, len: number) =>
  interpolate(frame, [from, from + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

/** Avatar colours pulled from WhatsApp's own default set. */
const AV = ["#6B7C85", "#4A6B7C", "#7C6B5A", "#5A7C6B", "#7C5A6B", "#6B5A7C"];

/** Phone status bar. Cheap, and it is most of what makes a mockup read as a screen. */
const StatusBar: React.FC<{ clock: string }> = ({ clock }) => (
  <div
    style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 64, zIndex: 5,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 38px", background: WA.bg, color: WA.text, fontSize: 25, fontWeight: 600,
    }}
  >
    <span style={{ fontVariantNumeric: "tabular-nums" }}>{clock}</span>
    <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {[10, 14, 18, 22].map((h, i) => (
        <span key={i} style={{ width: 5, height: h, borderRadius: 2, background: i < 3 ? WA.text : WA.sub, display: "inline-block" }} />
      ))}
      <span style={{ marginLeft: 6, width: 30, height: 15, borderRadius: 4, border: `2px solid ${WA.text}`, display: "inline-block", position: "relative" }}>
        <span style={{ position: "absolute", inset: 2, right: 9, background: WA.text, borderRadius: 1 }} />
      </span>
    </span>
  </div>
);

export type WARow = {
  name: string;
  preview: string;
  time: string;
  unread?: number;
  avatar?: number;
};

/**
 * CARD 1 — the clinic's chat list after hours.
 * Rows carry real names and real preview text; unread counts sit in WhatsApp's green.
 */
export const WAInbox: React.FC<TemplateProps<{
  rows: WARow[];
  account: string;
  clock: string;
  scroll?: [number, number];
  scrollFrames?: number;
  focus?: number;
  focusFrom?: number;
}>> = ({ rows, account, clock, scroll = [0, 0], scrollFrames = 70, focus = -1, focusFrom = 0 }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, scrollFrames], scroll, { extrapolateRight: "clamp", easing: ease });
  const isolate = focus >= 0 ? ramp(frame, focusFrom, 20) : 0;

  return (
    <AbsoluteFill style={{ background: WA.bg, fontFamily, color: WA.text }}>
      <StatusBar clock={clock} />

      {/* app bar */}
      <div
        style={{
          position: "absolute", top: 64, left: 0, right: 0, height: 108, zIndex: 4,
          background: WA.bg, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 38px",
        }}
      >
        <span style={{ fontSize: 40, fontWeight: 600 }}>{account}</span>
        <span style={{ display: "flex", gap: 26, alignItems: "center", color: WA.sub }}>
          <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={WA.sub} strokeWidth={2}>
            <circle cx={11} cy={11} r={7} /><path d="M16.5 16.5 L21 21" strokeLinecap="round" />
          </svg>
          <span style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[0, 1, 2].map((i) => <span key={i} style={{ width: 5, height: 5, borderRadius: 5, background: WA.sub }} />)}
          </span>
        </span>
      </div>

      {/* list */}
      <div style={{ position: "absolute", top: 172, left: 0, right: 0, zIndex: 1, transform: `translateY(${y}px)` }}>
        {rows.map((r, i) => {
          const focused = i === focus;
          const dim = focused ? 1 : 1 - isolate * 0.72;
          return (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 24, padding: "22px 38px",
                opacity: dim * ramp(frame, i * 3, 12),
                filter: focused ? "none" : `blur(${isolate * 2.2}px)`,
                background: focused ? "rgba(255,255,255,0.04)" : "transparent",
              }}
            >
              <div
                style={{
                  width: 84, height: 84, borderRadius: 84, flexShrink: 0,
                  background: AV[(r.avatar ?? i) % AV.length],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 38, fontWeight: 500, color: "#0B141A",
                }}
              >
                {r.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0, borderBottom: `1px solid ${WA.divider}`, paddingBottom: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
                  <span style={{ fontSize: 35, fontWeight: 400, color: WA.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {r.name}
                  </span>
                  <span style={{ fontSize: 25, color: r.unread ? WA.green : WA.sub, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
                    {r.time}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginTop: 12 }}>
                  <span style={{ fontSize: 29, color: WA.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {r.preview}
                  </span>
                  {r.unread ? (
                    <span
                      style={{
                        minWidth: 38, height: 38, borderRadius: 38, background: WA.green, color: "#0B141A",
                        fontSize: 24, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "0 12px", flexShrink: 0,
                      }}
                    >
                      {r.unread}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------------- the thread */

export type WAMsg = {
  /** "in" = the patient (left). "out" = the clinic / Anaya (right). */
  side: "in" | "out";
  text: string;
  time: string;
  ticks?: "sent" | "read";
  delay?: number;
  rtl?: boolean;
};

const Ticks: React.FC<{ kind: "sent" | "read"; scale: number }> = ({ kind, scale }) => (
  <svg width={26} height={16} viewBox="0 0 30 19" style={{ transform: `scale(${scale})`, flexShrink: 0 }}>
    <path d="M2 10.5 L8 16.5 L18 3" fill="none" stroke={kind === "read" ? WA.tick : WA.sub} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 10.5 L18 16.5 L28 3" fill="none" stroke={kind === "read" ? WA.tick : WA.sub} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WABubble: React.FC<{ m: WAMsg }> = ({ m }) => {
  const frame = useCurrentFrame();
  const d = m.delay ?? 0;
  const a = ramp(frame, d, 9);
  const right = m.side === "out";
  return (
    <div
      style={{
        alignSelf: right ? "flex-end" : "flex-start", maxWidth: "78%",
        opacity: a, transform: `translateY(${(1 - a) * 16}px)`,
      }}
    >
      <div
        style={{
          background: right ? WA.bubbleOut : WA.bubbleIn, color: WA.text,
          padding: "20px 24px 14px", borderRadius: 16,
          borderTopRightRadius: right ? 4 : 16, borderTopLeftRadius: right ? 16 : 4,
          fontSize: 34, lineHeight: 1.32, boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
          direction: m.rtl ? "rtl" : "ltr", textAlign: m.rtl ? "right" : "left",
        }}
      >
        {m.text}
        <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: 8, direction: "ltr" }}>
          <span style={{ fontSize: 22, color: WA.sub, fontVariantNumeric: "tabular-nums" }}>{m.time}</span>
          {right && m.ticks ? <Ticks kind={m.ticks} scale={ramp(frame, d + 6, 8)} /> : null}
        </span>
      </div>
    </div>
  );
};

/** Chat screen. Always the clinic's account: patient left, clinic/Anaya right. */
export const WAThread: React.FC<TemplateProps<{
  contact: string;
  presence?: string;
  clock: string;
  dateChip?: string;
  messages: WAMsg[];
  typingAt?: number;
  avatar?: number;
}>> = ({ contact, presence, clock, dateChip, messages, typingAt = -1, avatar = 2 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: WA.bg, fontFamily, color: WA.text }}>
      <StatusBar clock={clock} />

      {/* conversation header */}
      <div
        style={{
          position: "absolute", top: 64, left: 0, right: 0, height: 116, zIndex: 4,
          background: WA.panel, display: "flex", alignItems: "center", gap: 20, padding: "0 30px",
        }}
      >
        <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={WA.text} strokeWidth={2.2}>
          <path d="M15 5 L8 12 L15 19" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ width: 72, height: 72, borderRadius: 72, background: AV[avatar % AV.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#0B141A" }}>
          {contact.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 34, fontWeight: 500 }}>{contact}</div>
          {presence ? <div style={{ fontSize: 24, color: WA.sub, marginTop: 4 }}>{presence}</div> : null}
        </div>
      </div>

      {/* messages, bottom-anchored like a real thread */}
      <div style={{ position: "absolute", left: 30, right: 30, bottom: 130, display: "flex", flexDirection: "column", gap: 14, zIndex: 1 }}>
        {dateChip ? (
          <div style={{ alignSelf: "center", marginBottom: 14, opacity: ramp(frame, 0, 10) }}>
            <span style={{ background: WA.panel, color: WA.sub, fontSize: 22, padding: "10px 20px", borderRadius: 10 }}>{dateChip}</span>
          </div>
        ) : null}
        {messages.map((m, i) => <WABubble key={i} m={m} />)}
        {typingAt >= 0 ? (
          <div
            style={{
              alignSelf: "flex-end",
              opacity: interpolate(frame, [typingAt, typingAt + 3, typingAt + 14, typingAt + 18], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            <div style={{ display: "flex", gap: 9, padding: "24px 26px", borderRadius: 16, background: WA.bubbleOut }}>
              {[0, 1, 2].map((k) => (
                <span key={k} style={{ width: 12, height: 12, borderRadius: 12, background: WA.sub, opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame - k * 3) / 5)) }} />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* input bar — present but inert; a chat screen without one looks wrong */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 108, background: WA.bg, display: "flex", alignItems: "center", gap: 16, padding: "0 30px", zIndex: 3 }}>
        <div style={{ flex: 1, height: 68, borderRadius: 34, background: WA.panel, display: "flex", alignItems: "center", padding: "0 26px", color: WA.sub, fontSize: 28 }}>
          Message
        </div>
        <div style={{ width: 68, height: 68, borderRadius: 68, background: WA.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={30} height={30} viewBox="0 0 24 24" fill="#0B141A"><path d="M3 20 L21 12 L3 4 L3 10 L15 12 L3 14 Z" /></svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------- the clinic calendar */

const CAL = { bg: "#12171C", panel: "#1B2228", line: "#2A333B", text: "#E9EDEF", sub: "#8696A0", booked: "#00A884" };

/** A booking screen — a different app from WhatsApp, so it reads as a second surface. */
export const WACalendar: React.FC<TemplateProps<{
  day: string; date: string; clock: string; slots: { time: string; taken?: string }[]; bookIndex: number; bookedLabel: string;
}>> = ({ day, date, clock, slots, bookIndex, bookedLabel }) => {
  const frame = useCurrentFrame();
  const fill = ramp(frame, 14, 16);
  return (
    <AbsoluteFill style={{ background: CAL.bg, fontFamily, color: CAL.text }}>
      <StatusBar clock={clock} />
      <div style={{ position: "absolute", top: 64, bottom: 0, left: 38, right: 38, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 26, color: CAL.sub, opacity: ramp(frame, 0, 8) }}>{date}</div>
        <div style={{ fontSize: 46, fontWeight: 600, marginTop: 8, opacity: ramp(frame, 2, 8) }}>{day}</div>
        <div style={{ marginTop: 44, display: "flex", flexDirection: "column" }}>
          {slots.map((s, i) => {
            const on = i === bookIndex;
            return (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 26, padding: "26px 0",
                  borderTop: `1px solid ${CAL.line}`, opacity: ramp(frame, 4 + i * 3, 10),
                }}
              >
                <span style={{ width: 150, fontSize: 30, color: CAL.sub, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{s.time}</span>
                <div
                  style={{
                    flex: 1, height: 84, borderRadius: 12, display: "flex", alignItems: "center", padding: "0 26px",
                    background: on ? `rgba(0,168,132,${0.16 * fill})` : s.taken ? CAL.panel : "transparent",
                    border: on ? `1px solid rgba(0,168,132,${fill})` : `1px solid ${s.taken ? "transparent" : CAL.line}`,
                    transform: on ? `scaleX(${0.985 + fill * 0.015})` : "none",
                  }}
                >
                  {on ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 14, opacity: fill }}>
                      <span style={{ width: 10, height: 10, borderRadius: 10, background: CAL.booked }} />
                      <span style={{ fontSize: 30, fontWeight: 500, color: CAL.booked }}>{bookedLabel}</span>
                    </span>
                  ) : (
                    <span style={{ fontSize: 28, color: CAL.sub }}>{s.taken ?? ""}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ ads manager */

const META = { bg: "#18191A", panel: "#242526", line: "#3A3B3C", text: "#E4E6EB", sub: "#B0B3B8", blue: "#1877F2" };

/** Ads Manager. Meta's own greys and blue — another platform, plainly not our brand. */
export const MetaAds: React.FC<TemplateProps<{
  clock: string; account: string; columns: string[]; rows: { cells: string[]; highlight?: boolean }[]; footnote?: string;
}>> = ({ clock, account, columns, rows, footnote }) => {
  const frame = useCurrentFrame();
  const sweep = ramp(frame, 14, 22);
  return (
    <AbsoluteFill style={{ background: META.bg, fontFamily, color: META.text }}>
      <StatusBar clock={clock} />
      <div style={{ position: "absolute", top: 76, left: 0, right: 0, height: 96, background: META.panel, display: "flex", alignItems: "center", gap: 18, padding: "0 34px" }}>
        <span style={{ width: 46, height: 46, borderRadius: 46, background: META.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "#fff" }}>f</span>
        <span style={{ fontSize: 30, fontWeight: 600 }}>Ads Manager</span>
        <span style={{ marginLeft: "auto", fontSize: 24, color: META.sub }}>{account}</span>
      </div>
      <div style={{ position: "absolute", top: 172, bottom: 0, left: 34, right: 34, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 16, paddingBottom: 16, borderBottom: `1px solid ${META.line}` }}>
          {columns.map((c, i) => (
            <div key={i} style={{ flex: i === 0 ? 2.2 : 1, fontSize: 22, color: META.sub, textAlign: i === 0 ? "left" : "right", opacity: ramp(frame, i * 2, 8) }}>{c}</div>
          ))}
        </div>
        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex", gap: 16, alignItems: "center", padding: "24px 12px", margin: "0 -12px",
              borderBottom: `1px solid ${META.line}`, opacity: ramp(frame, 6 + i * 4, 12),
              background: r.highlight ? `linear-gradient(90deg, rgba(24,119,242,0.16) ${sweep * 100}%, transparent ${sweep * 100}%)` : "transparent",
            }}
          >
            {r.cells.map((c, j) => (
              <div key={j} style={{ flex: j === 0 ? 2.2 : 1, textAlign: j === 0 ? "left" : "right", fontSize: j === 0 ? 27 : 31, fontWeight: j === 0 ? 400 : 600, color: META.text, fontVariantNumeric: "tabular-nums" }}>{c}</div>
            ))}
          </div>
        ))}
        {footnote ? <div style={{ marginTop: 40, fontSize: 27, color: META.sub, opacity: ramp(frame, 34, 14) }}>{footnote}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
