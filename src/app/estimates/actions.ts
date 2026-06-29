'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { computeTotals, lineTotal } from '@/lib/estimates';
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
  line_items: SaveLineItem[];
}

export type ActionResult = { ok: true } | { ok: false; error: string };

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/** Persist the whole estimate: header fields, recomputed totals, line items. */
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

  revalidatePath(`/estimates/${id}`);
  revalidatePath('/dashboard');
  return { ok: true };
}

/** Manual status changes (Accepted / Declined / back to Draft). */
export async function setEstimateStatus(
  id: string,
  status: EstimateStatus,
): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'You need to sign in again.' };

  const { error } = await supabase
    .from('estimates')
    .update({ status })
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) return { ok: false, error: 'Could not update status.' };

  revalidatePath(`/estimates/${id}`);
  revalidatePath('/dashboard');
  return { ok: true };
}

/** Copy an estimate (and its line items) into a fresh draft, then open it. */
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
    })
    .select('id')
    .single();
  if (error || !copy) redirect('/dashboard');

  const items = (src.line_items ?? []) as Array<Record<string, unknown>>;
  if (items.length > 0) {
    await supabase.from('line_items').insert(
      items.map((li, index) => ({
        estimate_id: copy.id,
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

  revalidatePath('/dashboard');
  redirect(`/estimates/${copy.id}`);
}

/** Delete an estimate and return to the dashboard. */
export async function deleteEstimate(id: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase.from('estimates').delete().eq('id', id).eq('user_id', user.id);
  revalidatePath('/dashboard');
  redirect('/dashboard');
}
