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

  revalidatePath('/admin/catalog');
}
