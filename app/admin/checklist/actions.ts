'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/server/session';
import prismaBase from '@/lib/server/prisma';

// ChecklistProduct lands in the generated client on the Heroku build.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const str = (fd: FormData, k: string): string | null => {
  const v = fd.get(k);
  return v == null || String(v).trim() === '' ? null : String(v).trim();
};
const num = (fd: FormData, k: string): number | null => {
  const v = str(fd, k);
  if (v == null) return null;
  const n = Number(v.replace(/[$,]/g, ''));
  return Number.isFinite(n) ? n : null;
};
const bool = (fd: FormData, k: string): boolean => fd.get(k) === 'on';
const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function revalidate() {
  revalidatePath('/admin/checklist');
  revalidatePath('/resources/baby-checklist');
}

/** Create a new checklist product pick. */
export async function createChecklistProduct(formData: FormData) {
  await requireAdminSession('/admin/checklist');
  const brand = str(formData, 'brand');
  const product = str(formData, 'product');
  if (!brand || !product) return;

  const id = str(formData, 'id') ?? slugify(`${brand}-${product}`);
  const existing = await db.checklistProduct.findUnique({ where: { id } });
  if (existing) {
    revalidate();
    return;
  }
  const count = await db.checklistProduct.count();
  await db.checklistProduct.create({
    data: {
      id,
      brand,
      product,
      review: str(formData, 'review') ?? '',
      bestFor: str(formData, 'bestFor') ?? '',
      standout: str(formData, 'standout') ?? '',
      affiliateUrl: str(formData, 'affiliateUrl') ?? 'AFFILIATE_LINK_NEEDED',
      amazonUrl: str(formData, 'amazonUrl'),
      secondaryUrl: str(formData, 'secondaryUrl'),
      secondaryRetailer: str(formData, 'secondaryRetailer'),
      checklistItemId: str(formData, 'checklistItemId'),
      price: num(formData, 'price'),
      priceSource: str(formData, 'priceSource'),
      retailer: str(formData, 'retailer'),
      imageUrl: str(formData, 'imageUrl'),
      badge: str(formData, 'badge'),
      disclosure: bool(formData, 'disclosure'),
      sortOrder: count,
    },
  });
  revalidate();
}

/** Update an existing pick. */
export async function updateChecklistProduct(formData: FormData) {
  await requireAdminSession('/admin/checklist');
  const id = str(formData, 'id');
  if (!id) return;
  await db.checklistProduct.update({
    where: { id },
    data: {
      brand: str(formData, 'brand') ?? undefined,
      product: str(formData, 'product') ?? undefined,
      review: str(formData, 'review') ?? '',
      bestFor: str(formData, 'bestFor') ?? '',
      standout: str(formData, 'standout') ?? '',
      affiliateUrl: str(formData, 'affiliateUrl') ?? 'AFFILIATE_LINK_NEEDED',
      amazonUrl: str(formData, 'amazonUrl'),
      secondaryUrl: str(formData, 'secondaryUrl'),
      secondaryRetailer: str(formData, 'secondaryRetailer'),
      price: num(formData, 'price'),
      priceSource: str(formData, 'priceSource'),
      retailer: str(formData, 'retailer'),
      imageUrl: str(formData, 'imageUrl'),
      badge: str(formData, 'badge'),
      disclosure: bool(formData, 'disclosure'),
    },
  });
  revalidate();
}

/** Delete a pick. */
export async function deleteChecklistProduct(formData: FormData) {
  await requireAdminSession('/admin/checklist');
  const id = str(formData, 'id');
  if (!id) return;
  await db.checklistProduct.delete({ where: { id } });
  revalidate();
}
