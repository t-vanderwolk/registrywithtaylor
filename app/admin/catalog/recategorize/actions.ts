'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/server/session';
import prismaBase from '@/lib/server/prisma';
import { STROLLER_PRODUCT_TYPES } from '@/lib/catalog/taxonomy';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const VALID = new Set<string>(STROLLER_PRODUCT_TYPES);

/** Reassign a stroller's productType (which drives its finder category). */
export async function setStrollerCategory(formData: FormData) {
  const session = await requireAdminSession('/admin/catalog/recategorize');
  const rawProductId = String(formData.get('rawProductId') ?? '').trim();
  const productType = String(formData.get('productType') ?? '').trim();
  if (!rawProductId || !VALID.has(productType)) return;

  await db.productEnrichment.upsert({
    where: { rawProductId },
    create: {
      rawProductId,
      productType,
      tmbcCategory: 'Strollers',
      reviewStatus: 'REVIEWED',
      needsReview: false,
      isPublic: true,
      reviewedAt: new Date(),
      reviewedBy: session.user?.email ?? null,
    },
    update: {
      productType,
      needsReview: false,
      reviewStatus: 'REVIEWED',
      reviewedAt: new Date(),
      reviewedBy: session.user?.email ?? null,
    },
  });

  revalidatePath('/admin/catalog/recategorize');
  revalidatePath('/tools/stroller-finder');
  revalidatePath('/tools/stroller-quiz');
  revalidatePath('/tools/travel-system');
}
