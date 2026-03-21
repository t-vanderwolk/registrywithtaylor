import PostContent from '@/components/blog/PostContent';
import DecisionHelper from '@/components/guides/DecisionHelper';
import GuideCTARibbon from '@/components/guides/GuideCTARibbon';
import GuideContinueExploring from '@/components/guides/GuideContinueExploring';
import GuideFaqAccordion from '@/components/guides/GuideFaqAccordion';
import GuideHero from '@/components/guides/GuideHero';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import GuideTableOfContents from '@/components/guides/GuideTableOfContents';
import GuideTrackedLink from '@/components/guides/GuideTrackedLink';
import ProductExampleCard from '@/components/guides/ProductExampleCard';
import SlideSection from '@/components/guides/SlideSection';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import type { GuideHubLink } from '@/lib/guides/hubs';
import type { GuideCardItem } from '@/lib/guides/presentation';

interface GuideEducationLayoutProps {
  guide: {
    id: string;
    title: string;
    slug: string;
    category: string;
    content: string;
    affiliateModules: any[];
    faqItems: any[];
    founderSignatureEnabled?: boolean;
    founderSignatureText?: string;
    consultationCtaEnabled?: boolean;
    consultationCtaLabel?: string;
    newsletterCtaEnabled?: boolean;
    newsletterCtaHref?: string;
    newsletterCtaLabel?: string;
    nextStepCtaHref?: string;
    nextStepCtaLabel?: string;
    takeaways?: string[];
  };
  relatedGuides?: GuideCardItem[];
  preview?: boolean;
  sourceRoute: string;
  displayDate: Date;
  readingTime: number;
}

type GuideSectionItem = {
  id: string;
  title: string;
  content: string;
};

function formatArticleDate(value: Date) {
  return value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function slugifySectionTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripMarkdown(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[*_`>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractLeadCopy(content: string) {
  const paragraphs = content
    .split('\n\n')
    .map((block) => block.trim())
    .filter((block) => block && !block.startsWith('#'));

  return paragraphs.slice(0, 2).join(' ');
}

function extractGuideSections(content: string): GuideSectionItem[] {
  const lines = content.split('\n');
  const sections: GuideSectionItem[] = [];
  let currentSection: { id: string; title: string; content: string[] } | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push({
          id: currentSection.id,
          title: currentSection.title,
          content: currentSection.content.join('\n').trim(),
        });
      }

      const title = line.replace(/^##\s+/, '').trim();
      currentSection = {
        id: slugifySectionTitle(title) || `section-${sections.length + 1}`,
        title,
        content: [],
      };
      continue;
    }

    if (!currentSection) {
      currentSection = {
        id: 'guide-overview',
        title: 'Guide overview',
        content: [],
      };
    }

    currentSection.content.push(rawLine);
  }

  if (currentSection) {
    sections.push({
      id: currentSection.id,
      title: currentSection.title,
      content: currentSection.content.join('\n').trim(),
    });
  }

  return sections.filter((section) => section.content.trim());
}

function summarizeSection(content: string) {
  const plainText = stripMarkdown(content);
  if (!plainText) {
    return 'Use this section to narrow the decision without rereading the whole guide.';
  }

  return plainText.length > 140 ? `${plainText.slice(0, 137).trim()}...` : plainText;
}

function shouldUseSoftGuideCtas({
  slug,
  category,
  sourceRoute,
}: {
  slug: string;
  category: string;
  sourceRoute: string;
}) {
  const context = `${slug} ${category} ${sourceRoute}`.toLowerCase();
  return context.includes('registry') || context.includes('nursery');
}

export default function GuideEducationLayout({
  guide,
  relatedGuides = [],
  preview = false,
  sourceRoute,
  displayDate,
  readingTime,
}: GuideEducationLayoutProps) {
  const sections = extractGuideSections(guide.content);
  const leadCopy = extractLeadCopy(guide.content);
  const tocItems = sections.map((section) => ({
    id: section.id,
    label: section.title,
    level: 2 as const,
  }));
  const decisionItems = sections.slice(0, 3).map((section) => ({
    question: section.title,
    optionLabel: 'Focus here first',
    result: summarizeSection(section.content),
    href: `${sourceRoute}#${section.id}`,
    ctaLabel: 'Jump to section',
    icon: 'strategy' as const,
  }));
  const continueLinks: GuideHubLink[] = relatedGuides.slice(0, 4).map((item) => ({
    title: item.title,
    description: item.description,
    href: item.href,
    icon: 'book',
  }));
  const faqItems = guide.faqItems.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));
  const useSoftGuideCtas = shouldUseSoftGuideCtas({
    slug: guide.slug,
    category: guide.category,
    sourceRoute,
  });
  const actionClassName =
    'inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 hover:scale-[1.02] hover:shadow-md';
  const primaryActionClassName = `${actionClassName} border border-[rgba(215,161,175,0.26)] bg-[linear-gradient(135deg,#D88EA2_0%,#C77D97_100%)] text-white shadow-[0_16px_34px_rgba(199,125,151,0.24)]`;
  const slideDeckId = `guide-slide-deck-${guide.slug}`;
  const slideItems = [
    { id: 'guide-overview', label: 'Overview', shortLabel: 'Start' },
    { id: 'guide-start-here', label: 'Start Here', shortLabel: 'Map' },
    ...sections.map((section, index) => ({
      id: section.id,
      label: section.title,
      shortLabel: String(index + 1).padStart(2, '0'),
    })),
    { id: 'guide-next-steps', label: 'Next Steps', shortLabel: 'Next' },
  ];

  return (
    <GuideSlideDeck containerId={slideDeckId} items={slideItems}>
      <SlideSection id="guide-overview" background="ivory" innerClassName="max-w-none px-0 py-0">
        <GuideHero
          parentLink={{ href: '/guides', label: 'TMBC Education Hub' }}
          eyebrow={guide.category}
          title={guide.title}
          description={
            leadCopy ||
            'Clear, practical guidance to help you understand what matters first, what can wait, and what to do next.'
          }
          readTime={`${readingTime} min`}
          publishedLabel={formatArticleDate(displayDate)}
          sectionCount={sections.length}
          jumpLinks={slideItems.slice(1, 7).map((item) => ({ label: item.label, href: `${sourceRoute}#${item.id}` }))}
          imageSrc={undefined}
          imageAlt={guide.title}
          variant="default"
        />
      </SlideSection>

      <SlideSection id="guide-start-here" background="white">
        <div className="space-y-8">
          <GuideCTARibbon
            eyebrow="Start here"
            title="Use the guide like a planning tool, not a reading assignment."
            description="Jump into the part that matches your biggest question first. The rest can come after you know what actually matters."
            primaryCta={
              tocItems[0]
                ? {
                    href: `${sourceRoute}#${tocItems[0].id}`,
                    label: `Jump to ${tocItems[0].label}`,
                    ...(useSoftGuideCtas ? { variant: 'accent' as const } : {}),
                  }
                : null
            }
            secondaryCta={
              guide.nextStepCtaHref
                ? {
                    href: guide.nextStepCtaHref,
                    label: guide.nextStepCtaLabel?.trim() || 'Explore the next guide',
                    variant: 'secondary' as const,
                  }
                : null
            }
          />

          <div className="space-y-4">
            <GuideTableOfContents currentPath={sourceRoute} items={tocItems} mode="mobile" />
            <GuideTableOfContents currentPath={sourceRoute} items={tocItems} mode="desktop" layout="band" />
          </div>

          {leadCopy ? (
            <MarketingSurface className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">What this guide helps sort out</p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">{leadCopy}</p>
            </MarketingSurface>
          ) : null}

          <DecisionHelper
            eyebrow="Decision helper"
            title="How to move through this guide"
            description="Start with the section that sounds the most like your current question. That is usually enough to make the rest easier to read."
            items={decisionItems}
          />
        </div>
      </SlideSection>

      {sections.map((section, index) => {
        const nextSection = sections[index + 1] ?? null;

        return (
          <SlideSection
            key={section.id}
            id={section.id}
            background={index % 2 === 0 ? 'blush' : 'ivory'}
          >
            <div className="grid gap-8 xl:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)] xl:items-start">
              <div className="space-y-5">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/82">
                    Section {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="font-serif text-[2rem] leading-[1.02] tracking-tight text-charcoal md:text-[2.5rem]">
                    {section.title}
                  </h2>
                  <p className="text-base leading-relaxed text-neutral-700 md:text-lg">
                    {summarizeSection(section.content)}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-[rgba(196,156,94,0.12)] bg-white/76 p-5 shadow-sm">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-black/46">Keep moving</p>
                  <p className="mt-3 text-base leading-relaxed text-neutral-700">
                    Let this section narrow the next question instead of reopening the whole category.
                  </p>
                </div>

                <a
                  href={nextSection ? `${sourceRoute}#${nextSection.id}` : `${sourceRoute}#guide-next-steps`}
                  className="inline-flex min-h-[44px] items-center rounded-full border border-[rgba(215,161,175,0.24)] bg-white px-5 py-3 text-sm font-semibold text-charcoal transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  Continue to {nextSection ? nextSection.title : 'Next Steps'}
                </a>
              </div>

              <MarketingSurface className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm md:p-8">
                <h2 className="mb-6 text-2xl font-serif tracking-tight text-charcoal md:text-3xl">{section.title}</h2>
                <PostContent
                  postId={`${guide.id}-${section.id}`}
                  content={section.content}
                  variant="guide"
                  className="guide-post-content guide-slide-content"
                />
              </MarketingSurface>
            </div>
          </SlideSection>
        );
      })}

      <SlideSection id="guide-next-steps" background="white">
        <div className="space-y-8">
          {guide.affiliateModules.length > 0 ? (
            <section className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Product examples</p>
                <h2 className="font-serif text-2xl tracking-tight text-charcoal md:text-3xl">A few examples to make the tradeoffs easier to picture</h2>
                <p className="max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">
                  These are here to give the category some shape, not to turn the page into a shopping grid.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {guide.affiliateModules.map((module) => (
                  <ProductExampleCard
                    key={module.id}
                    brand={module.retailerLabel}
                    name={module.productName}
                    image={
                      module.imageUrl
                        ? {
                            src: module.imageUrl,
                            alt: module.productName,
                            objectClassName: 'object-cover',
                          }
                        : null
                    }
                    imageHref={module.destinationUrl}
                    imageLinkLabel={module.ctaLabel}
                    description={module.description}
                    bestFor={module.title}
                    standout={module.notes ?? undefined}
                    actionSlot={
                      <GuideTrackedLink
                        guideId={guide.id}
                        href={module.destinationUrl}
                        event={GuideAnalyticsEvents.AFFILIATE_CLICK}
                        sourceRoute={sourceRoute}
                        className="inline-flex min-h-[44px] items-center rounded-full border border-[rgba(215,161,175,0.36)] bg-white px-5 py-3 text-sm font-semibold text-charcoal transition duration-200 hover:scale-[1.02] hover:shadow-md"
                        track={!preview}
                        meta={{
                          moduleTitle: module.title,
                          productName: module.productName,
                          ctaLabel: module.ctaLabel,
                          retailerLabel: module.retailerLabel,
                          partnerId: module.partnerId,
                        }}
                      >
                        <span>{module.ctaLabel}</span>
                        <span aria-hidden="true" className="ml-2">
                          -&gt;
                        </span>
                      </GuideTrackedLink>
                    }
                  />
                ))}
              </div>
            </section>
          ) : null}

          {continueLinks.length > 0 ? (
            <GuideContinueExploring
              title="Continue exploring"
              description="The point is to leave the page knowing where to go next, not to keep wandering."
              links={continueLinks}
            />
          ) : null}

          {faqItems.length > 0 ? <GuideFaqAccordion items={faqItems} /> : null}

          {guide.founderSignatureEnabled && guide.founderSignatureText ? (
            <MarketingSurface className="rounded-2xl border border-[rgba(196,156,94,0.2)] bg-[linear-gradient(180deg,#fff8f6_0%,#fbf7f2_100%)] p-6 shadow-sm md:p-8">
              <p className="font-script text-[2rem] leading-none text-[var(--color-accent-dark)]">Taylor</p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">{guide.founderSignatureText}</p>
            </MarketingSurface>
          ) : null}

          <GuideCTARibbon
            eyebrow="Next step"
            title="Keep the momentum once the guide gets you close."
            description="The goal is a calmer decision, a clearer shortlist, and one obvious next move."
            actionsSlot={
              <>
                {guide.consultationCtaEnabled ? (
                  <GuideTrackedLink
                    guideId={guide.id}
                    href="/book"
                    event={GuideAnalyticsEvents.TO_CONSULTATION_CLICK}
                    sourceRoute={sourceRoute}
                    className={primaryActionClassName}
                    track={!preview}
                    meta={{
                      ctaLabel: guide.consultationCtaLabel?.trim() || 'Book a Consultation',
                      placement: 'bottom_band',
                      slug: guide.slug,
                      title: guide.title,
                    }}
                  >
                    {guide.consultationCtaLabel?.trim() || 'Book a Consultation'}
                  </GuideTrackedLink>
                ) : null}

                {guide.newsletterCtaEnabled && guide.newsletterCtaHref ? (
                  <GuideTrackedLink
                    guideId={guide.id}
                    href={guide.newsletterCtaHref}
                    event={GuideAnalyticsEvents.NEWSLETTER_CTA_CLICK}
                    sourceRoute={sourceRoute}
                    className={`${actionClassName} border border-[rgba(215,161,175,0.36)] bg-white/90 text-charcoal`}
                    track={!preview}
                    meta={{
                      ctaLabel: guide.newsletterCtaLabel?.trim() || 'Get the resource',
                      placement: 'bottom_band',
                    }}
                  >
                    {guide.newsletterCtaLabel?.trim() || 'Get the resource'}
                  </GuideTrackedLink>
                ) : null}

                {guide.nextStepCtaHref ? (
                  <GuideTrackedLink
                    guideId={guide.id}
                    href={guide.nextStepCtaHref}
                    event={GuideAnalyticsEvents.NEWSLETTER_CTA_CLICK}
                    sourceRoute={sourceRoute}
                    className={`${actionClassName} border border-[rgba(215,161,175,0.36)] bg-white/90 text-charcoal`}
                    track={!preview}
                    meta={{
                      ctaLabel: guide.nextStepCtaLabel?.trim() || 'Explore the next guide',
                      placement: 'bottom_band',
                      slug: guide.slug,
                      title: guide.title,
                    }}
                  >
                    {guide.nextStepCtaLabel?.trim() || 'Explore the next guide'}
                  </GuideTrackedLink>
                ) : null}
              </>
            }
          />
        </div>
      </SlideSection>
    </GuideSlideDeck>
  );
}
