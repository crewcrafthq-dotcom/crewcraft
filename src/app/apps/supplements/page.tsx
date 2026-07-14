import { redirect } from 'next/navigation';

import { AppShell } from '@/components/AppShell';
import { getSession } from '@/lib/auth';
import { SupplementClient } from './SupplementClient';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Supplement Drafter' };

/**
 * Toolbelt Supplements — drafts the insurance supplement request letter that
 * roofers otherwise write at midnight. AI drafts, contractor reviews and owns.
 */
export default async function SupplementsPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <p className="eyebrow">Supplement Drafter</p>
      <h1 className="mt-1 text-display-sm font-bold text-ink">
        The supplement letter, in a minute.
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        List what the adjuster’s estimate missed — drip edge, starter, ice &amp; water, steep
        charges — with a reason if you have one. You get a clean, professional letter to send the
        carrier. Review every line before it goes out; it’s your claim.
      </p>

      <div className="mt-7">
        <SupplementClient />
      </div>
    </AppShell>
  );
}
