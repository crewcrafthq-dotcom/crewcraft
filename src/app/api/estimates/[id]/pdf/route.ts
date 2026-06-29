import { NextResponse, type NextRequest } from 'next/server';

import { estimateFilename, loadEstimateForUser } from '@/lib/estimate-data';
import { renderEstimatePdf } from '@/lib/pdf/render';

export const runtime = 'nodejs';

/** Branded PDF for the signed-in owner. */
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const bundle = await loadEstimateForUser(params.id);
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
