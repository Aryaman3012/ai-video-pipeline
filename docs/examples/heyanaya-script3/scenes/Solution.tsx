import React from 'react';
import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SANS} from '../theme';
import {at, CalIcon, Check, Mono, useLayout} from '../components/bits';
import {Bubble, ChatBody, ChatHeader, Phone, Typing} from '../components/Phone';
import {CUE} from '../timeline';

const Q = CUE.b05;

const BoltIcon: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
);
const GlobeIcon: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
  </svg>
);
const SparkIcon: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2l2.2 6.3L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.7L12 2zM19 15l1 2.7 2.7 1-2.7 1-1 2.7-1-2.7-2.7-1 2.7-1 1-2.7z" />
  </svg>
);

const Feature: React.FC<{p: number; icon: (c: string) => React.ReactNode; title: string; sub: React.ReactNode}> = ({p, icon, title, sub}) => {
  const {u} = useLayout();
  const on = p > 0.5;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `${60 * u}px 1fr`,
        alignItems: 'center',
        gap: 18 * u,
        padding: `${16 * u}px ${20 * u}px`,
        borderRadius: 16 * u,
        background: on ? C.raised : 'transparent',
        border: `1px solid ${on ? C.line : 'transparent'}`,
        boxShadow: on ? '0 1px 2px rgba(31,36,48,0.05), 0 18px 40px -24px rgba(31,36,48,0.25)' : undefined,
        opacity: 0.35 + 0.65 * p,
        transform: `translateX(${(1 - p) * 16 * u}px)`,
      }}
    >
      <div style={{width: 60 * u, height: 60 * u, borderRadius: 14 * u, background: on ? C.money : C.sunken, display: 'grid', placeItems: 'center'}}>{icon(on ? '#fff' : C.ink3)}</div>
      <div>
        <div style={{fontSize: 30 * u, fontWeight: 700, color: C.ink, lineHeight: 1.15}}>{title}</div>
        <div style={{fontSize: 21 * u, color: C.ink2, marginTop: 4 * u}}>{sub}</div>
      </div>
    </div>
  );
};

const Langs: React.FC<{p: number}> = ({p}) => {
  const {u} = useLayout();
  const langs = ['EN', 'عربي', 'हिंदी', 'RU'];
  return (
    <span style={{display: 'inline-flex', gap: 6 * u}}>
      {langs.map((l, i) => (
        <span key={l} style={{padding: `${2 * u}px ${8 * u}px`, borderRadius: 6 * u, fontWeight: 600, background: i === 1 && p > 0.5 ? C.moneyWash : C.sunken, color: i === 1 && p > 0.5 ? C.money : C.ink2}}>
          {l}
        </span>
      ))}
    </span>
  );
};

// Beat 05 panel: HeyAnaya replies instantly, in Arabic, with a reply built to convert, and books it.
export const Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {u, vertical} = useLayout();
  const t = frame / fps;
  const k = vertical ? 0.95 : 1.0;
  const s = u * k;

  const msgIn = at(frame, fps, Q.leads - 0.1, 0.25);
  const typing = t > Q.leads + 0.2 && t < Q.instantly + 0.25;
  const reply = at(frame, fps, Q.instantly + 0.25, 0.25);
  const glow = at(frame, fps, Q.crafts, 0.3) * (1 - at(frame, fps, Q.schedules - 0.2, 0.4));
  const slots = at(frame, fps, Q.crafts + 0.2, 0.3);
  const pick = at(frame, fps, Q.convert - 0.1, 0.2);
  const ans = at(frame, fps, Q.convert + 0.35, 0.25);
  const booked = at(frame, fps, Q.schedules, 0.3);

  const f1 = at(frame, fps, Q.instantly, 0.3);
  const f2 = at(frame, fps, Q.preferred, 0.3);
  const f3 = at(frame, fps, Q.crafts, 0.3);
  const f4 = at(frame, fps, Q.schedules, 0.3);
  const ic = 30 * u;

  const avatar = (
    <div style={{width: 50 * s, height: 50 * s, borderRadius: 999, background: '#fff', display: 'grid', placeItems: 'center', border: `1px solid ${C.line}`}}>
      <Img src={staticFile('logo-black.png')} style={{width: 30 * s, height: 30 * s, objectFit: 'contain'}} />
    </div>
  );

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: (vertical ? 30 : 44) * u, fontFamily: SANS}}>
      <Phone k={k}>
        <ChatHeader k={k} avatar={avatar} name="Smile Dental · Jumeirah" sub={typing ? 'Anaya is typing…' : 'Answered by Anaya · 24/7'} />
        <ChatBody k={k}>
          <Bubble k={k} p={msgIn} time="23:41" rtl>
            مرحباً، هل يوجد موعد لتنظيف الأسنان هذا الأسبوع؟
          </Bubble>
          {typing && <Typing k={k} />}
          <Bubble k={k} out p={reply} time="23:41" ticks="blue" rtl glow={glow}>
            أهلاً سارة! نعم، لدينا موعد غداً الساعة ١٠:٣٠ صباحاً أو ٤:٠٠ عصراً. أيهما يناسبك؟
          </Bubble>
          {slots > 0 && (
            <div style={{alignSelf: 'flex-end', display: 'flex', gap: 10 * s, opacity: slots, transform: `translateY(${(1 - slots) * 10 * s}px)`}}>
              {['١٠:٣٠ ص', '٤:٠٠ م'].map((l, i) => (
                <div
                  key={l}
                  dir="rtl"
                  style={{
                    padding: `${10 * s}px ${18 * s}px`,
                    borderRadius: 12 * s,
                    background: i === 0 && pick > 0.5 ? C.money : '#fff',
                    color: i === 0 && pick > 0.5 ? '#fff' : '#0a7c57',
                    fontWeight: 700,
                    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                    transform: `scale(${i === 0 ? 1 - 0.06 * Math.sin(pick * Math.PI) : 1})`,
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
          )}
          <Bubble k={k} p={ans} time="23:42" rtl>
            ١٠:٣٠ من فضلك 🙏
          </Bubble>
          {booked > 0 && (
            <div style={{alignSelf: 'center', opacity: booked, transform: `scale(${0.9 + 0.1 * booked})`, background: '#fff', borderRadius: 16 * s, padding: `${14 * s}px ${18 * s}px`, display: 'flex', alignItems: 'center', gap: 12 * s, boxShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
              <div style={{width: 40 * s, height: 40 * s, borderRadius: 99, background: C.money, display: 'grid', placeItems: 'center'}}>
                <Check size={26 * s} />
              </div>
              <div>
                <div style={{fontWeight: 700, color: C.money}}>Appointment booked</div>
                <div style={{fontSize: 17 * s, color: '#667781'}}>
                  <Mono>Tue · 10:30 am</Mono>
                </div>
              </div>
            </div>
          )}
        </ChatBody>
      </Phone>
      <div style={{display: 'grid', gap: 12 * u, width: (vertical ? 560 : 560) * u}}>
        <Feature p={f1} icon={(c) => <BoltIcon size={ic} color={c} />} title="Replies instantly" sub={<span>Every lead, <Mono>24/7</Mono></span>} />
        <Feature p={f2} icon={(c) => <GlobeIcon size={ic} color={c} />} title="In their language" sub={<Langs p={f2} />} />
        <Feature p={f3} icon={(c) => <SparkIcon size={ic} color={c} />} title="Messages that convert" sub="Clear options, one tap to book" />
        <Feature p={f4} icon={(c) => <CalIcon size={ic} color={c} />} title="Schedules the appointment" sub="Straight into the clinic calendar" />
      </div>
    </div>
  );
};
