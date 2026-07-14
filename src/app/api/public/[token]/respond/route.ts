import { NextResponse, type NextRequest } from 'next/server';

import { appUrl } from '@/lib/config';
import { sendAppEmail } from '@/lib/email/send';
import { sendEstimateEmail } from '@/lib/email/send-estimate';
import { responseNotificationHtml } from '@/lib/email/templates';
import {
  createInvoiceFromEstimate,
  loadEstimateByToken,
  ownerNotifyEmail,
} from '@/lib/estimate-data';
import { renderEstimatePdf } from '@/lib/pdf/render';
import { createAdminClient } from '@/lib/supabase/admin';
import { getTheme } from '@/lib/trades';

export const runtime = 'nodejs';

/**
 * Customer accept / decline by public token — the e-sign endpoint. No login:
 * possession of the unguessable token is the credential, same trust model as
 * the public page and PDF. Accepting requires a typed-name signature.
 */
export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  let body: { action?: unknown; name?: unknown; note?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }

  const action = body.action === 'accept' || body.action === 'decline' ? body.action : null;
  if (!action) return NextResponse.json({ error: 'Bad request.' }, { status: 400 });

  const bundle = await loadEstimateByToken(params.token);
  if (!bundle) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const { business, estimate } = bundle;
  if (estimate.kind !== 'estimate') {
    return NextResponse.json({ error: 'Only estimates can be accepted.' }, { status: 400 });
  }
  // Once accepted, changes go through the contractor.
  if (estimate.status === 'accepted') {
    return NextResponse.json({ ok: true, status: 'accepted', already: true });
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  if (action === 'accept') {
    const name = String(body.name ?? '').trim().slice(0, 120);
    if (name.length < 2) {
      return NextResponse.json({ error: 'Type your full name to accept.' }, { status: 400 });
    }
    const { error } = await admin
      .from('estimates')
      .update({
        status: 'accepted',
        signed_name: name,
        accepted_at: now,
        declined_at: null,
        decline_reason: null,
      })
      .eq('id', estimate.id);
    if (error) return NextResponse.json({ error: 'Could not save. Try again.' }, { status: 500 });
  } else {
    if (estimate.status === 'declined') {
      return NextResponse.json({ ok: true, status: 'declined', already: true });
    }
    const note = String(body.note ?? '').trim().slice(0, 500) || null;
    const { error } = await admin
      .from('estimates')
      .update({ status: 'declined', declined_at: now, decline_reason: note })
      .eq('id', estimate.id);
    if (error) return NextResponse.json({ error: 'Could not save. Try again.' }, { status: 500 });
  }

  // Auto-invoice: when enabled, acceptance creates and emails the invoice on
  // its own. Best-effort — a failure here never blocks the acceptance.
  if (action === 'accept' && business.auto_invoice && estimate.customer_email) {
    try {
      const invoice = await createInvoiceFromEstimate(estimate);
      if (invoice) {
        const theme = getTheme(business.trade);
        const pdf = await renderEstimatePdf(business, { ...invoice, status: 'sent' });
        await sendEstimateEmail({
          to: estimate.customer_email,
          kind: 'invoice',
          businessName: business.name,
          customerName: estimate.customer_name,
          total: invoice.total,
          publicUrl: `${appUrl()}/e/${invoice.public_token}`,
          dueDate: invoice.due_date,
          pdf,
          accent: theme.accent,
          accentFg: theme.accentFg,
        });
        await admin
          .from('estimates')
          .update({ status: 'sent', sent_at: now })
          .eq('id', invoice.id);
      }
    } catch (err) {
      console.error('Auto-invoice failed:', err);
    }
  }

  // Tell the contractor. Best-effort — the customer's response is already saved.
  try {
    const to = await ownerNotifyEmail(business);
    if (to) {
      const theme = getTheme(business.trade);
      const accepted = action === 'accept';
      await sendAppEmail({
        to,
        fromName: 'Crewcraft',
        subject: accepted
          ? `${estimate.customer_name || 'A customer'} accepted your estimate`
          : `${estimate.customer_name || 'A customer'} declined your estimate`,
        html: responseNotificationHtml({
          businessName: business.name,
          customerName: estimate.customer_name,
          total: estimate.total,
          accepted,
          signedName: accepted ? String(body.name ?? '').trim() : null,
          declineReason: accepted ? null : String(body.note ?? '').trim() || null,
          editorUrl: `${appUrl()}/estimates/${estimate.id}`,
          accent: theme.accent,
          accentFg: theme.accentFg,
        }),
      });
    }
  } catch (err) {
    console.error('Response notification failed:', err);
  }

  return NextResponse.json({ ok: true, status: action === 'accept' ? 'accepted' : 'declined' });
}
