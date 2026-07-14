'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, MailCheck } from 'lucide-react';

import { Brand } from '@/components/Brand';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Label } from '@/components/ui/Field';
import { cn } from '@/lib/cn';
import { createClient } from '@/lib/supabase/client';

type Mode = 'login' | 'signup';
type Sent = null | 'magic' | 'confirm';

const emailOk = (e: string) => /\S+@\S+\.\S+/.test(e);

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [usePassword, setUsePassword] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<Sent>(null);

  // Land on the right tab when linked from "Start free" (?mode=signup / login).
  useEffect(() => {
    const m = new URLSearchParams(window.location.search).get('mode');
    if (m === 'signup' || m === 'login') setMode(m);
  }, []);

  function callbackUrl() {
    const next = new URLSearchParams(window.location.search).get('next') ?? '';
    return `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!emailOk(email)) {
      setError('Enter a valid email.');
      return;
    }
    if (usePassword && password.length < 8) {
      setError('Password needs at least 8 characters.');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      // ── Magic link (passwordless) ──────────────────────────────────────
      if (!usePassword) {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: { emailRedirectTo: callbackUrl() },
        });
        if (error) setError("Couldn't send the link. Try again.");
        else setSent('magic');
        return;
      }

      // ── Sign up with password ──────────────────────────────────────────
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: callbackUrl() },
        });
        if (error) {
          setError(
            /already registered/i.test(error.message)
              ? 'That email already has an account — log in instead.'
              : error.message,
          );
          return;
        }
        if (data.session) {
          router.push('/onboarding'); // confirmation disabled → straight in
          router.refresh();
        } else {
          setSent('confirm'); // confirmation required
        }
        return;
      }

      // ── Log in with password ───────────────────────────────────────────
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setError(
          /confirm/i.test(error.message)
            ? 'Confirm your email first — check your inbox.'
            : 'Email or password is wrong.',
        );
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  // confirmation / magic-link sent screen
  if (sent) {
    return (
      <AuthFrame>
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent-bright">
            <MailCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-ink">Check your email</h1>
          <p className="mt-2 text-ink-soft">
            {sent === 'magic' ? (
              <>We sent a sign-in link to <strong>{email}</strong>. Tap it to get in.</>
            ) : (
              <>Confirm your account from the link we sent to <strong>{email}</strong>, then log in.</>
            )}
          </p>
          <button
            type="button"
            onClick={() => setSent(null)}
            className="mt-5 cursor-pointer text-sm font-medium text-accent-bright hover:underline"
          >
            Use a different email
          </button>
        </div>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame>
      {/* tabs */}
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-paper-850 p-1">
        {(['login', 'signup'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={cn(
              'cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition',
              mode === m ? 'bg-paper-800 text-ink shadow-sm' : 'text-ink-mute hover:text-ink',
            )}
          >
            {m === 'login' ? 'Log in' : 'Sign up'}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@yourcompany.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {usePassword ? (
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
              <Input
                id="password"
                type={showPw ? 'text' : 'password'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
                placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-10"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-ink-mute hover:bg-paper-700"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ) : null}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading
            ? 'One sec…'
            : !usePassword
              ? 'Send magic link'
              : mode === 'signup'
                ? 'Create account'
                : 'Log in'}
        </Button>

        {mode === 'signup' ? (
          <p className="text-center text-xs text-ink-mute">
            3 free estimates · No credit card · Set up in two minutes
          </p>
        ) : null}
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setUsePassword((p) => !p);
            setError(null);
          }}
          className="cursor-pointer text-sm font-medium text-ink-soft hover:text-ink"
        >
          {usePassword ? 'Email me a link instead' : 'Use a password instead'}
        </button>
      </div>
    </AuthFrame>
  );
}

function AuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <Link href="/" className="mb-8 self-start">
        <Brand />
      </Link>
      <Card className="p-6 sm:p-7">{children}</Card>
      <p className="mt-5 px-2 text-center text-xs text-ink-mute">
        By continuing you agree to our{' '}
        <Link href="/terms" className="underline hover:text-ink-soft">Terms</Link> and{' '}
        <Link href="/privacy" className="underline hover:text-ink-soft">Privacy Policy</Link>.
        No spam, ever.
      </p>
    </main>
  );
}
