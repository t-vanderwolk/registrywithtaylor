import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { consumeRateLimit } from '@/lib/server/rateLimit';
import { getRequestIp, isLikelyBot, visitorHashFrom } from '@/lib/server/viewTracking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TOOLS = new Set(['stroller-finder', 'travel-system-checker', 'stroller-quiz']);
const EVENTS = new Set(['opened', 'selection', 'result_viewed']);
const DAY_MS = 24 * 60 * 60 * 1000;

const str = (value: unknown, max = 256) =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null;

/**
 * POST /api/tools/event
 *
 * Logs a single bot-filtered free-tool interaction (opened / selection /
 * result_viewed) so the admin dashboard can show a per-tool usage funnel.
 * Beacon-friendly + fire-and-forget: never blocks, degrades safely if the
 * ToolEvent table isn't migrated yet.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const b = body as Record<string, unknown>;
  const tool = str(b.tool, 40);
  const event = str(b.event, 40);
  if (!tool || !event || !TOOLS.has(tool) || !EVENTS.has(event)) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const userAgent = req.headers.get('user-agent');
  if (isLikelyBot(userAgent)) {
    return NextResponse.json({ ok: true, counted: false, reason: 'bot' });
  }

  const ip = getRequestIp(req);
  const rate = consumeRateLimit({ route: '/api/tools/event', ip: ip ?? 'unknown', limit: 200, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json({ ok: false, reason: 'rate' }, { status: 429 });
  }

  const visitorHash = visitorHashFrom(ip, userAgent);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  try {
    // De-dup "opened" to one per visitor per tool per day so reloads don't
    // inflate the top of the funnel. Selections + results are logged in full.
    if (event === 'opened' && visitorHash) {
      const since = new Date(Date.now() - DAY_MS);
      const seen = await db.toolEvent
        .findFirst({ where: { tool, event: 'opened', visitorHash, createdAt: { gte: since } }, select: { id: true } })
        .catch(() => null);
      if (seen) {
        return NextResponse.json({ ok: true, counted: false, reason: 'dup' });
      }
    }

    await db.toolEvent.create({
      data: {
        tool,
        event,
        kind: str(b.kind, 64),
        value: str(b.value, 200),
        path: str(b.path, 256),
        visitorHash,
      },
    });
    return NextResponse.json({ ok: true, counted: true });
  } catch {
    return NextResponse.json({ ok: true, counted: false, reason: 'unavailable' });
  }
}
