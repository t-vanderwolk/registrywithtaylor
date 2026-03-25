import 'server-only';

import { cache } from 'react';
import type { Prisma } from '@prisma/client';
import prisma from '@/lib/server/prisma';
import { isRemoteImageUrl } from '@/lib/blog/images';
import {
  type AcademyCoreSection,
  type AcademyModuleData,
  type AcademyModuleSlug,
  type AcademyPathSlug,
  type AcademyProductExample,
  isAcademyModuleSlug,
  isAcademyPathSlug,
} from '@/lib/academy/content';
import { stripMarkdown } from '@/lib/blog/contentText';
import { isStyledBlockStart, parseStyledBlock } from '@/lib/blog/styledBlocks';
import { buildGuideOutline, splitGuideSectionContent, stripLeadingGuideHeading } from '@/lib/guides/articleOutline';
import { extractMarkdownListItems } from '@/lib/guides/guideFlow';
import { getPublicGuideWhere } from '@/lib/guides/status';
import { normalizeGuideCanonicalPath } from '@/lib/guides/publicPath';
import { guideArticleSelect, toGuideArticleRecord, type GuideArticleRecord } from '@/lib/server/guideArticleRecord';

export const ACADEMY_TOPIC_CLUSTER_TOKEN = 'TMBC Baby Academy';

const imageLinePattern = /^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)$/;
const emphasisOnlyPattern = /^\*([^*]+)\*$/;

function resolveRenderableImagePath(candidate: string | null | undefined, fallback: string) {
  const normalizedCandidate = candidate?.trim();

  if (!normalizedCandidate) {
    return fallback;
  }

  return normalizedCandidate.startsWith('/') || isRemoteImageUrl(normalizedCandidate)
    ? normalizedCandidate
    : fallback;
}

function normalizeTitle(value: string) {
  return stripMarkdown(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function findSection(
  sections: Array<{ title: string; content: string }>,
  matcher: (normalizedTitle: string) => boolean,
) {
  return sections.find((section) => matcher(normalizeTitle(section.title))) ?? null;
}

function isParagraphBlock(block: string) {
  const trimmed = block.trim();

  return (
    Boolean(trimmed) &&
    !trimmed.startsWith('#') &&
    !trimmed.startsWith(':::') &&
    !trimmed.startsWith('![') &&
    !trimmed.startsWith('>') &&
    !/^[-*]\s+/.test(trimmed) &&
    !/^\d+\.\s+/.test(trimmed)
  );
}

function extractParagraphBlocks(content: string, maxParagraphs = 6) {
  return stripLeadingGuideHeading(content)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(isParagraphBlock)
    .map((block) => stripMarkdown(block))
    .filter(Boolean)
    .slice(0, maxParagraphs);
}

function resolveCoreSectionFallback(
  fallbackSections: AcademyCoreSection[],
  title: string,
  index: number,
) {
  const normalizedTitle = normalizeTitle(title);

  return (
    fallbackSections.find((section) => normalizeTitle(section.title) === normalizedTitle) ??
    fallbackSections[index] ??
    null
  );
}

function parseImageMeta(content: string, fallback: AcademyCoreSection | null) {
  const lines = content.split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index]?.trim() ?? '';
    const match = trimmed.match(imageLinePattern);

    if (!match) {
      continue;
    }

    let caption: string | undefined;
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const nextLine = lines[cursor]?.trim() ?? '';
      if (!nextLine) {
        continue;
      }

      const captionMatch = nextLine.match(emphasisOnlyPattern);
      if (captionMatch?.[1]?.trim()) {
        caption = captionMatch[1].trim();
      }
      break;
    }

    return {
      imageSrc: resolveRenderableImagePath(match[2], fallback?.imageSrc ?? '/assets/placeholders/tmbc-guide-image-placeholder.svg'),
      imageAlt: match[1]?.trim() || fallback?.imageAlt || 'Academy editorial image.',
      imageCaption: caption ?? fallback?.imageCaption,
    } satisfies Pick<AcademyCoreSection, 'imageSrc' | 'imageAlt' | 'imageCaption'>;
  }

  return {
    imageSrc: fallback?.imageSrc ?? '/assets/placeholders/tmbc-guide-image-placeholder.svg',
    imageAlt: fallback?.imageAlt ?? 'Academy editorial image.',
    imageCaption: fallback?.imageCaption,
  } satisfies Pick<AcademyCoreSection, 'imageSrc' | 'imageAlt' | 'imageCaption'>;
}

function parseCoreSections(
  content: string,
  fallbackSections: AcademyCoreSection[],
) {
  const { subsections } = splitGuideSectionContent(content);
  if (subsections.length === 0) {
    return fallbackSections;
  }

  return subsections.map((subsection, index) => {
    const fallback = resolveCoreSectionFallback(fallbackSections, subsection.title, index);
    const imageMeta = parseImageMeta(subsection.content, fallback);
    const paragraphs = extractParagraphBlocks(subsection.content, 4);

    return {
      title: stripMarkdown(subsection.title).trim() || fallback?.title || 'Core consideration',
      paragraphs: paragraphs.length > 0 ? paragraphs : (fallback?.paragraphs ?? []),
      imageSrc: imageMeta.imageSrc,
      imageAlt: imageMeta.imageAlt,
      imageCaption: imageMeta.imageCaption,
    } satisfies AcademyCoreSection;
  });
}

function parseProductExamples(
  content: string,
  fallbackProducts: AcademyProductExample[],
) {
  const lines = content.split('\n');
  const products: AcademyProductExample[] = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index] ?? '';
    if (!isStyledBlockStart(line)) {
      index += 1;
      continue;
    }

    const parsed = parseStyledBlock(lines, index);
    if (!parsed) {
      index += 1;
      continue;
    }

    index = parsed.nextIndex;
    if (parsed.block.type !== 'product') {
      continue;
    }

    const fallback = fallbackProducts[products.length] ?? null;
    products.push({
      name: parsed.block.productName.trim() || fallback?.name || 'Guided example',
      brand: parsed.block.brand.trim() || fallback?.brand || '',
      description:
        parsed.block.shortReview.trim() ||
        parsed.block.bestFor.trim() ||
        fallback?.description ||
        'A useful guided example to keep the decision grounded in real life.',
      pros: parsed.block.pros.length > 0 ? parsed.block.pros.slice(0, 3) : (fallback?.pros ?? []),
      affiliateUrl: parsed.block.affiliateLinks[0]?.url ?? fallback?.affiliateUrl ?? null,
      category: fallback?.category ?? 'Product example',
    });
  }

  return products.length > 0 ? products.slice(0, 3) : fallbackProducts;
}

function parseSoftCta(
  sections: Array<{ title: string; content: string }>,
  fallbackModule: AcademyModuleData,
) {
  const ignoredTitles = new Set([
    'core considerations',
    'what this means for you',
    'product examples',
    'examples that support this setup',
    'next steps',
  ]);

  const candidate = sections.find((section) => {
    const normalizedTitle = normalizeTitle(section.title);
    return !ignoredTitles.has(normalizedTitle) && !normalizedTitle.startsWith('module ');
  });

  if (!candidate) {
    return {
      softCtaLabel: fallbackModule.softCtaLabel,
      softCtaTitle: fallbackModule.softCtaTitle,
      softCtaBody: fallbackModule.softCtaBody,
    };
  }

  const paragraphs = extractParagraphBlocks(candidate.content, 5);
  if (paragraphs.length === 0) {
    return {
      softCtaLabel: fallbackModule.softCtaLabel,
      softCtaTitle: fallbackModule.softCtaTitle,
      softCtaBody: fallbackModule.softCtaBody,
    };
  }

  return {
    softCtaLabel: candidate.title.trim() || fallbackModule.softCtaLabel,
    softCtaTitle: paragraphs[0] ?? fallbackModule.softCtaTitle,
    softCtaBody: paragraphs.slice(1).length > 0 ? paragraphs.slice(1) : fallbackModule.softCtaBody,
  };
}

export function getAcademyGuideScopeWhere(): Prisma.GuideWhereInput {
  return {
    OR: [
      {
        canonicalUrl: {
          contains: '/academy/',
          mode: 'insensitive',
        },
      },
      {
        topicCluster: {
          contains: ACADEMY_TOPIC_CLUSTER_TOKEN,
          mode: 'insensitive',
        },
      },
    ],
  };
}

export function getAcademyModuleReferenceFromPath(
  publicPath?: string | null,
): { pathSlug: AcademyPathSlug; moduleSlug: AcademyModuleSlug } | null {
  const normalizedPath = normalizeGuideCanonicalPath(publicPath);
  if (!normalizedPath) {
    return null;
  }

  const segments = normalizedPath.split('/').filter(Boolean);
  if (segments.length !== 3 || segments[0] !== 'academy') {
    return null;
  }

  const [, academyPath, moduleSlug] = segments;
  if (!isAcademyPathSlug(academyPath) || !isAcademyModuleSlug(moduleSlug)) {
    return null;
  }

  return {
    pathSlug: academyPath,
    moduleSlug,
  };
}

export function getAcademyModuleReferenceFromGuide(guide: Pick<GuideArticleRecord, 'canonicalUrl'>) {
  return getAcademyModuleReferenceFromPath(guide.canonicalUrl);
}

const getPublishedAcademyGuideForModuleCached = cache(async (pathSlug: AcademyPathSlug, moduleSlug: AcademyModuleSlug) => {
  const canonicalPath = `/academy/${pathSlug}/${moduleSlug}`;
  const guide = await prisma.guide.findFirst({
    where: {
      AND: [
        getPublicGuideWhere(),
        getAcademyGuideScopeWhere(),
        {
          OR: [
            {
              canonicalUrl: {
                contains: canonicalPath,
                mode: 'insensitive',
              },
            },
            {
              slug: moduleSlug,
            },
          ],
        },
      ],
    },
    orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
    select: guideArticleSelect,
  });

  return guide ? toGuideArticleRecord(guide) : null;
});

export async function getPublishedAcademyGuideForModule({
  pathSlug,
  moduleSlug,
}: {
  pathSlug: AcademyPathSlug;
  moduleSlug: AcademyModuleSlug;
}) {
  return getPublishedAcademyGuideForModuleCached(pathSlug, moduleSlug);
}

export function mergeAcademyModuleWithGuideRecord(
  fallbackModule: AcademyModuleData,
  guide: GuideArticleRecord,
): AcademyModuleData {
  const content = guide.content?.trim() || '';
  const outline = buildGuideOutline(content);
  const moduleSection = findSection(outline.sections, (title) => title.startsWith('module '));
  const coreSection = findSection(outline.sections, (title) => title === 'core considerations');
  const decisionSection = findSection(outline.sections, (title) => title === 'what this means for you');
  const productSection = findSection(
    outline.sections,
    (title) => title === 'product examples' || title.includes('examples that support this setup') || title === 'examples',
  );
  const introParagraphs = moduleSection
    ? extractParagraphBlocks(moduleSection.content, 6)
    : extractParagraphBlocks(guide.intro ?? '', 6);
  const decisionBullets = decisionSection ? extractMarkdownListItems(decisionSection.content, 6) : [];
  const subhead = extractParagraphBlocks(outline.preface, 2)[0] ?? fallbackModule.subhead;
  const softCta = parseSoftCta(outline.sections, fallbackModule);

  return {
    ...fallbackModule,
    title: guide.title?.trim() || fallbackModule.title,
    description: guide.seoDescription?.trim() || guide.excerpt?.trim() || fallbackModule.description,
    subhead,
    intro: introParagraphs.length > 0 ? introParagraphs : fallbackModule.intro,
    imagePath: resolveRenderableImagePath(guide.heroImageUrl?.trim() || guide.ogImageUrl?.trim(), fallbackModule.imagePath),
    imageAlt: guide.heroImageAlt?.trim() || guide.ogImageAlt?.trim() || fallbackModule.imageAlt,
    coreSections: coreSection ? parseCoreSections(coreSection.content, fallbackModule.coreSections) : fallbackModule.coreSections,
    decisionTitle: decisionSection?.title?.trim() || fallbackModule.decisionTitle,
    decisionBullets: decisionBullets.length > 0 ? decisionBullets : fallbackModule.decisionBullets,
    products: productSection ? parseProductExamples(productSection.content, fallbackModule.products) : fallbackModule.products,
    softCtaLabel: softCta.softCtaLabel,
    softCtaTitle: softCta.softCtaTitle,
    softCtaBody: softCta.softCtaBody,
    trackingGuideId: guide.id,
  };
}
