import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SANS} from '../theme';
import {at, ChatIcon, Check, Label, Mono, useLayout} from '../components/bits';
import {CUE} from '../timeline';

// Clinic branches on an abstract night city. Positions avoid the host's
// picture-in-picture corner (bottom-left in 16:9, top-right in 9:16).
const NODES_H = [
  [0.3, 0.3], [0.52, 0.22], [0.74, 0.3], [0.92, 0.36], [0.4, 0.52], [0.63, 0.5], [0.8, 0.6], [0.2, 0.44], [0.5, 0.76], [0.72, 0.8], [0.9, 0.82], [0.32, 0.72],
];
const NODES_V = [
  [0.24, 0.36], [0.62, 0.4], [0.3, 0.56], [0.78, 0.58], [0.5, 0.48], [0.18, 0.72], [0.52, 0.66], [0.84, 0.76], [0.36, 0.84], [0.66, 0.88], [0.16, 0.92], [0.46, 0.25],
];
const EDGES = [[0, 1], [1, 2], [2, 3], [0, 4], [1, 4], [4, 5], [2, 5], [5, 6], [3, 6], [7, 0], [4, 11], [11, 8], [8, 9], [5, 9], [9, 10], [6, 10]];
const GREEN = '#3fbf85';
const RED = '#ff6b5b';

type Mode = 'problem' | 'connected' | 'end';

export const CityMap: React.FC<{mode: Mode}> = ({mode}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {width, height, vertical, u} = useLayout();
  const t = frame / fps;
  const NODES = vertical ? NODES_V : NODES_H;

  const streets = useMemo(
    () => new Array(30).fill(0).map((_, i) => ({horiz: i % 2 === 0, p: random(`s${i}`), w: 1 + Math.floor(random(`w${i}`) * 3)})),
    [],
  );

  // problem: branch 1 on "first", branch 2 on "second", the rest cascade on "more across the rest"
  const Q = CUE.b02;
  const appearAt = (i: number) => (i === 0 ? Q.first : i === 1 ? Q.second : Q.more + (i - 2) * 0.13);
  // connected: every branch flips green, links draw
  const flipAt = (i: number) => 0.35 + i * 0.2;

  const enter = mode === 'end' ? 1 : interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const drift = 1.06 - 0.06 * interpolate(frame, [0, 7 * fps], [0, 1], {extrapolateRight: 'clamp'});
  const scale = mode === 'problem' ? (1.2 - 0.2 * enter) * drift : drift;

  const xy = (n: number[]) => [n[0] * width, n[1] * height];
  const isGreen = (i: number) => (mode === 'end' ? 1 : mode === 'connected' ? at(frame, fps, flipAt(i), 0.25) : 0);
  const linkP = mode === 'end' ? 1 : mode === 'connected' ? at(frame, fps, 0.6, 2.6) : 0;
  const count = NODES.filter((_, i) => t >= appearAt(i)).length;
  const greenCount = NODES.filter((_, i) => isGreen(i) > 0.5).length;

  return (
    <AbsoluteFill style={{background: C.night, opacity: enter, fontFamily: SANS}}>
      <AbsoluteFill style={{transform: `scale(${scale})`, filter: mode === 'problem' && enter < 1 ? `blur(${(1 - enter) * 12}px)` : undefined}}>
        <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
          {streets.map((s, i) =>
            s.horiz ? (
              <line key={i} x1={0} x2={width} y1={s.p * height} y2={(s.p + 0.05) * height} stroke={C.nightLine} strokeWidth={s.w * u} />
            ) : (
              <line key={i} y1={0} y2={height} x1={s.p * width} x2={(s.p - 0.04) * width} stroke={C.nightLine} strokeWidth={s.w * u} />
            ),
          )}
          <path d={`M 0 ${height * 0.9} C ${width * 0.3} ${height * 0.8}, ${width * 0.6} ${height * 1.02}, ${width} ${height * 0.94}`} stroke="#1c2a3d" strokeWidth={56 * u} fill="none" />
          {EDGES.map(([a, b], i) => {
            const [x1, y1] = xy(NODES[a]);
            const [x2, y2] = xy(NODES[b]);
            const p = Math.max(0, Math.min(1, linkP * EDGES.length * 0.6 - i * 0.5));
            if (p <= 0) return null;
            return <line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={GREEN} strokeOpacity={0.75} strokeWidth={3 * u} />;
          })}
        </svg>
        {NODES.map((n, i) => {
          const [x, y] = xy(n);
          const appear = mode === 'problem' ? at(frame, fps, appearAt(i), 0.25) : 1;
          if (appear <= 0) return null;
          const g = isGreen(i);
          const color = g > 0.5 ? GREEN : RED;
          const pulse = ((frame + i * 7) % 30) / 30;
          const label = mode === 'problem' && i < 2 ? `Clinic ${i + 1}` : null;
          return (
            <div key={i} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${interpolate(appear, [0, 0.6, 1], [0, 1.25, 1])})`}}>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 40 * u + pulse * 70 * u,
                  height: 40 * u + pulse * 70 * u,
                  transform: 'translate(-50%,-50%)',
                  borderRadius: 999,
                  border: `${2 * u}px solid ${color}`,
                  opacity: 0.7 * (1 - pulse),
                }}
              />
              <div style={{width: 26 * u, height: 26 * u, borderRadius: 999, background: color, boxShadow: `0 0 ${30 * u}px ${color}`}} />
              <div
                style={{
                  position: 'absolute',
                  left: 22 * u,
                  top: -50 * u,
                  background: color,
                  borderRadius: 10 * u,
                  padding: `${6 * u}px ${8 * u}px`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6 * u,
                }}
              >
                {g > 0.5 ? <Check size={22 * u} /> : <ChatIcon size={22 * u} color="#fff" />}
              </div>
              {label && (
                <div style={{position: 'absolute', left: -60 * u, top: 30 * u, width: 120 * u, textAlign: 'center', color: '#fff', fontSize: 22 * u, fontWeight: 600}}>{label}</div>
              )}
            </div>
          );
        })}
      </AbsoluteFill>
      {mode !== 'end' && (
        <div style={{position: 'absolute', left: (vertical ? 56 : 64) * u, top: (vertical ? 130 : 56) * u, display: 'grid', gap: 10 * u}}>
          <Label size={24 * u} color={mode === 'problem' ? '#ff9b8f' : '#7fe0b0'}>
            {mode === 'problem' ? 'Unanswered enquiries' : 'Every enquiry answered'}
          </Label>
          <Mono style={{fontSize: 72 * u, color: '#fff', fontWeight: 500}}>
            {mode === 'problem' ? count : `${greenCount}/${NODES.length}`}
            <span style={{fontSize: 30 * u, color: 'rgba(255,255,255,0.6)', marginLeft: 14 * u, fontFamily: SANS}}>clinics</span>
          </Mono>
        </div>
      )}
    </AbsoluteFill>
  );
};

// Beat 06 overlay: "more leads" lands, then gets struck through.
export const MoreLeads: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {u, vertical} = useLayout();
  const Q = CUE.b06;
  const p = at(frame, fps, Q.generating - 0.1, 0.3);
  const strike = interpolate(frame, [(Q.leads + 0.2) * fps, (Q.leads + 0.55) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  if (p <= 0) return null;
  return (
    <AbsoluteFill style={{alignItems: vertical ? 'center' : 'flex-end', justifyContent: vertical ? 'flex-start' : 'flex-start', padding: vertical ? `${1240 * u}px 0 0` : `${60 * u}px ${80 * u}px`}}>
      <div style={{position: 'relative', opacity: p, transform: `translateY(${(1 - p) * 20}px)`, background: 'rgba(251,250,247,0.96)', borderRadius: 16 * u, padding: `${18 * u}px ${30 * u}px`, fontFamily: SANS}}>
        <span style={{fontSize: 46 * u, fontWeight: 700, color: C.ink}}>Just more leads</span>
        <div style={{position: 'absolute', left: 22 * u, top: '52%', height: 6 * u, width: `calc(${strike * 100}% - ${44 * u * strike}px)`, background: C.alert, borderRadius: 4 * u}} />
      </div>
    </AbsoluteFill>
  );
};
