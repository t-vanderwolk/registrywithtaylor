import fs from 'node:fs/promises';
import path from 'node:path';
import type { PostStatus, Prisma } from '@prisma/client';
import { extractFaqEntries, extractLeadParagraphs, stripMarkdown } from '@/lib/blog/contentText';
import { GUIDE_CATEGORIES, type GuideCategory } from '@/lib/guides/categories';
import { getGuidePath } from '@/lib/guides/routing';
import { getGuidePillar } from '@/lib/marketing/siteContent';
import prisma from '@/lib/server/prisma';

type GuideSeedDefinition = {
  fileName: string;
  slug: string;
  category: GuideCategory;
  targetKeyword: string;
  secondaryKeywords: string[];
};

const GUIDE_TOPIC_CLUSTER = 'TMBC Learning Library';
const CONTENT_DIR = path.join(process.cwd(), 'content', 'guides');
const PUBLISH_FLAG = '--publish';

const guideSeeds: GuideSeedDefinition[] = [
  {
    fileName: 'taylor-made-stroller-guide.md',
    slug: 'best-strollers',
    category: GUIDE_CATEGORIES[0],
    targetKeyword: 'best strollers',
    secondaryKeywords: ['travel stroller', 'full-size stroller', 'modular stroller', 'best stroller for newborn'],
  },
  {
    fileName: 'taylor-made-car-seat-guide.md',
    slug: 'best-infant-car-seats',
    category: GUIDE_CATEGORIES[1],
    targetKeyword: 'best infant car seats',
    secondaryKeywords: ['infant car seat', 'convertible car seat', 'car seat compatibility', 'newborn car seat'],
  },
  {
    fileName: 'taylor-made-baby-registry-guide.md',
    slug: 'minimalist-baby-registry',
    category: GUIDE_CATEGORIES[2],
    targetKeyword: 'baby registry guide',
    secondaryKeywords: ['minimalist baby registry', 'how to build a baby registry', 'baby registry checklist', 'registry planning'],
  },
  {
    fileName: 'taylor-made-nursery-guide.md',
    slug: 'nursery-setup-guide',
    category: GUIDE_CATEGORIES[3],
    targetKeyword: 'nursery planning guide',
    secondaryKeywords: ['nursery setup', 'baby nursery layout', 'small nursery ideas', 'nursery planning'],
  },
  {
    fileName: 'taylor-made-travel-with-baby-guide.md',
    slug: 'travel-with-baby',
    category: GUIDE_CATEGORIES[4],
    targetKeyword: 'travel with baby',
    secondaryKeywords: ['travel stroller', 'flying with baby', 'road trip with baby', 'baby travel checklist'],
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
    throw new Error('Missing top-level H1 title in guide markdown.');
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

async function readGuideSeed(definition: GuideSeedDefinition) {
  const filePath = path.join(CONTENT_DIR, definition.fileName);
  const pillar = getGuidePillar(definition.slug);

  if (!pillar) {
    throw new Error(`No marketing guide pillar found for slug "${definition.slug}".`);
  }

  const rawContent = await fs.readFile(filePath, 'utf8');
  const { title, body } = extractTitleAndBody(rawContent);
  const cleanedBody = stripPlaceholderProductLinks(body);
  const fallbackExcerpt = pillar.description;
  const excerpt = buildExcerpt(cleanedBody, fallbackExcerpt);
  const seoDescription = buildSeoDescription(cleanedBody, pillar.seoDescription);
  const faqItems = extractFaqEntries(cleanedBody);

  return {
    ...definition,
    title,
    content: cleanedBody,
    excerpt,
    seoDescription,
    faqItems,
    heroImageUrl: pillar.imageSrc,
    heroImageAlt: pillar.imageAlt,
    ogImageUrl: pillar.imageSrc,
    ogImageAlt: pillar.imageAlt,
    canonicalUrl: getGuidePath({ slug: definition.slug }),
    internalLinkNotes:
      'Seeded from content/guides. Review internal blog link placeholders and add real product destination URLs before merchandising updates.',
    relatedSlugs: pillar.relatedSlugs.filter((slug) => guideSeeds.some((entry) => entry.slug === slug)),
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
    throw new Error('No users found. Create an admin user before seeding pillar guides.');
  }

  const guides = await Promise.all(guideSeeds.map((definition) => readGuideSeed(definition)));
  const seededGuideIdsBySlug = new Map<string, string>();

  for (const guide of guides) {
    const existing = await prisma.guide.findUnique({
      where: { slug: guide.slug },
      select: { id: true, status: true, publishedAt: true, archivedAt: true, views: true },
    });

    const statusData = getStatusData({ existing, publish });
    const data = {
      title: guide.title,
      slug: guide.slug,
      excerpt: guide.excerpt,
      intro: null,
      content: guide.content,
      conclusion: null,
      heroImageUrl: guide.heroImageUrl,
      heroImageAlt: guide.heroImageAlt,
      authorId: author.id,
      category: guide.category,
      topicCluster: GUIDE_TOPIC_CLUSTER,
      status: statusData.status,
      publishedAt: statusData.publishedAt,
      scheduledFor: null,
      archivedAt: statusData.archivedAt,
      seoTitle: guide.title,
      seoDescription: guide.seoDescription,
      ogTitle: guide.title,
      ogDescription: guide.seoDescription,
      ogImageUrl: guide.ogImageUrl,
      ogImageAlt: guide.ogImageAlt,
      canonicalUrl: guide.canonicalUrl,
      targetKeyword: guide.targetKeyword,
      secondaryKeywords: guide.secondaryKeywords,
      internalLinkNotes: guide.internalLinkNotes,
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
      nextStepCtaLabel: 'Explore More Guides',
      nextStepCtaHref: '/guides',
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
    console.log(`${existing ? 'Updated' : 'Created'} guide: ${saved.title} (${saved.slug}) [${saved.status}]`);
  }

  for (const guide of guides) {
    const guideId = seededGuideIdsBySlug.get(guide.slug);
    if (!guideId) {
      continue;
    }

    const relatedGuideIds = guide.relatedSlugs
      .map((slug) => seededGuideIdsBySlug.get(slug))
      .filter((id): id is string => Boolean(id));

    await prisma.guide.update({
      where: { id: guideId },
      data: {
        relatedGuideIds,
      },
    });
  }

  console.log('');
  console.log(`Seeded ${guides.length} pillar guides as ${publish ? 'published' : 'draft'} content.`);
  console.log(`Author: ${author.name?.trim() || author.email}`);
  console.log('Placeholder example.com product links were stripped during import to avoid broken outbound CTAs.');
}

main()
  .catch((error) => {
    console.error('Failed to seed pillar guides:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
