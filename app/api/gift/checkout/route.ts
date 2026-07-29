import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { getStripe } from '@/lib/server/stripe';
import { generateGiftCode } from '@/lib/gift/giftCode';
import {
  GIFT_AMOUNT_CENTS,
  GIFT_CURRENCY,
  GIFT_PRODUCT_NAME,
  GIFT_PRODUCT_DESCRIPTION,
  GIFT_SITE_ORIGIN,
} from '@/lib/gift/config';
import { consumeRateLimit } from '@/lib/server/rateLimit';
import { getRequestIp } from '@/lib/server/viewTracking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const str = (v: unknown, max = 300) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
const isEmail = (v: string | null) => !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/**
 * POST /api/gift/checkout
 * Creates a pending GiftCertificate + a Stripe Checkout Session for a $75 gift.
 * Returns { url } to redirect the buyer to Stripe.
 */
export async function POST(req: NextRequest) {
  const ip = getRequestIp(req) ?? 'unknown';
  const rate = consumeRateLimit({ route: '/api/gift/checkout', ip, limit: 12, windowMs: 60_000 });
  if (!rate.allowed) return NextResponse.json({ error: 'Too many attempts. Please try again shortly.' }, { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  const purchaserName = str(b.purchaserName, 120);
  const purchaserEmail = str(b.purchaserEmail, 200)?.toLowerCase() ?? null;
  const recipientName = str(b.recipientName, 120);
  const recipientEmail = str(b.recipientEmail, 200)?.toLowerCase() ?? null;
  const giftMessage = str(b.giftMessage, 600);
  const deliveryMode = b.deliveryMode === 'self' ? 'self' : 'now';

  if (!purchaserName || !isEmail(purchaserEmail)) {
    return NextResponse.json({ error: 'Please enter your name and a valid email.' }, { status: 400 });
  }
  if (!recipientName) {
    return NextResponse.json({ error: "Please enter the recipient's name." }, { status: 400 });
  }
  // "Send immediately" requires a recipient email to send to.
  if (deliveryMode === 'now' && !isEmail(recipientEmail)) {
    return NextResponse.json(
      { error: "To send the gift right away, add the recipient's email — or choose “I’ll send it myself.”" },
      { status: 400 },
    );
  }

  const code = generateGiftCode();

  let giftId: string;
  try {
    const gift = await db.giftCertificate.create({
      data: {
        code,
        status: 'PENDING_PAYMENT',
        amountCents: GIFT_AMOUNT_CENTS,
        currency: GIFT_CURRENCY,
        purchaserName,
        purchaserEmail,
        recipientName,
        recipientEmail: recipientEmail ?? null,
        giftMessage: giftMessage ?? null,
        deliveryMode,
      },
      select: { id: true },
    });
    giftId = gift.id;
  } catch (error) {
    console.error('[gift/checkout] create failed:', error);
    return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 500 });
  }

  try {
    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: purchaserEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: GIFT_CURRENCY,
            unit_amount: GIFT_AMOUNT_CENTS,
            product_data: { name: GIFT_PRODUCT_NAME, description: GIFT_PRODUCT_DESCRIPTION },
          },
        },
      ],
      metadata: { giftId, code, kind: 'gift' },
      payment_intent_data: { metadata: { giftId, code, kind: 'gift' } },
      success_url: `${GIFT_SITE_ORIGIN}/gift/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${GIFT_SITE_ORIGIN}/gift?canceled=1`,
    });

    await db.giftCertificate.update({ where: { id: giftId }, data: { stripeSessionId: session.id } });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[gift/checkout] stripe failed:', error);
    // Roll back the pending row so we don't leave orphans.
    await db.giftCertificate.delete({ where: { id: giftId } }).catch(() => {});
    return NextResponse.json({ error: 'Payment could not be started. Please try again.' }, { status: 500 });
  }
}
