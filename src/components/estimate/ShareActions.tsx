'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BadgeCheck,
  BellRing,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Mail,
  Receipt,
  Star,
  Undo2,
  XCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { toast } from '@/components/ui/toast';
import {
  convertToInvoice,
  setEstimateStatus,
  setRemindersEnabled,
} from '@/app/estimates/actions';
import { shortDate } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { EstimateStatus, EstimateWithItems } from '@/lib/types';

interface Props {
  estimate: EstimateWithItems;
  hasCustomerEmail: boolean;
  hasReviewLink: boolean;
  /** Persist the editor first; returns true on success. */
  saveNow: () => Promise<boolean>;
}

type Busy = null | 'copy' | 'download' | 'send' | 'remind' | 'invoice' | 'review';

export function ShareActions({ estimate, hasCustomerEmail, hasReviewLink, saveNow }: Props) {
  const router = useRouter();
  const invoice = estimate.kind === 'invoice';

  const [busy, setBusy] = useState<Busy>(null);
  const [copied, setCopied] = useState(false);
  const [localStatus, setLocalStatus] = useState<EstimateStatus>(estimate.status);
  const [autoReminders, setAutoReminders] = useState(estimate.reminders_enabled);
  const [remindedAt, setRemindedAt] = useState(estimate.last_reminder_at);
  const [reminderCount, setReminderCount] = useState(estimate.reminder_count ?? 0);
  const [reviewedAt, setReviewedAt] = useState(estimate.review_requested_at);

  const publicUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/e/${estimate.public_token}` : '';

  async function copyLink() {
    setBusy('copy');
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast('Link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast('Copy failed — long-press the link to copy it.', 'error');
    } finally {
      setBusy(null);
    }
  }

  async function download() {
    setBusy('download');
    const ok = await saveNow();
    setBusy(null);
    if (ok) window.open(`/api/estimates/${estimate.id}/pdf`, '_blank');
    else toast('Save failed — try again.', 'error');
  }

  async function send() {
    if (!hasCustomerEmail) {
      toast('Add the customer’s email first.', 'error');
      return;
    }
    setBusy('send');
    const ok = await saveNow();
    if (!ok) {
      setBusy(null);
      toast('Save failed — try again.', 'error');
      return;
    }
    try {
      const res = await fetch(`/api/estimates/${estimate.id}/send`, { method: 'POST' });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        if (!['accepted', 'declined', 'paid'].includes(localStatus)) setLocalStatus('sent');
        toast(invoice ? 'Invoice sent to the customer.' : 'Estimate sent to the customer.');
        router.refresh();
      } else {
        toast(json.error ?? 'Could not send. Try again.', 'error');
      }
    } catch {
      toast('Could not send. Try again.', 'error');
    } finally {
      setBusy(null);
    }
  }

  async function remind() {
    setBusy('remind');
    try {
      const res = await fetch(`/api/estimates/${estimate.id}/remind`, { method: 'POST' });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setRemindedAt(new Date().toISOString());
        setReminderCount((c) => c + 1);
        toast('Reminder sent.');
        router.refresh();
      } else {
        toast(json.error ?? 'Could not send the reminder.', 'error');
      }
    } catch {
      toast('Could not send the reminder.', 'error');
    } finally {
      setBusy(null);
    }
  }

  async function toggleAutoReminders() {
    const next = !autoReminders;
    setAutoReminders(next);
    const res = await setRemindersEnabled(estimate.id, next);
    if (!res.ok) {
      setAutoReminders(!next);
      toast(res.error, 'error');
    } else {
      toast(next ? 'Auto follow-ups on.' : 'Auto follow-ups off.');
    }
  }

  async function requestReview() {
    if (!hasReviewLink) {
      toast('Add your review link in Settings first.', 'error');
      return;
    }
    if (!hasCustomerEmail) {
      toast('Add the customer’s email first.', 'error');
      return;
    }
    setBusy('review');
    try {
      const res = await fetch(`/api/estimates/${estimate.id}/review-request`, { method: 'POST' });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setReviewedAt(new Date().toISOString());
        toast('Review request sent.');
        router.refresh();
      } else {
        toast(json.error ?? 'Could not send. Try again.', 'error');
      }
    } catch {
      toast('Could not send. Try again.', 'error');
    } finally {
      setBusy(null);
    }
  }

  async function makeInvoice() {
    setBusy('invoice');
    const ok = await saveNow();
    if (!ok) {
      setBusy(null);
      toast('Save failed — try again.', 'error');
      return;
    }
    try {
      await convertToInvoice(estimate.id); // redirects to the new invoice
    } catch {
      // NEXT_REDIRECT bubbles through here in some setups — the navigation
      // still happens; only reset state if we're still on the page.
      setBusy(null);
    }
  }

  async function changeStatus(next: EstimateStatus) {
    const res = await setEstimateStatus(estimate.id, next);
    if (res.ok) {
      setLocalStatus(next);
      toast(`Marked ${next}.`);
      router.refresh();
    } else {
      toast(res.error, 'error');
    }
  }

  const canRemind = !invoice && ['sent', 'viewed'].includes(localStatus);
  const canReview =
    hasCustomerEmail && (invoice ? localStatus === 'paid' : localStatus === 'accepted');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-ink">Send it</span>
        <StatusBadge status={localStatus} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Button variant="secondary" onClick={copyLink} disabled={busy !== null}>
          {copied ? <Check className="text-ok" /> : <Copy />}
          {copied ? 'Copied' : 'Copy link'}
        </Button>
        <Button variant="secondary" onClick={download} disabled={busy !== null}>
          <Download />
          {busy === 'download' ? 'Saving…' : 'Download PDF'}
        </Button>
        <Button onClick={send} disabled={busy !== null} className="col-span-2 sm:col-span-1">
          <Mail />
          {busy === 'send' ? 'Sending…' : 'Email it'}
        </Button>
      </div>

      {/* follow-ups — estimates that are out with the customer */}
      {canRemind ? (
        <div className="rounded-xl border border-hairline bg-paper-850 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <BellRing className="h-4 w-4 text-ink-mute" />
                Follow up
              </p>
              <p className="mt-0.5 text-sm text-ink-mute">
                {remindedAt
                  ? `Reminded ${reminderCount}× — last ${shortDate(remindedAt)}.`
                  : 'No reminders sent yet.'}{' '}
                Auto follow-up nudges quiet customers after 3 days.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={remind}
                disabled={busy !== null || !hasCustomerEmail}
              >
                <BellRing />
                {busy === 'remind' ? 'Sending…' : 'Send reminder'}
              </Button>
              <button
                type="button"
                role="switch"
                aria-checked={autoReminders}
                aria-label="Automatic follow-ups"
                onClick={toggleAutoReminders}
                className={cn(
                  'relative h-6 w-11 flex-none rounded-full transition',
                  autoReminders ? 'bg-accent' : 'bg-paper-700',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all',
                    autoReminders ? 'left-[22px]' : 'left-0.5',
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* status flips */}
      <div className="border-t border-hairline pt-4">
        <p className="mb-2 text-sm text-ink-soft">Mark this {invoice ? 'invoice' : 'estimate'}:</p>
        <div className="flex flex-wrap gap-2">
          {invoice ? (
            <Button variant="secondary" size="sm" onClick={() => changeStatus('paid')}>
              <BadgeCheck className="text-ok" />
              Paid
            </Button>
          ) : (
            <>
              <Button variant="secondary" size="sm" onClick={() => changeStatus('accepted')}>
                <CheckCircle2 className="text-ok" />
                Accepted
              </Button>
              <Button variant="secondary" size="sm" onClick={() => changeStatus('declined')}>
                <XCircle className="text-bad" />
                Declined
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={() => changeStatus('draft')}>
            <Undo2 />
            Back to draft
          </Button>
        </div>
      </div>

      {/* the job is won — what's next */}
      {(!invoice && localStatus === 'accepted') || (invoice && localStatus === 'paid') ? (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
          <p className="text-sm font-semibold text-ok">
            {invoice ? 'Paid — nice work.' : 'Job won — keep it moving.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {!invoice ? (
              <Button size="sm" onClick={makeInvoice} disabled={busy !== null}>
                <Receipt />
                {busy === 'invoice' ? 'Creating…' : 'Convert to invoice'}
              </Button>
            ) : null}
            {canReview ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={requestReview}
                disabled={busy !== null || Boolean(reviewedAt)}
              >
                <Star />
                {reviewedAt
                  ? `Review requested ${shortDate(reviewedAt)}`
                  : busy === 'review'
                    ? 'Sending…'
                    : 'Request a review'}
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
