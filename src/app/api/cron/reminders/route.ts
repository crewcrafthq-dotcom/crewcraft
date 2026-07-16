import { NextResponse, type NextRequest } from 'next/server';

import { appUrl, REMINDER_AFTER_DAYS, REMINDER_MAX, REVIEW_ASK_WINDOW_DAYS } from '@/lib/config';
import { sendAppEmail } from '@/lib/email/send';
import {
  invoiceReminderEmailHtml,
  jobsDigestEmailHtml,
  reminderEmailHtml,
  reviewRequestEmailHtml,
  serviceReminderEmailHtml,
} from '@/lib/email/templates';
import { pruneRateEvents } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';
import { getTheme } from '@/lib/trades';
import type { Business, Estimate, Job, Permit, ServiceReminder } from '@/lib/types';

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

  // 4. Seasonal tune-up reminders (service_reminders, migration 0010) —
  // email the customer, then roll next_due forward by the cadence.
  let tuneUpsSent = 0;
  try {
    const { data: dueRows, error: dueErr } = await admin
      .from('service_reminders')
      .select('*')
      .eq('enabled', true)
      .lte('next_due', today)
      .limit(100);
    if (dueErr) throw dueErr;

    for (const r of (dueRows ?? []) as ServiceReminder[]) {
      const { data: biz } = await admin
        .from('businesses')
        .select('*')
        .eq('user_id', r.user_id)
        .single();
      if (!biz) continue;
      const business = biz as Business;
      const theme = getTheme(business.trade);
      try {
        await sendAppEmail({
          to: r.customer_email,
          fromName: business.name,
          subject: `Time for your seasonal tune-up — ${business.name}`,
          html: serviceReminderEmailHtml({
            businessName: business.name,
            customerName: r.customer_name,
            phone: business.phone,
            accent: theme.accent,
            accentFg: theme.accentFg,
          }),
        });
        const next = new Date(`${r.next_due}T00:00:00Z`);
        next.setUTCMonth(next.getUTCMonth() + (r.cadence_months || 6));
        await admin
          .from('service_reminders')
          .update({ last_sent_at: new Date().toISOString(), next_due: next.toISOString().slice(0, 10) })
          .eq('id', r.id);
        tuneUpsSent += 1;
      } catch (err) {
        console.error(`Tune-up reminder failed for ${r.id}:`, err);
      }
    }
  } catch (err) {
    console.error('Tune-up sweep skipped:', err);
  }

  // 5. Tomorrow's jobs digest to the contractor (jobs, migration 0010).
  let digestsSent = 0;
  try {
    const from = new Date(Date.now() + 12 * 3_600_000).toISOString();
    const to = new Date(Date.now() + 36 * 3_600_000).toISOString();
    const { data: jobRows, error: jobsErr } = await admin
      .from('jobs')
      .select('*')
      .eq('status', 'scheduled')
      .is('reminder_sent_at', null)
      .gte('starts_at', from)
      .lt('starts_at', to)
      .limit(200);
    if (jobsErr) throw jobsErr;

    const byUser = new Map<string, Job[]>();
    for (const j of (jobRows ?? []) as Job[]) {
      byUser.set(j.user_id, [...(byUser.get(j.user_id) ?? []), j]);
    }
    for (const [userId, userJobs] of byUser) {
      const { data: biz } = await admin
        .from('businesses')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (!biz?.email) continue;
      const business = biz as Business;
      const theme = getTheme(business.trade);
      try {
        await sendAppEmail({
          to: business.email as string,
          fromName: 'Toolbelt',
          subject: `Tomorrow: ${userJobs.length} ${userJobs.length === 1 ? 'job' : 'jobs'}`,
          html: jobsDigestEmailHtml({
            businessName: business.name,
            jobs: userJobs.map((j) => ({
              title: j.title,
              customer: j.customer_name,
              address: j.address,
              time: new Date(j.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            })),
            scheduleUrl: `${appUrl()}/apps/schedule`,
            accent: theme.accent,
            accentFg: theme.accentFg,
          }),
        });
        const now = new Date().toISOString();
        await admin
          .from('jobs')
          .update({ reminder_sent_at: now })
          .in('id', userJobs.map((j) => j.id));
        digestsSent += 1;
      } catch (err) {
        console.error(`Jobs digest failed for user ${userId}:`, err);
      }
    }
  } catch (err) {
    console.error('Jobs digest sweep skipped:', err);
  }

  // 6. Inspection-tomorrow reminders (permits, migration 0010) — to the contractor.
  let inspectionNudges = 0;
  try {
    const tomorrow = new Date(Date.now() + 24 * 3_600_000).toISOString().slice(0, 10);
    const { data: permRows, error: permErr } = await admin
      .from('permits')
      .select('*')
      .eq('inspection_date', tomorrow)
      .is('reminder_sent_at', null)
      .limit(100);
    if (permErr) throw permErr;

    for (const p of (permRows ?? []) as Permit[]) {
      const { data: biz } = await admin
        .from('businesses')
        .select('*')
        .eq('user_id', p.user_id)
        .single();
      if (!biz?.email) continue;
      const business = biz as Business;
      const theme = getTheme(business.trade);
      try {
        await sendAppEmail({
          to: business.email as string,
          fromName: 'Toolbelt',
          subject: `Inspection tomorrow — ${p.job_name}`,
          html: jobsDigestEmailHtml({
            businessName: business.name,
            jobs: [
              {
                title: `Inspection: ${p.job_name}${p.permit_no ? ` (#${p.permit_no})` : ''}`,
                customer: p.jurisdiction,
                address: null,
                time: 'Tomorrow',
              },
            ],
            scheduleUrl: `${appUrl()}/apps/permits`,
            accent: theme.accent,
            accentFg: theme.accentFg,
          }),
        });
        await admin
          .from('permits')
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq('id', p.id);
        inspectionNudges += 1;
      } catch (err) {
        console.error(`Inspection reminder failed for ${p.id}:`, err);
      }
    }
  } catch (err) {
    console.error('Inspection sweep skipped:', err);
  }

  // housekeeping: keep the rate-limit table small (migration 0009)
  await pruneRateEvents();

  return NextResponse.json({
    ok: true,
    estimates: dueEstimates.length,
    invoices: dueInvoices.length,
    sent,
    failed: errors.length,
    reviewsSent,
    reviewsFailed,
    tuneUpsSent,
    digestsSent,
    inspectionNudges,
  });
}
