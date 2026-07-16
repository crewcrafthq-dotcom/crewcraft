import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CloudLightning, ExternalLink, Mail, PhoneCall, Trash2, TriangleAlert } from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { CopyLinkButton } from './CopyLinkButton';
import { getSession } from '@/lib/auth';
import { appUrl } from '@/lib/config';
import { shortDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import type { Lead } from '@/lib/types';
import { deleteLead } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Lead Page' };

/**
 * Storm / Emergency Lead Page manager: your shareable public link, and the
 * inbox of leads it caught. The page answers every homeowner instantly by
 * email while you're on a roof or under a house.
 */
export default async function LeadPageManager() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const migrationMissing = !business.lead_token;
  const publicUrl = migrationMissing ? '' : `${appUrl()}/r/${business.lead_token}`;

  const supabase = createClient();
  const { data } = migrationMissing
    ? { data: [] as Lead[] }
    : await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(200);
  const leads = (data ?? []) as Lead[];

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <p className="eyebrow">{business.trade === 'roofing' ? 'Storm Response Pack' : 'Emergency Lead Page'}</p>
      <h1 className="mt-1 text-display-sm font-bold text-ink">
        {business.trade === 'roofing'
          ? 'When the hail hits, you’re ready.'
          : 'After-hours calls, answered instantly.'}
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Share your lead page anywhere — Facebook posts, door hangers, your voicemail greeting
        (“can’t reach me? request service at this link”). Every submission gets an instant branded
        reply, and the lead lands in your email and in the inbox below.
      </p>

      {migrationMissing ? (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4">
          <TriangleAlert className="mt-0.5 h-5 w-5 flex-none text-accent-bright" />
          <p className="text-sm text-ink-soft">
            One database step needed: run migration <strong>0010</strong> in the Supabase SQL
            editor, then reload this page to get your link.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">Your public link</p>
              <p className="mt-1 truncate font-mono text-sm text-ink">{publicUrl}</p>
            </div>
            <div className="flex flex-none items-center gap-2">
              <CopyLinkButton url={publicUrl} />
              <Link
                href={`/r/${business.lead_token}`}
                target="_blank"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-hairline-strong px-3.5 text-sm font-semibold text-ink transition hover:bg-paper-750"
              >
                <ExternalLink className="h-4 w-4" />
                Preview
              </Link>
            </div>
          </div>

          {!business.email ? (
            <p className="mt-3 text-sm text-bad">
              Add your business email in Settings — that’s where new leads get sent.
            </p>
          ) : null}

          <h2 className="mb-2 mt-8 text-sm font-semibold uppercase tracking-wide text-ink-mute">
            Lead inbox
          </h2>
          {leads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-hairline bg-paper-800/60 p-8 text-center">
              <CloudLightning className="mx-auto h-8 w-8 text-ink-mute" />
              <p className="mt-3 font-semibold text-ink">No leads yet</p>
              <p className="mt-1 text-sm text-ink-soft">
                Share the link above — the next storm (or burst pipe) fills this list.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-paper-800 shadow-card">
              {leads.map((l) => (
                <li key={l.id} className="flex flex-wrap items-start gap-3 p-4">
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-ink">{l.name}</span>
                      <span className="text-[11px] text-ink-mute">{shortDate(l.created_at)}</span>
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-soft">
                      {[l.phone, l.email, l.address].filter(Boolean).join(' · ') || 'No contact details'}
                    </span>
                    {l.message ? (
                      <span className="mt-1 block text-xs text-ink-mute">“{l.message}”</span>
                    ) : null}
                  </span>
                  <span className="flex flex-none items-center gap-1.5">
                    {l.phone ? (
                      <a
                        href={`tel:${l.phone.replace(/[^+0-9]/g, '')}`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-hairline-strong px-3.5 text-sm font-semibold text-ink transition hover:bg-paper-750"
                      >
                        <PhoneCall className="h-4 w-4" />
                        Call
                      </a>
                    ) : null}
                    {l.email ? (
                      <a
                        href={`mailto:${l.email}`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-hairline-strong px-3.5 text-sm font-semibold text-ink transition hover:bg-paper-750"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </a>
                    ) : null}
                    <form action={deleteLead.bind(null, l.id)}>
                      <button
                        type="submit"
                        aria-label={`Delete lead from ${l.name}`}
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
