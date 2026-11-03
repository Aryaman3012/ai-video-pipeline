// Engine-level pieces every explainer uses: captions, grain, logo bug, end card.
import React from "react";
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, useCues, useIn, useLayout, usePalette, useTimeline } from "./context";
import type { Word } from "./types";

const POS = "#5fd39a";
const NEG = "#ff8a7a";

/** Word-by-word captions: 2–4 words on screen, the spoken word lifts in white, tagged words go green/red. */
export const Captions: React.FC<{ chunks: Word[][] }> = ({ chunks }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, height, vertical } = useLayout();
  const t = frame / fps;
  const idx = chunks.findIndex((c, i) => {
    const next = chunks[i + 1]?.[0].s ?? Infinity;
    return t >= c[0].s && t < Math.min(next, c[c.length - 1].e + 0.6);
  });
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const pop = spring({ frame: frame - Math.round(chunk[0].s * fps), fps, config: { damping: 200 }, durationInFrames: 5 });
  const size = vertical ? 66 : 50;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: vertical ? height * 0.36 - size * 0.8 : undefined, bottom: vertical ? undefined : height * 0.075, display: "flex", justifyContent: "center", padding: "0 60px" }}>
      <div
        style={{
          fontFamily: SANS, fontWeight: 700, fontSize: size, lineHeight: 1.18, letterSpacing: "-0.01em", textAlign: "center",
          padding: vertical ? "14px 26px" : "10px 22px", borderRadius: 14, background: "rgba(20, 22, 28, 0.9)",
          maxWidth: vertical ? width * 0.86 : width * 0.7, transform: `translateY(${(1 - pop) * 10}px) scale(${0.96 + pop * 0.04})`, opacity: pop,
        }}
      >
        {chunk.map((w, i) => {
          const spoken = t >= w.s - 0.02;
          const color = w.k === "pos" ? POS : w.k === "neg" ? NEG : "#ffffff";
          return <span key={i} style={{ color: spoken ? color : "rgba(255,255,255,0.5)" }}>{w.w}{i < chunk.length - 1 ? " " : ""}</span>;
        })}
      </div>
    </div>
  );
};

/** Fine film grain over footage AND graphics so they read as one film. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.22 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const seed = Math.floor(random(`g${frame % 12}`) * 1000);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity }}>
      <svg width={width} height={height}>
        <filter id={`grain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Built-in scene: brand bug. Cues: `in` (default 0), `out` (default in + 1.5). */
export const LogoBug: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCues();
  const { u, vertical, height } = useLayout();
  const { brand } = useTimeline();
  const C = usePalette();
  const tin = cue("in", 0);
  const tout = cue("out", tin + 1.5);
  const p = useIn(tin, 14);
  const out = interpolate(frame, [tout * fps, (tout + 0.15) * fps], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: vertical ? height * 0.12 : height * 0.1, display: "flex", justifyContent: "center", opacity: Math.min(p, out), transform: `scale(${0.9 + 0.1 * p})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 * u, background: C.black, padding: `${16 * u}px ${28 * u}px`, borderRadius: 16 * u }}>
        {brand.logo_light && <Img src={staticFile(brand.logo_light)} style={{ width: 48 * u, height: 48 * u, objectFit: "contain" }} />}
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 42 * u, color: "#fff", letterSpacing: "-0.01em" }}>{brand.name}</span>
      </div>
    </div>
  );
};

/** End card: optional background scene dims, then logo, headline and CTA settle in. */
export const EndCard: React.FC<{ background?: React.ReactNode }> = ({ background }) => {
  const frame = useCurrentFrame();
  const { vertical, u } = useLayout();
  const { brand, end_card } = useTimeline();
  const C = usePalette();
  const enter = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const dim = interpolate(frame, [0, 10], [0.2, 0.8], { extrapolateRight: "clamp" });
  const logo = useIn(0.15, 16);
  const head = useIn(0.4);
  const cta = useIn(0.7);
  if (!end_card) return null;
  return (
    <AbsoluteFill style={{ fontFamily: SANS, opacity: enter, background: C.night }}>
      {background}
      <AbsoluteFill style={{ background: C.black, opacity: dim }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40 * u, padding: 80 * u, textAlign: "center", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 * u, opacity: logo, transform: `scale(${0.92 + 0.08 * logo})` }}>
          {brand.logo_light && <Img src={staticFile(brand.logo_light)} style={{ width: 96 * u, height: 96 * u, objectFit: "contain" }} />}
          <span style={{ fontSize: 84 * u, fontWeight: 700, letterSpacing: "-0.02em" }}>{brand.name}</span>
        </div>
        <div style={{ opacity: head, transform: `translateY(${(1 - head) * 16}px)`, fontSize: (vertical ? 54 : 46) * u, fontWeight: 500, maxWidth: (vertical ? 900 : 1200) * u, lineHeight: 1.2, color: "rgba(255,255,255,0.88)" }}>
          {end_card.headline}
        </div>
        <div style={{ opacity: cta, transform: `translateY(${(1 - cta) * 16}px)`, display: "grid", gap: 18 * u, justifyItems: "center" }}>
          <div style={{ background: "#fff", color: C.black, fontSize: 36 * u, fontWeight: 700, padding: `${18 * u}px ${40 * u}px`, borderRadius: 12 * u }}>{end_card.cta}</div>
          {end_card.url && <div style={{ fontSize: 30 * u, color: "rgba(255,255,255,0.7)" }}>{end_card.url}</div>}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
