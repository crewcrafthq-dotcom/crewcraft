'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Field';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setError(null);

    const next = new URLSearchParams(window.location.search).get('next') ?? '';
    const redirectTo = `${window.location.origin}/auth/callback${
      next ? `?next=${encodeURIComponent(next)}` : ''
    }`;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setError("Couldn't send the link. Check the email and try again.");
      setStatus('idle');
    } else {
      setStatus('sent');
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <Link href="/" className="mb-8 text-lg font-bold tracking-tight">
        Crewcraft
      </Link>

      <Card className="p-6">
        {status === 'sent' ? (
          <div>
            <h1 className="text-xl font-bold">Check your email</h1>
            <p className="mt-2 text-navy-soft">
              We sent a sign-in link to <strong>{email}</strong>. Tap it to get in —
              no password needed.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-4 text-sm font-medium text-accent-deep hover:underline"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <h1 className="text-xl font-bold">Log in or sign up</h1>
            <p className="mt-1 text-navy-soft">
              Enter your email and we&apos;ll send you a link.
            </p>

            <div className="mt-5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="you@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

            <Button type="submit" size="lg" className="mt-5 w-full" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending…' : 'Send link'}
            </Button>
          </form>
        )}
      </Card>
    </main>
  );
}
