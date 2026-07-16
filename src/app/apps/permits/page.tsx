import { redirect } from 'next/navigation';
import { ListChecks, Trash2, TriangleAlert } from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { Input, Label } from '@/components/ui/Field';
import { buttonClasses } from '@/components/ui/Button';
import { getSession } from '@/lib/auth';
import { cn } from '@/lib/cn';
import { shortDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import type { Permit, PermitStatus } from '@/lib/types';
import { advancePermit, createPermit, deletePermit } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Permit Tracker' };

const NEXT_STATUS: Record<PermitStatus, { label: string; next: PermitStatus } | null> = {
  applied: { label: 'Mark issued', next: 'issued' },
  issued: { label: 'Inspection booked', next: 'inspection' },
  inspection: { label: 'Passed — close it', next: 'closed' },
  closed: null,
};

const CHIP: Record<PermitStatus, string> = {
  applied: 'bg-paper-700 text-ink-soft',
  issued: 'bg-sky-50 text-sky-700',
  inspection: 'bg-accent/10 text-accent-bright',
  closed: 'bg-emerald-50 text-emerald-700',
};

/** Permit Tracker — which job is waiting on which office, without sticky notes. */
export default async function PermitsPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const { data, error } = await supabase
    .from('permits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(200);
  const migrationMissing = Boolean(error);
  const permits = (data ?? []) as Permit[];
  const open = permits.filter((p) => p.status !== 'closed');
  const closed = permits.filter((p) => p.status === 'closed');

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <p className="eyebrow">Permit Tracker</p>
      <h1 className="mt-1 text-display-sm font-bold text-ink">Permits, off your mind.</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Every job’s permit and inspection status in one list. When an inspection date is set,
        you get an email reminder the day before.
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
              {searchParams.error === 'missing' ? 'Give the permit a job name.' : 'Could not save — try again.'}
            </p>
          ) : null}

          <form
            action={createPermit}
            className="mt-6 grid gap-4 rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card sm:grid-cols-2 lg:grid-cols-3"
          >
            <div>
              <Label htmlFor="job_name">Job / customer</Label>
              <Input id="job_name" name="job_name" required placeholder="e.g. Panel swap — Hendersons" />
            </div>
            <div>
              <Label htmlFor="jurisdiction">Jurisdiction</Label>
              <Input id="jurisdiction" name="jurisdiction" placeholder="e.g. City of Fresno" />
            </div>
            <div>
              <Label htmlFor="permit_no">Permit #</Label>
              <Input id="permit_no" name="permit_no" placeholder="If you have it already" />
            </div>
            <div>
              <Label htmlFor="inspection_date">Inspection date</Label>
              <Input id="inspection_date" name="inspection_date" type="date" />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" name="notes" placeholder="Inspector, corrections, callback #…" />
            </div>
            <div className="flex items-end">
              <button type="submit" className={cn(buttonClasses('primary', 'md'), 'w-full')}>
                Track permit
              </button>
            </div>
          </form>

          {permits.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-hairline bg-paper-800/60 p-8 text-center">
              <ListChecks className="mx-auto h-8 w-8 text-ink-mute" />
              <p className="mt-3 font-semibold text-ink">Nothing tracked yet</p>
              <p className="mt-1 text-sm text-ink-soft">Add the permit you’re waiting on right now.</p>
            </div>
          ) : (
            <>
              {[
                ['Open', open],
                ['Closed', closed],
              ]
                .filter(([, list]) => (list as Permit[]).length > 0)
                .map(([label, list]) => (
                  <section key={label as string} className="mt-7">
                    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-mute">
                      {label as string}
                    </h2>
                    <ul className="divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-paper-800 shadow-card">
                      {(list as Permit[]).map((p) => {
                        const advance = NEXT_STATUS[p.status];
                        return (
                          <li key={p.id} className="flex flex-wrap items-center gap-3 p-4">
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-ink">{p.job_name}</span>
                                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', CHIP[p.status])}>
                                  {p.status}
                                </span>
                              </span>
                              <span className="mt-0.5 block text-xs text-ink-soft">
                                {[
                                  p.jurisdiction,
                                  p.permit_no ? `#${p.permit_no}` : null,
                                  p.inspection_date ? `Inspection ${shortDate(p.inspection_date)}` : null,
                                ]
                                  .filter(Boolean)
                                  .join(' · ') || 'No details yet'}
                              </span>
                              {p.notes ? <span className="mt-0.5 block text-xs text-ink-mute">{p.notes}</span> : null}
                            </span>
                            <span className="flex flex-none items-center gap-1.5">
                              {advance ? (
                                <form action={advancePermit.bind(null, p.id, advance.next)}>
                                  <button type="submit" className={buttonClasses('secondary', 'sm')}>
                                    {advance.label}
                                  </button>
                                </form>
                              ) : null}
                              <form action={deletePermit.bind(null, p.id)}>
                                <button
                                  type="submit"
                                  aria-label={`Delete permit for ${p.job_name}`}
                                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-ink-mute transition hover:bg-paper-750 hover:text-bad"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </form>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
            </>
          )}
        </>
      )}
    </AppShell>
  );
}
