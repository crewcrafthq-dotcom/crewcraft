import {
  BellRing,
  Calculator,
  CalendarClock,
  Camera,
  ClipboardList,
  CloudLightning,
  FileText,
  Flame,
  Gauge,
  ListChecks,
  Mic,
  Package,
  PhoneIncoming,
  Receipt,
  Send,
  Star,
  Wrench,
  type LucideProps,
} from 'lucide-react';

import type { ToolIconKey } from '@/lib/marketing';

const MAP: Record<ToolIconKey, React.ComponentType<LucideProps>> = {
  estimates: FileText,
  voice: Mic,
  supplements: ClipboardList,
  followup: Send,
  reviews: Star,
  invoices: Receipt,
  scheduling: CalendarClock,
  maintenance: Wrench,
  reminders: BellRing,
  log: Gauge,
  waterheater: Flame,
  afterhours: PhoneIncoming,
  permits: ListChecks,
  loadcalc: Calculator,
  options: ListChecks,
  storm: CloudLightning,
  photos: Camera,
  materials: Package,
};

/** Icon for a Toolbelt app/automation (see ToolIconKey in lib/marketing). */
export function ToolIcon({ icon, ...props }: { icon: ToolIconKey } & LucideProps) {
  const Icon = MAP[icon] ?? FileText;
  return <Icon {...props} />;
}
