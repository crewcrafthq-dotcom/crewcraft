import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CheckCircle2, PhoneCall } from 'lucide-react';

import { TradeTheme } from '@/components/TradeTheme';
import { Input, Label, Textarea } from '@/components/ui/Field';
import { buttonClasses } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Business } from '@/lib/types';
import { submitLead } from './actions';

export const dynamic = 'force-dynamic';

// Per-business funnel pages — shared by link, never meant to rank in search.
export const metadata: Metadata = {
  title: 'Request service',
  robots: { index: false, follow: false },
};

/**
 * The public storm/emergency lead page. Contractor shares crewcraftapp.com/r/…
 * on Facebook, door hangers, voicemail greetings — every homeowner who fills
 * it in gets an instant reply, and the contractor gets the lead by email.
 */
export default async function LeadPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { sent?: string; error?: string };
}) {
  const admin = createAdminClient();
  const { data } = await admin
    .from('businesses')
    .select('*')
    .eq('lead_token', params.token)
    .maybeSingle();
  if (!data) notFound();
  const business = data as Business;

  const sent = searchParams.sent === '1';

  return (
    <TradeTheme trade={business.trade} className="min-h-screen">
      <main className="mx-auto max-w-lg px-5 py-10">
        <div className="text-center">
          {business.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logo_url}
              alt={business.name}
              className="mx-auto h-14 w-auto object-contain"
            />
          ) : null}
          <h1 className="mt-4 text-3xl font-bold uppercase text-ink">{business.name}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {[business.license ? `License ${business.license}` : null, business.address]
              .filter(Boolean)
              .join(' · ')}
          </p>
          {business.phone ? (
            <a
              href={`tel:${business.phone.replace(/[^+0-9]/g, '')}`}
              className="mt-3 inline-flex items-center gap-2 font-semibold text-accent-bright"
            >
              <PhoneCall className="h-4 w-4" />
              {business.phone}
            </a>
          ) : null}
        </div>

        <div className="relative mt-6 rounded-2xl border border-hairline bg-paper-800 p-6 shadow-card">
          <div aria-hidden className="hazard absolute inset-x-0 top-0 h-1.5 rounded-t-2xl opacity-80" />

          {sent ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-ok" />
              <h2 className="mt-3 text-xl font-bold text-ink">Request received</h2>
              <p className="mt-2 text-ink-soft">
                {business.name} will contact you as soon as possible.
                {business.phone ? ' If it’s urgent, call the number above.' : ''}
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-ink">Request service</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Leave your details — you’ll get a confirmation right away.
              </p>

              {searchParams.error ? (
                <p className="mt-3 text-sm text-bad">
                  {searchParams.error === 'rate'
                    ? 'Too many requests from this connection — please call instead.'
                    : 'Add your name and a phone number or email.'}
                </p>
              ) : null}

              <form action={submitLead.bind(null, business.lead_token)} className="mt-4 space-y-4">
                {/* honeypot — hidden from people, tempting to bots */}
                <div className="hidden" aria-hidden>
                  <label>
                    Website
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <div>
                  <Label htmlFor="name">Your name</Label>
                  <Input id="name" name="name" required autoComplete="name" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" autoComplete="tel" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" autoComplete="email" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" autoComplete="street-address" />
                </div>
                <div>
                  <Label htmlFor="message">What’s going on?</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="e.g. Hail last night — shingles in the yard. / No hot water since this morning."
                  />
                </div>
                <button type="submit" className={cn(buttonClasses('primary', 'lg'), 'w-full')}>
                  Send request
                </button>
                <p className="text-center text-xs text-ink-mute">
                  Your details go only to {business.name}.
                </p>
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-ink-mute">Powered by Toolbelt</p>
      </main>
    </TradeTheme>
  );
}
