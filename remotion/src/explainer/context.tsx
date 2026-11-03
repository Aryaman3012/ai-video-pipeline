import { loadFont as loadSans } from "@remotion/google-fonts/InstrumentSans";
import { loadFont as loadMono } from "@remotion/google-fonts/SplineSansMono";
import React, { createContext, useContext } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Beat, Palette, Timeline } from "./types";

// HeyAnaya "Ledger" tokens; a timeline can override any of them with `palette`.
export const DEFAULT_PALETTE: Palette = {
  paper: "#fbfaf7", raised: "#fefdfb", sunken: "#f5f3ee",
  ink: "#1f2430", ink2: "#585e6a", ink3: "#8a8f99", line: "#e4e1da", lineStrong: "#d6d2c9", black: "#252420",
  money: "#1e7650", moneyWash: "#e5f3eb", alert: "#a8382c", alertWash: "#fbe9e6", pending: "#a07a1f",
  night: "#141821", nightLine: "#252b38", waBg: "#efeae2", waOut: "#d9fdd3", waHeader: "#f0f2f5",
};

export const { fontFamily: SANS } = loadSans("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
export const { fontFamily: MONO } = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

const TimelineCtx = createContext<Timeline | null>(null);
const BeatCtx = createContext<{ beat: Beat; cues: Record<string, number> } | null>(null);

export const TimelineProvider = TimelineCtx.Provider;
export const BeatProvider = BeatCtx.Provider;

export const useTimeline = () => {
  const t = useContext(TimelineCtx);
  if (!t) throw new Error("useTimeline outside <Explainer>");
  return t;
};
export const usePalette = (): Palette => ({ ...DEFAULT_PALETTE, ...(useContext(TimelineCtx)?.palette ?? {}) });
export const useBeat = () => {
  const b = useContext(BeatCtx);
  if (!b) throw new Error("useBeat outside a beat");
  return b.beat;
};

/** A scene's cue in seconds. Missing cues fall back, so a scene still renders while it is being designed. */
export const useCues = () => {
  const b = useContext(BeatCtx);
  return (name: string, fallback = 0) => b?.cues[name] ?? fallback;
};

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  const u = Math.min(width, height) / 1080; // everything scales off the short edge
  return { width, height, vertical, u };
};

export const useIn = (delaySec = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - Math.round(delaySec * fps), fps, config: { damping }, durationInFrames: Math.round(fps * 0.6) });
};

export const at = (frame: number, fps: number, sec: number, dur = 0.5) =>
  interpolate(frame, [sec * fps, (sec + dur) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
