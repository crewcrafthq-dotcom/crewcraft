import 'server-only';

import { Resend } from 'resend';
import { estimateEmailHtml } from './templates';

interface SendArgs {
  to: string;
  businessName: string;
  customerName: string;
  total: number;
  publicUrl: string;
  pdf: Buffer;
  accent: string;
  accentFg: string;
}

/** Email the estimate (with the PDF attached) to the customer via Resend. */
export async function sendEstimateEmail(args: SendArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  if (!from) throw new Error('RESEND_FROM_EMAIL is not set');

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: `${args.businessName} <${from}>`,
    to: args.to,
    subject: `Your estimate from ${args.businessName}`,
    html: estimateEmailHtml({
      businessName: args.businessName,
      customerName: args.customerName,
      total: args.total,
      publicUrl: args.publicUrl,
      accent: args.accent,
      accentFg: args.accentFg,
    }),
    attachments: [{ filename: 'estimate.pdf', content: args.pdf }],
  });

  if (error) throw new Error(error.message);
  return data;
}
