import { NextResponse, type NextRequest } from 'next/server';

import { appUrl } from '@/lib/config';
import { sendEstimateEmail } from '@/lib/email/send-estimate';
import { loadEstimateForUser } from '@/lib/estimate-data';
import { renderEstimatePdf } from '@/lib/pdf/render';
import { createClient } from '@/lib/supabase/server';
import { getTheme } from '@/lib/trades';

export const runtime = 'nodejs';

/** Email the estimate to the customer (PDF attached) and mark it Sent. */
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
      businessName: business.name,
      customerName: estimate.customer_name,
      total: estimate.total,
      publicUrl,
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

  // Mark as Sent — but never undo an Accepted/Declined estimate.
  if (estimate.status !== 'accepted' && estimate.status !== 'declined') {
    const supabase = createClient();
    await supabase.from('estimates').update({ status: 'sent' }).eq('id', estimate.id);
  }

  return NextResponse.json({ ok: true });
}
