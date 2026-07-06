import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { forbiddenResponse, rejectReviewerMutation } from '@/lib/server/apiAuth';
import prisma from '@/lib/server/prisma';
import { consumeRateLimit } from '@/lib/server/rateLimit';
import {
  SEEN_COOKIE_NAME,
  SEEN_WINDOW_SECONDS,
  buildSeenCookie,
  getRequestIp,
  hasSeen,
  isLikelyBot,
  recordUniqueServerView,
  seenKey,
  visitorHashFrom,
} from '@/lib/server/viewTracking';

const normalizeEvent = (type: unknown) => {
  if (typeof type !== 'string') {
    return null;
  }

  const lower = type.toLowerCase();
  if (lower === 'view') {
    return 'VIEW';
  }
  if (lower === 'click') {
    return 'CLICK';
  }
  if (lower === 'affiliate_click') {
    return 'AFFILIATE_CLICK';
  }

  return null;
};

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await rejectReviewerMutation(req);
  } catch (error) {
    return forbiddenResponse(error);
  }

  const { id } = await context.params;
  const body = await req.json();
  const event = normalizeEvent(body.type);

  if (!event) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  // Abuse guard: cap how fast a single IP can post events.
  const ip = getRequestIp(req);
  const rateLimit = consumeRateLimit({
    route: `/api/blog/${id}/track`,
    ip: ip ?? 'unknown',
    limit: 80,
    windowMs: 60_000,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    );
  }

  // Bot / no-op filtering: crawlers, link-preview bots, and HTTP libraries must
  // not inflate the counter the way they did before. GA filters these already,
  // so dropping them here brings the two closer together.
  const userAgent = req.headers.get('user-agent');
  if (isLikelyBot(userAgent)) {
    return NextResponse.json({ postId: id, views: null, counted: false, reason: 'bot' });
  }

  // Per-visitor de-duplication for VIEW. Fast path: a cookie that says "already
  // counted within 6h" short-circuits without touching the DB. Durable backstop:
  // when the cookie is absent/cleared, ViewDedup (keyed on IP+UA hash) still
  // blocks a repeat for the rest of the day.
  const isView = event === 'VIEW';
  const cookieValue = req.cookies.get(SEEN_COOKIE_NAME)?.value;
  const dedupKey = seenKey('p', id);
  const cookieSeen = isView && hasSeen(cookieValue, dedupKey);

  let countThisView = false;
  const refreshCookie = isView && !cookieSeen;
  if (isView && !cookieSeen) {
    const visitorHash = visitorHashFrom(ip, userAgent);
    countThisView = await recordUniqueServerView({ scope: 'post', contentId: id, visitorHash });
  }
  const alreadyCountedView = isView && !countThisView;

  try {
    let currentViews: number;

    if (event === 'VIEW' && !alreadyCountedView) {
      const updated = await prisma.post.update({
        where: { id },
        data: { views: { increment: 1 } },
        select: { id: true, views: true },
      });
      currentViews = updated.views;
      // Only log a VIEW analytics row for counted (deduped, human) views, so
      // date-ranged counts from PostAnalytics stay clean going forward.
      await prisma.postAnalytics.create({ data: { postId: id, event, meta: body.meta ?? null } });
    } else {
      const post = await prisma.post.findUniqueOrThrow({ where: { id }, select: { id: true, views: true } });
      currentViews = post.views;
      // Non-VIEW events (clicks) are still logged in full — no de-dup on intent.
      if (event !== 'VIEW') {
        await prisma.postAnalytics.create({ data: { postId: id, event, meta: body.meta ?? null } });
      }
    }

    const affiliateClicks = await prisma.postAnalytics.count({
      where: { postId: id, event: 'AFFILIATE_CLICK' },
    });

    const res = NextResponse.json({
      postId: id,
      views: currentViews,
      affiliateClicks,
      counted: event === 'VIEW' ? !alreadyCountedView : true,
    });

    // Set the de-dup cookie whenever we ran a server check (counted or not), so
    // subsequent requests short-circuit on the cookie and skip the DB.
    if (refreshCookie) {
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
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    throw error;
  }
}
