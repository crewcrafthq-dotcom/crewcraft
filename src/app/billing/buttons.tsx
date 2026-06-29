'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import type { PlanKey } from '@/lib/config';

export function UpgradeButton({
  priceKey,
  label,
  variant = 'primary',
}: {
  priceKey: PlanKey;
  label: string;
  variant?: 'primary' | 'secondary';
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ priceKey }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.url) {
        window.location.href = json.url;
        return;
      }
      setError(json.error ?? 'Could not start checkout.');
    } catch {
      setError('Could not start checkout.');
    }
    setLoading(false);
  }

  return (
    <div>
      <Button onClick={go} disabled={loading} variant={variant} className="w-full">
        {loading ? 'Starting…' : label}
      </Button>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.url) {
        window.location.href = json.url;
        return;
      }
      setError(json.error ?? 'Could not open billing.');
    } catch {
      setError('Could not open billing.');
    }
    setLoading(false);
  }

  return (
    <div>
      <Button onClick={go} disabled={loading} variant="secondary">
        {loading ? 'Opening…' : 'Manage billing'}
      </Button>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
