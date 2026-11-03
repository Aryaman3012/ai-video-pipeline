// Shared lead-funnel rig for LeakyFunnel (beat 06) and SealedFunnel (beat 07).
// Everything is laid out in design px inside a box that the scene scales by `u`.
import React from "react";
import { SANS, usePalette } from "../../explainer/context";
import { BrandMark, clamp01, lerp, rnd, tones } from "./kit";

export const BW = 1120;
export const CX = 560;
export const MOUTH_HALF = 300;
export const NECK_HALF = 34;

export type Geo = { tapY: number; spoutY: number; mouthY: number; neckY: number; neckEnd: number; baseY: number };
export const geometry = (stream: number, depth: number): Geo => {
  const tapY = 40;
  const spoutY = tapY + 62;
  const mouthY = spoutY + stream;
  const neckY = mouthY + depth;
  const neckEnd = neckY + 64;
  return { tapY, spoutY, mouthY, neckY, neckEnd, baseY: neckEnd + 22 };
};

export type Gap = { s: number; side: -1 | 1; label: string };
export const GAP_LEN = 0.11;
export const gapsFor = (labels: string[]): Gap[] =>
  labels.slice(0, 3).map((label, i) => ({ s: [0.2, 0.42, 0.66][i], side: (i % 2 === 0 ? -1 : 1) as -1 | 1, label }));

export const halfAt = (s: number) => lerp(MOUTH_HALF, NECK_HALF, s);
export const wallPt = (g: Geo, s: number, side: -1 | 1) => ({ x: CX + side * halfAt(s), y: g.mouthY + (g.neckY - g.mouthY) * s });

// ---- deterministic dot simulation ----
export type Dot = { te: number; j: number; gap: number }; // gap = index of the gap it leaks through, -1 = makes it down
const T_STREAM = 0.26;
const T_FUNNEL = 0.8;
const T_NECK = 0.14;
const T_LEAK = 0.75;
export const T_ARRIVE = T_STREAM + T_FUNNEL + T_NECK;

/** rate(t) in dots/s; pLeak(te) chance a dot emitted at te heads for a gap. */
export const emit = (rate: (t: number) => number, pLeak: (te: number) => number, nGaps: number, from: number, to: number): Dot[] => {
  const dots: Dot[] = [];
  let t = from;
  let i = 0;
  while (t < to) {
    const leak = rnd(i, 3) < pLeak(t);
    const gap = leak ? Math.floor(rnd(i, 5) * nGaps) : -1;
    dots.push({ te: t, j: rnd(i, 9) * 2 - 1, gap });
    t += (0.75 + 0.5 * rnd(i, 11)) / rate(t);
    i++;
  }
  return dots;
};

export type DotState = { x: number; y: number; o: number; leaking: boolean; inside: boolean } | null;

/** Where a dot is at time t. `sealedAt(gap)` = when that gap gets patched (Infinity if never). */
export const dotAt = (d: Dot, t: number, g: Geo, gaps: Gap[], streamHalf: (te: number) => number, sealedAt: (gap: number) => number): DotState => {
  const age = t - d.te;
  if (age < 0) return null;
  if (age < T_STREAM) {
    const p = age / T_STREAM;
    return { x: CX + d.j * streamHalf(d.te), y: lerp(g.spoutY, g.mouthY, p * p * 0.6 + p * 0.4), o: 1, leaking: false, inside: false };
  }
  const a = (age - T_STREAM) / T_FUNNEL; // 0..1 through the funnel
  const gp = d.gap >= 0 ? gaps[d.gap] : null;
  const leakT = gp ? d.te + T_STREAM + gp.s * T_FUNNEL : Infinity;
  const leaks = gp !== null && leakT < sealedAt(d.gap);
  // leaking dots drift to their wall's side
  const lane = gp ? gp.side * (0.55 + 0.4 * Math.abs(d.j)) : d.j * 0.75;
  if (leaks && gp && a >= gp.s) {
    const tau = (age - T_STREAM - gp.s * T_FUNNEL) / T_LEAK;
    if (tau > 1) return null;
    const w = wallPt(g, gp.s, gp.side);
    return { x: w.x + gp.side * (200 * tau + 20 * Math.abs(d.j)), y: w.y + 30 * tau + 200 * tau * tau, o: 1 - tau * tau * tau, leaking: true, inside: false };
  }
  if (a < 1) {
    const y = g.mouthY + (g.neckY - g.mouthY) * a;
    return { x: CX + lane * halfAt(a) * 0.82, y, o: 1, leaking: false, inside: true };
  }
  const n = (age - T_STREAM - T_FUNNEL) / T_NECK;
  if (n < 1) return { x: CX + lane * NECK_HALF * 0.5 * (1 - n), y: lerp(g.neckY, g.neckEnd, n), o: 1, leaking: false, inside: true };
  return null; // arrived
};

export const arrivedBetween = (dots: Dot[], gaps: Gap[], sealedAt: (gap: number) => number, a: number, b: number) =>
  dots.filter((d) => {
    const ta = d.te + T_ARRIVE;
    if (ta < a || ta > b) return false;
    if (d.gap < 0) return true;
    const leakT = d.te + T_STREAM + gaps[d.gap].s * T_FUNNEL;
    return leakT >= sealedAt(d.gap);
  }).length;

// ---- drawing ----

export const FunnelBody: React.FC<{ g: Geo; gaps: Gap[]; open: number; gapGlow: number[]; patched: number[] }> = ({ g, gaps, open, gapGlow, patched }) => {
  const C = usePalette();
  const T = tones(C);
  const wall = "rgba(255,255,255,0.78)";
  const segs = (side: -1 | 1) => {
    const cuts = gaps.filter((x) => x.side === side).map((x) => x.s).sort();
    const out: [number, number][] = [];
    let s0 = 0;
    cuts.forEach((c) => {
      out.push([s0, c - GAP_LEN / 2]);
      s0 = c + GAP_LEN / 2;
    });
    out.push([s0, 1]);
    return out;
  };
  const L = Math.hypot(MOUTH_HALF - NECK_HALF, g.neckY - g.mouthY);
  const ang = (Math.atan2(g.neckY - g.mouthY, MOUTH_HALF - NECK_HALF) * 180) / Math.PI;
  const spoutHalf = 18 + 12 * open;
  return (
    <svg width={BW} height={g.baseY + 260} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="fun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.03" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.10" />
        </linearGradient>
      </defs>
      {/* tap: pipe from the left, valve, spout */}
      <rect x={250} y={g.tapY - 17} width={CX - 250 + 22} height={34} rx={8} fill={T.navyRaised} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
      <rect x={CX - 26} y={g.tapY - 17} width={52} height={g.spoutY - g.tapY + 17} rx={10} fill={T.navyRaised} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
      <rect x={CX - spoutHalf} y={g.spoutY - 8} width={spoutHalf * 2} height={10} rx={4} fill="rgba(255,255,255,0.55)" />
      <g transform={`translate(400 ${g.tapY - 17}) rotate(${open * 90})`}>
        <rect x={-46} y={-7} width={92} height={14} rx={7} fill="rgba(255,255,255,0.75)" />
        <circle r={13} fill={T.navyRaised} stroke="rgba(255,255,255,0.75)" strokeWidth={4} />
      </g>
      {/* funnel */}
      <path d={`M ${CX - MOUTH_HALF} ${g.mouthY} L ${CX + MOUTH_HALF} ${g.mouthY} L ${CX + NECK_HALF} ${g.neckY} L ${CX + NECK_HALF} ${g.neckEnd} L ${CX - NECK_HALF} ${g.neckEnd} L ${CX - NECK_HALF} ${g.neckY} Z`} fill="url(#fun)" />
      {([-1, 1] as const).map((side) =>
        segs(side).map(([a, b], i) => {
          const p = wallPt(g, a, side);
          const q = wallPt(g, b, side);
          return <line key={`${side}${i}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={wall} strokeWidth={7} strokeLinecap="round" />;
        }),
      )}
      <line x1={CX - NECK_HALF} y1={g.neckY} x2={CX - NECK_HALF} y2={g.neckEnd} stroke={wall} strokeWidth={7} strokeLinecap="round" />
      <line x1={CX + NECK_HALF} y1={g.neckY} x2={CX + NECK_HALF} y2={g.neckEnd} stroke={wall} strokeWidth={7} strokeLinecap="round" />
      <ellipse cx={CX} cy={g.mouthY} rx={MOUTH_HALF} ry={16} fill="none" stroke={wall} strokeWidth={4} opacity={0.6} />
      {/* gaps: amber glow while open, teal patch when sealed */}
      {gaps.map((gp, i) => {
        const w = wallPt(g, gp.s, gp.side);
        const rot = gp.side === -1 ? ang : -ang;
        const pt = clamp01(patched[i] ?? 0);
        return (
          <g key={i} transform={`translate(${w.x} ${w.y}) rotate(${rot})`}>
            <rect x={-(GAP_LEN * L) / 2 - 10} y={-16} width={GAP_LEN * L + 20} height={32} rx={16} fill={T.amber} opacity={(0.1 + 0.22 * (gapGlow[i] ?? 0)) * (1 - pt)} />
            <circle cx={-(GAP_LEN * L) / 2} r={6} fill={T.amber} opacity={1 - pt} />
            <circle cx={(GAP_LEN * L) / 2} r={6} fill={T.amber} opacity={1 - pt} />
            {pt > 0 && (
              <rect x={(-(GAP_LEN * L) / 2 - 14) * pt} y={-13} width={(GAP_LEN * L + 28) * pt} height={26} rx={13} fill={T.teal} stroke="#fff" strokeWidth={2.5} opacity={Math.min(1, pt * 2)} />
            )}
          </g>
        );
      })}
    </svg>
  );
};

/** Pill label next to a gap, outside the wall. */
export const GapLabel: React.FC<{ g: Geo; gap: Gap; children: React.ReactNode; p: number; style?: React.CSSProperties }> = ({ g, gap, children, p, style }) => {
  const w = wallPt(g, gap.s, gap.side);
  const x = w.x + gap.side * 46;
  return (
    <div
      style={{
        position: "absolute", left: x, top: w.y, transform: `translate(${gap.side === -1 ? "-100%" : "0"}, -50%) translateX(${gap.side * (1 - p) * 20}px)`, opacity: p,
        whiteSpace: "nowrap", fontFamily: SANS, ...style,
      }}
    >
      {children}
    </div>
  );
};

export const PatchLabel: React.FC = () => {
  const C = usePalette();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.money, color: "#fff", fontWeight: 700, fontSize: 28, borderRadius: 14, padding: "8px 18px 8px 10px", boxShadow: "0 10px 26px -10px rgba(0,0,0,0.5)" }}>
      <span style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.16)", display: "grid", placeItems: "center" }}><BrandMark size={24} light /></span>
      HeyAnaya
    </span>
  );
};

export const Dots: React.FC<{ states: { s: NonNullable<DotState>; teal: boolean }[]; r?: number }> = ({ states, r = 10 }) => {
  const C = usePalette();
  const T = tones(C);
  return (
    <svg width={BW} height={2000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {states.map(({ s, teal }, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={r} fill={s.leaking ? T.amber : teal ? T.teal : "#fff"} opacity={s.o * (s.leaking ? 0.95 : 0.92)} />
      ))}
    </svg>
  );
};
