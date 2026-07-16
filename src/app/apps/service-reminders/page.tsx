import { redirect } from 'next/navigation';
import { BellRing, Trash2, TriangleAlert } from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { Input, Label, Select } from '@/components/ui/Field';
import { buttonClasses } from '@/components/ui/Button';
import { getSession } from '@/lib/auth';
import { cn } from '@/lib/cn';
import { shortDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import type { ServiceReminder } from '@/lib/types';
import { createServiceReminder, deleteServiceReminder, toggleServiceReminder } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Seasonal Tune-Up Reminders' };

/**
 * Seasonal Tune-Up Reminders — the automation that keeps the maintenance book
 * full. Add a customer once; every N months they get a branded "time for your
 * tune-up" email from you, and the date rolls forward automatically.
 */
export default async function ServiceRemindersPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const { data, error } = await supabase
    .from('service_reminders')
    .select('*')
    .eq('user_id', user.id)
    .order('next_due', { ascending: true })
    .limit(300);
  const migrationMissing = Boolean(error);
  const reminders = (data ?? []) as ServiceReminder[];

  const defaultDue = new Date(Date.now() + 90 * 24 * 3_600_000).toISOString().slice(0, 10);

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <p className="eyebrow">Seasonal Tune-Up Reminders</p>
      <h1 className="mt-1 text-display-sm font-bold text-ink">
        “Time for your tune-up” — sent for you.
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Add a customer once. When their date comes up, they get a branded reminder email from your
        company, and the next one schedules itself. Runs with the daily sweep — nothing to remember.
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
                ? 'Name, a valid email, and a first date are required.'
                : 'Could not save — try again.'}
            </p>
          ) : null}

          <form
            action={createServiceReminder}
            className="mt-6 grid gap-4 rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card sm:grid-cols-2 lg:grid-cols-4"
          >
            <div>
              <Label htmlFor="customer_name">Customer</Label>
              <Input id="customer_name" name="customer_name" required placeholder="e.g. Dana Henderson" />
            </div>
            <div>
              <Label htmlFor="customer_email">Email</Label>
              <Input id="customer_email" name="customer_email" type="email" required placeholder="dana@example.com" />
            </div>
            <div>
              <Label htmlFor="next_due">First reminder</Label>
              <Input id="next_due" name="next_due" type="date" required defaultValue={defaultDue} />
            </div>
            <div>
              <Label htmlFor="cadence_months">Repeat every</Label>
              <Select id="cadence_months" name="cadence_months" defaultValue="6">
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
              </Select>
            </div>
            <div className="flex items-end lg:col-start-4">
              <button type="submit" className={cn(buttonClasses('primary', 'md'), 'w-full')}>
                Add reminder
              </button>
            </div>
          </form>

          {reminders.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-hairline bg-paper-800/60 p-8 text-center">
              <BellRing className="mx-auto h-8 w-8 text-ink-mute" />
              <p className="mt-3 font-semibold text-ink">No reminders yet</p>
              <p className="mt-1 text-sm text-ink-soft">
                Start with the customers whose tune-up you did last season.
              </p>
            </div>
          ) : (
            <ul className="mt-7 divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-paper-800 shadow-card">
              {reminders.map((r) => (
                <li key={r.id} className={cn('flex flex-wrap items-center gap-3 p-4', !r.enabled && 'opacity-55')}>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">{r.customer_name}</span>
                    <span className="mt-0.5 block text-xs text-ink-soft">
                      {r.customer_email} · every {r.cadence_months} months
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-mute">
                      Next: {shortDate(r.next_due)}
                      {r.last_sent_at ? ` · last sent ${shortDate(r.last_sent_at)}` : ''}
                      {!r.enabled ? ' · paused' : ''}
                    </span>
                  </span>
                  <span className="flex flex-none items-center gap-1.5">
                    <form action={toggleServiceReminder.bind(null, r.id, !r.enabled)}>
                      <button type="submit" className={buttonClasses('secondary', 'sm')}>
                        {r.enabled ? 'Pause' : 'Resume'}
                      </button>
                    </form>
                    <form action={deleteServiceReminder.bind(null, r.id)}>
                      <button
                        type="submit"
                        aria-label={`Delete reminder for ${r.customer_name}`}
                        className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-ink-mute transition hover:bg-paper-750 hover:text-bad"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </AppShell>
  );
}
