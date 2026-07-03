import 'server-only';

import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client. Bypasses RLS — SERVER ONLY. Used for the
 * read-only public estimate page (lookup by public_token), the Stripe webhook
 * sync, and the PDF/email paths. Never import this into client code.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        // Opt out of Next's Data Cache. Without this, the public estimate
        // page/PDF can serve stale rows (still "sent" after the customer
        // accepted) because Next caches these GETs across requests.
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, { ...init, cache: 'no-store' }),
      },
    },
  );
}
