import React from "react";
import {
  AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/IBMPlexSansArabic";
import type { TemplateProps } from "../types";

const { fontFamily } = loadFont();

/**
 * Vertical (9:16) b-roll system for anaya-after-eight.
 *
 * One idea runs through all of it: TIME IS THE SYSTEM. Every card is anchored to a clock,
 * and nothing simply fades in — things arrive by counting. Amber counts up (elapsed, unanswered,
 * wasted). Teal fills or resolves (answered, converted). The palette is the vision board's.
 *
 * Designed at 720x1280. Nothing uses a fixed pixel column width, so the layout holds at any
 * vertical size — the landscape templates in cards.tsx/data.tsx do not.
 */

const INK = "#0B1622";
const PLATE = "projects/anaya-after-eight/plates/clinic-defocused.jpg";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** Frames -> 0..1 with a slow-out curve, clamped. */
const ramp = (frame: number, from: number, len: number) =>
  interpolate(frame, [from, from + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

const useSpring = (delay = 0, damping = 26, stiffness = 220) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness } });
};

/* ------------------------------------------------------------------ ground */

/** The same room under every card — blurred plate, scrim, vignette. */
export const Ground: React.FC<{ drift?: boolean }> = ({ drift = true }) => {
  const frame = useCurrentFrame();
  const scale = drift ? 1.06 + frame * 0.00012 : 1.06;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img
        src={staticFile(PLATE)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`, opacity: 0.85 }}
      />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${INK}E6 0%, ${INK}B8 38%, ${INK}F2 100%)` }} />
      <AbsoluteFill
        style={{ background: "radial-gradient(120% 70% at 50% 42%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)" }}
      />
    </AbsoluteFill>
  );
};

const Frame: React.FC<{ children: React.ReactNode; align?: "flex-start" | "center" }> = ({
  children, align = "flex-start",
}) => (
  <AbsoluteFill style={{ fontFamily, color: "#F2F6F8" }}>
    <Ground />
    <AbsoluteFill
      style={{
        padding: "150px 58px 300px",
        justifyContent: "center",
        alignItems: align,
        textAlign: align === "center" ? "center" : "left",
      }}
    >
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

/** The time signature. Small, fixed, always top-left — the spine of the system. */
const Clock: React.FC<TemplateProps<{ time: string; note?: string; tone?: string }>> = ({
  theme, time, note, tone,
}) => {
  const a = ramp(useCurrentFrame(), 0, 14);
  const c = tone ?? theme.colors.accent;
  return (
    <div style={{ position: "absolute", top: 74, left: 58, right: 58, opacity: a, display: "flex", alignItems: "baseline", gap: 16 }}>
      <span style={{ width: 9, height: 9, borderRadius: 9, background: c, transform: `scale(${a})` }} />
      <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: "0.01em", color: c, fontVariantNumeric: "tabular-nums" }}>
        {time}
      </span>
      {note ? <span style={{ fontSize: 28, fontWeight: 400, color: theme.colors.muted }}>{note}</span> : null}
    </div>
  );
};

/** Counting numeral. The core motion verb of the whole system. */
const Roll: React.FC<{ to: number; delay?: number; len?: number; size: number; color: string; prefix?: string; suffix?: string }> = ({
  to, delay = 0, len = 34, size, color, prefix = "", suffix = "",
}) => {
  const v = Math.round(to * ramp(useCurrentFrame(), delay, len));
  return (
    <span style={{ fontSize: size, fontWeight: 600, lineHeight: 0.92, color, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>
      {prefix}{v}{suffix}
    </span>
  );
};

/* ------------------------------------------------------- 1. the unread inbox */

export const ChatInbox: React.FC<TemplateProps<{ rows: { time: string; width: number }[]; cutoff: string }>> = ({
  theme, rows, cutoff,
}) => {
  const frame = useCurrentFrame();
  const scroll = interpolate(frame, [0, 130], [0, -168], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) });
  return (
    <Frame>
      <Clock theme={theme} time={cutoff} note="the desk closed" />
      <div style={{ width: "100%", transform: `translateY(${scroll}px)` }}>
        {rows.map((r, i) => {
          const enter = ramp(frame, 6 + i * 5, 20);
          const pulse = 0.55 + 0.45 * Math.sin((frame - i * 7) / 7);
          return (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 22, padding: "26px 4px",
                borderBottom: "1px solid rgba(124,139,153,0.16)",
                opacity: enter, transform: `translateX(${(1 - enter) * 26}px)`,
              }}
            >
              <div style={{ width: 62, height: 62, borderRadius: 62, background: "rgba(124,139,153,0.22)", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ height: 17, width: `${r.width}%`, borderRadius: 9, background: "rgba(242,246,248,0.34)" }} />
                <div style={{ height: 13, width: `${r.width * 0.64}%`, borderRadius: 7, background: "rgba(124,139,153,0.24)", marginTop: 13 }} />
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 27, fontWeight: 500, color: theme.colors.accent, fontVariantNumeric: "tabular-nums" }}>{r.time}</div>
                <div
                  style={{
                    width: 15, height: 15, borderRadius: 15, background: theme.colors.accent,
                    marginLeft: "auto", marginTop: 11, opacity: pulse,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};

/* ---------------------------------------------------- 2. the count that hurts */

export const CountUp: React.FC<TemplateProps<{ to: number; unit: string; caption: string }>> = ({
  theme, to, unit, caption,
}) => {
  const frame = useCurrentFrame();
  const line = ramp(frame, 26, 30);
  return (
    <Frame align="center">
      <Clock theme={theme} time="last night" />
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 20 }}>
        <Roll to={to} size={286} color={theme.colors.accent} len={40} />
        <span style={{ fontSize: 58, fontWeight: 300, color: theme.colors.muted }}>{unit}</span>
      </div>
      <div style={{ height: 3, width: `${line * 76}%`, background: theme.colors.accent, marginTop: 34, opacity: 0.9 }} />
      <div style={{ fontSize: 42, fontWeight: 400, color: "#F2F6F8", marginTop: 34, lineHeight: 1.32, maxWidth: "86%" }}>
        {caption}
      </div>
    </Frame>
  );
};

/* --------------------------------------------- 3. what the spend actually did */

export const SpendBars: React.FC<TemplateProps<{ title: string; bars: { label: string; value: number; tone?: "amber" | "teal" | "dead" }[] }>> = ({
  theme, title, bars,
}) => {
  const frame = useCurrentFrame();
  const max = Math.max(...bars.map((b) => b.value), 1);
  const tone = (t?: string) => (t === "teal" ? theme.colors.primary : t === "dead" ? "#42505E" : theme.colors.accent);
  return (
    <Frame>
      <Clock theme={theme} time={title} tone={theme.colors.muted} />
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 56 }}>
        {bars.map((b, i) => {
          const d = 10 + i * 13;
          const grow = ramp(frame, d, 30);
          const dead = b.value === 0;
          return (
            <div key={i}>
              {/* label ABOVE the track — the reason this survives a 720px frame */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <span style={{ fontSize: 34, fontWeight: 400, color: theme.colors.muted }}>{b.label}</span>
                {dead ? (
                  <span style={{ fontSize: 48, fontWeight: 600, color: tone(b.tone), opacity: ramp(frame, d + 16, 14) }}>0</span>
                ) : (
                  <Roll to={b.value} delay={d} len={30} size={48} color={tone(b.tone)} />
                )}
              </div>
              <div style={{ height: 22, width: "100%", borderRadius: 11, background: "rgba(124,139,153,0.14)", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%", width: `${(b.value / max) * 100 * grow}%`,
                    background: tone(b.tone), borderRadius: 11,
                    boxShadow: dead ? "none" : `0 0 26px ${tone(b.tone)}55`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};

/* ------------------------------------------------- 4. the overnight turnaround */

export const OvernightReport: React.FC<TemplateProps<{ handled: number; booked: number; window: string }>> = ({
  theme, handled, booked, window: win,
}) => {
  const frame = useCurrentFrame();
  const arc = ramp(frame, 8, 44);
  const R = 150, C = 2 * Math.PI * R;
  return (
    <Frame align="center">
      <Clock theme={theme} time={win} tone={theme.colors.primary} />
      <div style={{ position: "relative", width: 340, height: 340, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={340} height={340} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
          <circle cx={170} cy={170} r={R} fill="none" stroke="rgba(124,139,153,0.18)" strokeWidth={10} />
          <circle
            cx={170} cy={170} r={R} fill="none" stroke={theme.colors.primary} strokeWidth={10} strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - arc)}
            style={{ filter: `drop-shadow(0 0 16px ${theme.colors.primary}88)` }}
          />
        </svg>
        <Roll to={handled} size={176} color="#F2F6F8" len={44} delay={8} />
      </div>
      <span style={{ fontSize: 34, fontWeight: 400, color: theme.colors.muted, marginTop: 26 }}>enquiries handled</span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 44, opacity: ramp(frame, 44, 18) }}>
        <Roll to={booked} size={104} color={theme.colors.primary} len={26} delay={44} />
        <span style={{ fontSize: 40, fontWeight: 400, color: "#F2F6F8" }}>booked before you woke up</span>
      </div>
    </Frame>
  );
};

/* ------------------------------------------------------- 5. the reply landing */

export const ReplyThread: React.FC<TemplateProps<{ incoming: string; outgoing: string; sentLabel: string; time: string; responseTime: string }>> = ({
  theme, incoming, outgoing, sentLabel, time, responseTime,
}) => {
  const frame = useCurrentFrame();
  const inS = useSpring(2);
  const outS = useSpring(13);
  const tick = useSpring(27, 15, 260);
  const chip = useSpring(36, 14, 240);
  const bubble: React.CSSProperties = { padding: "26px 32px", fontSize: 37, lineHeight: 1.34, maxWidth: "80%", borderRadius: 26 };
  return (
    <Frame>
      <Clock theme={theme} time={time} tone={theme.colors.primary} />
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ opacity: inS, transform: `translateY(${(1 - inS) * 30}px)` }}>
          <div style={{ ...bubble, background: "rgba(242,246,248,0.10)", borderTopLeftRadius: 8, color: "#F2F6F8" }}>{incoming}</div>
        </div>
        <div style={{ alignSelf: "flex-end", opacity: outS, transform: `translateY(${(1 - outS) * 30}px) scale(${0.96 + outS * 0.04})` }}>
          <div style={{ ...bubble, background: theme.colors.primary, borderTopRightRadius: 8, color: INK, fontWeight: 500, boxShadow: `0 18px 50px ${theme.colors.primary}3A` }}>
            {outgoing}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, marginTop: 13 }}>
            <span style={{ fontSize: 26, color: theme.colors.muted }}>{sentLabel}</span>
            <svg width={30} height={19} viewBox="0 0 30 19" style={{ transform: `scale(${tick})` }}>
              <path d="M2 10.5 L8 16.5 L18 3" fill="none" stroke={theme.colors.primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 10.5 L18 16.5 L28 3" fill="none" stroke={theme.colors.primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div style={{ alignSelf: "flex-end", marginTop: 14, transform: `scale(${chip})` }}>
          <div
            style={{
              display: "inline-flex", alignItems: "baseline", gap: 12, padding: "16px 30px", borderRadius: 999,
              border: `1px solid ${theme.colors.primary}66`, background: `${theme.colors.primary}14`,
            }}
          >
            <span style={{ fontSize: 28, color: theme.colors.muted }}>replied in</span>
            <span style={{ fontSize: 42, fontWeight: 600, color: theme.colors.primary, fontVariantNumeric: "tabular-nums" }}>{responseTime}</span>
          </div>
        </div>
      </div>
    </Frame>
  );
};

/* ----------------------------------------------------- 6. what it does, ticked */

export const CapabilityTicks: React.FC<TemplateProps<{ items: string[] }>> = ({ theme, items }) => {
  const frame = useCurrentFrame();
  return (
    <Frame>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 44 }}>
        {items.map((it, i) => {
          const d = 4 + i * 14;
          const draw = ramp(frame, d, 18);
          const rise = ramp(frame, d, 22);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 28, opacity: rise, transform: `translateY(${(1 - rise) * 22}px)` }}>
              <svg width={58} height={58} viewBox="0 0 58 58" style={{ flexShrink: 0 }}>
                <circle cx={29} cy={29} r={27} fill="none" stroke={`${theme.colors.primary}44`} strokeWidth={2} />
                <path
                  d="M17 30 L25 38 L41 20" fill="none" stroke={theme.colors.primary} strokeWidth={4}
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray={46} strokeDashoffset={46 * (1 - draw)}
                />
              </svg>
              <span style={{ fontSize: 46, fontWeight: 400, lineHeight: 1.22, color: "#F2F6F8" }}>{it}</span>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};

/* --------------------------------------------------------------- 7. the close */

export const EndCard: React.FC<TemplateProps<{ wordmark: string; line: string; action: string }>> = ({
  theme, wordmark, line, action,
}) => {
  const frame = useCurrentFrame();
  const rule = ramp(frame, 18, 26);
  const chip = useSpring(34, 18, 200);
  const pulse = 1 + 0.02 * Math.sin(frame / 9);
  return (
    <Frame align="center">
      <div style={{ display: "flex", gap: 4 }}>
        {wordmark.split("").map((ch, i) => {
          const a = ramp(frame, i * 4, 18);
          return (
            <span
              key={i}
              style={{
                fontSize: 108, fontWeight: 600, letterSpacing: "-0.02em", color: "#F2F6F8",
                opacity: a, transform: `translateY(${(1 - a) * 28}px)`, display: "inline-block",
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <div style={{ height: 3, width: `${rule * 46}%`, background: theme.colors.primary, marginTop: 20, boxShadow: `0 0 20px ${theme.colors.primary}77` }} />
      <div style={{ fontSize: 44, fontWeight: 400, color: "#F2F6F8", marginTop: 40, lineHeight: 1.3, maxWidth: "88%" }}>{line}</div>
      <div style={{ marginTop: 52, transform: `scale(${chip * pulse})` }}>
        <div
          style={{
            padding: "26px 52px", borderRadius: 999, background: theme.colors.primary, color: INK,
            fontSize: 42, fontWeight: 600, boxShadow: `0 20px 60px ${theme.colors.primary}55`,
          }}
        >
          {action}
        </div>
      </div>
    </Frame>
  );
};

/* ----------------------------------------------------------------- overlays */

/** Burned-in subtitle. Scrim instead of a box, so it sits on footage without a slab. */
export const VCaption: React.FC<TemplateProps<{ text: string }>> = ({ theme, text }) => {
  const a = ramp(useCurrentFrame(), 0, 8);
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "flex-end", alignItems: "center", pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 380, background: `linear-gradient(180deg, rgba(11,22,34,0) 0%, rgba(11,22,34,0.86) 62%)` }} />
      <div
        style={{
          position: "relative", margin: "0 54px 104px", textAlign: "center",
          fontSize: 40, fontWeight: 500, lineHeight: 1.28, color: "#F2F6F8",
          textShadow: "0 2px 18px rgba(0,0,0,0.6)", opacity: a, transform: `translateY(${(1 - a) * 10}px)`,
        }}
      >
        {text}
      </div>
      <div style={{ position: "absolute", bottom: 62, width: 46, height: 3, borderRadius: 3, background: theme.colors.primary, opacity: 0.5 }} />
    </AbsoluteFill>
  );
};

/** Corner tag for the on-screen TEXT beats. Rule + text, not a filled pill. */
export const VTag: React.FC<TemplateProps<{ text: string; tone?: "amber" | "teal" }>> = ({ theme, text, tone = "amber" }) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, 0, 12);
  const c = tone === "teal" ? theme.colors.primary : theme.colors.accent;
  return (
    <AbsoluteFill style={{ fontFamily, pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 152, left: 58, right: 58, display: "flex", gap: 20, opacity: a, transform: `translateY(${(1 - a) * -14}px)` }}>
        <div style={{ width: 4, background: c, borderRadius: 4, flexShrink: 0, transform: `scaleY(${a})`, transformOrigin: "top" }} />
        <div style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.2, color: "#F2F6F8", textShadow: "0 2px 16px rgba(0,0,0,0.55)" }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};
