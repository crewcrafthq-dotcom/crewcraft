import Link from 'next/link';
import { redirect } from 'next/navigation';

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
    <AppShell trade={business.trade}>
      <h1 className="mb-5 text-2xl font-bold">Settings</h1>

      <Card className="mb-6 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">Plan</h2>
            <p className="text-sm text-navy-soft">
              {paid ? 'Pro — unlimited estimates.' : 'Free — 3 estimates total.'}
            </p>
          </div>
          <Link href="/billing" className={buttonClasses(paid ? 'secondary' : 'primary', 'sm')}>
            {paid ? 'Manage billing' : 'Go Pro'}
          </Link>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Business profile</h2>
        <BusinessForm action={updateBusinessAction} initial={business} submitLabel="Save changes" />
      </Card>
    </AppShell>
  );
}
