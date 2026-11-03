import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PROJECT_SCENES } from "../projects";
import { Captions, EndCard, Grain, LogoBug } from "./Chrome";
import { Footage } from "./Footage";
import { BeatProvider, TimelineProvider, usePalette, useTimeline } from "./context";
import { Host, useGeometry, usePipAmount, useSplitAmount } from "./Host";
import type { Beat, SceneRef, Timeline } from "./types";

const BUILT_IN: Record<string, React.FC<any>> = { LogoBug, Footage }; // eslint-disable-line @typescript-eslint/no-explicit-any

const Missing: React.FC<{ name: string }> = ({ name }) => (
  <AbsoluteFill style={{ background: "#B00020", color: "#fff", justifyContent: "center", alignItems: "center", fontSize: 48 }}>Unknown scene: {name}</AbsoluteFill>
);

const SceneView: React.FC<{ scene: SceneRef }> = ({ scene }) => {
  const { slug } = useTimeline();
  const C = PROJECT_SCENES[slug]?.[scene.name] ?? BUILT_IN[scene.name];
  return C ? <C {...(scene.props ?? {})} /> : <Missing name={scene.name} />;
};

export const beatFrames = (b: Beat, fps: number) => Math.floor(b.dur * fps);
export const totalFrames = (t: Timeline) =>
  t.beats.reduce((a, b) => a + beatFrames(b, t.fps), 0) + Math.round((t.end_card?.seconds ?? 0) * t.fps);

/** Full-screen graphics under the host. When the beat puts him in pip they fade in with it. */
const Under: React.FC<{ beat: Beat; scenes: SceneRef[] }> = ({ beat, scenes }) => {
  const pip = usePipAmount(beat);
  const usesPip = beat.host.some(([, m]) => m === "pip");
  const o = usesPip ? pip : 1;
  if (!scenes.length || o <= 0.001) return null;
  return <AbsoluteFill style={{ opacity: o }}>{scenes.map((s, i) => <SceneView key={i} scene={s} />)}</AbsoluteFill>;
};

/** The split panel beside (16:9) or below (9:16) the host; slides in as he moves into split. */
const Beside: React.FC<{ beat: Beat; scenes: SceneRef[] }> = ({ beat, scenes }) => {
  const { panel, vertical, u } = useGeometry();
  const p = useSplitAmount(beat);
  if (!scenes.length || p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: panel.x, top: panel.y, width: panel.w, height: panel.h, display: "flex", alignItems: "center", justifyContent: "center", opacity: p, transform: vertical ? `translateY(${(1 - p) * 80 * u}px)` : `translateX(${(1 - p) * 80 * u}px)` }}>
      {scenes.map((s, i) => <SceneView key={i} scene={s} />)}
    </div>
  );
};

/** In 16:9 split the captions follow the host into his panel. */
const CaptionFrame: React.FC<{ beat: Beat; children: React.ReactNode }> = ({ beat, children }) => {
  const { W, vertical, shots } = useGeometry();
  const p = useSplitAmount(beat);
  const left = vertical ? 0 : shots.split.x * p;
  const width = vertical ? W : W + (shots.split.w - W) * p;
  return <div style={{ position: "absolute", top: 0, bottom: 0, left, width }}>{children}</div>;
};

const BeatView: React.FC<{ beat: Beat; captions: boolean }> = ({ beat, captions }) => {
  const by = (l: SceneRef["layer"]) => beat.scenes.filter((s) => s.layer === l);
  // cues are per scene; merge so a scene's useCues() sees its own names
  return (
    <>
      {by("under").map((s, i) => (
        <BeatProvider key={`u${i}`} value={{ beat, cues: s.cues ?? {} }}><Under beat={beat} scenes={[s]} /></BeatProvider>
      ))}
      <Host beat={beat} />
      {by("beside").map((s, i) => (
        <BeatProvider key={`b${i}`} value={{ beat, cues: s.cues ?? {} }}><Beside beat={beat} scenes={[s]} /></BeatProvider>
      ))}
      {by("over").map((s, i) => (
        <BeatProvider key={`o${i}`} value={{ beat, cues: s.cues ?? {} }}><AbsoluteFill><SceneView scene={s} /></AbsoluteFill></BeatProvider>
      ))}
      {captions && beat.captions && (
        <CaptionFrame beat={beat}><Captions chunks={beat.captions} /></CaptionFrame>
      )}
    </>
  );
};

const Music: React.FC<{ t: Timeline; talk: number }> = ({ t, talk }) => {
  const frame = useCurrentFrame();
  if (!t.music) return null;
  const base = t.music.volume ?? 0.1;
  const v = interpolate(frame, [0, 12, talk, talk + Math.round((t.end_card?.seconds ?? 0) * t.fps * 0.85), talk + Math.round((t.end_card?.seconds ?? 0) * t.fps)], [0, base, base, base * 1.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Audio src={staticFile(t.music.src)} volume={v} />;
};

const Inner: React.FC<{ t: Timeline }> = ({ t }) => {
  const { width, height } = useVideoConfig();
  const C = usePalette();
  const vertical = height > width;
  const captions = vertical ? t.captions?.vertical ?? true : t.captions?.landscape ?? true;
  let at = 0;
  const seqs = t.beats.map((b) => {
    const from = at;
    at += beatFrames(b, t.fps);
    return (
      <Sequence key={b.id} from={from} durationInFrames={beatFrames(b, t.fps)} name={`${b.id} ${b.scenes.map((s) => s.name).join("+")}`}>
        <BeatView beat={b} captions={captions} />
      </Sequence>
    );
  });
  const bg = t.end_card?.background;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      {seqs}
      {t.end_card && (
        <Sequence from={at} name="end card">
          <EndCard background={bg ? <BeatProvider value={{ beat: t.beats[t.beats.length - 1], cues: bg.cues ?? {} }}><SceneView scene={bg} /></BeatProvider> : undefined} />
        </Sequence>
      )}
      <Music t={t} talk={at} />
      <Grain />
    </AbsoluteFill>
  );
};

export const Explainer: React.FC<Timeline> = (t) => (
  <TimelineProvider value={t}>
    <Inner t={t} />
  </TimelineProvider>
);
