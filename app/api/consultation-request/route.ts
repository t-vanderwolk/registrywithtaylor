import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { adminNotificationTemplate } from '@/lib/email/templates/adminNotification';
import { consultationConfirmationTemplate } from '@/lib/email/templates/consultationConfirmation';
import { getAdminEmail, sendEmail } from '@/lib/email/sendEmail';
import { forbiddenResponse, rejectReviewerMutation } from '@/lib/server/apiAuth';
import prisma from '@/lib/server/prisma';
import { consumeRateLimit } from '@/lib/server/rateLimit';

export const runtime = 'nodejs';

const asText = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value.trim() : '';

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getRequestIp = (req: NextRequest) => {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const [first] = forwarded.split(',');
    if (first?.trim()) return first.trim();
  }
  return req.headers.get('x-real-ip') ?? null;
};

const wantsJson = (req: NextRequest) =>
  req.headers.get('x-tmbc-form-mode') === 'async' ||
  req.headers.get('accept')?.includes('application/json');

const jsonError = (message: string, status: number, fieldErrors?: Record<string, string>) =>
  NextResponse.json({ error: message, fieldErrors: fieldErrors ?? {} }, { status });

async function addMailchimpConsultationTag(email: string, name: string) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const dc = 'us22';

  if (!apiKey || !audienceId) return;

  const hash = createHash('md5').update(email.toLowerCase()).digest('hex');
  const firstName = name.split(' ')[0] ?? name;
  const auth = `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`;
  const headers = { Authorization: auth, 'Content-Type': 'application/json' };

  // Upsert subscriber
  await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${hash}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      email_address: email,
      status_if_new: 'subscribed',
      merge_fields: { FNAME: firstName },
    }),
  }).catch(() => null);

  // Add "Consultation Lead" tag (triggers Mailchimp automation)
  await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${hash}/tags`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      tags: [{ name: 'Consultation Lead', status: 'active' }],
    }),
  }).catch(() => null);
}

export async function POST(req: NextRequest) {
  try {
    await rejectReviewerMutation(req);
  } catch (error) {
    return forbiddenResponse(error);
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return jsonError('Please try submitting the form again.', 400);
  }

  const successPath = '/consultation/confirmation';

  // Honeypot
  if (asText(formData.get('company')).length > 0) {
    return wantsJson(req)
      ? NextResponse.json({ success: true, redirectTo: successPath })
      : NextResponse.redirect(new URL(successPath, req.url), 303);
  }

  // Rate limit
  const ip = getRequestIp(req);
  const rateLimit = consumeRateLimit({
    route: '/api/consultation-request',
    ip: ip ?? 'unknown',
    limit: 6,
    windowMs: 10 * 60_000,
  });

  if (!rateLimit.allowed) {
    return wantsJson(req)
      ? jsonError('Too many requests were submitted. Please try again shortly.', 429)
      : NextResponse.redirect(new URL('/consultation?error=rate-limit', req.url), 303);
  }

  const name = asText(formData.get('name'));
  const email = asText(formData.get('email'));
  const phone = asText(formData.get('phone'));
  const sessionGoals = asText(formData.get('sessionGoals'));

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Your name helps me know who I'm planning for.";
  if (!email) fieldErrors.email = 'An email gives me a way to follow up directly.';
  else if (!isValidEmail(email)) fieldErrors.email = 'Please enter a valid email address.';

  if (Object.keys(fieldErrors).length > 0) {
    return wantsJson(req)
      ? jsonError('A couple of fields need attention.', 400, fieldErrors)
      : NextResponse.redirect(new URL('/consultation?error=required', req.url), 303);
  }

  // Save minimal record
  await prisma.consultationRequest.create({
    data: {
      name,
      email,
      dueDate: null,
      city: null,
      babyNumber: null,
      message: sessionGoals || null,
      intakeSummary: undefined,
    },
    select: { id: true },
  });

  // Add to Mailchimp with consultation tag
  await addMailchimpConsultationTag(email, name);

  // Notify client + Taylor
  await Promise.allSettled([
    sendEmail({
      to: email,
      subject: 'Your intake form is ready — Taylor-Made Baby Co.',
      html: consultationConfirmationTemplate({ name }),
    }),
    sendEmail({
      to: getAdminEmail(),
      replyTo: email,
      subject: 'New TMBC Consultation Request',
      html: adminNotificationTemplate({
        name,
        email,
        type: 'consultation',
        message: sessionGoals || 'No additional notes provided.',
        details: phone ? [{ label: 'Phone', value: phone }] : [],
      }),
    }),
  ]);

  return wantsJson(req)
    ? NextResponse.json({ success: true, redirectTo: successPath })
    : NextResponse.redirect(new URL(successPath, req.url), 303);
}
