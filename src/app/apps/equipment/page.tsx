import { redirect } from 'next/navigation';
import { Gauge, Trash2, TriangleAlert } from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { Input, Label } from '@/components/ui/Field';
import { buttonClasses } from '@/components/ui/Button';
import { getSession } from '@/lib/auth';
import { cn } from '@/lib/cn';
import { createClient } from '@/lib/supabase/server';
import type { EquipmentItem } from '@/lib/types';
import { createEquipment, deleteEquipment } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Equipment & Filter Log' };

/**
 * Equipment & Filter Log — every unit you've touched: model, serial, filter
 * size, refrigerant. The answer to "what filter does the Henderson house
 * take?" from the supply-house parking lot.
 */
export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .eq('user_id', user.id)
    .order('customer_name', { ascending: true })
    .limit(500);
  const migrationMissing = Boolean(error);
  const items = (data ?? []) as EquipmentItem[];

  const byCustomer = new Map<string, EquipmentItem[]>();
  for (const it of items) byCustomer.set(it.customer_name, [...(byCustomer.get(it.customer_name) ?? []), it]);

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <p className="eyebrow">Equipment & Filter Log</p>
      <h1 className="mt-1 text-display-sm font-bold text-ink">Every unit you’ve touched.</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Log the equipment once — next visit you know the filter size, refrigerant, and serial
        before you ring the doorbell.
      </p>

      {migrationMissing ? (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4">
          <TriangleAlert className="mt-0.5 h-5 w-5 flex-none text-accent-bright" />
          <p className="text-sm text-ink-soft">
            One database step needed: run migration <strong>0010</strong> in the Supabase SQL
            editor, then reload this page.
          </p>
        </div>
      ) : (
        <>
          {searchParams.error ? (
            <p className="mt-4 text-sm text-bad">
              {searchParams.error === 'missing'
                ? 'Customer and a unit label are required.'
                : 'Could not save — try again.'}
            </p>
          ) : null}

          <form
            action={createEquipment}
            className="mt-6 grid gap-4 rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card sm:grid-cols-2 lg:grid-cols-4"
          >
            <div>
              <Label htmlFor="customer_name">Customer / site</Label>
              <Input id="customer_name" name="customer_name" required placeholder="e.g. Henderson — 41 Cedar Ln" />
            </div>
            <div>
              <Label htmlFor="label">Unit</Label>
              <Input id="label" name="label" required placeholder="e.g. Upstairs AC" />
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" placeholder="e.g. Carrier" />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" />
            </div>
            <div>
              <Label htmlFor="serial">Serial</Label>
              <Input id="serial" name="serial" />
            </div>
            <div>
              <Label htmlFor="filter_size">Filter size</Label>
              <Input id="filter_size" name="filter_size" placeholder="e.g. 16x25x1" />
            </div>
            <div>
              <Label htmlFor="refrigerant">Refrigerant</Label>
              <Input id="refrigerant" name="refrigerant" placeholder="e.g. R-410A" />
            </div>
            <div>
              <Label htmlFor="installed_year">Installed (year)</Label>
              <Input id="installed_year" name="installed_year" type="number" min={1950} max={2100} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" name="notes" placeholder="Attic access, breaker #, quirks…" />
            </div>
            <div className="flex items-end">
              <button type="submit" className={cn(buttonClasses('primary', 'md'), 'w-full')}>
                Log unit
              </button>
            </div>
          </form>

          {items.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-hairline bg-paper-800/60 p-8 text-center">
              <Gauge className="mx-auto h-8 w-8 text-ink-mute" />
              <p className="mt-3 font-semibold text-ink">No equipment logged yet</p>
              <p className="mt-1 text-sm text-ink-soft">Log the first unit above — future-you says thanks.</p>
            </div>
          ) : (
            [...byCustomer.entries()].map(([customer, units]) => (
              <section key={customer} className="mt-7">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-mute">{customer}</h2>
                <ul className="divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-paper-800 shadow-card">
                  {units.map((u) => (
                    <li key={u.id} className="flex items-start gap-3 p-4">
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-ink">
                          {u.label}
                          {u.brand ? <span className="font-normal text-ink-soft"> — {u.brand}{u.model ? ` ${u.model}` : ''}</span> : null}
                        </span>
                        <span className="mt-0.5 block text-xs text-ink-soft">
                          {[
                            u.filter_size ? `Filter ${u.filter_size}` : null,
                            u.refrigerant,
                            u.serial ? `S/N ${u.serial}` : null,
                            u.installed_year ? `Installed ${u.installed_year}` : null,
                          ]
                            .filter(Boolean)
                            .join(' · ') || 'No details yet'}
                        </span>
                        {u.notes ? <span className="mt-0.5 block text-xs text-ink-mute">{u.notes}</span> : null}
                      </span>
                      <form action={deleteEquipment.bind(null, u.id)}>
                        <button
                          type="submit"
                          aria-label={`Delete ${u.label}`}
                          className="grid h-9 w-9 flex-none cursor-pointer place-items-center rounded-lg text-ink-mute transition hover:bg-paper-750 hover:text-bad"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </>
      )}
    </AppShell>
  );
}
