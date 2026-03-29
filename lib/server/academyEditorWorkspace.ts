import 'server-only';

import type { GuideCategory } from '@/lib/guides/categories';
import type { GuideStatusValue } from '@/lib/guides/status';
import {
  DAILY_USE_GEAR_ACADEMY_TITLE,
  getDailyUseGearAcademySubmoduleCards,
} from '@/lib/academy/dailyUseGearAcademy';
import {
  NURSERY_FURNITURE_HUB_PATH,
  getNurseryFurnitureSubmoduleCards,
} from '@/lib/academy/nurseryFurnitureAcademy';
import {
  CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE,
  getCarSeatFoundationsAcademySubmoduleCards,
} from '@/lib/academy/carSeatFoundationsAcademy';
import {
  STROLLER_FOUNDATIONS_ACADEMY_TITLE,
  getStrollerFoundationsAcademySubmoduleCards,
} from '@/lib/academy/strollerFoundationsAcademy';
import { getGuidePublicPath, normalizeGuideCanonicalPath } from '@/lib/guides/publicPath';
import prisma from '@/lib/server/prisma';
import {
  ACADEMY_TOPIC_CLUSTER_TOKEN,
  getAcademyGuideScopeWhere,
} from '@/lib/server/academyGuides';
import {
  GUIDE_STORAGE_UNAVAILABLE_MESSAGE,
  isGuideStorageUnavailableError,
  logGuideStorageUnavailable,
} from '@/lib/server/guideStorage';

type AcademyEditorWorkspacePath = 'gear' | 'nursery';

type AcademyEditorRouteSeed = {
  publicPath: `/${string}`;
  title: string;
  description: string;
  slug: string;
  pathSlug: AcademyEditorWorkspacePath;
  pathLabel: string;
  parentLabel: string;
  category: GuideCategory;
  topicCluster: string;
};

export type AcademySubmoduleInventoryItem = AcademyEditorRouteSeed & {
  existingGuideId: string | null;
  recordTitle: string | null;
  recordStatus: GuideStatusValue | null;
  updatedAt: string | null;
  duplicateCount: number;
};

export type AcademySubmoduleInventorySection = {
  id: string;
  title: string;
  description: string;
  pathLabel: string;
  items: AcademySubmoduleInventoryItem[];
};

const ACADEMY_SUBMODULE_BLUEPRINTS = [
  {
    id: 'gear-daily-use-gear',
    title: DAILY_USE_GEAR_ACADEMY_TITLE,
    description: 'Daily Use Gear submodules that should be editable from one Academy route map instead of living as hidden paths.',
    pathSlug: 'gear' as const,
    pathLabel: 'Gear',
    cards: getDailyUseGearAcademySubmoduleCards(),
  },
  {
    id: 'gear-stroller-foundations',
    title: STROLLER_FOUNDATIONS_ACADEMY_TITLE,
    description: 'Every stroller lane the Academy uses to keep category-fit decisions smaller and easier to navigate.',
    pathSlug: 'gear' as const,
    pathLabel: 'Gear',
    cards: getStrollerFoundationsAcademySubmoduleCards(),
  },
  {
    id: 'gear-car-seat-foundations',
    title: CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE,
    description: 'Every car seat category route that should be editable without hunting through separate systems.',
    pathSlug: 'gear' as const,
    pathLabel: 'Gear',
    cards: getCarSeatFoundationsAcademySubmoduleCards(),
  },
  {
    id: 'nursery-furniture-that-actually-works',
    title: 'Furniture That Actually Works',
    description: 'The nursery furniture submodules that shape the room without turning the admin into a scavenger hunt.',
    pathSlug: 'nursery' as const,
    pathLabel: 'Nursery',
    cards: getNurseryFurnitureSubmoduleCards(),
  },
] as const;

function getAcademyCategory(pathSlug: AcademyEditorWorkspacePath): GuideCategory {
  return pathSlug === 'nursery' ? 'Nursery Planning' : 'Baby Gear Guides';
}

function getSeedSlug(publicPath: string) {
  return publicPath.split('/').filter(Boolean).at(-1) ?? 'academy-guide';
}

function buildTopicCluster(pathLabel: string, parentLabel: string) {
  return `${ACADEMY_TOPIC_CLUSTER_TOKEN} · ${pathLabel} · ${parentLabel}`;
}

function buildSeed({
  publicPath,
  title,
  description,
  pathSlug,
  pathLabel,
  parentLabel,
}: {
  publicPath: string;
  title: string;
  description: string;
  pathSlug: AcademyEditorWorkspacePath;
  pathLabel: string;
  parentLabel: string;
}): AcademyEditorRouteSeed {
  return {
    publicPath: publicPath as `/${string}`,
    title,
    description,
    slug: getSeedSlug(publicPath),
    pathSlug,
    pathLabel,
    parentLabel,
    category: getAcademyCategory(pathSlug),
    topicCluster: buildTopicCluster(pathLabel, parentLabel),
  };
}

function buildSectionSeeds() {
  return ACADEMY_SUBMODULE_BLUEPRINTS.map((section) => ({
    id: section.id,
    title: section.title,
    description: section.description,
    pathLabel: section.pathLabel,
    items: section.cards.map((card) =>
      buildSeed({
        publicPath: card.href,
        title: card.title,
        description: card.description,
        pathSlug: section.pathSlug,
        pathLabel: section.pathLabel,
        parentLabel: section.title,
      }),
    ),
  }));
}

function sortGuideMatches<
  T extends {
    updatedAt: Date;
    status: GuideStatusValue;
  },
>(matches: T[]) {
  return [...matches].sort(
    (left, right) =>
      right.updatedAt.getTime() - left.updatedAt.getTime() ||
      (right.status === 'PUBLISHED' ? 1 : 0) - (left.status === 'PUBLISHED' ? 1 : 0),
  );
}

export async function getAcademySubmoduleInventory() {
  const sectionSeeds = buildSectionSeeds();
  const academyGuides = await prisma.guide.findMany({
    where: getAcademyGuideScopeWhere(),
    select: {
      id: true,
      title: true,
      slug: true,
      canonicalUrl: true,
      topicCluster: true,
      status: true,
      updatedAt: true,
    },
  });

  const guidesByPath = new Map<
    string,
    Array<{
      id: string;
      title: string;
      status: GuideStatusValue;
      updatedAt: Date;
    }>
  >();

  for (const guide of academyGuides) {
    const publicPath = getGuidePublicPath({
      slug: guide.slug,
      topicCluster: guide.topicCluster,
      canonicalUrl: guide.canonicalUrl,
    });

    if (!publicPath.startsWith(`${NURSERY_FURNITURE_HUB_PATH}/`) && !publicPath.startsWith('/academy/')) {
      continue;
    }

    const existing = guidesByPath.get(publicPath) ?? [];
    existing.push({
      id: guide.id,
      title: guide.title,
      status: guide.status,
      updatedAt: guide.updatedAt,
    });
    guidesByPath.set(publicPath, existing);
  }

  return sectionSeeds.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      const matches = sortGuideMatches(guidesByPath.get(item.publicPath) ?? []);
      const primary = matches[0] ?? null;

      return {
        ...item,
        existingGuideId: primary?.id ?? null,
        recordTitle: primary?.title ?? null,
        recordStatus: primary?.status ?? null,
        updatedAt: primary?.updatedAt?.toISOString() ?? null,
        duplicateCount: matches.length,
      };
    }),
  })) satisfies AcademySubmoduleInventorySection[];
}

export async function getAcademySubmoduleInventorySafe() {
  try {
    return {
      sections: await getAcademySubmoduleInventory(),
      storageReady: true,
      storageMessage: null,
    };
  } catch (error) {
    if (!isGuideStorageUnavailableError(error)) {
      throw error;
    }

    logGuideStorageUnavailable('getAcademySubmoduleInventorySafe', error);

    return {
      sections: [] as AcademySubmoduleInventorySection[],
      storageReady: false,
      storageMessage: GUIDE_STORAGE_UNAVAILABLE_MESSAGE,
    };
  }
}

export function getAcademyEditorSeedByPath(publicPath?: string | null) {
  const normalizedPath = normalizeGuideCanonicalPath(publicPath);
  if (!normalizedPath) {
    return null;
  }

  return buildSectionSeeds()
    .flatMap((section) => section.items)
    .find((item) => item.publicPath === normalizedPath) ?? null;
}
