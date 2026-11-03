import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SANS} from '../theme';
import {at, CalIcon, ChatIcon, Label, useLayout} from '../components/bits';
import {CUE} from '../timeline';

const Q = CUE.b03;

const AdIcon: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round">
    <path d="M3 10v4h4l6 4V6L7 10H3z" />
    <path d="M17 9a4 4 0 010 6M19.5 6.5a7.5 7.5 0 010 11" />
  </svg>
);

const ReplyIcon: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 7L4 12l5 5" />
    <path d="M4 12h10a6 6 0 016 6" />
  </svg>
);

// Beat 03 panel: one paid-for lead travels Ad → Enquiry → Reply and dies before Booking.
export const Journey: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {u, vertical} = useLayout();
  const t = frame / fps;
  const W = (vertical ? 840 : 880) * u;
  const step = W / 3;
  const R = 54 * u;

  // token position along the line, in steps
  const pos = interpolate(t, [0.4, Q.patient, Q.paid + 0.4, Q.never - 0.15], [0, 1, 1, 2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const broken = at(frame, fps, Q.never, 0.25);
  const fall = interpolate(t, [Q.never + 0.1, Q.never + 0.9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)});
  const paid = at(frame, fps, Q.paid, 0.3);
  const lost = at(frame, fps, Q.booking - 0.1, 0.3);
  const lineP = at(frame, fps, 0, 0.8);

  const nodes = [
    {label: 'Ad', icon: (c: string) => <AdIcon size={44 * u} color={c} />},
    {label: 'Enquiry', icon: (c: string) => <ChatIcon size={40 * u} color={c} />},
    {label: 'Reply', icon: (c: string) => <ReplyIcon size={44 * u} color={c} />},
    {label: 'Booking', icon: (c: string) => <CalIcon size={44 * u} color={c} />},
  ];
  const reached = (i: number) => pos >= i - 0.05;

  return (
    <div style={{position: 'relative', width: W + 2 * R, height: 520 * u, fontFamily: SANS}}>
      <div style={{position: 'absolute', left: R, top: 0}}>
        <Label size={24 * u} color={C.ink2}>One enquiry, start to finish</Label>
      </div>
      {/* track */}
      <svg width={W + 2 * R} height={520 * u} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <line x1={R} y1={230 * u} x2={R + Math.min(2, lineP * 3) * step} y2={230 * u} stroke={C.lineStrong} strokeWidth={6 * u} strokeLinecap="round" />
        <line x1={R + 2 * step} y1={230 * u} x2={R + 2 * step + step * lineP} y2={230 * u} stroke={broken > 0 ? C.alert : C.lineStrong} strokeWidth={6 * u} strokeDasharray={broken > 0 ? `${10 * u} ${12 * u}` : undefined} strokeOpacity={1 - 0.5 * broken} />
        <line x1={R} y1={230 * u} x2={R + pos * step} y2={230 * u} stroke={C.ink} strokeWidth={6 * u} strokeLinecap="round" />
      </svg>
      {nodes.map((n, i) => {
        const on = reached(i) && !(i === 3);
        const isBooking = i === 3;
        const color = isBooking ? (lost > 0.5 ? C.alert : C.ink3) : on ? '#fff' : C.ink3;
        return (
          <div key={n.label} style={{position: 'absolute', left: R + i * step - R, top: 230 * u - R, width: 2 * R, display: 'grid', justifyItems: 'center', gap: 16 * u}}>
            <div
              style={{
                width: 2 * R,
                height: 2 * R,
                borderRadius: 999,
                display: 'grid',
                placeItems: 'center',
                background: isBooking ? C.paper : on ? C.ink : C.raised,
                border: isBooking ? `${3 * u}px dashed ${lost > 0.5 ? C.alert : C.lineStrong}` : `${2 * u}px solid ${on ? C.ink : C.line}`,
                transform: `scale(${on && Math.abs(pos - i) < 0.2 ? 1.08 : 1})`,
              }}
            >
              {n.icon(color)}
            </div>
            <div style={{fontSize: 26 * u, fontWeight: 600, color: C.ink, whiteSpace: 'nowrap'}}>{n.label}</div>
          </div>
        );
      })}
      {/* break mark */}
      <div style={{position: 'absolute', left: R + 2.5 * step - 26 * u, top: 230 * u - 26 * u, width: 52 * u, height: 52 * u, borderRadius: 99, background: C.alert, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 32 * u, fontWeight: 700, opacity: broken, transform: `scale(${0.6 + 0.4 * broken})`}}>✕</div>
      {/* the patient */}
      <div
        style={{
          position: 'absolute',
          left: R + pos * step - 34 * u,
          top: 230 * u - 140 * u + fall * 70 * u,
          width: 68 * u,
          height: 68 * u,
          borderRadius: 999,
          background: broken > 0.5 ? C.ink3 : C.money,
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          fontSize: 30 * u,
          fontWeight: 700,
          opacity: (1 - fall) * at(frame, fps, 0.2, 0.3),
          boxShadow: '0 10px 24px -10px rgba(0,0,0,0.4)',
        }}
      >
        P
      </div>
      {/* tags */}
      <div style={{position: 'absolute', left: R - 20 * u, top: 360 * u, opacity: paid, transform: `translateY(${(1 - paid) * 12}px)`, fontSize: 26 * u, fontWeight: 700, color: C.pending, background: '#f6eedb', borderRadius: 10 * u, padding: `${8 * u}px ${16 * u}px`}}>
        You paid for this lead
      </div>
      <div style={{position: 'absolute', right: 0, top: 360 * u, opacity: lost, transform: `translateY(${(1 - lost) * 12}px)`, fontSize: 26 * u, fontWeight: 700, color: C.alert, background: C.alertWash, borderRadius: 10 * u, padding: `${8 * u}px ${16 * u}px`}}>
        Never booked
      </div>
    </div>
  );
};
