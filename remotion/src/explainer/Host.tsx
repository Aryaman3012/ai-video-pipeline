import React from "react";
import { AbsoluteFill, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useLayout, useTimeline } from "./context";
import type { Beat, HostMode } from "./types";

type Shot = { x: number; y: number; w: number; h: number; r: number; z: number; fx: number; fy: number; ay: number; ring: number };
export type Rect = { x: number; y: number; w: number; h: number };

/**
 * Where the host sits in each mode, and the free panel beside (16:9) or below (9:16) him in split.
 * Everything a scene places in `beside` must fit `panel`; in 16:9 the bottom 150u stays clear for captions.
 */
export const useGeometry = (beatFraming?: Beat["framing"]) => {
  const { width: W, height: H, vertical, u } = useLayout();
  const tl = useTimeline();
  const framing = beatFraming ?? tl.framing;
  const pipD = (vertical ? 250 : 290) * u;
  const face = { fx: framing.face_x, fy: framing.face_y };
  const body = { fx: framing.face_x, fy: framing.body_y };
  const shots: Record<HostMode, Shot> = vertical
    ? {
        full: { x: 0, y: 0, w: W, h: H, r: 0, z: 1, ...body, fy: body.fy + 0.02, ay: 0.42, ring: 0 },
        split: { x: 0, y: 0, w: W, h: 860 * u, r: 0, z: 1, ...body, ay: 0.5, ring: 0 },
        pip: { x: W - 48 * u - pipD, y: 110 * u, w: pipD, h: pipD, r: pipD / 2, z: 2.2, ...face, ay: 0.5, ring: 1 },
      }
    : {
        full: { x: 0, y: 0, w: W, h: H, r: 0, z: 1, ...body, fy: body.fy - 0.02, ay: 0.5, ring: 0 },
        split: { x: 40 * u, y: 40 * u, w: 780 * u, h: H - 80 * u, r: 28 * u, z: 1, ...body, ay: 0.5, ring: 0 },
        pip: { x: 48 * u, y: H - 48 * u - pipD, w: pipD, h: pipD, r: pipD / 2, z: 2.2, ...face, ay: 0.5, ring: 1 },
      };
  const panel: Rect = vertical ? { x: 0, y: 860 * u, w: W, h: H - 860 * u } : { x: 860 * u, y: 0, w: W - 860 * u, h: H - 150 * u };
  // where the pip circle sits, so full-screen scenes can keep that corner clear
  const pipRect: Rect = { x: shots.pip.x, y: shots.pip.y, w: pipD, h: pipD };
  return { W, H, u, vertical, shots, panel, pipRect };
};

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const mix = (a: Shot, b: Shot, p: number): Shot =>
  Object.fromEntries(Object.keys(a).map((k) => [k, lerp(a[k as keyof Shot], b[k as keyof Shot], p)])) as Shot;

/** Current host mode blend for a beat: [from, to, progress]. */
export const hostState = (beat: Beat, frame: number, fps: number): [HostMode, HostMode, number] => {
  const t = frame / fps;
  let idx = 0;
  beat.host.forEach(([kt], i) => { if (t >= kt) idx = i; });
  const [kt, to] = beat.host[idx];
  const prev = idx > 0 ? beat.host[idx - 1][1] : beat.from ?? to;
  const p = spring({ frame: frame - Math.round(kt * fps), fps, config: { damping: 200 }, durationInFrames: 14 });
  return [prev, to, p];
};

const useModeAmount = (beat: Beat, mode: HostMode) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [a, b, p] = hostState(beat, frame, fps);
  return (a === mode ? 1 - p : 0) + (b === mode ? p : 0);
};
export const useSplitAmount = (beat: Beat) => useModeAmount(beat, "split");
export const usePipAmount = (beat: Beat) => useModeAmount(beat, "pip");

const GRADE = {
  cool: "contrast(1.06) saturate(0.9) brightness(0.98)",
  warm: "contrast(1.05) saturate(1.07) brightness(1.03)",
  neutral: "contrast(1.05) saturate(1.0)",
};

export const Host: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { source } = useTimeline();
  const { shots } = useGeometry(beat.framing);
  const [a, b, p] = hostState(beat, frame, fps);
  const s = mix(shots[a], shots[b], p);
  const fullness = (a === "full" ? 1 - p : 0) + (b === "full" ? p : 0);
  const creep = 1 + (beat.push ?? 0) * (frame / (beat.dur * fps)) * fullness;

  const scale = Math.max(s.w / source.w, s.h / source.h) * s.z * creep;
  const iw = source.w * scale;
  const ih = source.h * scale;
  const left = Math.min(0, Math.max(s.w - iw, s.w / 2 - s.fx * iw));
  const top = Math.min(0, Math.max(s.h - ih, s.h * s.ay - s.fy * ih));

  return (
    <div
      style={{
        position: "absolute", left: s.x, top: s.y, width: s.w, height: s.h, borderRadius: s.r, overflow: "hidden", background: "#000",
        boxShadow: s.ring > 0.01
          ? `0 0 0 ${6 * s.ring}px rgba(255,255,255,${0.95 * s.ring}), 0 24px 50px -16px rgba(0,0,0,${0.55 * s.ring})`
          : s.r > 1 ? "0 30px 60px -30px rgba(31,36,48,0.45)" : undefined,
      }}
    >
      <div style={{ position: "absolute", left, top, width: iw, height: ih, filter: GRADE[beat.grade ?? "neutral"] }}>
        <OffthreadVideo src={staticFile(beat.src)} style={{ width: "100%", height: "100%" }} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.3) 100%)", opacity: 1 - s.ring }} />
    </div>
  );
};
