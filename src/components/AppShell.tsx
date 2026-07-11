import { AppHeader } from '@/components/AppHeader';
import { InstallPrompt } from '@/components/InstallPrompt';
import { TradeTheme } from '@/components/TradeTheme';
import { cn } from '@/lib/cn';
import type { Trade } from '@/lib/types';

/** Themed chrome for the contractor-facing pages: trade accent + top nav. */
export function AppShell({
  trade,
  businessName,
  children,
  width = 'default',
}: {
  trade: Trade;
  businessName: string;
  children: React.ReactNode;
  width?: 'default' | 'narrow';
}) {
  return (
    <TradeTheme trade={trade} className="min-h-screen">
      <AppHeader businessName={businessName} />
      <main
        className={cn(
          'mx-auto px-4 py-8 sm:px-6 sm:py-10',
          width === 'narrow' ? 'max-w-3xl' : 'max-w-5xl',
        )}
      >
        {children}
      </main>
      <InstallPrompt />
    </TradeTheme>
  );
}
