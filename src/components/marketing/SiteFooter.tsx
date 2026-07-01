import Link from 'next/link';
import { DemoTextLink } from './DemoModal';
import { ToolbeltLockup } from './ToolbeltLockup';

const PRODUCT = [
  { label: 'Watch the demo', href: '#demo' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Log in', href: '/login' },
];
const TRADES = ['HVAC', 'Plumbing', 'Electrical', 'Roofing'];
const COMPANY = [
  { label: 'Contact', href: 'mailto:hello@crewcraftapp.com' },
  { label: 'How it works', href: '#how' },
  { label: 'Why Toolbelt', href: '#why' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-night-850">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <ToolbeltLockup />
            <p className="mt-3 max-w-xs text-sm text-mist-soft">
              The contractor’s set of tools for killing after-hours paperwork.
            </p>
            <p className="mt-3 text-sm font-semibold text-mist-mute">From the Crewcraft crew.</p>
          </div>

          <FooterCol title="Product" items={PRODUCT} />
          <div>
            <h3 className="text-sm font-semibold text-mist">Built for</h3>
            <ul className="mt-3 space-y-2 text-sm text-mist-soft">
              {TRADES.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <FooterCol title="Company" items={COMPANY} />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-hairline pt-6 text-sm text-mist-mute sm:flex-row">
          <p>© {new Date().getFullYear()} Toolbelt, by Crewcraft</p>
          <p>Built for the trades.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-mist">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((it) =>
          it.href === '#demo' ? (
            <li key={it.label}>
              <DemoTextLink className="text-mist-soft transition hover:text-mist">
                {it.label}
              </DemoTextLink>
            </li>
          ) : (
            <li key={it.label}>
              <Link href={it.href} className="text-mist-soft transition hover:text-mist">
                {it.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
