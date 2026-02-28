import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { consumeRateLimit } from '@/lib/server/rateLimit';

const allowedTypes = new Set([
  'booking_section_viewed',
  'booking_scrolled_into_view',
  'booking_interaction',
]);

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
const asNullableText = (value: unknown) => {
  const text = asText(value);
  return text.length > 0 ? text : null;
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

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);
  const rateLimit = consumeRateLimit({
    route: '/api/track/booking',
    ip: ip ?? 'unknown',
    limit: 40,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const type = asText((body as Record<string, unknown>).type);
  if (!allowedTypes.has(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const sourcePage = asNullableText((body as Record<string, unknown>).sourcePage);
  const service = asNullableText((body as Record<string, unknown>).service);
  const utmSource = asNullableText((body as Record<string, unknown>).utmSource);
  const utmMedium = asNullableText((body as Record<string, unknown>).utmMedium);
  const utmCampaign = asNullableText((body as Record<string, unknown>).utmCampaign);
  const referrer = asNullableText((body as Record<string, unknown>).referrer)
    ?? asNullableText(req.headers.get('referer'));
  const userAgent = asNullableText(req.headers.get('user-agent'));
  const ipHash = ip ? crypto.createHash('sha256').update(ip).digest('hex') : null;

  await prisma.bookingEvent.create({
    data: {
      type,
      sourcePage,
      service,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
      userAgent,
      ipHash,
    },
  });

  return NextResponse.json({ success: true });
}
