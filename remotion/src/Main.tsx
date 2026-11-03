import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import type { TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import type { EDL, Segment, Theme, Transition } from "./types";
import { renderBroll, renderOverlay } from "./broll/registry";

const DEFAULT_TRANSITION_FRAMES = 12;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const presentationFor = (t: Transition): TransitionPresentation<any> | null => {
  switch (t) {
    case "fade": return fade();
    case "slide": return slide({ direction: "from-right" });
    case "wipe": return wipe({ direction: "from-left" });
    default: return null; // cut, match-cut → hard cut
  }
};

const ClipSegment: React.FC<{ seg: Segment; theme: Theme }> = ({ seg, theme }) => {
  const { fps } = useVideoConfig();
  const g = seg.grade ?? {};
  const blur = theme.unify?.clip_blur_px ?? 0;
  const filter =
    `brightness(${g.brightness ?? 1}) contrast(${g.contrast ?? 1}) saturate(${g.saturate ?? 1})` +
    (blur > 0 ? ` blur(${blur}px)` : "");
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <OffthreadVideo
        src={staticFile(seg.src!)}
        trimBefore={Math.round((seg.in_s ?? 0) * fps)}
        playbackRate={seg.playback_rate ?? 1}
        // Clips are silent picture by default. Models that generate speech deliver the VO
        // inside the clip, so a segment can opt in with clip_audio: true.
        muted={seg.clip_audio !== true}
        volume={seg.clip_volume ?? 1}
        style={{ width: "100%", height: "100%", objectFit: "cover", filter }}
      />
    </AbsoluteFill>
  );
};

const SegmentView: React.FC<{ seg: Segment; theme: Theme }> = ({ seg, theme }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {seg.kind === "clip" ? <ClipSegment seg={seg} theme={theme} /> : renderBroll(seg.broll!, theme)}
      {(seg.overlays ?? []).map((o, i) => (
        <Sequence
          key={i}
          from={Math.round(o.from_s * fps)}
          durationInFrames={Math.max(1, Math.round((o.to_s - o.from_s) * fps))}
          layout="none"
        >
          {renderOverlay(o, theme)}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/**
 * Uniform grain over the whole frame — footage AND graphics — so clips stitched from
 * multiple generations and clean vector b-roll read as one film. The turbulence seed
 * changes every frame; without that the grain reads as a dirty lens, not film.
 */
const Grain: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 300} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * Timeline rule: each segment starts exactly at the sum of the previous durations, so VO sync is kept.
 * A transition into segment i+1 overlaps the TAIL of segment i: segment i is extended by the
 * transition length (clips need that much handle after in_s + duration_s).
 */
export const Main: React.FC<EDL> = (edl) => {
  const { fps, segments, theme, audio = [] } = edl;
  const hasVo = audio.some((a) => a.role === "vo");
  const grain = theme.unify?.grain_opacity ?? 0;

  const children: React.ReactNode[] = [];
  segments.forEach((seg, i) => {
    const next = segments[i + 1];
    const nextPres = next ? presentationFor(next.transition_in ?? "cut") : null;
    const tFrames = nextPres ? next!.transition_frames ?? DEFAULT_TRANSITION_FRAMES : 0;
    const frames = Math.round(seg.duration_s * fps) + tFrames;

    children.push(
      <TransitionSeries.Sequence key={`s-${seg.scene_id}-${i}`} durationInFrames={frames}>
        <SegmentView seg={seg} theme={theme} />
      </TransitionSeries.Sequence>,
    );
    if (nextPres) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${i}`}
          presentation={nextPres}
          // Eased, not linear: linear spatial motion is the one easing the eye always clocks.
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: tFrames,
            durationRestThreshold: 0.001,
          })}
        />,
      );
    }
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <TransitionSeries>{children}</TransitionSeries>
      {grain > 0 && <Grain opacity={grain} />}
      {audio.map((a, i) => {
        const base = a.volume ?? 1;
        const vol = a.role === "music" && hasVo ? base * (a.duck_under_vo ?? 0.25) : base;
        return (
          <Sequence key={`a-${i}`} from={Math.round((a.start_s ?? 0) * fps)} layout="none">
            <Audio src={staticFile(a.src)} volume={vol} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
