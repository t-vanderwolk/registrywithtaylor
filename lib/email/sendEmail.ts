import 'server-only';

import sgMail from '@sendgrid/mail';

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

let sendGridConfigured = false;
const DEFAULT_ADMIN_EMAIL = 'info@taylormadebabyco.com';

function getSendGridApiKey() {
  const apiKey = process.env.SENDGRID_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY is not configured.');
  }

  return apiKey;
}

function getFromAddress() {
  const configuredFrom = process.env.CONTACT_FROM_EMAIL?.trim();
  return configuredFrom || 'info@taylormadebabyco.com';
}

export function getAdminEmail() {
  const configuredAdmin = process.env.ADMIN_EMAIL?.trim();
  if (configuredAdmin && configuredAdmin !== 'admin@me.com') {
    return configuredAdmin;
  }

  const legacyContactTo = process.env.CONTACT_TO_EMAIL?.trim();
  return legacyContactTo || DEFAULT_ADMIN_EMAIL;
}

function ensureSendGridConfigured() {
  if (sendGridConfigured) {
    return;
  }

  sgMail.setApiKey(getSendGridApiKey());
  sendGridConfigured = true;
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailInput) {
  ensureSendGridConfigured();

  await sgMail.send({
    to,
    from: getFromAddress(),
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
}
