import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Sliding-window rate limiter backed by the rate_events table (migration
 * 0009). Works across serverless instances, unlike in-memory counters.
 *
 * Fails OPEN by default when the table is missing or the DB errors: a broken
 * limiter must never lock every customer out of logging in. (Supabase Auth
 * keeps its own per-IP limits underneath as the hard backstop.) Pass
 * `failClosed` for endpoints where an unlimited fallback costs real money.
 */
export async function checkRateLimit(
  identifier: string,
  max: number,
  windowMinutes: number,
  options: { failClosed?: boolean } = {},
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const admin = createAdminClient();
    const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();
    const { count, error } = await admin
      .from('rate_events')
      .select('id', { count: 'exact', head: true })
      .eq('identifier', identifier)
      .gte('created_at', since);
    if (error) throw error;
    const used = count ?? 0;
    return { allowed: used < max, remaining: Math.max(0, max - used) };
  } catch (err) {
    console.warn('rate-limit check skipped (migration 0009 applied?):', err);
    // Public, unauthenticated endpoints that spend money (the homepage AI
    // demo) must fail CLOSED — a broken limiter there is an open door to the
    // Anthropic bill. Logins still fail open, per the note above.
    if (options.failClosed) return { allowed: false, remaining: 0 };
    return { allowed: true, remaining: max };
  }
}

/** Record one event against an identifier (e.g. a failed login attempt). */
export async function recordRateEvent(identifier: string): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from('rate_events').insert({ identifier });
  } catch (err) {
    console.warn('rate-limit record skipped:', err);
  }
}

/** Best-effort cleanup so the table never grows unbounded (called by cron). */
export async function pruneRateEvents(olderThanHours = 48): Promise<void> {
  try {
    const admin = createAdminClient();
    const cutoff = new Date(Date.now() - olderThanHours * 3_600_000).toISOString();
    await admin.from('rate_events').delete().lt('created_at', cutoff);
  } catch {
    /* next run will get it */
  }
}

/** First client IP from the proxy chain (Vercel sets x-forwarded-for). */
export function clientIp(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return headers.get('x-real-ip') ?? 'unknown';
}
