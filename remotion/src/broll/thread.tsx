import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/IBMPlexSansArabic";
import type { TemplateProps } from "../types";
import { Ground } from "./vertical";

const { fontFamily } = loadFont();

/**
 * The messaging system — the spine of this film's b-roll.
 *
 * One enquiry is followed the whole way through: it arrives unread at 9:04 PM, a competitor
 * answers it, it gets reduced to a row in a spend report, it is still unread at 7am, and then
 * Anaya answers it at 9:04 PM and books it. Every card below is one state of that same thread.
 *
 * Because the UI stays in the same screen position across those states, the cuts between them
 * are match cuts — the timestamp column never moves, so the eye tracks one thing while its
 * state changes underneath.
 *
 * Colour carries the argument: amber = unanswered/elapsed, teal = answered/converted,
 * slate = someone else's clinic.
 */

const INK = "#0B1622";
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const ramp = (frame: number, from: number, len: number) =>
  interpolate(frame, [from, from + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

const useSp = (delay: number, damping = 24, stiffness = 210) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness } });
};

/* ------------------------------------------------------------------- chrome */

/** App header. Deliberately generic — recognisable as a messaging app, not a trademark. */
const Header: React.FC<TemplateProps<{ title?: string; blurTitle?: boolean; sub?: string; tone?: string }>> = ({
  theme, title, blurTitle = true, sub, tone,
}) => {
  const a = ramp(useCurrentFrame(), 0, 10);
  return (
    <div
      style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 168, opacity: a, zIndex: 3,
        display: "flex", alignItems: "flex-end", gap: 20, padding: "0 46px 22px",
        background: "linear-gradient(180deg, rgba(6,13,20,0.96) 60%, rgba(6,13,20,0))",
      }}
    >
      <div style={{ width: 64, height: 64, borderRadius: 64, background: "rgba(124,139,153,0.26)", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {blurTitle ? (
          <div style={{ height: 19, width: 190, borderRadius: 10, background: "rgba(242,246,248,0.34)" }} />
        ) : (
          <div style={{ fontSize: 34, fontWeight: 600, color: "#F2F6F8" }}>{title}</div>
        )}
        {sub ? <div style={{ fontSize: 25, color: tone ?? theme.colors.muted, marginTop: 9 }}>{sub}</div> : null}
      </div>
    </div>
  );
};

const Screen: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ fontFamily, color: "#F2F6F8" }}>
    <Ground drift={false} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${INK}F2 0%, ${INK}D9 40%, ${INK}FA 100%)` }} />
    {children}
  </AbsoluteFill>
);

/* ------------------------------------------------- 1. the inbox, after eight */

type Row = { time: string; width: number; answered?: boolean };

export const ChatList: React.FC<TemplateProps<{
  rows: Row[]; scroll?: [number, number]; scrollFrames?: number; focus?: number; focusFrom?: number; sub?: string;
}>> = ({ theme, rows, scroll = [0, 0], scrollFrames = 60, focus = -1, focusFrom = 0, sub }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, scrollFrames], scroll, { extrapolateRight: "clamp", easing: ease });
  // When a focus row is set, everything else recedes — the list stops being a list and becomes a person.
  const isolate = focus >= 0 ? ramp(frame, focusFrom, 22) : 0;
  return (
    <Screen>
      <Header theme={theme} sub={sub} tone={theme.colors.accent} />
      <div style={{ position: "absolute", top: 176, left: 0, right: 0, zIndex: 1, transform: `translateY(${y}px)` }}>
        {rows.map((r, i) => {
          const focused = i === focus;
          const dim = focused ? 1 : 1 - isolate * 0.78;
          const lift = focused ? isolate * 1.0 : 0;
          const c = r.answered ? theme.colors.primary : theme.colors.accent;
          return (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 24, padding: "30px 46px",
                borderBottom: "1px solid rgba(124,139,153,0.14)",
                opacity: dim * ramp(frame, i * 3, 14),
                background: focused ? `rgba(245,165,36,${isolate * 0.07})` : "transparent",
                transform: `scale(${1 + lift * 0.02})`,
                filter: focused ? "none" : `blur(${isolate * 2.4}px)`,
              }}
            >
              <div style={{ width: 66, height: 66, borderRadius: 66, background: "rgba(124,139,153,0.24)", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ height: 18, width: `${r.width}%`, borderRadius: 9, background: "rgba(242,246,248,0.32)" }} />
                <div style={{ height: 14, width: `${r.width * 0.62}%`, borderRadius: 7, background: "rgba(124,139,153,0.22)", marginTop: 14 }} />
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 28, fontWeight: 500, color: c, fontVariantNumeric: "tabular-nums" }}>{r.time}</div>
                <div style={{ width: 16, height: 16, borderRadius: 16, background: c, marginLeft: "auto", marginTop: 12 }} />
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
};

/* ------------------------------------------------ 2. the thread, in its states */

type Msg = {
  side: "in" | "out" | "other";
  text: string;
  time: string;
  ticks?: boolean;
  delay?: number;
  rtl?: boolean;
};

/** One message. Its own component so the springs are top-level hooks, not hooks in a loop. */
const Bubble: React.FC<TemplateProps<{ m: Msg; delay: number }>> = ({ theme, m, delay }) => {
  const s = useSp(delay);
  const t = useSp(delay + 10, 14, 250);
  const right = m.side === "out";
  const skin =
    m.side === "out"
      ? { background: theme.colors.primary, color: INK, fontWeight: 500 as const }
      : m.side === "other"
      ? { background: "rgba(124,139,153,0.26)", color: "#C6D0D8", fontWeight: 400 as const }
      : { background: "rgba(242,246,248,0.10)", color: "#F2F6F8", fontWeight: 400 as const };
  return (
    <div style={{ alignSelf: right ? "flex-end" : "flex-start", maxWidth: "82%", opacity: s, transform: `translateY(${(1 - s) * 26}px)` }}>
      <div
        style={{
          ...skin, padding: "26px 32px", fontSize: 37, lineHeight: 1.33, borderRadius: 26,
          borderTopRightRadius: right ? 8 : 26, borderTopLeftRadius: right ? 26 : 8,
          direction: m.rtl ? "rtl" : "ltr", textAlign: m.rtl ? "right" : "left",
          boxShadow: right ? `0 18px 48px ${theme.colors.primary}33` : "none",
        }}
      >
        {m.text}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: right ? "flex-end" : "flex-start", gap: 10, marginTop: 11 }}>
        <span style={{ fontSize: 25, color: right ? theme.colors.primary : theme.colors.accent, fontVariantNumeric: "tabular-nums" }}>{m.time}</span>
        {m.ticks ? (
          <svg width={30} height={19} viewBox="0 0 30 19" style={{ transform: `scale(${t})` }}>
            <path d="M2 10.5 L8 16.5 L18 3" fill="none" stroke={theme.colors.primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 10.5 L18 16.5 L28 3" fill="none" stroke={theme.colors.primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </div>
    </div>
  );
};

export const ChatThread: React.FC<TemplateProps<{
  messages: Msg[]; sub?: string; subTone?: "amber" | "teal" | "slate"; typingBefore?: number; stamp?: string;
}>> = ({ theme, messages, sub, subTone = "amber", typingBefore = -1, stamp }) => {
  const frame = useCurrentFrame();
  const toneC = subTone === "teal" ? theme.colors.primary : subTone === "slate" ? theme.colors.muted : theme.colors.accent;
  return (
    <Screen>
      <Header theme={theme} sub={sub} tone={toneC} />
      {stamp ? (
        <div
          style={{
            position: "absolute", top: 196, left: 0, right: 0, textAlign: "center", zIndex: 2,
            fontSize: 26, color: theme.colors.muted, opacity: ramp(frame, 0, 12),
          }}
        >
          {stamp}
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 46, right: 46, bottom: 150, display: "flex", flexDirection: "column", gap: 22 }}>
        {messages.map((m, i) => (
          <Bubble key={i} theme={theme} m={m} delay={m.delay ?? i * 12} />
        ))}
        {typingBefore >= 0 ? (
          <div style={{ alignSelf: "flex-end", opacity: interpolate(frame, [typingBefore, typingBefore + 4, typingBefore + 16, typingBefore + 20], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ display: "flex", gap: 10, padding: "26px 32px", borderRadius: 26, background: `${theme.colors.primary}26` }}>
              {[0, 1, 2].map((k) => (
                <span
                  key={k}
                  style={{
                    width: 13, height: 13, borderRadius: 13, background: theme.colors.primary,
                    opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame - k * 3) / 5)),
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Screen>
  );
};

/* ----------------------------------------------- 3. she becomes a line item */

export const AdsRow: React.FC<TemplateProps<{
  title: string; columns: string[]; rows: { cells: string[]; highlight?: boolean }[]; note?: string;
}>> = ({ theme, title, columns, rows, note }) => {
  const frame = useCurrentFrame();
  const sweep = ramp(frame, 16, 26);
  return (
    <Screen>
      <div style={{ position: "absolute", top: 300, left: 46, right: 46 }}>
        <div style={{ fontSize: 30, color: theme.colors.muted, opacity: ramp(frame, 0, 10) }}>{title}</div>
        <div style={{ display: "flex", gap: 18, marginTop: 40, paddingBottom: 18, borderBottom: "1px solid rgba(124,139,153,0.24)" }}>
          {columns.map((c, i) => (
            <div key={i} style={{ flex: i === 0 ? 2 : 1, fontSize: 24, color: theme.colors.muted, textAlign: i === 0 ? "left" : "right", opacity: ramp(frame, 4 + i * 2, 10) }}>
              {c}
            </div>
          ))}
        </div>
        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex", gap: 18, alignItems: "center", padding: "26px 0",
              borderBottom: "1px solid rgba(124,139,153,0.12)",
              opacity: ramp(frame, 8 + i * 5, 14),
              background: r.highlight ? `linear-gradient(90deg, ${theme.colors.accent}1F ${sweep * 100}%, transparent ${sweep * 100}%)` : "transparent",
            }}
          >
            {r.cells.map((c, j) => (
              <div
                key={j}
                style={{
                  flex: j === 0 ? 2 : 1, textAlign: j === 0 ? "left" : "right",
                  fontSize: j === 0 ? 30 : 34, fontWeight: j === 0 ? 400 : 600,
                  color: r.highlight && j === 0 ? theme.colors.accent : "#F2F6F8",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {c}
              </div>
            ))}
          </div>
        ))}
        {note ? (
          <div style={{ marginTop: 44, fontSize: 32, color: theme.colors.accent, opacity: ramp(frame, 40, 16) }}>{note}</div>
        ) : null}
      </div>
    </Screen>
  );
};

/* ------------------------------------------------------- 4. the slot filling */

export const CalendarSlot: React.FC<TemplateProps<{ day: string; slots: string[]; fillIndex: number; label: string }>> = ({
  theme, day, slots, fillIndex, label,
}) => {
  const frame = useCurrentFrame();
  const fill = useSp(18, 20, 190);
  return (
    <Screen>
      <div style={{ position: "absolute", top: 210, left: 46, right: 46 }}>
        <div style={{ fontSize: 32, color: theme.colors.muted, opacity: ramp(frame, 0, 10) }}>{day}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 34 }}>
          {slots.map((s, i) => {
            const on = i === fillIndex;
            return (
              <div
                key={i}
                style={{
                  padding: "28px 32px", borderRadius: 18,
                  border: `1px solid ${on ? theme.colors.primary : "rgba(124,139,153,0.22)"}`,
                  background: on ? `rgba(20,160,168,${0.14 * fill})` : "transparent",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  opacity: ramp(frame, i * 4, 12),
                  boxShadow: on ? `0 0 ${34 * fill}px ${theme.colors.primary}44` : "none",
                }}
              >
                <span style={{ fontSize: 38, fontWeight: on ? 600 : 400, color: on ? theme.colors.primary : theme.colors.muted, fontVariantNumeric: "tabular-nums" }}>{s}</span>
                {on ? (
                  <span style={{ fontSize: 28, color: theme.colors.primary, opacity: fill, transform: `translateX(${(1 - fill) * 18}px)` }}>{label}</span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
};
