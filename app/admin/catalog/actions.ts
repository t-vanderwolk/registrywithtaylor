'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/server/session';
import prismaBase from '@/lib/server/prisma';

// New models land in the generated client on the Heroku build (`prisma generate`).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

/**
 * Save a TMBC enrichment record from the admin catalog editor. Marks the row
 * REVIEWED (or HIDDEN) and stamps the reviewer — these become human-owned, so
 * future syncs will not overwrite them.
 */
export async function saveEnrichment(formData: FormData) {
  const session = await requireAdminSession('/admin/catalog');
  const rawProductId = String(formData.get('rawProductId') || '');
  if (!rawProductId) return;

  const str = (k: string) => {
    const v = formData.get(k);
    return v == null || String(v).trim() === '' ? null : String(v).trim();
  };
  const bool = (k: string) => formData.get(k) === 'on';

  const tagsRaw = str('tags');
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

  const hide = String(formData.get('_action') || 'save') === 'hide';

  const data = {
    tmbcCategory: str('tmbcCategory'),
    tmbcSubcategory: str('tmbcSubcategory'),
    productType: str('productType'),
    parentJourney: str('parentJourney'),
    isPublic: hide ? false : bool('isPublic'),
    isFeatured: bool('isFeatured'),
    isTaylorPick: bool('isTaylorPick'),
    isRecommended: bool('isRecommended'),
    isWorthKnowing: bool('isWorthKnowing'),
    isSkipForMost: bool('isSkipForMost'),
    taylorsNote: str('taylorsNote'),
    internalNotes: str('internalNotes'),
    tags,
    needsReview: false,
    reviewStatus: hide ? 'HIDDEN' : 'REVIEWED',
    visibility: hide ? 'hidden' : 'reviewed',
    reviewedAt: new Date(),
    reviewedBy: session.user?.email ?? session.user?.id ?? null,
  };

  await db.productEnrichment.upsert({
    where: { rawProductId },
    create: { rawProductId, ...data },
    update: data,
  });

  // Human-owned product + buy-link fields. Only write when a field was submitted
  // (the form always sends these), so admin edits stick and the sync leaves them.
  const priceRaw = str('price');
  const priceNum = priceRaw != null ? Number(priceRaw) : null;
  const productData: Record<string, unknown> = {
    manualAmazonUrl: str('manualAmazonUrl'),
  };
  if (str('title') != null) productData.title = str('title');
  productData.brand = str('brand');
  productData.imageUrl = str('imageUrl');
  productData.affiliateUrl = str('affiliateUrl');
  if (priceRaw != null && Number.isFinite(priceNum)) productData.price = priceNum;
  else if (priceRaw == null) productData.price = null;

  await db.affiliateCatalogProduct.update({
    where: { id: rawProductId },
    data: productData,
  });

  revalidatePath('/admin/catalog');
}

// ── Create / delete / bulk ──────────────────────────────────────────────────

const field = (formData: FormData, k: string) => {
  const v = formData.get(k);
  return v == null || String(v).trim() === '' ? null : String(v).trim();
};

/** Manually add a new catalog product (human-owned, provider "manual_tmbc"). */
export async function createCatalogProduct(formData: FormData) {
  const session = await requireAdminSession('/admin/catalog');
  const title = field(formData, 'title');
  if (!title) return;

  const priceRaw = field(formData, 'price');
  const priceNum = priceRaw != null ? Number(priceRaw.replace(/[$,]/g, '')) : null;
  const brand = field(formData, 'brand');
  const affiliateUrl = field(formData, 'affiliateUrl');
  const externalId = `manual-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const product = await db.affiliateCatalogProduct.create({
    data: {
      provider: 'manual_tmbc',
      externalId,
      brand,
      title,
      price: priceNum != null && Number.isFinite(priceNum) ? priceNum : null,
      currency: 'USD',
      imageUrl: field(formData, 'imageUrl'),
      affiliateUrl,
      productUrl: affiliateUrl,
      manualAmazonUrl: field(formData, 'manualAmazonUrl'),
      retailer: 'Manual',
      isActiveInFeed: true,
    },
    select: { id: true },
  });

  await db.productEnrichment.create({
    data: {
      rawProductId: product.id,
      canonicalBrand: brand,
      tmbcCategory: field(formData, 'tmbcCategory'),
      productType: field(formData, 'productType'),
      reviewStatus: 'REVIEWED',
      isPublic: true,
      needsReview: false,
      reviewedAt: new Date(),
      reviewedBy: session.user?.email ?? null,
    },
  });

  revalidatePath('/admin/catalog');
}

/** Delete a single catalog product (enrichment cascades). */
export async function deleteCatalogProduct(formData: FormData) {
  await requireAdminSession('/admin/catalog');
  const id = field(formData, 'rawProductId') ?? field(formData, 'id');
  if (!id) return;
  await db.affiliateCatalogProduct.delete({ where: { id } });
  revalidatePath('/admin/catalog');
}

/** Apply an action to many products at once: hide, mark-reviewed, or delete. */
export async function bulkCatalogAction(formData: FormData) {
  const session = await requireAdminSession('/admin/catalog');
  const action = String(formData.get('_bulk') ?? '').trim();
  const ids = formData.getAll('ids').map((v) => String(v).trim()).filter(Boolean);
  if (ids.length === 0) return;

  if (action === 'delete') {
    await db.affiliateCatalogProduct.deleteMany({ where: { id: { in: ids } } });
  } else if (action === 'hide' || action === 'review') {
    const data =
      action === 'hide'
        ? { reviewStatus: 'HIDDEN', isPublic: false, needsReview: false }
        : { reviewStatus: 'REVIEWED', isPublic: true, needsReview: false };
    // Upsert per id so products without an enrichment row still get one.
    await Promise.all(
      ids.map((rawProductId) =>
        db.productEnrichment.upsert({
          where: { rawProductId },
          create: { rawProductId, ...data, reviewedAt: new Date(), reviewedBy: session.user?.email ?? null },
          update: { ...data, reviewedAt: new Date(), reviewedBy: session.user?.email ?? null },
        }),
      ),
    );
  }

  revalidatePath('/admin/catalog');
}
