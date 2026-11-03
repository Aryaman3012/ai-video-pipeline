// Beat 02 (under): a dark, stylised UAE coast. Pins drop as he counts clinics, each with a
// "No reply" bubble pulsing amber; the rest ripple in; on "network" teal lines join them.
// Layout keeps the pip corner (16:9 bottom-left, 9:16 top-right) and the caption bands clear.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { MONO, SANS, useCues, useLayout, usePalette } from "../../explainer/context";
import { bounce, clamp01, pop, ramp, tones, useClock } from "./kit";

type Pin = { name: string; order?: "first" | "second" };
type Props = { pins?: Pin[]; bubble?: string };

type XY = [number, number];
// Stylised (not survey-accurate) positions, normalised to the frame. Sea is top-left of the coast.
const POS_H: Record<string, XY> = {
  Jumeirah: [0.585, 0.335], "Al Barsha": [0.515, 0.585], "Dubai Marina": [0.435, 0.43], "Business Bay": [0.665, 0.5],
  Mirdif: [0.79, 0.43], Sharjah: [0.76, 0.215], "Abu Dhabi": [0.235, 0.575], "Al Ain": [0.905, 0.74],
};
const COAST_H: XY[] = [[-0.02, 0.72], [0.1, 0.665], [0.235, 0.6], [0.33, 0.52], [0.435, 0.445], [0.52, 0.39], [0.585, 0.35], [0.67, 0.29], [0.76, 0.235], [0.85, 0.16], [0.92, 0.06], [0.95, -0.02]];
const POS_V: Record<string, XY> = {
  Jumeirah: [0.5, 0.525], "Al Barsha": [0.42, 0.705], "Dubai Marina": [0.3, 0.615], "Business Bay": [0.66, 0.635],
  Mirdif: [0.85, 0.565], Sharjah: [0.74, 0.452], "Abu Dhabi": [0.15, 0.805], "Al Ain": [0.74, 0.86],
};
const COAST_V: XY[] = [[-0.02, 0.86], [0.08, 0.83], [0.15, 0.815], [0.24, 0.7], [0.3, 0.625], [0.4, 0.57], [0.5, 0.535], [0.62, 0.49], [0.74, 0.46], [0.86, 0.41], [0.96, 0.37], [1.02, 0.35]];
// network edges by pin name
const EDGES: [string, string][] = [
  ["Abu Dhabi", "Dubai Marina"], ["Dubai Marina", "Al Barsha"], ["Dubai Marina", "Jumeirah"], ["Al Barsha", "Business Bay"],
  ["Jumeirah", "Business Bay"], ["Jumeirah", "Sharjah"], ["Business Bay", "Mirdif"], ["Sharjah", "Mirdif"], ["Mirdif", "Al Ain"], ["Abu Dhabi", "Al Ain"],
];

const smooth = (pts: XY[], W: number, H: number) => {
  const p = pts.map(([x, y]) => [x * W, y * H]);
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 1; i < p.length; i++) {
    const [x0, y0] = p[i - 1];
    const [x1, y1] = p[i];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    d += ` Q ${x0} ${y0} ${mx} ${my}`;
  }
  const last = p[p.length - 1];
  return d + ` L ${last[0]} ${last[1]}`;
};

export const ClinicNetworkMap: React.FC<Props> = ({ pins = Object.keys(POS_H).map((n, i) => ({ name: n, order: i === 0 ? "first" : i === 1 ? "second" : undefined })), bubble = "No reply" }) => {
  const { frame, fps, t } = useClock();
  const cue = useCues();
  const C = usePalette();
  const T = tones(C);
  const { width: W, height: H, vertical, u } = useLayout();
  const POS = vertical ? POS_V : POS_H;
  const COAST = vertical ? COAST_V : COAST_H;

  const tMap = cue("map", 0);
  const tFirst = cue("first", 1.15);
  const tSecond = cue("second", 3.7);
  const tRest = cue("rest", 6.0);
  const tNet = cue("network", 6.6);

  const first = pins.find((p) => p.order === "first") ?? pins[0];
  const second = pins.find((p) => p.order === "second") ?? pins[1];
  const rest = pins.filter((p) => p !== first && p !== second);
  const dropAt = (p: Pin) => (p === first ? tFirst : p === second ? tSecond : tRest + rest.indexOf(p) * (2 / fps));

  const mapIn = ramp(t, tMap, 0.6);
  const drift = 1.04 - 0.04 * clamp01(t / 7);
  const xy = (n: string): XY => {
    const p = POS[n] ?? [0.5, 0.5];
    return [p[0] * W, p[1] * H];
  };
  const count = pins.filter((p) => t >= dropAt(p)).length;
  const net = ramp(t, tNet, 0.55);
  const countIn = pop(frame, fps, tFirst, 8);

  // land polygon: coast + the bottom-right corner
  const coast = smooth(COAST, W, H);
  const land = `${coast} L ${W * 1.05} ${H * 1.05} L ${-W * 0.05} ${H * 1.05} Z`;

  return (
    <AbsoluteFill style={{ background: C.night, fontFamily: SANS, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${drift})`, opacity: 0.4 + 0.6 * mapIn }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <pattern id="dots" width={22 * u} height={22 * u} patternUnits="userSpaceOnUse">
              <circle cx={11 * u} cy={11 * u} r={1.6 * u} fill="rgba(255,255,255,0.07)" />
            </pattern>
            <radialGradient id="vign" cx="0.55" cy="0.45" r="0.75">
              <stop offset="0.6" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.45" />
            </radialGradient>
          </defs>
          {/* sea grid */}
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={`g${i}`} x1={0} x2={W} y1={(i / 13) * H} y2={(i / 13) * H} stroke="rgba(255,255,255,0.025)" strokeWidth={1.2 * u} />
          ))}
          <path d={land} fill={C.nightLine} />
          <path d={land} fill="url(#dots)" />
          {/* faint inland roads */}
          <path d={`M ${xy("Abu Dhabi")[0]} ${xy("Abu Dhabi")[1]} Q ${W * (vertical ? 0.4 : 0.55)} ${H * (vertical ? 0.86 : 0.72)} ${xy("Al Ain")[0]} ${xy("Al Ain")[1]}`} stroke="rgba(255,255,255,0.06)" strokeWidth={3 * u} fill="none" />
          <path d={`M ${xy("Dubai Marina")[0]} ${xy("Dubai Marina")[1]} Q ${xy("Business Bay")[0]} ${xy("Business Bay")[1] + 60 * u} ${xy("Al Ain")[0]} ${xy("Al Ain")[1]}`} stroke="rgba(255,255,255,0.05)" strokeWidth={3 * u} fill="none" />
          <path d={coast} stroke={`color-mix(in srgb, ${C.money} 40%, transparent)`} strokeWidth={2.4 * u} fill="none" />
          <path d={coast} stroke={`color-mix(in srgb, ${C.money} 12%, transparent)`} strokeWidth={14 * u} fill="none" />
          <rect width={W} height={H} fill="url(#vign)" />
          {/* network lines */}
          {EDGES.map(([a, b], i) => {
            const p = clamp01(net * 1.6 - i * 0.06);
            if (p <= 0) return null;
            const [x1, y1] = xy(a);
            const [x2, y2] = xy(b);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={T.teal} strokeOpacity={0.25} strokeWidth={9 * u} strokeLinecap="round" />
                <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={T.teal} strokeWidth={2.6 * u} strokeLinecap="round" />
              </g>
            );
          })}
        </svg>
        {/* sea / place labels */}
        <div style={{ position: "absolute", left: W * (vertical ? 0.08 : 0.16), top: H * (vertical ? 0.43 : 0.22), color: "rgba(255,255,255,0.16)", fontSize: (vertical ? 30 : 26) * u, fontWeight: 600, letterSpacing: "0.4em", fontStyle: "italic" }}>ARABIAN GULF</div>
        <div style={{ position: "absolute", left: W * (vertical ? 0.36 : 0.62), top: H * (vertical ? 0.93 : 0.82), color: "rgba(255,255,255,0.13)", fontSize: 22 * u, fontWeight: 600, letterSpacing: "0.5em" }}>UNITED ARAB EMIRATES</div>

        {/* every branch is already on the map, dim — the count lights them up */}
        {pins.map((p) => {
          const [x, y] = xy(p.name);
          const lit = t >= dropAt(p) - 0.05;
          return lit ? null : (
            <div key={`ghost${p.name}`} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", width: 14 * u, height: 14 * u, borderRadius: 99, background: "rgba(255,255,255,0.28)", boxShadow: `0 0 0 ${5 * u}px rgba(255,255,255,0.06)`, opacity: mapIn }} />
          );
        })}
        {pins.map((p) => {
          const [x, y] = xy(p.name);
          const ta = dropAt(p);
          const drop = bounce(frame, fps, ta);
          if (drop <= 0.001) return null;
          const fall = interpolate(pop(frame, fps, ta, 7), [0, 1], [-60 * u, 0]);
          const bub = pop(frame, fps, ta + 0.12, 8);
          const pulse = ((t - ta) * 1.1) % 1;
          const pinColor = T.amber; // still leaking — the lines join them, they don't fix them
          return (
            <div key={p.name} style={{ position: "absolute", left: x, top: y }}>
              {/* pulse ring */}
              <div style={{ position: "absolute", left: 0, top: 0, width: (34 + pulse * 64) * u, height: (34 + pulse * 64) * u, transform: "translate(-50%,-50%)", borderRadius: 999, border: `${2 * u}px solid ${T.amber}`, opacity: 0.6 * (1 - pulse) * drop }} />
              <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(-50%,-50%) translateY(${fall}px) scale(${drop})` }}>
                <div style={{ width: 22 * u, height: 22 * u, borderRadius: 999, background: pinColor, border: `${4 * u}px solid ${C.night}`, boxShadow: `0 0 0 ${2 * u}px ${pinColor}, 0 0 ${26 * u}px ${pinColor}` }} />
              </div>
              {/* name */}
              <div style={{ position: "absolute", left: 0, top: 22 * u, transform: "translateX(-50%)", whiteSpace: "nowrap", color: "#fff", fontSize: 23 * u, fontWeight: 600, opacity: drop, textShadow: `0 2px ${8 * u}px ${C.night}` }}>{p.name}</div>
              {/* "No reply" bubble */}
              <div style={{ position: "absolute", left: 0, top: -24 * u, transform: `translate(-50%, -100%) scale(${0.7 + 0.3 * bub})`, transformOrigin: "50% 100%", opacity: bub }}>
                <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 * u, background: T.navyRaised, border: `${1.5 * u}px solid color-mix(in srgb, ${C.pending} ${Math.round(35 + 45 * (1 - pulse))}%, transparent)`, color: T.mist, borderRadius: 12 * u, padding: `${6 * u}px ${12 * u}px`, fontSize: 19 * u, fontWeight: 600, whiteSpace: "nowrap" }}>
                  <span style={{ width: 10 * u, height: 10 * u, borderRadius: 99, background: T.amber, opacity: 0.55 + 0.45 * Math.cos(pulse * Math.PI * 2) }} />
                  {bubble}
                  <div style={{ position: "absolute", left: "50%", bottom: -7 * u, width: 12 * u, height: 12 * u, background: T.navyRaised, transform: "translateX(-50%) rotate(45deg)", borderRight: `${1.5 * u}px solid color-mix(in srgb, ${C.pending} 40%, transparent)`, borderBottom: `${1.5 * u}px solid color-mix(in srgb, ${C.pending} 40%, transparent)` }} />
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* count — top-left, clear of the pip corner in both aspects */}
      <div style={{ position: "absolute", left: (vertical ? 64 : 72) * u, top: (vertical ? 400 : 64) * u, opacity: mapIn, display: "grid", gap: 6 * u }}>
        <div style={{ fontSize: (vertical ? 26 : 22) * u, fontWeight: 700, letterSpacing: "0.12em", color: T.amber }}>{net > 0.5 ? "ONE NETWORK, LEAKING" : "UNANSWERED ENQUIRIES"}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 * u, opacity: countIn, transform: `translateY(${(1 - countIn) * 12 * u}px)` }}>
          <span style={{ fontFamily: MONO, fontSize: (vertical ? 120 : 92) * u, color: "#fff", lineHeight: 1 }}>{Math.max(1, count)}</span>
          <span style={{ fontSize: (vertical ? 40 : 34) * u, color: T.mist, fontWeight: 500 }}>{count <= 1 ? "clinic" : "clinics"}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
