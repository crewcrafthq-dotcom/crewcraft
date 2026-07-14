'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Copy,
  Languages,
  Layers3,
  ListTree,
  Save,
  Trash2,
  User,
  Wand2,
  XCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Label, Select, Textarea } from '@/components/ui/Field';
import { toast } from '@/components/ui/toast';
import { computeTotals } from '@/lib/estimates';
import { money, shortDate } from '@/lib/format';
import { PDF_LANGUAGES, normalizeLang } from '@/lib/pdf/languages';
import type {
  Business,
  EstimateWithItems,
  GeneratedEstimate,
  GeneratedTier,
  GeneratedTiers,
} from '@/lib/types';

import { JobDescriptionBox } from './JobDescriptionBox';
import { LineItemsEditor } from './LineItemsEditor';
import { ShareActions } from './ShareActions';
import { TotalsPanel } from './TotalsPanel';
import { fileToEditorPhoto, photoPayload, type EditorPhoto } from './photos';
import { newRow, type EditorRow } from './types';
import {
  deleteEstimate,
  duplicateEstimate,
  saveEstimate,
  type SaveEstimatePayload,
} from '@/app/estimates/actions';
import { AI_MAX_PHOTOS } from '@/lib/config';

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

function rowsFromGenerated(items: GeneratedEstimate['lineItems']): EditorRow[] {
  return items.map((li) => ({
    key: Math.random().toString(36).slice(2),
    category: li.category,
    description: li.description,
    quantity: String(li.quantity),
    unit: li.unit,
    unitPrice: String(li.unitPrice),
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
  const invoice = estimate.kind === 'invoice';

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
  const [dueDate, setDueDate] = useState(estimate.due_date ?? '');
  const [pdfLanguage, setPdfLanguage] = useState(normalizeLang(estimate.pdf_language));

  const [photos, setPhotos] = useState<EditorPhoto[]>([]);
  const [tiersMode, setTiersMode] = useState(false);
  const [tierOptions, setTierOptions] = useState<GeneratedTier[] | null>(null);

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
      due_date: invoice ? dueDate : '',
      pdf_language: pdfLanguage,
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

  async function addPhotos(files: FileList) {
    const room = AI_MAX_PHOTOS - photos.length;
    const picked = Array.from(files).slice(0, Math.max(0, room));
    const converted = await Promise.all(picked.map(fileToEditorPhoto));
    const good = converted.filter((p): p is EditorPhoto => p !== null);
    if (good.length < picked.length) toast('Some photos couldn’t be read.', 'error');
    if (good.length > 0) setPhotos((prev) => [...prev, ...good]);
  }

  async function buildLineItems() {
    setAiLoading(true);
    setAiError(null);
    setTierOptions(null);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          photos: photoPayload(photos),
          tiers: tiersMode,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setAiError(json.error ?? "couldn't read that — try rephrasing the job");
        return;
      }
      if (tiersMode) {
        const data = json as GeneratedTiers;
        setTierOptions(data.tiers ?? []);
        toast('Three options ready — pick one.');
      } else {
        const data = json as GeneratedEstimate;
        setScope(data.scopeOfWork ?? '');
        setAssumptions(data.assumptions ?? []);
        setRows(rowsFromGenerated(data.lineItems ?? []));
        toast('Line items ready.');
      }
    } catch {
      setAiError('Something went wrong. Try again.');
    } finally {
      setAiLoading(false);
    }
  }

  function applyTier(tier: GeneratedTier) {
    setScope(tier.scopeOfWork ?? '');
    setAssumptions(tier.assumptions ?? []);
    setRows(rowsFromGenerated(tier.lineItems ?? []));
    setTierOptions(null);
    toast(`Loaded the “${tier.name}” option.`);
  }

  async function onDuplicate() {
    await duplicateEstimate(estimate.id);
  }

  async function onDelete() {
    if (window.confirm(`Delete this ${invoice ? 'invoice' : 'estimate'}? This can’t be undone.`)) {
      await deleteEstimate(estimate.id);
    }
  }

  return (
    <div className="pb-28">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={invoice ? '/invoices' : '/estimates'}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          {invoice ? 'Invoices' : 'Estimates'}
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
        {/* customer response — the e-sign record */}
        {!invoice && estimate.status === 'accepted' && estimate.signed_name ? (
          <Card className="border-emerald-500/25 bg-emerald-500/10 p-5">
            <p className="flex items-center gap-2 font-semibold text-ok">
              <CheckCircle2 className="h-[18px] w-[18px]" />
              Accepted by {estimate.signed_name}
            </p>
            {estimate.accepted_at ? (
              <p className="mt-1 text-sm text-ink-soft">
                Signed electronically on {shortDate(estimate.accepted_at)}.
              </p>
            ) : null}
            {estimate.deposit_paid_at ? (
              <p className="mt-1 text-sm font-medium text-ok">
                Deposit paid online {shortDate(estimate.deposit_paid_at)}.
              </p>
            ) : null}
          </Card>
        ) : null}
        {!invoice && estimate.status === 'declined' ? (
          <Card className="border-red-500/25 bg-red-500/10 p-5">
            <p className="flex items-center gap-2 font-semibold text-bad">
              <XCircle className="h-[18px] w-[18px]" />
              Declined{estimate.declined_at ? ` on ${shortDate(estimate.declined_at)}` : ''}
            </p>
            {estimate.decline_reason ? (
              <p className="mt-1 text-sm text-ink-soft">“{estimate.decline_reason}”</p>
            ) : null}
          </Card>
        ) : null}

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

        {/* invoice details */}
        {invoice ? (
          <Card className="p-5">
            <SectionTitle icon={CalendarDays}>Invoice details</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Due date">
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </Field>
              {estimate.paid_at ? (
                <div className="self-end pb-2 text-sm text-ok">
                  Paid {shortDate(estimate.paid_at)}
                </div>
              ) : null}
            </div>
          </Card>
        ) : null}

        {/* job description → AI (estimates only) */}
        {!invoice ? (
          <Card className="p-5">
            <SectionTitle icon={Wand2}>The job</SectionTitle>
            <JobDescriptionBox
              value={jobDescription}
              onChange={setJobDescription}
              onBuild={buildLineItems}
              loading={aiLoading}
              error={aiError}
              photos={photos}
              onAddPhotos={addPhotos}
              onRemovePhoto={(key) => setPhotos((prev) => prev.filter((p) => p.key !== key))}
              tiersMode={tiersMode}
              onTiersMode={setTiersMode}
            />
          </Card>
        ) : null}

        {/* good / better / best picker */}
        {tierOptions && tierOptions.length > 0 ? (
          <Card className="border-accent/40 bg-accent/10 p-5">
            <SectionTitle icon={Layers3} accent>
              Pick an option
            </SectionTitle>
            <div className="grid gap-3 sm:grid-cols-3">
              {tierOptions.map((tier) => {
                const t = computeTotals(
                  tier.lineItems.map((li) => ({ quantity: li.quantity, unitPrice: li.unitPrice })),
                  Number(taxRate) || 0,
                  0,
                );
                return (
                  <div
                    key={tier.name}
                    className="flex flex-col rounded-xl border border-hairline bg-paper-850 p-4"
                  >
                    <p className="font-bold text-ink">{tier.name}</p>
                    <p className="mt-1 text-xl font-bold text-accent-bright">{money(t.total)}</p>
                    <p className="mb-3 mt-1 flex-1 text-sm text-ink-soft">
                      {tier.lineItems.length} line {tier.lineItems.length === 1 ? 'item' : 'items'}
                    </p>
                    <Button type="button" size="sm" onClick={() => applyTier(tier)}>
                      Use this option
                    </Button>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setTierOptions(null)}
              className="mt-3 text-sm text-ink-mute underline-offset-2 hover:underline"
            >
              Dismiss
            </button>
          </Card>
        ) : null}

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
            <ul className="space-y-1.5 text-sm text-ink-soft">
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

        {/* PDF language */}
        <Card className="p-5">
          <SectionTitle icon={Languages}>PDF language</SectionTitle>
          <div className="grid gap-2 sm:max-w-sm">
            <Select value={pdfLanguage} onChange={(e) => setPdfLanguage(e.target.value)}>
              {PDF_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </Select>
            <p className="text-sm text-ink-mute">
              The {invoice ? 'invoice' : 'estimate'} PDF is generated in this language — labels and
              your typed scope, line items, and notes. Prices stay as entered.
            </p>
          </div>
        </Card>

        {/* share */}
        <Card className="p-5">
          <ShareActions
            estimate={estimate}
            hasCustomerEmail={Boolean(customerEmail.trim())}
            hasReviewLink={Boolean(business.review_link)}
            saveNow={saveNow}
          />
        </Card>
      </div>

      {/* sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-hairline bg-paper-900/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="text-sm">
            <span className="text-ink-mute">Total</span>{' '}
            <span className="text-base font-bold text-ink">{money(totals.total)}</span>
            {saveError ? <span className="ml-3 text-bad">{saveError}</span> : null}
            {saved ? <span className="ml-3 font-medium text-ok">Saved</span> : null}
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
        'mb-4 flex items-center gap-2 font-semibold ' + (accent ? 'text-accent-bright' : 'text-ink')
      }
    >
      <Icon className={'h-[18px] w-[18px] ' + (accent ? 'text-accent-bright' : 'text-ink-mute')} />
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
