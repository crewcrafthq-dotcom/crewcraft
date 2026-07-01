'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calculator,
  ClipboardList,
  Copy,
  ListTree,
  Save,
  Trash2,
  User,
  Wand2,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Label, Textarea } from '@/components/ui/Field';
import { toast } from '@/components/ui/toast';
import { computeTotals } from '@/lib/estimates';
import { money } from '@/lib/format';
import type { Business, EstimateWithItems, GeneratedEstimate } from '@/lib/types';

import { JobDescriptionBox } from './JobDescriptionBox';
import { LineItemsEditor } from './LineItemsEditor';
import { ShareActions } from './ShareActions';
import { TotalsPanel } from './TotalsPanel';
import { newRow, type EditorRow } from './types';
import {
  deleteEstimate,
  duplicateEstimate,
  saveEstimate,
  type SaveEstimatePayload,
} from '@/app/estimates/actions';

function rowsFromEstimate(estimate: EstimateWithItems): EditorRow[] {
  if (estimate.line_items.length === 0) return [newRow('labor')];
  return estimate.line_items.map((li) => ({
    key: Math.random().toString(36).slice(2),
    category: li.category,
    description: li.description,
    quantity: String(li.quantity),
    unit: li.unit,
    unitPrice: String(li.unit_price),
  }));
}

export function EstimateEditor({
  business,
  estimate,
}: {
  business: Business;
  estimate: EstimateWithItems;
}) {
  const router = useRouter();

  const [customerName, setCustomerName] = useState(estimate.customer_name ?? '');
  const [customerAddress, setCustomerAddress] = useState(estimate.customer_address ?? '');
  const [customerPhone, setCustomerPhone] = useState(estimate.customer_phone ?? '');
  const [customerEmail, setCustomerEmail] = useState(estimate.customer_email ?? '');

  const [jobDescription, setJobDescription] = useState('');
  const [scope, setScope] = useState(estimate.scope_of_work ?? '');
  const [assumptions, setAssumptions] = useState<string[]>([]);
  const [rows, setRows] = useState<EditorRow[]>(() => rowsFromEstimate(estimate));
  const [taxRate, setTaxRate] = useState(
    String(estimate.tax_rate ?? business.default_tax_rate ?? 0),
  );
  const [deposit, setDeposit] = useState(estimate.deposit ? String(estimate.deposit) : '');
  const [notes, setNotes] = useState(estimate.notes ?? '');

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const totals = useMemo(
    () =>
      computeTotals(
        rows.map((r) => ({
          quantity: Number(r.quantity) || 0,
          unitPrice: Number(r.unitPrice) || 0,
        })),
        Number(taxRate) || 0,
        Number(deposit) || 0,
      ),
    [rows, taxRate, deposit],
  );

  function buildPayload(): SaveEstimatePayload {
    return {
      customer_name: customerName,
      customer_address: customerAddress,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      scope_of_work: scope,
      tax_rate: Number(taxRate) || 0,
      deposit: Number(deposit) || 0,
      notes,
      line_items: rows.map((r) => ({
        category: r.category,
        description: r.description,
        quantity: Number(r.quantity) || 0,
        unit: r.unit,
        unit_price: Number(r.unitPrice) || 0,
      })),
    };
  }

  async function saveNow(): Promise<boolean> {
    setSaving(true);
    setSaveError(null);
    const res = await saveEstimate(estimate.id, buildPayload());
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      toast('Saved.');
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
      return true;
    }
    setSaveError(res.error);
    toast(res.error, 'error');
    return false;
  }

  async function buildLineItems() {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });
      const json = await res.json();
      if (!res.ok) {
        setAiError(json.error ?? "couldn't read that — try rephrasing the job");
        return;
      }
      const data = json as GeneratedEstimate;
      setScope(data.scopeOfWork ?? '');
      setAssumptions(data.assumptions ?? []);
      setRows(
        (data.lineItems ?? []).map((li) => ({
          key: Math.random().toString(36).slice(2),
          category: li.category,
          description: li.description,
          quantity: String(li.quantity),
          unit: li.unit,
          unitPrice: String(li.unitPrice),
        })),
      );
      toast('Line items ready.');
    } catch {
      setAiError('Something went wrong. Try again.');
    } finally {
      setAiLoading(false);
    }
  }

  async function onDuplicate() {
    await duplicateEstimate(estimate.id);
  }

  async function onDelete() {
    if (window.confirm('Delete this estimate? This can’t be undone.')) {
      await deleteEstimate(estimate.id);
    }
  }

  return (
    <div className="pb-28">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/estimates"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-mist-soft transition hover:text-mist"
        >
          <ArrowLeft className="h-4 w-4" />
          Estimates
        </Link>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={onDuplicate}>
            <Copy />
            Duplicate
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete}>
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        {/* customer */}
        <Card className="p-5">
          <SectionTitle icon={User}>Customer</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer name" />
            </Field>
            <Field label="Phone">
              <Input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="(555) 123-4567" />
            </Field>
            <Field label="Email">
              <Input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="customer@email.com" />
            </Field>
            <Field label="Address">
              <Input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Job address" />
            </Field>
          </div>
        </Card>

        {/* job description → AI */}
        <Card className="p-5">
          <SectionTitle icon={Wand2}>The job</SectionTitle>
          <JobDescriptionBox
            value={jobDescription}
            onChange={setJobDescription}
            onBuild={buildLineItems}
            loading={aiLoading}
            error={aiError}
          />
        </Card>

        {/* scope of work */}
        <Card className="p-5">
          <Label htmlFor="scope">Scope of work</Label>
          <Textarea
            id="scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            rows={3}
            placeholder="A short, plain summary of the work for the customer."
          />
        </Card>

        {/* assumptions to confirm — above line items */}
        {assumptions.length > 0 ? (
          <Card className="border-accent/40 bg-accent/10 p-5">
            <SectionTitle icon={ClipboardList} accent>
              Assumptions to confirm
            </SectionTitle>
            <ul className="space-y-1.5 text-sm text-mist-soft">
              {assumptions.map((a, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {/* line items */}
        <Card className="p-5">
          <SectionTitle icon={ListTree}>Line items</SectionTitle>
          <LineItemsEditor rows={rows} onChange={setRows} />
        </Card>

        {/* totals */}
        <Card className="p-5">
          <SectionTitle icon={Calculator}>Totals</SectionTitle>
          <TotalsPanel
            totals={totals}
            taxRate={taxRate}
            onTaxRate={setTaxRate}
            deposit={deposit}
            onDeposit={setDeposit}
          />
        </Card>

        {/* notes / terms */}
        <Card className="p-5">
          <Label htmlFor="notes">Notes & terms</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Payment terms, warranty, anything the customer should know."
          />
        </Card>

        {/* share */}
        <Card className="p-5">
          <ShareActions
            estimateId={estimate.id}
            publicToken={estimate.public_token}
            status={estimate.status}
            hasCustomerEmail={Boolean(customerEmail.trim())}
            saveNow={saveNow}
          />
        </Card>
      </div>

      {/* sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-hairline bg-night-900/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="text-sm">
            <span className="text-mist-mute">Total</span>{' '}
            <span className="text-base font-bold text-mist">{money(totals.total)}</span>
            {saveError ? <span className="ml-3 text-red-600">{saveError}</span> : null}
            {saved ? <span className="ml-3 font-medium text-emerald-600">Saved</span> : null}
          </div>
          <Button onClick={saveNow} disabled={saving}>
            <Save />
            {saving ? 'Saving…' : 'Save draft'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  accent,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <h2
      className={
        'mb-4 flex items-center gap-2 font-semibold ' + (accent ? 'text-accent-bright' : 'text-mist')
      }
    >
      <Icon className={'h-[18px] w-[18px] ' + (accent ? 'text-accent-bright' : 'text-mist-mute')} />
      {children}
    </h2>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
