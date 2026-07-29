import { notFound } from 'next/navigation';
import prisma from '@/lib/server/prisma';
import { renderCertificatePageBody } from '@/lib/gift/certificate';
import { normalizeGiftCode } from '@/lib/gift/giftCode';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export default async function GiftCertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: raw } = await params;
  const code = normalizeGiftCode(decodeURIComponent(raw));

  const gift = await db.giftCertificate
    .findUnique({
      where: { code },
      select: { code: true, recipientName: true, purchaserName: true, giftMessage: true, status: true },
    })
    .catch(() => null);

  // Only render for real, paid gifts.
  if (!gift || gift.status === 'PENDING_PAYMENT') {
    notFound();
  }

  const html = renderCertificatePageBody({
    recipientName: gift.recipientName,
    purchaserName: gift.purchaserName,
    giftMessage: gift.giftMessage,
    code: gift.code,
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
