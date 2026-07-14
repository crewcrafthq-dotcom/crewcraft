import 'server-only';

import { Resend } from 'resend';

export interface AppEmailArgs {
  to: string;
  /** Shown as the sender name — usually the contractor's business name. */
  fromName: string;
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
}

/** One Resend seam for every app email — estimate, invoice, reminder, review. */
export async function sendAppEmail(args: AppEmailArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  if (!from) throw new Error('RESEND_FROM_EMAIL is not set');

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: `${args.fromName} <${from}>`,
    to: args.to,
    subject: args.subject,
    html: args.html,
    attachments: args.attachments,
  });

  if (error) throw new Error(error.message);
  return data;
}
