import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { TradeTheme } from '@/components/TradeTheme';
import { buttonClasses } from '@/components/ui/Button';
import { CATEGORY_LABELS, computeTotals, groupByCategory } from '@/lib/estimates';
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
  const groups = groupByCategory(estimate.line_items);
  const totals = computeTotals(
    estimate.line_items.map((i) => ({ quantity: i.quantity, unitPrice: i.unit_price })),
    estimate.tax_rate,
    estimate.deposit,
  );
  const contact = [business.phone, business.email].filter(Boolean).join('  ·  ');

  return (
    <TradeTheme trade={business.trade} className="min-h-screen">
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
            <p className="text-xl font-bold tracking-wide text-accent-deep">ESTIMATE</p>
            <p className="text-sm text-navy-soft">{shortDate(estimate.created_at)}</p>
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
                <Row label="Deposit due" value={money(totals.depositDue)} accent />
                <Row label="Balance due" value={money(totals.balanceDue)} />
              </>
            ) : null}
          </div>
        </section>

        {/* notes */}
        {estimate.notes ? (
          <section className="mb-6 border-t border-line pt-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-navy-muted">
              Notes & terms
            </p>
            <p className="text-sm text-navy-soft">{estimate.notes}</p>
          </section>
        ) : null}

        <div className="mb-8">
          <a
            href={`/api/public/${estimate.public_token}/pdf`}
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
