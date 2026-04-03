import type { PostStatus, Prisma } from '@prisma/client';
import { extractLeadParagraphs, stripMarkdown } from '@/lib/blog/contentText';
import { GEAR_ACADEMY_MODULES } from '@/lib/academy/gearModules';
import { GUIDE_CATEGORIES } from '@/lib/guides/categories';
import { STROLLER_CATEGORY_GUIDE_SLUGS } from '@/lib/guides/strollerCluster';
import { CAR_SEAT_CATEGORY_GUIDE_SLUGS } from '@/lib/guides/carSeatCategoryGuides';
import prisma from '@/lib/server/prisma';

const PUBLISH_FLAG = '--publish';
const GEAR_CATEGORY = GUIDE_CATEGORIES[5];
const GEAR_ACADEMY_TOPIC_CLUSTER = 'TMBC Baby Academy: Gear Modules';
const RETIRED_GEAR_ACADEMY_LOOKUPS: Prisma.GuideWhereInput[] = [
  { slug: 'academy-gear-compact-vs-full-size' },
  { slug: 'compact-vs-full-size' },
  { canonicalUrl: '/academy/gear/compact-vs-full-size' },
];

function truncateAtWordBoundary(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  const truncated = value.slice(0, maxLength + 1);
  const boundary = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, boundary > 0 ? boundary : maxLength).trim()}.`;
}

function buildExcerpt(content: string, fallback: string) {
  const lead = extractLeadParagraphs(content, 2)
    .map((paragraph) => stripMarkdown(paragraph))
    .filter(Boolean)
    .join(' ');

  return truncateAtWordBoundary(lead || fallback, 220);
}

function buildSeoDescription(content: string, fallback: string) {
  const lead = extractLeadParagraphs(content, 2)
    .map((paragraph) => stripMarkdown(paragraph))
    .filter(Boolean)
    .join(' ');

  return truncateAtWordBoundary(lead || fallback, 160);
}

function stripTopHeading(content: string) {
  return content.replace(/^#\s+.+\n+/, '').trim();
}

function getGuideSlug(moduleSlug: string) {
  return `academy-gear-${moduleSlug}`;
}

function getLegacyLookupVariants(moduleSlug: string) {
  if (moduleSlug === 'car-seat-foundations') {
    return [
      { slug: 'car-seat-basics' },
      { canonicalUrl: '/academy/gear/car-seat-basics' },
    ];
  }

  return [{ slug: moduleSlug }];
}

function getStatusData({
  existing,
  publish,
  preserveExistingStatus,
}: {
  existing: { status: PostStatus; publishedAt: Date | null; archivedAt: Date | null } | null;
  publish: boolean;
  preserveExistingStatus: boolean;
}) {
  if (publish) {
    return {
      status: 'PUBLISHED' as const,
      publishedAt: existing?.publishedAt ?? new Date(),
      archivedAt: null,
    };
  }

  if (!preserveExistingStatus) {
    return {
      status: 'DRAFT' as const,
      publishedAt: null,
      archivedAt: null,
    };
  }

  return {
    status: existing?.status ?? ('DRAFT' as const),
    publishedAt: existing?.publishedAt ?? null,
    archivedAt: existing?.archivedAt ?? null,
  };
}

async function main() {
  const publish = process.argv.includes(PUBLISH_FLAG);

  const author =
    (await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, name: true },
      orderBy: { createdAt: 'asc' },
    })) ??
    (await prisma.user.findFirst({
      select: { id: true, email: true, name: true },
      orderBy: { createdAt: 'asc' },
    }));

  if (!author) {
    throw new Error('No users found. Create an admin user before seeding gear academy modules.');
  }

  const seededGuideIdsBySlug = new Map<string, string>();

  for (const module of GEAR_ACADEMY_MODULES) {
    const canonicalUrl = `/academy/gear/${module.slug}`;
    const guideSlug = getGuideSlug(module.slug);
    const existing = await prisma.guide.findFirst({
      where: {
        topicCluster: {
          contains: GEAR_ACADEMY_TOPIC_CLUSTER,
          mode: 'insensitive',
        },
        OR: [{ slug: guideSlug }, { canonicalUrl }, ...getLegacyLookupVariants(module.slug)],
      },
      select: { id: true, slug: true, status: true, publishedAt: true, archivedAt: true },
    });

    const statusData = getStatusData({
      existing,
      publish,
      preserveExistingStatus: existing?.slug === guideSlug,
    });
    const intro = module.intro.join('\n\n').trim();
    const content = stripTopHeading(module.markdownContent);
    const nextModule = module.nextModuleSlug
      ? GEAR_ACADEMY_MODULES.find((candidate) => candidate.slug === module.nextModuleSlug) ?? null
      : null;
    const nextStep = nextModule
      ? {
          label: `Next Module: ${nextModule.title}`,
          href: `/academy/gear/${nextModule.slug}`,
        }
      : {
          label: 'Continue to Postpartum Path',
          href: '/academy/postpartum',
        };

    const data = {
      title: module.title,
      slug: guideSlug,
      excerpt: buildExcerpt(intro, module.description),
      intro,
      content,
      conclusion: null,
      heroImageUrl: module.imagePath,
      heroImageAlt: module.imageAlt,
      authorId: author.id,
      category: GEAR_CATEGORY,
      topicCluster: GEAR_ACADEMY_TOPIC_CLUSTER,
      status: statusData.status,
      publishedAt: statusData.publishedAt,
      scheduledFor: null,
      archivedAt: statusData.archivedAt,
      seoTitle: `${module.title} | TMBC Baby Academy`,
      seoDescription: buildSeoDescription(intro, module.description),
      ogTitle: `${module.title} | TMBC Baby Academy`,
      ogDescription: buildSeoDescription(intro, module.description),
      ogImageUrl: module.imagePath,
      ogImageAlt: module.imageAlt,
      canonicalUrl,
      targetKeyword: `${module.title.toLowerCase()} baby gear`,
      secondaryKeywords: ['baby gear planning', 'academy gear module', module.slug.replace(/-/g, ' ')],
      internalLinkNotes:
        'Seeded from lib/academy/gearModules.ts. Keep draft unless academy module records are intentionally being surfaced through another guide workflow.',
      tableOfContentsEnabled: true,
      faqItems: [] as Prisma.InputJsonValue,
      affiliateDisclosureEnabled: false,
      affiliateDisclosureText: null,
      affiliateDisclosurePlacement: 'before_affiliates',
      affiliateModules: [] as Prisma.InputJsonValue,
      consultationCtaEnabled: true,
      consultationCtaLabel: 'Book a Consultation',
      newsletterCtaEnabled: false,
      newsletterCtaLabel: null,
      newsletterCtaDescription: null,
      newsletterCtaHref: null,
      nextStepCtaLabel: nextStep.label,
      nextStepCtaHref: nextStep.href,
      founderSignatureEnabled: false,
      founderSignatureText: null,
    };

    const saved = existing
      ? await prisma.guide.update({
          where: { id: existing.id },
          data,
          select: { id: true, slug: true, title: true, status: true },
        })
      : await prisma.guide.create({
          data: {
            ...data,
            relatedGuideIds: [],
          },
          select: { id: true, slug: true, title: true, status: true },
        });

    seededGuideIdsBySlug.set(module.slug, saved.id);
    console.log(
      `${existing ? 'Updated' : 'Created'} gear academy module: ${saved.title} (${guideSlug} -> ${canonicalUrl}) [${saved.status}]`,
    );
  }

  const registryGuide = await prisma.guide.findFirst({
    where: {
      OR: [
        { canonicalUrl: '/academy/registry/where-to-register' },
        { slug: 'academy-registry-where-to-register' },
        { slug: 'where-to-register' },
      ],
    },
    select: { id: true },
  });
  const postpartumFeedingGuide = await prisma.guide.findFirst({
    where: {
      OR: [
        { canonicalUrl: '/academy/postpartum/feeding-and-lactation' },
        { slug: 'academy-postpartum-feeding-and-lactation' },
        { slug: 'feeding-and-lactation' },
      ],
    },
    select: { id: true },
  });
  const strollerCategoryGuides = await prisma.guide.findMany({
    where: {
      slug: {
        in: Array.from(STROLLER_CATEGORY_GUIDE_SLUGS),
      },
    },
    select: {
      id: true,
      slug: true,
    },
  });
  const strollerCategoryGuideIds = Array.from(STROLLER_CATEGORY_GUIDE_SLUGS)
    .map((slug) => strollerCategoryGuides.find((guide) => guide.slug === slug)?.id ?? null)
    .filter((id): id is string => Boolean(id));
  const carSeatCategoryGuides = await prisma.guide.findMany({
    where: {
      slug: {
        in: Array.from(CAR_SEAT_CATEGORY_GUIDE_SLUGS),
      },
    },
    select: {
      id: true,
      slug: true,
    },
  });
  const carSeatCategoryGuideIds = Array.from(CAR_SEAT_CATEGORY_GUIDE_SLUGS)
    .map((slug) => carSeatCategoryGuides.find((guide) => guide.slug === slug)?.id ?? null)
    .filter((id): id is string => Boolean(id));

  for (const module of GEAR_ACADEMY_MODULES) {
    const guideId = seededGuideIdsBySlug.get(module.slug);
    if (!guideId) {
      continue;
    }

    const relatedGuideIds = Array.from(
      new Set(
        [
          module.previousModuleSlug ? seededGuideIdsBySlug.get(module.previousModuleSlug) ?? null : null,
          module.nextModuleSlug ? seededGuideIdsBySlug.get(module.nextModuleSlug) ?? null : null,
          module.slug === 'daily-use-gear' ? registryGuide?.id ?? null : null,
          module.slug === 'feeding-setup-flow' ? registryGuide?.id ?? null : null,
          module.slug === 'feeding-setup-flow' ? postpartumFeedingGuide?.id ?? null : null,
          ...(module.slug === 'stroller-foundations' ? strollerCategoryGuideIds : []),
          ...(module.slug === 'car-seat-foundations' ? carSeatCategoryGuideIds : []),
        ].filter((id): id is string => Boolean(id)),
      ),
    );

    await prisma.guide.update({
      where: { id: guideId },
      data: {
        relatedGuideIds,
      },
    });
  }

  const retiredGuides = await prisma.guide.findMany({
    where: {
      topicCluster: {
        contains: GEAR_ACADEMY_TOPIC_CLUSTER,
        mode: 'insensitive',
      },
      OR: RETIRED_GEAR_ACADEMY_LOOKUPS,
    },
    select: {
      id: true,
      title: true,
      status: true,
      archivedAt: true,
    },
  });

  for (const retiredGuide of retiredGuides) {
    await prisma.guide.update({
      where: { id: retiredGuide.id },
      data: {
        status: 'ARCHIVED',
        archivedAt: retiredGuide.archivedAt ?? new Date(),
        scheduledFor: null,
      },
    });

    console.log(`Archived retired gear academy module: ${retiredGuide.title}`);
  }

  console.log('');
  console.log(
    `Seeded ${GEAR_ACADEMY_MODULES.length} gear academy modules${publish ? ' as published content.' : ' while preserving existing live statuses when records already existed.'}`,
  );
  console.log(`Author: ${author.name?.trim() || author.email}`);
  console.log('These records mirror the academy gear path and keep the module copy editable in the guide system without changing the public academy routes.');
}

main()
  .catch((error) => {
    console.error('Failed to seed gear academy modules:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
