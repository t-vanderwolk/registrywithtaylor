import type { PostStatus, Prisma } from '@prisma/client';
import {
  buildDailyUseGearAcademySubmoduleModule,
  getDailyUseGearAcademySubmodule,
  getDailyUseGearAcademySubmoduleNavigation,
  getDailyUseGearAcademySubmodulePath,
  type DailyUseGearAcademySubmoduleSlug,
} from '@/lib/academy/dailyUseGearAcademy';
import { GUIDE_CATEGORIES } from '@/lib/guides/categories';
import prisma from '@/lib/server/prisma';
import { ACADEMY_TOPIC_CLUSTER_TOKEN } from '@/lib/server/academyGuides';

const PUBLISH_FLAG = '--publish';
const DAILY_USE_GEAR_CATEGORY = GUIDE_CATEGORIES[5];
const DAILY_USE_GEAR_TOPIC_CLUSTER = `${ACADEMY_TOPIC_CLUSTER_TOKEN} · Gear · Daily Use Gear`;
const DAILY_USE_GEAR_PARENT_PATH = '/academy/gear/daily-use-gear';
const DAILY_USE_GEAR_PARENT_SLUG = 'academy-gear-daily-use-gear';
const DAILY_USE_GEAR_SUBMODULE_SLUGS: DailyUseGearAcademySubmoduleSlug[] = [
  'carrier',
  'highchair',
  'baby-bath',
  'pack-and-play',
  'swing-bouncer',
  'daily-support-gear',
];

function truncateAtWordBoundary(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  const truncated = value.slice(0, maxLength + 1);
  const boundary = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, boundary > 0 ? boundary : maxLength).trim()}.`;
}

function buildGuideSlug(slug: DailyUseGearAcademySubmoduleSlug) {
  return `academy-gear-daily-use-gear-${slug}`;
}

function buildSeoTitle(title: string) {
  return `${title} | Daily Use Gear | TMBC Baby Academy`;
}

function buildTargetKeyword(title: string) {
  return `${title.toLowerCase()} baby gear`;
}

function buildModuleContent(slug: DailyUseGearAcademySubmoduleSlug) {
  const module = buildDailyUseGearAcademySubmoduleModule(slug);
  const navigation = getDailyUseGearAcademySubmoduleNavigation(slug);

  const moduleIntro = [
    `## Module ${module.progress.current} of ${module.progress.total} · Daily Use Gear`,
    ...module.intro,
  ].join('\n\n');

  const coreConsiderations = [
    '## Core Considerations',
    ...module.coreSections.map((section) =>
      [
        `### ${section.title}`,
        `![${section.imageAlt}](${section.imageSrc})`,
        section.imageCaption ? `*${section.imageCaption}*` : null,
        ...section.paragraphs,
      ]
        .filter(Boolean)
        .join('\n\n'),
    ),
  ].join('\n\n');

  const whatThisMeans = [
    '## What This Means For You',
    ...module.decisionBullets.map((bullet) => `- ${bullet}`),
  ].join('\n');

  const softCta = [
    `## ${module.softCtaLabel}`,
    module.softCtaTitle,
    ...module.softCtaBody,
  ].join('\n\n');

  const nextSteps = [
    '## Next Steps',
    `- Return to the Daily Use Gear hub: ${navigation.hub.href}`,
    navigation.previous ? `- Previous stop: ${navigation.previous.title} (${navigation.previous.href})` : null,
    navigation.next ? `- Continue to: ${navigation.next.title} (${navigation.next.href})` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return [moduleIntro, coreConsiderations, whatThisMeans, softCta, nextSteps].join('\n\n').trim();
}

function getStatusData({
  existing,
  publish,
}: {
  existing: { status: PostStatus; publishedAt: Date | null; archivedAt: Date | null } | null;
  publish: boolean;
}) {
  if (publish) {
    return {
      status: 'PUBLISHED' as const,
      publishedAt: existing?.publishedAt ?? new Date(),
      archivedAt: null,
    };
  }

  return {
    status: existing?.status ?? ('DRAFT' as const),
    publishedAt: existing?.publishedAt ?? null,
    archivedAt: existing?.archivedAt ?? null,
  };
}

async function getSeedAuthor() {
  return (
    (await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, name: true },
      orderBy: { createdAt: 'asc' },
    })) ??
    (await prisma.user.findFirst({
      select: { id: true, email: true, name: true },
      orderBy: { createdAt: 'asc' },
    }))
  );
}

async function findExistingGuide({
  publicPath,
  stableSlug,
}: {
  publicPath: string;
  stableSlug: string;
}) {
  return prisma.guide.findFirst({
    where: {
      OR: [
        {
          canonicalUrl: {
            endsWith: publicPath,
            mode: 'insensitive',
          },
        },
        {
          slug: stableSlug,
        },
      ],
    },
    select: {
      id: true,
      slug: true,
      status: true,
      publishedAt: true,
      archivedAt: true,
    },
  });
}

async function main() {
  const publish = process.argv.includes(PUBLISH_FLAG);
  const author = await getSeedAuthor();

  if (!author) {
    throw new Error('No users found. Create an admin user before seeding Daily Use Gear submodules.');
  }

  const parentGuide = await prisma.guide.findFirst({
    where: {
      OR: [
        {
          canonicalUrl: {
            endsWith: DAILY_USE_GEAR_PARENT_PATH,
            mode: 'insensitive',
          },
        },
        { slug: DAILY_USE_GEAR_PARENT_SLUG },
      ],
    },
    select: {
      id: true,
    },
  });

  const seededGuideIdsBySlug = new Map<DailyUseGearAcademySubmoduleSlug, string>();

  for (const slug of DAILY_USE_GEAR_SUBMODULE_SLUGS) {
    const submodule = getDailyUseGearAcademySubmodule(slug);
    const module = buildDailyUseGearAcademySubmoduleModule(slug);
    const publicPath = getDailyUseGearAcademySubmodulePath(slug);
    const stableSlug = buildGuideSlug(slug);
    const existing = await findExistingGuide({ publicPath, stableSlug });
    const statusData = getStatusData({ existing, publish });
    const navigation = getDailyUseGearAcademySubmoduleNavigation(slug);
    const nextStepHref = navigation.next?.href ?? navigation.hub.href;
    const nextStepLabel = navigation.next ? `Continue to ${navigation.next.title}` : 'Back to Daily Use Gear';
    const seoDescription = truncateAtWordBoundary(submodule.metadataDescription, 160);
    const excerpt = truncateAtWordBoundary(submodule.cardSummary, 220);

    const data = {
      title: module.title,
      slug: existing?.slug ?? stableSlug,
      excerpt,
      intro: module.intro.join('\n\n'),
      content: buildModuleContent(slug),
      conclusion: null,
      heroImageUrl: module.imagePath,
      heroImageAlt: module.imageAlt,
      authorId: author.id,
      category: DAILY_USE_GEAR_CATEGORY,
      topicCluster: DAILY_USE_GEAR_TOPIC_CLUSTER,
      status: statusData.status,
      publishedAt: statusData.publishedAt,
      scheduledFor: null,
      archivedAt: statusData.archivedAt,
      seoTitle: buildSeoTitle(module.title),
      seoDescription,
      ogTitle: buildSeoTitle(module.title),
      ogDescription: seoDescription,
      ogImageUrl: module.imagePath,
      ogImageAlt: module.imageAlt,
      canonicalUrl: publicPath,
      targetKeyword: buildTargetKeyword(module.title),
      secondaryKeywords: [] as string[],
      internalLinkNotes:
        'Seeded from lib/academy/dailyUseGearAcademy.ts. This record powers the live Daily Use Gear Academy submodule route and its editor workspace entry.',
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
      nextStepCtaLabel: nextStepLabel,
      nextStepCtaHref: nextStepHref,
      founderSignatureEnabled: false,
      founderSignatureText: null,
    };

    const saved = existing
      ? await prisma.guide.update({
          where: { id: existing.id },
          data,
          select: { id: true, title: true, status: true },
        })
      : await prisma.guide.create({
          data: {
            ...data,
            relatedGuideIds: [],
          },
          select: { id: true, title: true, status: true },
        });

    seededGuideIdsBySlug.set(slug, saved.id);
    console.log(`${existing ? 'Updated' : 'Created'} Daily Use Gear submodule: ${saved.title} [${saved.status}]`);
  }

  for (const slug of DAILY_USE_GEAR_SUBMODULE_SLUGS) {
    const navigation = getDailyUseGearAcademySubmoduleNavigation(slug);
    const guideId = seededGuideIdsBySlug.get(slug);

    if (!guideId) {
      continue;
    }

    const relatedGuideIds = [
      parentGuide?.id ?? null,
      navigation.previous && DAILY_USE_GEAR_SUBMODULE_SLUGS.includes(navigation.previous.href.split('/').filter(Boolean).at(-1) as DailyUseGearAcademySubmoduleSlug)
        ? seededGuideIdsBySlug.get(navigation.previous.href.split('/').filter(Boolean).at(-1) as DailyUseGearAcademySubmoduleSlug) ?? null
        : null,
      navigation.next && DAILY_USE_GEAR_SUBMODULE_SLUGS.includes(navigation.next.href.split('/').filter(Boolean).at(-1) as DailyUseGearAcademySubmoduleSlug)
        ? seededGuideIdsBySlug.get(navigation.next.href.split('/').filter(Boolean).at(-1) as DailyUseGearAcademySubmoduleSlug) ?? null
        : null,
    ].filter((id): id is string => Boolean(id));

    await prisma.guide.update({
      where: { id: guideId },
      data: {
        relatedGuideIds,
      },
    });
  }

  console.log('');
  console.log(
    `Seeded ${DAILY_USE_GEAR_SUBMODULE_SLUGS.length} Daily Use Gear submodules as ${publish ? 'published' : 'draft'} content.`,
  );
  console.log(`Author: ${author.name?.trim() || author.email}`);
}

main()
  .catch((error) => {
    console.error('Failed to seed Daily Use Gear submodules:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
