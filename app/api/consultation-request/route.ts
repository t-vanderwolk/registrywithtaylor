import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { consumeRateLimit } from '@/lib/server/rateLimit';

export const runtime = 'nodejs';

const asText = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');

const asOptionalText = (value: FormDataEntryValue | null) => {
  const text = asText(value);
  return text.length > 0 ? text : null;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const asInternalPath = (value: FormDataEntryValue | null, fallback: string) => {
  const text = asText(value);
  if (!text || !text.startsWith('/') || text.startsWith('//')) {
    return fallback;
  }

  return text;
};

const asOptionalDate = (value: FormDataEntryValue | null) => {
  const text = asText(value);
  if (!text) {
    return { value: null, error: false } as const;
  }

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) {
    return { value: null, error: true } as const;
  }

  return { value: parsed, error: false } as const;
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

const redirectToPath = (req: NextRequest, path: string, error?: string) => {
  const url = new URL(path, req.url);
  if (error) {
    url.searchParams.set('error', error);
  }

  return NextResponse.redirect(url, { status: 303 });
};

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return redirectToPath(req, '/consultation', 'invalid-form');
  }

  const returnPath = asInternalPath(formData.get('returnPath'), '/consultation');
  const successPath = asInternalPath(formData.get('successPath'), '/consultation/confirmation');

  const ip = getRequestIp(req);
  const rateLimit = consumeRateLimit({
    route: '/api/consultation-request',
    ip: ip ?? 'unknown',
    limit: 6,
    windowMs: 10 * 60_000,
  });

  if (!rateLimit.allowed) {
    return redirectToPath(req, returnPath, 'rate-limit');
  }

  // Honeypot field for basic spam filtering.
  if (asText(formData.get('company')).length > 0) {
    return redirectToPath(req, successPath);
  }

  const name = asText(formData.get('name'));
  const email = asText(formData.get('email'));
  const city = asOptionalText(formData.get('city'));
  const babyNumber = asOptionalText(formData.get('babyNumber'));
  const message = asOptionalText(formData.get('message'));
  const dueDate = asOptionalDate(formData.get('dueDate'));

  if (!name || !email) {
    return redirectToPath(req, returnPath, 'required');
  }

  if (!isValidEmail(email)) {
    return redirectToPath(req, returnPath, 'invalid-email');
  }

  if (dueDate.error) {
    return redirectToPath(req, returnPath, 'invalid-date');
  }

  await prisma.consultationRequest.create({
    data: {
      name,
      email,
      dueDate: dueDate.value,
      city,
      babyNumber,
      message,
    },
  });

  return redirectToPath(req, successPath);
}
