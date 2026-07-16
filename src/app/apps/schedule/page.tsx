import { redirect } from 'next/navigation';
import { CalendarClock, MapPin, Trash2, TriangleAlert } from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { Input, Label, Textarea } from '@/components/ui/Field';
import { buttonClasses } from '@/components/ui/Button';
import { getSession } from '@/lib/auth';
import { cn } from '@/lib/cn';
import { createClient } from '@/lib/supabase/server';
import type { Job } from '@/lib/types';
import { createJob, deleteJob, setJobStatus } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Schedule' };

function dayKey(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/**
 * Toolbelt Scheduling v1 — a clean agenda, not a bloated calendar. Add the
 * job, see the week, mark it done. The daily cron emails tomorrow's agenda.
 */
export default async function SchedulePage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const since = new Date(Date.now() - 24 * 3_600_000).toISOString();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', user.id)
    .gte('starts_at', since)
    .order('starts_at', { ascending: true })
    .limit(200);
  const migrationMissing = Boolean(error);
  const jobs = (data ?? []) as Job[];

  const byDay = new Map<string, Job[]>();
  for (const j of jobs) {
    const k = dayKey(j.starts_at);
    byDay.set(k, [...(byDay.get(k) ?? []), j]);
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <p className="eyebrow">Schedule</p>
      <h1 className="mt-1 text-display-sm font-bold text-ink">The week, straight.</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Book the job, see the agenda, mark it done. Every evening you’ll get tomorrow’s jobs by
        email — no morning scramble.
      </p>

      {migrationMissing ? (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4">
          <TriangleAlert className="mt-0.5 h-5 w-5 flex-none text-accent-bright" />
          <p className="text-sm text-ink-soft">
            One database step needed: run migration <strong>0010</strong> in the Supabase SQL
            editor (Claude gave you the SQL), then reload this page.
          </p>
        </div>
      ) : (
        <>
          {searchParams.error ? (
            <p className="mt-4 text-sm text-bad">
              {searchParams.error === 'missing'
                ? 'A job needs at least a title and a date.'
                : 'Could not save that job — try again.'}
            </p>
          ) : null}

          {/* new job */}
          <form
            action={createJob}
            className="mt-6 grid gap-4 rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card sm:grid-cols-2 lg:grid-cols-4"
          >
            <div className="sm:col-span-2">
              <Label htmlFor="title">Job</Label>
              <Input id="title" name="title" required placeholder="e.g. Condenser swap — Hendersons" />
            </div>
            <div>
              <Label htmlFor="customer_name">Customer</Label>
              <Input id="customer_name" name="customer_name" placeholder="Optional" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" placeholder="Optional" />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required defaultValue={today} />
            </div>
            <div>
              <Label htmlFor="time">Start</Label>
              <Input id="time" name="time" type="time" defaultValue="09:00" />
            </div>
            <div>
              <Label htmlFor="duration_min">Duration (min)</Label>
              <Input id="duration_min" name="duration_min" type="number" min={15} step={15} defaultValue={120} />
            </div>
            <div className="flex items-end">
              <button type="submit" className={cn(buttonClasses('primary', 'md'), 'w-full')}>
                Add to schedule
              </button>
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={2} placeholder="Gate code, parking, what to bring…" />
            </div>
          </form>

          {/* agenda */}
          {jobs.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-hairline bg-paper-800/60 p-8 text-center">
              <CalendarClock className="mx-auto h-8 w-8 text-ink-mute" />
              <p className="mt-3 font-semibold text-ink">Nothing booked yet</p>
              <p className="mt-1 text-sm text-ink-soft">Add the first job above — it takes ten seconds.</p>
            </div>
          ) : (
            [...byDay.entries()].map(([day, dayJobs]) => (
              <section key={day} className="mt-7">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-mute">{day}</h2>
                <ul className="divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-paper-800 shadow-card">
                  {dayJobs.map((j) => (
                    <li key={j.id} className={cn('flex items-start gap-3 p-4', j.status !== 'scheduled' && 'opacity-55')}>
                      <span className="w-[74px] flex-none pt-0.5 text-sm font-bold text-ink">{timeOf(j.starts_at)}</span>
                      <span className="min-w-0 flex-1">
                        <span className={cn('block text-sm font-semibold text-ink', j.status === 'done' && 'line-through')}>
                          {j.title}
                          {j.status === 'canceled' ? ' (canceled)' : ''}
                        </span>
                        <span className="mt-0.5 block text-xs text-ink-soft">
                          {[j.customer_name, `${j.duration_min} min`].filter(Boolean).join(' · ')}
                        </span>
                        {j.address ? (
                          <span className="mt-0.5 flex items-center gap-1 text-xs text-ink-mute">
                            <MapPin className="h-3 w-3 flex-none" />
                            {j.address}
                          </span>
                        ) : null}
                        {j.notes ? <span className="mt-1 block text-xs text-ink-mute">{j.notes}</span> : null}
                      </span>
                      <span className="flex flex-none items-center gap-1.5">
                        {j.status === 'scheduled' ? (
                          <form action={setJobStatus.bind(null, j.id, 'done')}>
                            <button type="submit" className={buttonClasses('secondary', 'sm')}>Done</button>
                          </form>
                        ) : (
                          <form action={setJobStatus.bind(null, j.id, 'scheduled')}>
                            <button type="submit" className={buttonClasses('ghost', 'sm')}>Reopen</button>
                          </form>
                        )}
                        <form action={deleteJob.bind(null, j.id)}>
                          <button
                            type="submit"
                            aria-label={`Delete ${j.title}`}
                            className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-ink-mute transition hover:bg-paper-750 hover:text-bad"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </span>
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
