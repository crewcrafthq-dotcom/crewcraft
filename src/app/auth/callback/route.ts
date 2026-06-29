import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { appUrl } from '@/lib/config';

/**
 * Magic-link landing. Exchanges the PKCE code for a session, then sends the
 * contractor to onboarding (no business yet) or the dashboard.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '';
  const base = appUrl();

  if (!code) {
    return NextResponse.redirect(`${base}/login?error=auth`);
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${base}/login?error=auth`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dest = next.startsWith('/') ? next : '/dashboard';
  if (user) {
    const { data: biz } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();
    if (!biz) dest = '/onboarding';
  }

  return NextResponse.redirect(`${base}${dest}`);
}
