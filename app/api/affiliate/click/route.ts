import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { consumeRateLimit } from '@/lib/server/rateLimit';
import { affiliateRetailerFromUrl } from '@/lib/analytics/affiliateRetailer';
import { getRequestIp, isLikelyBot, visitorHashFrom } from '@/lib/server/viewTracking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const str = (value: unknown, max = 512) =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null;

/**
 * POST /api/affiliate/click
 *
 * Logs a single real, bot-filtered outbound affiliate click from any surface
 * (tools, blog, tracked anchors). Designed to be called via navigator.sendBeacon
 * as the user navigates away. Fire-and-forget: always returns 204-ish JSON so a
 * beacon never blocks navigation, and it degrades safely if the table isn't
 * migrated yet.
 */
export async function POST(req: NextRequest) {
  // Beacons send as text/plain or application/json; parse defensively.
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const url = str((body as Record<string, unknown>).url, 2048);
  if (!url) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const userAgent = req.headers.get('user-agent');
  if (isLikelyBot(userAgent)) {
    return NextResponse.json({ ok: true, counted: false, reason: 'bot' });
  }

  const ip = getRequestIp(req);
  const rate = consumeRateLimit({ route: '/api/affiliate/click', ip: ip ?? 'unknown', limit: 120, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json({ ok: false, reason: 'rate' }, { status: 429 });
  }

  const b = body as Record<string, unknown>;
  const resolved = affiliateRetailerFromUrl(url);
  const retailer = str(b.retailer) ?? resolved.retailer;
  const network = str(b.network) ?? resolved.network;
  const visitorHash = visitorHashFrom(ip, userAgent);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  try {
    // Light de-dup: a single click can fire twice (React re-invoke, GA + beacon).
    // Skip a duplicate of the same visitor+url within a few seconds.
    if (visitorHash) {
      const recent = await db.outboundClick
        .findFirst({
          where: { visitorHash, url, createdAt: { gte: new Date(Date.now() - 5_000) } },
          select: { id: true },
        })
        .catch(() => null);
      if (recent) {
        return NextResponse.json({ ok: true, counted: false, reason: 'dup' });
      }
    }

    await db.outboundClick.create({
      data: {
        retailer,
        network,
        brand: str(b.brand, 128),
        product: str(b.product, 256),
        url,
        source: str(b.source, 64),
        pageType: str(b.pageType, 32),
        path: str(b.path, 256),
        visitorHash,
      },
    });
    return NextResponse.json({ ok: true, counted: true, retailer });
  } catch {
    // Table not migrated yet or transient error — never block the beacon.
    return NextResponse.json({ ok: true, counted: false, reason: 'unavailable' });
  }
}
