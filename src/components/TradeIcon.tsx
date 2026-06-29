import { Wind, Droplets, Zap, HardHat, type LucideProps } from 'lucide-react';
import type { Trade } from '@/lib/types';

const MAP: Record<Trade, React.ComponentType<LucideProps>> = {
  hvac: Wind,
  plumbing: Droplets,
  electrical: Zap,
  roofing: HardHat,
};

/** The icon that represents a trade (HVAC → wind, Plumbing → drops, etc.). */
export function TradeIcon({ trade, ...props }: { trade: Trade } & LucideProps) {
  const Icon = MAP[trade] ?? Wind;
  return <Icon {...props} />;
}
