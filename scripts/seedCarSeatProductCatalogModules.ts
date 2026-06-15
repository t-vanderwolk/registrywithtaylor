import type { PostStatus, Prisma } from '@prisma/client';
import { extractLeadParagraphs, stripMarkdown } from '@/lib/blog/contentText';
import {
  CAR_SEAT_CATEGORY_GUIDE_SLUGS,
  getCarSeatCategoryGuideConfig,
  type CarSeatCategoryGuideSlug,
} from '@/lib/guides/carSeatCategoryGuides';
import { GUIDE_CATEGORIES } from '@/lib/guides/categories';
import { getCarSeatCategory } from '@/lib/guides/carSeatSystem';
import { getGuidePath } from '@/lib/guides/routing';
import prisma from '@/lib/server/prisma';

type CarSeatProductCatalogModuleSeed = {
  slug: CarSeatCategoryGuideSlug;
  targetKeyword: string;
  secondaryKeywords: string[];
  relatedSlugs: string[];
};

const GUIDE_TOPIC_CLUSTER = 'TMBC Learning Library: Car Seats';
const PUBLISH_FLAG = '--publish';
const CAR_SEAT_CATEGORY = GUIDE_CATEGORIES[1];
const FALLBACK_HERO_IMAGE = '/assets/editorial/gear.jpg';

const carSeatProductCatalogModuleSeeds: CarSeatProductCatalogModuleSeed[] = [
  {
    slug: 'infant-car-seats',
    targetKeyword: 'infant car seat',
    secondaryKeywords: [
      'best infant car seat',
      'newborn car seat',
      'infant seat vs convertible',
      'portable infant car seat',
    ],
    relatedSlugs: ['best-infant-car-seats', 'convertible-car-seats', 'travel-lightweight-car-seats', 'rotating-car-seats'],
  },
  {
    slug: 'convertible-car-seats',
    targetKeyword: 'convertible car seat',
    secondaryKeywords: [
      'best convertible car seat',
      'convertible vs infant car seat',
      'convertible car seat from birth',
      'rear facing convertible seat',
    ],
    relatedSlugs: ['best-infant-car-seats', 'infant-car-seats', 'all-in-one-car-seats', 'rotating-car-seats'],
  },
  {
    slug: 'all-in-one-car-seats',
    targetKeyword: 'all in one car seat',
    secondaryKeywords: [
      'best all in one car seat',
      'all in one vs convertible car seat',
      'multi stage car seat',
      'long term car seat',
    ],
    relatedSlugs: ['best-infant-car-seats', 'convertible-car-seats', 'booster-seats', 'rotating-car-seats'],
  },
  {
    slug: 'booster-seats',
    targetKeyword: 'booster seat',
    secondaryKeywords: ['best booster seat', 'high back booster seat', 'backless booster seat', 'booster seat stage'],
    relatedSlugs: ['best-infant-car-seats', 'all-in-one-car-seats', 'convertible-car-seats'],
  },
  {
    slug: 'rotating-car-seats',
    targetKeyword: 'rotating car seat',
    secondaryKeywords: [
      'swivel car seat',
      '360 car seat',
      'rotating infant car seat',
      'rotating convertible car seat',
      'rotating all-in-one car seat',
    ],
    relatedSlugs: ['best-infant-car-seats', 'infant-car-seats', 'convertible-car-seats', 'all-in-one-car-seats', 'travel-lightweight-car-seats'],
  },
  {
    slug: 'travel-lightweight-car-seats',
    targetKeyword: 'travel lightweight car seat',
    secondaryKeywords: ['travel car seat', 'lightweight car seat', 'portable car seat', 'car seat for travel'],
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

function titleCaseLabel(value: string) {
  return value
    .split(/[\s-]+/)
    .map((word) => (word ? `${word.charAt(0).toUpperCase()}${word.slice(1)}` : word))
    .join(' ');
}

function renderProductBlock(
  product: ReturnType<typeof getCarSeatCategoryGuideConfig>['productExamples'][number],
) {
  const lines = [
    ':::product',
    `Brand: ${product.brand || 'TMBC Example'}`,
    `Product: ${product.productName}`,
    `Review: ${product.shortReview}`,
  ];

  if (product.bestFor?.trim()) {
    lines.push(`Best for: ${product.bestFor.trim()}`);
  }

  if (product.standout?.trim()) {
    lines.push(`Standout: ${product.standout.trim()}`);
  }

  if (product.pros.length > 0) {
    lines.push(`Pros: ${product.pros.slice(0, 3).join(' | ')}`);
  }

  const primaryLink = product.affiliateLinks.find((link) => link.url?.trim());
  if (primaryLink) {
    lines.push(`Link: ${primaryLink.label || 'View option'} | ${primaryLink.url.trim()}`);
  }

  lines.push(':::');
  return lines.join('\n');
}

function renderGuideContent(slug: CarSeatCategoryGuideSlug) {
  const config = getCarSeatCategoryGuideConfig(slug);
  const contentSections: string[] = [];

  contentSections.push('## Start Here');
  contentSections.push(config.startPanel.questionTitle);
  for (const card of config.startPanel.summaryCards) {
    contentSections.push(`### ${card.eyebrow}`);
    contentSections.push(card.text);
  }

  contentSections.push('## Fit Check');
  contentSections.push(config.fitCheck.description);
  contentSections.push('### This guide is a fit if');
  contentSections.push(config.fitCheck.fitSummary);
  contentSections.push(...config.fitCheck.fitBullets.map((bullet) => `- ${bullet}`));
  contentSections.push('### This may not be your best fit if');
  contentSections.push(config.fitCheck.notFitSummary);
  contentSections.push(...config.fitCheck.notFitBullets.map((bullet) => `- ${bullet}`));
  contentSections.push(`*${config.fitCheck.signatureMoment}*`);

  contentSections.push('## Real-Life Scenarios');
  contentSections.push(config.planner.description);
  for (const scenario of config.planner.scenarios) {
    contentSections.push(`### ${scenario.label}`);
    contentSections.push(`Verdict: ${scenario.fitLabel}`);
    contentSections.push(scenario.summary);
    if (scenario.signals.length > 0) {
      contentSections.push('Signals to watch for:');
      contentSections.push(...scenario.signals.map((signal) => `- ${signal}`));
    }
    if (scenario.priorities.length > 0) {
      contentSections.push(`Priorities: ${scenario.priorities.join(' | ')}`);
    }
  }

  contentSections.push('## Decision Lenses');
  for (const lens of config.planner.priorityLenses) {
    contentSections.push(`### ${lens.label}`);
    contentSections.push(`Verdict: ${lens.verdict}`);
    contentSections.push(lens.summary);
    contentSections.push(`Helpful when: ${lens.helpsWhen}`);
    contentSections.push(`Watch out for: ${lens.watchout}`);
  }

  if (config.productExamples.length > 0) {
    contentSections.push('## Product Examples');
    contentSections.push(
      'These examples are here to make the lane easier to picture in real life, not to turn the decision into a ranked shopping list.',
    );
    contentSections.push(...config.productExamples.slice(0, 3).map((product) => renderProductBlock(product)));
  }

  contentSections.push('## Continue Exploring');
  contentSections.push(config.continueExploring.description);
  contentSections.push(
    ...config.continueExploring.links.map((link) => `- [${link.title}](${link.href}) - ${link.description}`),
  );

  return {
    title: config.context.currentLabel,
    description: config.heroDescription,
    intro: [config.heroDescription, config.startPanel.startDescription].join('\n\n'),
    content: contentSections.join('\n\n').trim(),
    nextStepCtaLabel: config.continueExploring.links[0]?.title
      ? `Next: ${config.continueExploring.links[0].title}`
      : 'Read the Car Seat Guide',
    nextStepCtaHref: config.continueExploring.links[0]?.href ?? getGuidePath({ slug: 'best-infant-car-seats' }),
  };
}

async function buildModuleSeed(definition: CarSeatProductCatalogModuleSeed) {
  const rendered = renderGuideContent(definition.slug);
  const category = getCarSeatCategory(definition.slug);
  const heroImageUrl = category?.imageSrc ?? FALLBACK_HERO_IMAGE;
  const heroImageAlt =
    category?.imageAlt ?? `${rendered.title} editorial image for the TMBC car seat product catalog module.`;

  return {
    ...definition,
    title: rendered.title,
    description: rendered.description,
    intro: rendered.intro,
    content: rendered.content,
    excerpt: buildExcerpt(rendered.intro, rendered.description),
    seoDescription: buildSeoDescription(rendered.intro, rendered.description),
    heroImageUrl,
    heroImageAlt,
    canonicalUrl: getGuidePath({ slug: definition.slug, topicCluster: GUIDE_TOPIC_CLUSTER }),
    nextStepCtaLabel: rendered.nextStepCtaLabel,
    nextStepCtaHref: rendered.nextStepCtaHref,
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
    throw new Error('No users found. Create an admin user before seeding car seat product catalog modules.');
  }

  const guides = await Promise.all(carSeatProductCatalogModuleSeeds.map((definition) => buildModuleSeed(definition)));
  const seededGuideIdsBySlug = new Map<string, string>();
  const savedStatuses: PostStatus[] = [];

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
      intro: guide.intro,
      content: guide.content,
      conclusion: null,
      heroImageUrl: guide.heroImageUrl,
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
      ogImageUrl: guide.heroImageUrl,
      ogImageAlt: guide.heroImageAlt,
      canonicalUrl: guide.canonicalUrl,
      targetKeyword: guide.targetKeyword,
      secondaryKeywords: guide.secondaryKeywords,
      internalLinkNotes:
        'Seeded from lib/guides/carSeatCategoryGuides.ts and lib/guides/carSeatProductCatalog.ts so the database record matches the live car seat category system.',
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
      nextStepCtaLabel: guide.nextStepCtaLabel,
      nextStepCtaHref: guide.nextStepCtaHref,
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
    savedStatuses.push(saved.status);
    console.log(
      `${existing ? 'Updated' : 'Created'} car seat product catalog module: ${saved.title} (${saved.slug}) [${saved.status}]`,
    );
  }

  const bestCarSeatGuide = await prisma.guide.findUnique({
    where: { slug: 'best-infant-car-seats' },
    select: { id: true, relatedGuideIds: true },
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

    const relatedGuideIds = guide.relatedSlugs
      .map((slug) => {
        if (slug === 'best-infant-car-seats') {
          return bestCarSeatGuide?.id ?? null;
        }

        if (slug === 'travel-with-baby') {
          return travelWithBabyGuide?.id ?? null;
        }

        return seededGuideIdsBySlug.get(slug) ?? null;
      })
      .filter((id): id is string => Boolean(id));

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
        relatedGuideIds: carSeatProductCatalogModuleSeeds
          .map((seed) => seededGuideIdsBySlug.get(seed.slug))
          .filter((id): id is string => Boolean(id)),
      },
    });
  }

  console.log('');
  const publishedCount = savedStatuses.filter((status) => status === 'PUBLISHED').length;
  const draftCount = savedStatuses.filter((status) => status === 'DRAFT').length;
  console.log(`Seeded ${CAR_SEAT_CATEGORY_GUIDE_SLUGS.length} car seat product catalog modules.`);
  console.log(`Status summary: ${publishedCount} published, ${draftCount} draft.`);
  console.log(`Author: ${author.name?.trim() || author.email}`);
  console.log('These records mirror the live car seat category system and keep the product examples tied to the same source of truth.');
}

main()
  .catch((error) => {
    console.error('Failed to seed car seat product catalog modules:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
