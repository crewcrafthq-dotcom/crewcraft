import { NextResponse, type NextRequest } from 'next/server';

import { appUrl } from '@/lib/config';
import { sendAppEmail } from '@/lib/email/send';
import { reminderEmailHtml } from '@/lib/email/templates';
import { loadEstimateForUser } from '@/lib/estimate-data';
import { createClient } from '@/lib/supabase/server';
import { getTheme } from '@/lib/trades';

export const runtime = 'nodejs';

/** Manually nudge the customer about an estimate they haven't answered. */
export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const bundle = await loadEstimateForUser(params.id);
  if (!bundle) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const { business, estimate } = bundle;
  if (estimate.kind !== 'estimate') {
    return NextResponse.json({ error: 'Reminders are for estimates.' }, { status: 400 });
  }
  if (!estimate.customer_email) {
    return NextResponse.json({ error: 'Add the customer’s email first.' }, { status: 400 });
  }
  if (!['sent', 'viewed'].includes(estimate.status)) {
    return NextResponse.json(
      { error: 'Reminders only make sense for sent estimates.' },
      { status: 400 },
    );
  }

  const theme = getTheme(business.trade);
  try {
    await sendAppEmail({
      to: estimate.customer_email,
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
  } catch (err) {
    console.error('Reminder email failed:', err);
    return NextResponse.json(
      { error: 'Email didn’t go through. Check the address and try again.' },
      { status: 502 },
    );
  }

  const supabase = createClient();
  await supabase
    .from('estimates')
    .update({
      last_reminder_at: new Date().toISOString(),
      reminder_count: (estimate.reminder_count ?? 0) + 1,
    })
    .eq('id', estimate.id);

  return NextResponse.json({ ok: true });
}
