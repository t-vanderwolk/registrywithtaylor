import fs from 'node:fs/promises';
import path from 'node:path';
import type { PostStatus, Prisma } from '@prisma/client';
import { extractFaqEntries, extractLeadParagraphs, stripMarkdown } from '@/lib/blog/contentText';
import { GUIDE_CATEGORIES } from '@/lib/guides/categories';
import { getGuidePath } from '@/lib/guides/routing';
import prisma from '@/lib/server/prisma';

type CarSeatGuideSeed = {
  fileName: string;
  slug: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  heroImageAlt: string;
  relatedSlugs: string[];
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'guides');
const GUIDE_TOPIC_CLUSTER = 'TMBC Learning Library: Car Seats';
const PUBLISH_FLAG = '--publish';
const CAR_SEAT_CATEGORY = GUIDE_CATEGORIES[1];
const CAR_SEAT_GUIDE_IMAGE = '/assets/editorial/gear.jpg';

const carSeatGuideSeeds: CarSeatGuideSeed[] = [
  {
    fileName: 'taylor-made-infant-car-seat-guide.md',
    slug: 'infant-car-seats',
    targetKeyword: 'infant car seat',
    secondaryKeywords: ['best infant car seat', 'newborn car seat', 'infant seat vs convertible', 'portable infant car seat'],
    heroImageAlt: 'Infant car seat editorial image for TMBC car seat guide',
    relatedSlugs: ['best-infant-car-seats', 'convertible-car-seats', 'travel-lightweight-car-seats', 'rotating-car-seats'],
  },
  {
    fileName: 'taylor-made-convertible-car-seat-guide.md',
    slug: 'convertible-car-seats',
    targetKeyword: 'convertible car seat',
    secondaryKeywords: ['best convertible car seat', 'convertible vs infant car seat', 'convertible car seat from birth', 'rear facing convertible seat'],
    heroImageAlt: 'Convertible car seat editorial image for TMBC car seat guide',
    relatedSlugs: ['best-infant-car-seats', 'infant-car-seats', 'all-in-one-car-seats', 'rotating-car-seats'],
  },
  {
    fileName: 'taylor-made-all-in-one-car-seat-guide.md',
    slug: 'all-in-one-car-seats',
    targetKeyword: 'all in one car seat',
    secondaryKeywords: ['best all in one car seat', 'all in one vs convertible car seat', 'multi stage car seat', 'long term car seat'],
    heroImageAlt: 'All-in-one car seat editorial image for TMBC car seat guide',
    relatedSlugs: ['best-infant-car-seats', 'convertible-car-seats', 'booster-seats', 'rotating-car-seats'],
  },
  {
    fileName: 'taylor-made-booster-seat-guide.md',
    slug: 'booster-seats',
    targetKeyword: 'booster seat',
    secondaryKeywords: ['best booster seat', 'high back booster seat', 'backless booster seat', 'booster seat stage'],
    heroImageAlt: 'Booster seat editorial image for TMBC car seat guide',
    relatedSlugs: ['best-infant-car-seats', 'all-in-one-car-seats', 'convertible-car-seats'],
  },
  {
    fileName: 'taylor-made-rotating-car-seat-guide.md',
    slug: 'rotating-car-seats',
    targetKeyword: 'rotating car seat',
    secondaryKeywords: ['swivel car seat', '360 car seat', 'rotating infant car seat', 'rotating convertible car seat', 'rotating all-in-one car seat'],
    heroImageAlt: 'Rotating car seat editorial image for TMBC car seat guide',
    relatedSlugs: ['best-infant-car-seats', 'infant-car-seats', 'convertible-car-seats', 'all-in-one-car-seats', 'travel-lightweight-car-seats'],
  },
  {
    fileName: 'taylor-made-travel-lightweight-car-seat-guide.md',
    slug: 'travel-lightweight-car-seats',
    targetKeyword: 'travel lightweight car seat',
    secondaryKeywords: ['travel car seat', 'lightweight car seat', 'portable car seat', 'car seat for travel'],
    heroImageAlt: 'Travel and lightweight car seat editorial image for TMBC car seat guide',
    relatedSlugs: ['best-infant-car-seats', 'infant-car-seats', 'rotating-car-seats', 'travel-with-baby'],
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
    throw new Error('Missing top-level H1 title in car seat guide markdown.');
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

async function readGuide(definition: CarSeatGuideSeed) {
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
    throw new Error('No users found. Create an admin user before seeding car seat category guides.');
  }

  const guides = await Promise.all(carSeatGuideSeeds.map((definition) => readGuide(definition)));
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
      heroImageUrl: CAR_SEAT_GUIDE_IMAGE,
      heroImageAlt: guide.heroImageAlt,
      authorId: author.id,
      category: CAR_SEAT_CATEGORY,
      topicCluster: GUIDE_TOPIC_CLUSTER,
      status: statusData.status,
      publishedAt: statusData.publishedAt,
      scheduledFor: null,
      archivedAt: statusData.archivedAt,
      seoTitle: guide.title,
      seoDescription: guide.seoDescription,
      ogTitle: guide.title,
      ogDescription: guide.seoDescription,
      ogImageUrl: CAR_SEAT_GUIDE_IMAGE,
      ogImageAlt: guide.heroImageAlt,
      canonicalUrl: getGuidePath({ slug: guide.slug, topicCluster: GUIDE_TOPIC_CLUSTER }),
      targetKeyword: guide.targetKeyword,
      secondaryKeywords: guide.secondaryKeywords,
      internalLinkNotes:
        'Seeded from content/guides. These records also act as the Car Seat Foundations sub modules inside TMBC Baby Academy. Review internal comparison placeholders and add live retailer destination URLs when merchandising is ready.',
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
      nextStepCtaLabel: 'Back to Car Seat Foundations',
      nextStepCtaHref: '/academy/gear/car-seat-foundations',
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
    console.log(`${existing ? 'Updated' : 'Created'} car seat guide: ${saved.title} (${saved.slug}) [${saved.status}]`);
  }

  const bestCarSeatGuide = await prisma.guide.findUnique({
    where: { slug: 'best-infant-car-seats' },
    select: { id: true, relatedGuideIds: true },
  });
  const academyCarSeatFoundationsGuide = await prisma.guide.findFirst({
    where: {
      OR: [
        { canonicalUrl: '/academy/gear/car-seat-foundations' },
        { slug: 'academy-gear-car-seat-foundations' },
        { slug: 'car-seat-foundations' },
        { slug: 'car-seat-basics' },
      ],
    },
    select: { id: true },
  });

  const travelWithBabyGuide = await prisma.guide.findUnique({
    where: { slug: 'travel-with-baby' },
    select: { id: true },
  });

  for (const guide of guides) {
    const guideId = seededGuideIdsBySlug.get(guide.slug);
    if (!guideId) {
      continue;
    }

    const relatedGuideIds = Array.from(
      new Set(
        [
          ...guide.relatedSlugs.map((slug) => {
            if (slug === 'best-infant-car-seats') {
              return bestCarSeatGuide?.id ?? null;
            }

            if (slug === 'travel-with-baby') {
              return travelWithBabyGuide?.id ?? null;
            }

            return seededGuideIdsBySlug.get(slug) ?? null;
          }),
          academyCarSeatFoundationsGuide?.id ?? null,
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

  if (bestCarSeatGuide) {
    await prisma.guide.update({
      where: { id: bestCarSeatGuide.id },
      data: {
        relatedGuideIds: guides
          .map((guide) => seededGuideIdsBySlug.get(guide.slug))
          .filter((id): id is string => Boolean(id)),
      },
    });
  }

  console.log('');
  console.log(`Seeded ${guides.length} car seat category guides as ${publish ? 'published' : 'draft'} content.`);
  console.log(`Author: ${author.name?.trim() || author.email}`);
  console.log('Placeholder example.com product links were stripped during import to avoid broken outbound CTAs.');
}

main()
  .catch((error) => {
    console.error('Failed to seed car seat category guides:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
