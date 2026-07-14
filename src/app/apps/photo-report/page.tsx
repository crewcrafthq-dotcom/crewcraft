import { redirect } from 'next/navigation';

import { AppShell } from '@/components/AppShell';
import { getSession } from '@/lib/auth';
import { getTheme } from '@/lib/trades';
import { PhotoReportClient } from './PhotoReportClient';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Photo Report Builder' };

/**
 * Photo Report Builder — job-site photos into a clean, captioned, branded PDF.
 * Everything happens on the device: photos never upload anywhere, the PDF is
 * generated in the browser. No storage, no third-party service.
 */
export default async function PhotoReportPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const theme = getTheme(business.trade);

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <p className="eyebrow">Photo Report Builder</p>
      <h1 className="mt-1 text-display-sm font-bold text-ink">
        Photos in. Clean report out.
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Snap the roof, the panel, the leak — caption each shot and download a branded PDF the
        homeowner (or the adjuster) actually understands. Photos stay on your device; nothing is
        uploaded.
      </p>

      <div className="mt-7">
        <PhotoReportClient
          businessName={business.name}
          license={business.license}
          accentHex={theme.accent}
        />
      </div>
    </AppShell>
  );
}
