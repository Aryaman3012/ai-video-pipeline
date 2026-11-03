import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useVideoConfig } from "remotion";
import { useCues } from "./context";

/**
 * Built-in scene: silent generated b-roll (storyboard `broll`, ingested to clips/bNN.mp4).
 * Props: clip (storyboard id; build-timeline adds src/size/duration_s), fit ("cover" | "contain"),
 * focus_x/focus_y (0–1, what stays in frame when cropped), rate (playback rate, 0.8–1.2), grade.
 * Cues: `in` (default 0) — the shot starts playing from its first frame at this moment.
 * Use it `under` (full screen, host in pip over it) or `beside` (fills the split panel).
 */
export const Footage: React.FC<{
  src?: string; fit?: "cover" | "contain"; focus_x?: number; focus_y?: number; rate?: number;
  grade?: "cool" | "warm" | "neutral"; radius?: number;
}> = ({ src, fit = "cover", focus_x = 0.5, focus_y = 0.5, rate = 1, grade = "neutral", radius = 0 }) => {
  const { fps } = useVideoConfig();
  const cue = useCues();
  if (!src) return null;
  const filter = { cool: "contrast(1.06) saturate(0.9) brightness(0.98)", warm: "contrast(1.05) saturate(1.07) brightness(1.03)", neutral: "contrast(1.05)" }[grade];
  return (
    <AbsoluteFill style={{ borderRadius: radius, overflow: "hidden", background: "#000" }}>
      <Sequence from={Math.round(cue("in", 0) * fps)} layout="none">
        <OffthreadVideo
          src={staticFile(src)}
          muted
          playbackRate={rate}
          style={{ width: "100%", height: "100%", objectFit: fit, objectPosition: `${focus_x * 100}% ${focus_y * 100}%`, filter }}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
