import React from "react";
import { Series } from "remotion";
import type { Theme } from "./types";
import { renderBroll } from "./broll/registry";

// Preview every b-roll template (4 s each). Open in Studio → BrollGallery.
const demos = [
  { template: "TitleCard", props: { title: "Never miss a patient call", subtitle: "An AI front desk for clinics" } },
  { template: "KineticText", props: { text: "Every missed call is a missed patient", highlight: ["missed", "patient"] } },
  { template: "StatCounter", props: { value: 38, suffix: "%", label: "of calls go unanswered (example figure)" } },
  { template: "BulletList", props: { title: "What it handles", items: ["Bookings", "Reschedules", "Reminders", "FAQs"] } },
  { template: "QuoteCard", props: { quote: "Our phones finally stopped ringing out.", author: "Sample clinic owner" } },
  { template: "SplitCompare", props: { leftTitle: "Before", leftItems: ["Busy lines", "Lost bookings"], rightTitle: "After", rightItems: ["24/7 answers", "Full calendar"] } },
  { template: "BarChart", props: { title: "Calls answered", bars: [{ label: "With AI", value: 98 }, { label: "Without", value: 62 }], unit: "%" } },
  { template: "CTA", props: { headline: "Book a demo", action: "Get started", url: "example.com" } },
];

export const BrollGallery: React.FC<{ theme: Theme }> = ({ theme }) => (
  <Series>
    {demos.map((d) => (
      <Series.Sequence key={d.template} durationInFrames={100}>
        {renderBroll(d, theme)}
      </Series.Sequence>
    ))}
  </Series>
);
