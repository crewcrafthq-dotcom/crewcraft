'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { INVOICE_DUE_DAYS } from '@/lib/config';
import { createClient } from '@/lib/supabase/server';
import { computeTotals, lineTotal } from '@/lib/estimates';
import { normalizeLang } from '@/lib/pdf/languages';
import type { EstimateStatus, LineItemCategory } from '@/lib/types';

const CATEGORIES: LineItemCategory[] = ['labor', 'materials', 'other'];

export interface SaveLineItem {
  category: LineItemCategory;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
}

export interface SaveEstimatePayload {
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  customer_email: string;
  scope_of_work: string;
  tax_rate: number;
  deposit: number;
  notes: string;
  /** Invoices only — ISO date (yyyy-mm-dd) or empty. */
  due_date?: string;
  /** Language code for the generated PDF (from PDF_LANGUAGES). */
  pdf_language?: string;
  line_items: SaveLineItem[];
}

export type ActionResult = { ok: true } | { ok: false; error: string };

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function isoDate(v: unknown): string | null {
  const s = String(v ?? '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}

function revalidateDocs(id: string) {
  revalidatePath(`/estimates/${id}`);
  revalidatePath(`/invoices/${id}`);
  revalidatePath('/estimates');
  revalidatePath('/invoices');
  revalidatePath('/dashboard');
}

/** Persist the whole estimate/invoice: header fields, recomputed totals, line items. */
export async function saveEstimate(
  id: string,
  payload: SaveEstimatePayload,
): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'You need to sign in again.' };

  // Sanitize line items; totals are recomputed in code, never trusted.
  const items = payload.line_items
    .map((li) => ({
      category: CATEGORIES.includes(li.category) ? li.category : 'other',
      description: String(li.description ?? '').trim(),
      quantity: num(li.quantity),
      unit: String(li.unit ?? '').trim(),
      unit_price: num(li.unit_price),
    }))
    .filter((li) => li.description || li.unit_price > 0);

  const totals = computeTotals(
    items.map((i) => ({ quantity: i.quantity, unitPrice: i.unit_price })),
    num(payload.tax_rate),
    num(payload.deposit),
  );

  // Update the estimate row (RLS confirms ownership).
  const { error: upErr } = await supabase
    .from('estimates')
    .update({
      customer_name: String(payload.customer_name ?? '').trim(),
      customer_address: String(payload.customer_address ?? '').trim() || null,
      customer_phone: String(payload.customer_phone ?? '').trim() || null,
      customer_email: String(payload.customer_email ?? '').trim() || null,
      scope_of_work: String(payload.scope_of_work ?? '').trim() || null,
      notes: String(payload.notes ?? '').trim() || null,
      tax_rate: num(payload.tax_rate),
      subtotal: totals.subtotal,
      tax_amount: totals.taxAmount,
      total: totals.total,
      deposit: totals.depositDue,
      due_date: isoDate(payload.due_date),
      pdf_language: normalizeLang(payload.pdf_language),
    })
    .eq('id', id)
    .eq('user_id', user.id);
  if (upErr) return { ok: false, error: 'Could not save. Try again.' };

  // Replace line items wholesale (simplest correct approach for the editor).
  await supabase.from('line_items').delete().eq('estimate_id', id);
  if (items.length > 0) {
    const rows = items.map((li, index) => ({
      estimate_id: id,
      category: li.category,
      description: li.description,
      quantity: li.quantity,
      unit: li.unit,
      unit_price: li.unit_price,
      line_total: lineTotal(li.quantity, li.unit_price),
      sort_order: index,
    }));
    const { error: insErr } = await supabase.from('line_items').insert(rows);
    if (insErr) return { ok: false, error: 'Line items could not be saved.' };
  }

  revalidateDocs(id);
  return { ok: true };
}

/** Manual status changes (Accepted / Declined / Paid / back to Draft). */
export async function setEstimateStatus(
  id: string,
  status: EstimateStatus,
): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'You need to sign in again.' };

  // Keep the lifecycle timestamps honest alongside the manual flips.
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { status };
  if (status === 'accepted') patch.accepted_at = now;
  if (status === 'declined') patch.declined_at = now;
  if (status === 'paid') patch.paid_at = now;
  if (status === 'draft') {
    patch.accepted_at = null;
    patch.declined_at = null;
    patch.paid_at = null;
    patch.signed_name = null;
    patch.decline_reason = null;
  }

  const { error } = await supabase
    .from('estimates')
    .update(patch)
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) return { ok: false, error: 'Could not update status.' };

  revalidateDocs(id);
  return { ok: true };
}

/** Pause or resume automatic follow-up reminders for one estimate. */
export async function setRemindersEnabled(id: string, enabled: boolean): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'You need to sign in again.' };

  const { error } = await supabase
    .from('estimates')
    .update({ reminders_enabled: enabled })
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) return { ok: false, error: 'Could not update reminders.' };

  revalidateDocs(id);
  return { ok: true };
}

/** Copy a document (and its line items) into a fresh draft, then open it. */
export async function duplicateEstimate(id: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: src } = await supabase
    .from('estimates')
    .select('*, line_items(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (!src) redirect('/dashboard');

  const { data: copy, error } = await supabase
    .from('estimates')
    .insert({
      user_id: user.id,
      kind: src.kind,
      customer_name: src.customer_name,
      customer_address: src.customer_address,
      customer_phone: src.customer_phone,
      customer_email: src.customer_email,
      status: 'draft',
      scope_of_work: src.scope_of_work,
      subtotal: src.subtotal,
      tax_rate: src.tax_rate,
      tax_amount: src.tax_amount,
      deposit: src.deposit,
      total: src.total,
      notes: src.notes,
      pdf_language: src.pdf_language ?? 'en',
      due_date: src.kind === 'invoice' ? defaultDueDate() : null,
    })
    .select('id')
    .single();
  if (error || !copy) redirect('/dashboard');

  await copyLineItems(supabase, src.line_items ?? [], copy.id);

  revalidatePath('/dashboard');
  redirect(src.kind === 'invoice' ? `/invoices/${copy.id}` : `/estimates/${copy.id}`);
}

/**
 * Turn an (ideally accepted) estimate into an invoice draft: same customer,
 * scope, and line items, net-14 due date, linked back to the source estimate.
 */
export async function convertToInvoice(id: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: src } = await supabase
    .from('estimates')
    .select('*, line_items(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('kind', 'estimate')
    .single();
  if (!src) redirect('/dashboard');

  const { data: inv, error } = await supabase
    .from('estimates')
    .insert({
      user_id: user.id,
      kind: 'invoice',
      customer_name: src.customer_name,
      customer_address: src.customer_address,
      customer_phone: src.customer_phone,
      customer_email: src.customer_email,
      status: 'draft',
      scope_of_work: src.scope_of_work,
      subtotal: src.subtotal,
      tax_rate: src.tax_rate,
      tax_amount: src.tax_amount,
      deposit: src.deposit,
      total: src.total,
      notes: src.notes,
      pdf_language: src.pdf_language ?? 'en',
      due_date: defaultDueDate(),
      source_estimate_id: src.id,
    })
    .select('id')
    .single();
  if (error || !inv) redirect(`/estimates/${id}`);

  await copyLineItems(supabase, src.line_items ?? [], inv.id);

  revalidatePath('/invoices');
  revalidatePath('/dashboard');
  redirect(`/invoices/${inv.id}`);
}

/** Delete a document and return to its list. */
export async function deleteEstimate(id: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: doc } = await supabase
    .from('estimates')
    .select('kind')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  await supabase.from('estimates').delete().eq('id', id).eq('user_id', user.id);
  revalidatePath('/dashboard');
  redirect(doc?.kind === 'invoice' ? '/invoices' : '/estimates');
}

function defaultDueDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + INVOICE_DUE_DAYS);
  return d.toISOString().slice(0, 10);
}

async function copyLineItems(
  supabase: ReturnType<typeof createClient>,
  items: Array<Record<string, unknown>>,
  targetId: string,
) {
  if (items.length === 0) return;
  await supabase.from('line_items').insert(
    items.map((li, index) => ({
      estimate_id: targetId,
      category: li.category,
      description: li.description,
      quantity: li.quantity,
      unit: li.unit,
      unit_price: li.unit_price,
      line_total: li.line_total,
      sort_order: (li.sort_order as number) ?? index,
    })),
  );
}
