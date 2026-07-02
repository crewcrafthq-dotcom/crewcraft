import { NextResponse, type NextRequest } from 'next/server';

import { appUrl } from '@/lib/config';
import { sendEstimateEmail } from '@/lib/email/send-estimate';
import { loadEstimateForUser } from '@/lib/estimate-data';
import { renderEstimatePdf } from '@/lib/pdf/render';
import { createClient } from '@/lib/supabase/server';
import { getTheme } from '@/lib/trades';

export const runtime = 'nodejs';

/** Email the estimate or invoice to the customer (PDF attached) and mark it Sent. */
export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const bundle = await loadEstimateForUser(params.id);
  if (!bundle) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  const { business, estimate } = bundle;
  if (!estimate.customer_email) {
    return NextResponse.json({ error: 'Add the customer’s email first.' }, { status: 400 });
  }

  const theme = getTheme(business.trade);
  const publicUrl = `${appUrl()}/e/${estimate.public_token}`;

  try {
    const pdf = await renderEstimatePdf(business, estimate);
    await sendEstimateEmail({
      to: estimate.customer_email,
      kind: estimate.kind,
      businessName: business.name,
      customerName: estimate.customer_name,
      total: estimate.total,
      publicUrl,
      dueDate: estimate.due_date,
      pdf,
      accent: theme.accent,
      accentFg: theme.accentFg,
    });
  } catch (err) {
    console.error('Estimate email failed:', err);
    return NextResponse.json(
      { error: 'Email didn’t go through. Check the address and try again.' },
      { status: 502 },
    );
  }

  // Mark as Sent — but never undo an Accepted/Declined/Paid document.
  const supabase = createClient();
  const terminal = ['accepted', 'declined', 'paid'].includes(estimate.status);
  const patch: Record<string, unknown> = { sent_at: new Date().toISOString() };
  if (!terminal) patch.status = 'sent';
  await supabase.from('estimates').update(patch).eq('id', estimate.id);

  return NextResponse.json({ ok: true });
}
