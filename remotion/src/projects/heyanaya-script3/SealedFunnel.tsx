// Beat 07 (beside): the same funnel, answered. Teal HeyAnaya patches seal each gap, the dots
// inside flow straight down, the tap closes back to the original trickle ("Same ad spend"),
// and the dots land as teal appointment blocks in a week calendar. No numbers.
import React, { useMemo } from "react";
import { SANS, useCues, usePalette } from "../../explainer/context";
import { useGeometry } from "../../explainer/Host";
import { bounce, clamp01, pop, ramp, tones, useClock } from "./kit";
import { arrivedBetween, BW, CX, Dots, dotAt, emit, FunnelBody, GapLabel, gapsFor, geometry, PatchLabel } from "./funnel";

type Props = { patch_label?: string; tap_label?: string; calendar_label?: string; leaks?: string[] };

const R0 = 12;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = 3;

export const SealedFunnel: React.FC<Props> = ({ patch_label = "HeyAnaya", tap_label = "Same ad spend", calendar_label = "Bookings this week", leaks = ["No reply", "After hours", "Wrong language"] }) => {
  const { frame, fps, t } = useClock();
  const cue = useCues();
  const C = usePalette();
  const T = tones(C);
  const { panel, u, vertical } = useGeometry();

  const tSeal = cue("seal", 0.8);
  const tFlow = cue("flow", 2.2);
  const tTap = cue("tap", 2.6);
  const tFill = cue("fill", 4.2);

  const g = vertical ? geometry(80, 470) : geometry(76, 410);
  const gaps = gapsFor(leaks);
  const sealAt = (i: number) => tSeal + i * (4 / fps);
  // the doubled tap from beat 06 eases back to the original trickle on "already"
  const open = 1 - ramp(t, tTap, 0.4);
  const dots = useMemo(() => emit((x) => R0 * (1 + clamp01(1 - (x - tTap) / 0.4)), () => 0.7, gaps.length, -3, 10), [tTap, gaps.length]);
  const flow = ramp(t, tFlow, 0.3);
  const states = dots
    .map((d) => ({ s: dotAt(d, t, g, gaps, (te) => (te < tTap ? 22 : 10), sealAt), teal: t >= tFlow }))
    .filter((x) => x.s) as { s: NonNullable<ReturnType<typeof dotAt>>; teal: boolean }[];

  // calendar fills with the dots that make it down from the seal on, complete on "bookings"
  const N = DAYS.length * SLOTS;
  const startCount = tSeal + 0.3;
  const atFill = Math.max(1, arrivedBetween(dots, gaps, sealAt, startCount, tFill));
  const nowCount = arrivedBetween(dots, gaps, sealAt, startCount, t);
  const blocks = Math.min(N, Math.floor((nowCount / atFill) * N));
  const done = pop(frame, fps, tFill, 8);

  const tapLbl = bounce(frame, fps, tTap + 0.1);
  const patchP = (i: number) => bounce(frame, fps, sealAt(i));

  const cardW = panel.w - (vertical ? 80 : 80) * u;
  const cardH = panel.h - (vertical ? 60 : 80) * u;
  const BH = g.baseY + 250;
  const scale = Math.min((cardW - 40 * u) / BW, (cardH - 30 * u) / BH);

  return (
    <div style={{ width: panel.w, height: panel.h, display: "grid", placeItems: "center", fontFamily: SANS }}>
      <div style={{ position: "relative", width: cardW, height: cardH, borderRadius: 28 * u, background: C.night, overflow: "hidden", boxShadow: "0 30px 60px -30px rgba(14,27,36,0.6)" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 60%, color-mix(in srgb, ${C.money} ${Math.round(10 + 14 * flow)}%, transparent) 0%, transparent 60%)` }} />
        <div style={{ position: "absolute", left: (cardW - BW * scale) / 2, top: (cardH - BH * scale) / 2, width: BW, height: BH, transform: `scale(${scale})`, transformOrigin: "0 0", color: "#fff" }}>
          <FunnelBody g={g} gaps={gaps} open={open} gapGlow={gaps.map(() => 0.4)} patched={gaps.map((_, i) => patchP(i))} />
          <Dots states={states} />

          {/* tap */}
          <div style={{ position: "absolute", left: 230, top: g.tapY, transform: "translate(-100%, -50%)", fontSize: 30, fontWeight: 700, letterSpacing: "0.06em", color: T.mist }}>AD SPEND</div>
          {tapLbl > 0.001 && (
            <div style={{ position: "absolute", left: CX + 70, top: g.spoutY - 30, opacity: Math.min(1, tapLbl * 1.4), transform: `scale(${0.7 + 0.3 * tapLbl})`, transformOrigin: "0 50%", background: "#fff", color: C.night, borderRadius: 14, padding: "8px 20px", fontSize: 34, fontWeight: 800, whiteSpace: "nowrap" }}>
              {tap_label}
            </div>
          )}

          {/* leak labels flip to HeyAnaya patches */}
          {gaps.map((gp, i) => {
            const p = patchP(i);
            return (
              <React.Fragment key={gp.label}>
                <GapLabel g={g} gap={gp} p={1 - clamp01(p * 1.6)}>
                  <span style={{ color: T.amber, fontSize: 30, fontWeight: 700, background: `color-mix(in srgb, ${C.pending} 16%, ${C.night})`, border: `2px solid color-mix(in srgb, ${C.pending} 50%, transparent)`, borderRadius: 12, padding: "6px 16px" }}>{gp.label}</span>
                </GapLabel>
                <GapLabel g={g} gap={gp} p={clamp01(p)} style={{ transform: `${gp.side === -1 ? "translate(-100%, -50%)" : "translate(0, -50%)"} scale(${0.8 + 0.2 * clamp01(p)})`, transformOrigin: gp.side === -1 ? "100% 50%" : "0 50%" }}>
                  {patch_label === "HeyAnaya" ? <PatchLabel /> : <span>{patch_label}</span>}
                </GapLabel>
              </React.Fragment>
            );
          })}

          {/* week calendar */}
          <div style={{ position: "absolute", left: CX - 340, top: g.baseY, width: 680 }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${DAYS.length}, 1fr)`, gap: 10 }}>
              {DAYS.map((d) => (
                <div key={d} style={{ textAlign: "center", fontSize: 22, fontWeight: 700, color: T.faint, letterSpacing: "0.06em" }}>{d.toUpperCase()}</div>
              ))}
              {Array.from({ length: SLOTS * DAYS.length }).map((_, i) => {
                // fill order: column by column, top to bottom, like a week getting booked
                const col = i % DAYS.length;
                const row = Math.floor(i / DAYS.length);
                const order = col * SLOTS + row;
                const on = order < blocks;
                return (
                  <div key={i} style={{ height: 40, borderRadius: 8, border: `2px ${on ? "solid" : "dashed"} ${on ? T.teal : "rgba(255,255,255,0.18)"}`, background: on ? C.money : "transparent", boxShadow: on && done > 0 ? `0 0 ${14 * done}px color-mix(in srgb, ${C.money} 60%, transparent)` : undefined }} />
                );
              })}
            </div>
            <div style={{ marginTop: 16, textAlign: "center", fontSize: 30, fontWeight: 700, letterSpacing: "0.06em", color: done > 0.01 ? T.teal : T.mist, transform: `scale(${1 + 0.08 * Math.sin(done * Math.PI)})` }}>
              {calendar_label.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
