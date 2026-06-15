import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { PostStatus, Prisma } from '@prisma/client';
import { extractLeadParagraphs, stripMarkdown } from '@/lib/blog/contentText';
import { STROLLER_PRODUCT_GROUPS, type StrollerProductGroupSlug } from '@/lib/data/products/strollers';
import {
  buildGuideOutline,
  splitGuideSectionContent,
  stripLeadingGuideHeading,
  type GuideSection,
  type GuideSectionSubsection,
} from '@/lib/guides/articleOutline';
import { GUIDE_CATEGORIES } from '@/lib/guides/categories';
import { resolveGuideAffiliateUrl } from '@/lib/guides/resolveGuideAffiliateUrl';
import type { GuideProductExampleData } from '@/lib/guides/productExamples';
import prisma from '@/lib/server/prisma';

type StrollerAcademyModuleSlug = 'stroller-foundations' | 'travel-systems';
type RelatedAcademyModuleSlug =
  | StrollerAcademyModuleSlug
  | 'car-seat-basics'
  | 'vision-and-lifestyle'
  | 'storage-and-stations';
type AcademyPathSlug = 'gear' | 'registry' | 'nursery';

type StrollerAcademyModuleSeed = {
  slug: StrollerAcademyModuleSlug;
  targetKeyword: string;
  secondaryKeywords: string[];
  relatedSlugs: string[];
};

type AcademyCoreSection = {
  title: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  imageCaption?: string;
};

type AcademyProductExample = {
  brand: string;
  name: string;
  description: string;
  pros: string[];
  affiliateUrl: string | null;
};

type AcademyRelatedLink = {
  href: string;
  title: string;
  description: string;
};

type StrollerAcademyModuleData = {
  slug: StrollerAcademyModuleSlug;
  title: string;
  description: string;
  subhead: string;
  href: string;
  imagePath: string;
  imageAlt: string;
  intro: string[];
  coreSections: AcademyCoreSection[];
  decisionBullets: string[];
  products: AcademyProductExample[];
  previous: AcademyRelatedLink | null;
  next: AcademyRelatedLink | null;
  related: AcademyRelatedLink | null;
};

type AcademyModuleDefinition = {
  pathSlug: AcademyPathSlug;
  title: string;
  description: string;
  subhead: string;
  imagePath: string;
  imageAlt: string;
  relatedSlug: RelatedAcademyModuleSlug;
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'guides');
const GUIDE_FILES = {
  stroller: 'taylor-made-stroller-guide.md',
  compact: 'taylor-made-compact-lightweight-stroller-guide.md',
  travelStroller: 'taylor-made-travel-stroller-guide.md',
  travel: 'taylor-made-travel-with-baby-guide.md',
  infantCarSeat: 'taylor-made-infant-car-seat-guide.md',
} as const;
const PUBLISH_FLAG = '--publish';
const STROLLER_CATEGORY = GUIDE_CATEGORIES[0];
const STROLLER_ACADEMY_TOPIC_CLUSTER = 'TMBC Baby Academy: Stroller Modules';
const PATH_TITLES: Record<AcademyPathSlug, string> = {
  gear: 'Gear',
  registry: 'Registry',
  nursery: 'Nursery',
};
const GEAR_MODULE_ORDER: RelatedAcademyModuleSlug[] = ['stroller-foundations', 'travel-systems', 'car-seat-basics'];
const ACADEMY_MODULE_DEFINITIONS: Record<RelatedAcademyModuleSlug, AcademyModuleDefinition> = {
  'vision-and-lifestyle': {
    pathSlug: 'registry',
    title: 'Vision and Lifestyle',
    description: 'Start the registry from the life you are building, not from a giant list of product categories.',
    subhead: 'This module helps you make the registry fit your real home, your routines, and what actually matters first.',
    imagePath: '/assets/editorial/registry.jpg',
    imageAlt: 'Registry planning editorial image for the Vision and Lifestyle academy module.',
    relatedSlug: 'stroller-foundations',
  },
  'storage-and-stations': {
    pathSlug: 'nursery',
    title: 'Storage and Stations',
    description: 'Keep changing, storage, and reset routines obvious enough to survive real life.',
    subhead: 'This module is about shortening the route, not building a room full of labeled optimism bins.',
    imagePath: '/assets/editorial/clipboard.png',
    imageAlt: 'Nursery organization image for the Storage and Stations academy module.',
    relatedSlug: 'travel-systems',
  },
  'stroller-foundations': {
    pathSlug: 'gear',
    title: 'Stroller Foundations',
    description: 'Get clear on stroller lanes before comparing products that were never solving the same job.',
    subhead: 'The calmer stroller decision starts with routine, storage, terrain, and longevity instead of a brand shortlist.',
    imagePath: '/assets/editorial/strollers.png',
    imageAlt: 'Editorial stroller planning image for the Stroller Foundations academy module.',
    relatedSlug: 'vision-and-lifestyle',
  },
  'travel-systems': {
    pathSlug: 'gear',
    title: 'Travel Systems',
    description:
      'Understand how travel strollers, infant seats, and portability work together before convenience starts running the whole decision.',
    subhead: 'This module is about transitions: how you leave, move, load, and arrive with less friction.',
    imagePath: '/assets/editorial/stroller-folds.jpg',
    imageAlt: 'Travel stroller fold image for the Travel Systems academy module.',
    relatedSlug: 'storage-and-stations',
  },
  'car-seat-basics': {
    pathSlug: 'gear',
    title: 'Car Seat Basics',
    description: 'Make the stage-based car seat decision clearer before brand language turns the category into homework.',
    subhead: 'Start with the stage, the vehicle, and the routine. The rest gets much quieter from there.',
    imagePath: '/assets/editorial/gear.jpg',
    imageAlt: 'Car seat and gear image for the Car Seat Basics academy module.',
    relatedSlug: 'vision-and-lifestyle',
  },
};

const strollerAcademyModuleSeeds: StrollerAcademyModuleSeed[] = [
  {
    slug: 'stroller-foundations',
    targetKeyword: 'stroller guide',
    secondaryKeywords: [
      'stroller categories',
      'full size stroller vs compact stroller',
      'how to choose a stroller',
      'stroller foundations',
    ],
    relatedSlugs: ['travel-systems', 'best-strollers', 'compact-lightweight-strollers', 'full-size-modular-strollers'],
  },
  {
    slug: 'travel-systems',
    targetKeyword: 'travel system guide',
    secondaryKeywords: [
      'travel stroller guide',
      'travel system stroller',
      'infant car seat stroller compatibility',
      'travel with baby stroller',
    ],
    relatedSlugs: ['stroller-foundations', 'travel-with-baby', 'travel-strollers', 'infant-car-seats'],
  },
];

const guideDocumentCache = new Map<
  string,
  Promise<{
    content: string;
    outline: ReturnType<typeof buildGuideOutline>;
  }>
>();

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

function normalizeTitle(value: string) {
  return stripMarkdown(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function uniqueItems(items: Array<string | null | undefined>, maxItems?: number) {
  const deduped = items
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index);

  return typeof maxItems === 'number' ? deduped.slice(0, maxItems) : deduped;
}

function isParagraphBlock(block: string) {
  const trimmed = block.trim();

  return (
    Boolean(trimmed) &&
    !trimmed.startsWith('#') &&
    !trimmed.startsWith(':::') &&
    !trimmed.startsWith('![') &&
    !trimmed.startsWith('>') &&
    !trimmed.startsWith('::cta-slot') &&
    !/^[-*]\s+/.test(trimmed) &&
    !/^\d+\.\s+/.test(trimmed)
  );
}

function extractParagraphs(content: string, maxParagraphs = 4) {
  return stripLeadingGuideHeading(content)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(isParagraphBlock)
    .map((block) => stripMarkdown(block))
    .filter(Boolean)
    .slice(0, maxParagraphs);
}

function sentenceCase(value: string) {
  const cleaned = stripMarkdown(value).trim();

  if (!cleaned) {
    return '';
  }

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function extractMarkdownListItems(content: string, maxItems = 5) {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line))
    .map((line) => sentenceCase(line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '')))
    .filter(Boolean)
    .slice(0, maxItems);
}

async function readGuideFile(fileName: string) {
  return fs.readFile(path.join(CONTENT_DIR, fileName), 'utf8');
}

async function getGuideDocument(fileName: string) {
  const cached = guideDocumentCache.get(fileName);

  if (cached) {
    return cached;
  }

  const promise = readGuideFile(fileName).then((content) => ({
    content,
    outline: buildGuideOutline(content),
  }));

  guideDocumentCache.set(fileName, promise);
  return promise;
}

function findSectionByTitle(sections: GuideSection[], title: string) {
  const target = normalizeTitle(title);

  return (
    sections.find((section) => {
      const candidate = normalizeTitle(section.title);
      return candidate === target || candidate.includes(target) || target.includes(candidate);
    }) ?? null
  );
}

function findSubsectionByTitle(subsections: GuideSectionSubsection[], title: string) {
  const target = normalizeTitle(title);

  return (
    subsections.find((subsection) => {
      const candidate = normalizeTitle(subsection.title);
      return candidate === target || candidate.includes(target) || target.includes(candidate);
    }) ?? null
  );
}

async function getPrefaceParagraphs(fileName: string, maxParagraphs = 2) {
  const document = await getGuideDocument(fileName);
  return extractParagraphs(document.outline.preface, maxParagraphs);
}

async function getSectionParagraphs(fileName: string, sectionTitle: string, maxParagraphs = 2) {
  const document = await getGuideDocument(fileName);
  const section = findSectionByTitle(document.outline.sections, sectionTitle);

  return section ? extractParagraphs(section.content, maxParagraphs) : [];
}

async function getSubsectionParagraphs(
  fileName: string,
  sectionTitle: string,
  subsectionTitle: string,
  maxParagraphs = 2,
) {
  const document = await getGuideDocument(fileName);
  const section = findSectionByTitle(document.outline.sections, sectionTitle);

  if (!section) {
    return [];
  }

  const subsection = findSubsectionByTitle(splitGuideSectionContent(section.content).subsections, subsectionTitle);
  return subsection ? extractParagraphs(subsection.content, maxParagraphs) : [];
}

async function getSectionListItems(fileName: string, sectionTitle: string, maxItems = 5) {
  const document = await getGuideDocument(fileName);
  const section = findSectionByTitle(document.outline.sections, sectionTitle);

  return section ? extractMarkdownListItems(section.content, maxItems) : [];
}

function toSentence(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function buildStrollerProductExample({
  groupSlug,
  index,
}: {
  groupSlug: StrollerProductGroupSlug;
  index: number;
}) {
  const products = STROLLER_PRODUCT_GROUPS[groupSlug] as GuideProductExampleData[];
  const product = products[index];
  const name = product.productName ?? product.name;

  return {
    name,
    brand: product.brand ?? '',
    description: toSentence(product.shortReview ?? product.bestFor ?? 'A helpful guided example.'),
    pros: uniqueItems(product.pros ?? [], 3),
    affiliateUrl: resolveGuideAffiliateUrl({
      affiliateUrl: product.affiliateUrl,
      brand: product.brand,
      productName: product.productName,
      name: product.name,
    }),
  } satisfies AcademyProductExample;
}

function getAcademyModuleHref(pathSlug: AcademyPathSlug, moduleSlug: RelatedAcademyModuleSlug) {
  return `/academy/${pathSlug}/${moduleSlug}`;
}

function getRelatedLink(slug: RelatedAcademyModuleSlug) {
  const definition = ACADEMY_MODULE_DEFINITIONS[slug];

  return {
    href: getAcademyModuleHref(definition.pathSlug, slug),
    title: definition.title,
    description: `${definition.description} Inside the ${PATH_TITLES[definition.pathSlug]} path.`,
  } satisfies AcademyRelatedLink;
}

function buildNavigation(slug: StrollerAcademyModuleSlug) {
  const currentIndex = GEAR_MODULE_ORDER.indexOf(slug);
  const previousSlug = currentIndex > 0 ? GEAR_MODULE_ORDER[currentIndex - 1] : null;
  const nextSlug = currentIndex >= 0 && currentIndex < GEAR_MODULE_ORDER.length - 1 ? GEAR_MODULE_ORDER[currentIndex + 1] : null;
  const relatedSlug = ACADEMY_MODULE_DEFINITIONS[slug].relatedSlug;

  return {
    previous: previousSlug ? getRelatedLink(previousSlug) : null,
    next: nextSlug ? getRelatedLink(nextSlug) : null,
    related: getRelatedLink(relatedSlug),
  };
}

async function buildStrollerFoundationsModule(): Promise<StrollerAcademyModuleData> {
  const definition = ACADEMY_MODULE_DEFINITIONS['stroller-foundations'];
  const intro = uniqueItems(
    [
      ...(await getPrefaceParagraphs(GUIDE_FILES.stroller, 2)),
      ...(await getPrefaceParagraphs(GUIDE_FILES.compact, 1)),
    ],
    3,
  );
  const decisionBullets = uniqueItems(
    [
      ...(await getSectionListItems(GUIDE_FILES.stroller, 'Decision Framework', 5)),
      ...(await getSectionListItems(GUIDE_FILES.compact, 'Real-Life Fit', 4)),
    ],
    5,
  );

  return {
    slug: 'stroller-foundations',
    title: definition.title,
    description: definition.description,
    subhead: definition.subhead,
    href: getAcademyModuleHref(definition.pathSlug, 'stroller-foundations'),
    imagePath: definition.imagePath,
    imageAlt: definition.imageAlt,
    intro,
    coreSections: [
      {
        title: 'Start with the lane',
        paragraphs: uniqueItems(
          [
            ...(await getSectionParagraphs(GUIDE_FILES.stroller, 'What This Is', 2)),
            ...(await getSectionParagraphs(GUIDE_FILES.compact, 'Why This Category Feels Overwhelming', 1)),
          ],
          3,
        ),
        imageSrc: '/assets/editorial/strollers.png',
        imageAlt: 'Editorial stroller lane image.',
        imageCaption: 'The category map comes first. The brand rabbit hole can wait.',
      },
      {
        title: 'Full-size and compact solve different days',
        paragraphs: uniqueItems(
          [
            ...(await getSubsectionParagraphs(GUIDE_FILES.stroller, 'Core Content', 'Full-size and modular strollers', 2)),
            ...(await getSubsectionParagraphs(GUIDE_FILES.stroller, 'Core Content', 'Compact and travel strollers', 2)),
          ],
          4,
        ),
        imageSrc: '/assets/editorial/fullsizemodular.png',
        imageAlt: 'Full-size stroller editorial image.',
        imageCaption:
          'This is rarely about which stroller is more impressive. It is about which tradeoff is easier to live with.',
      },
      {
        title: 'Compact is a routine answer, not a downgrade',
        paragraphs: uniqueItems(
          [
            ...(await getSectionParagraphs(GUIDE_FILES.compact, 'What Defines a Compact or Lightweight Stroller', 2)),
            ...(await getSectionParagraphs(GUIDE_FILES.compact, 'Real-Life Fit', 2)),
          ],
          4,
        ),
        imageSrc: '/assets/editorial/compact.png',
        imageAlt: 'Compact stroller editorial image.',
        imageCaption:
          'Compact wins because it keeps the week moving more easily, not because it wins a smaller-is-purer competition.',
      },
      {
        title: 'Compatibility matters, but longevity wins',
        paragraphs: uniqueItems(
          [
            ...(await getSubsectionParagraphs(
              GUIDE_FILES.stroller,
              'Core Content',
              'Car seat compatibility matters, but not more than longevity',
              2,
            )),
            ...(await getSectionParagraphs(GUIDE_FILES.infantCarSeat, 'What Actually Matters More', 1)),
          ],
          3,
        ),
        imageSrc: '/assets/editorial/stroller-folds.jpg',
        imageAlt: 'Stroller fold editorial image.',
        imageCaption: 'The stroller usually has the longer job. That should change the order of the decision.',
      },
    ],
    decisionBullets,
    products: [
      buildStrollerProductExample({ groupSlug: 'compact-lightweight-strollers', index: 0 }),
      buildStrollerProductExample({ groupSlug: 'compact-lightweight-strollers', index: 1 }),
      buildStrollerProductExample({ groupSlug: 'compact-lightweight-strollers', index: 2 }),
    ],
    ...buildNavigation('stroller-foundations'),
  };
}

async function buildTravelSystemsModule(): Promise<StrollerAcademyModuleData> {
  const definition = ACADEMY_MODULE_DEFINITIONS['travel-systems'];
  const intro = uniqueItems(
    [
      ...(await getPrefaceParagraphs(GUIDE_FILES.travel, 2)),
      ...(await getPrefaceParagraphs(GUIDE_FILES.travelStroller, 1)),
    ],
    3,
  );
  const decisionBullets = uniqueItems(
    [
      ...(await getSectionListItems(GUIDE_FILES.travel, 'Decision Framework', 5)),
      ...(await getSectionListItems(GUIDE_FILES.infantCarSeat, 'How to Think About It Simply', 3)),
    ],
    5,
  );

  return {
    slug: 'travel-systems',
    title: definition.title,
    description: definition.description,
    subhead: definition.subhead,
    href: getAcademyModuleHref(definition.pathSlug, 'travel-systems'),
    imagePath: definition.imagePath,
    imageAlt: definition.imageAlt,
    intro,
    coreSections: [
      {
        title: 'Travel is mostly a transition problem',
        paragraphs: uniqueItems(
          [
            ...(await getSubsectionParagraphs(GUIDE_FILES.travel, 'Core Content', 'Travel is really about transitions', 2)),
            ...(await getSectionParagraphs(GUIDE_FILES.travelStroller, 'Why This Category Feels Overwhelming', 1)),
          ],
          3,
        ),
        imageSrc: '/assets/editorial/gear.jpg',
        imageAlt: 'Baby travel planning image.',
        imageCaption: 'The hardest repeated transition should shape the setup more than the smallest spec sheet number.',
      },
      {
        title: 'The stroller should match the trip',
        paragraphs: uniqueItems(
          [
            ...(await getSubsectionParagraphs(GUIDE_FILES.travel, 'Core Content', 'The stroller should match the trip', 2)),
            ...(await getSectionParagraphs(GUIDE_FILES.travelStroller, 'What a Travel Stroller Should Actually Do', 2)),
          ],
          4,
        ),
        imageSrc: '/assets/editorial/stroller-folds.jpg',
        imageAlt: 'Travel stroller fold and portability image.',
        imageCaption:
          'Airport days, road trips, and destination-heavy walking are not all asking the stroller to do the same job.',
      },
      {
        title: 'A travel system is early-stage convenience, not the whole plan',
        paragraphs: uniqueItems(
          [
            ...(await getSectionParagraphs(GUIDE_FILES.infantCarSeat, 'What a Travel System Actually Means', 2)),
            ...(await getSectionParagraphs(GUIDE_FILES.infantCarSeat, 'What Actually Matters More', 2)),
          ],
          4,
        ),
        imageSrc: '/assets/editorial/fullsize.png',
        imageAlt: 'Everyday stroller and travel-system planning image.',
        imageCaption:
          'The click-in convenience is real. It still does not get to outrank the stroller you will use much longer.',
      },
      {
        title: 'Choose the hardest transition first',
        paragraphs: uniqueItems(
          [
            ...(await getSectionParagraphs(GUIDE_FILES.travelStroller, 'Expert Advice', 2)),
            ...(await getSectionParagraphs(GUIDE_FILES.travelStroller, 'Real-Life Fit', 2)),
          ],
          4,
        ),
        imageSrc: '/assets/editorial/growing-with-confidence.jpg',
        imageAlt: 'Parent traveling confidently with baby gear.',
        imageCaption: 'Families are usually happiest when the setup solves the most stressful part of the trip first.',
      },
    ],
    decisionBullets,
    products: [
      buildStrollerProductExample({ groupSlug: 'full-size-modular-strollers', index: 0 }),
      buildStrollerProductExample({ groupSlug: 'full-size-modular-strollers', index: 1 }),
      buildStrollerProductExample({ groupSlug: 'compact-lightweight-strollers', index: 0 }),
    ],
    ...buildNavigation('travel-systems'),
  };
}

async function getStrollerAcademyModuleData(slug: StrollerAcademyModuleSlug) {
  switch (slug) {
    case 'stroller-foundations':
      return buildStrollerFoundationsModule();
    case 'travel-systems':
      return buildTravelSystemsModule();
    default:
      throw new Error(`Unsupported stroller academy module: ${slug}`);
  }
}

function renderProductBlock({
  brand,
  name,
  description,
  pros,
  affiliateUrl,
}: {
  brand: string;
  name: string;
  description: string;
  pros: string[];
  affiliateUrl: string | null;
}) {
  const lines = [
    ':::product',
    `Brand: ${brand || 'TMBC Example'}`,
    `Product: ${name}`,
    `Review: ${description}`,
  ];

  if (pros.length > 0) {
    lines.push(`Pros: ${pros.join(' | ')}`);
  }

  if (affiliateUrl) {
    lines.push(`Link: View option | ${affiliateUrl}`);
  }

  lines.push(':::');
  return lines.join('\n');
}

async function buildModuleSeed(definition: StrollerAcademyModuleSeed) {
  const module = await getStrollerAcademyModuleData(definition.slug);
  const intro = module.intro.join('\n\n').trim() || null;
  const contentSections: string[] = [];

  contentSections.push('## Core Considerations');
  for (const section of module.coreSections) {
    contentSections.push(`### ${section.title}`);
    contentSections.push(...section.paragraphs);

    if (section.imageSrc) {
      contentSections.push(`![${section.imageAlt}](${section.imageSrc})`);
    }

    if (section.imageCaption) {
      contentSections.push(`*${section.imageCaption}*`);
    }
  }

  contentSections.push('## What This Means For You');
  contentSections.push(...module.decisionBullets.map((bullet) => `- ${bullet}`));

  if (module.products.length > 0) {
    contentSections.push('## Product Examples');
    contentSections.push(
      'These examples are here to keep the decision grounded in real-life fit, not to create a ranked shopping list.',
    );
    contentSections.push(...module.products.slice(0, 3).map((product) => renderProductBlock(product)));
  }

  contentSections.push('## Next Steps');
  if (module.previous) {
    contentSections.push(`- [${module.previous.title}](${module.previous.href})`);
  }
  if (module.next) {
    contentSections.push(`- [${module.next.title}](${module.next.href})`);
  }
  if (module.related) {
    contentSections.push(`- [${module.related.title}](${module.related.href})`);
  }

  const content = contentSections.filter(Boolean).join('\n\n').trim();

  return {
    ...definition,
    title: module.title,
    description: module.description,
    excerpt: buildExcerpt(intro ?? content, module.description),
    seoDescription: buildSeoDescription(intro ?? content, module.description),
    intro,
    content,
    canonicalUrl: module.href,
    heroImageUrl: module.imagePath,
    heroImageAlt: module.imageAlt,
    nextStepCtaLabel: module.next?.title ? `Next Module: ${module.next.title}` : 'Back to TMBC Baby Academy',
    nextStepCtaHref: module.next?.href ?? '/academy',
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
    throw new Error('No users found. Create an admin user before seeding stroller academy modules.');
  }

  const guides = await Promise.all(strollerAcademyModuleSeeds.map((definition) => buildModuleSeed(definition)));
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
      intro: guide.intro,
      content: guide.content,
      conclusion: null,
      heroImageUrl: guide.heroImageUrl,
      heroImageAlt: guide.heroImageAlt,
      authorId: author.id,
      category: STROLLER_CATEGORY,
      topicCluster: STROLLER_ACADEMY_TOPIC_CLUSTER,
      status: statusData.status,
      publishedAt: statusData.publishedAt,
      scheduledFor: null,
      archivedAt: statusData.archivedAt,
      seoTitle: `${guide.title} | TMBC Baby Academy`,
      seoDescription: guide.seoDescription,
      ogTitle: `${guide.title} | TMBC Baby Academy`,
      ogDescription: guide.seoDescription,
      ogImageUrl: guide.heroImageUrl,
      ogImageAlt: guide.heroImageAlt,
      canonicalUrl: guide.canonicalUrl,
      targetKeyword: guide.targetKeyword,
      secondaryKeywords: guide.secondaryKeywords,
      internalLinkNotes:
        'Seeded from the academy module registry in lib/academy/content.ts. Keep draft unless academy modules are intentionally mapped into the public guide routing layer.',
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
    console.log(`${existing ? 'Updated' : 'Created'} stroller academy module: ${saved.title} (${saved.slug}) [${saved.status}]`);
  }

  const relatedSlugs = Array.from(new Set(guides.flatMap((guide) => guide.relatedSlugs)));
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

  console.log('');
  console.log(`Seeded ${guides.length} stroller academy modules as ${publish ? 'published' : 'draft'} content.`);
  console.log(`Author: ${author.name?.trim() || author.email}`);
  console.log('These records keep the academy stroller modules editable in the guide system without exposing them publicly by default.');
}

main()
  .catch((error) => {
    console.error('Failed to seed stroller academy modules:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
