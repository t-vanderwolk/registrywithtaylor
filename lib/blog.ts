import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify';

export async function generateUniqueSlug(baseTitle: string, excludeId?: string) {
  const baseSlug = slugify(baseTitle);
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.post.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}
