import PostContent from '@/components/blog/PostContent';
import GuideCTARibbon from '@/components/guides/GuideCTARibbon';
import GuideContinueExploring from '@/components/guides/GuideContinueExploring';
import GuideFaqAccordion, { type GuideFaqAccordionItem } from '@/components/guides/GuideFaqAccordion';
import GuideNextGuides from '@/components/guides/GuideNextGuides';
import ProgressIndicator, { type ProgressIndicatorItem } from '@/components/guides/ProgressIndicator';
import SlideSection from '@/components/guides/SlideSection';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { buildGuideOutline, splitGuideSectionContent } from '@/lib/guides/articleOutline';
import { extractSectionSummary, stripSectionHeading } from '@/lib/guides/decisionSystemContent';
import { getGuideHubConfig, type GuideNextGuideItem } from '@/lib/guides/hubs';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

const registrySlideContainerId = 'registry-guide-slide-container';

const registryStepConfig = [
  { match: 'foundation', id: 'registry-foundation', label: '01 Foundation', shortLabel: '01' },
  { match: 'daily function', id: 'registry-function', label: '02 Function', shortLabel: '02' },
  { match: 'platforms', id: 'registry-platforms', label: '03 Platforms', shortLabel: '03' },
  { match: 'compare', id: 'registry-compare', label: '04 Compare', shortLabel: '04' },
  { match: 'optimize', id: 'registry-optimize', label: '05 Optimize', shortLabel: '05' },
  { match: 'decide', id: 'registry-decide', label: '06 Decide', shortLabel: '06' },
  { match: 'refine', id: 'registry-refine', label: '07 Refine', shortLabel: '07' },
] as const;

function formatArticleDate(value: Date) {
  return value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function findSectionByTitle(
  sections: ReturnType<typeof buildGuideOutline>['sections'],
  title: string,
) {
  return sections.find((section) => section.title.toLowerCase() === title.toLowerCase()) ?? null;
}

function SurfaceLabel({
  children,
  tone = 'accent',
}: {
  children: string;
  tone?: 'accent' | 'neutral';
}) {
  return (
    <p
      className={`text-[0.68rem] uppercase tracking-[0.22em] ${
        tone === 'accent' ? 'text-[var(--color-accent-dark)]/78' : 'text-black/45'
      }`}
    >
      {children}
    </p>
  );
}

function parseLabeledRows(content: string) {
  return stripSectionHeading(content)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const match = line.match(/^([^:]+):\s*(.+)$/);
      if (!match) {
        return [];
      }

      return [
        {
          label: match[1]?.trim() ?? '',
          value: match[2]?.trim() ?? '',
        },
      ];
    })
    .filter((row) => row.label && row.value);
}

export default function RegistryGuideSlideLayout({
  guide,
  sourceRoute,
  displayDate,
  readingTime,
  faqEntries,
  nextGuideItems,
}: {
  guide: GuideArticleRecord;
  sourceRoute: string;
  displayDate: Date;
  readingTime: number;
  faqEntries: GuideFaqAccordionItem[];
  nextGuideItems: GuideNextGuideItem[];
}) {
  const articleContent = [guide.intro, guide.content, guide.conclusion].filter(Boolean).join('\n\n');
  const outline = buildGuideOutline(articleContent);
  const hubConfig = getGuideHubConfig(guide.slug, sourceRoute);
  const supportLinks = hubConfig?.supportLinks ?? [];
  const introSection = findSectionByTitle(outline.sections, 'Baby Registry');
  const youAreHereSection = findSectionByTitle(outline.sections, 'YOU ARE HERE');
  const whatThisGuideCoversSection = findSectionByTitle(outline.sections, 'What This Guide Covers');
  const registrySystemSection = findSectionByTitle(outline.sections, 'The Registry System');
  const decisionGuideSection = findSectionByTitle(outline.sections, 'DECISION GUIDE');
  const commonMistakesSection = findSectionByTitle(outline.sections, 'COMMON MISTAKES');
  const keyRuleSection = findSectionByTitle(outline.sections, 'KEY RULE');
  const nextStepsSection = findSectionByTitle(outline.sections, 'NEXT STEPS');
  const takeawaysSection = findSectionByTitle(outline.sections, 'TAKEAWAYS');
  const youAreHereRows = parseLabeledRows(youAreHereSection?.content ?? '');
  const registrySystemBreakdown = splitGuideSectionContent(stripSectionHeading(registrySystemSection?.content ?? ''));
  const registrySystemSteps = registryStepConfig.flatMap((config) => {
    const subsection =
      registrySystemBreakdown.subsections.find((item) => item.title.toLowerCase().includes(config.match)) ?? null;

    if (!subsection) {
      return [];
    }

    const cleanedContent = stripSectionHeading(subsection.content);

    return [
      {
        ...config,
        title: subsection.title,
        summary: extractSectionSummary(cleanedContent),
        content: cleanedContent,
      },
    ];
  });
  const slideItems: ProgressIndicatorItem[] = [
    { id: 'registry-you-are-here', label: 'You Are Here', shortLabel: 'Start' },
    { id: 'registry-system-overview', label: 'System Overview', shortLabel: 'Map' },
    ...registrySystemSteps.map((step) => ({
      id: step.id,
      label: step.label,
      shortLabel: step.shortLabel,
    })),
    { id: 'registry-decision-guide', label: 'Decision Guide', shortLabel: 'Guide' },
    { id: 'registry-next-steps', label: 'Next Steps', shortLabel: 'Next' },
  ];
  const overviewContent = [
    stripSectionHeading(whatThisGuideCoversSection?.content ?? ''),
    registrySystemBreakdown.introContent.trim(),
  ]
    .filter(Boolean)
    .join('\n\n');
  const primaryNextStepCta = guide.nextStepCtaHref
    ? {
        href: guide.nextStepCtaHref,
        label: guide.nextStepCtaLabel?.trim() || 'Explore More Guides',
        variant: 'accent' as const,
      }
    : supportLinks[0]
      ? {
          href: supportLinks[0].href,
          label: supportLinks[0].title,
          variant: 'accent' as const,
        }
      : null;
  const consultationCta = guide.consultationCtaEnabled
    ? {
        href: '/book',
        label: guide.consultationCtaLabel?.trim() || 'Book a Consultation',
        variant: 'secondary' as const,
      }
    : null;
  const stats = [
    { label: 'Read time', value: `${readingTime} min` },
    { label: 'Published', value: formatArticleDate(displayDate) },
    { label: 'Slides', value: String(slideItems.length) },
  ];

  return (
    <div className="relative md:flex md:h-full md:min-h-0 md:flex-col">
      <div className="mx-auto w-full max-w-[1680px] md:flex-1 md:min-h-0 xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-6">
        <div
          id={registrySlideContainerId}
          className="snap-none scroll-smooth md:h-full md:min-h-0 md:snap-y md:snap-mandatory md:overflow-y-auto xl:pr-2"
        >
          <SlideSection id="registry-you-are-here" background="ivory">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(19rem,0.92fr)] lg:items-center lg:gap-10">
              <div className="space-y-8">
                <div className="space-y-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/82">{guide.category}</p>
                  <h1 className="max-w-[14ch] font-serif text-4xl tracking-tight text-charcoal md:text-5xl">
                    {guide.title}
                  </h1>
                </div>

                {introSection ? (
                  <MarketingSurface className="border-[rgba(196,156,94,0.12)] bg-white/92 shadow-[0_16px_42px_rgba(0,0,0,0.06)]">
                    <PostContent
                      postId={`${guide.id}-registry-intro`}
                      content={stripSectionHeading(introSection.content)}
                      className="guide-post-content guide-slide-content"
                      variant="guide"
                    />
                  </MarketingSurface>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  {stats.map((stat) => (
                    <div
                      key={`${stat.label}-${stat.value}`}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[rgba(196,156,94,0.14)] bg-white/84 px-4 py-2 text-sm text-neutral-700 shadow-sm"
                    >
                      <span className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">
                        {stat.label}
                      </span>
                      <span className="text-charcoal">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  {slideItems.slice(1, 5).map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="inline-flex min-h-[44px] items-center rounded-full border border-[rgba(215,161,175,0.22)] bg-[#FFFBFC] px-4 py-2 text-sm text-charcoal transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <MarketingSurface className="border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,#FFFDFD_0%,#FBF2F5_100%)] shadow-[0_18px_44px_rgba(0,0,0,0.06)]">
                <div className="space-y-4">
                  <SurfaceLabel>You are here</SurfaceLabel>
                  {youAreHereRows.length > 0 ? (
                    <div className="grid gap-3">
                      {youAreHereRows.map((row) => (
                        <div
                          key={`${row.label}-${row.value}`}
                          className="rounded-[1.2rem] border border-[rgba(215,161,175,0.16)] bg-white/76 px-4 py-3"
                        >
                          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/72">
                            {row.label}
                          </p>
                          <p className="mt-2 text-lg leading-relaxed text-charcoal">
                            {row.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : youAreHereSection ? (
                    <PostContent
                      postId={`${guide.id}-registry-you-are-here`}
                      content={stripSectionHeading(youAreHereSection.content)}
                      className="guide-post-content guide-slide-content"
                      variant="guide"
                    />
                  ) : (
                    <p className="text-base leading-relaxed text-neutral-700">
                      Build the registry in the right order first. Product decisions come after the system is clear.
                    </p>
                  )}
                </div>
              </MarketingSurface>
            </div>
          </SlideSection>

          <SlideSection id="registry-system-overview" background="blush">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] xl:items-start">
              <MarketingSurface className="border-[rgba(215,161,175,0.14)] bg-white/90 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
                <div className="space-y-4">
                  <SurfaceLabel>System overview</SurfaceLabel>
                  <h2 className="font-serif text-[2rem] leading-[1.02] tracking-tight text-charcoal md:text-[2.35rem]">
                    The registry works better when the order is doing some of the thinking for you.
                  </h2>
                  {overviewContent ? (
                    <PostContent
                      postId={`${guide.id}-registry-system-overview`}
                      content={overviewContent}
                      className="guide-post-content guide-slide-content"
                      variant="guide"
                    />
                  ) : null}
                </div>
              </MarketingSurface>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {registrySystemSteps.map((step) => (
                  <a
                    key={step.id}
                    href={`#${step.id}`}
                    className="group rounded-[1.6rem] border border-[rgba(196,156,94,0.14)] bg-white/90 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
                  >
                    <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/76">{step.label}</p>
                    <h3 className="mt-3 font-serif text-[1.5rem] leading-[1.05] tracking-tight text-charcoal">{step.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-neutral-700">
                      {step.summary || 'Use this part of the system to keep the next registry decision simpler.'}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </SlideSection>

          {registrySystemSteps.map((step, index) => {
            const nextStep = registrySystemSteps[index + 1] ?? null;
            const nextSlideTarget = nextStep ? `#${nextStep.id}` : '#registry-decision-guide';
            const nextSlideLabel = nextStep ? nextStep.label : 'Decision Guide';

            return (
              <SlideSection
                key={step.id}
                id={step.id}
                background={index % 2 === 0 ? 'ivory' : 'blush'}
              >
                <div className="grid gap-8 xl:grid-cols-[minmax(0,0.38fr)_minmax(0,1fr)] xl:items-start">
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/82">Registry system</p>
                      <h2 className="font-serif text-[2rem] leading-[1.02] tracking-tight text-charcoal md:text-[2.5rem]">
                        {step.label}
                      </h2>
                      <p className="text-base leading-relaxed text-neutral-700 md:text-lg">
                        {step.summary || 'Move through this phase before adding more comparison tabs.'}
                      </p>
                    </div>

                    <div className="rounded-[1.5rem] border border-[rgba(196,156,94,0.12)] bg-white/76 p-5 shadow-sm">
                      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-black/46">Why this slide matters</p>
                      <p className="mt-3 text-base leading-relaxed text-neutral-700">
                        Each phase is meant to narrow the next decision, so the registry gets clearer instead of longer.
                      </p>
                    </div>

                    <a
                      href={nextSlideTarget}
                      className="inline-flex min-h-[44px] items-center rounded-full border border-[rgba(215,161,175,0.24)] bg-white px-5 py-3 text-sm font-semibold text-charcoal transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      Continue to {nextSlideLabel}
                    </a>
                  </div>

                  <MarketingSurface className="border-[rgba(196,156,94,0.12)] bg-white/94 shadow-[0_16px_42px_rgba(0,0,0,0.06)]">
                    <PostContent
                      postId={`${guide.id}-${step.id}`}
                      content={step.content}
                      className="guide-post-content guide-slide-content"
                      variant="guide"
                    />
                  </MarketingSurface>
                </div>
              </SlideSection>
            );
          })}

          <SlideSection id="registry-decision-guide" background="ivory">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] xl:items-start">
              <MarketingSurface className="border-[rgba(215,161,175,0.14)] bg-[linear-gradient(180deg,#FFFDFD_0%,#FBF4F7_100%)] shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
                <div className="space-y-4">
                  <SurfaceLabel>Decision guide</SurfaceLabel>
                  <h2 className="font-serif text-[2rem] leading-[1.02] tracking-tight text-charcoal md:text-[2.35rem]">
                    Use the shorter version when you need to get unstuck without rereading everything.
                  </h2>
                  {decisionGuideSection ? (
                    <PostContent
                      postId={`${guide.id}-registry-decision-guide`}
                      content={stripSectionHeading(decisionGuideSection.content)}
                      className="guide-post-content guide-slide-content"
                      variant="guide"
                    />
                  ) : null}
                </div>
              </MarketingSurface>

              <div className="space-y-4">
                {commonMistakesSection ? (
                  <MarketingSurface className="border-[rgba(196,156,94,0.12)] bg-white/92 shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
                    <div className="space-y-4">
                      <SurfaceLabel tone="neutral">Common mistakes</SurfaceLabel>
                      <PostContent
                        postId={`${guide.id}-registry-common-mistakes`}
                        content={stripSectionHeading(commonMistakesSection.content)}
                        className="guide-post-content guide-slide-content"
                        variant="guide"
                      />
                    </div>
                  </MarketingSurface>
                ) : null}

                {keyRuleSection ? (
                  <MarketingSurface className="border-[rgba(215,161,175,0.14)] bg-white/92 shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
                    <div className="space-y-4">
                      <SurfaceLabel tone="neutral">Key rule</SurfaceLabel>
                      <PostContent
                        postId={`${guide.id}-registry-key-rule`}
                        content={stripSectionHeading(keyRuleSection.content)}
                        className="guide-post-content guide-slide-content"
                        variant="guide"
                      />
                    </div>
                  </MarketingSurface>
                ) : null}
              </div>
            </div>
          </SlideSection>

          <SlideSection id="registry-next-steps" background="blush">
            <div className="space-y-8">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-start">
                <MarketingSurface className="border-[rgba(215,161,175,0.14)] bg-white/92 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
                  <div className="space-y-4">
                    <SurfaceLabel>Next steps</SurfaceLabel>
                    {nextStepsSection ? (
                      <PostContent
                        postId={`${guide.id}-registry-next-steps`}
                        content={stripSectionHeading(nextStepsSection.content)}
                        className="guide-post-content guide-slide-content"
                        variant="guide"
                      />
                    ) : null}
                  </div>
                </MarketingSurface>

                <MarketingSurface className="border-[rgba(196,156,94,0.12)] bg-white/92 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
                  <div className="space-y-4">
                    <SurfaceLabel tone="neutral">Takeaways</SurfaceLabel>
                    {takeawaysSection ? (
                      <PostContent
                        postId={`${guide.id}-registry-takeaways`}
                        content={stripSectionHeading(takeawaysSection.content)}
                        className="guide-post-content guide-slide-content"
                        variant="guide"
                      />
                    ) : (
                      <p className="text-base leading-relaxed text-neutral-700">
                        Start with the system, then let each step narrow the next choice.
                      </p>
                    )}
                  </div>
                </MarketingSurface>
              </div>

              {supportLinks.length > 0 ? (
                <GuideContinueExploring
                  title="Keep moving into the next useful registry question."
                  description="Use the related paths that sharpen the decision instead of opening five new tabs that all sound urgent."
                  links={supportLinks}
                />
              ) : null}

              <GuideCTARibbon
                eyebrow="Next move"
                title="Keep the momentum practical."
                description="Once the sequence feels clear, use the next guide that matches your current question. The goal is a calmer plan, not a bigger list."
                primaryCta={primaryNextStepCta}
                secondaryCta={consultationCta}
              />

              <GuideNextGuides items={nextGuideItems} />

              {faqEntries.length > 0 ? <GuideFaqAccordion items={faqEntries} /> : null}
            </div>
          </SlideSection>
        </div>

        <div className="hidden xl:flex xl:items-center xl:justify-center">
          <ProgressIndicator items={slideItems} containerId={registrySlideContainerId} className="w-full max-w-[12.5rem]" />
        </div>
      </div>
    </div>
  );
}
