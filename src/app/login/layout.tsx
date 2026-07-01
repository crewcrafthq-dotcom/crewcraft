import type { Metadata } from 'next';

// The login page is a client component (can't export metadata itself), so this
// route-segment layout supplies its title and keeps it out of Google's index.
export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to Toolbelt by Crewcraft.',
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
