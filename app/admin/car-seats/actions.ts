'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/server/session';
import prismaBase from '@/lib/server/prisma';

// New columns (amazonUrl) land in the generated client on the Heroku build.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SEAT_TYPES = new Set(['INFANT', 'CONVERTIBLE', 'ALL_IN_ONE']);

const str = (formData: FormData, k: string) => {
  const v = formData.get(k);
  return v == null || String(v).trim() === '' ? null : String(v).trim();
};

/** Create a new car seat (brand + model required, unique together). */
export async function createCarSeat(formData: FormData) {
  await requireAdminSession('/admin/car-seats');
  const brand = str(formData, 'brand');
  const model = str(formData, 'model');
  if (!brand || !model) return;

  const existing = await db.carSeat.findFirst({
    where: { brand: { equals: brand, mode: 'insensitive' }, model: { equals: model, mode: 'insensitive' } },
    select: { id: true },
  });
  if (existing) {
    revalidatePath('/admin/car-seats');
    return;
  }

  const seatTypeRaw = str(formData, 'seatType');
  await db.carSeat.create({
    data: {
      brand,
      model,
      displayName: str(formData, 'displayName') ?? `${brand} ${model}`,
      seatType: seatTypeRaw && SEAT_TYPES.has(seatTypeRaw) ? seatTypeRaw : 'INFANT',
      summary: str(formData, 'summary'),
      amazonUrl: str(formData, 'amazonUrl'),
    },
  });
  revalidatePath('/admin/car-seats');
}

/** Update a car seat's editorial fields. */
export async function updateCarSeat(formData: FormData) {
  await requireAdminSession('/admin/car-seats');
  const id = str(formData, 'id');
  if (!id) return;

  const seatTypeRaw = str(formData, 'seatType');
  await db.carSeat.update({
    where: { id },
    data: {
      displayName: str(formData, 'displayName'),
      seatType: seatTypeRaw && SEAT_TYPES.has(seatTypeRaw) ? seatTypeRaw : 'INFANT',
      summary: str(formData, 'summary'),
      amazonUrl: str(formData, 'amazonUrl'),
    },
  });
  revalidatePath('/admin/car-seats');
}

/** Delete a car seat (cascades its compatibility rows). */
export async function deleteCarSeat(formData: FormData) {
  await requireAdminSession('/admin/car-seats');
  const id = str(formData, 'id');
  if (!id) return;
  await db.carSeat.delete({ where: { id } });
  revalidatePath('/admin/car-seats');
}
