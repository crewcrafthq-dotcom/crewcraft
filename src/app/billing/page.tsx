import { redirect } from 'next/navigation';

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
    <AppShell trade={business.trade}>
      <h1 className="mb-2 text-2xl font-bold">{paid ? 'Your plan' : 'Go Pro'}</h1>

      {searchParams.reason === 'limit' && !paid ? (
        <Card className="mb-5 border-accent/40 p-4">
          <p className="text-navy-soft">
            You’ve used your 3 free estimates. Go Pro to keep building — unlimited
            estimates, same flat price.
          </p>
        </Card>
      ) : null}

      {paid ? (
        <Card className="p-6">
          <h2 className="font-semibold">You’re on Pro</h2>
          <p className="mt-1 text-navy-soft">
            Unlimited estimates. Manage your plan, payment method, or cancel any time.
          </p>
          <div className="mt-5">
            <ManageBillingButton />
          </div>
        </Card>
      ) : (
        <>
          <p className="mb-5 text-navy-soft">
            Unlimited estimates. One flat price. Pick what fits.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <Card
                key={plan.key}
                className={
                  'flex flex-col p-5 ' + (plan.featured ? 'border-accent ring-2 ring-accent/30' : '')
                }
              >
                <h2 className="font-semibold">{plan.name}</h2>
                <p className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-navy-muted"> {plan.cadence}</span>
                </p>
                <p className="mt-1 mb-5 text-sm text-navy-soft">{plan.note}</p>
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
