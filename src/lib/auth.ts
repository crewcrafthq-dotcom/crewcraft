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

/** Count of estimates the user has created (for the free-tier gate). */
export async function countEstimates(userId: string): Promise<number> {
  const supabase = createClient();
  const { count } = await supabase
    .from('estimates')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  return count ?? 0;
}
