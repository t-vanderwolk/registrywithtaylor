'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/server/session';
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

function id(formData: FormData) {
  const value = formData.get('id');
  return value == null ? '' : String(value).trim();
}

function revalidate() {
  revalidatePath('/admin/catalog/health');
  revalidatePath('/admin/catalog');
  revalidatePath('/tools/stroller-finder');
  revalidatePath('/tools/travel-system');
}

/** Approve a flagged product — mark it reviewed + public. */
export async function markReviewedFromHealth(formData: FormData) {
  const session = await requireAdminSession('/admin/catalog/health');
  const rawProductId = id(formData);
  if (!rawProductId) return;
  await db.productEnrichment.upsert({
    where: { rawProductId },
    create: { rawProductId, reviewStatus: 'REVIEWED', needsReview: false, isPublic: true, reviewedAt: new Date(), reviewedBy: session.user?.email ?? null },
    update: { reviewStatus: 'REVIEWED', needsReview: false, isPublic: true, reviewedAt: new Date(), reviewedBy: session.user?.email ?? null },
  });
  revalidate();
}

/** Hide a product from every public surface. */
export async function hideFromHealth(formData: FormData) {
  const session = await requireAdminSession('/admin/catalog/health');
  const rawProductId = id(formData);
  if (!rawProductId) return;
  await db.productEnrichment.upsert({
    where: { rawProductId },
    create: { rawProductId, reviewStatus: 'HIDDEN', needsReview: false, isPublic: false, reviewedAt: new Date(), reviewedBy: session.user?.email ?? null },
    update: { reviewStatus: 'HIDDEN', needsReview: false, isPublic: false, reviewedAt: new Date(), reviewedBy: session.user?.email ?? null },
  });
  revalidate();
}

/** Un-hide a product — back to reviewed + public. */
export async function unhideFromHealth(formData: FormData) {
  const session = await requireAdminSession('/admin/catalog/health');
  const rawProductId = id(formData);
  if (!rawProductId) return;
  await db.productEnrichment.upsert({
    where: { rawProductId },
    create: { rawProductId, reviewStatus: 'REVIEWED', needsReview: false, isPublic: true, reviewedAt: new Date(), reviewedBy: session.user?.email ?? null },
    update: { reviewStatus: 'REVIEWED', needsReview: false, isPublic: true, reviewedAt: new Date(), reviewedBy: session.user?.email ?? null },
  });
  revalidate();
}

/** Set (or replace) a catalog product's image URL — for products missing one. */
export async function setImageFromHealth(formData: FormData) {
  await requireAdminSession('/admin/catalog/health');
  const productId = id(formData);
  const rawImage = formData.get('imageUrl');
  const imageUrl = rawImage == null ? '' : String(rawImage).trim();
  if (!productId || !/^https?:\/\//i.test(imageUrl)) return;
  await db.affiliateCatalogProduct.update({ where: { id: productId }, data: { imageUrl } });
  revalidate();
}

/** Delete a catalog product entirely (enrichment cascades). */
export async function deleteFromHealth(formData: FormData) {
  await requireAdminSession('/admin/catalog/health');
  const productId = id(formData);
  if (!productId) return;
  await db.affiliateCatalogProduct.delete({ where: { id: productId } });
  revalidate();
}
