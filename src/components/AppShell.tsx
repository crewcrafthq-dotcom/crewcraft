import { AppHeader } from '@/components/AppHeader';
import { AppSidebar } from '@/components/AppSidebar';
import { BillingGraceBanner } from '@/components/BillingGraceBanner';
import { InstallPrompt } from '@/components/InstallPrompt';
import { TradeTheme } from '@/components/TradeTheme';
import { cn } from '@/lib/cn';
import type { Trade } from '@/lib/types';

/**
 * Themed chrome for the contractor-facing pages: trade accent, top bar, and —
 * on desktop — the app sidebar that lays the whole toolbelt out. Mobile stays
 * top-bar only; the sidebar is lg+.
 */
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
      <div className="mx-auto flex max-w-7xl gap-2 px-4 sm:px-6">
        <AppSidebar trade={trade} />
        <main
          className={cn(
            'min-w-0 flex-1 py-8 sm:py-10',
            width === 'narrow' ? 'mx-auto w-full max-w-3xl lg:mx-0 lg:max-w-4xl' : '',
          )}
        >
          {/* Sits above every page's own content, on all 24 screens, because
              AppShell wraps them all — see BillingGraceBanner. */}
          <BillingGraceBanner />
          {children}
        </main>
      </div>
      <InstallPrompt />
    </TradeTheme>
  );
}
