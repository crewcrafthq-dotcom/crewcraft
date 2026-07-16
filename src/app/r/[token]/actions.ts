'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { sendAppEmail } from '@/lib/email/send';
import { leadAutoReplyEmailHtml, leadNotifyEmailHtml } from '@/lib/email/templates';
import { checkRateLimit, clientIp, recordRateEvent } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';
import { getTheme } from '@/lib/trades';
import type { Business } from '@/lib/types';

const emailOk = (e: string) => /\S+@\S+\.\S+/.test(e);
const clip = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

/**
 * Public lead submission (no auth — the storm/emergency page). Guard rails:
 * unguessable business token, per-IP rate limit, honeypot field, service-role
 * insert only. The homeowner gets an instant auto-reply; the contractor gets
 * the lead by email the same second.
 */
export async function submitLead(token: string, formData: FormData): Promise<void> {
  // Honeypot: real people never fill a hidden "website" field.
  if (String(formData.get('website') ?? '').trim() !== '') {
    redirect(`/r/${token}?sent=1`); // pretend success; bots learn nothing
  }

  const ip = clientIp(headers());
  const { allowed } = await checkRateLimit(`lead:ip:${ip}`, 5, 60);
  if (!allowed) redirect(`/r/${token}?error=rate`);

  const name = clip(formData.get('name'), 120);
  const phone = clip(formData.get('phone'), 40) || null;
  const email = clip(formData.get('email'), 160).toLowerCase() || null;
  if (!name || (!phone && !email)) redirect(`/r/${token}?error=missing`);
  if (email && !emailOk(email)) redirect(`/r/${token}?error=missing`);

  const admin = createAdminClient();
  const { data: biz } = await admin
    .from('businesses')
    .select('*')
    .eq('lead_token', token)
    .maybeSingle();
  if (!biz) redirect('/');
  const business = biz as Business;

  const lead = {
    name,
    phone,
    email,
    address: clip(formData.get('address'), 200) || null,
    message: clip(formData.get('message'), 1000) || null,
  };

  const { error } = await admin.from('leads').insert({ user_id: business.user_id, ...lead });
  if (error) redirect(`/r/${token}?error=save`);
  await recordRateEvent(`lead:ip:${ip}`);

  const theme = getTheme(business.trade);

  // Notify the contractor (their business email, fall back skipped if none).
  if (business.email) {
    try {
      await sendAppEmail({
        to: business.email,
        fromName: 'Toolbelt',
        subject: `New lead: ${lead.name}${lead.phone ? ` — ${lead.phone}` : ''}`,
        html: leadNotifyEmailHtml({
          businessName: business.name,
          lead,
          accent: theme.accent,
          accentFg: theme.accentFg,
        }),
      });
    } catch (err) {
      console.error('Lead notify email failed:', err);
    }
  }

  // Instant auto-reply to the homeowner.
  if (email) {
    try {
      await sendAppEmail({
        to: email,
        fromName: business.name,
        subject: `We got your request — ${business.name}`,
        html: leadAutoReplyEmailHtml({
          businessName: business.name,
          leadName: name,
          phone: business.phone,
          accent: theme.accent,
          accentFg: theme.accentFg,
        }),
      });
    } catch (err) {
      console.error('Lead auto-reply failed:', err);
    }
  }

  redirect(`/r/${token}?sent=1`);
}
