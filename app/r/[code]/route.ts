import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import prisma from '@/lib/server/prisma';
import { consumeRateLimit } from '@/lib/server/rateLimit';
import { getHostname, isDomainAllowed, isHttps } from '@/lib/server/urlSafety';

const REDIRECT_ROUTE_KEY = '/r/[code]';
const BOT_MARKERS = ['bot', 'crawler', 'spider'];

const getClientIpAddress = (request: NextRequest) => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) {
      return first;
    }
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp && realIp.trim().length > 0) {
    return realIp.trim();
  }

  return null;
};

function hashIp(ip: string) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

const isBotUserAgent = (userAgent: string | null) => {
  if (!userAgent) {
    return false;
  }

  const normalized = userAgent.toLowerCase();
  return BOT_MARKERS.some((marker) => normalized.includes(marker));
};

const fallbackRedirect = (request: NextRequest) =>
  NextResponse.redirect(new URL('/blog', request.url), { status: 302 });

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const requestId = request.headers.get('x-request-id')?.trim() || crypto.randomUUID();
  const ipAddress = getClientIpAddress(request) ?? 'unknown';

  const rateLimit = consumeRateLimit({
    route: REDIRECT_ROUTE_KEY,
    ip: ipAddress,
  });

  if (!rateLimit.allowed) {
    logger.warn('affiliate_redirect_rate_limited', {
      requestId,
      code,
      path: request.nextUrl.pathname,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
      ipHash: ipAddress === 'unknown' ? null : hashIp(ipAddress),
    });

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

  try {
    const link = await prisma.affiliateLink.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        destinationUrl: true,
        url: true,
        partnerId: true,
        programId: true,
        partner: {
          select: {
            id: true,
            allowedDomains: true,
          },
        },
        program: {
          select: {
            id: true,
            brand: {
              select: {
                id: true,
                website: true,
              },
            },
          },
        },
      },
    });

    if (!link) {
      return fallbackRedirect(request);
    }

    const resolvedDestinationUrl = link.destinationUrl?.trim() || link.url?.trim() || '';
    if (!resolvedDestinationUrl) {
      logger.warn('affiliate_redirect_missing_destination', {
        requestId,
        code: link.code,
        partnerId: link.partnerId,
        programId: link.programId,
      });
      return fallbackRedirect(request);
    }

    const hostname = getHostname(resolvedDestinationUrl);
    if (!hostname) {
      logger.warn('affiliate_redirect_invalid_url', {
        requestId,
        code: link.code,
        partnerId: link.partnerId,
        programId: link.programId,
        destinationUrl: resolvedDestinationUrl,
      });
      return fallbackRedirect(request);
    }

    if (!isHttps(resolvedDestinationUrl)) {
      logger.warn('affiliate_redirect_blocked_protocol', {
        requestId,
        code: link.code,
        partnerId: link.partnerId,
        programId: link.programId,
        destinationUrl: resolvedDestinationUrl,
        protocol: new URL(resolvedDestinationUrl).protocol,
      });
      return fallbackRedirect(request);
    }

    const allowedDomains = [
      ...(link.partner?.allowedDomains ?? []),
      ...((() => {
        const brandHostname = getHostname(link.program?.brand.website ?? '');
        return brandHostname ? [brandHostname] : [];
      })()),
    ];
    if (!isDomainAllowed(hostname, allowedDomains)) {
      logger.warn('affiliate_redirect_blocked_domain', {
        requestId,
        code: link.code,
        partnerId: link.partnerId,
        programId: link.programId,
        destinationUrl: resolvedDestinationUrl,
        hostname,
        allowedDomains,
      });
      return fallbackRedirect(request);
    }

    logger.info('affiliate_redirect', {
      requestId,
      code: link.code,
      partnerId: link.partnerId,
      programId: link.programId,
      destinationUrl: resolvedDestinationUrl,
    });

    const userAgent = request.headers.get('user-agent');
    if (isBotUserAgent(userAgent)) {
      logger.debug('affiliate_redirect_bot_skipped_click', {
        requestId,
        code: link.code,
        partnerId: link.partnerId,
        programId: link.programId,
      });
      return NextResponse.redirect(resolvedDestinationUrl, { status: 302 });
    }

    const referrer = request.headers.get('referer');

    try {
      await prisma.affiliateClick.create({
        data: {
          linkId: link.id,
          ipHash: ipAddress === 'unknown' ? null : hashIp(ipAddress),
          userAgent,
          referrer,
          path: request.nextUrl.pathname,
        },
      });
    } catch (error) {
      logger.warn('affiliate_redirect_click_log_failed', {
        requestId,
        code: link.code,
        partnerId: link.partnerId,
        programId: link.programId,
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    }

    return NextResponse.redirect(resolvedDestinationUrl, { status: 302 });
  } catch (error) {
    logger.error('affiliate_redirect_internal_error', {
      requestId,
      code,
      error: error instanceof Error ? error.message : 'unknown_error',
    });
    return fallbackRedirect(request);
  }
}
