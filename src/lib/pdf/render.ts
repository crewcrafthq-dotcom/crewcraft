import { createElement, type ReactElement } from 'react';
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer';

import { registerFonts } from './fonts';
import { EstimatePdf } from './EstimatePdf';
import { PDF_STRINGS } from './i18n';
import type { Business, EstimateWithItems } from '@/lib/types';

/**
 * Render the branded estimate/invoice to a PDF Buffer in the estimate's chosen
 * language (labels always localized; typed content AI-translated + cached).
 * Shared by the authed PDF route, the public-by-token route, and the email
 * attachment.
 */
export async function renderEstimatePdf(
  business: Business,
  estimate: EstimateWithItems,
): Promise<Buffer> {
  registerFonts();
  // Lazily loaded so the sync renderer (and the offline smoke script) don't
  // pull in the server-only translation/DB stack.
  const { localizeEstimate } = await import('./translate');
  const { estimate: localized, strings, locale } = await localizeEstimate(estimate);
  const doc = createElement(EstimatePdf, {
    business,
    estimate: localized,
    strings,
    locale,
  }) as unknown as ReactElement<DocumentProps>;
  return renderToBuffer(doc);
}

/**
 * English-only render with no translation/DB dependency — used by the offline
 * PDF smoke script. Pass explicit strings to preview another language's labels.
 */
export async function renderEstimatePdfSync(
  business: Business,
  estimate: EstimateWithItems,
  strings = PDF_STRINGS.en,
  locale = 'en-US',
): Promise<Buffer> {
  registerFonts();
  const doc = createElement(EstimatePdf, {
    business,
    estimate,
    strings,
    locale,
  }) as unknown as ReactElement<DocumentProps>;
  return renderToBuffer(doc);
}
