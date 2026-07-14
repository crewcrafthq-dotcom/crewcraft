import { redirect } from 'next/navigation';
import { Check, Sparkles } from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/ui/Card';
import { getSession } from '@/lib/auth';
import { isPaidStatus } from '@/lib/config';
import { PRICING_TIERS } from '@/lib/marketing';
import { ManageBillingButton, UpgradeButton } from './buttons';

export const dynamic = 'force-dynamic';

// The three paid tiers, in "best deal first" order for the in-app paywall.
const PAID_ORDER = ['founding', 'proAnnual', 'proMonthly'] as const;
const PLANS = PAID_ORDER.map((key) => PRICING_TIERS.find((t) => t.key === key)!);

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
      <h1 className="mt-1 text-display-sm font-bold text-ink">{paid ? 'Your plan' : 'Go Pro'}</h1>

      {searchParams.reason === 'limit' && !paid ? (
        <Card className="mt-4 border-accent/40 bg-accent/10 p-4">
          <p className="text-ink-soft">
            You’ve used your 3 free estimates — nice. Go Pro to keep quoting: unlimited estimates,
            every new app included, one flat price.
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
              <h2 className="font-semibold text-ink">You’re on Pro</h2>
              <p className="text-sm text-ink-soft">
                Unlimited estimates, and every new Toolbelt app as it ships. Thanks for the support.
              </p>
            </div>
          </div>
          <div className="mt-5">
            <ManageBillingButton />
          </div>
        </Card>
      ) : (
        <>
          <p className="mt-2 text-ink-soft">
            Unlimited estimates today, the whole belt of apps as they ship. Pick what fits.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
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
                <h2 className="font-semibold text-ink">{plan.name}</h2>
                <p className="mt-2">
                  <span className="text-3xl font-bold text-ink">{plan.price}</span>
                  <span className="text-sm text-ink-mute"> {plan.unit}</span>
                </p>
                <p className="mt-1 text-sm text-ink-soft">{plan.blurb}</p>
                <ul className="mb-5 mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
                      <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-accent/10 text-accent-bright">
                        <Check className="h-3 w-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <UpgradeButton
                    priceKey={plan.checkout!}
                    label="Choose"
                    variant={plan.featured ? 'primary' : 'secondary'}
                  />
                </div>
              </Card>
            ))}
          </div>

          <p className="mt-4 text-sm text-ink-mute">
            Every plan: unlimited estimates, AI line items, branded PDFs, open tracking — and every
            new Toolbelt app included as it ships. Cancel anytime from this page.
          </p>
        </>
      )}
    </AppShell>
  );
}
