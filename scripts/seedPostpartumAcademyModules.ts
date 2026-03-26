import type { PostStatus, Prisma } from '@prisma/client';
import { extractLeadParagraphs, stripMarkdown } from '@/lib/blog/contentText';
import { POSTPARTUM_ACADEMY_MODULES } from '@/lib/academy/postpartumModules';
import { GUIDE_CATEGORIES } from '@/lib/guides/categories';
import prisma from '@/lib/server/prisma';

const PUBLISH_FLAG = '--publish';
const POSTPARTUM_CATEGORY = GUIDE_CATEGORIES[6];
const POSTPARTUM_ACADEMY_TOPIC_CLUSTER = 'TMBC Baby Academy: Postpartum Modules';
const RETIRED_POSTPARTUM_ACADEMY_LOOKUPS: Prisma.GuideWhereInput[] = [
  { slug: 'recovery-and-support' },
  { slug: 'feeding-and-home-rhythm' },
  { slug: 'first-weeks-essentials' },
  { slug: 'academy-postpartum-recovery-and-support' },
  { slug: 'academy-postpartum-feeding-and-home-rhythm' },
  { slug: 'academy-postpartum-first-weeks-essentials' },
  { canonicalUrl: '/academy/postpartum/recovery-and-support' },
  { canonicalUrl: '/academy/postpartum/feeding-and-home-rhythm' },
  { canonicalUrl: '/academy/postpartum/first-weeks-essentials' },
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
  return `academy-postpartum-${moduleSlug}`;
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
    throw new Error('No users found. Create an admin user before seeding postpartum academy modules.');
  }

  const seededGuideIdsBySlug = new Map<string, string>();

  for (const module of POSTPARTUM_ACADEMY_MODULES) {
    const canonicalUrl = `/academy/postpartum/${module.slug}`;
    const guideSlug = getGuideSlug(module.slug);
    const existing = await prisma.guide.findFirst({
      where: {
        topicCluster: {
          contains: POSTPARTUM_ACADEMY_TOPIC_CLUSTER,
          mode: 'insensitive',
        },
        OR: [{ slug: guideSlug }, { canonicalUrl }],
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
      ? POSTPARTUM_ACADEMY_MODULES.find((candidate) => candidate.slug === module.nextModuleSlug) ?? null
      : null;

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
      category: POSTPARTUM_CATEGORY,
      topicCluster: POSTPARTUM_ACADEMY_TOPIC_CLUSTER,
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
      targetKeyword: `${module.title.toLowerCase()} postpartum`,
      secondaryKeywords: ['postpartum planning', 'academy postpartum module', module.slug.replace(/-/g, ' ')],
      internalLinkNotes:
        'Seeded from lib/academy/postpartumModules.ts. Keep draft unless academy module records are intentionally being surfaced through another guide workflow.',
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
      nextStepCtaLabel: nextModule ? `Next Module: ${nextModule.title}` : 'Continue to Academy Home',
      nextStepCtaHref: nextModule ? `/academy/postpartum/${nextModule.slug}` : '/academy',
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
      `${existing ? 'Updated' : 'Created'} postpartum academy module: ${saved.title} (${guideSlug} -> ${canonicalUrl}) [${saved.status}]`,
    );
  }

  for (const module of POSTPARTUM_ACADEMY_MODULES) {
    const guideId = seededGuideIdsBySlug.get(module.slug);
    if (!guideId) {
      continue;
    }

    const relatedGuideIds = [
      module.previousModuleSlug ? seededGuideIdsBySlug.get(module.previousModuleSlug) ?? null : null,
      module.nextModuleSlug ? seededGuideIdsBySlug.get(module.nextModuleSlug) ?? null : null,
    ].filter((id): id is string => Boolean(id));

    await prisma.guide.update({
      where: { id: guideId },
      data: {
        relatedGuideIds,
      },
    });
  }

  const retiredGuides = await prisma.guide.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              topicCluster: {
                contains: POSTPARTUM_ACADEMY_TOPIC_CLUSTER,
                mode: 'insensitive',
              },
            },
            {
              canonicalUrl: {
                contains: '/academy/postpartum/',
                mode: 'insensitive',
              },
            },
          ],
        },
        {
          OR: RETIRED_POSTPARTUM_ACADEMY_LOOKUPS,
        },
      ],
    },
    select: {
      id: true,
      title: true,
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

    console.log(`Archived retired postpartum academy module: ${retiredGuide.title}`);
  }

  console.log('');
  console.log(`Seeded ${POSTPARTUM_ACADEMY_MODULES.length} postpartum academy modules as ${publish ? 'published' : 'draft'} content.`);
  console.log(`Author: ${author.name?.trim() || author.email}`);
  console.log('These records mirror the academy postpartum path and keep the module copy editable in the guide system without changing the public academy routes.');
}

main()
  .catch((error) => {
    console.error('Failed to seed postpartum academy modules:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
