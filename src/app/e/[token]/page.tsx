import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BadgeCheck, CreditCard } from 'lucide-react';

import { TradeTheme } from '@/components/TradeTheme';
import { PayButton } from '@/components/public/PayButton';
import { ResponsePanel } from '@/components/public/ResponsePanel';
import { buttonClasses } from '@/components/ui/Button';
import { ESTIMATE_VALID_DAYS } from '@/lib/config';
import { CATEGORY_LABELS, computeTotals, docNumber, groupByCategory } from '@/lib/estimates';
import { loadEstimateByToken, markViewedByToken } from '@/lib/estimate-data';
import { money, shortDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

// Keep customer estimates out of search engines.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PublicEstimatePage({ params }: { params: { token: string } }) {
  const bundle = await loadEstimateByToken(params.token);
  if (!bundle) notFound();

  // First open flips Sent → Viewed (once).
  await markViewedByToken(params.token);

  const { business, estimate } = bundle;
  const invoice = estimate.kind === 'invoice';
  const paid = invoice && estimate.status === 'paid';
  const groups = groupByCategory(estimate.line_items);
  const totals = computeTotals(
    estimate.line_items.map((i) => ({ quantity: i.quantity, unitPrice: i.unit_price })),
    estimate.tax_rate,
    estimate.deposit,
  );
  const contact = [business.phone, business.email].filter(Boolean).join('  ·  ');

  // What (if anything) we're asking the customer to pay right now.
  const amountDue = invoice
    ? totals.balanceDue > 0
      ? totals.balanceDue
      : totals.total
    : totals.depositDue;
  const depositPaid = !invoice && Boolean(estimate.deposit_paid_at);
  const showPay =
    !depositPaid &&
    ((invoice && !paid) || (!invoice && estimate.status === 'accepted' && totals.depositDue > 0));
  // Integrated checkout (Stripe Connect) wins; the manual link/instructions
  // remain the fallback for contractors who haven't connected.
  const hasCheckout = Boolean(business.stripe_account_id && business.stripe_charges_enabled);
  const hasPayMethod =
    hasCheckout || Boolean(business.payment_link || business.payment_instructions);

  return (
    // The customer page keeps the light "paper" look (§8 cream) — the app's
    // dark shell never applies here, so force the light canvas + navy ink the
    // navy/cream text tokens below are designed for.
    <TradeTheme trade={business.trade} className="min-h-screen bg-cream text-navy">
      <main className="mx-auto max-w-2xl px-5 py-8">
        {/* header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            {business.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={business.logo_url}
                alt={business.name}
                className="mb-2 h-12 max-w-[180px] object-contain"
              />
            ) : null}
            <p className="text-lg font-bold">{business.name}</p>
            {business.address ? <p className="text-sm text-navy-soft">{business.address}</p> : null}
            {contact ? <p className="text-sm text-navy-soft">{contact}</p> : null}
          </div>
          <div className="text-right">
            <p className="text-xl font-bold tracking-wide text-accent-deep">
              {invoice ? 'INVOICE' : 'ESTIMATE'}
            </p>
            <p className="text-sm text-navy-soft">{shortDate(estimate.created_at)}</p>
            <p className="text-sm text-navy-muted">{docNumber(estimate.kind, estimate.id)}</p>
            {invoice && estimate.due_date ? (
              <p className="text-sm text-navy-soft">Due {shortDate(estimate.due_date)}</p>
            ) : null}
            {!invoice && !['accepted', 'declined'].includes(estimate.status) ? (
              <p className="text-sm text-navy-soft">
                Valid until {shortDate(validUntil(estimate.created_at))}
              </p>
            ) : null}
            {paid ? (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold tracking-wide text-emerald-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                PAID
              </span>
            ) : null}
          </div>
        </div>

        <div className="my-5 h-1 rounded-full bg-accent" />

        {/* customer */}
        <section className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-muted">Prepared for</p>
          <p className="text-base font-semibold">{estimate.customer_name || 'Customer'}</p>
          {estimate.customer_address ? (
            <p className="text-sm text-navy-soft">{estimate.customer_address}</p>
          ) : null}
          {estimate.customer_phone ? (
            <p className="text-sm text-navy-soft">{estimate.customer_phone}</p>
          ) : null}
          {estimate.customer_email ? (
            <p className="text-sm text-navy-soft">{estimate.customer_email}</p>
          ) : null}
        </section>

        {/* scope */}
        {estimate.scope_of_work ? (
          <section className="mb-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-navy-muted">
              Scope of work
            </p>
            <p className="text-navy">{estimate.scope_of_work}</p>
          </section>
        ) : null}

        {/* line items */}
        <section className="mb-6 rounded-2xl border border-line bg-cream-card p-5">
          {groups.map((group) => (
            <div key={group.category} className="mb-4 last:mb-0">
              <p className="mb-2 text-sm font-bold text-accent-deep">
                {CATEGORY_LABELS[group.category]}
              </p>
              <div className="divide-y divide-line">
                {group.items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4 py-2">
                    <div className="min-w-0">
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-navy-muted">
                        {trimNum(item.quantity)} {item.unit} × {money(item.unit_price)}
                      </p>
                    </div>
                    <span className="flex-none font-semibold">{money(item.line_total)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* totals */}
        <section className="mb-6">
          <div className="ml-auto max-w-xs space-y-2">
            <Row label="Subtotal" value={money(totals.subtotal)} />
            <Row label={`Tax (${trimNum(estimate.tax_rate)}%)`} value={money(totals.taxAmount)} />
            <div className="flex items-center justify-between rounded-xl bg-accent px-4 py-3 text-accent-fg">
              <span className="font-bold">Total</span>
              <span className="text-lg font-bold">{money(totals.total)}</span>
            </div>
            {totals.depositDue > 0 ? (
              <>
                <Row
                  label={invoice ? 'Deposit received' : 'Deposit due'}
                  value={money(totals.depositDue)}
                  accent
                />
                <Row label="Balance due" value={money(totals.balanceDue)} />
              </>
            ) : null}
          </div>
        </section>

        {/* accept / decline — estimates only */}
        {!invoice ? (
          <ResponsePanel
            token={estimate.public_token}
            status={estimate.status}
            signedName={estimate.signed_name}
            acceptedAt={estimate.accepted_at}
            declinedAt={estimate.declined_at}
          />
        ) : null}

        {/* deposit already collected */}
        {depositPaid ? (
          <section className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="flex items-center gap-2 font-semibold text-emerald-700">
              <BadgeCheck className="h-5 w-5" />
              Deposit paid — thank you!
            </p>
            <p className="mt-1 text-sm text-emerald-700/90">
              {money(totals.depositDue)} received {shortDate(estimate.deposit_paid_at as string)}.
              The balance of {money(totals.balanceDue)} is due on completion.
            </p>
          </section>
        ) : null}

        {/* how to pay */}
        {showPay && hasPayMethod ? (
          <section className="mb-6 rounded-2xl border border-line bg-cream-card p-5">
            <p className="mb-1 flex items-center gap-2 font-semibold text-navy">
              <CreditCard className="h-[18px] w-[18px] text-accent-deep" />
              {invoice ? 'Pay this invoice' : 'Pay your deposit'}
            </p>
            <p className="mb-3 text-sm text-navy-soft">
              {invoice
                ? `${money(amountDue)} due${estimate.due_date ? ` by ${shortDate(estimate.due_date)}` : ''}.`
                : `A deposit of ${money(amountDue)} locks in the job.`}
            </p>
            {hasCheckout ? (
              <PayButton
                token={estimate.public_token}
                label={`Pay ${money(amountDue)} online`}
              />
            ) : business.payment_link ? (
              <a
                href={business.payment_link}
                target="_blank"
                rel="noreferrer"
                className={buttonClasses('primary', 'md')}
              >
                Pay online
              </a>
            ) : null}
            {business.payment_instructions ? (
              <p className="mt-3 whitespace-pre-line text-sm text-navy-soft">
                {business.payment_instructions}
              </p>
            ) : null}
          </section>
        ) : null}

        <div className="mb-8">
          <a
            href={`/api/public/${estimate.public_token}/pdf?download=1`}
            download
            className={buttonClasses('secondary', 'md')}
          >
            Download PDF
          </a>
        </div>

        <footer className="border-t border-line pt-4 text-sm text-navy-muted">
          {business.license ? <span>License {business.license}</span> : <span>{business.name}</span>}
          {contact ? <span className="block">{contact}</span> : null}
        </footer>
      </main>
    </TradeTheme>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-navy-soft">{label}</span>
      <span className={accent ? 'font-medium text-accent-deep' : 'font-medium'}>{value}</span>
    </div>
  );
}

function trimNum(n: number): string {
  const v = Number(n) || 0;
  return Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100);
}

function validUntil(createdAt: string): Date {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + ESTIMATE_VALID_DAYS);
  return d;
}
