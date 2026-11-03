import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SANS} from '../theme';
import {ChatIcon, Label, Mono, useLayout} from '../components/bits';
import {usePipAmount} from '../components/Host';
import {BEATS, CUE} from '../timeline';

const Q = CUE.b04;
const TOTAL = 1240; // illustrative month total across the chain

// Beat 04 from "chain": missed enquiries pour in and a month's tally rolls up.
export const Counter: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {u, vertical, width, height} = useLayout();
  const pip = usePipAmount(BEATS[3]);
  const t = frame / fps;
  if (pip <= 0.001) return null;
  const start = Q.chain;
  const end = Q.month + 0.1;
  const prog = interpolate(t, [start + 0.1, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const n = Math.round(TOTAL * prog);
  const day = Math.max(1, Math.ceil(prog * 30));
  const cx = width / 2;
  const cy = height * (vertical ? 0.5 : 0.44);

  return (
    <AbsoluteFill style={{background: C.night, opacity: pip, fontFamily: SANS, color: '#fff'}}>
      {/* bubbles flying into the tally */}
      {new Array(28).fill(0).map((_, i) => {
        const born = start + 0.05 + i * 0.075;
        const life = interpolate(t, [born, born + 0.7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
        if (life <= 0 || life >= 1) return null;
        const ang = random(`a${i}`) * Math.PI * 2;
        const r0 = Math.max(width, height) * 0.62;
        const x = cx + Math.cos(ang) * r0 * (1 - life);
        const y = cy + Math.sin(ang) * r0 * (1 - life);
        return (
          <div key={i} style={{position: 'absolute', left: x - 24 * u, top: y - 24 * u, width: 48 * u, height: 48 * u, borderRadius: 12 * u, background: 'rgba(255,107,91,0.2)', border: `${2 * u}px solid #ff6b5b`, display: 'grid', placeItems: 'center', opacity: 1 - life * 0.6}}>
            <ChatIcon size={24 * u} color="#ff6b5b" />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: cy - 170 * u, display: 'grid', justifyItems: 'center', gap: 14 * u}}>
        <Label size={26 * u} color="#ff9b8f">Missed booking opportunities</Label>
        <Mono style={{fontSize: (vertical ? 190 : 210) * u, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em'}}>{n.toLocaleString('en-US')}</Mono>
        <div style={{fontSize: 28 * u, color: 'rgba(255,255,255,0.65)'}}>
          across your chain · <Mono>day {day}</Mono> of 30
        </div>
        <div style={{display: 'grid', gridTemplateColumns: `repeat(${vertical ? 10 : 30}, 1fr)`, gap: 6 * u, marginTop: 22 * u, width: (vertical ? 760 : 1180) * u}}>
          {new Array(30).fill(0).map((_, i) => (
            <div key={i} style={{height: 22 * u, borderRadius: 5 * u, background: i < day ? '#ff6b5b' : 'rgba(255,255,255,0.08)'}} />
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', right: 36 * u, bottom: (vertical ? 36 : 150) * u, fontSize: 18 * u, color: 'rgba(255,255,255,0.4)'}}>Illustrative</div>
    </AbsoluteFill>
  );
};
