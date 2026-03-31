import 'server-only';

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

type EmailLayoutInput = {
  previewText: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  cta?: {
    label: string;
    href: string;
  };
  note?: string;
  signature?: string[];
};

export function renderEmailLayout({
  previewText,
  eyebrow,
  title,
  paragraphs,
  cta,
  note,
  signature = ['Warmly,', 'Taylor'],
}: EmailLayoutInput) {
  const renderedParagraphs = paragraphs
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:#453b43;">${escapeHtml(paragraph)}</p>`,
    )
    .join('');

  const renderedSignature = signature
    .map(
      (line, index) =>
        `<p style="margin:${index === 0 ? '24px' : '4px'} 0 0;font-size:16px;line-height:1.6;color:#453b43;font-weight:${index > 0 ? '600' : '400'};">${escapeHtml(line)}</p>`,
    )
    .join('');

  const renderedCta = cta
    ? `
      <div style="margin:28px 0 8px;">
        <a
          href="${escapeHtml(cta.href)}"
          style="display:inline-block;border-radius:999px;background:linear-gradient(180deg,#d889a0 0%,#c97691 100%);padding:14px 22px;color:#ffffff;font-size:14px;font-weight:600;letter-spacing:0.06em;text-decoration:none;text-transform:uppercase;"
        >
          ${escapeHtml(cta.label)}
        </a>
      </div>
    `
    : '';

  const renderedNote = note
    ? `<p style="margin:22px 0 0;font-size:13px;line-height:1.7;color:#7b6a74;">${escapeHtml(note)}</p>`
    : '';

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin:0;background:#fcf7f4;padding:24px 12px;font-family:Georgia,'Times New Roman',serif;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(previewText)}</div>
        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse:collapse;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="max-width:640px;border-collapse:collapse;">
                <tr>
                  <td
                    style="overflow:hidden;border:1px solid rgba(94,69,82,0.08);border-radius:28px;background:linear-gradient(180deg,#fffdfb 0%,#fff6f7 100%);box-shadow:0 18px 48px rgba(47,36,48,0.08);padding:40px 32px;"
                  >
                    <p style="margin:0 0 14px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.26em;text-transform:uppercase;color:#a16578;">
                      ${escapeHtml(eyebrow)}
                    </p>
                    <h1 style="margin:0 0 18px;color:#241b22;font-size:34px;line-height:1.05;font-weight:600;letter-spacing:-0.04em;">
                      ${escapeHtml(title)}
                    </h1>
                    ${renderedParagraphs}
                    ${renderedCta}
                    ${renderedSignature}
                    ${renderedNote}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `.trim();
}

export function renderAdminFieldRows(entries: Array<{ label: string; value: string }>) {
  return entries
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:0 0 12px;vertical-align:top;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#8f7e88;">
            ${escapeHtml(label)}
          </td>
          <td style="padding:0 0 12px 16px;vertical-align:top;font-size:15px;line-height:1.7;color:#2f2430;">
            ${escapeHtml(value)}
          </td>
        </tr>
      `,
    )
    .join('');
}
