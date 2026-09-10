'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/server/session';
import prismaBase from '@/lib/server/prisma';
import {
  categories as staticCategories,
  checklistItems as staticItems,
  type ChecklistTake,
  type ChecklistTiming,
} from '@/lib/checklist/data';

// ChecklistProduct lands in the generated client on the Heroku build.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const VALID_TIMINGS: ChecklistTiming[] = [
  'before-baby',
  'first-8-weeks',
  '3-6-months',
  '6-12-months',
  'later',
];
const VALID_TAKES: ChecklistTake[] = [
  'essential',
  'try-first',
  'register-early',
  'nice-to-have',
  'lifestyle-dependent',
  'wait',
];
const staticCategoryDefaults = new Map<string, { title: string; sortOrder: number }>(
  staticCategories.map((category, index) => [
    category.id,
    { title: category.title, sortOrder: index * 10 },
  ]),
);
const staticItemDefaults = new Map(
  staticItems.map((item) => [
    item.id,
    {
      categoryId: item.category,
      title: item.title,
      note: item.note ?? null,
      badge: item.badge ?? null,
      taylorsTake: item.taylorsTake ?? null,
      timing: item.timing ?? null,
      take: item.take ?? null,
    },
  ]),
);

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
const option = <T extends string>(fd: FormData, k: string, valid: readonly T[]): T | null => {
  const v = str(fd, k);
  return valid.includes(v as T) ? (v as T) : null;
};
const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function revalidate() {
  revalidatePath('/admin/checklist');
  // The girl/boy/twins variants are no longer separate routes — the version is
  // an in-page toggle on this single page, so revalidating it covers all four.
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

// ─── Checklist categories (DB overrides for static rows + manual rows) ────────

/** Create or rename a checklist category. Existing static ids become editable DB overrides. */
export async function saveChecklistCategory(formData: FormData) {
  await requireAdminSession('/admin/checklist');
  const title = str(formData, 'title');
  if (!title) return;
  const id = slugify(str(formData, 'id') ?? title);
  if (!id) return;
  const sortOrder = intNum(formData, 'sortOrder') ?? 100;
  const hidden = !bool(formData, 'visible');
  await db.checklistCategory.upsert({
    where: { id },
    create: { id, title, sortOrder, hidden },
    update: { title, sortOrder, hidden },
  });
  revalidate();
}

/** Hide a category without deleting products or item assignments. */
export async function deleteChecklistCategory(formData: FormData) {
  await requireAdminSession('/admin/checklist');
  const id = str(formData, 'id');
  if (!id) return;
  const fallback = staticCategoryDefaults.get(id) ?? { title: id, sortOrder: 100 };
  await db.checklistCategory.upsert({
    where: { id },
    create: { id, title: fallback.title, sortOrder: fallback.sortOrder, hidden: true },
    update: { hidden: true },
  });
  revalidate();
}

// ─── Checklist line items (DB overrides for static rows + manual rows) ────────

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
      timing: option(formData, 'timing', VALID_TIMINGS),
      take: option(formData, 'take', VALID_TAKES),
      includeVersions: list(formData, 'includeVersions'),
      sortOrder: intNum(formData, 'sortOrder') ?? 100,
      hidden: !bool(formData, 'visible'),
    },
  });
  revalidate();
}

/** Update a checklist line item. Existing static ids become editable DB overrides. */
export async function updateChecklistItem(formData: FormData) {
  await requireAdminSession('/admin/checklist');
  const id = str(formData, 'id');
  if (!id) return;
  const fallback = staticItemDefaults.get(id);
  const categoryId = str(formData, 'categoryId') ?? fallback?.categoryId;
  const title = str(formData, 'title') ?? fallback?.title;
  if (!categoryId || !title) return;
  const data = {
    categoryId,
    title,
    note: str(formData, 'note'),
    badge: str(formData, 'badge'),
    taylorsTake: str(formData, 'taylorsTake'),
    timing: option(formData, 'timing', VALID_TIMINGS),
    take: option(formData, 'take', VALID_TAKES),
    includeVersions: list(formData, 'includeVersions'),
    sortOrder: intNum(formData, 'sortOrder') ?? 100,
    hidden: !bool(formData, 'visible'),
  };
  await db.checklistItem.upsert({
    where: { id },
    create: { id, ...data },
    update: data,
  });
  revalidate();
}

/** Hide a checklist line item without deleting any product recommendations or affiliate links. */
export async function deleteChecklistItem(formData: FormData) {
  await requireAdminSession('/admin/checklist');
  const id = str(formData, 'id');
  if (!id) return;
  const fallback = staticItemDefaults.get(id);
  await db.checklistItem.upsert({
    where: { id },
    create: {
      id,
      categoryId: fallback?.categoryId ?? 'registry-strategy',
      title: fallback?.title ?? id,
      note: fallback?.note ?? null,
      badge: fallback?.badge ?? null,
      taylorsTake: fallback?.taylorsTake ?? null,
      timing: fallback?.timing ?? null,
      take: fallback?.take ?? null,
      includeVersions: [],
      sortOrder: 100,
      hidden: true,
    },
    update: { hidden: true },
  });
  revalidate();
}
