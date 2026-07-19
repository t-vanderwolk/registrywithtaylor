'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/server/session';
import prismaBase from '@/lib/server/prisma';

// New columns (amazonUrl) land in the generated client on the Heroku build.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const str = (formData: FormData, k: string) => {
  const v = formData.get(k);
  return v == null || String(v).trim() === '' ? null : String(v).trim();
};
const num = (formData: FormData, k: string) => {
  const v = str(formData, k);
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const intNum = (formData: FormData, k: string) => {
  const n = num(formData, k);
  return n == null ? null : Math.round(n);
};
const bool = (formData: FormData, k: string) => formData.get(k) === 'on';
const list = (formData: FormData, k: string) => {
  const v = str(formData, k);
  return v ? v.split(',').map((t) => t.trim()).filter(Boolean) : [];
};

/** Create a new stroller (brand + model required, unique together). */
export async function createStroller(formData: FormData) {
  await requireAdminSession('/admin/strollers');
  const brand = str(formData, 'brand');
  const model = str(formData, 'model');
  if (!brand || !model) return;

  const existing = await db.stroller.findFirst({
    where: { brand: { equals: brand, mode: 'insensitive' }, model: { equals: model, mode: 'insensitive' } },
    select: { id: true },
  });
  if (existing) {
    revalidatePath('/admin/strollers');
    return;
  }

  await db.stroller.create({
    data: {
      brand,
      model,
      displayName: str(formData, 'displayName') ?? `${brand} ${model}`,
      summary: str(formData, 'summary'),
      amazonUrl: str(formData, 'amazonUrl'),
    },
  });
  revalidatePath('/admin/strollers');
}

/** Update a stroller's editorial fields + upsert its quiz spec. */
export async function updateStroller(formData: FormData) {
  await requireAdminSession('/admin/strollers');
  const id = str(formData, 'id');
  if (!id) return;

  await db.stroller.update({
    where: { id },
    data: {
      displayName: str(formData, 'displayName'),
      summary: str(formData, 'summary'),
      amazonUrl: str(formData, 'amazonUrl'),
    },
  });

  const specData = {
    priceRange: str(formData, 'priceRange'),
    lifestyle: list(formData, 'lifestyle'),
    foldType: str(formData, 'foldType'),
    isExpandable: bool(formData, 'isExpandable'),
    maxWeightLbs: intNum(formData, 'maxWeightLbs'),
    ownWeightLbs: num(formData, 'ownWeightLbs'),
    suitableFromBirth: bool(formData, 'suitableFromBirth'),
    suitableForJogging: bool(formData, 'suitableForJogging'),
    budgetMin: intNum(formData, 'budgetMin'),
    budgetMax: intNum(formData, 'budgetMax'),
    // Compare-tool dimensions.
    modular: bool(formData, 'modular'),
    fitsOverheadBin: bool(formData, 'fitsOverheadBin'),
    basketCapacityLbs: num(formData, 'basketCapacityLbs'),
  };

  await db.strollerSpec.upsert({
    where: { strollerId: id },
    create: { strollerId: id, ...specData },
    update: specData,
  });

  revalidatePath('/admin/strollers');
}

/** Delete a stroller (cascades its spec + compatibility rows). */
export async function deleteStroller(formData: FormData) {
  await requireAdminSession('/admin/strollers');
  const id = str(formData, 'id');
  if (!id) return;
  await db.stroller.delete({ where: { id } });
  revalidatePath('/admin/strollers');
}
