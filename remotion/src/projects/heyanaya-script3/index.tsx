// Scenes for heyanaya-script3, keyed by the storyboard's scene names.
import type React from "react";
import { AnayaBooksIt } from "./AnayaBooksIt";
import { ClinicNetworkMap } from "./ClinicNetworkMap";
import { LeakyFunnel } from "./LeakyFunnel";
import { LostLeadTrail } from "./LostLeadTrail";
import { MissedMonthHeatmap } from "./MissedMonthHeatmap";
import { SealedFunnel } from "./SealedFunnel";
import { UnansweredInbox } from "./UnansweredInbox";

export const SCENES: Record<string, React.FC<any>> = { // eslint-disable-line @typescript-eslint/no-explicit-any
  UnansweredInbox,
  ClinicNetworkMap,
  LostLeadTrail,
  MissedMonthHeatmap,
  AnayaBooksIt,
  LeakyFunnel,
  SealedFunnel,
};
