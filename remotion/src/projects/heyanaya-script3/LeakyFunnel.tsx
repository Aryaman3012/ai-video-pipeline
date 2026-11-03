// Beat 06 (under): lead dots pour from the "Ad spend" tap into a funnel with gaps in its walls.
// On "more" the tap opens and the inflow doubles — but the extra mostly spills out through
// "No reply / After hours / Wrong language"; the Bookings tray barely rises. No numbers.
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { SANS, useCues, useLayout, usePalette } from "../../explainer/context";
import { bounce, clamp01, lerp, pop, ramp, tones, useClock } from "./kit";
import { arrivedBetween, BW, CX, Dots, dotAt, emit, FunnelBody, GapLabel, gapsFor, geometry } from "./funnel";

type Props = { tap_label?: string; inflow_label?: string; leaks?: string[]; tray_label?: string };

const R0 = 12;

export const LeakyFunnel: React.FC<Props> = ({ tap_label = "Ad spend", inflow_label = "Leads ×2", leaks = ["No reply", "After hours", "Wrong language"], tray_label = "Bookings" }) => {
  const { frame, fps, t } = useClock();
  const cue = useCues();
  const C = usePalette();
  const T = tones(C);
  const { width: W, vertical, u } = useLayout();

  const tFunnel = cue("funnel", 3.7);
  const tMore = cue("more", 4.45);
  const tSpill = cue("spill", 4.8);

  const g = vertical ? geometry(360, 640) : geometry(108, 430);
  const gaps = gapsFor(leaks);
  const open = ramp(t, tMore - 0.05, 0.35);
  const dots = useMemo(
    () => emit((x) => R0 * (1 + clamp01((x - tMore + 0.05) / 0.35)), (te) => (te < tMore ? 0.55 : 0.8), gaps.length, -3, 12),
    [tMore, gaps.length],
  );
  const never = () => Infinity;
  const states = dots.map((d) => ({ s: dotAt(d, t, g, gaps, (te) => (te < tMore ? 10 : 22), never), teal: false })).filter((x) => x.s) as { s: NonNullable<ReturnType<typeof dotAt>>; teal: boolean }[];
  // tray: barely rises
  const arrived = arrivedBetween(dots, gaps, never, tFunnel - 0.6, t);
  const level = clamp01(0.16 + arrived * 0.012);

  const labelsIn = (i: number) => pop(frame, fps, tFunnel + 0.15 + i * (3 / fps), 8);
  const spill = ramp(t, tSpill, 0.3);
  const leakPulse = (i: number) => 0.5 + 0.5 * Math.sin((t - i * 0.2) * 9) * spill;
  const more = bounce(frame, fps, tMore);

  const scale = (vertical ? 0.95 : 0.95) * u;
  const boxLeft = vertical ? (W - BW * scale) / 2 : 1090 * u - (BW * scale) / 2;
  const boxTop = (vertical ? 360 : 44) * u;

  return (
    <AbsoluteFill style={{ background: C.night, fontFamily: SANS, color: "#fff", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${vertical ? "50% 62%" : "58% 50%"}, color-mix(in srgb, ${C.money} 10%, transparent) 0%, transparent 55%)` }} />
      <div style={{ position: "absolute", left: boxLeft, top: boxTop, width: BW, height: g.baseY + 240, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
        <FunnelBody g={g} gaps={gaps} open={open} gapGlow={gaps.map((_, i) => leakPulse(i))} patched={[]} />
        <Dots states={states} />

        {/* tap label + inflow */}
        <div style={{ position: "absolute", left: 230, top: g.tapY, transform: "translate(-100%, -50%)", fontSize: 30, fontWeight: 700, letterSpacing: "0.06em", color: T.mist }}>{tap_label.toUpperCase()}</div>
        {more > 0.001 && (
          <div style={{ position: "absolute", left: CX + 70, top: g.spoutY - 4, opacity: Math.min(1, more * 1.4), transform: `scale(${0.7 + 0.3 * more})`, transformOrigin: "0 50%", background: "#fff", color: C.night, borderRadius: 14, padding: "8px 20px", fontSize: 34, fontWeight: 800 }}>
            {inflow_label}
          </div>
        )}

        {/* leak labels */}
        {gaps.map((gp, i) => (
          <GapLabel key={gp.label} g={g} gap={gp} p={labelsIn(i)}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, color: T.amber, fontSize: 30, fontWeight: 700, background: `color-mix(in srgb, ${C.pending} ${Math.round(14 + 14 * spill)}%, ${C.night})`, border: `2px solid color-mix(in srgb, ${C.pending} ${Math.round(40 + 40 * leakPulse(i) * spill)}%, transparent)`, borderRadius: 12, padding: "6px 16px" }}>
              {gp.side === 1 && <span style={{ fontSize: 26 }}>→</span>}
              {gp.label}
              {gp.side === -1 && <span style={{ fontSize: 26 }}>←</span>}
            </span>
          </GapLabel>
        ))}

        {/* bookings tray */}
        <div style={{ position: "absolute", left: CX - 300, top: g.baseY, width: 600 }}>
          <div style={{ position: "relative", height: 110, borderRadius: 18, border: "3px solid rgba(255,255,255,0.55)", borderTop: "none", overflow: "hidden", background: "rgba(255,255,255,0.03)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lerp(0, 100, level)}%`, background: `linear-gradient(${T.teal}, ${C.money})`, opacity: 0.85 }} />
          </div>
          <div style={{ marginTop: 12, textAlign: "center", fontSize: 30, fontWeight: 700, letterSpacing: "0.06em", color: T.mist }}>{tray_label.toUpperCase()}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
