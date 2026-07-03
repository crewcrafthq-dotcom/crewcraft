import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BadgeCheck, CreditCard, Landmark } from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { BusinessForm } from '@/components/BusinessForm';
import { Card } from '@/components/ui/Card';
import { buttonClasses } from '@/components/ui/Button';
import { getSession } from '@/lib/auth';
import { isPaidStatus } from '@/lib/config';
import { updateBusinessAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const paid = isPaidStatus(business.subscription_status);

  return (
    <AppShell trade={business.trade} businessName={business.name} width="narrow">
      <h1 className="text-display-sm font-bold text-mist">Settings</h1>
      <p className="mt-1 mb-6 text-mist-soft">Your plan and the details that land on every estimate.</p>

      <Card className="mb-6 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={
                'grid h-10 w-10 flex-none place-items-center rounded-xl ' +
                (paid ? 'bg-accent text-accent-fg' : 'bg-night-700 text-mist-soft')
              }
            >
              <CreditCard className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-mist">{paid ? 'Pro plan' : 'Free plan'}</h2>
              <p className="text-sm text-mist-soft">
                {paid ? 'Unlimited estimates.' : '3 estimates total, then upgrade.'}
              </p>
            </div>
          </div>
          <Link href="/billing" className={buttonClasses(paid ? 'secondary' : 'primary', 'sm')}>
            {paid ? 'Manage billing' : 'Go Pro'}
          </Link>
        </div>
      </Card>

      {/* Stripe Connect — integrated payments */}
      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={
                'grid h-10 w-10 flex-none place-items-center rounded-xl ' +
                (business.stripe_charges_enabled
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-night-700 text-mist-soft')
              }
            >
              {business.stripe_charges_enabled ? (
                <BadgeCheck className="h-5 w-5" />
              ) : (
                <Landmark className="h-5 w-5" />
              )}
            </span>
            <div>
              <h2 className="font-semibold text-mist">Online payments</h2>
              <p className="text-sm text-mist-soft">
                {business.stripe_charges_enabled
                  ? 'Stripe connected — deposits and invoices reconcile automatically.'
                  : business.stripe_account_id
                    ? 'Almost there — finish your Stripe setup to take payments.'
                    : 'Connect your Stripe account so customers pay right on the estimate, and invoices mark themselves paid.'}
              </p>
            </div>
          </div>
          {!business.stripe_charges_enabled ? (
            <a href="/api/stripe/connect/onboard" className={buttonClasses('primary', 'sm')}>
              {business.stripe_account_id ? 'Finish Stripe setup' : 'Connect Stripe'}
            </a>
          ) : null}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-mist">Business profile</h2>
        <BusinessForm
          action={updateBusinessAction}
          initial={business}
          submitLabel="Save changes"
          extended
        />
      </Card>
    </AppShell>
  );
}
