import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { TemplateProps } from "../types";
import { Stage, headingStyle, rise, useEntrance } from "./common";

export const TitleCard: React.FC<TemplateProps<{ title: string; subtitle?: string }>> = ({ theme, title, subtitle }) => {
  const p = useEntrance(theme);
  const p2 = useEntrance(theme, 8);
  const bar = useEntrance(theme, 4);
  return (
    <Stage theme={theme}>
      <div style={{ width: 160 * bar, height: 10, background: theme.colors.accent, borderRadius: 5, marginBottom: 40 }} />
      <h1 style={{ ...headingStyle(theme, 132), ...rise(p) }}>{title}</h1>
      {subtitle && (
        <p style={{ fontSize: 56, marginTop: 32, color: theme.colors.muted ?? theme.colors.text, ...rise(p2) }}>{subtitle}</p>
      )}
    </Stage>
  );
};

/** Word-by-word reveal. Words listed in `highlight` get the accent colour. */
export const KineticText: React.FC<TemplateProps<{ text: string; highlight?: string[] }>> = ({ theme, text, highlight = [] }) => {
  const frame = useCurrentFrame();
  const words = text.split(/\s+/);
  const hl = new Set(highlight.map((w) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "")));
  const perWord = 4;
  return (
    <Stage theme={theme}>
      <h1 style={{ ...headingStyle(theme, 110), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 28px" }}>
        {words.map((w, i) => {
          const t = interpolate(frame - i * perWord, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const key = w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
          return (
            <span
              key={i}
              style={{
                opacity: t,
                transform: `translateY(${(1 - t) * 30}px) scale(${0.9 + 0.1 * t})`,
                color: hl.has(key) ? theme.colors.accent : theme.colors.text,
                display: "inline-block",
              }}
            >
              {w}
            </span>
          );
        })}
      </h1>
    </Stage>
  );
};

export const QuoteCard: React.FC<TemplateProps<{ quote: string; author?: string }>> = ({ theme, quote, author }) => {
  const p = useEntrance(theme);
  const p2 = useEntrance(theme, 14);
  return (
    <Stage theme={theme}>
      <div style={{ ...headingStyle(theme, 220), color: theme.colors.accent, height: 140, ...rise(p) }}>“</div>
      <p style={{ fontSize: 76, lineHeight: 1.25, fontStyle: "italic", maxWidth: 1400, margin: 0, ...rise(p) }}>{quote}</p>
      {author && <p style={{ fontSize: 44, marginTop: 40, color: theme.colors.muted ?? theme.colors.text, ...rise(p2) }}>— {author}</p>}
    </Stage>
  );
};

export const CTA: React.FC<TemplateProps<{ headline: string; action: string; url?: string }>> = ({ theme, headline, action, url }) => {
  const p = useEntrance(theme);
  const btn = useEntrance(theme, 10);
  const frame = useCurrentFrame();
  const pulse = 1 + 0.03 * Math.sin(frame / 6) * btn;
  return (
    <Stage theme={theme}>
      <h1 style={{ ...headingStyle(theme, 110), ...rise(p) }}>{headline}</h1>
      <div
        style={{
          marginTop: 60,
          padding: "28px 64px",
          borderRadius: 999,
          background: theme.colors.primary,
          color: theme.colors.background,
          fontSize: 56,
          fontWeight: 700,
          opacity: btn,
          transform: `scale(${pulse * (0.8 + 0.2 * btn)})`,
        }}
      >
        {action}
      </div>
      {url && <p style={{ fontSize: 40, marginTop: 36, opacity: btn }}>{url}</p>}
    </Stage>
  );
};
