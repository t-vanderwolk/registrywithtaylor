import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/server/prisma';
import { getStripe, getStripeWebhookSecret } from '@/lib/server/stripe';
import { sendEmail, getAdminEmail } from '@/lib/email/sendEmail';
import { renderRecipientEmail, renderPurchaserEmail } from '@/lib/gift/certificate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

/**
 * POST /api/gift/webhook
 * Stripe fulfillment. On checkout.session.completed we mark the gift ISSUED and
 * email the certificate (recipient if "send now", otherwise the purchaser).
 * Idempotent: re-delivering the same event won't double-send.
 */
export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;
  try {
    const stripe = await getStripe();
    event = stripe.webhooks.constructEvent(rawBody, sig ?? '', getStripeWebhookSecret());
  } catch (error) {
    console.error('[gift/webhook] signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;
  if (session.payment_status && session.payment_status !== 'paid') {
    return NextResponse.json({ received: true });
  }

  const giftId: string | undefined = session.metadata?.giftId;
  const sessionId: string | undefined = session.id;

  try {
    const gift = giftId
      ? await db.giftCertificate.findUnique({ where: { id: giftId } })
      : await db.giftCertificate.findUnique({ where: { stripeSessionId: sessionId } });

    if (!gift) {
      console.error('[gift/webhook] no matching gift for session', sessionId);
      return NextResponse.json({ received: true });
    }
    if (gift.status !== 'PENDING_PAYMENT') {
      // Already fulfilled — idempotent no-op.
      return NextResponse.json({ received: true, alreadyFulfilled: true });
    }

    await db.giftCertificate.update({
      where: { id: gift.id },
      data: {
        status: 'ISSUED',
        issuedAt: new Date(),
        stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
      },
    });

    const cert = {
      recipientName: gift.recipientName,
      purchaserName: gift.purchaserName,
      giftMessage: gift.giftMessage,
      code: gift.code,
    };

    try {
      if (gift.deliveryMode === 'now' && gift.recipientEmail) {
        await sendEmail({
          to: gift.recipientEmail,
          subject: `🎀 ${gift.purchaserName} gifted you a Registry Consult`,
          html: renderRecipientEmail(cert),
          replyTo: gift.purchaserEmail,
        });
      }
      // Always confirm to the purchaser (with the certificate if they deliver it).
      await sendEmail({
        to: gift.purchaserEmail,
        subject:
          gift.deliveryMode === 'self'
            ? `Your gift is ready — certificate for ${gift.recipientName}`
            : `Your gift to ${gift.recipientName} is on its way`,
        html: renderPurchaserEmail(cert, gift.deliveryMode === 'self' ? 'self' : 'now'),
      });
      // Notify admin.
      await sendEmail({
        to: getAdminEmail(),
        subject: `New gift purchase — ${gift.code}`,
        html: `<p>${gift.purchaserName} (${gift.purchaserEmail}) purchased a gift Registry Consult for ${gift.recipientName}${gift.recipientEmail ? ` (${gift.recipientEmail})` : ''}.</p><p>Code: <strong>${gift.code}</strong> · Delivery: ${gift.deliveryMode}</p>`,
      }).catch(() => {});
    } catch (mailError) {
      // Payment succeeded; don't fail the webhook on email trouble (Stripe would retry
      // and we'd double-charge nothing, but re-send emails). Log for manual follow-up.
      console.error('[gift/webhook] email send failed for', gift.code, mailError);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[gift/webhook] fulfillment failed:', error);
    return NextResponse.json({ error: 'Fulfillment error.' }, { status: 500 });
  }
}
