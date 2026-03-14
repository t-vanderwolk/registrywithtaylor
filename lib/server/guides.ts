import prisma from '@/lib/server/prisma';
import { slugify } from '@/lib/slugify';
import { normalizeGuideStatus } from '@/lib/guides/status';
import { isGuideStorageUnavailableError, logGuideStorageUnavailable } from '@/lib/server/guideStorage';

export async function generateUniqueGuideSlug(baseTitle: string, excludeId?: string) {
  const baseSlug = slugify(baseTitle);
  let candidate = baseSlug || 'guide';
  let counter = 1;

  while (true) {
    let existing;
    try {
      existing = await prisma.guide.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
    } catch (error) {
      if (isGuideStorageUnavailableError(error)) {
        logGuideStorageUnavailable('generateUniqueGuideSlug', error);
        return candidate;
      }

      throw error;
    }

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    candidate = `${baseSlug || 'guide'}-${counter}`;
    counter += 1;
  }
}

export async function listGuideRelationOptions(excludeId?: string) {
  let guides;
  try {
    guides = await prisma.guide.findMany({
      where: excludeId
        ? {
            id: {
              not: excludeId,
            },
          }
        : undefined,
      orderBy: [{ updatedAt: 'desc' }, { title: 'asc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        status: true,
      },
    });
  } catch (error) {
    if (isGuideStorageUnavailableError(error)) {
      logGuideStorageUnavailable('listGuideRelationOptions', error);
      return [];
    }

    throw error;
  }

  return guides.map((guide) => ({
    id: guide.id,
    title: guide.title,
    slug: guide.slug,
    category: guide.category,
    status: normalizeGuideStatus(guide.status),
  }));
}

export async function isGuideStorageReady() {
  try {
    await prisma.guide.count();
    return true;
  } catch (error) {
    if (isGuideStorageUnavailableError(error)) {
      logGuideStorageUnavailable('isGuideStorageReady', error);
      return false;
    }

    throw error;
  }
}
