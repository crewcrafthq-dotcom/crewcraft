import { createElement, type ReactElement } from 'react';
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer';

import { registerFonts } from './fonts';
import { EstimatePdf } from './EstimatePdf';
import type { Business, EstimateWithItems } from '@/lib/types';

/**
 * Render the branded estimate to a PDF Buffer. Shared by the authed PDF route,
 * the public-by-token PDF route, and the email attachment.
 */
export async function renderEstimatePdf(
  business: Business,
  estimate: EstimateWithItems,
): Promise<Buffer> {
  registerFonts();
  // EstimatePdf returns a <Document>; cast to the element type renderToBuffer wants.
  const doc = createElement(EstimatePdf, { business, estimate }) as unknown as ReactElement<
    DocumentProps
  >;
  return renderToBuffer(doc);
}
