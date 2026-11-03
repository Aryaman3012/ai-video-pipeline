import React from "react";
import { AbsoluteFill } from "remotion";
import type { Overlay, TemplateRef, Theme } from "../types";
import { CTA, KineticText, QuoteCard, TitleCard } from "./cards";
import { BarChart, BulletList, SplitCompare, StatCounter } from "./data";
import { CalloutTag, Caption, LowerThird } from "../overlays/overlays";
import {
  CapabilityTicks, ChatInbox, CountUp, EndCard, OvernightReport, ReplyThread, SpendBars, VCaption, VTag,
} from "./vertical";
import { AdsRow, CalendarSlot, ChatList, ChatThread } from "./thread";
import { MetaAds, WACalendar, WAInbox, WAThread } from "./wa";

// Register every template here AND list it in docs/remotion-broll.md + schemas/edl.schema.json.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyTemplate = React.FC<any>;

export const BROLL: Record<string, AnyTemplate> = {
  TitleCard, KineticText, StatCounter, BulletList, QuoteCard, SplitCompare, BarChart, CTA,
  // 9:16 system (vertical.tsx) — the ones above are sized for landscape.
  ChatInbox, CountUp, SpendBars, OvernightReport, ReplyThread, CapabilityTicks, EndCard,
  // messaging system (thread.tsx) — one enquiry followed through its states
  ChatList, ChatThread, AdsRow, CalendarSlot,
  // WhatsApp UI (wa.tsx) — real WhatsApp dark-mode palette, built card by card
  WAInbox, WAThread, WACalendar, MetaAds,
};

export const OVERLAYS: Record<string, AnyTemplate> = { LowerThird, Caption, CalloutTag, VCaption, VTag };

const Missing: React.FC<{ name: string }> = ({ name }) => (
  <AbsoluteFill style={{ background: "#B00020", color: "#fff", justifyContent: "center", alignItems: "center", fontSize: 64 }}>
    Unknown template: {name}
  </AbsoluteFill>
);

export const renderBroll = (ref: TemplateRef, theme: Theme): React.ReactNode => {
  const C = BROLL[ref.template];
  return C ? <C {...ref.props} theme={theme} /> : <Missing name={ref.template} />;
};

export const renderOverlay = (o: Overlay, theme: Theme): React.ReactNode => {
  const C = OVERLAYS[o.template];
  return C ? <C {...o.props} theme={theme} /> : <Missing name={o.template} />;
};
