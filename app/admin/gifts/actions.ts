'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';
import { sendEmail } from '@/lib/email/sendEmail';
import { renderRecipientEmail, renderPurchaserEmail } from '@/lib/gift/certificate';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

/** Manually mark a gift redeemed (e.g. after a comp booking). */
export async function markGiftRedeemed(formData: FormData) {
  await requireAdminSession('/admin/gifts');
  const id = String(formData.get('id') || '');
  if (!id) return;
  await db.giftCertificate.update({
    where: { id },
    data: { status: 'REDEEMED', redeemedAt: new Date() },
  });
  revalidatePath('/admin/gifts');
}

/** Re-send the gift certificate email (recipient if delivered now, else purchaser). */
export async function resendGiftCertificate(formData: FormData) {
  await requireAdminSession('/admin/gifts');
  const id = String(formData.get('id') || '');
  if (!id) return;
  const gift = await db.giftCertificate.findUnique({ where: { id } });
  if (!gift || gift.status === 'PENDING_PAYMENT') return;

  const cert = {
    recipientName: gift.recipientName,
    purchaserName: gift.purchaserName,
    giftMessage: gift.giftMessage,
    code: gift.code,
  };
  if (gift.deliveryMode === 'now' && gift.recipientEmail) {
    await sendEmail({
      to: gift.recipientEmail,
      subject: `🎀 ${gift.purchaserName} gifted you a Registry Consult`,
      html: renderRecipientEmail(cert),
      replyTo: gift.purchaserEmail,
    });
  } else {
    await sendEmail({
      to: gift.purchaserEmail,
      subject: `Your gift certificate for ${gift.recipientName}`,
      html: renderPurchaserEmail(cert, 'self'),
    });
  }
  revalidatePath('/admin/gifts');
}
