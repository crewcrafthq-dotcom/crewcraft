import 'server-only';

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

/** A safe filename for the PDF download. */
export function estimateFilename(estimate: EstimateWithItems): string {
  const slug =
    (estimate.customer_name || 'estimate')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40) || 'estimate';
  return `estimate-${slug}.pdf`;
}
