import { NextResponse } from 'next/server';

import { CONSENT_REGIONS } from '@/lib/consent';

/**
 * Tells the cookie banner whether this visitor's country requires opt-in
 * consent. Lives under /api/public/* so middleware skips it — it touches no
 * session and no database, it just reads a request header Vercel sets.
 *
 * Why a round trip rather than reading the header in the layout: calling
 * headers() in the root layout opts EVERY page out of static rendering. The
 * marketing pages are prerendered and must stay that way.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Set by Vercel's edge network on every request. Absent locally and behind
  // some proxies — an unknown country means we ask for consent.
  const country = (request.headers.get('x-vercel-ip-country') ?? '').toUpperCase();
  const consentRequired =
    country === '' || (CONSENT_REGIONS as readonly string[]).includes(country);

  return NextResponse.json(
    { country: country || null, consentRequired },
    { headers: { 'cache-control': 'no-store' } },
  );
}
