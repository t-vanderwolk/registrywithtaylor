import PostContent from '@/components/blog/PostContent';
import AcademyHero from '@/components/guides/academy/AcademyHero';
import type { AcademyStageNavItem } from '@/components/guides/academy/AcademyStageNav';
import DecisionBlock from '@/components/guides/DecisionBlock';
import GuideBulletSection from '@/components/guides/GuideBulletSection';
import GuideFaqAccordion, { type GuideFaqAccordionItem } from '@/components/guides/GuideFaqAccordion';
import GuideNextGuides from '@/components/guides/GuideNextGuides';
import NextSteps from '@/components/guides/NextSteps';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import SlideSection from '@/components/guides/SlideSection';
import YouAreHere from '@/components/guides/YouAreHere';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { buildGuideOutline, splitGuideSectionContent } from '@/lib/guides/articleOutline';
import { extractSectionSummary, stripSectionHeading } from '@/lib/guides/decisionSystemContent';
import {
  dedupeTextItems,
  extractMarkdownListItems,
  getGuideOrientation,
  getStandardGuideSlideItems,
  guideHubLinkToNextStepLink,
  normalizeGuideLinks,
} from '@/lib/guides/guideFlow';
import { getGuideHubConfig, type GuideNextGuideItem } from '@/lib/guides/hubs';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

const registryStepConfig = [
  { match: 'foundation', id: 'registry-foundation', label: '01 Foundation' },
  { match: 'daily function', id: 'registry-function', label: '02 Function' },
  { match: 'platforms', id: 'registry-platforms', label: '03 Platforms' },
  { match: 'compare', id: 'registry-compare', label: '04 Compare' },
  { match: 'optimize', id: 'registry-optimize', label: '05 Optimize' },
  { match: 'decide', id: 'registry-decide', label: '06 Decide' },
  { match: 'refine', id: 'registry-refine', label: '07 Refine' },
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
  const slideItems = getStandardGuideSlideItems('guide');
  const fallbackOrientation = getGuideOrientation({ slug: guide.slug, category: guide.category, topicCluster: guide.topicCluster });
  const orientation = {
    step: (youAreHereRows.find((row) => row.label.toLowerCase() === 'step')?.value as typeof fallbackOrientation.step) || fallbackOrientation.step,
    category: youAreHereRows.find((row) => row.label.toLowerCase() === 'category')?.value || fallbackOrientation.category,
    goal: youAreHereRows.find((row) => row.label.toLowerCase() === 'goal')?.value || fallbackOrientation.goal,
  };
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
  const heroStageItems: AcademyStageNavItem[] = [
    {
      id: 'start',
      label: 'Start',
      title: 'Get the registry sequence clear',
      description: 'Start with the order before the products and perks start shouting.',
      href: `${sourceRoute}#${slideItems[1].id}`,
    },
    {
      id: 'compare',
      label: 'Compare',
      title: 'See what this guide covers',
      description: 'Use the system overview and phase cards to understand the sequence.',
      href: `${sourceRoute}#${slideItems[3].id}`,
    },
    {
      id: 'decide',
      label: 'Decide',
      title: 'Use the shorter decision logic',
      description: 'Move into the decision guide once the system already makes sense.',
      href: `${sourceRoute}#${slideItems[4].id}`,
    },
    {
      id: 'refine',
      label: 'Refine',
      title: 'Keep the next step obvious',
      description: 'Use the next guide links while the registry plan is still fresh.',
      href: `${sourceRoute}#${slideItems[6].id}`,
    },
  ];
  const nextSteps = normalizeGuideLinks(
    [
      {
        href: '/guides',
        label: 'TMBC Education Hub',
        description: 'Return to the wider guide system if a different category needs to be solved next.',
        stage: 'Start' as const,
      },
      ...(guide.nextStepCtaHref
        ? [
            {
              href: guide.nextStepCtaHref,
              label: guide.nextStepCtaLabel?.trim() || 'Open the next guide',
              description: 'Use the next linked guide while the registry order is still clear.',
              stage: 'Refine' as const,
            },
          ]
        : []),
      ...supportLinks.map((link) => guideHubLinkToNextStepLink(link, 'Refine')),
    ],
    4,
  );
  const takeaways = dedupeTextItems(
    [
      ...extractMarkdownListItems(takeawaysSection?.content ?? '', 4),
      ...extractMarkdownListItems(keyRuleSection?.content ?? '', 2),
      'Build the registry in the right order before comparing products.',
    ],
    4,
  );

  return (
    <GuideSlideDeck
      containerId="registry-guide-slide-container"
      items={slideItems}
      backLink={{ href: '/guides', label: 'Back to TMBC Hub' }}
    >
      <SlideSection id={slideItems[0].id} background="ivory">
        <div className="space-y-8">
          <AcademyHero
            eyebrow={guide.category}
            title={guide.title}
            description="Registry planning works better when the system comes first. This Academy path turns the list into a guided decision instead of a longer tab problem."
            note="Build the registry in the right order first. Product decisions come after the system is clear."
            primaryCta={{ href: `${sourceRoute}#${slideItems[3].id}`, label: 'Start the Registry Academy' }}
            secondaryCta={nextSteps[0] ? { href: nextSteps[0].href, label: nextSteps[0].label } : undefined}
            stageItems={heroStageItems}
            stats={[
              { label: 'Read time', value: `${readingTime} min` },
              { label: 'Published', value: formatArticleDate(displayDate) },
              { label: 'Phases', value: String(registrySystemSteps.length || 7) },
            ]}
            parentLink={{ href: '/guides', label: 'TMBC Education Hub' }}
          />

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
        </div>
      </SlideSection>

      <SlideSection id={slideItems[1].id} background="white">
        <YouAreHere step={orientation.step} category={orientation.category} goal={orientation.goal} />
      </SlideSection>

      <SlideSection id={slideItems[2].id} background="blush">
        <GuideBulletSection
          eyebrow="What This Guide Covers"
          title="What This Guide Covers"
          description="The registry hub should stay readable at a glance."
          items={
            extractMarkdownListItems(whatThisGuideCoversSection?.content ?? '', 5).length > 0
              ? extractMarkdownListItems(whatThisGuideCoversSection?.content ?? '', 5)
              : dedupeTextItems(registrySystemSteps.map((step) => step.title), 5)
          }
        />
      </SlideSection>

      <SlideSection id={slideItems[3].id} background="ivory">
        <div className="space-y-8">
          <MarketingSurface className="border-[rgba(215,161,175,0.14)] bg-white/92 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <div className="space-y-4">
              <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">Core Content</p>
              <h2 className="font-serif text-[2rem] leading-[1.02] tracking-tight text-charcoal md:text-[2.35rem]">
                The registry works better when the order is doing some of the thinking for you.
              </h2>
              {registrySystemBreakdown.introContent ? (
                <PostContent
                  postId={`${guide.id}-registry-system-overview`}
                  content={registrySystemBreakdown.introContent}
                  className="guide-post-content guide-slide-content"
                  variant="guide"
                />
              ) : null}
            </div>
          </MarketingSurface>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {registrySystemSteps.map((step) => (
              <section
                key={step.id}
                className="rounded-[1.6rem] border border-[rgba(196,156,94,0.14)] bg-white/90 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.05)]"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/76">{step.label}</p>
                <h3 className="mt-3 font-serif text-[1.5rem] leading-[1.05] tracking-tight text-charcoal">{step.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-700">
                  {step.summary || 'Use this phase to keep the next registry decision smaller and calmer.'}
                </p>
              </section>
            ))}
          </div>
        </div>
      </SlideSection>

      <SlideSection id={slideItems[4].id} background="white">
        <div className="space-y-8">
          <DecisionBlock
            title="Use the shorter decision guide when you need to get unstuck."
            description="This is the quick registry logic when you want the answer without rereading the whole system."
            items={[
              {
                condition: 'are still building the list from scratch',
                recommendation: 'Start with Foundation and Function before you compare products or retailers.',
                href: `${sourceRoute}#${slideItems[3].id}`,
              },
              {
                condition: 'are comparing retailers or perks too early',
                recommendation: 'Move back to Platforms and Compare so the setup decision happens in the right order.',
                href: `${sourceRoute}#${slideItems[3].id}`,
              },
              {
                condition: 'feel like the list is getting longer instead of clearer',
                recommendation: 'Use Optimize, Decide, and Refine to cut duplicates and tighten what really belongs.',
                href: `${sourceRoute}#${slideItems[6].id}`,
              },
            ]}
          />

          {decisionGuideSection ? (
            <MarketingSurface className="border-[rgba(215,161,175,0.14)] bg-[linear-gradient(180deg,#FFFDFD_0%,#FBF4F7_100%)] shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
              <PostContent
                postId={`${guide.id}-registry-decision-guide`}
                content={stripSectionHeading(decisionGuideSection.content)}
                className="guide-post-content guide-slide-content"
                variant="guide"
              />
            </MarketingSurface>
          ) : null}
        </div>
      </SlideSection>

      <SlideSection id={slideItems[5].id} background="blush">
        <GuideBulletSection
          eyebrow="Common Mistakes"
          title="Common Mistakes"
          description="These are the practical misses that usually turn a registry into a longer, noisier list."
          items={
            extractMarkdownListItems(commonMistakesSection?.content ?? '', 5).length > 0
              ? extractMarkdownListItems(commonMistakesSection?.content ?? '', 5)
              : [
                  'Adding products before the order of decisions is clear.',
                  'Comparing retailers and perks before the list foundation is built.',
                  'Treating every category like it belongs on the first-pass registry.',
                ]
          }
        />
      </SlideSection>

      <SlideSection id={slideItems[6].id} background="ivory">
        <div className="space-y-8">
          {nextStepsSection ? (
            <MarketingSurface className="border-[rgba(215,161,175,0.14)] bg-white/92 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
              <PostContent
                postId={`${guide.id}-registry-next-steps`}
                content={stripSectionHeading(nextStepsSection.content)}
                className="guide-post-content guide-slide-content"
                variant="guide"
              />
            </MarketingSurface>
          ) : null}

          <NextSteps
            title="Next Steps"
            description="Once the registry sequence is clearer, use the next guide that matches the question in front of you."
            links={nextSteps}
          />

          <GuideNextGuides items={nextGuideItems} />
        </div>
      </SlideSection>

      <SlideSection id={slideItems[7].id} background="white">
        <div className="space-y-8">
          <GuideBulletSection
            eyebrow="Takeaways"
            title="Takeaways"
            description="If you only keep the short version, keep these."
            items={takeaways}
          />

          {keyRuleSection ? (
            <MarketingSurface className="border-[rgba(196,156,94,0.12)] bg-white/92 shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
              <div className="space-y-4">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Key Rule</p>
                <PostContent
                  postId={`${guide.id}-registry-key-rule`}
                  content={stripSectionHeading(keyRuleSection.content)}
                  className="guide-post-content guide-slide-content"
                  variant="guide"
                />
              </div>
            </MarketingSurface>
          ) : null}

          {faqEntries.length > 0 ? <GuideFaqAccordion items={faqEntries} /> : null}
        </div>
      </SlideSection>
    </GuideSlideDeck>
  );
}
