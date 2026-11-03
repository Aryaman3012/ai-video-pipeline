import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { sampleEdl } from "./sample-edl";
import type { EDL } from "./types";
import { BrollGallery } from "./BrollGallery";
import { renderBroll } from "./broll/registry";
import { Explainer, totalFrames } from "./explainer/Explainer";
import type { Timeline } from "./explainer/types";
import type { TemplateRef, Theme } from "./types";

/** Preview ONE b-roll card on its own, so cards can be built and reviewed individually. */
const Card: React.FC<{ card: TemplateRef; theme: Theme }> = ({ card, theme }) => <>{renderBroll(card, theme)}</>;

// The EDL is passed as input props: --props=../projects/<slug>/06_edit/edl.json
// Duration, size and fps are derived from it, so the EDL is the single source of truth.
// Storyboard flow: the timeline is passed as input props: --props=../projects/<slug>/06_edit/timeline.json
const EMPTY_TIMELINE: Timeline = {
  slug: "", version: 0, fps: 24, source: { w: 1080, h: 720 }, framing: { face_x: 0.5, face_y: 0.28, body_y: 0.4 },
  brand: { name: "" }, beats: [],
};
const explainerMeta = (w: number, h: number) => ({ props }: { props: Record<string, unknown> }) => {
  const t = props as unknown as Timeline;
  return { durationInFrames: Math.max(1, totalFrames(t)), fps: t.fps, width: w, height: h };
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Explainer16x9" component={Explainer} defaultProps={EMPTY_TIMELINE} durationInFrames={1} fps={24} width={1920} height={1080} calculateMetadata={explainerMeta(1920, 1080)} />
    <Composition id="Explainer9x16" component={Explainer} defaultProps={EMPTY_TIMELINE} durationInFrames={1} fps={24} width={1080} height={1920} calculateMetadata={explainerMeta(1080, 1920)} />
    <Composition
      id="Main"
      component={Main}
      defaultProps={sampleEdl as EDL}
      durationInFrames={1}
      fps={sampleEdl.fps}
      width={sampleEdl.width}
      height={sampleEdl.height}
      calculateMetadata={({ props }) => {
        const edl = props as EDL;
        const frames = edl.segments.reduce((t, s) => t + Math.round(s.duration_s * edl.fps), 0);
        return { durationInFrames: Math.max(1, frames), fps: edl.fps, width: edl.width, height: edl.height };
      }}
    />
    <Composition
      id="Card"
      component={Card}
      defaultProps={{ card: { template: "WAInbox", props: {} }, theme: sampleEdl.theme as Theme }}
      durationInFrames={96}
      fps={24}
      width={720}
      height={1280}
    />
    {/* Preview every b-roll template with the sample theme */}
    <Composition
      id="BrollGallery"
      component={BrollGallery}
      defaultProps={{ theme: sampleEdl.theme }}
      durationInFrames={8 * 4 * 25}
      fps={25}
      width={1920}
      height={1080}
    />
  </>
);
