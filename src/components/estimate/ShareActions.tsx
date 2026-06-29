'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { setEstimateStatus } from '@/app/estimates/actions';
import type { EstimateStatus } from '@/lib/types';

interface Props {
  estimateId: string;
  publicToken: string;
  status: EstimateStatus;
  hasCustomerEmail: boolean;
  /** Persist the editor first; returns true on success. */
  saveNow: () => Promise<boolean>;
}

export function ShareActions({
  estimateId,
  publicToken,
  status,
  hasCustomerEmail,
  saveNow,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | 'copy' | 'download' | 'send'>(null);
  const [note, setNote] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<EstimateStatus>(status);

  const publicUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/e/${publicToken}` : '';

  async function copyLink() {
    setBusy('copy');
    setNote(null);
    try {
      await navigator.clipboard.writeText(publicUrl);
      setNote('Link copied.');
    } catch {
      setNote('Copy failed — long-press to copy the link.');
    } finally {
      setBusy(null);
    }
  }

  async function download() {
    setBusy('download');
    setNote(null);
    const ok = await saveNow();
    setBusy(null);
    if (ok) window.open(`/api/estimates/${estimateId}/pdf`, '_blank');
    else setNote('Save failed — try again.');
  }

  async function send() {
    if (!hasCustomerEmail) {
      setNote('Add the customer’s email first.');
      return;
    }
    setBusy('send');
    setNote(null);
    const ok = await saveNow();
    if (!ok) {
      setBusy(null);
      setNote('Save failed — try again.');
      return;
    }
    try {
      const res = await fetch(`/api/estimates/${estimateId}/send`, { method: 'POST' });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setLocalStatus('sent');
        setNote('Sent to the customer.');
        router.refresh();
      } else {
        setNote(json.error ?? 'Could not send. Try again.');
      }
    } catch {
      setNote('Could not send. Try again.');
    } finally {
      setBusy(null);
    }
  }

  async function changeStatus(next: EstimateStatus) {
    const res = await setEstimateStatus(estimateId, next);
    if (res.ok) {
      setLocalStatus(next);
      router.refresh();
    } else {
      setNote(res.error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Send it</span>
        <StatusBadge status={localStatus} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Button variant="secondary" onClick={copyLink} disabled={busy !== null}>
          Copy link
        </Button>
        <Button variant="secondary" onClick={download} disabled={busy !== null}>
          {busy === 'download' ? 'Saving…' : 'Download PDF'}
        </Button>
        <Button onClick={send} disabled={busy !== null} className="col-span-2 sm:col-span-1">
          {busy === 'send' ? 'Sending…' : 'Email to customer'}
        </Button>
      </div>

      <div>
        <p className="mb-2 text-sm text-navy-soft">Mark this estimate:</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => changeStatus('accepted')}>
            Accepted
          </Button>
          <Button variant="secondary" size="sm" onClick={() => changeStatus('declined')}>
            Declined
          </Button>
          <Button variant="ghost" size="sm" onClick={() => changeStatus('draft')}>
            Back to draft
          </Button>
        </div>
      </div>

      {note ? <p className="text-sm text-accent-deep">{note}</p> : null}
    </div>
  );
}
