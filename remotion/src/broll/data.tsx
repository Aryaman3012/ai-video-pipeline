import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import type { TemplateProps } from "../types";
import { Stage, headingStyle, rise, useEntrance } from "./common";

export const StatCounter: React.FC<TemplateProps<{ value: number; prefix?: string; suffix?: string; label: string; decimals?: number }>> = ({
  theme, value, prefix = "", suffix = "", label, decimals = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = interpolate(frame, [0, Math.round(fps * 1.2)], [0, value], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const p = useEntrance(theme, 6);
  return (
    <Stage theme={theme}>
      <div style={{ ...headingStyle(theme, 260), color: theme.colors.accent, fontVariantNumeric: "tabular-nums" }}>
        {prefix}
        {n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        {suffix}
      </div>
      <p style={{ fontSize: 60, marginTop: 24, ...rise(p) }}>{label}</p>
    </Stage>
  );
};

export const BulletList: React.FC<TemplateProps<{ title?: string; items: string[] }>> = ({ theme, title, items }) => {
  const p = useEntrance(theme);
  return (
    <Stage theme={theme} align="left">
      {title && <h2 style={{ ...headingStyle(theme, 96), marginBottom: 48, ...rise(p) }}>{title}</h2>}
      <BulletItems theme={theme} items={items} startDelay={title ? 8 : 0} />
    </Stage>
  );
};

const BulletItems: React.FC<TemplateProps<{ items: string[]; startDelay: number }>> = ({ theme, items, startDelay }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
    {items.map((it, i) => (
      <BulletRow key={i} theme={theme} text={it} delay={startDelay + i * 7} />
    ))}
  </div>
);

const BulletRow: React.FC<TemplateProps<{ text: string; delay: number }>> = ({ theme, text, delay }) => {
  const p = useEntrance(theme, delay);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 60, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
      <span style={{ width: 22, height: 22, borderRadius: 6, background: theme.colors.accent, flexShrink: 0 }} />
      {text}
    </div>
  );
};

export const SplitCompare: React.FC<TemplateProps<{ leftTitle: string; leftItems: string[]; rightTitle: string; rightItems: string[] }>> = ({
  theme, leftTitle, leftItems, rightTitle, rightItems,
}) => {
  const l = useEntrance(theme);
  const r = useEntrance(theme, 10);
  const col = (title: string, items: string[], p: number, accent: boolean, delay: number): React.ReactNode => (
    <div
      style={{
        flex: 1,
        padding: 56,
        borderRadius: 32,
        background: accent ? theme.colors.primary : "rgba(127,127,127,0.12)",
        color: accent ? theme.colors.background : theme.colors.text,
        ...rise(p, 60),
      }}
    >
      <h3 style={{ ...headingStyle(theme, 72), marginBottom: 32 }}>{title}</h3>
      {items.map((it, i) => (
        <SplitItem key={i} theme={theme} text={it} delay={delay + 6 + i * 5} />
      ))}
    </div>
  );
  return (
    <Stage theme={theme}>
      <div style={{ display: "flex", gap: 48, width: "100%", textAlign: "left" }}>
        {col(leftTitle, leftItems, l, false, 0)}
        {col(rightTitle, rightItems, r, true, 10)}
      </div>
    </Stage>
  );
};

const SplitItem: React.FC<TemplateProps<{ text: string; delay: number }>> = ({ theme, text, delay }) => {
  const p = useEntrance(theme, delay);
  return <p style={{ fontSize: 48, margin: "16px 0", opacity: p }}>{text}</p>;
};

export const BarChart: React.FC<TemplateProps<{ title?: string; bars: { label: string; value: number }[]; unit?: string }>> = ({
  theme, title, bars, unit = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const max = Math.max(...bars.map((b) => b.value), 1);
  const p = useEntrance(theme);
  return (
    <Stage theme={theme} align="left">
      {title && <h2 style={{ ...headingStyle(theme, 84), marginBottom: 56, ...rise(p) }}>{title}</h2>}
      <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%" }}>
        {bars.map((b, i) => {
          const grow = interpolate(frame - 6 - i * 5, [0, fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <div style={{ width: 360, fontSize: 44, flexShrink: 0 }}>{b.label}</div>
              <div style={{ flex: 1, height: 64, background: "rgba(127,127,127,0.15)", borderRadius: 12 }}>
                <div
                  style={{
                    width: `${(b.value / max) * 100 * grow}%`,
                    height: "100%",
                    borderRadius: 12,
                    background: i === 0 ? theme.colors.accent : theme.colors.primary,
                  }}
                />
              </div>
              <div style={{ width: 200, fontSize: 44, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                {Math.round(b.value * grow).toLocaleString("en-IN")}
                {unit}
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};
