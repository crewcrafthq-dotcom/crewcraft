import { NextResponse, type NextRequest } from 'next/server';

import { appUrl, REMINDER_AFTER_DAYS, REMINDER_MAX, REVIEW_ASK_WINDOW_DAYS } from '@/lib/config';
import { sendAppEmail } from '@/lib/email/send';
import {
  invoiceReminderEmailHtml,
  reminderEmailHtml,
  reviewRequestEmailHtml,
} from '@/lib/email/templates';
import { createAdminClient } from '@/lib/supabase/admin';
import { getTheme } from '@/lib/trades';
import type { Business, Estimate } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Daily follow-up sweep (Vercel Cron → vercel.json). Three passes:
 *   1. estimates that were sent and got no answer (at most REMINDER_MAX
 *      nudges, quiet-window REMINDER_AFTER_DAYS, per-document
 *      reminders_enabled toggle, customer email required);
 *   2. invoices past their due date and not paid (same rules);
 *   3. Review-Getter: invoices paid in the last REVIEW_ASK_WINDOW_DAYS whose
 *      business opted in (auto_review_request + review_link) get the review
 *      ask emailed once — review_requested_at is the idempotency stamp, and
 *      an ask already sent from the source estimate suppresses it.
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
  const cutoff = Date.now() - REMINDER_AFTER_DAYS * 24 * 60 * 60 * 1000;
  const today = new Date().toISOString().slice(0, 10);

  const quietSince = (e: Estimate) => {
    const lastTouch = e.last_reminder_at ?? e.sent_at ?? e.updated_at;
    return lastTouch ? new Date(lastTouch).getTime() < cutoff : false;
  };

  // 1. unanswered estimates
  const { data: estRows } = await admin
    .from('estimates')
    .select('*')
    .eq('kind', 'estimate')
    .in('status', ['sent', 'viewed'])
    .eq('reminders_enabled', true)
    .not('customer_email', 'is', null)
    .lt('reminder_count', REMINDER_MAX)
    .limit(200);
  const dueEstimates = ((estRows ?? []) as Estimate[]).filter(quietSince);

  // 2. overdue invoices
  const { data: invRows } = await admin
    .from('estimates')
    .select('*')
    .eq('kind', 'invoice')
    .in('status', ['sent', 'viewed'])
    .eq('reminders_enabled', true)
    .not('customer_email', 'is', null)
    .not('due_date', 'is', null)
    .lt('reminder_count', REMINDER_MAX)
    .limit(200);
  const dueInvoices = ((invRows ?? []) as Estimate[]).filter(
    (i) => (i.due_date as string) < today && quietSince(i),
  );

  let sent = 0;
  const errors: string[] = [];

  for (const doc of [...dueEstimates, ...dueInvoices]) {
    const { data: biz } = await admin
      .from('businesses')
      .select('*')
      .eq('user_id', doc.user_id)
      .single();
    if (!biz) continue;
    const business = biz as Business;
    const theme = getTheme(business.trade);
    const publicUrl = `${appUrl()}/e/${doc.public_token}`;
    const invoice = doc.kind === 'invoice';

    try {
      await sendAppEmail({
        to: doc.customer_email as string,
        fromName: business.name,
        subject: invoice
          ? `Reminder: your invoice from ${business.name}`
          : `Checking in on your estimate from ${business.name}`,
        html: invoice
          ? invoiceReminderEmailHtml({
              businessName: business.name,
              customerName: doc.customer_name,
              total: doc.total,
              dueDate: doc.due_date,
              publicUrl,
              accent: theme.accent,
              accentFg: theme.accentFg,
            })
          : reminderEmailHtml({
              businessName: business.name,
              customerName: doc.customer_name,
              total: doc.total,
              publicUrl,
              accent: theme.accent,
              accentFg: theme.accentFg,
            }),
      });
      await admin
        .from('estimates')
        .update({
          last_reminder_at: new Date().toISOString(),
          reminder_count: (doc.reminder_count ?? 0) + 1,
        })
        .eq('id', doc.id);
      sent += 1;
    } catch (err) {
      console.error(`Reminder failed for ${doc.kind} ${doc.id}:`, err);
      errors.push(doc.id);
    }
  }

  // 3. Review-Getter — freshly paid invoices for opted-in businesses.
  // Guarded so a failure here (e.g. migration 0008 not applied yet) never
  // takes down the reminder passes above.
  let reviewsSent = 0;
  let reviewsFailed = 0;
  try {
    const paidCutoff = new Date(
      Date.now() - REVIEW_ASK_WINDOW_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString();
    const { data: paidRows, error: paidErr } = await admin
      .from('estimates')
      .select('*')
      .eq('kind', 'invoice')
      .eq('status', 'paid')
      .is('review_requested_at', null)
      .not('customer_email', 'is', null)
      .gte('paid_at', paidCutoff)
      .limit(100);
    if (paidErr) throw paidErr;

    for (const inv of (paidRows ?? []) as Estimate[]) {
      const { data: biz, error: bizErr } = await admin
        .from('businesses')
        .select('*')
        .eq('user_id', inv.user_id)
        .single();
      if (bizErr) throw bizErr; // e.g. auto_review_request column missing pre-migration
      const business = biz as Business;
      if (!business.auto_review_request || !business.review_link) continue;

      // Don't ask twice for the same job: skip when the ask already went out
      // from the source estimate's share panel.
      if (inv.source_estimate_id) {
        const { data: src } = await admin
          .from('estimates')
          .select('review_requested_at')
          .eq('id', inv.source_estimate_id)
          .maybeSingle();
        if (src?.review_requested_at) {
          await admin
            .from('estimates')
            .update({ review_requested_at: src.review_requested_at })
            .eq('id', inv.id);
          continue;
        }
      }

      const theme = getTheme(business.trade);
      try {
        await sendAppEmail({
          to: inv.customer_email as string,
          fromName: business.name,
          subject: `How did we do? — ${business.name}`,
          html: reviewRequestEmailHtml({
            businessName: business.name,
            customerName: inv.customer_name,
            reviewUrl: business.review_link,
            accent: theme.accent,
            accentFg: theme.accentFg,
          }),
        });
        await admin
          .from('estimates')
          .update({ review_requested_at: new Date().toISOString() })
          .eq('id', inv.id);
        reviewsSent += 1;
      } catch (err) {
        console.error(`Auto review ask failed for invoice ${inv.id}:`, err);
        reviewsFailed += 1;
      }
    }
  } catch (err) {
    console.error('Review-Getter sweep skipped:', err);
  }

  return NextResponse.json({
    ok: true,
    estimates: dueEstimates.length,
    invoices: dueInvoices.length,
    sent,
    failed: errors.length,
    reviewsSent,
    reviewsFailed,
  });
}
