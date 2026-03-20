import Image from 'next/image';
import Link from 'next/link';
import GuideGrid from '@/components/marketing/GuideGrid';
import PostContent from '@/components/blog/PostContent';
import GuideCategoryDecisionSystem from '@/components/guides/GuideCategoryDecisionSystem';
import GuideHubLayout from '@/components/guides/GuideHubLayout';
import GuideEducationLayout from '@/components/guides/GuideEducationLayout';
import GuideTrackedLink from '@/components/guides/GuideTrackedLink';
import GuideViewTracker from '@/components/guides/GuideViewTracker';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { GuideAnalyticsEvents, getGuideDestinationEvent } from '@/lib/guides/events';
import { getGuideHubConfig } from '@/lib/guides/hubs';
import { getGuidePath } from '@/lib/guides/routing';
import { isCarSeatCategoryGuideSlug } from '@/lib/guides/carSeatCategoryGuides';
import { isStrollerCategoryGuideSlug } from '@/lib/guides/strollerCluster';
import { getAnalyticsPageType } from '@/lib/analytics';
import { isRemoteImageUrl } from '@/lib/blog/images';
import type { GuideCardItem } from '@/lib/guides/presentation';
import { getGuideDisplayDate } from '@/lib/guides/status';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';
import { getPublishedStrollerJournalLinks } from '@/lib/server/strollerJournal';
import { slugify } from '@/lib/slugify';

type TocItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

const formatArticleDate = (value: Date) =>
  value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

function stripMarkdown(value: string) {
  return value
    .replace(/[*_`>#-]/g, ' ')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTocItems(content: string): TocItem[] {
  const lines = content.split('\n');
  const usedIds = new Map<string, number>();

  return lines.flatMap((rawLine) => {
    const line = rawLine.trim();

    if (!line.startsWith('## ') && !line.startsWith('### ')) {
      return [];
    }

    const level = line.startsWith('### ') ? 3 : 2;
    const label = stripMarkdown(line.replace(/^###?\s+/, ''));
    if (!label) {
      return [];
    }

    const baseId = slugify(label) || 'section';
    const seenCount = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, seenCount + 1);

    return [
      {
        id: seenCount === 0 ? baseId : `${baseId}-${seenCount + 1}`,
        label,
        level,
      },
    ];
  });
}

function getDisclosureText(guide: GuideArticleRecord) {
  return (
    guide.affiliateDisclosureText?.trim() ||
    'Some links in this guide are affiliate links. Taylor-Made Baby Co. may earn a commission at no additional cost to you.'
  );
}

function DisclosureCard({ text }: { text: string }) {
  return (
    <MarketingSurface className="rounded-[1.75rem] border border-black/6 bg-white/90 p-5 text-sm leading-7 text-neutral-700">
      {text}
    </MarketingSurface>
  );
}

function AuthorAvatar({ guide }: { guide: GuideArticleRecord }) {
  const authorName = guide.author.name.trim();
  const shouldSkipAvatarOptimization = isRemoteImageUrl(guide.author.avatarUrl);

  if (guide.author.avatarUrl) {
    return (
      <Image
        src={guide.author.avatarUrl}
        alt={authorName}
        width={56}
        height={56}
        className="h-14 w-14 rounded-full object-cover"
        unoptimized={shouldSkipAvatarOptimization}
      />
    );
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent-dark)] text-sm font-semibold uppercase tracking-[0.18em] text-white">
      {authorName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)}
    </div>
  );
}

export default async function GuideArticleView({
  guide,
  relatedGuides = [],
  categoryGuides = [],
  preview = false,
}: {
  guide: GuideArticleRecord;
  relatedGuides?: GuideCardItem[];
  categoryGuides?: GuideCardItem[];
  preview?: boolean;
}) {
  const displayDate = getGuideDisplayDate(guide);
  const articleContent = [guide.intro, guide.content, guide.conclusion].filter(Boolean).join('\n\n');
  const tocItems = guide.tableOfContentsEnabled ? extractTocItems(articleContent) : [];
  const sourceRoute = preview
    ? `/admin/guides/${guide.id}/preview`
    : getGuidePath({ slug: guide.slug, topicCluster: guide.topicCluster });
  const heroImage = guide.heroImageUrl?.trim() || null;
  const heroAlt = guide.heroImageAlt?.trim() || guide.title;
  const shouldSkipHeroImageOptimization = isRemoteImageUrl(heroImage);
  const disclosureText = getDisclosureText(guide);
  const showDisclosureAfterIntro = guide.affiliateDisclosureEnabled && guide.affiliateDisclosurePlacement === 'after_intro';
  const showDisclosureBeforeConclusion =
    guide.affiliateDisclosureEnabled && guide.affiliateDisclosurePlacement === 'before_conclusion';
  const showDisclosureBeforeAffiliates =
    guide.affiliateDisclosureEnabled &&
    (!guide.affiliateDisclosurePlacement || guide.affiliateDisclosurePlacement === 'before_affiliates');
  const nextStepEvent = guide.nextStepCtaHref ? getGuideDestinationEvent(guide.nextStepCtaHref) : null;
  const nextStepDestinationPageType = guide.nextStepCtaHref ? getAnalyticsPageType(guide.nextStepCtaHref) : null;
  const wordCount = stripMarkdown(articleContent).split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(3, Math.round(wordCount / 190));
  const primarySectionCount = tocItems.filter((item) => item.level === 2).length || tocItems.length || 1;
  const snapshotItems = [
    { label: 'Category', value: guide.category },
    { label: 'Published', value: formatArticleDate(displayDate) },
    { label: 'Read time', value: `${readingTime} min` },
    { label: 'Sections', value: String(primarySectionCount) },
  ];
  const showCategoryMenu = !preview && guide.slug === 'best-strollers' && categoryGuides.length > 0;
  const pillarPreviewTopics = tocItems.filter((item) => item.level === 2).slice(0, 4);
  const hubConfig = getGuideHubConfig(guide.slug, sourceRoute);
  const useStrollerCategoryLiveLayout = isStrollerCategoryGuideSlug(guide.slug);
  const useCarSeatCategoryLiveLayout = isCarSeatCategoryGuideSlug(guide.slug);
  const strollerJournalLinks =
    guide.slug === 'best-strollers' || useStrollerCategoryLiveLayout
      ? await getPublishedStrollerJournalLinks(guide.slug)
      : [];

  if (hubConfig) {
    return (
      <>
        <GuideViewTracker
          guideId={guide.id}
          sourceRoute={sourceRoute}
          slug={guide.slug}
          title={guide.title}
          enabled={!preview}
        />

        <GuideHubLayout
          guide={guide}
          relatedGuides={relatedGuides}
          strollerJournalLinks={strollerJournalLinks}
          preview={preview}
          sourceRoute={sourceRoute}
          displayDate={displayDate}
          readingTime={readingTime}
          disclosureText={disclosureText}
          nextStepEvent={nextStepEvent}
          nextStepDestinationPageType={nextStepDestinationPageType}
        />
      </>
    );
  }

  if (useStrollerCategoryLiveLayout) {
    return (
      <>
        <GuideViewTracker
          guideId={guide.id}
          sourceRoute={sourceRoute}
          slug={guide.slug}
          title={guide.title}
          enabled={!preview}
        />

        <GuideCategoryDecisionSystem
          guide={guide}
          displayDate={displayDate}
          readingTime={readingTime}
          sourceRoute={sourceRoute}
        />
      </>
    );
  }

  if (useCarSeatCategoryLiveLayout) {
    return (
      <>
        <GuideViewTracker
          guideId={guide.id}
          sourceRoute={sourceRoute}
          slug={guide.slug}
          title={guide.title}
          enabled={!preview}
        />

        <GuideCategoryDecisionSystem
          guide={guide}
          displayDate={displayDate}
          readingTime={readingTime}
          sourceRoute={sourceRoute}
        />
      </>
    );
  }

  return (
    <>
      <GuideViewTracker
        guideId={guide.id}
        sourceRoute={sourceRoute}
        slug={guide.slug}
        title={guide.title}
        enabled={!preview}
      />

      <GuideEducationLayout
        guide={{
          id: guide.id,
          title: guide.title,
          slug: guide.slug,
          category: guide.category,
          content: articleContent,
          affiliateModules: guide.affiliateModules,
          faqItems: guide.faqItems || [],
          takeaways: [], // TODO: Extract from content or add to guide model
          founderSignatureEnabled: guide.founderSignatureEnabled,
          founderSignatureText: guide.founderSignatureText || undefined,
          consultationCtaEnabled: guide.consultationCtaEnabled,
          consultationCtaLabel: guide.consultationCtaLabel || undefined,
          newsletterCtaEnabled: guide.newsletterCtaEnabled,
          newsletterCtaHref: guide.newsletterCtaHref || undefined,
          newsletterCtaLabel: guide.newsletterCtaLabel || undefined,
          nextStepCtaHref: guide.nextStepCtaHref || undefined,
          nextStepCtaLabel: guide.nextStepCtaLabel || undefined,
        }}
        relatedGuides={relatedGuides}
        preview={preview}
        sourceRoute={sourceRoute}
        displayDate={displayDate}
        readingTime={readingTime}
      />
    </>
  );
}
