import { themeVars } from '@/lib/trades';
import type { Trade } from '@/lib/types';

/**
 * Wraps a subtree in the contractor's trade accent. Sets the accent CSS
 * variables so every `accent` Tailwind color inside renders in the trade color.
 */
export function TradeTheme({
  trade,
  children,
  className,
}: {
  trade: Trade;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-trade={trade} style={themeVars(trade)} className={className}>
      {children}
    </div>
  );
}
