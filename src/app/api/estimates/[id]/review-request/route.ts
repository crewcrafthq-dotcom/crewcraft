import { NextResponse, type NextRequest } from 'next/server';

import { sendAppEmail } from '@/lib/email/send';
import { reviewRequestEmailHtml } from '@/lib/email/templates';
import { loadEstimateForUser } from '@/lib/estimate-data';
import { createClient } from '@/lib/supabase/server';
import { getTheme } from '@/lib/trades';

export const runtime = 'nodejs';

/** Send the customer a "leave us a review" email after the job is won. */
export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const bundle = await loadEstimateForUser(params.id);
  if (!bundle) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const { business, estimate } = bundle;
  if (!business.review_link) {
    return NextResponse.json(
      { error: 'Add your review link in Settings first.' },
      { status: 400 },
    );
  }
  if (!estimate.customer_email) {
    return NextResponse.json({ error: 'Add the customer’s email first.' }, { status: 400 });
  }
  if (!['accepted', 'paid'].includes(estimate.status)) {
    return NextResponse.json(
      { error: 'Ask for a review once the job is accepted or paid.' },
      { status: 400 },
    );
  }

  const theme = getTheme(business.trade);
  try {
    await sendAppEmail({
      to: estimate.customer_email,
      fromName: business.name,
      subject: `How did we do? — ${business.name}`,
      html: reviewRequestEmailHtml({
        businessName: business.name,
        customerName: estimate.customer_name,
        reviewUrl: business.review_link,
        accent: theme.accent,
        accentFg: theme.accentFg,
      }),
    });
  } catch (err) {
    console.error('Review request email failed:', err);
    return NextResponse.json(
      { error: 'Email didn’t go through. Check the address and try again.' },
      { status: 502 },
    );
  }

  const supabase = createClient();
  await supabase
    .from('estimates')
    .update({ review_requested_at: new Date().toISOString() })
    .eq('id', estimate.id);

  return NextResponse.json({ ok: true });
}
