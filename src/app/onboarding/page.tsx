import { redirect } from 'next/navigation';

import { BusinessForm } from '@/components/BusinessForm';
import { Card } from '@/components/ui/Card';
import { getSession } from '@/lib/auth';
import { createBusinessAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (business) redirect('/dashboard');

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <header className="mb-7">
        <span className="text-lg font-bold tracking-tight">Crewcraft</span>
        <h1 className="mt-4 text-2xl font-bold">Set up your business</h1>
        <p className="mt-1 text-navy-soft">
          This lands on every estimate — your logo, license, and rates. You can
          change it any time.
        </p>
      </header>

      <Card className="p-6">
        <BusinessForm action={createBusinessAction} submitLabel="Save & start" />
      </Card>
    </main>
  );
}
