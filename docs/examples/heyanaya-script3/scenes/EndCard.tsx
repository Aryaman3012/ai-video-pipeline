import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {END_CARD} from '../config';
import {C, SANS} from '../theme';
import {useIn, useLayout} from '../components/bits';
import {CityMap} from './CityMap';

// Last seconds: the connected network dims, logo and CTA settle in.
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {vertical, u} = useLayout();
  const enter = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const dim = interpolate(frame, [0, 10], [0.2, 0.8], {extrapolateRight: 'clamp'});
  const logo = useIn(0.15, 16);
  const head = useIn(0.4);
  const cta = useIn(0.7);
  return (
    <AbsoluteFill style={{fontFamily: SANS, opacity: enter}}>
      <CityMap mode="end" />
      <AbsoluteFill style={{background: C.black, opacity: dim}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 40 * u, padding: 80 * u, textAlign: 'center', color: '#fff'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22 * u, opacity: logo, transform: `scale(${0.92 + 0.08 * logo})`}}>
          <Img src={staticFile('logo-white.png')} style={{width: 96 * u, height: 96 * u, objectFit: 'contain'}} />
          <span style={{fontSize: 84 * u, fontWeight: 700, letterSpacing: '-0.02em'}}>HeyAnaya</span>
        </div>
        <div style={{opacity: head, transform: `translateY(${(1 - head) * 16}px)`, fontSize: (vertical ? 54 : 46) * u, fontWeight: 500, maxWidth: (vertical ? 900 : 1200) * u, lineHeight: 1.2, color: 'rgba(255,255,255,0.88)'}}>
          {END_CARD.headline}
        </div>
        <div style={{opacity: cta, transform: `translateY(${(1 - cta) * 16}px)`, display: 'grid', gap: 18 * u, justifyItems: 'center'}}>
          <div style={{background: '#fff', color: C.black, fontSize: 36 * u, fontWeight: 700, padding: `${18 * u}px ${40 * u}px`, borderRadius: 12 * u}}>{END_CARD.cta}</div>
          {END_CARD.url && <div style={{fontSize: 30 * u, color: 'rgba(255,255,255,0.7)'}}>{END_CARD.url}</div>}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
