import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';
import SiteShell from '@/components/SiteShell';
import CTASection from '@/components/marketing/CTASection';
import GuideGrid from '@/components/marketing/GuideGrid';
import GuideArticleView from '@/components/guides/GuideArticleView';
import MarketingSection from '@/components/layout/MarketingSection';
import CheckIcon from '@/components/ui/CheckIcon';
import Hero from '@/components/ui/Hero';
import MarketingSurface from '@/components/ui/MarketingSurface';
import SectionIntro from '@/components/ui/SectionIntro';
import { extractFaqEntries, stripMarkdown } from '@/lib/blog/contentText';
import {
  getGuideParentSlug,
  getGuidePath,
  getGuideRouteSegment,
  resolveGuideSlugFromRouteSegment,
} from '@/lib/guides/routing';
import { toGuideCardItemFromGuide, toGuideCardItemFromPillar } from '@/lib/guides/presentation';
import { getGuideDisplayDate, isGuidePubliclyVisible } from '@/lib/guides/status';
import { getGuidePillar, getRelatedGuidePillars } from '@/lib/marketing/siteContent';
import { buildMarketingMetadata, SITE_URL } from '@/lib/marketing/metadata';
import { guideArticleSelect, toGuideArticleRecord, type GuideArticleRecord } from '@/lib/server/guideArticleRecord';
import prisma from '@/lib/server/prisma';
import { isGuideStorageUnavailableError } from '@/lib/server/guideStorage';
import '../../styles/blog.css';

const fallbackGuideHeroImage = '/assets/hero/hero-baby-editorial-v2.jpg' as const;
const strollerGuideMenuOrder = new Map(
  ['full-size-modular-strollers', 'compact-lightweight-strollers', 'travel-strollers', 'jogging-all-terrain-strollers', 'double-strollers'].map(
    (slug, index) => [slug, index],
  ),
);

const getGuide = cache(async (slug: string) => {
  try {
    return await prisma.guide.findUnique({
      where: { slug },
      select: guideArticleSelect,
    });
  } catch (error) {
    if (isGuideStorageUnavailableError(error)) {
      return null;
    }

    throw error;
  }
});

const toAbsoluteUrl = (pathOrUrl: string) => {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return new URL(pathOrUrl, SITE_URL).toString();
};

function getGuideDescriptionFallback(guide: GuideArticleRecord) {
  const combinedContent = [guide.intro, guide.content, guide.conclusion].filter(Boolean).join(' ');
  const plainText = stripMarkdown(combinedContent);

  return plainText ? plainText.slice(0, 180).trim() : null;
}

type GuideRouteOptions = {
  slug: string;
  subSlug?: string | null;
};

export async function getGuidePageMetadata({
  slug,
  subSlug = null,
}: GuideRouteOptions): Promise<Metadata> {
  const internalGuideSlug = resolveGuideSlugFromRouteSegment(subSlug ?? slug);
  const guide = await getGuide(internalGuideSlug);

  if (guide && isGuidePubliclyVisible(guide.status, guide.scheduledFor)) {
    const resolvedParentSlug = getGuideParentSlug({ slug: guide.slug, topicCluster: guide.topicCluster });
    const expectedParentSegment = resolvedParentSlug ? getGuideRouteSegment(resolvedParentSlug) : null;

    if (subSlug && expectedParentSegment !== slug) {
      return {};
    }

    const articleGuide = toGuideArticleRecord(guide);
    const guidePath = getGuidePath({ slug: guide.slug, topicCluster: guide.topicCluster });
    const metadataTitle = guide.seoTitle?.trim() || `${guide.title} | Taylor-Made Baby Co.`;
    const description =
      guide.seoDescription?.trim() ||
      guide.excerpt?.trim() ||
      getGuideDescriptionFallback(articleGuide) ||
      'Expert baby gear and baby preparation guidance from Taylor-Made Baby Co.';
    const imageUrl = guide.ogImageUrl?.trim() || guide.heroImageUrl?.trim() || fallbackGuideHeroImage;
    const keywords = [
      guide.targetKeyword,
      ...guide.secondaryKeywords,
      guide.category,
      'Taylor-Made Baby Co.',
      'baby gear guidance',
    ].filter((value, index, collection): value is string => Boolean(value) && collection.indexOf(value) === index);

    return {
      title: metadataTitle,
      description,
      keywords,
      alternates: {
        canonical: guidePath,
      },
      openGraph: {
        title: guide.ogTitle?.trim() || guide.seoTitle?.trim() || guide.title,
        description: guide.ogDescription?.trim() || description,
        type: 'article',
        url: toAbsoluteUrl(guidePath),
        publishedTime: getGuideDisplayDate(guide).toISOString(),
        modifiedTime: guide.updatedAt.toISOString(),
        authors: [articleGuide.author.name],
        tags: keywords,
        images: imageUrl
          ? [
              {
                url: toAbsoluteUrl(imageUrl),
                alt: guide.ogImageAlt?.trim() || guide.heroImageAlt?.trim() || guide.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: imageUrl ? 'summary_large_image' : 'summary',
        title: guide.ogTitle?.trim() || guide.seoTitle?.trim() || guide.title,
        description: guide.ogDescription?.trim() || description,
        images: imageUrl ? [toAbsoluteUrl(imageUrl)] : undefined,
      },
    };
  }

  if (subSlug) {
    return {};
  }

  const internalPillarSlug = resolveGuideSlugFromRouteSegment(slug);
  const pillar = getGuidePillar(internalPillarSlug);
  if (!pillar) {
    return {};
  }

  return buildMarketingMetadata({
    title: pillar.seoTitle,
    description: pillar.seoDescription,
    path: getGuidePath({ slug: pillar.slug }),
    imagePath: fallbackGuideHeroImage,
    imageAlt: pillar.imageAlt,
  });
}

export async function renderGuideRoute({
  slug,
  subSlug = null,
}: GuideRouteOptions) {
  const internalGuideSlug = resolveGuideSlugFromRouteSegment(subSlug ?? slug);
  const guide = await getGuide(internalGuideSlug);

  if (guide && isGuidePubliclyVisible(guide.status, guide.scheduledFor)) {
    const resolvedParentSlug = getGuideParentSlug({ slug: guide.slug, topicCluster: guide.topicCluster });
    const expectedParentSegment = resolvedParentSlug ? getGuideRouteSegment(resolvedParentSlug) : null;
    const expectedGuideSegment = getGuideRouteSegment(guide.slug);
    const guidePath = getGuidePath({ slug: guide.slug, topicCluster: guide.topicCluster });

    if (subSlug) {
      if (!expectedParentSegment) {
        notFound();
      }

      if (slug !== expectedParentSegment || subSlug !== expectedGuideSegment) {
        redirect(guidePath);
      }
    } else if (expectedParentSegment || slug !== expectedGuideSegment) {
      redirect(guidePath);
    }

    const fallbackPillar = getGuidePillar(resolvedParentSlug ?? guide.slug);
    const articleGuide = toGuideArticleRecord(guide);
    const articleContent = [articleGuide.intro, articleGuide.content, articleGuide.conclusion].filter(Boolean).join('\n\n');
    const articleDescription =
      guide.seoDescription?.trim() ||
      guide.excerpt?.trim() ||
      getGuideDescriptionFallback(articleGuide) ||
      guide.title;
    const articleImage = guide.ogImageUrl?.trim() || guide.heroImageUrl?.trim() || fallbackGuideHeroImage;
    const faqEntries = [
      ...articleGuide.faqItems.map((entry) => ({
        question: entry.question,
        answer: entry.answer,
      })),
      ...extractFaqEntries(articleContent),
    ].filter(
      (entry, index, collection) =>
        collection.findIndex(
          (candidate) =>
            candidate.question.toLowerCase() === entry.question.toLowerCase() &&
            candidate.answer.toLowerCase() === entry.answer.toLowerCase(),
        ) === index,
    );

    const relatedGuides = guide.relatedGuideIds.length
      ? await prisma.guide.findMany({
          where: {
            id: {
              in: guide.relatedGuideIds,
            },
            OR: [
              { status: 'PUBLISHED' },
              {
                status: 'SCHEDULED',
                scheduledFor: {
                  lte: new Date(),
                },
              },
            ],
          },
          select: {
            slug: true,
            title: true,
            excerpt: true,
            category: true,
            topicCluster: true,
            heroImageUrl: true,
            heroImageAlt: true,
          },
        }).catch((error) => {
          if (isGuideStorageUnavailableError(error)) {
            return [];
          }

          throw error;
        })
      : await prisma.guide.findMany({
          where: {
            id: {
              not: guide.id,
            },
            category: guide.category,
            OR: [
              { status: 'PUBLISHED' },
              {
                status: 'SCHEDULED',
                scheduledFor: {
                  lte: new Date(),
                },
              },
            ],
          },
          orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
          take: 3,
          select: {
            slug: true,
            title: true,
            excerpt: true,
            category: true,
            topicCluster: true,
            heroImageUrl: true,
            heroImageAlt: true,
          },
        }).catch((error) => {
          if (isGuideStorageUnavailableError(error)) {
            return [];
          }

          throw error;
        });

    const strollerCategoryCards =
      guide.slug === 'best-strollers'
        ? relatedGuides
            .filter((entry) => getGuideParentSlug({ slug: entry.slug, topicCluster: entry.topicCluster }) === guide.slug)
            .sort(
              (left, right) =>
                (strollerGuideMenuOrder.get(left.slug) ?? Number.MAX_SAFE_INTEGER) -
                  (strollerGuideMenuOrder.get(right.slug) ?? Number.MAX_SAFE_INTEGER) ||
                left.title.localeCompare(right.title),
            )
            .map((entry) => toGuideCardItemFromGuide(entry))
        : [];

    const relatedCards =
      guide.slug === 'best-strollers'
        ? (fallbackPillar ? getRelatedGuidePillars(fallbackPillar.slug).map((entry) => toGuideCardItemFromPillar(entry)) : [])
        : [
            ...relatedGuides.map((entry) => toGuideCardItemFromGuide(entry)),
            ...(fallbackPillar
              ? getRelatedGuidePillars(fallbackPillar.slug).map((entry) => toGuideCardItemFromPillar(entry))
              : []),
          ].filter(
            (entry, index, collection) =>
              entry.slug !== guide.slug && collection.findIndex((candidate) => candidate.slug === entry.slug) === index,
          );
    const displayDate = getGuideDisplayDate(guide);
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: guide.seoTitle?.trim() || guide.title,
          description: articleDescription,
          articleSection: guide.category,
          keywords: [
            guide.targetKeyword,
            ...guide.secondaryKeywords,
            guide.category,
            'Taylor-Made Baby Co.',
            'baby gear guidance',
          ].filter(Boolean),
          datePublished: displayDate.toISOString(),
          dateModified: guide.updatedAt.toISOString(),
          mainEntityOfPage: toAbsoluteUrl(guidePath),
          author: {
            '@type': 'Person',
            name: articleGuide.author.name,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Taylor-Made Baby Co.',
            url: SITE_URL,
          },
          image: articleImage ? [toAbsoluteUrl(articleImage)] : undefined,
          inLanguage: 'en-US',
        },
        ...(faqEntries.length > 0
          ? [
              {
                '@type': 'FAQPage',
                mainEntity: faqEntries.map((entry) => ({
                  '@type': 'Question',
                  name: entry.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: entry.answer,
                  },
                })),
              },
            ]
          : []),
      ],
    };

    return (
      <SiteShell currentPath={guidePath}>
        <main className="site-main" style={{ backgroundColor: 'var(--tmbc-blog-ivory)' }}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <GuideArticleView
            guide={articleGuide}
            relatedGuides={relatedCards.slice(0, 3)}
            categoryGuides={strollerCategoryCards}
          />
        </main>
      </SiteShell>
    );
  }

  if (subSlug) {
    notFound();
  }

  const internalPillarSlug = resolveGuideSlugFromRouteSegment(slug);
  const pillar = getGuidePillar(internalPillarSlug);
  if (!pillar) {
    notFound();
  }

  const pillarPath = getGuidePath({ slug: pillar.slug });
  if (slug !== getGuideRouteSegment(pillar.slug)) {
    redirect(pillarPath);
  }

  const relatedGuides = getRelatedGuidePillars(pillar.slug);

  return (
    <SiteShell currentPath={pillarPath}>
      <main className="site-main">
        <Hero
          className="homepage-hero"
          eyebrow={pillar.eyebrow}
          title={pillar.title}
          subtitle={pillar.overview}
          primaryCta={{ label: 'Book a Consultation', href: '/consultation' }}
          secondaryCta={{ label: 'Explore the Guides', href: '/guides' }}
          tagline={pillar.shortTitle}
          image={fallbackGuideHeroImage}
          imageAlt={pillar.imageAlt}
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <MarketingSection tone="white" spacing="spacious">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-16">
            <div>
              <SectionIntro
                align="left"
                eyebrow="What this guide helps you decide"
                title={`Use ${pillar.shortTitle} guidance to compare the right tradeoffs instead of chasing every option.`}
                description={pillar.description}
                contentWidthClassName="max-w-2xl"
              />

              <div className="mt-8 space-y-4">
                {pillar.focusAreas.map((focusArea) => (
                  <div key={focusArea} className="flex items-start gap-4">
                    <CheckIcon />
                    <p className="max-w-none text-sm leading-7 text-neutral-700">{focusArea}</p>
                  </div>
                ))}
              </div>
            </div>

            <MarketingSurface className="bg-[linear-gradient(180deg,#ffffff_0%,#fdf7f4_100%)]">
              <p className="text-[0.72rem] uppercase tracking-[0.2em] text-black/45">Questions this page should answer</p>
              <div className="mt-6 space-y-4">
                {pillar.quickQuestions.map((question) => (
                  <div key={question} className="rounded-[1.2rem] border border-black/6 bg-white px-4 py-4">
                    <p className="max-w-none text-sm leading-7 text-neutral-700">{question}</p>
                  </div>
                ))}
              </div>
            </MarketingSurface>
          </div>
        </MarketingSection>

        <GuideGrid
          guides={relatedGuides.map((entry) => toGuideCardItemFromPillar(entry))}
          compact
          eyebrow="Related guides"
          title="Keep building your plan with the next category that connects to this decision."
          description="Each pillar guide should move parents deeper into the right adjacent topic, not back into generic browsing."
        />

        <CTASection
          eyebrow="When a guide is not enough"
          title={`Book a consultation when you want ${pillar.shortTitle.toLowerCase()} advice matched to your specific life.`}
          description="Taylor's advisory work applies expert recommendation logic to your home, budget, vehicle, storage, routine, and long-term plan."
        />
      </main>
    </SiteShell>
  );
}
