import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { forbiddenResponse, rejectReviewerMutation } from '@/lib/server/apiAuth';
import prisma from '@/lib/server/prisma';
import { consumeRateLimit } from '@/lib/server/rateLimit';
import {
  GuideAnalyticsEvents,
  GUIDE_TRACKABLE_PUBLIC_EVENT_NAMES,
  normalizeGuideAnalyticsEventName,
} from '@/lib/guides/events';
import { logGuideEvent } from '@/lib/server/guideAnalytics';
import { GUIDE_STORAGE_UNAVAILABLE_MESSAGE, isGuideStorageUnavailableError } from '@/lib/server/guideStorage';
import {
  SEEN_COOKIE_NAME,
  SEEN_WINDOW_SECONDS,
  buildSeenCookie,
  hasSeen,
  isLikelyBot,
  seenKey,
} from '@/lib/server/viewTracking';

const allowedEvents = new Set<string>(GUIDE_TRACKABLE_PUBLIC_EVENT_NAMES);

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
    try {
      await rejectReviewerMutation(req);
    } catch (error) {
      return forbiddenResponse(error);
    }

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
    const normalizedEvent = normalizeGuideAnalyticsEventName(event);
    if (!normalizedEvent) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const meta =
      (body as Record<string, unknown>).meta && typeof (body as Record<string, unknown>).meta === 'object'
        ? ((body as Record<string, unknown>).meta as Record<string, unknown>)
        : null;
    const sourceRoute =
      asText((body as Record<string, unknown>).sourceRoute) || `/guides/${asText((body as Record<string, unknown>).slug)}`;
    const visitorHash = ip ? crypto.createHash('sha256').update(ip).digest('hex') : null;

    // Bot / no-op filtering: crawlers and HTTP libraries must not inflate the
    // counter (GA already filters these).
    if (isLikelyBot(req.headers.get('user-agent'))) {
      return NextResponse.json({ guideId: id, views: null, counted: false, reason: 'bot' });
    }

    // Per-visitor de-dup for VIEW: count a reader once per guide per window so
    // refreshes / quick re-visits don't each add +1.
    const cookieValue = req.cookies.get(SEEN_COOKIE_NAME)?.value;
    const dedupKey = seenKey('g', id);
    const isView = normalizedEvent === GuideAnalyticsEvents.VIEW;
    const alreadyCountedView = isView && hasSeen(cookieValue, dedupKey);

    let views: number;
    if (isView && !alreadyCountedView) {
      const updated = await prisma.guide.update({
        where: { id },
        data: { views: { increment: 1 } },
        select: { id: true, views: true },
      });
      views = updated.views;
      await logGuideEvent({ guideId: id, event: normalizedEvent, sourceRoute, visitorHash, meta });
    } else {
      const guide = await prisma.guide.findUniqueOrThrow({ where: { id }, select: { id: true, views: true } });
      views = guide.views;
      // Non-VIEW events are still logged in full; deduped VIEWs are not re-logged.
      if (!isView) {
        await logGuideEvent({ guideId: id, event: normalizedEvent, sourceRoute, visitorHash, meta });
      }
    }

    const res = NextResponse.json({
      guideId: id,
      views,
      counted: isView ? !alreadyCountedView : true,
    });

    if (isView && !alreadyCountedView) {
      res.cookies.set(SEEN_COOKIE_NAME, buildSeenCookie(cookieValue, dedupKey), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: SEEN_WINDOW_SECONDS,
      });
    }

    return res;
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
