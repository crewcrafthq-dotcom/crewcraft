import { redirect } from 'next/navigation';

import { AppShell } from '@/components/AppShell';
import { PresetPicker } from '@/components/apps/PresetPicker';
import { getSession } from '@/lib/auth';
import { presetsForApp } from '@/lib/app-presets';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Maintenance Plan Builder' };

/**
 * Maintenance Plan Builder — turn one-off tune-ups into recurring agreements.
 * Each tier creates a draft estimate the contractor can brand and send.
 */
export default async function MaintenancePlanPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const presets = presetsForApp('maintenance-plan');

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <p className="eyebrow">Maintenance Plan Builder</p>
      <h1 className="mt-1 text-display-sm font-bold text-ink">
        Turn tune-ups into recurring revenue.
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Three maintenance agreements, written up and priced — pick one and it opens as a draft
        estimate. Adjust for system count, put your rates in, send it before you leave the attic.
      </p>

      <div className="mt-7">
        <PresetPicker presets={presets} featured="mp-standard" />
      </div>

      <p className="mt-5 text-sm text-ink-mute">
        Prices are starting suggestions — set yours in the editor. Multi-system home? Bump the
        quantities in the draft. A preset draft counts toward your estimates like any other.
      </p>
    </AppShell>
  );
}
