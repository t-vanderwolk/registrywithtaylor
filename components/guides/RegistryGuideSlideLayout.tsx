import Link from 'next/link';
import PostContent from '@/components/blog/PostContent';
import AcademyHero from '@/components/guides/academy/AcademyHero';
import type { AcademyStageNavItem } from '@/components/guides/academy/AcademyStageNav';
import DecisionBlock from '@/components/guides/DecisionBlock';
import GuideBreadcrumbs from '@/components/guides/GuideBreadcrumbs';
import GuideBulletSection from '@/components/guides/GuideBulletSection';
import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideFaqAccordion, { type GuideFaqAccordionItem } from '@/components/guides/GuideFaqAccordion';
import GuideJourneyFooter from '@/components/guides/GuideJourneyFooter';
import GuideJourneyIntro from '@/components/guides/GuideJourneyIntro';
import GuideLifestyleGallery from '@/components/guides/GuideLifestyleGallery';
import GuideNextGuides from '@/components/guides/GuideNextGuides';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import SlideSection from '@/components/guides/SlideSection';
import YouAreHere from '@/components/guides/YouAreHere';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { getGuideEcosystemCurrentStep } from '@/lib/ecosystem';
import { buildGuideOutline, splitGuideSectionContent } from '@/lib/guides/articleOutline';
import { extractSectionSummary, stripSectionHeading } from '@/lib/guides/decisionSystemContent';
import {
  getGuideBlogRecommendations,
  getGuideBreadcrumbs,
  getGuideJourneyPath,
  getGuideLifestyleImages,
  getGuideRealLifePrompt,
} from '@/lib/guides/experience';
import {
  getGuideFinalThought,
  getGuideSignOff,
  getGuideTakeaways,
  getGuideWhatThisIs,
  getGuideWhyItExists,
} from '@/lib/guides/editorialSystem';
import {
  dedupeTextItems,
  extractMarkdownListItems,
  getDefaultNextSteps,
  getGuideOrientation,
  getStandardGuideSlideItems,
  guideHubLinkToNextStepLink,
  normalizeGuideLinks,
} from '@/lib/guides/guideFlow';
import { resolveGuideHeroImage } from '@/lib/guides/heroImages';
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

type RegistryRouteButtonGroup = {
  label: string;
  links: Array<{
    label: string;
    href: string;
  }>;
};

function parseRegistryRouteButtonGroups(content: string) {
  const groups: RegistryRouteButtonGroup[] = [];
  let currentGroup: RegistryRouteButtonGroup | null = null;
  const lines = stripSectionHeading(content)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const headingMatch = line.match(/^([^:]+):$/);
    if (headingMatch && !line.includes('/guides')) {
      currentGroup = {
        label: headingMatch[1]?.trim() ?? 'Start here',
        links: [],
      };
      groups.push(currentGroup);
      continue;
    }

    const matches = [...line.matchAll(/[→-]?\s*([^:\n]+?):\s*(\/guides(?:\/[^\s→]+)?)/g)];
    if (matches.length === 0) {
      continue;
    }

    if (!currentGroup) {
      currentGroup = {
        label: 'Start here',
        links: [],
      };
      groups.push(currentGroup);
    }

    for (const match of matches) {
      currentGroup.links.push({
        label: match[1]?.trim() ?? 'Open guide',
        href: match[2]?.trim() ?? '/guides',
      });
    }
  }

  return groups.filter((group) => group.links.length > 0);
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
  const breadcrumbs = getGuideBreadcrumbs({
    slug: guide.slug,
    title: guide.title,
    topicCluster: guide.topicCluster,
  });
  const lifestyleImages = getGuideLifestyleImages({
    slug: guide.slug,
    category: guide.category,
    topicCluster: guide.topicCluster,
  });
  const blogRecommendations = getGuideBlogRecommendations({
    slug: guide.slug,
    category: guide.category,
    topicCluster: guide.topicCluster,
  });
  const journeyPath = getGuideJourneyPath({
    slug: guide.slug,
    title: guide.title,
    topicCluster: guide.topicCluster,
  });
  const introSection = findSectionByTitle(outline.sections, 'Baby Registry');
  const youAreHereSection = findSectionByTitle(outline.sections, 'YOU ARE HERE');
  const whatThisGuideCoversSection = findSectionByTitle(outline.sections, 'What This Guide Covers');
  const registrySystemSection = findSectionByTitle(outline.sections, 'The Registry System');
  const decisionGuideSection = findSectionByTitle(outline.sections, 'DECISION GUIDE');
  const commonMistakesSection = findSectionByTitle(outline.sections, 'COMMON MISTAKES');
  const keyRuleSection = findSectionByTitle(outline.sections, 'KEY RULE');
  const nextStepsSection = findSectionByTitle(outline.sections, 'NEXT STEPS');
  const takeawaysSection = findSectionByTitle(outline.sections, 'TAKEAWAYS');
  const whatThisIs = getGuideWhatThisIs({
    guide: {
      slug: guide.slug,
      title: guide.title,
      category: guide.category,
      topicCluster: guide.topicCluster,
    },
    outline,
  });
  const whyItExists = getGuideWhyItExists({
    guide: {
      slug: guide.slug,
      category: guide.category,
      topicCluster: guide.topicCluster,
    },
    outline,
  });
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
      ...getDefaultNextSteps({ slug: guide.slug, topicCluster: guide.topicCluster }),
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
  const routeButtonGroups = parseRegistryRouteButtonGroups(nextStepsSection?.content ?? '');
  const finalThought = getGuideFinalThought({
    guide: {
      slug: guide.slug,
      category: guide.category,
      topicCluster: guide.topicCluster,
    },
    outline,
  });
  const takeaways = getGuideTakeaways({
    guide: { slug: guide.slug },
    outline,
    extraItems: [
      ...extractMarkdownListItems(takeawaysSection?.content ?? '', 4),
      ...extractMarkdownListItems(keyRuleSection?.content ?? '', 2),
      'Build the registry in the right order before comparing products.',
    ],
  });
  const signOff = getGuideSignOff({
    founderSignatureEnabled: guide.founderSignatureEnabled,
    founderSignatureText: guide.founderSignatureText,
  });
  const heroImage = resolveGuideHeroImage({
    slug: guide.slug,
    title: guide.title,
    category: guide.category,
    topicCluster: guide.topicCluster,
    imageSrc: guide.heroImageUrl,
    imageAlt: guide.heroImageAlt,
  });
  const registryHeroImage = guide.heroImageUrl?.trim()
    ? heroImage
    : {
        src: '/assets/hero/hero-03.jpg',
        alt: 'Editorial hero image for registry planning and baby gear guidance.',
      };

  return (
    <GuideSlideDeck
      containerId="registry-guide-slide-container"
      items={slideItems}
      backLink={{ href: '/guides', label: 'Back to TMBC Hub' }}
      ecosystemCurrentStep={getGuideEcosystemCurrentStep({
        slug: guide.slug,
        path: sourceRoute,
        category: guide.category,
      })}
      journeyPathLabels={journeyPath}
    >
      <SlideSection id={slideItems[0].id} background="ivory">
        <div className="space-y-8">
          <GuideBreadcrumbs items={breadcrumbs} />

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
            imageSrc={registryHeroImage.src}
            imageAlt={registryHeroImage.alt}
            imageAspectClassName="aspect-[16/11]"
            imageObjectClassName="object-cover object-[74%_center]"
            imagePriority
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
        <div className="space-y-6">
          <GuideJourneyIntro
            title="Start here before the registry turns into a longer list."
            description="The parent registry guide should make the system feel smaller and more orderly before you start comparing categories, retailers, or perks."
            intro={[
              'Registry planning works better when the system comes first. The list gets calmer once timing, category priorities, and room for later decisions are doing more of the work.',
              'Use this page to understand the registry sequence, then move into the narrower sub-guide that matches the question you are actually asking.',
            ]}
            calloutBody={getGuideRealLifePrompt({
              slug: guide.slug,
              category: guide.category,
              topicCluster: guide.topicCluster,
            })}
            whatThisIs={whatThisIs}
            whyItExists={whyItExists}
          />

          <GuideBulletSection
            eyebrow="What It Is"
            title="What It Is"
            description="This is the short editorial frame before the registry gets more detailed."
            items={dedupeTextItems(
              [
                whatThisIs,
                whyItExists,
                ...(extractMarkdownListItems(whatThisGuideCoversSection?.content ?? '', 3).length > 0
                  ? extractMarkdownListItems(whatThisGuideCoversSection?.content ?? '', 3)
                  : registrySystemSteps.map((step) => step.title)),
              ],
              5,
            )}
            editorialImage={{
              eyebrow: 'Editorial image',
              src: '/assets/services/smartbuying.jpeg',
              alt: 'Smart buying editorial image for registry planning.',
              caption: 'A smarter registry starts when the buying decisions follow a clearer system instead of a louder category.',
            }}
          />

          {whatThisGuideCoversSection ? (
            <MarketingSurface className="border-[rgba(215,161,175,0.14)] bg-white/92 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
              <PostContent
                postId={`${guide.id}-registry-covers`}
                content={stripSectionHeading(whatThisGuideCoversSection.content)}
                className="guide-post-content guide-slide-content"
                variant="guide"
              />
            </MarketingSurface>
          ) : null}

          {lifestyleImages.length > 0 ? <GuideLifestyleGallery images={lifestyleImages} /> : null}
        </div>
      </SlideSection>

      <SlideSection id={slideItems[3].id} background="ivory">
        <div className="space-y-8">
          <MarketingSurface className="border-[rgba(215,161,175,0.14)] bg-white/92 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <div className="space-y-4">
              <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">What Matters</p>
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
          eyebrow="What People Get Wrong"
          title="What People Get Wrong"
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
          {routeButtonGroups.length > 0 ? (
            <MarketingSurface className="border-[rgba(215,161,175,0.14)] bg-white/92 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">Start Here</p>
                  <h2 className="font-serif text-[2rem] leading-[1.02] tracking-tight text-charcoal md:text-[2.35rem]">
                    Use the next route while the registry order is still clear.
                  </h2>
                  <p className="max-w-4xl text-base leading-8 text-[#5B4B55] md:text-lg">
                    If the list finally feels calmer, hand off into the next category with a cleaner sequence instead of
                    reopening five tabs and pretending that counts as progress.
                  </p>
                </div>

                <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                  {routeButtonGroups.map((group, groupIndex) => (
                    <div
                      key={group.label}
                      className="rounded-[1.45rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.82)] p-4 sm:rounded-[1.6rem] sm:p-5"
                    >
                      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">{group.label}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {group.links.map((link, linkIndex) => {
                          const isPrimary = groupIndex === 0 && linkIndex === 0;

                          return (
                            <Link
                              key={`${group.label}-${link.href}-${link.label}`}
                              href={link.href}
                              className={
                                isPrimary
                                  ? 'inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#A15B72] px-6 py-3 text-center text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62] sm:w-auto'
                                  : 'inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/88 px-5 py-3 text-center text-sm font-medium text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:w-auto'
                              }
                            >
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </MarketingSurface>
          ) : nextStepsSection ? (
            <MarketingSurface className="border-[rgba(215,161,175,0.14)] bg-white/92 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
              <PostContent
                postId={`${guide.id}-registry-next-steps`}
                content={stripSectionHeading(nextStepsSection.content)}
                className="guide-post-content guide-slide-content"
                variant="guide"
              />
            </MarketingSurface>
          ) : null}

          <GuideJourneyFooter
            finalThought={finalThought}
            takeaways={takeaways}
            signOff={signOff}
            nextSteps={nextSteps}
            nextStepsDescription="Once the registry sequence is clearer, use the next guide that matches the question in front of you."
            blogRecommendations={blogRecommendations}
            consultationEnabled={guide.consultationCtaEnabled !== false}
            consultationLabel={guide.consultationCtaLabel}
          />

          <GuideNextGuides items={nextGuideItems} />

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
