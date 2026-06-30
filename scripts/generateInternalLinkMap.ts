import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { GEAR_ACADEMY_MODULES } from '@/lib/academy/gearModules';
import { NURSERY_ACADEMY_MODULES } from '@/lib/academy/nurseryModules';
import { POSTPARTUM_ACADEMY_MODULES } from '@/lib/academy/postpartumModules';
import { REGISTRY_ACADEMY_MODULES } from '@/lib/academy/registryModules';
import { getCarSeatFoundationsAcademySubmoduleCards } from '@/lib/academy/carSeatFoundationsAcademy';
import { getDailyUseGearAcademySubmoduleCards } from '@/lib/academy/dailyUseGearAcademy';
import { buildAcademyInternalLinkPlan } from '@/lib/internal-links/system';
import { getNurseryFurnitureSubmoduleCards } from '@/lib/academy/nurseryFurnitureAcademy';
import { getRegistryWelcomeBoxesAcademySubmoduleCards } from '@/lib/academy/registryWelcomeBoxesAcademy';
import { getStrollerFoundationsAcademySubmoduleCards } from '@/lib/academy/strollerFoundationsAcademy';
import { getPublicPostWhere } from '@/lib/blog/postStatus';
import { buildSiteInternalLinkMap, isSuppressedInternalLink } from '@/lib/internal-links/system';
import type { InternalLinkMapEntry } from '@/lib/internal-links/types';
import prisma from '@/lib/server/prisma';

type LinkMapOutput = {
  generatedAt: string;
  totals: {
    entries: number;
    byKind: Record<string, number>;
    pagesNeedingInboundSupport: number;
  };
  entries: Array<
    InternalLinkMapEntry & {
      inboundCount: number;
      inboundFrom: string[];
    }
  >;
};

type AcademyPageSource = {
  href: `/${string}`;
  pathSlug: 'registry' | 'nursery' | 'gear' | 'postpartum';
  slug: string;
  title: string;
  description: string;
};

function getAcademyPages(): AcademyPageSource[] {
  const pathHubs: AcademyPageSource[] = [
    {
      href: '/academy/registry',
      pathSlug: 'registry',
      slug: 'registry-path',
      title: 'Registry Path',
      description: 'Structured TMBC learning for registry setup, perks, timing, and gifting.',
    },
    {
      href: '/academy/nursery',
      pathSlug: 'nursery',
      slug: 'nursery-path',
      title: 'Nursery Path',
      description: 'Structured TMBC learning for room setup, furniture, and real-life nursery flow.',
    },
    {
      href: '/academy/gear',
      pathSlug: 'gear',
      slug: 'gear-path',
      title: 'Gear Path',
      description: 'Structured TMBC learning for stroller, car seat, travel, and everyday gear decisions.',
    },
    {
      href: '/academy/postpartum',
      pathSlug: 'postpartum',
      slug: 'postpartum-path',
      title: 'Postpartum Path',
      description: 'Structured TMBC learning for recovery, support, feeding flow, and daily life after baby arrives.',
    },
  ];

  const genericModules: AcademyPageSource[] = [
    ...REGISTRY_ACADEMY_MODULES.map((module) => ({
      href: `/academy/registry/${module.slug}` as const,
      pathSlug: 'registry' as const,
      slug: module.slug,
      title: module.title,
      description: module.description,
    })),
    ...NURSERY_ACADEMY_MODULES.map((module) => ({
      href: `/academy/nursery/${module.slug}` as const,
      pathSlug: 'nursery' as const,
      slug: module.slug,
      title: module.title,
      description: module.description,
    })),
    ...GEAR_ACADEMY_MODULES.map((module) => ({
      href: `/academy/gear/${module.slug}` as const,
      pathSlug: 'gear' as const,
      slug: module.slug,
      title: module.title,
      description: module.description,
    })),
    ...POSTPARTUM_ACADEMY_MODULES.map((module) => ({
      href: `/academy/postpartum/${module.slug}` as const,
      pathSlug: 'postpartum' as const,
      slug: module.slug,
      title: module.title,
      description: module.description,
    })),
  ];

  const nestedModules: AcademyPageSource[] = [
    ...getDailyUseGearAcademySubmoduleCards().map((card) => ({
      href: card.href as `/${string}`,
      pathSlug: 'gear' as const,
      slug: card.href.split('/').filter(Boolean).pop() ?? card.title.toLowerCase(),
      title: card.title,
      description: card.description,
    })),
    ...getRegistryWelcomeBoxesAcademySubmoduleCards().map((card) => ({
      href: card.href as `/${string}`,
      pathSlug: 'registry' as const,
      slug: card.href.split('/').filter(Boolean).pop() ?? card.title.toLowerCase(),
      title: card.title,
      description: card.description,
    })),
    ...getNurseryFurnitureSubmoduleCards().map((card) => ({
      href: card.href as `/${string}`,
      pathSlug: 'nursery' as const,
      slug: card.href.split('/').filter(Boolean).pop() ?? card.title.toLowerCase(),
      title: card.title,
      description: card.description,
    })),
    ...getStrollerFoundationsAcademySubmoduleCards().map((card) => ({
      href: card.href as `/${string}`,
      pathSlug: 'gear' as const,
      slug: card.href.split('/').filter(Boolean).pop() ?? card.title.toLowerCase(),
      title: card.title,
      description: card.description,
    })),
    ...getCarSeatFoundationsAcademySubmoduleCards().map((card) => ({
      href: card.href as `/${string}`,
      pathSlug: 'gear' as const,
      slug: card.href.split('/').filter(Boolean).pop() ?? card.title.toLowerCase(),
      title: card.title,
      description: card.description,
    })),
  ];

  return [...pathHubs, ...genericModules, ...nestedModules];
}

async function main() {
  const now = new Date();
  const [posts, guides] = await Promise.all([
    prisma.post.findMany({
      where: getPublicPostWhere(now),
      select: {
        slug: true,
        title: true,
        category: true,
        content: true,
        focusKeyword: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.guide.findMany({
      where: {
        OR: [
          { status: 'PUBLISHED' },
          {
            status: 'SCHEDULED',
            scheduledFor: {
              lte: now,
            },
          },
        ],
      },
      select: {
        slug: true,
        title: true,
        category: true,
        topicCluster: true,
      },
      orderBy: { updatedAt: 'desc' },
    }),
  ]).catch((error) => {
    console.warn('Falling back to static internal-link sources because the content database is unavailable.');
    console.warn(error instanceof Error ? error.message : String(error));
    return [[], []] as const;
  });

  const baseMap = buildSiteInternalLinkMap(
    posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      category: post.category,
      content: post.content,
      focusKeyword: post.focusKeyword,
    })),
    guides.map((guide) => ({
      slug: guide.slug,
      title: guide.title,
      category: guide.category,
      topicCluster: guide.topicCluster,
    })),
  );
  const academyEntries = getAcademyPages().map((page) => buildAcademyInternalLinkPlan(page).mapEntry);
  const map = Object.fromEntries(
    [...Object.values(baseMap), ...academyEntries]
      // /learn + /academy are hidden — drop those pages and any links to them.
      .filter((entry) => !isSuppressedInternalLink(entry.href))
      .map((entry) => [
        entry.href,
        { ...entry, outbound: entry.outbound.filter((target) => !isSuppressedInternalLink(target.href)) },
      ]),
  );

  const inboundMap = new Map<string, Set<string>>();
  Object.values(map).forEach((entry) => {
    entry.outbound.forEach((target) => {
      const sources = inboundMap.get(target.href) ?? new Set<string>();
      sources.add(entry.href);
      inboundMap.set(target.href, sources);
    });
  });

  const entries = Object.values(map)
    .sort((left, right) => left.href.localeCompare(right.href))
    .map((entry) => {
      const inboundFrom = Array.from(inboundMap.get(entry.href) ?? []).sort();
      return {
        ...entry,
        inboundCount: inboundFrom.length,
        inboundFrom,
      };
    });

  const output: LinkMapOutput = {
    generatedAt: now.toISOString(),
    totals: {
      entries: entries.length,
      byKind: entries.reduce<Record<string, number>>((acc, entry) => {
        acc[entry.kind] = (acc[entry.kind] ?? 0) + 1;
        return acc;
      }, {}),
      pagesNeedingInboundSupport: entries.filter((entry) => entry.inboundCount < 2).length,
    },
    entries,
  };

  const targetDir = path.join(process.cwd(), 'data', 'seo');
  const targetPath = path.join(targetDir, 'internal-link-map.json');
  await mkdir(targetDir, { recursive: true });
  await writeFile(targetPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${entries.length} internal link entries to ${targetPath}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
