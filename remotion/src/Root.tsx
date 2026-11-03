import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { sampleEdl } from "./sample-edl";
import type { EDL } from "./types";
import { BrollGallery } from "./BrollGallery";
import { renderBroll } from "./broll/registry";
import type { TemplateRef, Theme } from "./types";

/** Preview ONE b-roll card on its own, so cards can be built and reviewed individually. */
const Card: React.FC<{ card: TemplateRef; theme: Theme }> = ({ card, theme }) => <>{renderBroll(card, theme)}</>;

// The EDL is passed as input props: --props=../projects/<slug>/06_edit/edl.json
// Duration, size and fps are derived from it, so the EDL is the single source of truth.
export const RemotionRoot: React.FC = () => (
  <>
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
