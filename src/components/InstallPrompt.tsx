'use client';

import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'tb-install-dismissed';

/**
 * A gentle "add Toolbelt to your home screen" nudge for signed-in contractors.
 * Chrome/Android fires beforeinstallprompt (one-tap install); iOS Safari gives
 * no event, so we show the Share → Add to Home Screen hint instead. Hidden when
 * already installed (standalone) or previously dismissed.
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true); // assume hidden until mounted

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    setDismissed(false);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);

    // iOS Safari: no install event — offer the manual hint.
    const ua = window.navigator.userAgent;
    const isIos = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
    if (isIos && isSafari) setShowIosHint(true);

    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  function close() {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // ignore
    }
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice.catch(() => undefined);
    setDeferred(null);
    close();
  }

  if (dismissed || (!deferred && !showIosHint)) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-md rounded-2xl border border-hairline bg-paper-800/95 p-4 shadow-lift backdrop-blur sm:inset-x-auto sm:right-4">
      <button
        type="button"
        onClick={close}
        aria-label="Dismiss"
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg text-ink-mute hover:bg-paper-700 hover:text-ink"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-accent text-accent-fg shadow-accent">
          <Download className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-ink">Put Toolbelt on your phone</p>
          {deferred ? (
            <>
              <p className="mt-0.5 text-sm text-ink-soft">
                Install it like an app — full-screen, one tap from your home screen.
              </p>
              <button
                type="button"
                onClick={install}
                className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-fg shadow-accent transition hover:shadow-glow"
              >
                <Download className="h-4 w-4" />
                Install app
              </button>
            </>
          ) : (
            <p className="mt-0.5 flex flex-wrap items-center gap-1 text-sm text-ink-soft">
              Tap <Share className="inline h-4 w-4 text-accent-bright" /> then
              <span className="font-semibold text-ink">Add to Home Screen</span>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
