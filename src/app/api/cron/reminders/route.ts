import { NextResponse, type NextRequest } from 'next/server';

import { appUrl, REMINDER_AFTER_DAYS, REMINDER_MAX } from '@/lib/config';
import { sendAppEmail } from '@/lib/email/send';
import { reminderEmailHtml } from '@/lib/email/templates';
import { createAdminClient } from '@/lib/supabase/admin';
import { getTheme } from '@/lib/trades';
import type { Business, Estimate } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Daily follow-up sweep (Vercel Cron → vercel.json). Finds estimates that were
 * sent, got no answer for REMINDER_AFTER_DAYS, and nudges the customer — at
 * most REMINDER_MAX times, and only while the contractor has reminders on.
 * Auth: Vercel sends `Authorization: Bearer ${CRON_SECRET}` automatically.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET is not set.' }, { status: 503 });
  }
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from('estimates')
    .select('*')
    .eq('kind', 'estimate')
    .in('status', ['sent', 'viewed'])
    .eq('reminders_enabled', true)
    .not('customer_email', 'is', null)
    .lt('reminder_count', REMINDER_MAX)
    .limit(200);

  const cutoff = Date.now() - REMINDER_AFTER_DAYS * 24 * 60 * 60 * 1000;
  const due = ((data ?? []) as Estimate[]).filter((e) => {
    // Quiet since the last touch: the newest of send time and last reminder.
    const lastTouch = e.last_reminder_at ?? e.sent_at ?? e.updated_at;
    return lastTouch ? new Date(lastTouch).getTime() < cutoff : false;
  });

  let sent = 0;
  const errors: string[] = [];

  for (const estimate of due) {
    const { data: biz } = await admin
      .from('businesses')
      .select('*')
      .eq('user_id', estimate.user_id)
      .single();
    if (!biz) continue;
    const business = biz as Business;
    const theme = getTheme(business.trade);

    try {
      await sendAppEmail({
        to: estimate.customer_email as string,
        fromName: business.name,
        subject: `Checking in on your estimate from ${business.name}`,
        html: reminderEmailHtml({
          businessName: business.name,
          customerName: estimate.customer_name,
          total: estimate.total,
          publicUrl: `${appUrl()}/e/${estimate.public_token}`,
          accent: theme.accent,
          accentFg: theme.accentFg,
        }),
      });
      await admin
        .from('estimates')
        .update({
          last_reminder_at: new Date().toISOString(),
          reminder_count: (estimate.reminder_count ?? 0) + 1,
        })
        .eq('id', estimate.id);
      sent += 1;
    } catch (err) {
      console.error(`Reminder failed for estimate ${estimate.id}:`, err);
      errors.push(estimate.id);
    }
  }

  return NextResponse.json({ ok: true, candidates: due.length, sent, failed: errors.length });
}
