import { redirect } from 'next/navigation';

import { AppShell } from '@/components/AppShell';
import { PresetPicker } from '@/components/apps/PresetPicker';
import { getSession } from '@/lib/auth';
import { presetsForApp } from '@/lib/app-presets';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Water Heater Quote Pack' };

/**
 * Water Heater Quote Pack — good/better/best water-heater quotes, one tap.
 * Picking a tier creates a draft estimate (counts toward the free limit like
 * any estimate) and opens it in the editor with every line editable.
 */
export default async function WaterHeaterPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const presets = presetsForApp('water-heater');

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <p className="eyebrow">Water Heater Quote Pack</p>
      <h1 className="mt-1 text-display-sm font-bold text-ink">
        Tank vs tankless, side by side.
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Three ready-to-send water heater quotes — pick one and it opens as a draft estimate with
        every line and price editable. Send all three and let the homeowner upgrade themselves.
      </p>

      <div className="mt-7">
        <PresetPicker presets={presets} featured="wh-better" />
      </div>

      <p className="mt-5 text-sm text-ink-mute">
        Prices are starting suggestions from typical market ranges — set yours in the editor. A
        preset draft counts toward your estimates like any other.
      </p>
    </AppShell>
  );
}
