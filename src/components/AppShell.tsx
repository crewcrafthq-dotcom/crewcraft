import { AppHeader } from '@/components/AppHeader';
import { TradeTheme } from '@/components/TradeTheme';
import type { Trade } from '@/lib/types';

/** Themed shell for the contractor-facing pages: trade accent + top nav. */
export function AppShell({ trade, children }: { trade: Trade; children: React.ReactNode }) {
  return (
    <TradeTheme trade={trade} className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-5 py-6">{children}</main>
    </TradeTheme>
  );
}
