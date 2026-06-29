'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/server/session';
import prismaBase from '@/lib/server/prisma';

// New models land in the generated client on the Heroku build (`prisma generate`).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const COMPATIBILITY_TYPES = ['DIRECT', 'ADAPTER', 'LIMITED', 'LOCKED', 'INCOMPATIBLE'] as const;
const CONFIDENCE_VALUES = ['HIGH', 'MEDIUM', 'LOW'] as const;

function stringField(formData: FormData, key: string) {
  const value = formData.get(key);
  const text = value == null ? '' : String(value).trim();
  return text || null;
}

function boolField(formData: FormData, key: string) {
  return formData.get(key) === 'on';
}

function priceField(formData: FormData, key: string) {
  const value = stringField(formData, key);
  if (!value) return null;
  const parsed = Number(value.replace(/[$,]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function enumField<T extends readonly string[]>(formData: FormData, key: string, values: T, fallback: T[number]) {
  const value = stringField(formData, key);
  return values.includes((value ?? '') as T[number]) ? (value as T[number]) : fallback;
}

function revalidateCompatibilityViews() {
  revalidatePath('/admin/catalog/compatibility');
  revalidatePath('/admin/catalog/health');
  revalidatePath('/tools/travel-system');
  revalidatePath('/tools/travel-system/results');
}

async function adapterCatalogFields(formData: FormData) {
  const adapterCatalogProductId = stringField(formData, 'adapterCatalogProductId');
  if (!adapterCatalogProductId) return null;

  const adapter = await db.affiliateCatalogProduct.findUnique({
    where: { id: adapterCatalogProductId },
    select: {
      externalId: true,
      sku: true,
      title: true,
      affiliateUrl: true,
      productUrl: true,
      price: true,
      salePrice: true,
      imageUrl: true,
    },
  });

  if (!adapter) return null;

  return {
    adapterType: adapter.title ?? null,
    adapterBabylistUrl: adapter.affiliateUrl ?? adapter.productUrl ?? null,
    adapterPrice: adapter.salePrice ?? adapter.price ?? null,
    adapterImage: adapter.imageUrl ?? null,
    adapterBabylistSku: adapter.sku ?? adapter.externalId ?? null,
  };
}

export async function saveCompatibility(formData: FormData) {
  await requireAdminSession('/admin/catalog/compatibility');

  const compatibilityId = stringField(formData, 'compatibilityId');
  const strollerId = stringField(formData, 'strollerId');
  const carSeatIds = formData
    .getAll('carSeatIds')
    .map((value) => String(value).trim())
    .filter(Boolean);
  const carSeatId = stringField(formData, 'carSeatId');

  if (!strollerId) return;
  if (!compatibilityId && carSeatIds.length === 0) return;
  if (compatibilityId && !carSeatId) return;

  const catalogAdapter = await adapterCatalogFields(formData);
  const manualAdapterPrice = priceField(formData, 'adapterPrice');
  const compatibilityType = enumField(formData, 'compatibilityType', COMPATIBILITY_TYPES, 'ADAPTER');
  const data = {
    strollerId,
    compatibilityType,
    adapterRequired: compatibilityType === 'ADAPTER' || boolField(formData, 'adapterRequired'),
    adapterType: stringField(formData, 'adapterType') ?? catalogAdapter?.adapterType ?? null,
    notes: stringField(formData, 'notes'),
    confidence: enumField(formData, 'confidence', CONFIDENCE_VALUES, 'HIGH'),
    adapterBabylistUrl: stringField(formData, 'adapterBabylistUrl') ?? catalogAdapter?.adapterBabylistUrl ?? null,
    adapterPrice: manualAdapterPrice ?? catalogAdapter?.adapterPrice ?? null,
    adapterImage: stringField(formData, 'adapterImage') ?? catalogAdapter?.adapterImage ?? null,
    adapterBabylistSku: stringField(formData, 'adapterBabylistSku') ?? catalogAdapter?.adapterBabylistSku ?? null,
    adapterUpdatedAt: new Date(),
  };

  if (compatibilityId) {
    await db.compatibility.update({
      where: { id: compatibilityId },
      data: { ...data, carSeatId },
    });
  } else {
    await Promise.all(
      carSeatIds.map((id) =>
        db.compatibility.upsert({
          where: { strollerId_carSeatId: { strollerId, carSeatId: id } },
          create: { ...data, carSeatId: id },
          update: data,
        }),
      ),
    );
  }

  revalidateCompatibilityViews();
}

export async function deleteCompatibility(formData: FormData) {
  await requireAdminSession('/admin/catalog/compatibility');

  const compatibilityId = stringField(formData, 'compatibilityId');
  if (!compatibilityId) return;

  await db.compatibility.delete({ where: { id: compatibilityId } });
  revalidateCompatibilityViews();
}
