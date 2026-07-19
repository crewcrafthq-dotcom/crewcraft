import { NextResponse, type NextRequest } from 'next/server';

import { estimateFilename, loadEstimateForUser } from '@/lib/estimate-data';
import { renderEstimatePdf } from '@/lib/pdf/render';

export const runtime = 'nodejs';

/** Branded PDF for the signed-in owner. `?download=1` forces a file download. */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const bundle = await loadEstimateForUser(params.id);
  if (!bundle) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  const disposition =
    request.nextUrl.searchParams.get('download') === '1' ? 'attachment' : 'inline';
  const pdf = await renderEstimatePdf(bundle.business, bundle.estimate);
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${disposition}; filename="${estimateFilename(bundle.estimate)}"`,
      'Cache-Control': 'no-store',
    },
  });
}
