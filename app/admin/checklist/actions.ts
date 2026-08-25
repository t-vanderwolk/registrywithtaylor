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
const intNum = (fd: FormData, k: string): number | null => {
  const n = num(fd, k);
  return n == null ? null : Math.round(n);
};
const list = (fd: FormData, k: string): string[] =>
  fd
    .getAll(k)
    .map((v) => String(v).trim())
    .filter(Boolean);
const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function revalidate() {
  revalidatePath('/admin/checklist');
  revalidatePath('/resources/baby-checklist');
  revalidatePath('/resources/baby-checklist/girl');
  revalidatePath('/resources/baby-checklist/boy');
  revalidatePath('/resources/baby-checklist/twins');
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
      checklistItemId: str(formData, 'checklistItemId'),
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

// ─── Checklist categories (admin-created, additive to the static ones) ────────

/** Create or rename a checklist category. Id is a slug (auto from title). */
export async function saveChecklistCategory(formData: FormData) {
  await requireAdminSession('/admin/checklist');
  const title = str(formData, 'title');
  if (!title) return;
  const id = slugify(str(formData, 'id') ?? title);
  if (!id) return;
  const sortOrder = intNum(formData, 'sortOrder') ?? 100;
  await db.checklistCategory.upsert({
    where: { id },
    create: { id, title, sortOrder },
    update: { title, sortOrder },
  });
  revalidate();
}

/** Delete a category and any admin items filed under it. */
export async function deleteChecklistCategory(formData: FormData) {
  await requireAdminSession('/admin/checklist');
  const id = str(formData, 'id');
  if (!id) return;
  await db.checklistItem.deleteMany({ where: { categoryId: id } }).catch(() => {});
  await db.checklistCategory.delete({ where: { id } }).catch(() => {});
  revalidate();
}

// ─── Checklist line items (admin-created, additive to the static ones) ────────

/** Create a checklist line item under a category (static or admin category id). */
export async function createChecklistItem(formData: FormData) {
  await requireAdminSession('/admin/checklist');
  const title = str(formData, 'title');
  const categoryId = str(formData, 'categoryId');
  if (!title || !categoryId) return;
  const id = slugify(str(formData, 'id') ?? title);
  if (!id) return;
  const existing = await db.checklistItem.findUnique({ where: { id } }).catch(() => null);
  if (existing) {
    revalidate();
    return;
  }
  await db.checklistItem.create({
    data: {
      id,
      categoryId,
      title,
      note: str(formData, 'note'),
      badge: str(formData, 'badge'),
      taylorsTake: str(formData, 'taylorsTake'),
      includeVersions: list(formData, 'includeVersions'),
      sortOrder: intNum(formData, 'sortOrder') ?? 100,
    },
  });
  revalidate();
}

/** Update a checklist line item. */
export async function updateChecklistItem(formData: FormData) {
  await requireAdminSession('/admin/checklist');
  const id = str(formData, 'id');
  if (!id) return;
  await db.checklistItem.update({
    where: { id },
    data: {
      categoryId: str(formData, 'categoryId') ?? undefined,
      title: str(formData, 'title') ?? undefined,
      note: str(formData, 'note'),
      badge: str(formData, 'badge'),
      taylorsTake: str(formData, 'taylorsTake'),
      includeVersions: list(formData, 'includeVersions'),
      sortOrder: intNum(formData, 'sortOrder') ?? undefined,
    },
  });
  revalidate();
}

/** Delete a checklist line item. */
export async function deleteChecklistItem(formData: FormData) {
  await requireAdminSession('/admin/checklist');
  const id = str(formData, 'id');
  if (!id) return;
  await db.checklistItem.delete({ where: { id } }).catch(() => {});
  revalidate();
}
