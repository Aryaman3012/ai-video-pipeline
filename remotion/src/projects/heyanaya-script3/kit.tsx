// Shared bits for the heyanaya-script3 scenes (not a scene itself).
import React from "react";
import { loadFont as loadArabic } from "@remotion/google-fonts/IBMPlexSansArabic";
import { Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, useLayout, usePalette, useTimeline } from "../../explainer/context";
import type { Palette } from "../../explainer/types";

export const useClock = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};

/** 0→1 eased ramp starting at `sec`, `dur` long. */
export const ramp = (t: number, sec: number, dur = 0.35, ease: (x: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(t, [sec, sec + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

/** Critically damped spring that starts at `sec` (≈0.4 s to settle). */
export const pop = (frame: number, fps: number, sec: number, frames = 10) =>
  spring({ frame: frame - Math.round(sec * fps), fps, config: { damping: 200 }, durationInFrames: frames });

/** Overshooting spring for small stamps / pins. */
export const bounce = (frame: number, fps: number, sec: number) =>
  spring({ frame: frame - Math.round(sec * fps), fps, config: { damping: 11, stiffness: 180 }, durationInFrames: 14 });

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// Derived tones (all mixed from palette tokens, so a palette override still drives them).
export const tones = (C: Palette) => ({
  amber: `color-mix(in srgb, ${C.pending} 55%, #fff)`, // "unanswered" on dark grounds
  amberDeep: C.pending,
  teal: `color-mix(in srgb, ${C.money} 78%, #fff)`, // HeyAnaya / solved on dark grounds
  tealDeep: C.money,
  navy: C.night,
  navyLine: C.nightLine,
  navyRaised: `color-mix(in srgb, ${C.night} 82%, #fff)`,
  mist: "rgba(255,255,255,0.62)",
  faint: "rgba(255,255,255,0.38)",
  grey: C.ink3,
});

/** Small honest-numbers tag. */
export const Illustrative: React.FC<{ dark?: boolean; size?: number; style?: React.CSSProperties }> = ({ dark, size = 17, style }) => {
  const C = usePalette();
  const { u } = useLayout();
  return (
    <span
      style={{
        fontFamily: SANS, fontSize: size * u, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
        color: dark ? "rgba(255,255,255,0.55)" : C.ink3, border: `1px solid ${dark ? "rgba(255,255,255,0.25)" : C.line}`,
        borderRadius: 6 * u, padding: `${3 * u}px ${8 * u}px`, display: "inline-block", ...style,
      }}
    >
      Illustrative
    </span>
  );
};

/** Brand mark from the timeline; `light` = the white logo for dark grounds. */
export const BrandMark: React.FC<{ size: number; light?: boolean }> = ({ size, light }) => {
  const { brand } = useTimeline();
  const src = light ? brand.logo_light : brand.logo_dark;
  if (!src) return null;
  return <Img src={staticFile(src)} style={{ width: size, height: size, objectFit: "contain" }} />;
};

const { fontFamily: ARABIC } = loadArabic("normal", { weights: ["400", "600"], subsets: ["arabic"], ignoreTooManyRequestsWarning: true });
export const AR_FONT = `${ARABIC}, "Geeza Pro", sans-serif`;

/** Deterministic pseudo-random in [0,1). */
export const rnd = (i: number, salt = 1) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
