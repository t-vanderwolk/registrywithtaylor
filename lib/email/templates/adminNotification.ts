import 'server-only';

import { escapeHtml, renderAdminFieldRows } from '@/lib/email/templates/shared';

type AdminNotificationTemplateInput = {
  name: string;
  email: string;
  type: 'contact' | 'consultation';
  message: string;
  details?: Array<{ label: string; value: string }>;
};

export function adminNotificationTemplate({
  name,
  email,
  type,
  message,
  details = [],
}: AdminNotificationTemplateInput) {
  const rows = renderAdminFieldRows([
    { label: 'Name', value: name },
    { label: 'Email', value: email },
    { label: 'Type', value: type },
    ...details,
  ]);

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New TMBC Inquiry</title>
      </head>
      <body style="margin:0;background:#f8f4f2;padding:24px 12px;font-family:Arial,sans-serif;">
        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse:collapse;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="max-width:660px;border-collapse:collapse;">
                <tr>
                  <td style="border:1px solid rgba(47,36,48,0.08);border-radius:24px;background:#ffffff;padding:32px;box-shadow:0 16px 40px rgba(47,36,48,0.06);">
                    <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#a16578;">TMBC Inbox</p>
                    <h1 style="margin:0 0 20px;color:#241b22;font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.08;letter-spacing:-0.04em;">
                      New inquiry received
                    </h1>

                    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse:collapse;">
                      ${rows}
                    </table>

                    <div style="margin-top:18px;border-radius:20px;background:linear-gradient(180deg,#fff9fa 0%,#fff3f5 100%);padding:20px;">
                      <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#8f7e88;">Message</p>
                      <p style="margin:0;font-size:15px;line-height:1.8;color:#2f2430;white-space:pre-wrap;">${escapeHtml(message)}</p>
                    </div>
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
