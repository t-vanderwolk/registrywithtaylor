import fs from 'node:fs/promises';
import path from 'node:path';
import type { PostStatus, Prisma } from '@prisma/client';
import { extractFaqEntries, extractLeadParagraphs, stripMarkdown } from '@/lib/blog/contentText';
import { GUIDE_CATEGORIES } from '@/lib/guides/categories';
import prisma from '@/lib/server/prisma';

type StrollerGuideSeed = {
  fileName: string;
  slug: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  heroImageAlt: string;
  relatedSlugs: string[];
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'guides');
const GUIDE_TOPIC_CLUSTER = 'TMBC Learning Library: Strollers';
const PUBLISH_FLAG = '--publish';
const STROLLER_CATEGORY = GUIDE_CATEGORIES[0];
const STROLLER_GUIDE_IMAGE = '/assets/editorial/gear.jpg';

const strollerGuideSeeds: StrollerGuideSeed[] = [
  {
    fileName: 'taylor-made-full-size-modular-stroller-guide.md',
    slug: 'full-size-modular-strollers',
    targetKeyword: 'full-size modular stroller',
    secondaryKeywords: ['full-size stroller', 'modular stroller', 'everyday stroller', 'single stroller'],
    heroImageAlt: 'Full-size stroller editorial image for TMBC stroller guide',
    relatedSlugs: ['best-strollers', 'compact-lightweight-strollers', 'double-strollers'],
  },
  {
    fileName: 'taylor-made-compact-lightweight-stroller-guide.md',
    slug: 'compact-lightweight-strollers',
    targetKeyword: 'compact lightweight stroller',
    secondaryKeywords: ['lightweight stroller', 'compact stroller', 'everyday compact stroller', 'small fold stroller'],
    heroImageAlt: 'Compact stroller editorial image for TMBC stroller guide',
    relatedSlugs: ['best-strollers', 'travel-strollers', 'full-size-modular-strollers'],
  },
  {
    fileName: 'taylor-made-travel-stroller-guide.md',
    slug: 'travel-strollers',
    targetKeyword: 'travel stroller',
    secondaryKeywords: ['best travel stroller', 'airplane stroller', 'carry-on stroller', 'compact travel stroller'],
    heroImageAlt: 'Travel stroller editorial image for TMBC stroller guide',
    relatedSlugs: ['best-strollers', 'compact-lightweight-strollers', 'travel-with-baby'],
  },
  {
    fileName: 'taylor-made-jogging-all-terrain-stroller-guide.md',
    slug: 'jogging-all-terrain-strollers',
    targetKeyword: 'jogging stroller',
    secondaryKeywords: ['all-terrain stroller', 'running stroller', 'stroller for rough terrain', 'outdoor stroller'],
    heroImageAlt: 'Jogging stroller editorial image for TMBC stroller guide',
    relatedSlugs: ['best-strollers', 'full-size-modular-strollers', 'double-strollers'],
  },
  {
    fileName: 'taylor-made-double-stroller-guide.md',
    slug: 'double-strollers',
    targetKeyword: 'double stroller',
    secondaryKeywords: ['single to double stroller', 'side by side double stroller', 'tandem stroller', 'sibling stroller'],
    heroImageAlt: 'Double stroller editorial image for TMBC stroller guide',
    relatedSlugs: ['best-strollers', 'full-size-modular-strollers', 'jogging-all-terrain-strollers'],
  },
];

function truncateAtWordBoundary(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  const truncated = value.slice(0, maxLength + 1);
  const boundary = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, boundary > 0 ? boundary : maxLength).trim()}.`;
}

function extractTitleAndBody(rawContent: string) {
  const normalized = rawContent.replace(/\r\n/g, '\n').trim();
  const titleMatch = normalized.match(/^#\s+(.+)$/m);

  if (!titleMatch) {
    throw new Error('Missing top-level H1 title in stroller guide markdown.');
  }

  const title = titleMatch[1].trim();
  const body = normalized.replace(/^#\s+.+\n+/, '').trim();

  return { title, body };
}

function stripPlaceholderProductLinks(content: string) {
  return content
    .replace(/^Link:\s+.*https?:\/\/example\.com[^\n]*\n?/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function buildExcerpt(content: string) {
  const lead = extractLeadParagraphs(content, 2)
    .map((paragraph) => stripMarkdown(paragraph))
    .filter(Boolean)
    .join(' ');

  return truncateAtWordBoundary(lead, 220);
}

function buildSeoDescription(content: string) {
  const lead = extractLeadParagraphs(content, 2)
    .map((paragraph) => stripMarkdown(paragraph))
    .filter(Boolean)
    .join(' ');

  return truncateAtWordBoundary(lead, 160);
}

async function readGuide(definition: StrollerGuideSeed) {
  const rawContent = await fs.readFile(path.join(CONTENT_DIR, definition.fileName), 'utf8');
  const { title, body } = extractTitleAndBody(rawContent);
  const cleanedBody = stripPlaceholderProductLinks(body);

  return {
    ...definition,
    title,
    content: cleanedBody,
    excerpt: buildExcerpt(cleanedBody),
    seoDescription: buildSeoDescription(cleanedBody),
    faqItems: extractFaqEntries(cleanedBody),
  };
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
    throw new Error('No users found. Create an admin user before seeding stroller category guides.');
  }

  const guides = await Promise.all(strollerGuideSeeds.map((definition) => readGuide(definition)));
  const seededGuideIdsBySlug = new Map<string, string>();

  for (const guide of guides) {
    const existing = await prisma.guide.findUnique({
      where: { slug: guide.slug },
      select: { id: true, status: true, publishedAt: true, archivedAt: true },
    });

    const statusData = getStatusData({ existing, publish });
    const data = {
      title: guide.title,
      slug: guide.slug,
      excerpt: guide.excerpt,
      intro: null,
      content: guide.content,
      conclusion: null,
      heroImageUrl: STROLLER_GUIDE_IMAGE,
      heroImageAlt: guide.heroImageAlt,
      authorId: author.id,
      category: STROLLER_CATEGORY,
      topicCluster: GUIDE_TOPIC_CLUSTER,
      status: statusData.status,
      publishedAt: statusData.publishedAt,
      scheduledFor: null,
      archivedAt: statusData.archivedAt,
      seoTitle: guide.title,
      seoDescription: guide.seoDescription,
      ogTitle: guide.title,
      ogDescription: guide.seoDescription,
      ogImageUrl: STROLLER_GUIDE_IMAGE,
      ogImageAlt: guide.heroImageAlt,
      canonicalUrl: `/guides/${guide.slug}`,
      targetKeyword: guide.targetKeyword,
      secondaryKeywords: guide.secondaryKeywords,
      internalLinkNotes:
        'Seeded from content/guides. Review internal comparison placeholders and add live retailer destination URLs when merchandising is ready.',
      tableOfContentsEnabled: true,
      faqItems: guide.faqItems as Prisma.InputJsonValue,
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
      nextStepCtaLabel: 'Read the Main Stroller Guide',
      nextStepCtaHref: '/guides/best-strollers',
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

    seededGuideIdsBySlug.set(saved.slug, saved.id);
    console.log(`${existing ? 'Updated' : 'Created'} stroller guide: ${saved.title} (${saved.slug}) [${saved.status}]`);
  }

  const bestStrollersGuide = await prisma.guide.findUnique({
    where: { slug: 'best-strollers' },
    select: { id: true, relatedGuideIds: true },
  });

  for (const guide of guides) {
    const guideId = seededGuideIdsBySlug.get(guide.slug);
    if (!guideId) {
      continue;
    }

    const relatedGuideIds = guide.relatedSlugs
      .map((slug) => seededGuideIdsBySlug.get(slug) ?? (slug === 'best-strollers' ? bestStrollersGuide?.id ?? null : null))
      .filter((id): id is string => Boolean(id));

    await prisma.guide.update({
      where: { id: guideId },
      data: {
        relatedGuideIds,
      },
    });
  }

  if (bestStrollersGuide) {
    await prisma.guide.update({
      where: { id: bestStrollersGuide.id },
      data: {
        relatedGuideIds: guides
          .map((guide) => seededGuideIdsBySlug.get(guide.slug))
          .filter((id): id is string => Boolean(id)),
      },
    });
  }

  console.log('');
  console.log(`Seeded ${guides.length} stroller category guides as ${publish ? 'published' : 'draft'} content.`);
  console.log(`Author: ${author.name?.trim() || author.email}`);
  console.log('Placeholder example.com product links were stripped during import to avoid broken outbound CTAs.');
}

main()
  .catch((error) => {
    console.error('Failed to seed stroller category guides:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
