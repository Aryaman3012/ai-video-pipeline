export const FPS = 24;

// How the host plate is framed. full = edge to edge, split = host panel with
// graphics beside (16:9) or below (9:16), pip = small circle over full-screen graphics.
export type HostMode = 'full' | 'split' | 'pip';
export type SceneKind = 'hook' | 'map' | 'journey' | 'counter' | 'solution' | 'network' | 'close';

export type Beat = {
  id: string; // public/clips/<id>.mp4
  dur: number; // seconds, matches the trimmed clip
  scene: SceneKind;
  // [seconds, mode] keyframes; the host springs between modes. `from` animates in at 0.
  host: [number, HostMode][];
  from?: HostMode;
  push?: number; // slow zoom creep over the beat (full mode only), e.g. 0.12
  warm?: boolean; // solution/close grade
  captions?: boolean;
};

// Word cues (seconds into each trimmed clip) from Whisper, see src/data/captions.ts.
export const CUE = {
  b01: {unanswered: 0.64, whatsapp: 1.28, enquiries: 1.6, deal: 3.32, multiply: 4.56, locations: 6.68},
  b02: {first: 1.2, another: 2.98, second: 3.8, more: 5.2, rest: 6.1},
  b03: {patient: 1.98, paid: 2.66, never: 4.3, booking: 5.72},
  b04: {imagine: 0.42, opportunities: 2.26, chain: 4.38, missing: 5.62, month: 6.58},
  b05: {anaya: 0.26, leads: 1.74, instantly: 2.0, preferred: 3.54, crafts: 4.52, convert: 5.48, schedules: 6.62, appointments: 7.28},
  b06: {growing: 0.5, isnt: 1.88, generating: 3.78, leads: 4.88},
  b07: {turning: 0.76, leads: 2.18, already: 2.56, bookings: 4.18},
};

export const BEATS: Beat[] = [
  {id: '01', dur: 7.4, scene: 'hook', host: [[0, 'full'], [1.15, 'split'], [4.45, 'pip']], push: 0.06, captions: true},
  {id: '02', dur: 7.16, scene: 'map', host: [[0, 'pip']], captions: true},
  {id: '03', dur: 6.1, scene: 'journey', host: [[0, 'split']], from: 'pip', captions: true},
  {id: '04', dur: 6.8, scene: 'counter', host: [[0, 'full'], [4.3, 'pip']], push: 0.14, captions: true},
  {id: '05', dur: 7.9, scene: 'solution', host: [[0, 'full'], [1.45, 'split']], warm: true, captions: true},
  {id: '06', dur: 5.5, scene: 'network', host: [[0, 'pip']], from: 'split', warm: true, captions: true},
  {id: '07', dur: 4.7, scene: 'close', host: [[0, 'split']], from: 'pip', warm: true, captions: false},
];

export const END_CARD_SEC = 3.2;

export const f = (sec: number) => Math.round(sec * FPS);
// floor so a beat never runs past the end of its trimmed clip
export const beatFrames = (b: Beat) => Math.floor(b.dur * FPS);

export const BEAT_STARTS: number[] = BEATS.reduce<number[]>((acc, b, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + beatFrames(BEATS[i - 1]));
  return acc;
}, []);

export const TALK_FRAMES = BEAT_STARTS[BEATS.length - 1] + beatFrames(BEATS[BEATS.length - 1]);
export const TOTAL_FRAMES = TALK_FRAMES + f(END_CARD_SEC);
