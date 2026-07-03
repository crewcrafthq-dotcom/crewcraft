import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/** Page routes that require a logged-in contractor. */
const AUTHED_PREFIXES = [
  '/dashboard',
  '/estimates',
  '/invoices',
  '/customers',
  '/analytics',
  '/pricebook',
  '/onboarding',
  '/settings',
  '/billing',
];

/**
 * Refreshes the Supabase auth session on every request and gates authed page
 * routes. API route handlers enforce their own auth, and the public estimate
 * page (/e/[token]) stays open — so this only redirects unauthenticated users
 * away from the contractor-facing pages.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const needsAuth = AUTHED_PREFIXES.some((p) => path.startsWith(p));

  if (!user && needsAuth) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  if (user && path === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}
