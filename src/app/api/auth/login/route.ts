import { NextResponse, type NextRequest } from 'next/server';

import { checkRateLimit, clientIp, recordRateEvent } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

// Failed attempts allowed per window before a cool-off.
const PER_EMAIL_MAX = 5;
const PER_IP_MAX = 20;
const WINDOW_MIN = 15;

const BLOCKED_MSG =
  'Too many attempts — wait 15 minutes, or use "Email me a link instead" to sign in without a password.';

/**
 * Password sign-in with brute-force protection. The browser posts here instead
 * of calling Supabase directly, so we can count failed attempts per email and
 * per IP (rate_events, migration 0009) and cool off dictionary attacks.
 * Successful sign-in sets the session cookies via the SSR client. Magic-link
 * sign-in stays client-side (it has Supabase's own limits + inbox friction).
 */
export async function POST(request: NextRequest) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }

  const email = String(body?.email ?? '').trim().toLowerCase();
  const password = String(body?.password ?? '');
  if (!email || !password) {
    return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
  }

  const ip = clientIp(request.headers);
  const emailKey = `login:e:${email}`;
  const ipKey = `login:ip:${ip}`;

  const [byEmail, byIp] = await Promise.all([
    checkRateLimit(emailKey, PER_EMAIL_MAX, WINDOW_MIN),
    checkRateLimit(ipKey, PER_IP_MAX, WINDOW_MIN),
  ]);
  if (!byEmail.allowed || !byIp.allowed) {
    return NextResponse.json({ error: BLOCKED_MSG }, { status: 429 });
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Only failures count toward the limit.
    await Promise.all([recordRateEvent(emailKey), recordRateEvent(ipKey)]);
    const confirm = /confirm/i.test(error.message);
    const attemptsLeft = byEmail.remaining - 1;
    return NextResponse.json(
      {
        error: confirm
          ? 'Confirm your email first — check your inbox.'
          : attemptsLeft <= 2
            ? `Email or password is wrong. ${Math.max(attemptsLeft, 0)} ${attemptsLeft === 1 ? 'try' : 'tries'} left before a 15-minute cool-off.`
            : 'Email or password is wrong.',
      },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true });
}
