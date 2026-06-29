import { money } from '@/lib/format';

interface EstimateEmailArgs {
  businessName: string;
  customerName: string;
  total: number;
  publicUrl: string;
  accent: string; // hex
  accentFg: string; // hex (text on the accent button)
}

/** Plain, contractor-voice estimate email. Inline styles for email clients. */
export function estimateEmailHtml({
  businessName,
  customerName,
  total,
  publicUrl,
  accent,
  accentFg,
}: EstimateEmailArgs): string {
  const hi = customerName ? `Hi ${escapeHtml(customerName)},` : 'Hi,';
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F2EBE0;font-family:Helvetica,Arial,sans-serif;color:#16263A;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2EBE0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FBF8F2;border-radius:14px;padding:32px;">
            <tr><td style="font-size:18px;font-weight:700;padding-bottom:8px;">${escapeHtml(businessName)}</td></tr>
            <tr><td style="font-size:15px;line-height:1.5;padding-bottom:16px;">
              ${hi}<br/><br/>
              Here's your estimate. The total comes to <strong>${money(total)}</strong>.
              Tap below to look it over — it opens right on your phone, and the PDF is attached.
            </td></tr>
            <tr><td style="padding:8px 0 20px;">
              <a href="${publicUrl}" style="display:inline-block;background:${accent};color:${accentFg};text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:10px;">View your estimate</a>
            </td></tr>
            <tr><td style="font-size:13px;line-height:1.5;color:#46566A;">
              Questions? Just reply to this email.<br/>
              — ${escapeHtml(businessName)}
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
