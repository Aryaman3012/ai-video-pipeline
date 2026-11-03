// Beat 04 (under): the empty slot multiplies into a month. Clinics × 30 days; rows build in as he
// says "your entire chain", then cells fill day by day in deepening amber while a counter races.
// 9:16 transposes it: clinics as columns, days as rows.
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { MONO, SANS, useCues, useLayout, usePalette } from "../../explainer/context";
import { clamp01, Illustrative, pop, ramp, rnd, tones, useClock } from "./kit";

type Props = { rows?: string[]; days?: number; counter_label?: string; counter_to?: number; illustrative?: boolean };

export const MissedMonthHeatmap: React.FC<Props> = ({
  rows = ["Jumeirah", "Al Barsha", "Dubai Marina", "Business Bay", "Mirdif", "Sharjah", "Abu Dhabi", "Al Ain"],
  days = 30,
  counter_label = "Missed booking opportunities · this month",
  counter_to = 960,
  illustrative = true,
}) => {
  const { frame, fps, t } = useClock();
  const cue = useCues();
  const C = usePalette();
  const T = tones(C);
  const { width: W, height: H, vertical, u } = useLayout();

  const tGrid = cue("grid", 1.8);
  const tChain = cue("chain", 4.3);
  const tFill = cue("fill", 4.8);
  const tTotal = cue("total", 5.9);

  const gridIn = ramp(t, tGrid - 0.1, 0.4);
  // rows build in between "booking" and "chain"
  const rowAt = (r: number) => tGrid + 0.15 + (r / Math.max(1, rows.length - 1)) * (tChain - tGrid - 0.3);
  const fillP = interpolate(t, [tFill, tTotal], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const daysFilled = fillP * days;
  const value = (r: number, d: number) => 0.25 + 0.75 * rnd(r * 31 + d, 7); // how many missed that day, 0–1
  // the counter is the sum of the filled cells, scaled to land exactly on counter_to
  const total = rows.reduce((a, _, r) => a + Array.from({ length: days }).reduce<number>((b, __, d) => b + value(r, d), 0), 0);
  let sum = 0;
  rows.forEach((_, r) => {
    for (let d = 0; d < days; d++) sum += value(r, d) * clamp01(daysFilled - d);
  });
  const count = Math.round((sum / total) * counter_to);
  const landed = pop(frame, fps, tTotal, 8);

  const cellColor = (r: number, d: number) => {
    const f = clamp01((daysFilled - d) * 1.4);
    if (f <= 0) return null;
    const v = value(r, d) * (0.55 + 0.45 * (d / days)); // deepens through the month
    // low → a dim amber on navy, high → bright amber
    const c = v < 0.5
      ? `color-mix(in srgb, ${C.pending} ${Math.round(30 + 120 * v)}%, ${C.nightLine})`
      : `color-mix(in srgb, ${T.amber} ${Math.round((v - 0.5) * 200)}%, ${C.pending})`;
    return { c, f, hot: v > 0.7 };
  };

  // ---- geometry ----
  const nR = rows.length;
  let gx: number, gy: number, cw: number, ch: number, gap: number, labelW: number;
  if (!vertical) {
    labelW = 210 * u;
    gx = 430 * u + labelW; // keeps the bottom-left pip corner clear
    gy = 360 * u;
    gap = 6 * u;
    cw = (W - 90 * u - gx) / days;
    ch = (840 * u - gy) / nR;
  } else {
    labelW = 0;
    gx = 130 * u;
    gy = 860 * u; // below the caption band
    gap = 5 * u;
    cw = (W - 50 * u - gx) / nR;
    ch = (1850 * u - gy) / days;
  }

  return (
    <AbsoluteFill style={{ background: C.night, fontFamily: SANS, color: "#fff", opacity: gridIn }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 70% 55%, color-mix(in srgb, ${C.pending} ${Math.round(16 * fillP)}%, transparent) 0%, transparent 60%)` }} />

      {/* counter */}
      <div style={{ position: "absolute", left: (vertical ? 60 : 80) * u, top: (vertical ? 400 : 72) * u, display: "grid", gap: 8 * u }}>
        <div style={{ fontSize: (vertical ? 26 : 24) * u, fontWeight: 700, letterSpacing: "0.1em", color: T.amber, textTransform: "uppercase", maxWidth: (vertical ? 980 : 1100) * u }}>{counter_label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 22 * u }}>
          <span style={{ fontFamily: MONO, fontSize: (vertical ? 150 : 140) * u, lineHeight: 1, color: count > 0 ? "#fff" : T.faint, transform: `scale(${1 + 0.06 * Math.sin(landed * Math.PI)})`, transformOrigin: "left center", minWidth: 330 * u }}>
            {count.toLocaleString("en-US")}
          </span>
          {illustrative && <Illustrative dark size={18} style={{ opacity: ramp(t, tGrid + 0.3, 0.4) }} />}
        </div>
      </div>

      {/* day header */}
      {Array.from({ length: days }).map((_, d) => {
        const show = d === 0 || (d + 1) % 5 === 0;
        if (!show) return null;
        const style: React.CSSProperties = vertical
          ? { left: gx - 16 * u, top: gy + d * ch + ch / 2, transform: "translate(-100%,-50%)" }
          : { left: gx + d * cw + cw / 2, top: gy - 18 * u, transform: "translate(-50%,-100%)" };
        return <div key={d} style={{ position: "absolute", ...style, fontFamily: MONO, fontSize: 19 * u, color: daysFilled > d ? T.amber : T.faint }}>{d + 1}</div>;
      })}
      <div style={{ position: "absolute", ...(vertical ? { left: 40 * u, top: gy - 50 * u } : { left: gx - 22 * u, top: gy - 40 * u, transform: "translateX(-100%)" }), fontSize: 18 * u, fontWeight: 700, letterSpacing: "0.12em", color: T.faint }}>DAY</div>

      {rows.map((name, r) => {
        const rp = pop(frame, fps, rowAt(r), 8);
        if (rp <= 0.001) return null;
        return (
          <React.Fragment key={name}>
            {/* clinic label */}
            <div
              style={{
                position: "absolute", whiteSpace: vertical ? "normal" : "nowrap", fontSize: (vertical ? 21 : 24) * u, fontWeight: 600, color: "#fff", opacity: rp, lineHeight: 1.1,
                ...(vertical
                  ? { left: gx + r * cw + cw / 2, top: gy - 30 * u, transform: `translate(-50%,-100%) translateY(${(1 - rp) * 10 * u}px)`, width: cw - 4 * u, textAlign: "center" }
                  : { left: gx - 22 * u, top: gy + r * ch + ch / 2, transform: `translate(-100%,-50%) translateX(${(1 - rp) * -14 * u}px)`, textAlign: "right" }),
              }}
            >
              {name}
            </div>
            {Array.from({ length: days }).map((_, d) => {
              const x = vertical ? gx + r * cw : gx + d * cw;
              const y = vertical ? gy + d * ch : gy + r * ch;
              const cc = cellColor(r, d);
              const cellIn = clamp01(rp * 2 - (d / days) * 0.8);
              return (
                <div key={d} style={{ position: "absolute", left: x + gap / 2, top: y + gap / 2, width: cw - gap, height: ch - gap, borderRadius: 5 * u, background: "rgba(255,255,255,0.06)", opacity: cellIn }}>
                  {cc && <div style={{ position: "absolute", inset: 0, borderRadius: 5 * u, background: cc.c, opacity: cc.f, transform: `scale(${0.6 + 0.4 * cc.f})`, boxShadow: cc.hot ? `0 0 ${10 * u}px color-mix(in srgb, ${C.pending} 50%, transparent)` : undefined }} />}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}

      {/* "today" sweep */}
      {fillP > 0 && fillP < 1 && (
        <div style={{ position: "absolute", background: T.amber, boxShadow: `0 0 ${16 * u}px ${T.amber}`, borderRadius: 4 * u, ...(vertical ? { left: gx - 8 * u, width: cw * nR + 16 * u, top: gy + daysFilled * ch - 2 * u, height: 4 * u } : { top: gy - 8 * u, height: ch * nR + 16 * u, left: gx + daysFilled * cw - 2 * u, width: 4 * u }) }} />
      )}
    </AbsoluteFill>
  );
};
