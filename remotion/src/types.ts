// Mirrors schemas/edl.schema.json — keep in sync.

export type Transition = "cut" | "fade" | "slide" | "wipe" | "match-cut";

export type Theme = {
  colors: { background: string; primary: string; accent: string; text: string; muted?: string };
  fonts: { heading: string; body: string };
  motion?: {
    damping?: number;
    stiffness?: number;
    entrance_frames?: number;
    exit_frames?: number;
    stagger_frames?: number;
    overshoot_clamp?: boolean;
    preset?: "snappy" | "pop" | "bouncy" | "elegant" | "premium";
  };
  /** Unification pass: one grain layer over footage AND graphics, sub-pixel soften on clips. */
  unify?: { grain_opacity?: number; clip_blur_px?: number };
};

export type TemplateRef = { template: string; props: Record<string, unknown> };

export type Overlay = TemplateRef & { from_s: number; to_s: number };

export type Segment = {
  scene_id: string;
  kind: "clip" | "broll";
  duration_s: number;
  src?: string;
  in_s?: number;
  playback_rate?: number;
  /** Play the clip's own audio instead of muting it (models that generate speech). */
  clip_audio?: boolean;
  clip_volume?: number;
  grade?: { brightness?: number; contrast?: number; saturate?: number };
  broll?: TemplateRef;
  transition_in?: Transition;
  transition_frames?: number;
  overlays?: Overlay[];
};

export type AudioTrack = {
  role: "vo" | "music" | "sfx";
  src: string;
  start_s?: number;
  volume?: number;
  duck_under_vo?: number;
};

export type EDL = {
  slug: string;
  version: number;
  fps: 24 | 25 | 30;
  width: number;
  height: number;
  theme: Theme;
  segments: Segment[];
  audio?: AudioTrack[];
};

export type TemplateProps<P> = P & { theme: Theme };
