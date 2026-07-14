import 'server-only';

import { INVOICE_DUE_DAYS } from '@/lib/config';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type { Business, EstimateWithItems } from '@/lib/types';

export interface EstimateBundle {
  business: Business;
  estimate: EstimateWithItems;
}

function sortItems(estimate: EstimateWithItems): EstimateWithItems {
  estimate.line_items = (estimate.line_items ?? []).sort((a, b) => a.sort_order - b.sort_order);
  return estimate;
}

/** Load an estimate + the owner's business for the signed-in user (RLS-gated). */
export async function loadEstimateForUser(id: string): Promise<EstimateBundle | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: est } = await supabase
    .from('estimates')
    .select('*, line_items(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (!est) return null;

  const { data: biz } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (!biz) return null;

  return { business: biz as Business, estimate: sortItems(est as EstimateWithItems) };
}

/**
 * Load an estimate by its public token via the service-role client (bypasses
 * RLS for read-only display only). Used by the public page and public PDF.
 */
export async function loadEstimateByToken(token: string): Promise<EstimateBundle | null> {
  const admin = createAdminClient();

  const { data: est } = await admin
    .from('estimates')
    .select('*, line_items(*)')
    .eq('public_token', token)
    .single();
  if (!est) return null;

  const { data: biz } = await admin
    .from('businesses')
    .select('*')
    .eq('user_id', est.user_id)
    .single();
  if (!biz) return null;

  return { business: biz as Business, estimate: sortItems(est as EstimateWithItems) };
}

/**
 * First open of a public link flips Sent → Viewed and stamps viewed_at once.
 * Never downgrades Accepted/Declined.
 */
export async function markViewedByToken(token: string): Promise<void> {
  const admin = createAdminClient();

  const { data: est } = await admin
    .from('estimates')
    .select('id, status, viewed_at')
    .eq('public_token', token)
    .single();
  if (!est) return;

  const patch: Record<string, unknown> = {};
  if (!est.viewed_at) patch.viewed_at = new Date().toISOString();
  if (est.status === 'sent') patch.status = 'viewed';

  if (Object.keys(patch).length > 0) {
    await admin.from('estimates').update(patch).eq('id', est.id);
  }
}

/** A safe filename for the PDF download (estimate-*.pdf / invoice-*.pdf). */
export function estimateFilename(estimate: EstimateWithItems): string {
  const kind = estimate.kind === 'invoice' ? 'invoice' : 'estimate';
  const slug =
    (estimate.customer_name || kind)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40) || kind;
  return `${kind}-${slug}.pdf`;
}

/**
 * Create an invoice from an estimate via the service-role client — used by the
 * auto-invoice-on-acceptance flow, where no contractor session exists. Copies
 * the customer, scope, totals, and line items; net-14 due date; links back to
 * the source estimate. Returns the invoice with its items, or null on failure.
 */
export async function createInvoiceFromEstimate(
  estimate: EstimateWithItems,
): Promise<EstimateWithItems | null> {
  const admin = createAdminClient();

  // One invoice per estimate — acceptance can be retried, invoicing shouldn't be.
  const { data: existing } = await admin
    .from('estimates')
    .select('*, line_items(*)')
    .eq('source_estimate_id', estimate.id)
    .eq('kind', 'invoice')
    .maybeSingle();
  if (existing) return sortItems(existing as EstimateWithItems);

  const due = new Date();
  due.setDate(due.getDate() + INVOICE_DUE_DAYS);

  const { data: invoice, error } = await admin
    .from('estimates')
    .insert({
      user_id: estimate.user_id,
      kind: 'invoice',
      customer_name: estimate.customer_name,
      customer_address: estimate.customer_address,
      customer_phone: estimate.customer_phone,
      customer_email: estimate.customer_email,
      status: 'draft',
      scope_of_work: estimate.scope_of_work,
      subtotal: estimate.subtotal,
      tax_rate: estimate.tax_rate,
      tax_amount: estimate.tax_amount,
      deposit: estimate.deposit,
      total: estimate.total,
      notes: estimate.notes,
      pdf_language: estimate.pdf_language ?? 'en',
      due_date: due.toISOString().slice(0, 10),
      source_estimate_id: estimate.id,
    })
    .select('*')
    .single();
  if (error || !invoice) return null;

  const items = estimate.line_items ?? [];
  if (items.length > 0) {
    await admin.from('line_items').insert(
      items.map((li, index) => ({
        estimate_id: invoice.id,
        category: li.category,
        description: li.description,
        quantity: li.quantity,
        unit: li.unit,
        unit_price: li.unit_price,
        line_total: li.line_total,
        sort_order: li.sort_order ?? index,
      })),
    );
  }

  const bundle = { ...(invoice as EstimateWithItems), line_items: items };
  return bundle;
}

/**
 * Where contractor notifications go: the business email if set, else the
 * account's login email (service-role lookup).
 */
export async function ownerNotifyEmail(business: Business): Promise<string | null> {
  if (business.email) return business.email;
  const admin = createAdminClient();
  const { data } = await admin.auth.admin.getUserById(business.user_id);
  return data?.user?.email ?? null;
}
