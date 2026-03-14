import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
import { getGuidePillar, getRelatedGuidePillars } from '@/lib/marketing/siteContent';
import { buildMarketingMetadata, SITE_URL } from '@/lib/marketing/metadata';
import { toGuideCardItemFromGuide, toGuideCardItemFromPillar } from '@/lib/guides/presentation';
import { getGuideDisplayDate, isGuidePubliclyVisible } from '@/lib/guides/status';
import { guideArticleSelect, toGuideArticleRecord } from '@/lib/server/guideArticleRecord';
import prisma from '@/lib/server/prisma';
import { isGuideStorageUnavailableError } from '@/lib/server/guideStorage';
import '../../../styles/blog.css';

export const dynamic = 'force-dynamic';

const fallbackGuideHeroImage = '/assets/hero/hero-baby-editorial-v2.jpg' as const;

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

const getGuide = cache(async (slug: string) =>
  {
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

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (guide && isGuidePubliclyVisible(guide.status, guide.scheduledFor)) {
    const articleGuide = toGuideArticleRecord(guide);
    const metadataTitle = guide.seoTitle?.trim() || `${guide.title} | Taylor-Made Baby Co.`;
    const description =
      guide.seoDescription?.trim() ||
      guide.excerpt?.trim() ||
      articleGuide.intro?.trim() ||
      'Expert baby gear and baby preparation guidance from Taylor-Made Baby Co.';
    const canonical = guide.canonicalUrl?.trim() || `/guides/${guide.slug}`;
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
        canonical,
      },
      openGraph: {
        title: guide.ogTitle?.trim() || guide.seoTitle?.trim() || guide.title,
        description: guide.ogDescription?.trim() || description,
        type: 'article',
        url: `${SITE_URL}/guides/${guide.slug}`,
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

  const pillar = getGuidePillar(slug);
  if (!pillar) {
    return {};
  }

  return buildMarketingMetadata({
    title: pillar.seoTitle,
    description: pillar.seoDescription,
    path: `/guides/${pillar.slug}`,
    imagePath: fallbackGuideHeroImage,
    imageAlt: pillar.imageAlt,
  });
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (guide && isGuidePubliclyVisible(guide.status, guide.scheduledFor)) {
    const fallbackPillar = getGuidePillar(slug);
    const articleGuide = toGuideArticleRecord(guide);
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
            heroImageUrl: true,
            heroImageAlt: true,
          },
        }).catch((error) => {
          if (isGuideStorageUnavailableError(error)) {
            return [];
          }

          throw error;
        });

    const relatedCards = [
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
          description: guide.seoDescription?.trim() || guide.excerpt?.trim() || articleGuide.intro?.trim() || guide.title,
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
          mainEntityOfPage: guide.canonicalUrl?.trim()
            ? toAbsoluteUrl(guide.canonicalUrl)
            : `${SITE_URL}/guides/${guide.slug}`,
          author: {
            '@type': 'Person',
            name: articleGuide.author.name,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Taylor-Made Baby Co.',
            url: SITE_URL,
          },
          image: guide.heroImageUrl ? [toAbsoluteUrl(guide.heroImageUrl)] : undefined,
          inLanguage: 'en-US',
        },
        ...(articleGuide.faqItems.length > 0
          ? [
              {
                '@type': 'FAQPage',
                mainEntity: articleGuide.faqItems.map((entry) => ({
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
      <SiteShell currentPath="/guides">
        <main className="site-main" style={{ backgroundColor: 'var(--tmbc-blog-ivory)' }}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <GuideArticleView guide={articleGuide} relatedGuides={relatedCards.slice(0, 3)} />
        </main>
      </SiteShell>
    );
  }

  const pillar = getGuidePillar(slug);
  if (!pillar) {
    notFound();
  }

  const relatedGuides = getRelatedGuidePillars(pillar.slug);

  return (
    <SiteShell currentPath={`/guides/${pillar.slug}`}>
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
