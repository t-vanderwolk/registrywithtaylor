import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { normalizeGiftCode } from '@/lib/gift/giftCode';
import { CALENDLY_PREPAID_URL } from '@/lib/gift/config';
import { consumeRateLimit } from '@/lib/server/rateLimit';
import { getRequestIp } from '@/lib/server/viewTracking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

/**
 * POST /api/gift/redeem  { code, mode?: 'check' | 'redeem' }
 * Validates a gift code. `mode:'check'` only reports validity; `mode:'redeem'`
 * marks it redeemed and returns the prepaid Calendly booking URL.
 */
export async function POST(req: NextRequest) {
  const ip = getRequestIp(req) ?? 'unknown';
  const rate = consumeRateLimit({ route: '/api/gift/redeem', ip, limit: 20, windowMs: 60_000 });
  if (!rate.allowed) return NextResponse.json({ ok: false, error: 'Too many attempts. Please try again shortly.' }, { status: 429 });

  const body = await req.json().catch(() => null);
  const rawCode = body && typeof body === 'object' ? (body as Record<string, unknown>).code : null;
  const mode = body && (body as Record<string, unknown>).mode === 'redeem' ? 'redeem' : 'check';
  if (typeof rawCode !== 'string' || !rawCode.trim()) {
    return NextResponse.json({ ok: false, error: 'Please enter your gift code.' }, { status: 400 });
  }

  const code = normalizeGiftCode(rawCode);

  let gift: { id: string; status: string; recipientName: string } | null = null;
  try {
    gift = await db.giftCertificate.findUnique({
      where: { code },
      select: { id: true, status: true, recipientName: true },
    });
  } catch (error) {
    console.error('[gift/redeem] lookup failed:', error);
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  if (!gift || gift.status === 'PENDING_PAYMENT') {
    return NextResponse.json({ ok: false, error: "We couldn't find that gift code. Double-check it and try again." }, { status: 404 });
  }
  if (gift.status === 'REFUNDED') {
    return NextResponse.json({ ok: false, error: 'This gift is no longer active. Please reach out and we’ll help.' }, { status: 409 });
  }
  if (gift.status === 'REDEEMED') {
    return NextResponse.json(
      { ok: false, redeemed: true, error: 'This gift has already been redeemed. If you still need to book, just reply to your certificate email.' },
      { status: 409 },
    );
  }

  // Valid + ISSUED.
  if (mode === 'check') {
    return NextResponse.json({ ok: true, recipientName: gift.recipientName });
  }

  try {
    await db.giftCertificate.update({
      where: { id: gift.id },
      data: { status: 'REDEEMED', redeemedAt: new Date() },
    });
  } catch (error) {
    console.error('[gift/redeem] mark redeemed failed:', error);
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, recipientName: gift.recipientName, bookingUrl: CALENDLY_PREPAID_URL });
}
