import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CreditCard } from 'lucide-react';

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
      <h1 className="text-display-sm font-bold text-ink">Settings</h1>
      <p className="mt-1 mb-6 text-ink-soft">Your plan and the details that land on every estimate.</p>

      <Card className="mb-6 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={
                'grid h-10 w-10 flex-none place-items-center rounded-xl ' +
                (paid ? 'bg-accent text-accent-fg' : 'bg-paper-700 text-ink-soft')
              }
            >
              <CreditCard className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-ink">{paid ? 'Pro plan' : 'Free plan'}</h2>
              <p className="text-sm text-ink-soft">
                {paid ? 'Unlimited estimates.' : '3 estimates total, then upgrade.'}
              </p>
            </div>
          </div>
          <Link href="/billing" className={buttonClasses(paid ? 'secondary' : 'primary', 'sm')}>
            {paid ? 'Manage billing' : 'Go Pro'}
          </Link>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-ink">Business profile</h2>
        <BusinessForm action={updateBusinessAction} initial={business} submitLabel="Save changes" />
      </Card>
    </AppShell>
  );
}
