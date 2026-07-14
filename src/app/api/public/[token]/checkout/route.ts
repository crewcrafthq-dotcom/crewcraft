import { NextResponse, type NextRequest } from 'next/server';

import { appUrl } from '@/lib/config';
import { computeTotals, docNumber } from '@/lib/estimates';
import { loadEstimateByToken } from '@/lib/estimate-data';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

/**
 * Public checkout by token: the homeowner pays the deposit (accepted estimate)
 * or the open balance (unpaid invoice) through the contractor's connected
 * Stripe account (direct charge — the money and the dispute liability are
 * theirs, not the platform's). Returns the hosted Checkout URL.
 */
export async function POST(_request: NextRequest, { params }: { params: { token: string } }) {
  const bundle = await loadEstimateByToken(params.token);
  if (!bundle) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const { business, estimate } = bundle;
  if (!business.stripe_account_id || !business.stripe_charges_enabled) {
    return NextResponse.json({ error: 'Online payment isn’t set up.' }, { status: 400 });
  }

  const totals = computeTotals(
    estimate.line_items.map((i) => ({ quantity: i.quantity, unitPrice: i.unit_price })),
    estimate.tax_rate,
    estimate.deposit,
  );

  const invoice = estimate.kind === 'invoice';
  let amount: number; // dollars
  let label: string;

  if (invoice) {
    if (estimate.status === 'paid') {
      return NextResponse.json({ error: 'This invoice is already paid.' }, { status: 400 });
    }
    amount = totals.balanceDue > 0 ? totals.balanceDue : totals.total;
    label = `Invoice ${docNumber('invoice', estimate.id)} — ${business.name}`;
  } else {
    if (estimate.status !== 'accepted') {
      return NextResponse.json({ error: 'Accept the estimate first.' }, { status: 400 });
    }
    if (estimate.deposit_paid_at) {
      return NextResponse.json({ error: 'The deposit is already paid.' }, { status: 400 });
    }
    amount = totals.depositDue;
    label = `Deposit — ${docNumber('estimate', estimate.id)} — ${business.name}`;
  }

  const cents = Math.round(amount * 100);
  if (cents < 50) {
    // Stripe's minimum charge; anything this small isn't a real deposit/balance.
    return NextResponse.json({ error: 'Nothing due to pay online.' }, { status: 400 });
  }

  const publicUrl = `${appUrl()}/e/${estimate.public_token}`;

  try {
    const session = await getStripe().checkout.sessions.create(
      {
        mode: 'payment',
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'usd',
              unit_amount: cents,
              product_data: { name: label },
            },
          },
        ],
        customer_email: estimate.customer_email ?? undefined,
        metadata: {
          crewcraft_estimate_id: estimate.id,
          crewcraft_kind: estimate.kind,
        },
        payment_intent_data: {
          description: label,
          metadata: {
            crewcraft_estimate_id: estimate.id,
            crewcraft_kind: estimate.kind,
          },
        },
        success_url: `${publicUrl}?paid=1`,
        cancel_url: publicUrl,
      },
      // Direct charge on the contractor's account.
      { stripeAccount: business.stripe_account_id },
    );
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Public checkout failed:', err);
    return NextResponse.json(
      { error: 'Could not start the payment. Try again.' },
      { status: 502 },
    );
  }
}
