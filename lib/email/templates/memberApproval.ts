import 'server-only';

import { escapeHtml } from '@/lib/email/templates/shared';

// ─── Member approval email ─────────────────────────────────────────────────────
// Sent to the new member when an admin approves their waitlist entry.

type MemberApprovalInput = {
  name: string | null;
  email: string;
  tempPassword: string;
  loginUrl: string;
};

export function memberApprovalTemplate({
  name,
  email,
  tempPassword,
  loginUrl,
}: MemberApprovalInput) {
  const greeting = name ? `Hi ${escapeHtml(name)},` : 'Hi there,';

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>You're in — Taylor-Made Baby Academy</title>
      </head>
      <body style="margin:0;background:#fcf7f4;padding:24px 12px;font-family:Georgia,'Times New Roman',serif;">

        <!-- Preview text -->
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
          You&rsquo;re approved — your Taylor-Made Baby Academy login is ready.
        </div>

        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse:collapse;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="max-width:640px;border-collapse:collapse;">
                <tr>
                  <td style="overflow:hidden;border:1px solid rgba(94,69,82,0.08);border-radius:28px;background:linear-gradient(180deg,#fffdfb 0%,#fff6f7 100%);box-shadow:0 18px 48px rgba(47,36,48,0.08);padding:40px 32px;">

                    <!-- Eyebrow -->
                    <p style="margin:0 0 14px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.26em;text-transform:uppercase;color:#a16578;">
                      Taylor-Made Baby Academy
                    </p>

                    <!-- Title -->
                    <h1 style="margin:0 0 22px;color:#241b22;font-size:34px;line-height:1.05;font-weight:600;letter-spacing:-0.04em;">
                      ${greeting}
                    </h1>

                    <!-- Body copy -->
                    <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:#453b43;">
                      You&rsquo;re in. Your Taylor-Made Baby Academy account has been approved and your login is ready.
                    </p>
                    <p style="margin:0 0 24px;font-size:16px;line-height:1.75;color:#453b43;">
                      Use the credentials below to sign in:
                    </p>

                    <!-- Credential box -->
                    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"
                      style="border-collapse:collapse;border-radius:18px;background:linear-gradient(135deg,#fff8fa 0%,#fff3f5 100%);border:1px solid rgba(215,161,175,0.32);margin-bottom:28px;">
                      <tr>
                        <td style="padding:24px 28px;">
                          <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse:collapse;">
                            <tr>
                              <td style="padding-bottom:14px;vertical-align:top;">
                                <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#a16578;">Email</p>
                                <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#241b22;font-weight:600;">
                                  ${escapeHtml(email)}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top:14px;border-top:1px solid rgba(215,161,175,0.22);vertical-align:top;">
                                <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#a16578;">Temporary password</p>
                                <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:17px;letter-spacing:0.08em;color:#241b22;font-weight:700;">
                                  ${escapeHtml(tempPassword)}
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA button -->
                    <div style="margin:4px 0 28px;">
                      <a
                        href="${escapeHtml(loginUrl)}"
                        style="display:inline-block;border-radius:999px;background:linear-gradient(180deg,#d889a0 0%,#c97691 100%);padding:14px 28px;color:#ffffff;font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.1em;text-decoration:none;text-transform:uppercase;"
                      >
                        Log in to the Academy
                      </a>
                    </div>

                    <!-- Next steps -->
                    <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:#453b43;">
                      Once you&rsquo;re in, I&rsquo;d recommend starting with the Registry Path &mdash; it&rsquo;s where most families feel the most overwhelmed, and where getting organized early pays off the most.
                    </p>

                    <!-- Signature -->
                    <p style="margin:24px 0 4px;font-size:16px;line-height:1.6;color:#453b43;">Warmly,</p>
                    <p style="margin:0;font-size:16px;line-height:1.6;color:#453b43;font-weight:600;">Taylor</p>

                    <!-- Footer note -->
                    <p style="margin:28px 0 0;padding-top:20px;border-top:1px solid rgba(94,69,82,0.08);font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#9b8e96;">
                      This is a temporary password &mdash; you can update it any time from your dashboard under Profile Settings. If you have any trouble logging in, just reply to this email.
                    </p>

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

// ─── Admin backup notification ────────────────────────────────────────────────
// Sent to Taylor so she has a permanent record of the temp password,
// since the admin UI only shows it once.

type AdminApprovalBackupInput = {
  name: string | null;
  email: string;
  tempPassword: string;
  tier: string;
};

export function adminApprovalBackupTemplate({
  name,
  email,
  tempPassword,
  tier,
}: AdminApprovalBackupInput) {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Academy approval: ${escapeHtml(email)}</title>
      </head>
      <body style="margin:0;background:#f8f4f2;padding:24px 12px;font-family:Arial,sans-serif;">
        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse:collapse;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="max-width:600px;border-collapse:collapse;">
                <tr>
                  <td style="border:1px solid rgba(47,36,48,0.08);border-radius:20px;background:#ffffff;padding:28px 32px;box-shadow:0 12px 32px rgba(47,36,48,0.06);">
                    <p style="margin:0 0 10px;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#a16578;">TMBC Admin</p>
                    <h2 style="margin:0 0 18px;color:#241b22;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.1;letter-spacing:-0.03em;">
                      Academy member approved
                    </h2>
                    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse:collapse;">
                      <tr>
                        <td style="padding:0 0 10px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8f7e88;width:120px;">Name</td>
                        <td style="padding:0 0 10px 16px;font-size:15px;color:#2f2430;">${escapeHtml(name ?? '—')}</td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 10px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8f7e88;">Email</td>
                        <td style="padding:0 0 10px 16px;font-size:15px;color:#2f2430;">${escapeHtml(email)}</td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 10px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8f7e88;">Tier</td>
                        <td style="padding:0 0 10px 16px;font-size:15px;color:#2f2430;">${escapeHtml(tier)}</td>
                      </tr>
                      <tr>
                        <td style="padding:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8f7e88;">Temp password</td>
                        <td style="padding:0 0 0 16px;font-size:15px;font-family:'Courier New',Courier,monospace;font-weight:700;letter-spacing:0.06em;color:#2f2430;">${escapeHtml(tempPassword)}</td>
                      </tr>
                    </table>
                    <p style="margin:18px 0 0;font-size:12px;line-height:1.7;color:#9b8e96;">
                      A login email was sent to the member with these credentials. This record is your backup copy.
                    </p>
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
