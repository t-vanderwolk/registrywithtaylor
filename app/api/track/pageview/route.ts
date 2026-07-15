import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { consumeRateLimit } from '@/lib/server/rateLimit';
import { getRequestIp, isLikelyBot, visitorHashFrom } from '@/lib/server/viewTracking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const str = (value: unknown, max = 512) =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null;

/**
 * Bucket a pathname into a coarse page type for the daily-traffic charts.
 * Keep in sync with the dashboard's legend.
 */
function pageTypeFromPath(path: string): string {
  const p = path.split('?')[0].split('#')[0].toLowerCase();
  if (p === '/blog' || p.startsWith('/blog/')) return 'blog';
  if (p.startsWith('/tools/')) return 'tool';
  if (p.startsWith('/guides/') || p === '/guides') return 'guide';
  if (p.startsWith('/admin') || p.startsWith('/dashboard') || p.startsWith('/api')) return 'internal';
  if (
    p === '/' ||
    p.startsWith('/services') ||
    p.startsWith('/about') ||
    p.startsWith('/contact') ||
    p.startsWith('/resources') ||
    p.startsWith('/book')
  ) {
    return 'marketing';
  }
  return 'other';
}

/**
 * POST /api/track/pageview
 *
 * Logs one bot-filtered, first-party page view per route change so the admin
 * dashboard can chart daily TOTAL and BLOG traffic without depending on GA4.
 * Beacon-friendly + fire-and-forget: never blocks, degrades safely if the
 * PageView table isn't migrated yet. Internal surfaces (admin/dashboard/api)
 * are not logged.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const path = str((body as Record<string, unknown> | null)?.path, 512);
  if (!path || !path.startsWith('/')) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const pageType = pageTypeFromPath(path);
  // Don't log admin/dashboard/api navigation as "traffic".
  if (pageType === 'internal') {
    return NextResponse.json({ ok: true, counted: false, reason: 'internal' });
  }

  const userAgent = req.headers.get('user-agent');
  if (isLikelyBot(userAgent)) {
    return NextResponse.json({ ok: true, counted: false, reason: 'bot' });
  }

  const ip = getRequestIp(req);
  const rate = consumeRateLimit({ route: '/api/track/pageview', ip: ip ?? 'unknown', limit: 400, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json({ ok: false, reason: 'rate' }, { status: 429 });
  }

  const visitorHash = visitorHashFrom(ip, userAgent);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  try {
    await db.pageView.create({ data: { path, pageType, visitorHash } });
    return NextResponse.json({ ok: true, counted: true });
  } catch {
    return NextResponse.json({ ok: true, counted: false, reason: 'unavailable' });
  }
}
