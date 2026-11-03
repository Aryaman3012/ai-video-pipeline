import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SANS} from '../theme';
import {Check, useLayout} from '../components/bits';
import {CUE} from '../timeline';

const Q = CUE.b07;

const Line: React.FC<{at: number; children: React.ReactNode; size: number; color?: string; weight?: number}> = ({at, children, size, color = C.ink, weight = 700}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - Math.round(at * fps), fps, config: {damping: 18, stiffness: 140}, durationInFrames: 18});
  return (
    <div style={{fontSize: size, fontWeight: weight, color, lineHeight: 1.08, letterSpacing: '-0.02em', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 40}px)`}}>
      {children}
    </div>
  );
};

// Beat 07 panel: the line, typeset.
export const Close: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {u, vertical} = useLayout();
  const under = spring({frame: frame - Math.round((Q.already + 0.2) * fps), fps, config: {damping: 200}, durationInFrames: 12});
  const big = (vertical ? 92 : 96) * u;
  return (
    <div style={{display: 'grid', gap: 14 * u, fontFamily: SANS, width: (vertical ? 940 : 920) * u}}>
      <Line at={Q.turning - 0.1} size={44 * u} color={C.ink2} weight={600}>
        Turn more of
      </Line>
      <Line at={Q.leads - 0.1} size={big}>
        the leads you{' '}
        <span style={{position: 'relative', whiteSpace: 'nowrap'}}>
          already have
          <span style={{position: 'absolute', left: 0, bottom: -4 * u, height: 12 * u, width: `${under * 100}%`, background: C.money, opacity: 0.35, borderRadius: 6 * u}} />
        </span>
      </Line>
      <Line at={Q.bookings - 0.1} size={big} color={C.money}>
        <span style={{display: 'inline-flex', alignItems: 'center', gap: 22 * u}}>
          into bookings.
          <span style={{width: 84 * u, height: 84 * u, borderRadius: 99, background: C.money, display: 'grid', placeItems: 'center'}}>
            <Check size={54 * u} />
          </span>
        </span>
      </Line>
    </div>
  );
};
