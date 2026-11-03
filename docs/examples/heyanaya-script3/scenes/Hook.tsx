import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SANS} from '../theme';
import {at, ChatIcon, Label, Mono, useLayout} from '../components/bits';
import {Bubble, ChatBody, ChatHeader, Phone} from '../components/Phone';
import {usePipAmount} from '../components/Host';
import {BEATS, CUE} from '../timeline';

const Q = CUE.b01;

const noReplyClock = (t: number) => {
  // runs from 0 to 3 h 40 m between "enquiries" and "deal"
  const mins = Math.round(interpolate(t, [Q.enquiries + 0.3, Q.deal + 0.8], [0, 220], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)}));
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)} h ${String(mins % 60).padStart(2, '0')} m`;
};

// Beat 01 panel: one unanswered WhatsApp enquiry at one clinic.
export const HookChat: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {u, vertical} = useLayout();
  const t = frame / fps;
  const k = vertical ? 1.0 : 1.02;
  const msg = at(frame, fps, Q.enquiries, 0.3);
  const red = at(frame, fps, Q.deal - 0.6, 0.3);
  const shake = t > Q.enquiries && t < Q.enquiries + 0.5 ? Math.sin(frame * 2.2) * 2 : 0;
  return (
    <div style={{display: 'flex', flexDirection: vertical ? 'row' : 'column', alignItems: 'center', gap: 26 * u, fontFamily: SANS}}>
      <div style={{display: 'grid', gap: 12 * u, justifyItems: vertical ? 'start' : 'center', order: vertical ? 1 : 0, width: vertical ? 420 * u : undefined}}>
        <Label size={24 * u} color={C.ink2}>Clinic 1 · Jumeirah</Label>
        <div
          style={{
            opacity: red,
            transform: `translateY(${(1 - red) * 10}px)`,
            fontSize: 30 * u,
            fontWeight: 700,
            color: C.alert,
            background: C.alertWash,
            borderRadius: 10 * u,
            padding: `${8 * u}px ${18 * u}px`,
          }}
        >
          Unanswered · <Mono>{noReplyClock(t)}</Mono>
        </div>
      </div>
      <Phone k={k} style={{transform: `rotate(${shake}deg)`}}>
        <ChatHeader k={k} name="New patient" sub="WhatsApp" right={<Mono style={{fontSize: 18 * u * k, color: '#667781'}}>21:14</Mono>} />
        <ChatBody k={k}>
          <Bubble k={k} p={msg} time="21:14">
            Hi! Do you have a slot for a teeth cleaning this week?
          </Bubble>
        </ChatBody>
      </Phone>
    </div>
  );
};

const BRANCHES = ['Jumeirah', 'Dubai Marina', 'Al Barsha', 'Deira', 'JLT', 'Mirdif', 'Business Bay', 'Karama', 'Silicon Oasis'];

const MiniCard: React.FC<{name: string; p: number; hours: number}> = ({name, p, hours}) => {
  const {u} = useLayout();
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 24 * u}px) scale(${0.94 + 0.06 * p})`,
        background: C.raised,
        border: `1px solid ${C.line}`,
        borderRadius: 18 * u,
        boxShadow: '0 1px 2px rgba(31,36,48,0.05), 0 18px 40px -24px rgba(31,36,48,0.25)',
        padding: 20 * u,
        display: 'grid',
        gap: 14 * u,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: 24 * u, fontWeight: 700, color: C.ink}}>{name}</div>
        <div style={{width: 12 * u, height: 12 * u, borderRadius: 99, background: C.alert}} />
      </div>
      <div style={{display: 'flex', gap: 12 * u, alignItems: 'center', background: C.waBg, borderRadius: 12 * u, padding: 12 * u}}>
        <ChatIcon size={26 * u} color="#8696a0" />
        <div style={{flex: 1, display: 'grid', gap: 7 * u}}>
          <div style={{height: 9 * u, borderRadius: 9, background: '#c9c4bb', width: '92%'}} />
          <div style={{height: 9 * u, borderRadius: 9, background: '#c9c4bb', width: '60%'}} />
        </div>
      </div>
      <div style={{fontSize: 20 * u, fontWeight: 700, color: C.alert}}>
        No reply · <Mono>{hours} h</Mono>
      </div>
    </div>
  );
};

// Beat 01 from "multiply": the one clinic becomes every clinic.
export const BranchGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {u, vertical, width} = useLayout();
  const pip = usePipAmount(BEATS[0]);
  const t = frame / fps;
  const start = Q.multiply - 0.1;
  const step = (Q.locations - start) / BRANCHES.length;
  const shown = BRANCHES.filter((_, i) => t >= start + i * step).length;
  if (pip <= 0.001) return null;
  return (
    <AbsoluteFill style={{background: C.paper, fontFamily: SANS, opacity: pip}}>
      <div
        style={{
          position: 'absolute',
          left: vertical ? 48 * u : 400 * u,
          right: vertical ? 48 * u : 70 * u,
          top: vertical ? 760 * u : 70 * u,
          display: 'grid',
          gap: 26 * u,
        }}
      >
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18 * u}}>
          <Mono style={{fontSize: 64 * u, fontWeight: 500, color: C.alert}}>{shown}</Mono>
          <span style={{fontSize: 34 * u, fontWeight: 600, color: C.ink}}>clinics · unanswered enquiries</span>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: `repeat(3, 1fr)`, gap: (vertical ? 18 : 24) * u, maxWidth: width}}>
          {BRANCHES.map((b, i) => (
            <MiniCard key={b} name={b} p={at(frame, fps, start + i * step, 0.3)} hours={[3, 5, 2, 7, 4, 6, 1, 9, 3][i]} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
