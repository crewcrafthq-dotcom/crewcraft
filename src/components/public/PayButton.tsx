'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';

import { buttonClasses } from '@/components/ui/Button';

/**
 * Kicks off Stripe Checkout through the contractor's connected account and
 * sends the homeowner to Stripe's hosted payment page.
 */
export function PayButton({ token, label }: { token: string; label: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/public/${token}/checkout`, { method: 'POST' });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.url) {
        window.location.href = json.url;
        return;
      }
      setError(json.error ?? 'Could not start the payment. Try again.');
    } catch {
      setError('Could not start the payment. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={pay}
        disabled={busy}
        className={buttonClasses('primary', 'md')}
      >
        <CreditCard />
        {busy ? 'One sec…' : label}
      </button>
      {error ? <p className="mt-2 text-sm text-bad">{error}</p> : null}
    </div>
  );
}
