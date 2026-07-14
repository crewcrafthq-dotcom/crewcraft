import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  FilePlus2,
  FileText,
  Mail,
  MapPin,
  Phone,
  Receipt,
} from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { StatusBadge } from '@/components/StatusBadge';
import { Card } from '@/components/ui/Card';
import { buttonClasses } from '@/components/ui/Button';
import { getSession } from '@/lib/auth';
import {
  buildCustomers,
  decodeCustomerKey,
  docsForCustomer,
  type CustomerDoc,
} from '@/lib/customers';
import { money, shortDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailPage({ params }: { params: { key: string } }) {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const key = decodeCustomerKey(params.key);
  if (!key) notFound();

  const supabase = createClient();
  const { data } = await supabase
    .from('estimates')
    .select(
      'id, kind, customer_name, customer_email, customer_phone, customer_address, status, total, created_at, updated_at',
    )
    .eq('user_id', user.id);

  const all = (data ?? []) as CustomerDoc[];
  const docs = docsForCustomer(all, key);
  if (docs.length === 0) notFound();

  const summary = buildCustomers(docs)[0];

  return (
    <AppShell trade={business.trade} businessName={business.name} width="narrow">
      <Link
        href="/customers"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Customers
      </Link>

      <Card className="mb-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">{summary.name}</h1>
            <div className="mt-2 space-y-1 text-sm text-ink-soft">
              {summary.email ? (
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-ink-mute" />
                  <a href={`mailto:${summary.email}`} className="hover:text-ink">
                    {summary.email}
                  </a>
                </p>
              ) : null}
              {summary.phone ? (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-ink-mute" />
                  <a href={`tel:${summary.phone}`} className="hover:text-ink">
                    {summary.phone}
                  </a>
                </p>
              ) : null}
              {summary.address ? (
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-ink-mute" />
                  {summary.address}
                </p>
              ) : null}
            </div>
          </div>
          <Link href="/estimates/new" className={buttonClasses('secondary', 'sm')}>
            <FilePlus2 />
            New estimate
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-hairline pt-4 text-center">
          <div>
            <p className="text-lg font-bold text-ink">{money(summary.quoted)}</p>
            <p className="text-xs text-ink-mute">Quoted</p>
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-600">{money(summary.won)}</p>
            <p className="text-xs text-ink-mute">Won</p>
          </div>
          <div>
            <p className="text-lg font-bold text-accent-bright">{money(summary.collected)}</p>
            <p className="text-xs text-ink-mute">Collected</p>
          </div>
        </div>
      </Card>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-mute">
        History
      </h2>
      <Card className="divide-y divide-hairline overflow-hidden">
        {docs.map((doc) => {
          const invoice = doc.kind === 'invoice';
          const Icon = invoice ? Receipt : FileText;
          return (
            <Link
              key={doc.id}
              href={invoice ? `/invoices/${doc.id}` : `/estimates/${doc.id}`}
              className="group flex items-center gap-4 px-4 py-3.5 transition duration-150 hover:bg-paper-850"
            >
              <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-paper-700 text-ink-soft transition group-hover:bg-accent/10 group-hover:text-accent-bright">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">
                  {invoice ? 'Invoice' : 'Estimate'}
                </p>
                <p className="text-sm text-ink-mute">{shortDate(doc.created_at)}</p>
              </div>
              <span className="font-semibold text-ink">{money(doc.total)}</span>
              <StatusBadge status={doc.status} />
              <ArrowUpRight className="h-4 w-4 flex-none text-ink-mute opacity-0 transition group-hover:opacity-100" />
            </Link>
          );
        })}
      </Card>
    </AppShell>
  );
}
