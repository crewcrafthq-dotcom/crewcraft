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
  // href is escaped too: a stored link containing a quote must not be able to
  // break out of the attribute and inject markup into customer emails.
  return `<tr><td style="padding:8px 0 20px;">
    <a href="${escapeHtml(href)}" style="display:inline-block;background:${accent};color:${accentFg};text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:10px;">${escapeHtml(label)}</a>
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

interface InvoiceReminderEmailArgs {
  businessName: string;
  customerName: string;
  total: number;
  dueDate: string | null;
  publicUrl: string;
  accent: string;
  accentFg: string;
}

/** Friendly past-due invoice nudge. */
export function invoiceReminderEmailHtml({
  businessName,
  customerName,
  total,
  dueDate,
  publicUrl,
  accent,
  accentFg,
}: InvoiceReminderEmailArgs): string {
  const hi = customerName ? `Hi ${escapeHtml(customerName)},` : 'Hi,';
  const due = dueDate ? ` (due ${shortDate(dueDate)})` : '';
  return emailShell(
    heading(businessName) +
      paragraph(
        `${hi}<br/><br/>
        A quick reminder that your invoice for <strong>${money(total)}</strong>${due} is still open.
        You can view it and see the payment options below — and if it's already on its way, thank you!`,
      ) +
      button({ href: publicUrl, label: 'View the invoice', accent, accentFg }) +
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

// ── Seasonal tune-up reminder (service_reminders cron) ──────────────────

interface ServiceReminderArgs {
  businessName: string;
  customerName: string;
  phone: string | null;
  accent: string;
  accentFg: string;
}

export function serviceReminderEmailHtml({
  businessName,
  customerName,
  phone,
  accent,
  accentFg,
}: ServiceReminderArgs): string {
  const hi = customerName ? `Hi ${escapeHtml(customerName)},` : 'Hi,';
  const call = phone
    ? paragraph(`Call or text <strong>${escapeHtml(phone)}</strong> and we’ll get you on the schedule.`)
    : paragraph('Reply to this email and we’ll get you on the schedule.');
  return emailShell(
    heading('Time for your seasonal tune-up') +
      paragraph(
        `${hi}<br/><br/>
        It's been a while since your last service — a seasonal tune-up keeps the system efficient,
        catches small problems before they're big ones, and protects the warranty.`,
      ) +
      call +
      signoff(businessName),
  );
}

// ── Storm / emergency lead page ─────────────────────────────────────────

interface LeadNotifyArgs {
  businessName: string;
  lead: { name: string; phone: string | null; email: string | null; address: string | null; message: string | null };
  accent: string;
  accentFg: string;
}

/** To the contractor: a new lead just came in from your public lead page. */
export function leadNotifyEmailHtml({ businessName, lead, accent, accentFg }: LeadNotifyArgs): string {
  const row = (label: string, v: string | null) =>
    v ? `<strong>${label}:</strong> ${escapeHtml(v)}<br/>` : '';
  const tel = lead.phone ? lead.phone.replace(/[^+0-9]/g, '') : '';
  return emailShell(
    heading('New lead from your lead page') +
      paragraph(
        row('Name', lead.name) +
          row('Phone', lead.phone) +
          row('Email', lead.email) +
          row('Address', lead.address) +
          (lead.message ? `<br/>“${escapeHtml(lead.message)}”` : ''),
      ) +
      (tel ? button({ href: `tel:${tel}`, label: `Call ${lead.name}`, accent, accentFg }) : '') +
      `<tr><td style="font-size:13px;line-height:1.5;color:#46566A;">— Crewcraft, for ${escapeHtml(businessName)}. Speed wins these — call while it’s hot.</td></tr>`,
  );
}

interface LeadAutoReplyArgs {
  businessName: string;
  leadName: string;
  phone: string | null;
  accent: string;
  accentFg: string;
}

/** To the homeowner, instantly: we got your request. */
export function leadAutoReplyEmailHtml({
  businessName,
  leadName,
  phone,
  accent,
  accentFg,
}: LeadAutoReplyArgs): string {
  const hi = leadName ? `Hi ${escapeHtml(leadName)},` : 'Hi,';
  return emailShell(
    heading('We got your request') +
      paragraph(
        `${hi}<br/><br/>
        Thanks for reaching out to <strong>${escapeHtml(businessName)}</strong> — your request is
        in and we'll contact you as soon as possible.`,
      ) +
      (phone
        ? paragraph(
            `If it's urgent, call us directly at <strong>${escapeHtml(phone)}</strong>.`,
          )
        : '') +
      signoff(businessName),
  );
}

// ── Tomorrow's jobs digest (scheduling cron) ────────────────────────────

interface JobsDigestArgs {
  businessName: string;
  jobs: { title: string; customer: string | null; address: string | null; time: string }[];
  scheduleUrl: string;
  accent: string;
  accentFg: string;
}

export function jobsDigestEmailHtml({ businessName, jobs, scheduleUrl, accent, accentFg }: JobsDigestArgs): string {
  const rows = jobs
    .map(
      (j) =>
        `<strong>${escapeHtml(j.time)}</strong> — ${escapeHtml(j.title)}` +
        (j.customer ? ` · ${escapeHtml(j.customer)}` : '') +
        (j.address ? `<br/><span style="color:#46566A;">${escapeHtml(j.address)}</span>` : ''),
    )
    .join('<br/><br/>');
  return emailShell(
    heading(`Tomorrow: ${jobs.length} ${jobs.length === 1 ? 'job' : 'jobs'}`) +
      paragraph(rows) +
      button({ href: scheduleUrl, label: 'Open the schedule', accent, accentFg }) +
      `<tr><td style="font-size:13px;line-height:1.5;color:#46566A;">— Crewcraft, for ${escapeHtml(businessName)}</td></tr>`,
  );
}
