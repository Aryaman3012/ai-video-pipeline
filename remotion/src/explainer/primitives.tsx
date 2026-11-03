// Building blocks for project scenes. Scenes are designed per video by the scene-builder;
// these are only the parts every scene would otherwise re-implement. Everything sizes off `u`.
import React from "react";
import { useCurrentFrame } from "remotion";
import { MONO, SANS, useLayout, usePalette } from "./context";

export const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color, size = 22 }) => {
  const C = usePalette();
  return <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: size, letterSpacing: "0.06em", textTransform: "uppercase", color: color ?? C.ink3 }}>{children}</div>;
};

export const Mono: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span style={{ fontFamily: MONO, fontVariantNumeric: "tabular-nums", ...style }}>{children}</span>
);

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const C = usePalette();
  const { u } = useLayout();
  return (
    <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 18 * u, boxShadow: "0 1px 2px rgba(31,36,48,0.05), 0 18px 40px -24px rgba(31,36,48,0.25)", ...style }}>
      {children}
    </div>
  );
};

/** Pill badge, e.g. "Unanswered · 3 h" (tone alert) or "Replied in 2 s" (tone money). */
export const Badge: React.FC<{ tone: "alert" | "money" | "pending"; p?: number; size?: number; children: React.ReactNode }> = ({ tone, p = 1, size = 30, children }) => {
  const C = usePalette();
  const { u } = useLayout();
  const fg = { alert: C.alert, money: C.money, pending: C.pending }[tone];
  const bg = { alert: C.alertWash, money: C.moneyWash, pending: "#f6eedb" }[tone];
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 10}px)`, fontFamily: SANS, fontSize: size * u, fontWeight: 700, color: fg, background: bg, borderRadius: 10 * u, padding: `${8 * u}px ${18 * u}px`, display: "inline-block" }}>
      {children}
    </div>
  );
};

// ---------- phone + generic WhatsApp-style chat (no logos) ----------

export const Phone: React.FC<{ children: React.ReactNode; k?: number; style?: React.CSSProperties }> = ({ children, k = 1, style }) => {
  const C = usePalette();
  const { u } = useLayout();
  const s = u * k;
  return (
    <div style={{ width: 380 * s, height: 720 * s, borderRadius: 56 * s, background: "#111", padding: 12 * s, boxShadow: "0 40px 70px -34px rgba(0,0,0,0.55)", ...style }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 46 * s, overflow: "hidden", background: C.waBg, position: "relative", fontSize: 22 * s, fontFamily: SANS, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
};

export const ChatHeader: React.FC<{ k?: number; name: string; sub: string; right?: React.ReactNode; avatar?: React.ReactNode }> = ({ k = 1, name, sub, right, avatar }) => {
  const C = usePalette();
  const { u } = useLayout();
  const s = u * k;
  return (
    <div style={{ background: C.waHeader, padding: `${54 * s}px ${20 * s}px ${16 * s}px`, display: "flex", alignItems: "center", gap: 14 * s }}>
      {avatar ?? <div style={{ width: 50 * s, height: 50 * s, borderRadius: 999, background: "#c7cdd3", display: "grid", placeItems: "center", fontWeight: 600, color: "#fff" }}>P</div>}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: "#111b21", fontSize: 24 * s }}>{name}</div>
        <div style={{ fontSize: 16 * s, color: "#667781" }}>{sub}</div>
      </div>
      {right}
    </div>
  );
};

/** Newest message sits at the bottom; older ones scroll off the top, like a real chat. */
export const ChatBody: React.FC<{ k?: number; children: React.ReactNode }> = ({ k = 1, children }) => {
  const { u } = useLayout();
  return <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 14 * u * k, padding: 18 * u * k }}>{children}</div>;
};

export const Bubble: React.FC<{
  out?: boolean; p: number; time: string; ticks?: "grey" | "blue"; k?: number; rtl?: boolean; glow?: number; children: React.ReactNode;
}> = ({ out, p, time, ticks, k = 1, rtl, glow = 0, children }) => {
  const C = usePalette();
  const { u } = useLayout();
  const s = u * k;
  if (p <= 0) return null;
  return (
    <div
      style={{
        alignSelf: out ? "flex-end" : "flex-start", maxWidth: "84%", background: out ? C.waOut : "#fff", borderRadius: 16 * s,
        padding: `${12 * s}px ${16 * s}px ${8 * s}px`,
        boxShadow: `0 1px 1px rgba(0,0,0,0.08)${glow > 0 ? `, 0 0 0 ${3 * s * glow}px rgba(30,118,80,${0.8 * glow})` : ""}`,
        opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 16 * s}px) scale(${0.95 + 0.05 * p})`,
        transformOrigin: out ? "right bottom" : "left bottom", lineHeight: 1.35, color: "#111b21",
      }}
    >
      <div dir={rtl ? "rtl" : undefined} style={{ fontFamily: rtl ? '"Geeza Pro", "Noto Naskh Arabic", Arial, sans-serif' : undefined }}>{children}</div>
      <div style={{ fontSize: 15 * s, color: "#667781", textAlign: "right", marginTop: 4 * s }}>
        <Mono>{time}</Mono>
        {ticks && <span style={{ color: ticks === "blue" ? "#53bdeb" : "#8696a0", marginLeft: 6 * s, fontWeight: 700 }}>✓✓</span>}
      </div>
    </div>
  );
};

export const Typing: React.FC<{ k?: number; out?: boolean }> = ({ k = 1, out = true }) => {
  const frame = useCurrentFrame();
  const C = usePalette();
  const { u } = useLayout();
  const s = u * k;
  return (
    <div style={{ alignSelf: out ? "flex-end" : "flex-start", background: out ? C.waOut : "#fff", borderRadius: 16 * s, padding: `${14 * s}px ${18 * s}px`, display: "flex", gap: 6 * s }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 9 * s, height: 9 * s, borderRadius: 99, background: "#667781", opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame + i * 4) / 4)) }} />
      ))}
    </div>
  );
};

// ---------- icons ----------

type Icon = React.FC<{ size: number; color?: string }>;
export const Check: Icon = ({ size, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.2 4.2L19 7" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const ChatIcon: Icon = ({ size, color = "#000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M4 4h16a2 2 0 012 2v10a2 2 0 01-2 2H9l-5 4v-4a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>
);
export const PhoneIcon: Icon = ({ size, color = "#000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M6.6 10.8a15.2 15.2 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" /></svg>
);
export const CalIcon: Icon = ({ size, color = "#000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
);
export const BoltIcon: Icon = ({ size, color = "#000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></svg>
);
export const GlobeIcon: Icon = ({ size, color = "#000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg>
);
export const SparkIcon: Icon = ({ size, color = "#000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2l2.2 6.3L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.7L12 2zM19 15l1 2.7 2.7 1-2.7 1-1 2.7-1-2.7-2.7-1 2.7-1 1-2.7z" /></svg>
);
export const MegaphoneIcon: Icon = ({ size, color = "#000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round"><path d="M3 10v4h4l6 4V6L7 10H3z" /><path d="M17 9a4 4 0 010 6M19.5 6.5a7.5 7.5 0 010 11" /></svg>
);
export const ReplyIcon: Icon = ({ size, color = "#000" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M9 7L4 12l5 5" /><path d="M4 12h10a6 6 0 016 6" /></svg>
);
