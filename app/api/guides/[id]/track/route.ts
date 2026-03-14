import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { consumeRateLimit } from '@/lib/server/rateLimit';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import { logGuideEvent } from '@/lib/server/guideAnalytics';
import { GUIDE_STORAGE_UNAVAILABLE_MESSAGE, isGuideStorageUnavailableError } from '@/lib/server/guideStorage';

const allowedEvents = new Set<string>([
  GuideAnalyticsEvents.VIEW,
  GuideAnalyticsEvents.AFFILIATE_CLICK,
  GuideAnalyticsEvents.TO_CONSULTATION_CLICK,
  GuideAnalyticsEvents.TO_CONTACT_CLICK,
  GuideAnalyticsEvents.TO_SERVICES_CLICK,
  GuideAnalyticsEvents.NEWSLETTER_CTA_CLICK,
]);

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

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

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const ip = getRequestIp(req);
    const rateLimit = consumeRateLimit({
      route: `/api/guides/${id}/track`,
      ip: ip ?? 'unknown',
      limit: 80,
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

    const event = asText((body as Record<string, unknown>).type);
    if (!allowedEvents.has(event)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const meta =
      (body as Record<string, unknown>).meta && typeof (body as Record<string, unknown>).meta === 'object'
        ? ((body as Record<string, unknown>).meta as Record<string, unknown>)
        : null;
    const sourceRoute =
      asText((body as Record<string, unknown>).sourceRoute) || `/guides/${asText((body as Record<string, unknown>).slug)}`;
    const visitorHash = ip ? crypto.createHash('sha256').update(ip).digest('hex') : null;

    const updated =
      event === GuideAnalyticsEvents.VIEW
        ? await prisma.guide.update({
            where: { id },
            data: { views: { increment: 1 } },
            select: { id: true, views: true },
          })
        : await prisma.guide.findUniqueOrThrow({
            where: { id },
            select: { id: true, views: true },
          });

    await logGuideEvent({
      guideId: id,
      event,
      sourceRoute,
      visitorHash,
      meta,
    });

    return NextResponse.json({
      guideId: updated.id,
      views: updated.views,
    });
  } catch (error) {
    if (isGuideStorageUnavailableError(error)) {
      return NextResponse.json({ error: GUIDE_STORAGE_UNAVAILABLE_MESSAGE }, { status: 503 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    throw error;
  }
}
