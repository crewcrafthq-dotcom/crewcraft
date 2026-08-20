import Link from 'next/link';
import { DemoTextLink } from './DemoModal';
import { ToolbeltLockup } from './ToolbeltLockup';

const PRODUCT = [
  { label: 'Watch the demo', href: '#demo' },
  { label: 'Apps & automations', href: '#apps' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'Log in', href: '/login' },
];
const TRADES = [
  { label: 'HVAC', href: '/for/hvac' },
  { label: 'Plumbing', href: '/for/plumbing' },
  { label: 'Electrical', href: '/for/electrical' },
  { label: 'Roofing', href: '/for/roofing' },
];
const COMPANY = [
  { label: 'About', href: '/about' },
  { label: 'Security', href: '/security' },
  { label: 'Support', href: 'mailto:support@crewcraftapp.com' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-paper-850">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <ToolbeltLockup />
            <p className="mt-3 max-w-xs text-sm text-ink-soft">
              Software tools for contractors — estimates, invoices, payments, follow-ups, and the
              rest of the paperwork, on one belt.
            </p>
            <p className="mt-3 text-sm font-semibold text-ink-mute">From the Crewcraft crew.</p>
          </div>

          <FooterCol title="Product" items={PRODUCT} />
          <FooterCol title="Built for" items={TRADES} />
          <FooterCol title="Company" items={COMPANY} />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-hairline pt-6 text-sm text-ink-mute sm:flex-row">
          <p>© {new Date().getFullYear()} Toolbelt, by Crewcraft</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition hover:text-ink-soft">Privacy</Link>
            <Link href="/terms" className="transition hover:text-ink-soft">Terms</Link>
            <p>Built for the trades.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((it) =>
          it.href === '#demo' ? (
            <li key={it.label}>
              <DemoTextLink className="text-ink-soft transition hover:text-ink">
                {it.label}
              </DemoTextLink>
            </li>
          ) : (
            <li key={it.label}>
              <Link href={it.href} className="text-ink-soft transition hover:text-ink">
                {it.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
