import Image from 'next/image';
import Link from 'next/link';
import {
  AcademySectionHeading,
} from '@/components/academy/AcademyPrimitives';
import AcademyJourneyNavigator from '@/components/academy/AcademyJourneyNavigator';
import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import ClarityCallout from '@/components/academy/ClarityCallout';
import DecisionCard from '@/components/academy/DecisionCard';
import DecisionBlock from '@/components/academy/DecisionBlock';
import DecisionTag from '@/components/academy/DecisionTag';
import HowToDecideBlock from '@/components/academy/HowToDecideBlock';
import NextBestDecisionCard from '@/components/academy/NextBestDecisionCard';
import StartHere from '@/components/academy/StartHere';
import TaylorsNoteCard from '@/components/academy/TaylorsNoteCard';
import WhatDoesntMatterList from '@/components/academy/WhatDoesntMatterList';
import WhatMattersList from '@/components/academy/WhatMattersList';
import GuideBreadcrumbs from '@/components/guides/GuideBreadcrumbs';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import YouAreHereCard from '@/components/academy/YouAreHereCard';
import {
  FEEDING_SETUP_FLOW_BOTTLE_PARAGRAPHS,
  FEEDING_SETUP_FLOW_BOTTLE_POINTS,
  FEEDING_SETUP_FLOW_BOTTLE_QUOTE,
  FEEDING_SETUP_FLOW_BUY_NOW,
  FEEDING_SETUP_FLOW_BUY_NOW_QUOTE,
  FEEDING_SETUP_FLOW_CLOSE,
  FEEDING_SETUP_FLOW_DECK,
  FEEDING_SETUP_FLOW_DO_NEED,
  FEEDING_SETUP_FLOW_DO_NOT_NEED,
  FEEDING_SETUP_FLOW_FINAL_PARAGRAPHS,
  FEEDING_SETUP_FLOW_FRAMEWORK_PARAGRAPHS,
  FEEDING_SETUP_FLOW_FRAMEWORK_QUOTE,
  FEEDING_SETUP_FLOW_GENTLE_NOTE,
  FEEDING_SETUP_FLOW_HERO_INTRO,
  FEEDING_SETUP_FLOW_MILK_STORAGE_ITEMS,
  FEEDING_SETUP_FLOW_NEEDS,
  FEEDING_SETUP_FLOW_NEXT_MODULES,
  FEEDING_SETUP_FLOW_PATHWAYS,
  FEEDING_SETUP_FLOW_PUMPING_CHECKLIST,
  FEEDING_SETUP_FLOW_PUMPING_PARAGRAPHS,
  FEEDING_SETUP_FLOW_PULL_QUOTE,
  FEEDING_SETUP_FLOW_SIMPLE_SETUP,
  FEEDING_SETUP_FLOW_STORAGE_PARAGRAPHS,
  FEEDING_SETUP_FLOW_TAKEAWAYS,
  FEEDING_SETUP_FLOW_WAIT_AND_SEE,
} from '@/lib/academy/feedingSetupFlowAcademy';
import { getAcademyModuleData, getAcademyPathData } from '@/lib/academy/content';
import {
  getAcademyPhaseLabel,
  getConnectedAcademyPaths,
  getModuleDecisionStatement,
  getModuleWhyThisExists,
  getQuickCheckLines,
  getQuickCheckTags,
} from '@/lib/academy/decisionSupport';
import {
  buildAcademyBreadcrumbStructuredData,
  buildAcademyLearningResourceStructuredData,
} from '@/lib/academy/seo';
import { buildAcademySignatureSystem } from '@/lib/academy/signatureSystem';
import { getCaseStudiesForAcademyModule } from '@/lib/caseStudies';

type ConnectionCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  href?: string;
};

function BulletList({ items }: { items: readonly string[] }) {
  const visibleItems = items.slice(0, 5);

  return (
    <ul className="space-y-3 text-[0.98rem] leading-7 text-[#5B4B55] sm:text-[1rem] sm:leading-8">
      {visibleItems.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#D986A2]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PullQuote({ children }: { children: string }) {
  return (
    <div className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,251,252,0.98)_0%,rgba(252,243,246,0.96)_100%)] px-6 py-6 shadow-[0_20px_48px_rgba(58,36,43,0.07)] sm:px-7 sm:py-7">
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">TMBC takeaway</p>
      <p className="mt-4 font-serif text-[1.55rem] leading-[1.14] tracking-[-0.03em] text-[#2F2430] sm:text-[1.95rem]">
        {children}
      </p>
    </div>
  );
}

function uniqueItems(items: Array<string | null | undefined>) {
  return items
    .map((item) => item?.trim() ?? '')
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index);
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
    return 'You are at the bridge step. The point is not to commit to a feeding identity today. It is to make the first setup calmer.';
  }

  if (currentIndex >= total - 1) {
    return "You've completed this layer. Keep the next feeding decision as practical as this one became.";
  }

  return `You've completed ${currentIndex} ${currentIndex === 1 ? 'layer' : 'layers'}. Now keep the next one smaller than the internet wants it to be.`;
}

export default async function FeedingSetupFlowModule() {
  const module = await getAcademyModuleData('feeding-setup-flow');
  const pathData = await getAcademyPathData(module.pathSlug);
  const phaseLabel = getAcademyPhaseLabel(module);
  const decisionStatement = getModuleDecisionStatement(module);
  const whyThisExists = getModuleWhyThisExists(module);
  const quickCheckLines = getQuickCheckLines(module);
  const quickCheckTags = getQuickCheckTags(module);
  const signatureSystem = buildAcademySignatureSystem(module, {
    decisionStatement,
    whyThisExists,
    quickCheckLines,
  });
  const caseStudies = getCaseStudiesForAcademyModule(module.slug, module.pathSlug);
  const inlineScenarios = buildInlineScenarioExamples(signatureSystem.scenarios.items, caseStudies);
  const connectedPaths = getConnectedAcademyPaths(module.pathSlug);
  const currentIndex = pathData.moduleCards.findIndex((card) => card.slug === module.slug);
  const completedSteps = currentIndex > 0 ? pathData.moduleCards.slice(0, currentIndex) : [];
  const progressMessage = buildProgressMessage(
    currentIndex === -1 ? Math.max(module.progress.current - 1, 0) : currentIndex,
    pathData.moduleCards.length || module.progress.total,
  );

  const structuredData = [
    buildAcademyBreadcrumbStructuredData({
      breadcrumbs: module.breadcrumb,
      currentPath: module.href,
    }),
    buildAcademyLearningResourceStructuredData({
      title: module.title,
      description: module.description,
      path: module.href,
      breadcrumbs: module.breadcrumb,
      keywords: module.decisionBullets,
      teaches: [
        'The main feeding pathways and how flexible they can be.',
        'What tools each feeding pathway may require.',
        'What to buy now versus later.',
        'How pumping and bottles fit into real life.',
        'How to build the setup instead of the fantasy.',
      ],
      hasPart: [
        ...(module.previous
          ? [
              {
                href: module.previous.href,
                title: module.previous.title,
                description: module.previous.description,
              },
            ]
          : []),
        ...(module.related
          ? [
              {
                href: module.related.href,
                title: module.related.title,
                description: module.related.description,
              },
            ]
          : []),
      ],
      learningResourceType: 'TMBC Academy Module',
    }),
  ];

  const connectionCards: ConnectionCardProps[] = [
    ...(module.previous
      ? [
          {
            eyebrow: 'Previous Gear Module',
            title: module.previous.title,
            description: module.previous.description,
            ctaLabel: 'Review previous module ->',
            href: module.previous.href,
          },
        ]
      : []),
    ...FEEDING_SETUP_FLOW_NEXT_MODULES.map((item, index) => ({
      eyebrow: index === 0 ? 'Next Gear Layer' : 'Keep Building',
      title: item.title,
      description: item.description,
      ctaLabel: item.ctaLabel,
      href: item.href,
    })),
  ];
  const nextPrimary = connectionCards[0]
    ? {
        title: connectionCards[0].title,
        description: connectionCards[0].description,
        href: connectionCards[0].href ?? '/academy/gear',
        ctaLabel: connectionCards[0].ctaLabel,
      }
    : null;
  const nextSecondary = connectionCards[1]
    ? {
        title: connectionCards[1].title,
        description: connectionCards[1].description,
        href: connectionCards[1].href ?? '/academy/gear',
        ctaLabel: connectionCards[1].ctaLabel,
      }
    : null;

  return (
    <section className="min-h-0 bg-[radial-gradient(circle_at_top_left,rgba(244,224,209,0.68),transparent_28%),radial-gradient(circle_at_top_right,rgba(232,154,174,0.22),transparent_30%),linear-gradient(180deg,#fffdfa_0%,#fcf3f5_34%,#fffdf8_100%)]">
      <AcademyStructuredData data={structuredData} />

      <div className="mx-auto max-w-6xl px-5 pb-8 pt-10 sm:px-8 md:pb-10 md:pt-14 lg:px-10">
        <GuideBreadcrumbs items={module.breadcrumb} />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-8 md:pb-10 lg:px-10">
        <YouAreHereCard
          trail={module.breadcrumb.map((item) => ({ title: item.label, href: item.href }))}
          progressLabel={`Module ${module.progress.current} of ${module.progress.total}`}
          currentTitle={module.title}
          currentStepLabel={phaseLabel}
          completedSteps={completedSteps}
          nextStep={nextPrimary}
        />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-10 sm:px-8 md:pb-12 lg:px-10">
        <section className="overflow-hidden rounded-[2.15rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,252,253,0.99)_0%,rgba(252,243,246,0.97)_48%,rgba(249,241,233,0.96)_100%)] shadow-[0_28px_72px_rgba(58,36,43,0.1)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
            <div className="min-w-0 px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">Gear Journey · Feeding</p>
              <h1 className="mt-4 max-w-[10ch] font-serif text-[2.35rem] leading-[0.92] tracking-[-0.06em] text-[#2F2430] sm:text-[4.15rem]">
                {module.title}
              </h1>
              <div className="mt-5 max-w-[38rem] space-y-3 text-[1rem] leading-8 text-[#4B3641] sm:text-[1.18rem] sm:leading-9">
                {FEEDING_SETUP_FLOW_DECK.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="mt-6 max-w-[42rem] space-y-4 text-[1rem] leading-8 text-[#5B4B55]">
                {FEEDING_SETUP_FLOW_HERO_INTRO.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/academy/gear"
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/92 px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(58,36,43,0.08)]"
                >
                  Back to Gear path
                </Link>
                <Link
                  href="#buy-now-vs-later"
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(232,154,174,0.32)] bg-[linear-gradient(135deg,#d889a0_0%,#c97691_100%)] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white shadow-[0_16px_34px_rgba(216,137,160,0.22)] transition duration-300 hover:-translate-y-0.5 hover:brightness-[0.98]"
                >
                  Buy now vs later
                </Link>
              </div>
            </div>

            <div className="flex h-full flex-col bg-[linear-gradient(180deg,rgba(252,244,247,0.96)_0%,rgba(249,240,231,0.96)_100%)] p-5 sm:p-6 md:p-7">
              <div className="relative min-h-[18rem] flex-1 overflow-hidden rounded-[1.75rem] border border-[rgba(215,161,175,0.14)] bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <Image
                  src={module.imagePath}
                  alt={module.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 30rem, 100vw"
                  className="object-contain p-5 sm:p-7"
                />
              </div>

              <div className="mt-5 space-y-4">
                <PullQuote>{FEEDING_SETUP_FLOW_PULL_QUOTE}</PullQuote>
                <div className="rounded-[1.6rem] border border-[rgba(215,161,175,0.18)] bg-white/90 px-5 py-5 shadow-[0_18px_40px_rgba(58,36,43,0.06)]">
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">
                    {phaseLabel}
                  </p>
                  <p className="mt-3 text-[0.98rem] leading-7 text-[#5B4B55]">
                    This is the bridge module that turns feeding from a product pile into a calmer system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 md:pb-14 lg:px-10">
        <div className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-5 py-5 shadow-[0_20px_44px_rgba(58,36,43,0.08)] sm:px-6 sm:py-6">
          <AcademyProgressBar
            current={module.progress.current}
            total={module.progress.total}
            label={phaseLabel}
            stepLabel={`Module ${module.progress.current} of ${module.progress.total}`}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-12 px-5 pb-20 sm:px-8 md:space-y-14 md:pb-24 lg:px-10">
        <div className="space-y-8">
          <TaylorsNoteCard
            title={signatureSystem.taylorsNote.title}
            body={signatureSystem.taylorsNote.body}
            supportingLine={signatureSystem.taylorsNote.supportingLine}
          />

          <StartHere
            title={signatureSystem.startHere.title}
            description={signatureSystem.startHere.description}
          >
            {signatureSystem.startHere.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </StartHere>

          <DecisionBlock
            title={signatureSystem.decisionBlock.title}
            description={signatureSystem.decisionBlock.description}
            contrast={signatureSystem.decisionBlock.contrast}
          >
            {quickCheckTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {quickCheckTags.map((tag) => (
                  <DecisionTag key={`feeding-signature-${tag}`} label={tag} />
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

          <HowToDecideBlock
            title={signatureSystem.howToDecide.title}
            intro={signatureSystem.howToDecide.description}
            prioritize={signatureSystem.howToDecide.prioritize}
            avoid={signatureSystem.howToDecide.avoid}
            scenarios={inlineScenarios}
          />

          <ClarityCallout insight={signatureSystem.clarityInsight} />

          <div className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,#FFFDF8_0%,#F8F0E8_100%)] px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Keep in view</p>
            <p className="mt-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
              {FEEDING_SETUP_FLOW_GENTLE_NOTE}
            </p>
          </div>
        </div>

        <section className="space-y-6">
          <AcademySectionHeading
            eyebrow="Feeding Pathways"
            title="The main paths are more flexible than they look online"
            description="Start with the paths themselves before you start buying tools for all four at once."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {FEEDING_SETUP_FLOW_PATHWAYS.map((pathway) => (
              <DecisionCard
                key={pathway.title}
                eyebrow="Pathway"
                title={pathway.title}
                paragraphs={[pathway.description, pathway.setup, pathway.appeal]}
                example={inlineScenarios[0]}
                tone="white"
              />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <AcademySectionHeading
            eyebrow="Feeding Gear Categories"
            title="Name the job before you name the brand"
            description="Use may involve language on purpose here. This is the map, not the shopping list."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {FEEDING_SETUP_FLOW_NEEDS.map((card) => (
              <article
                key={card.title}
                className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,248,251,0.94)_100%)] px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]"
              >
                <h3 className="font-serif text-[1.5rem] leading-[1.06] tracking-[-0.04em] text-[#2F2430]">{card.title}</h3>
                <div className="mt-5">
                  <BulletList items={card.items} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="buy-now-vs-later" className="space-y-6 scroll-mt-24">
          <AcademySectionHeading
            eyebrow="Buy Now Vs Later"
            title="Start with the first layer and leave room to learn"
            description="This is the section that saves the most money, shelf space, and emotional energy."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-7 shadow-[0_20px_44px_rgba(58,36,43,0.07)] sm:px-8">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Buy now</p>
              <h3 className="mt-4 font-serif text-[1.75rem] leading-[1.02] tracking-[-0.04em] text-[#2F2430]">
                Build the starting point
              </h3>
              <div className="mt-6">
                <BulletList items={FEEDING_SETUP_FLOW_BUY_NOW} />
              </div>
            </article>

            <article className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,rgba(255,251,252,0.98)_0%,rgba(252,241,245,0.96)_100%)] px-6 py-7 shadow-[0_20px_44px_rgba(58,36,43,0.07)] sm:px-8">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Wait and see</p>
              <h3 className="mt-4 font-serif text-[1.75rem] leading-[1.02] tracking-[-0.04em] text-[#2F2430]">
                Let real use decide
              </h3>
              <div className="mt-6">
                <BulletList items={FEEDING_SETUP_FLOW_WAIT_AND_SEE} />
              </div>
            </article>
          </div>
          <PullQuote>{FEEDING_SETUP_FLOW_BUY_NOW_QUOTE}</PullQuote>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
          <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-7 shadow-[0_20px_44px_rgba(58,36,43,0.07)] sm:px-8">
            <AcademySectionHeading
              eyebrow="Pumping In Real Life"
              title="A tool, not a whole personality"
              description="Pumping can help. It can also add time, parts, storage, and logistics fast."
            />
            <div className="mt-6 space-y-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
              {FEEDING_SETUP_FLOW_PUMPING_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,rgba(255,251,252,0.98)_0%,rgba(252,241,245,0.96)_100%)] px-6 py-7 shadow-[0_20px_44px_rgba(58,36,43,0.07)] sm:px-8">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Think through</p>
            <h3 className="mt-4 font-serif text-[1.72rem] leading-[1.04] tracking-[-0.04em] text-[#2F2430]">
              Where does pumping actually live?
            </h3>
            <div className="mt-6">
              <BulletList items={FEEDING_SETUP_FLOW_PUMPING_CHECKLIST} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
          <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-7 shadow-[0_20px_44px_rgba(58,36,43,0.07)] sm:px-8">
            <AcademySectionHeading
              eyebrow="Bottles In Real Life"
              title="The bottle is one part. The system is the real category."
              description="This is where compatibility, cleanup, and daily rhythm matter more than a packaging promise."
            />
            <div className="mt-6 space-y-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
              {FEEDING_SETUP_FLOW_BOTTLE_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6">
              <BulletList items={FEEDING_SETUP_FLOW_BOTTLE_POINTS} />
            </div>
          </div>

          <div className="space-y-6">
            <PullQuote>{FEEDING_SETUP_FLOW_BOTTLE_QUOTE}</PullQuote>
            <div className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,#FFFDF8_0%,#F8F0E8_100%)] px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Helpful edit</p>
              <p className="mt-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
                When in doubt, buy enough to test the routine. Not enough to commit your entire counter to one theory.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <AcademySectionHeading
            eyebrow="Storage + Cleaning Basics"
            title="The glamorous part? No. The part that makes everything else work? Very much yes."
            description="A feeding setup gets easier when cleanup, storage, and dry-down space are obvious."
          />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
            <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-7 shadow-[0_20px_44px_rgba(58,36,43,0.07)] sm:px-8">
              <div className="space-y-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
                {FEEDING_SETUP_FLOW_STORAGE_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <article className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,rgba(255,251,252,0.98)_0%,rgba(252,241,245,0.96)_100%)] px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Milk storage basics</p>
                <h3 className="mt-4 font-serif text-[1.55rem] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
                  Freshly expressed milk can generally be stored
                </h3>
                <div className="mt-5">
                  <BulletList items={FEEDING_SETUP_FLOW_MILK_STORAGE_ITEMS} />
                </div>
              </article>

              <article className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,#FFFDF8_0%,#F8F0E8_100%)] px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Simple setup</p>
                <h3 className="mt-4 font-serif text-[1.55rem] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
                  A realistic feeding cleanup setup may include
                </h3>
                <div className="mt-5">
                  <BulletList items={FEEDING_SETUP_FLOW_SIMPLE_SETUP} />
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2.15rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,252,253,0.98)_0%,rgba(252,243,246,0.97)_48%,rgba(249,241,233,0.96)_100%)] px-6 py-8 shadow-[0_26px_58px_rgba(58,36,43,0.09)] sm:px-8 sm:py-9">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
            <div>
              <AcademySectionHeading
                eyebrow="TMBC Framework"
                title="Build the setup, not the fantasy"
                description="The biggest feeding mistake is usually trying to solve for every hypothetical version of the future before you have any real data."
              />
              <div className="mt-6 space-y-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
                {FEEDING_SETUP_FLOW_FRAMEWORK_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <article className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-white/90 px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">You do not need</p>
                <div className="mt-5">
                  <BulletList items={FEEDING_SETUP_FLOW_DO_NOT_NEED} />
                </div>
              </article>

              <article className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-white/90 px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">You do need</p>
                <div className="mt-5">
                  <BulletList items={FEEDING_SETUP_FLOW_DO_NEED} />
                </div>
              </article>
            </div>
          </div>

          <div className="mt-8">
            <PullQuote>{FEEDING_SETUP_FLOW_FRAMEWORK_QUOTE}</PullQuote>
          </div>
        </section>

        <section className="space-y-6">
          <AcademySectionHeading
            eyebrow="Final Thoughts"
            title="Calmer happens faster when the setup stays useful"
            description="You are allowed to start smaller than the internet suggests."
          />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.95fr)]">
            <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-7 shadow-[0_20px_44px_rgba(58,36,43,0.07)] sm:px-8">
              <div className="space-y-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
                {FEEDING_SETUP_FLOW_FINAL_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-6">
                <BulletList items={FEEDING_SETUP_FLOW_TAKEAWAYS} />
              </div>
              <p className="mt-8 font-serif text-[1.6rem] leading-none tracking-[-0.03em] text-[#2F2430]">
                {FEEDING_SETUP_FLOW_CLOSE}
              </p>
            </div>

            <TaylorsNoteCard
              title="Feeding gets lighter when the plan can flex."
              body="The strongest setup usually looks less like buying confidence and more like leaving yourself room to adapt without starting over."
              supportingLine="You do not need to solve every version of feeding before baby has even weighed in."
            />
          </div>
        </section>

        <NextBestDecisionCard
          title="Now that this feels clearer, here is what matters next"
          description="This module is the bridge. These are the cleanest next stops once you know which part of feeding needs the deeper answer."
          progressMessage={progressMessage}
          primary={nextPrimary}
          secondary={nextSecondary}
          connectedPaths={connectedPaths}
        />

        <AcademyJourneyNavigator currentPathSlug="gear" currentModuleSlug={module.slug} />
      </div>
    </section>
  );
}
