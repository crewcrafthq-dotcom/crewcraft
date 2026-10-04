import Link from 'next/link';
import { CreditCard } from 'lucide-react';

import { getSession } from '@/lib/auth';
import { graceDaysLeft, graceRemains, isDunningStatus } from '@/lib/config';
import { shortDate } from '@/lib/format';

/**
 * Shown on every app page while a renewal is failing. A grace window nobody
 * can see is just a surprise lockout two weeks later, so this is the half of
 * the dunning flow that does the real work — the email can go to a dead
 * address or a spam folder, this can't be missed.
 *
 * Renders nothing in the normal case, including before migration 0011 is run
 * (no grace_until column ⇒ no window ⇒ no banner).
 */
export async function BillingGraceBanner() {
  const { business } = await getSession();
  if (!business) return null;
  if (!isDunningStatus(business.subscription_status)) return null;
  if (!graceRemains(business.grace_until)) return null;

  const days = graceDaysLeft(business.grace_until);

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-amber-500/20 text-ink">
          <CreditCard className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink">
            Your card was declined — {days} {days === 1 ? 'day' : 'days'} left on Pro
          </p>
          <p className="mt-0.5 text-sm text-ink-soft">
            Everything keeps working until {shortDate(business.grace_until!)}. Usually it&rsquo;s
            just an expired card.
          </p>
        </div>
      </div>
      <Link
        href="/billing"
        className="inline-flex flex-none items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-accent transition hover:brightness-110"
      >
        Update payment method
      </Link>
    </div>
  );
}
