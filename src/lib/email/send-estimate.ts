import 'server-only';

import type { DocumentKind } from '@/lib/types';
import { sendAppEmail } from './send';
import { estimateEmailHtml, invoiceEmailHtml } from './templates';

interface SendArgs {
  to: string;
  kind: DocumentKind;
  businessName: string;
  customerName: string;
  total: number;
  publicUrl: string;
  dueDate?: string | null; // invoices only
  pdf: Buffer;
  accent: string;
  accentFg: string;
}

/** Email the estimate or invoice (with the PDF attached) to the customer. */
export async function sendEstimateEmail(args: SendArgs) {
  const invoice = args.kind === 'invoice';
  const html = invoice
    ? invoiceEmailHtml({
        businessName: args.businessName,
        customerName: args.customerName,
        total: args.total,
        publicUrl: args.publicUrl,
        dueDate: args.dueDate ?? null,
        accent: args.accent,
        accentFg: args.accentFg,
      })
    : estimateEmailHtml({
        businessName: args.businessName,
        customerName: args.customerName,
        total: args.total,
        publicUrl: args.publicUrl,
        accent: args.accent,
        accentFg: args.accentFg,
      });

  return sendAppEmail({
    to: args.to,
    fromName: args.businessName,
    subject: invoice
      ? `Your invoice from ${args.businessName}`
      : `Your estimate from ${args.businessName}`,
    html,
    attachments: [{ filename: invoice ? 'invoice.pdf' : 'estimate.pdf', content: args.pdf }],
  });
}
