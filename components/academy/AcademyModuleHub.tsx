import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  AcademyRouteCard,
  AcademySectionHeading,
} from '@/components/academy/AcademyPrimitives';
import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import ClarityCallout from '@/components/academy/ClarityCallout';
import DecisionCard from '@/components/academy/DecisionCard';
import DecisionBlock from '@/components/academy/DecisionBlock';
import DecisionTag from '@/components/academy/DecisionTag';
import HowToDecideBlock from '@/components/academy/HowToDecideBlock';
import NextBestDecisionCard from '@/components/academy/NextBestDecisionCard';
import ProductInsightCard from '@/components/academy/ProductInsightCard';
import StartHere from '@/components/academy/StartHere';
import TaylorsNoteCard from '@/components/academy/TaylorsNoteCard';
import WhatDoesntMatterList from '@/components/academy/WhatDoesntMatterList';
import WhatMattersList from '@/components/academy/WhatMattersList';
import GuideBreadcrumbs from '@/components/guides/GuideBreadcrumbs';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import YouAreHereCard from '@/components/academy/YouAreHereCard';
import type {
  AcademyBreadcrumbItem,
  AcademyModuleSlug,
  AcademyPathSlug,
  AcademyProductExample,
} from '@/lib/academy/content';
import { getAcademyPathData } from '@/lib/academy/content';
import {
  getAcademyPhaseLabel,
  getConnectedAcademyPaths,
  getModuleDecisionStatement,
  getProductInsights,
  getModuleWhyThisExists,
  getQuickCheckLines,
  getQuickCheckTags,
} from '@/lib/academy/decisionSupport';
import {
  buildAcademyBreadcrumbStructuredData,
  buildAcademyCollectionStructuredData,
} from '@/lib/academy/seo';
import { buildAcademySignatureSystem } from '@/lib/academy/signatureSystem';
import { getCaseStudiesForAcademyModule } from '@/lib/caseStudies';
import { renderTextWithInternalLinks } from '@/lib/internal-links/render';
import { buildAcademyInternalLinkPlan } from '@/lib/internal-links/system';

export type AcademyModuleHubCard = {
  href: string;
  title: string;
  description: string;
  ctaLabel: string;
  eyebrow?: string;
};

type AcademyModuleHubProps = {
  pathSlug: AcademyPathSlug;
  moduleSlug: AcademyModuleSlug;
  breadcrumbs: AcademyBreadcrumbItem[];
  heroEyebrow: string;
  title: string;
  deck: string;
  intro: string[];
  heroImageSrc: string;
  heroImageAlt: string;
  pullQuote: string;
  progress: {
    current: number;
    total: number;
    label: string;
  };
  learningTitle: string;
  learningDescription: string;
  learningHighlights: string[];
  philosophyTitle: string;
  philosophy: string[];
  philosophyNoteTitle: string;
  philosophyNoteBody: string;
  submodulesTitle: string;
  submodulesDescription: string;
  submoduleCards: AcademyModuleHubCard[];
  guidanceEyebrow: string;
  guidanceTitle: string;
  guidanceDescription: string;
  guidanceLines: string[];
  taylorNoteTitle: string;
  taylorNoteBody: string;
  nextTitle: string;
  nextDescription: string;
  nextLinks: AcademyModuleHubCard[];
  groundingExamples?: AcademyProductExample[];
  primaryCta: {
    href: string;
    label: string;
  };
  secondaryCta: {
    href: string;
    label: string;
  };
};

function formatInlineList(items: string[]) {
  if (items.length === 0) {
    return '';
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function uniqueItems(items: Array<string | null | undefined>) {
  return items
    .map((item) => item?.trim() ?? '')
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index);
}

function renderLinkedParagraphs(
  paragraphs: string[],
  suggestions: ReturnType<typeof buildAcademyInternalLinkPlan>['contextualLinks'],
  keyPrefix: string,
  paragraphClassName = 'break-words',
): ReactNode[] {
  const usedHrefs = new Set<string>();

  return paragraphs.map((paragraph, index) => (
    <p key={`${keyPrefix}-${index}`} className={paragraphClassName}>
      {renderTextWithInternalLinks({
        text: paragraph,
        suggestions,
        usedHrefs,
        keyPrefix: `${keyPrefix}-${index}`,
        maxLinks: 1,
        className: 'link-underline transition-colors duration-200 hover:text-neutral-900',
        placement: 'academy',
      })}
    </p>
  ));
}

function buildInlineScenarioExamples(
  signatureScenarios: string[],
  caseStudies: Awaited<ReturnType<typeof getCaseStudiesForAcademyModule>>,
) {
  return uniqueItems([
    ...signatureScenarios,
    ...caseStudies.flatMap((study) =>
      study.scenarios.slice(0, 1).map((scenario) => `${study.title}: ${scenario}`),
    ),
  ]).slice(0, 3);
}

function buildProgressMessage(currentIndex: number, total: number) {
  if (currentIndex <= 0) {
    return 'You are at the first layer inside this path. Start with the loudest decision and let the rest wait its turn.';
  }

  if (currentIndex >= total - 1) {
    return "You've completed this layer. Now use it to make the next one less dramatic.";
  }

  return `You've completed ${currentIndex} ${currentIndex === 1 ? 'layer' : 'layers'}. The next step should feel smaller from here.`;
}

function buildNextDecisionLinks(
  nextLinks: AcademyModuleHubCard[],
  pathSlug: AcademyPathSlug,
) {
  const primary = nextLinks[0] ?? null;
  const secondary =
    nextLinks[1] ?? {
      href: `/academy/${pathSlug}`,
      title: `Back to the ${pathSlug} path`,
      description: 'Zoom back out if you want the wider map before you choose the next detailed layer.',
      ctaLabel: 'View path ->',
    };

  return { primary, secondary };
}

export default async function AcademyModuleHub({
  pathSlug,
  moduleSlug,
  breadcrumbs,
  heroEyebrow,
  title,
  deck,
  intro,
  heroImageSrc,
  heroImageAlt,
  pullQuote,
  progress,
  learningTitle,
  learningDescription,
  learningHighlights,
  philosophyTitle,
  philosophy,
  philosophyNoteTitle,
  philosophyNoteBody,
  submodulesTitle,
  submodulesDescription,
  submoduleCards,
  guidanceEyebrow,
  guidanceTitle,
  guidanceDescription,
  guidanceLines,
  taylorNoteTitle,
  taylorNoteBody,
  nextTitle,
  nextDescription,
  nextLinks,
  groundingExamples = [],
  primaryCta,
  secondaryCta,
}: AcademyModuleHubProps) {
  const pathData = await getAcademyPathData(pathSlug);
  const hubModule = {
    slug: moduleSlug,
    title,
    description: deck,
    subhead: deck,
    intro,
    pathSlug,
    progress: {
      current: progress.current,
      total: progress.total,
    },
    decisionBullets: learningHighlights.slice(0, 3),
    coreSections: [
      {
        title: learningTitle,
        paragraphs: [learningDescription],
      },
      {
        title: guidanceTitle,
        paragraphs: guidanceLines.slice(0, 2),
      },
    ],
    next: nextLinks[0]
      ? {
          href: nextLinks[0].href,
          title: nextLinks[0].title,
          description: nextLinks[0].description,
          ctaLabel: nextLinks[0].ctaLabel,
        }
      : null,
    related: nextLinks[1]
      ? {
          href: nextLinks[1].href,
          title: nextLinks[1].title,
          description: nextLinks[1].description,
          ctaLabel: nextLinks[1].ctaLabel,
        }
      : null,
    previous: null,
    submoduleSection: null,
  };
  const modulePath = `/academy/${pathSlug}/${moduleSlug}`;
  const moduleOverviewLine = `Inside this module: ${formatInlineList(
    submoduleCards.map((card) => card.title).slice(0, 4),
  )}.`;
  const phaseLabel = getAcademyPhaseLabel(hubModule);
  const decisionStatement = getModuleDecisionStatement(hubModule);
  const whyThisExists = getModuleWhyThisExists(hubModule);
  const quickCheckLines = getQuickCheckLines(hubModule);
  const quickCheckTags = getQuickCheckTags(hubModule);
  const signatureSystem = buildAcademySignatureSystem(hubModule, {
    decisionStatement,
    whyThisExists,
    quickCheckLines,
  });
  const caseStudies = getCaseStudiesForAcademyModule(moduleSlug, pathSlug);
  const inlineScenarios = buildInlineScenarioExamples(signatureSystem.scenarios.items, caseStudies);
  const connectedPaths = getConnectedAcademyPaths(pathSlug);
  const internalLinkPlan = buildAcademyInternalLinkPlan({
    href: modulePath as `/${string}`,
    pathSlug,
    slug: moduleSlug,
    title,
    description: deck,
  });
  const groundingInsights =
    groundingExamples.length > 0
      ? getProductInsights({
          ...hubModule,
          products: groundingExamples,
        })
      : [];
  const currentIndex = pathData.moduleCards.findIndex((card) => card.slug === moduleSlug);
  const completedSteps = currentIndex > 0 ? pathData.moduleCards.slice(0, currentIndex) : [];
  const { primary: nextPrimary, secondary: nextSecondary } = buildNextDecisionLinks(nextLinks, pathSlug);
  const progressMessage = buildProgressMessage(
    currentIndex === -1 ? Math.max(progress.current - 1, 0) : currentIndex,
    pathData.moduleCards.length || progress.total,
  );
  const structuredData = [
    buildAcademyBreadcrumbStructuredData({
      breadcrumbs,
      currentPath: modulePath,
    }),
    buildAcademyCollectionStructuredData({
      title,
      description: deck,
      path: modulePath,
      breadcrumbs,
      items: submoduleCards.map((card) => ({
        href: card.href,
        title: card.title,
        description: card.description,
      })),
      keywords: [
        heroEyebrow,
        learningTitle,
        ...learningHighlights.slice(0, 5),
      ],
    }),
  ];

  return (
    <section className="min-h-0 bg-[radial-gradient(circle_at_top_left,rgba(244,224,209,0.7),transparent_30%),radial-gradient(circle_at_top_right,rgba(232,154,174,0.2),transparent_28%),linear-gradient(180deg,#fffdfa_0%,#fcf3f5_34%,#fffdf8_100%)]">
      <AcademyStructuredData data={structuredData} />
      <div className="mx-auto max-w-6xl px-5 pb-8 pt-10 sm:px-8 md:pb-10 md:pt-14 lg:px-10">
        <GuideBreadcrumbs items={breadcrumbs} />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-8 md:pb-10 lg:px-10">
        <YouAreHereCard
          trail={breadcrumbs.map((item) => ({ title: item.label, href: item.href }))}
          progressLabel={`Module ${progress.current} of ${progress.total}`}
          currentTitle={title}
          currentStepLabel={phaseLabel}
          completedSteps={completedSteps}
          nextStep={nextPrimary}
        />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-10 sm:px-8 md:pb-12 lg:px-10">
        <section className="overflow-hidden rounded-[2.15rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,252,253,0.98)_0%,rgba(252,243,246,0.97)_45%,rgba(249,241,233,0.96)_100%)] shadow-[0_28px_72px_rgba(58,36,43,0.1)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)]">
            <div className="min-w-0 px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">{heroEyebrow}</p>
              <p className="mt-3 text-[0.68rem] uppercase tracking-[0.24em] text-[#8F4C62]">{phaseLabel}</p>
              <h1 className="mt-4 max-w-[10ch] break-words font-serif text-[2.2rem] leading-[0.92] tracking-[-0.06em] text-[#2F2430] sm:text-[4rem]">
                {title}
              </h1>
              <p className="mt-5 max-w-[42rem] break-words text-[1rem] leading-8 text-[#4B3641] sm:text-[1.18rem] sm:leading-9">
                {deck}
              </p>
              <p className="mt-4 max-w-[42rem] break-words text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1.02rem]">
                {moduleOverviewLine}
              </p>

              <div className="mt-6 max-w-[44rem] space-y-4 text-[1rem] leading-8 text-[#5B4B55] sm:text-[1.04rem]">
                {renderLinkedParagraphs(intro, internalLinkPlan.contextualLinks, `${moduleSlug}-hub-intro`)}
              </div>

              <div className="mt-6 rounded-[1.55rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.9)] px-5 py-5">
                <p className="text-sm text-[#5B4B55]">This module helps you decide:</p>
                <h2 className="mt-3 max-w-3xl break-words font-serif text-[1.55rem] leading-[1.1] tracking-[-0.04em] text-[#2F2430] sm:text-[1.8rem]">
                  {decisionStatement}
                </h2>
                {quickCheckTags.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {quickCheckTags.map((tag) => (
                      <DecisionTag key={`${moduleSlug}-hero-${tag}`} label={tag} />
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={primaryCta.href}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#A15B72] px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62]"
                >
                  {primaryCta.label}
                </Link>
                <Link
                  href={secondaryCta.href}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/92 px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(58,36,43,0.08)]"
                >
                  {secondaryCta.label}
                </Link>
              </div>
            </div>

            <div className="min-w-0 border-t border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,#fdf7f8_0%,#fffdf9_100%)] lg:border-l lg:border-t-0">
              <div className="relative aspect-[5/4] border-b border-[rgba(215,161,175,0.14)] bg-[linear-gradient(180deg,#f7efe6_0%,#f3e4dc_100%)]">
                <Image
                  src={heroImageSrc}
                  alt={heroImageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 34rem, 100vw"
                  className="object-contain p-6 sm:p-8"
                />
              </div>

              <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
                <div className="rounded-[1.45rem] border border-[rgba(215,161,175,0.18)] bg-white/88 p-5 shadow-[0_18px_34px_rgba(58,36,43,0.06)]">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Pull quote</p>
                  <p className="mt-3 break-words font-serif text-[1.38rem] leading-8 tracking-[-0.03em] text-[#4B3641]">{pullQuote}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.3rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Academy phase</p>
                    <p className="mt-2 text-base font-medium leading-7 text-[#2F2430]">
                      {phaseLabel}
                    </p>
                  </div>
                  <div className="rounded-[1.3rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Inside this module</p>
                    <p className="mt-2 text-base font-medium leading-7 text-[#2F2430]">
                      {submoduleCards.length} focused submodules
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.55rem] border border-[rgba(215,161,175,0.16)] bg-white/84 px-5 py-5">
                  <AcademyProgressBar
                    current={progress.current}
                    total={progress.total}
                    label={phaseLabel}
                    stepLabel={`Module ${progress.current} of ${progress.total}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-5 pb-12 sm:px-8 md:pb-16 lg:px-10">
        <TaylorsNoteCard
          title={signatureSystem.taylorsNote.title}
          body={signatureSystem.taylorsNote.body}
          supportingLine={signatureSystem.taylorsNote.supportingLine}
        />

        <StartHere
          title={signatureSystem.startHere.title}
          description={signatureSystem.startHere.description}
        >
          {renderLinkedParagraphs(
            signatureSystem.startHere.paragraphs,
            internalLinkPlan.contextualLinks,
            `${moduleSlug}-hub-signature-start`,
          )}
        </StartHere>

        <DecisionBlock
          title={signatureSystem.decisionBlock.title}
          description={signatureSystem.decisionBlock.description}
          contrast={signatureSystem.decisionBlock.contrast}
        >
          {quickCheckTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {quickCheckTags.map((tag) => (
                <DecisionTag key={`${moduleSlug}-quick-${tag}`} label={tag} />
              ))}
            </div>
          ) : null}
        </DecisionBlock>

        <div className="grid gap-6 lg:grid-cols-2">
          <WhatMattersList
            title={signatureSystem.whatMatters.title}
            items={signatureSystem.whatMatters.items}
          />
          <WhatDoesntMatterList
            title={signatureSystem.whatDoesNotMatter.title}
            items={signatureSystem.whatDoesNotMatter.items}
          />
        </div>

        <section className="space-y-6">
          <AcademySectionHeading
            eyebrow="Decision Sections"
            title="Use the right context before you move into submodules"
            description="This is the part that should make the submodule choice easier, not busier."
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <DecisionCard
              eyebrow="Decision layer 1"
              title={learningTitle}
              paragraphs={[learningDescription, ...learningHighlights.slice(0, 2)]}
              example={inlineScenarios[0]}
              tone="white"
            />
            <DecisionCard
              eyebrow="Decision layer 2"
              title={philosophyTitle}
              paragraphs={[...philosophy, philosophyNoteBody]}
              example={inlineScenarios[1]}
              tone="ivory"
            />
            <DecisionCard
              eyebrow={guidanceEyebrow}
              title={guidanceTitle}
              paragraphs={[guidanceDescription, ...guidanceLines]}
              example={inlineScenarios[2]}
              tone="blush"
            />
          </div>
        </section>

        <HowToDecideBlock
          title={signatureSystem.howToDecide.title}
          intro={signatureSystem.howToDecide.description}
          prioritize={signatureSystem.howToDecide.prioritize}
          avoid={signatureSystem.howToDecide.avoid}
          scenarios={inlineScenarios}
        />

        <ClarityCallout insight={signatureSystem.clarityInsight} />
      </div>

      {groundingInsights.length > 0 ? (
        <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 md:pb-16 lg:px-10">
          <AcademySectionHeading
            eyebrow="Product Examples"
            title={`${title} examples to pressure-test`}
            description="These are here to make the category more concrete, not to turn the module into a product roundup."
          />

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {groundingInsights.slice(0, 3).map((product, index) => (
              <ProductInsightCard
                key={`${moduleSlug}-grounding-${product.name}-${index}`}
                {...product}
                position={index + 1}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 md:pb-16 lg:px-10">
        <TaylorsNoteCard
          title={taylorNoteTitle}
          body={taylorNoteBody}
          supportingLine={philosophyNoteTitle}
        />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 md:pb-16 lg:px-10">
        <AcademySectionHeading eyebrow="Submodules" title={submodulesTitle} description={submodulesDescription} />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {submoduleCards.map((card) => (
            <AcademyRouteCard key={card.href} {...card} />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 md:pb-24 lg:px-10">
        <NextBestDecisionCard
          title={nextTitle}
          description={nextDescription}
          progressMessage={progressMessage}
          primary={nextPrimary}
          secondary={nextSecondary}
          connectedPaths={connectedPaths}
        />
      </div>
    </section>
  );
}
