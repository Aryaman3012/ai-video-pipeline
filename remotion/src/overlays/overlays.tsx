import React from "react";
import { AbsoluteFill } from "remotion";
import type { TemplateProps } from "../types";
import { useEntrance } from "../broll/common";

export const LowerThird: React.FC<TemplateProps<{ title: string; subtitle?: string }>> = ({ theme, title, subtitle }) => {
  const p = useEntrance(theme);
  const p2 = useEntrance(theme, 6);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 0 8% 6%", fontFamily: theme.fonts.body }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 20, transform: `translateX(${(1 - p) * -80}px)`, opacity: p }}>
        <div style={{ width: 10, background: theme.colors.accent, borderRadius: 5 }} />
        <div style={{ background: "rgba(0,0,0,0.65)", padding: "18px 32px", borderRadius: 12 }}>
          <div style={{ color: "#fff", fontFamily: theme.fonts.heading, fontSize: 52, fontWeight: 700 }}>{title}</div>
          {subtitle && <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 34, opacity: p2 }}>{subtitle}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Caption: React.FC<TemplateProps<{ text: string }>> = ({ theme, text }) => {
  const p = useEntrance(theme);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "7%" }}>
      <div
        style={{
          maxWidth: "80%",
          textAlign: "center",
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          fontFamily: theme.fonts.body,
          fontSize: 48,
          fontWeight: 600,
          padding: "14px 28px",
          borderRadius: 10,
          opacity: p,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const corner = {
  tl: { justifyContent: "flex-start", alignItems: "flex-start" },
  tr: { justifyContent: "flex-start", alignItems: "flex-end" },
  bl: { justifyContent: "flex-end", alignItems: "flex-start" },
  br: { justifyContent: "flex-end", alignItems: "flex-end" },
} as const;

export const CalloutTag: React.FC<TemplateProps<{ text: string; position?: keyof typeof corner }>> = ({ theme, text, position = "tr" }) => {
  const p = useEntrance(theme);
  return (
    <AbsoluteFill style={{ ...corner[position], padding: "6%" }}>
      <div
        style={{
          background: theme.colors.accent,
          color: theme.colors.background,
          fontFamily: theme.fonts.heading,
          fontSize: 44,
          fontWeight: 800,
          padding: "14px 28px",
          borderRadius: 999,
          transform: `scale(${0.6 + 0.4 * p})`,
          opacity: p,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
