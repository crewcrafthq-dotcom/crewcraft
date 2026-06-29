import { NextResponse, type NextRequest } from 'next/server';

import { estimateFilename, loadEstimateByToken } from '@/lib/estimate-data';
import { renderEstimatePdf } from '@/lib/pdf/render';

export const runtime = 'nodejs';

/** Public branded PDF by unguessable token — no login (service-role read). */
export async function GET(_request: NextRequest, { params }: { params: { token: string } }) {
  const bundle = await loadEstimateByToken(params.token);
  if (!bundle) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  const pdf = await renderEstimatePdf(bundle.business, bundle.estimate);
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${estimateFilename(bundle.estimate)}"`,
      'Cache-Control': 'no-store',
    },
  });
}
