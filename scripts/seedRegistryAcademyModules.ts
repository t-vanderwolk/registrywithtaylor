import type { PostStatus, Prisma } from '@prisma/client';
import { extractLeadParagraphs, stripMarkdown } from '@/lib/blog/contentText';
import { REGISTRY_ACADEMY_MODULES } from '@/lib/academy/registryModules';
import { GUIDE_CATEGORIES } from '@/lib/guides/categories';
import prisma from '@/lib/server/prisma';

const PUBLISH_FLAG = '--publish';
const REGISTRY_CATEGORY = GUIDE_CATEGORIES[2];
const REGISTRY_ACADEMY_TOPIC_CLUSTER = 'TMBC Baby Academy: Registry Modules';

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
  return `academy-registry-${moduleSlug}`;
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
    throw new Error('No users found. Create an admin user before seeding registry academy modules.');
  }

  const seededGuideIdsBySlug = new Map<string, string>();

  for (const module of REGISTRY_ACADEMY_MODULES) {
    const canonicalUrl = `/academy/registry/${module.slug}`;
    const guideSlug = getGuideSlug(module.slug);
    const existing = await prisma.guide.findFirst({
      where: {
        topicCluster: {
          contains: REGISTRY_ACADEMY_TOPIC_CLUSTER,
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
      ? REGISTRY_ACADEMY_MODULES.find((candidate) => candidate.slug === module.nextModuleSlug) ?? null
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
      category: REGISTRY_CATEGORY,
      topicCluster: REGISTRY_ACADEMY_TOPIC_CLUSTER,
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
      targetKeyword: `${module.title.toLowerCase()} registry`,
      secondaryKeywords: ['registry planning', 'academy registry module', module.slug.replace(/-/g, ' ')],
      internalLinkNotes:
        'Seeded from lib/academy/registryModules.ts. Keep draft unless academy module records are intentionally being surfaced through another guide workflow.',
      tableOfContentsEnabled: true,
      faqItems: [] as Prisma.InputJsonValue,
      affiliateDisclosureEnabled: false,
      affiliateDisclosureText: null,
      affiliateDisclosurePlacement: 'before_affiliates',
      affiliateModules: [] as Prisma.InputJsonValue,
      consultationCtaEnabled: true,
      consultationCtaLabel: 'Book a Free Consultation',
      newsletterCtaEnabled: false,
      newsletterCtaLabel: null,
      newsletterCtaDescription: null,
      newsletterCtaHref: null,
      nextStepCtaLabel: nextModule ? `Next Module: ${nextModule.title}` : 'Continue to Gear Path',
      nextStepCtaHref: nextModule ? `/academy/registry/${nextModule.slug}` : '/academy/gear',
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
      `${existing ? 'Updated' : 'Created'} registry academy module: ${saved.title} (${guideSlug} -> ${canonicalUrl}) [${saved.status}]`,
    );
  }

  const strollerFoundationsGuide = await prisma.guide.findFirst({
    where: {
      OR: [
        { canonicalUrl: '/academy/gear/stroller-foundations' },
        { slug: 'academy-gear-stroller-foundations' },
        { slug: 'stroller-foundations' },
      ],
    },
    select: { id: true },
  });

  for (const module of REGISTRY_ACADEMY_MODULES) {
    const guideId = seededGuideIdsBySlug.get(module.slug);
    if (!guideId) {
      continue;
    }

    const relatedGuideIds = [
      module.previousModuleSlug ? seededGuideIdsBySlug.get(module.previousModuleSlug) ?? null : null,
      module.nextModuleSlug ? seededGuideIdsBySlug.get(module.nextModuleSlug) ?? null : null,
      module.slug === 'baby-showers-gifting' ? strollerFoundationsGuide?.id ?? null : null,
    ].filter((id): id is string => Boolean(id));

    await prisma.guide.update({
      where: { id: guideId },
      data: {
        relatedGuideIds,
      },
    });
  }

  console.log('');
  console.log(`Seeded ${REGISTRY_ACADEMY_MODULES.length} registry academy modules as ${publish ? 'published' : 'draft'} content.`);
  console.log(`Author: ${author.name?.trim() || author.email}`);
  console.log('These records mirror the academy registry path and keep the module copy editable in the guide system without changing the public academy routes.');
}

main()
  .catch((error) => {
    console.error('Failed to seed registry academy modules:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
