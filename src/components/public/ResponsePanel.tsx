'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, PenLine, XCircle } from 'lucide-react';

import { buttonClasses } from '@/components/ui/Button';
import { shortDate } from '@/lib/format';

interface Props {
  token: string;
  status: string;
  signedName: string | null;
  acceptedAt: string | null;
  declinedAt: string | null;
}

// Light-theme input for the public (cream) page — the app's Field components
// are styled for the dark shell.
const inputLight =
  'w-full rounded-xl border border-line bg-white px-4 h-11 text-navy placeholder:text-navy-muted ' +
  'focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15';

/**
 * The homeowner's accept / decline panel on the public estimate page. Accepting
 * asks for a typed-name signature; declining takes an optional note.
 */
export function ResponsePanel({ token, status, signedName, acceptedAt, declinedAt }: Props) {
  const router = useRouter();
  const [local, setLocal] = useState<{ status: string; name?: string } | null>(null);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [declining, setDeclining] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effective = local?.status ?? status;

  async function respond(action: 'accept' | 'decline') {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/public/${token}/respond`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(action === 'accept' ? { action, name } : { action, note }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? 'Something went wrong. Try again.');
        return;
      }
      setLocal({ status: json.status, name });
      router.refresh();
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  }

  if (effective === 'accepted') {
    return (
      <section className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="flex items-center gap-2 font-semibold text-emerald-700">
          <CheckCircle2 className="h-5 w-5" />
          Estimate accepted
        </p>
        <p className="mt-1 text-sm text-emerald-700/90">
          Signed by {local?.name || signedName || 'you'}
          {acceptedAt && !local ? ` on ${shortDate(acceptedAt)}` : ''}. The contractor has been
          notified and will be in touch about next steps.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-6 rounded-2xl border border-line bg-cream-card p-5">
      {effective === 'declined' ? (
        <p className="mb-3 flex items-center gap-2 text-sm font-medium text-navy-soft">
          <XCircle className="h-4 w-4 text-red-500" />
          You declined this estimate{declinedAt && !local ? ` on ${shortDate(declinedAt)}` : ''}.
          Changed your mind? You can still accept it below.
        </p>
      ) : (
        <p className="mb-1 flex items-center gap-2 font-semibold text-navy">
          <PenLine className="h-[18px] w-[18px] text-accent-deep" />
          Ready to move forward?
        </p>
      )}

      {!declining ? (
        <>
          <p className="mb-3 text-sm text-navy-soft">
            Type your full name below to accept this estimate. That&rsquo;s your electronic
            signature — no printer needed.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              aria-label="Your full name"
              className={inputLight}
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              type="button"
              onClick={() => respond('accept')}
              disabled={busy || name.trim().length < 2}
              className={buttonClasses('primary', 'md', 'flex-none')}
            >
              <CheckCircle2 />
              {busy ? 'Saving…' : 'Accept estimate'}
            </button>
          </div>
          {effective !== 'declined' ? (
            <button
              type="button"
              onClick={() => setDeclining(true)}
              className="mt-3 text-sm text-navy-muted underline-offset-2 hover:underline"
            >
              Not the right fit? Decline instead
            </button>
          ) : null}
        </>
      ) : (
        <>
          <p className="mb-3 text-sm text-navy-soft">
            No hard feelings. Add a note if you&rsquo;d like — it goes straight to the contractor.
          </p>
          <textarea
            aria-label="Reason for declining (optional)"
            className={inputLight + ' h-auto min-h-[80px] py-3'}
            placeholder="Optional — e.g. “went with another quote” or “timing doesn't work”"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => respond('decline')}
              disabled={busy}
              className={buttonClasses('secondary', 'md')}
            >
              <XCircle className="text-red-500" />
              {busy ? 'Saving…' : 'Decline estimate'}
            </button>
            <button
              type="button"
              onClick={() => setDeclining(false)}
              className="text-sm text-navy-muted underline-offset-2 hover:underline"
            >
              Back
            </button>
          </div>
        </>
      )}

      {error ? <p className="mt-2 text-sm text-bad">{error}</p> : null}
    </section>
  );
}
