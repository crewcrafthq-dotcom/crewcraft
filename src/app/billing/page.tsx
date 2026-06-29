import { redirect } from 'next/navigation';
import { Check, Sparkles } from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/ui/Card';
import { getSession } from '@/lib/auth';
import { isPaidStatus } from '@/lib/config';
import { ManageBillingButton, UpgradeButton } from './buttons';

export const dynamic = 'force-dynamic';

const PLANS = [
  {
    key: 'founding' as const,
    name: 'Founding',
    price: '$19',
    cadence: '/mo — locked for life',
    note: 'First 100 only. Best deal.',
    featured: true,
  },
  {
    key: 'proAnnual' as const,
    name: 'Pro — yearly',
    price: '$24',
    cadence: '/mo, billed yearly ($288)',
    note: 'Two months off vs monthly.',
    featured: false,
  },
  {
    key: 'proMonthly' as const,
    name: 'Pro — monthly',
    price: '$29',
    cadence: '/mo',
    note: 'Cancel anytime.',
    featured: false,
  },
];

const FEATURES = [
  'Unlimited estimates',
  'AI-built labor & material line items',
  'Branded PDF + shareable link',
  'Email estimates to customers',
  'See when a customer opens it',
];

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { reason?: string };
}) {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const paid = isPaidStatus(business.subscription_status);

  return (
    <AppShell trade={business.trade} businessName={business.name} width="narrow">
      <p className="eyebrow">Plan</p>
      <h1 className="mt-1 text-display-sm font-bold text-navy">{paid ? 'Your plan' : 'Go Pro'}</h1>

      {searchParams.reason === 'limit' && !paid ? (
        <Card className="mt-4 border-accent/40 bg-accent-soft/40 p-4">
          <p className="text-navy-soft">
            You’ve used your 3 free estimates. Go Pro to keep building — unlimited estimates, same
            flat price.
          </p>
        </Card>
      ) : null}

      {paid ? (
        <Card className="mt-5 p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-fg">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-navy">You’re on Pro</h2>
              <p className="text-sm text-navy-soft">Unlimited estimates. Thanks for the support.</p>
            </div>
          </div>
          <div className="mt-5">
            <ManageBillingButton />
          </div>
        </Card>
      ) : (
        <>
          <p className="mt-2 text-navy-soft">Unlimited estimates. One flat price. Pick what fits.</p>

          <Card className="mt-5 p-5">
            <p className="mb-3 text-sm font-semibold text-navy">Every plan includes</p>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-navy-soft">
                  <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-accent-soft text-accent-deep">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </Card>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <Card
                key={plan.key}
                className={
                  'relative flex flex-col p-5 ' +
                  (plan.featured ? 'border-accent shadow-lift ring-1 ring-accent/30' : '')
                }
              >
                {plan.featured ? (
                  <span className="absolute -top-2.5 left-5 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-fg">
                    Best deal
                  </span>
                ) : null}
                <h2 className="font-semibold text-navy">{plan.name}</h2>
                <p className="mt-2">
                  <span className="text-3xl font-bold text-navy">{plan.price}</span>
                  <span className="text-sm text-navy-muted"> {plan.cadence}</span>
                </p>
                <p className="mb-5 mt-1 text-sm text-navy-soft">{plan.note}</p>
                <div className="mt-auto">
                  <UpgradeButton
                    priceKey={plan.key}
                    label="Choose"
                    variant={plan.featured ? 'primary' : 'secondary'}
                  />
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
