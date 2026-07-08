import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { consumeRateLimit } from '@/lib/server/rateLimit';
import { getRequestIp, isLikelyBot } from '@/lib/server/viewTracking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const str = (value: unknown, max = 200) =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null;

type Tally = { counts: number[]; total: number };

async function tally(slug: string, pollKey: string, optionCount: number): Promise<Tally> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  const rows: Array<{ optionIndex: number }> = await db.blogPollVote
    .findMany({ where: { slug, pollKey }, select: { optionIndex: true } })
    .catch(() => []);
  const size = Math.max(optionCount, rows.reduce((m, r) => Math.max(m, r.optionIndex + 1), 0));
  const counts = new Array(size).fill(0);
  for (const r of rows) if (r.optionIndex >= 0 && r.optionIndex < size) counts[r.optionIndex] += 1;
  return { counts, total: rows.length };
}

/** GET /api/blog/poll?slug=&pollKey=&options=N → live tally for one poll. */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const slug = str(params.get('slug'), 200);
  const pollKey = str(params.get('pollKey'), 120);
  const optionCount = Math.min(Math.max(Number(params.get('options')) || 0, 0), 20);
  if (!slug || !pollKey) return NextResponse.json({ ok: false, counts: [], total: 0 }, { status: 200 });

  try {
    return NextResponse.json({ ok: true, ...(await tally(slug, pollKey, optionCount)) });
  } catch {
    return NextResponse.json({ ok: false, counts: [], total: 0 }, { status: 200 });
  }
}

/** POST /api/blog/poll → record (or change) a reader's vote, return the new tally. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ ok: false }, { status: 200 });

  const b = body as Record<string, unknown>;
  const slug = str(b.slug, 200);
  const pollKey = str(b.pollKey, 120);
  const voterId = str(b.voterId, 64);
  const optionIndex = Number(b.optionIndex);
  const optionCount = Math.min(Math.max(Number(b.options) || 0, 0), 20);
  if (!slug || !pollKey || !voterId || !Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex > 19) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  if (isLikelyBot(req.headers.get('user-agent'))) {
    return NextResponse.json({ ok: true, counted: false, reason: 'bot', ...(await tally(slug, pollKey, optionCount)) });
  }

  const ip = getRequestIp(req);
  const rate = consumeRateLimit({ route: '/api/blog/poll', ip: ip ?? 'unknown', limit: 60, windowMs: 60_000 });
  if (!rate.allowed) return NextResponse.json({ ok: false, reason: 'rate' }, { status: 429 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  try {
    await db.blogPollVote.upsert({
      where: { slug_pollKey_voterId: { slug, pollKey, voterId } },
      update: { optionIndex },
      create: { slug, pollKey, optionIndex, voterId },
    });
    return NextResponse.json({ ok: true, counted: true, ...(await tally(slug, pollKey, optionCount)) });
  } catch {
    return NextResponse.json({ ok: false, counts: [], total: 0 }, { status: 200 });
  }
}
