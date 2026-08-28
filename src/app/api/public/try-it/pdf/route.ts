import { NextResponse, type NextRequest } from 'next/server';

import { TRY_IT_PDF_IP_DAILY_LIMIT } from '@/lib/config';
import { sendAppEmail } from '@/lib/email/send';
import { tryItEstimateEmailHtml, tryItLeadNotifyHtml } from '@/lib/email/templates';
import { computeTotals, lineTotal } from '@/lib/estimates';
import { renderEstimatePdf } from '@/lib/pdf/render';
import { checkRateLimit, clientIp, recordRateEvent } from '@/lib/rate-limit';
import { getTheme } from '@/lib/trades';
import {
  TRADES,
  type Business,
  type EstimateWithItems,
  type LineItemCategory,
  type Trade,
} from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CATEGORIES: LineItemCategory[] = ['labor', 'materials', 'other'];
const MAX_ITEMS = 40;
const MAX_DESC = 200;
// Deliberately loose: the address only has to be plausible enough to send to.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Emails the homepage demo estimate as a PDF. This is the only place on the
 * marketing site that captures an email, so it is also the site's real Lead
 * event — the visitor gets the document, we get someone to follow up with.
 *
 * The line items arrive from the browser (they were just generated there), so
 * everything is re-sanitized and every total is recomputed with computeTotals.
 */
export async function POST(request: NextRequest) {
  let body: {
    email?: unknown;
    businessName?: unknown;
    trade?: unknown;
    job?: unknown;
    scopeOfWork?: unknown;
    lineItems?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }

  const email = String(body?.email ?? '').trim().slice(0, 200);
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'That email doesn’t look right.' }, { status: 400 });
  }

  const trade = String(body?.trade ?? '') as Trade;
  if (!TRADES.includes(trade)) {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }

  const businessName = String(body?.businessName ?? '').trim().slice(0, 80) || 'Your Company';
  const job = String(body?.job ?? '').trim().slice(0, 600);
  const scope = String(body?.scopeOfWork ?? '').trim().slice(0, 2000);

  const raw = Array.isArray(body?.lineItems) ? body.lineItems.slice(0, MAX_ITEMS) : [];
  const items = raw
    .map((li) => {
      const o = li as Record<string, unknown>;
      const category = String(o?.category ?? 'other');
      return {
        category: (CATEGORIES.includes(category as LineItemCategory)
          ? category
          : 'other') as LineItemCategory,
        description: String(o?.description ?? '').trim().slice(0, MAX_DESC),
        quantity: Number(o?.quantity) || 0,
        unit: String(o?.unit ?? '').trim().slice(0, 24),
        unit_price: Number(o?.unitPrice) || 0,
      };
    })
    .filter((li) => li.description || li.unit_price > 0);

  if (items.length === 0) {
    return NextResponse.json({ error: 'Build an estimate first.' }, { status: 400 });
  }

  // Fail closed: rendering a PDF and sending mail both cost money.
  const ipKey = `try-it-pdf:${clientIp(request.headers)}`;
  const { allowed } = await checkRateLimit(ipKey, TRY_IT_PDF_IP_DAILY_LIMIT, 24 * 60, {
    failClosed: true,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: 'That’s a few for today — start free to send real ones.' },
      { status: 429 },
    );
  }

  const totals = computeTotals(
    items.map((i) => ({ quantity: i.quantity, unitPrice: i.unit_price })),
    0,
    0,
  );

  const now = new Date().toISOString();
  const business = {
    id: 'demo',
    user_id: 'demo',
    trade,
    name: businessName,
    logo_url: null,
    license: null,
    phone: null,
    email: null,
    address: null,
    default_tax_rate: 0,
    default_labor_rate: 0,
    review_link: null,
    payment_link: null,
    payment_instructions: null,
    auto_invoice: false,
    auto_review_request: false,
    lead_token: 'demo',
    stripe_account_id: null,
    stripe_charges_enabled: false,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    plan: 'free',
    subscription_status: null,
    created_at: now,
  } as Business;

  const estimate = {
    id: 'demo',
    user_id: 'demo',
    kind: 'estimate',
    customer_name: 'Sample customer',
    customer_address: null,
    customer_phone: null,
    customer_email: null,
    status: 'draft',
    scope_of_work: scope || job,
    subtotal: totals.subtotal,
    tax_rate: 0,
    tax_amount: 0,
    deposit: 0,
    total: totals.total,
    notes: null,
    public_token: 'demo',
    viewed_at: null,
    signed_name: null,
    accepted_at: null,
    declined_at: null,
    decline_reason: null,
    due_date: null,
    paid_at: null,
    source_estimate_id: null,
    deposit_paid_at: null,
    sent_at: null,
    reminders_enabled: false,
    last_reminder_at: null,
    pdf_language: 'en',
    line_items: items.map((li, index) => ({
      id: `demo-${index}`,
      estimate_id: 'demo',
      category: li.category,
      description: li.description,
      quantity: li.quantity,
      unit: li.unit,
      unit_price: li.unit_price,
      line_total: lineTotal(li.quantity, li.unit_price),
      sort_order: index,
    })),
  } as unknown as EstimateWithItems;

  try {
    const pdf = await renderEstimatePdf(business, estimate);
    const theme = getTheme(trade);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://crewcraftapp.com';

    await sendAppEmail({
      to: email,
      fromName: 'Toolbelt by Crewcraft',
      subject: `Your estimate — ${businessName}`,
      html: tryItEstimateEmailHtml({
        businessName,
        job,
        total: totals.total,
        signupUrl: `${appUrl}/login?mode=signup&utm_source=try-it`,
        accent: theme.accent,
        accentFg: theme.accentFg,
      }),
      attachments: [{ filename: 'estimate.pdf', content: pdf }],
    });

    await recordRateEvent(ipKey);

    // Owner heads-up. Never let a failure here cost the visitor their PDF.
    const owners = (process.env.OWNER_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);
    if (owners.length > 0) {
      try {
        await sendAppEmail({
          to: owners[0]!,
          fromName: 'Toolbelt',
          subject: `Demo lead: ${email}`,
          html: tryItLeadNotifyHtml({
            email,
            businessName,
            trade: theme.label,
            job,
            total: totals.total,
          }),
        });
      } catch (err) {
        console.warn('demo lead notify failed:', err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('try-it PDF send failed:', err);
    return NextResponse.json(
      { error: 'Couldn’t send that. Check the address and try again.' },
      { status: 500 },
    );
  }
}
