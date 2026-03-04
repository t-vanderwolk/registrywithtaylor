import prisma from '@/lib/server/prisma';
import { slugify } from '@/lib/slugify';

export function toAffiliateSlugBase(value: string) {
  const normalized = slugify(value);
  return normalized.length > 0 ? normalized : 'partner';
}

export async function generateUniqueAffiliateSlug(baseInput: string, excludeId?: string) {
  const base = toAffiliateSlugBase(baseInput);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.affiliatePartner.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}
