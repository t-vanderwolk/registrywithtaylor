import { NextRequest, NextResponse } from 'next/server';
import { consumeRateLimit } from '@/lib/server/rateLimit';

export const runtime = 'nodejs';

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL?.trim() || 'taylor@taylormadebabyco.com';
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL?.trim() || CONTACT_TO_EMAIL;
const MICROSOFT_TENANT_ID = process.env.MICROSOFT_TENANT_ID?.trim();
const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID?.trim();
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET?.trim();
const MICROSOFT_SEND_AS_USER =
  process.env.MICROSOFT_SEND_AS_USER?.trim() || CONTACT_FROM_EMAIL;

const SERVICE_LABELS: Record<string, string> = {
  consultation: 'Complimentary Consultation',
  'focused-edit': 'The Focused Edit',
  'signature-plan': 'The Signature Plan',
  'private-concierge': 'The Private Concierge',
};

const asText = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');

const asOptionalText = (value: FormDataEntryValue | null) => {
  const text = asText(value);
  return text.length > 0 ? text : null;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const formatServiceLabel = (value: string | null) => {
  if (!value) {
    return null;
  }

  return SERVICE_LABELS[value] ?? value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const getRequestIp = (req: NextRequest) => {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const [first] = forwardedFor.split(',');
    if (first?.trim()) {
      return first.trim();
    }
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp?.trim()) {
    return realIp.trim();
  }

  return null;
};

const buildEmailBody = (entries: Array<[string, string | null]>) =>
  entries
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');

const buildMailtoUrl = (subject: string, body: string) =>
  `mailto:${encodeURIComponent(CONTACT_TO_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const isPlaceholderValue = (value: string | undefined) => {
  if (!value) {
    return true;
  }

  const normalized = value.trim().toUpperCase();
  return (
    normalized.length === 0 ||
    normalized.includes('YOUR_PASSWORD') ||
    normalized.includes('APP_PASSWORD') ||
    normalized.includes('YOUR_CLIENT') ||
    normalized.includes('YOUR_TENANT') ||
    normalized.includes('YOUR_') ||
    normalized.includes('CHANGE_ME')
  );
};

async function getMicrosoftGraphAccessToken() {
  if (
    isPlaceholderValue(MICROSOFT_TENANT_ID) ||
    isPlaceholderValue(MICROSOFT_CLIENT_ID) ||
    isPlaceholderValue(MICROSOFT_CLIENT_SECRET)
  ) {
    return null;
  }

  const tokenResponse = await fetch(
    `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: MICROSOFT_CLIENT_ID!,
        client_secret: MICROSOFT_CLIENT_SECRET!,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      }),
    },
  );

  const payload = (await tokenResponse.json().catch(() => null)) as
    | { access_token?: string; error?: string; error_description?: string }
    | null;

  if (!tokenResponse.ok || !payload?.access_token) {
    throw new Error(payload?.error_description || payload?.error || 'Unable to acquire Microsoft Graph access token.');
  }

  return payload.access_token;
}

async function sendViaMicrosoftGraph({
  subject,
  body,
  replyTo,
}: {
  subject: string;
  body: string;
  replyTo: string;
}) {
  const accessToken = await getMicrosoftGraphAccessToken();
  if (!accessToken) {
    return false;
  }

  const graphResponse = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MICROSOFT_SEND_AS_USER)}/sendMail`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          subject,
          body: {
            contentType: 'Text',
            content: body,
          },
          toRecipients: [
            {
              emailAddress: {
                address: CONTACT_TO_EMAIL,
              },
            },
          ],
          replyTo: [
            {
              emailAddress: {
                address: replyTo,
              },
            },
          ],
          from: {
            emailAddress: {
              address: MICROSOFT_SEND_AS_USER,
            },
          },
        },
        saveToSentItems: true,
      }),
    },
  );

  if (!graphResponse.ok) {
    const payload = (await graphResponse.json().catch(() => null)) as
      | { error?: { message?: string; code?: string } }
      | null;
    throw new Error(payload?.error?.message || payload?.error?.code || 'Unable to send email through Microsoft Graph.');
  }

  return true;
}

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);
  const rateLimit = consumeRateLimit({
    route: '/api/contact',
    ip: ip ?? 'unknown',
    limit: 6,
    windowMs: 10 * 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many inquiries submitted. Please try again shortly.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: 'Invalid form submission.' }, { status: 400 });
  }

  // Honeypot field for basic spam filtering.
  if (asText(formData.get('company')).length > 0) {
    return NextResponse.json({ success: true });
  }

  const fullName = asText(formData.get('fullName'));
  const email = asText(formData.get('email'));
  const service = asOptionalText(formData.get('service'));
  const serviceLabel = formatServiceLabel(service);

  if (!fullName || !email) {
    return NextResponse.json({ error: 'Full name and email are required.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const fields: Array<[string, string | null]> = [
    ['Name', fullName],
    ['Email', email],
    ['Service', serviceLabel],
    ['Due Date', asOptionalText(formData.get('dueDate'))],
    ['Registry URL', asOptionalText(formData.get('registryLink'))],
    ['Home Type', asOptionalText(formData.get('homeType'))],
    ['Budget Range', asOptionalText(formData.get('budgetRange'))],
    ['Top Concerns', asOptionalText(formData.get('topConcerns'))],
    ['Biggest Stress', asOptionalText(formData.get('biggestStress'))],
    ['Location', asOptionalText(formData.get('location'))],
    ['Preferred Level of Support', asOptionalText(formData.get('levelOfSupport'))],
    ['Timeline', asOptionalText(formData.get('timeline'))],
    ['Notes', asOptionalText(formData.get('notes'))],
    ['Referrer', asOptionalText(formData.get('referrer'))],
    ['Source URL', asOptionalText(formData.get('sourceUrl'))],
  ];

  const subject = serviceLabel
    ? `New website inquiry: ${serviceLabel}`
    : `New website inquiry from ${fullName}`;

  const body = buildEmailBody(fields);

  try {
    const delivered = await sendViaMicrosoftGraph({
      subject,
      body,
      replyTo: email,
    });

    if (!delivered) {
      return NextResponse.json({
        success: true,
        delivery: 'mailto',
        mailtoUrl: buildMailtoUrl(subject, body),
      });
    }
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({
        success: true,
        delivery: 'mailto',
        mailtoUrl: buildMailtoUrl(subject, body),
      });
    }

    return NextResponse.json(
      {
        error: 'Email delivery is temporarily unavailable. Please email taylor@taylormadebabyco.com directly.',
        mailtoUrl: buildMailtoUrl(subject, body),
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true, delivery: 'smtp' });
}
