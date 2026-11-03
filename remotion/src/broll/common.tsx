import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../types";

/** 0 → 1 spring entrance, delayed by `delay` frames. Reads motion settings from the theme. */
export const useEntrance = (theme: Theme, delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: theme.motion?.damping ?? 18, stiffness: theme.motion?.stiffness ?? 120 },
    durationInFrames: theme.motion?.entrance_frames ?? 12,
  });
};

/** Style for an element rising + fading in. */
export const rise = (p: number, distance = 40): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px)`,
});

export const Stage: React.FC<{ theme: Theme; children: React.ReactNode; align?: "center" | "left" }> = ({
  theme,
  children,
  align = "center",
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
      fontFamily: theme.fonts.body,
      padding: "8% 10%", // inside title-safe
      justifyContent: "center",
      alignItems: align === "center" ? "center" : "flex-start",
      textAlign: align,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const headingStyle = (theme: Theme, size = 120): React.CSSProperties => ({
  fontFamily: theme.fonts.heading,
  fontSize: size,
  fontWeight: 800,
  lineHeight: 1.05,
  letterSpacing: "-0.02em",
  margin: 0,
});

export const asString = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : v == null ? fallback : String(v));
export const asStrings = (v: unknown): string[] => (Array.isArray(v) ? v.map((x) => asString(x)) : []);
export const asNumber = (v: unknown, fallback = 0): number => (typeof v === "number" ? v : Number(v ?? fallback) || fallback);
