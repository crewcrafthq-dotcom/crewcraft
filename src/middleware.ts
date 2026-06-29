import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets and the Next internals. The
     * Stripe webhook (/api/stripe/webhook) needs a raw body, so skip /api there
     * and let the route handler verify the signature itself.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|api/public|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
