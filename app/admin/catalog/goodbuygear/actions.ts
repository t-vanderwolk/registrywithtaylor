'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/server/session';
import prismaBase from '@/lib/server/prisma';

// GbgBadgeOverride lands in the generated client on the Heroku build.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const str = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return v == null || String(v).trim() === '' ? null : String(v).trim();
};

/**
 * Set (or clear) the GoodBuy Gear badge override for one product card.
 *   state 'auto' → delete the row (fully automatic behavior)
 *   state 'on' | 'off' → upsert
 * The page and every funnel tool revalidate so the change is immediately live.
 */
export async function setGbgBadgeOverride(formData: FormData) {
  const session = await requireAdminSession('/admin/catalog/goodbuygear');
  const key = str(formData, 'key');
  const state = str(formData, 'state');
  if (!key || !state || !['auto', 'on', 'off'].includes(state)) return;

  if (state === 'auto') {
    await db.gbgBadgeOverride.deleteMany({ where: { key } });
  } else {
    const data = {
      state,
      brand: str(formData, 'brand'),
      name: str(formData, 'name'),
      surface: str(formData, 'surface'),
      updatedBy: (session.user as { email?: string | null })?.email ?? 'admin',
    };
    await db.gbgBadgeOverride.upsert({
      where: { key },
      create: { key, ...data },
      update: data,
    });
  }

  // The audit view + all surfaces that render the badge.
  revalidatePath('/admin/catalog/goodbuygear');
  revalidatePath('/resources/baby-checklist');
  revalidatePath('/tools/stroller-finder');
  revalidatePath('/tools/stroller-quiz');
  revalidatePath('/tools/travel-system');
}
