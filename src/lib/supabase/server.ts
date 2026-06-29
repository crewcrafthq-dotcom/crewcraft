import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Server Supabase client, bound to the request cookies. Use inside Server
 * Components, Route Handlers, and Server Actions. Reads/writes the auth session
 * through cookies so RLS sees the logged-in user.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll throws when called from a Server Component (cookies are
            // read-only there). The middleware refreshes the session instead,
            // so this is safe to ignore.
          }
        },
      },
    },
  );
}
