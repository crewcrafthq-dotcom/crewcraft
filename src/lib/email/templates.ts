import { money, shortDate } from '@/lib/format';

/**
 * All customer/contractor emails share one card shell so they read as a
 * family. Inline styles only — email clients ignore stylesheets.
 */

interface ButtonArgs {
  href: string;
  label: string;
  accent: string; // hex
  accentFg: string; // hex (text on the accent button)
}

function emailShell(bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F2EBE0;font-family:Helvetica,Arial,sans-serif;color:#16263A;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2EBE0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FBF8F2;border-radius:14px;padding:32px;">
            ${bodyHtml}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function heading(text: string): string {
  return `<tr><td style="font-size:18px;font-weight:700;padding-bottom:8px;">${escapeHtml(text)}</td></tr>`;
}

function paragraph(html: string): string {
  return `<tr><td style="font-size:15px;line-height:1.5;padding-bottom:16px;">${html}</td></tr>`;
}

function button({ href, label, accent, accentFg }: ButtonArgs): string {
  return `<tr><td style="padding:8px 0 20px;">
    <a href="${href}" style="display:inline-block;background:${accent};color:${accentFg};text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:10px;">${escapeHtml(label)}</a>
  </td></tr>`;
}

function signoff(businessName: string): string {
  return `<tr><td style="font-size:13px;line-height:1.5;color:#46566A;">
    Questions? Just reply to this email.<br/>
    — ${escapeHtml(businessName)}
  </td></tr>`;
}

interface EstimateEmailArgs {
  businessName: string;
  customerName: string;
  total: number;
  publicUrl: string;
  accent: string; // hex
  accentFg: string; // hex
}

/** Plain, contractor-voice estimate email. */
export function estimateEmailHtml({
  businessName,
  customerName,
  total,
  publicUrl,
  accent,
  accentFg,
}: EstimateEmailArgs): string {
  const hi = customerName ? `Hi ${escapeHtml(customerName)},` : 'Hi,';
  return emailShell(
    heading(businessName) +
      paragraph(
        `${hi}<br/><br/>
        Here's your estimate. The total comes to <strong>${money(total)}</strong>.
        Tap below to look it over — it opens right on your phone, and the PDF is attached.`,
      ) +
      button({ href: publicUrl, label: 'View your estimate', accent, accentFg }) +
      signoff(businessName),
  );
}

interface InvoiceEmailArgs extends EstimateEmailArgs {
  dueDate: string | null; // ISO date
}

/** Invoice email — same voice, adds the due date. */
export function invoiceEmailHtml({
  businessName,
  customerName,
  total,
  publicUrl,
  dueDate,
  accent,
  accentFg,
}: InvoiceEmailArgs): string {
  const hi = customerName ? `Hi ${escapeHtml(customerName)},` : 'Hi,';
  const due = dueDate ? ` It's due by <strong>${shortDate(dueDate)}</strong>.` : '';
  return emailShell(
    heading(businessName) +
      paragraph(
        `${hi}<br/><br/>
        Here's your invoice. The total comes to <strong>${money(total)}</strong>.${due}
        Tap below to view it — the PDF is attached.`,
      ) +
      button({ href: publicUrl, label: 'View your invoice', accent, accentFg }) +
      signoff(businessName),
  );
}

interface ReminderEmailArgs {
  businessName: string;
  customerName: string;
  total: number;
  publicUrl: string;
  accent: string;
  accentFg: string;
}

/** Polite follow-up when an estimate has gone quiet. */
export function reminderEmailHtml({
  businessName,
  customerName,
  total,
  publicUrl,
  accent,
  accentFg,
}: ReminderEmailArgs): string {
  const hi = customerName ? `Hi ${escapeHtml(customerName)},` : 'Hi,';
  return emailShell(
    heading(businessName) +
      paragraph(
        `${hi}<br/><br/>
        Just checking in on the estimate we sent over — the total was <strong>${money(total)}</strong>.
        If you have any questions or want to adjust anything, reply here and we'll sort it out.`,
      ) +
      button({ href: publicUrl, label: 'View the estimate', accent, accentFg }) +
      signoff(businessName),
  );
}

interface ReviewRequestEmailArgs {
  businessName: string;
  customerName: string;
  reviewUrl: string;
  accent: string;
  accentFg: string;
}

/** Post-job "leave us a review" email. */
export function reviewRequestEmailHtml({
  businessName,
  customerName,
  reviewUrl,
  accent,
  accentFg,
}: ReviewRequestEmailArgs): string {
  const hi = customerName ? `Hi ${escapeHtml(customerName)},` : 'Hi,';
  return emailShell(
    heading(businessName) +
      paragraph(
        `${hi}<br/><br/>
        Thanks for trusting us with the job. If you were happy with the work,
        a quick review helps our small business more than you'd think — it takes about a minute.`,
      ) +
      button({ href: reviewUrl, label: 'Leave a review', accent, accentFg }) +
      signoff(businessName),
  );
}

interface ResponseNotificationArgs {
  businessName: string;
  customerName: string;
  total: number;
  accepted: boolean;
  signedName?: string | null;
  declineReason?: string | null;
  editorUrl: string;
  accent: string;
  accentFg: string;
}

/** Heads-up to the contractor when a customer accepts or declines. */
export function responseNotificationHtml({
  businessName,
  customerName,
  total,
  accepted,
  signedName,
  declineReason,
  editorUrl,
  accent,
  accentFg,
}: ResponseNotificationArgs): string {
  const who = customerName || 'Your customer';
  const body = accepted
    ? `<strong>${escapeHtml(who)}</strong> accepted your estimate for <strong>${money(total)}</strong>.` +
      (signedName ? `<br/>Signed: ${escapeHtml(signedName)}.` : '')
    : `<strong>${escapeHtml(who)}</strong> declined your estimate for <strong>${money(total)}</strong>.` +
      (declineReason ? `<br/>Their note: “${escapeHtml(declineReason)}”` : '');
  return emailShell(
    heading(accepted ? 'Estimate accepted 🎉' : 'Estimate declined') +
      paragraph(body) +
      button({ href: editorUrl, label: 'Open the estimate', accent, accentFg }) +
      `<tr><td style="font-size:13px;line-height:1.5;color:#46566A;">— Crewcraft, for ${escapeHtml(businessName)}</td></tr>`,
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
