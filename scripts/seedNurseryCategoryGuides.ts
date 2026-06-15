import fs from 'node:fs/promises';
import path from 'node:path';
import type { PostStatus, Prisma } from '@prisma/client';
import { extractFaqEntries, extractLeadParagraphs, stripMarkdown } from '@/lib/blog/contentText';
import { GUIDE_CATEGORIES } from '@/lib/guides/categories';
import {
  NURSERY_GUIDE_PARENT_SLUG,
  NURSERY_GUIDE_TOPIC_CLUSTER,
  NURSERY_SUBGUIDE_DEFINITIONS,
  type NurserySubGuideDefinition,
} from '@/lib/guides/nurserySubguides';
import { getGuidePath } from '@/lib/guides/routing';
import prisma from '@/lib/server/prisma';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'guides');
const PUBLISH_FLAG = '--publish';
const NURSERY_CATEGORY = GUIDE_CATEGORIES[3];
const NURSERY_GUIDE_IMAGE = '/assets/editorial/nursery.jpg';

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
    throw new Error('Missing top-level H1 title in nursery guide markdown.');
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

async function readGuide(definition: NurserySubGuideDefinition) {
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
    throw new Error('No users found. Create an admin user before seeding nursery category guides.');
  }

  const guides = await Promise.all(NURSERY_SUBGUIDE_DEFINITIONS.map((definition) => readGuide(definition)));
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
      heroImageUrl: NURSERY_GUIDE_IMAGE,
      heroImageAlt: guide.heroImageAlt,
      authorId: author.id,
      category: NURSERY_CATEGORY,
      topicCluster: NURSERY_GUIDE_TOPIC_CLUSTER,
      status: statusData.status,
      publishedAt: statusData.publishedAt,
      scheduledFor: null,
      archivedAt: statusData.archivedAt,
      seoTitle: guide.title,
      seoDescription: guide.seoDescription,
      ogTitle: guide.title,
      ogDescription: guide.seoDescription,
      ogImageUrl: NURSERY_GUIDE_IMAGE,
      ogImageAlt: guide.heroImageAlt,
      canonicalUrl: getGuidePath({ slug: guide.slug, topicCluster: NURSERY_GUIDE_TOPIC_CLUSTER }),
      targetKeyword: guide.targetKeyword,
      secondaryKeywords: [...guide.secondaryKeywords],
      internalLinkNotes:
        'Seeded from content/guides. Review internal guide links and add live affiliate modules later if nursery product examples become necessary.',
      tableOfContentsEnabled: true,
      faqItems: guide.faqItems as Prisma.InputJsonValue,
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
      nextStepCtaLabel: 'Read the Nursery Guide',
      nextStepCtaHref: getGuidePath({ slug: NURSERY_GUIDE_PARENT_SLUG }),
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
    console.log(`${existing ? 'Updated' : 'Created'} nursery guide: ${saved.title} (${saved.slug}) [${saved.status}]`);
  }

  const relatedSlugs = Array.from(
    new Set([NURSERY_GUIDE_PARENT_SLUG, ...guides.flatMap((guide) => guide.relatedSlugs)]),
  );

  const relatedGuideRecords = await prisma.guide.findMany({
    where: {
      slug: {
        in: relatedSlugs,
      },
    },
    select: {
      id: true,
      slug: true,
    },
  });

  const guideIdBySlug = new Map<string, string>(relatedGuideRecords.map((guide) => [guide.slug, guide.id]));
  for (const [slug, id] of seededGuideIdsBySlug) {
    guideIdBySlug.set(slug, id);
  }

  for (const guide of guides) {
    const guideId = seededGuideIdsBySlug.get(guide.slug);
    if (!guideId) {
      continue;
    }

    const relatedGuideIds = guide.relatedSlugs
      .map((slug) => guideIdBySlug.get(slug))
      .filter((id): id is string => Boolean(id));

    await prisma.guide.update({
      where: { id: guideId },
      data: {
        relatedGuideIds,
      },
    });
  }

  const parentGuideId = guideIdBySlug.get(NURSERY_GUIDE_PARENT_SLUG);
  if (parentGuideId) {
    await prisma.guide.update({
      where: { id: parentGuideId },
      data: {
        relatedGuideIds: guides
          .map((guide) => seededGuideIdsBySlug.get(guide.slug))
          .filter((id): id is string => Boolean(id)),
      },
    });
  }

  console.log('');
  console.log(`Seeded ${guides.length} nursery category guides as ${publish ? 'published' : 'draft'} content.`);
  console.log(`Author: ${author.name?.trim() || author.email}`);
}

main()
  .catch((error) => {
    console.error('Failed to seed nursery category guides:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
