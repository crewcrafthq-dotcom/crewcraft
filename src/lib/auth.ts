import { createClient } from '@/lib/supabase/server';
import type { Business } from '@/lib/types';

/** The logged-in Supabase user, or null. */
export async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * The current user plus their business row (one business per user). Either may
 * be null: no user means logged out; a user with no business hasn't finished
 * onboarding yet.
 */
export async function getSession(): Promise<{
  user: Awaited<ReturnType<typeof getUser>>;
  business: Business | null;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, business: null };

  const { data } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  return { user, business: (data as Business) ?? null };
}

/** An estimate the contractor actually used — not an untouched empty draft. */
export function isUsedEstimate(e: {
  status: string;
  total: number;
  customer_name: string;
}): boolean {
  return e.status !== 'draft' || (e.total ?? 0) > 0 || Boolean(e.customer_name?.trim());
}

/**
 * Count of estimates the user has actually used (for the free-tier gate).
 * Opening and abandoning the editor leaves an empty draft — that must never
 * burn one of the 3 free estimates.
 */
export async function countEstimates(userId: string): Promise<number> {
  const supabase = createClient();
  const { data } = await supabase
    .from('estimates')
    .select('id, status, total, customer_name')
    .eq('user_id', userId)
    .eq('kind', 'estimate');
  return (data ?? []).filter(isUsedEstimate).length;
}
