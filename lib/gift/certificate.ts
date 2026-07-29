import { GIFT_SITE_ORIGIN } from '@/lib/gift/config';

const PINK = '#D889A0';
const ACCENT = '#b45f77';
const CHARCOAL = '#2b2628';
const CREAM = '#fbf7f4';
const GOLD = '#c49c5e';

export type CertificateData = {
  recipientName: string;
  purchaserName: string;
  giftMessage?: string | null;
  code: string;
};

const redeemUrl = (code: string) => `${GIFT_SITE_ORIGIN}/redeem?code=${encodeURIComponent(code)}`;

/** The gift-certificate card, inline-styled so it renders in email and on the
 *  print-ready certificate page alike. */
export function renderCertificateCard(data: CertificateData, { withButton = true } = {}): string {
  const message = data.giftMessage?.trim();
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid rgba(216,137,160,0.32);border-radius:22px;overflow:hidden;box-shadow:0 18px 46px rgba(72,49,56,0.10);">
    <tr><td style="height:6px;background:linear-gradient(90deg,${PINK},${GOLD});"></td></tr>
    <tr><td style="padding:34px 34px 8px;text-align:center;">
      <div style="font:700 11px/1 -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:0.22em;text-transform:uppercase;color:${ACCENT};">Taylor-Made Baby Co.</div>
      <div style="font:700 34px/1 Georgia,'Times New Roman',serif;color:${CHARCOAL};margin:18px 0 6px;">🎀</div>
      <div style="font:600 25px/1.15 Georgia,serif;color:${CHARCOAL};letter-spacing:-0.01em;">You&rsquo;ve Been Given the<br/>Gift of Confidence</div>
      <p style="font:400 15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#6f6169;margin:16px auto 0;max-width:420px;">
        ${escapeHtml(data.recipientName)}, ${escapeHtml(data.purchaserName)} has gifted you a
        <strong style="color:${CHARCOAL};">1-hour virtual Registry Consult</strong> &mdash; personalized help with your registry, strollers, car seats, and nursery, so you can stop second-guessing and feel ready.
      </p>
    </td></tr>
    ${message ? `<tr><td style="padding:6px 34px 0;"><div style="background:${CREAM};border:1px solid rgba(216,137,160,0.24);border-radius:14px;padding:14px 18px;font:italic 400 14px/1.6 Georgia,serif;color:#5b4a50;text-align:center;">&ldquo;${escapeHtml(message)}&rdquo;</div></td></tr>` : ''}
    <tr><td style="padding:22px 34px 6px;text-align:center;">
      <div style="font:700 10px/1 -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:0.16em;text-transform:uppercase;color:#9a7d86;">Gift Code</div>
      <div style="font:800 26px/1 'Courier New',monospace;letter-spacing:0.14em;color:${CHARCOAL};margin-top:8px;">${escapeHtml(data.code)}</div>
    </td></tr>
    ${
      withButton
        ? `<tr><td style="padding:20px 34px 34px;text-align:center;">
      <a href="${redeemUrl(data.code)}" style="display:inline-block;background:${PINK};color:#ffffff;text-decoration:none;font:700 15px/1 -apple-system,Segoe UI,Roboto,sans-serif;padding:14px 30px;border-radius:999px;">Redeem Your Session &rarr;</a>
      <div style="font:400 12px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:#9a8f95;margin-top:12px;">or redeem at ${GIFT_SITE_ORIGIN.replace(/^https?:\/\//, '')}/redeem</div>
    </td></tr>`
        : `<tr><td style="padding:8px 34px 30px;text-align:center;"><div style="font:400 12px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:#9a8f95;">Redeem at ${GIFT_SITE_ORIGIN.replace(/^https?:\/\//, '')}/redeem</div></td></tr>`
    }
  </table>`;
}

/** Full HTML email for the recipient (delivery = now). */
export function renderRecipientEmail(data: CertificateData): string {
  return emailShell(renderCertificateCard(data, { withButton: true }));
}

/** Full HTML email for the purchaser. Includes the certificate when they chose
 *  to deliver it themselves; otherwise a simple confirmation. */
export function renderPurchaserEmail(
  data: CertificateData,
  deliveryMode: 'now' | 'self',
): string {
  const intro =
    deliveryMode === 'self'
      ? `<p style="font:400 15px/1.7 -apple-system,Segoe UI,Roboto,sans-serif;color:#5b4a50;text-align:center;max-width:460px;margin:0 auto 8px;">Thank you, ${escapeHtml(data.purchaserName)}! Your gift for <strong>${escapeHtml(data.recipientName)}</strong> is ready. Forward the certificate below whenever you&rsquo;d like &mdash; the gift code and redeem link are inside.</p>`
      : `<p style="font:400 15px/1.7 -apple-system,Segoe UI,Roboto,sans-serif;color:#5b4a50;text-align:center;max-width:460px;margin:0 auto 8px;">Thank you, ${escapeHtml(data.purchaserName)}! We&rsquo;ve emailed the gift certificate to <strong>${escapeHtml(data.recipientName)}</strong>. Here&rsquo;s a copy for your records.</p>`;
  return emailShell(`${intro}<div style="height:18px"></div>${renderCertificateCard(data, { withButton: true })}`);
}

/** Standalone, print-to-PDF friendly certificate page body. */
export function renderCertificatePageBody(data: CertificateData): string {
  return `<div style="min-height:100vh;background:${CREAM};padding:40px 16px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
    ${renderCertificateCard(data, { withButton: false })}
    <div style="text-align:center;margin-top:24px;" class="no-print">
      <button onclick="window.print()" style="background:${CHARCOAL};color:#fff;border:0;border-radius:999px;padding:12px 26px;font:700 14px/1 inherit;cursor:pointer;">Download / Print Certificate</button>
    </div>
    <style>@media print{.no-print{display:none!important}body{background:#fff}}</style>
  </div>`;
}

function emailShell(inner: string): string {
  return `<!doctype html><html><body style="margin:0;padding:28px 12px;background:${CREAM};">${inner}
    <div style="text-align:center;font:400 12px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#a99ea3;margin:22px auto 0;max-width:520px;">
      Taylor-Made Baby Co. &middot; Registry &amp; baby gear guidance<br/>Questions? Just reply to this email.
    </div>
  </body></html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
