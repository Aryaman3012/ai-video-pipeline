// Mirrors schemas/timeline.schema.json. tools/build-timeline.mjs writes it from the
// storyboard + ingest; every time below is already resolved from spoken words to seconds.

export type HostMode = "full" | "split" | "pip";
export type Layer = "under" | "beside" | "over";

export type Word = { w: string; s: number; e: number; k?: "pos" | "neg" };

export type SceneRef = {
  name: string; // a key of SCENES in registry.tsx
  layer: Layer; // under = full screen beneath the host (shows while he is pip), beside = split panel, over = on top
  props?: Record<string, unknown>;
  cues?: Record<string, number>; // seconds into the beat's trimmed clip
};

export type Beat = {
  id: string;
  src: string; // relative to remotion/public
  dur: number; // seconds, ≤ the trimmed clip
  host: [number, HostMode][]; // [seconds, mode] keyframes, the host springs between modes
  from?: HostMode; // animate in from this mode at 0
  push?: number; // slow zoom creep while full, e.g. 0.12
  grade?: "cool" | "warm" | "neutral";
  framing?: { face_x: number; face_y: number; body_y: number }; // per-beat override (e.g. a guest elsewhere in frame)
  captions?: Word[][]; // chunks of 2–4 words; omit for no captions on this beat
  scenes: SceneRef[];
};

export type Brand = {
  name: string;
  logo_light?: string; // relative to remotion/public, for dark grounds
  logo_dark?: string; // for light grounds
};

export type Timeline = {
  slug: string;
  version: number;
  fps: number;
  source: { w: number; h: number }; // trimmed clip picture size (after crop)
  framing: { face_x: number; face_y: number; body_y: number }; // host position in the source, 0–1
  palette?: Partial<Palette>;
  brand: Brand;
  end_card?: { seconds: number; headline: string; cta: string; url?: string; background?: SceneRef };
  music?: { src: string; volume?: number };
  captions?: { landscape: boolean; vertical: boolean };
  beats: Beat[];
};

export type Palette = {
  paper: string; raised: string; sunken: string;
  ink: string; ink2: string; ink3: string; line: string; lineStrong: string; black: string;
  money: string; moneyWash: string; alert: string; alertWash: string; pending: string;
  night: string; nightLine: string; waBg: string; waOut: string; waHeader: string;
};
