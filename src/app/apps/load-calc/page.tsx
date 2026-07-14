import { redirect } from 'next/navigation';

import { AppShell } from '@/components/AppShell';
import { getSession } from '@/lib/auth';
import { LoadCalcClient } from './LoadCalcClient';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Load Calc Helper' };

/**
 * Load Calc Helper — a quick NEC 220.82-style residential service load check
 * before committing to a panel-upgrade number. Field aid, not a permit doc.
 */
export default async function LoadCalcPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <p className="eyebrow">Load Calc Helper</p>
      <h1 className="mt-1 text-display-sm font-bold text-ink">
        Service load, before you quote the panel.
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        A quick optional-method (NEC 220.82-style) check: square footage, fixed appliances, HVAC —
        and out comes the calculated load with a suggested service size. Copy the summary straight
        into your estimate notes.
      </p>

      <div className="mt-7">
        <LoadCalcClient />
      </div>

      <p className="mt-6 text-sm text-ink-mute">
        Field aid only — always verify against the current code cycle and your AHJ before
        permitting. You own the final numbers, here and on the quote.
      </p>
    </AppShell>
  );
}
