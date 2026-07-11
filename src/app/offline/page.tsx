import { WifiOff } from 'lucide-react';

export const metadata = { robots: { index: false, follow: false } };

/** Shown by the service worker when a page is opened with no connection. */
export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent-bright">
        <WifiOff className="h-7 w-7" />
      </span>
      <h1 className="mt-5 text-xl font-bold text-mist">You’re offline</h1>
      <p className="mt-2 text-mist-soft">
        Toolbelt needs a connection to load your estimates and invoices. Check your signal and try
        again.
      </p>
    </main>
  );
}
