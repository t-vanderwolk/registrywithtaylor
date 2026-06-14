import AcademyHero from '@/components/guides/academy/AcademyHero';
import type { AcademyStageNavItem } from '@/components/guides/academy/AcademyStageNav';
import ChecklistCardSet from '@/components/guides/academy/ChecklistCardSet';
import ComparisonTable from '@/components/guides/academy/ComparisonTable';
import DecisionFlowchart from '@/components/guides/academy/DecisionFlowchart';
import ExpertTipCallout from '@/components/guides/academy/ExpertTipCallout';
import LaneOverviewGrid from '@/components/guides/academy/LaneOverviewGrid';
import PlanningFlow from '@/components/guides/academy/PlanningFlow';
import ProductPlaceholderCard from '@/components/guides/academy/ProductPlaceholderCard';
import SaveDecisionBar from '@/components/guides/academy/SaveDecisionBar';
import GuideBreadcrumbs from '@/components/guides/GuideBreadcrumbs';
import DecisionBlock from '@/components/guides/DecisionBlock';
import GuideBulletSection from '@/components/guides/GuideBulletSection';
import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideGlyph from '@/components/guides/GuideGlyph';
import GuideJourneyFooter from '@/components/guides/GuideJourneyFooter';
import GuideJourneyIntro from '@/components/guides/GuideJourneyIntro';
import GuideLifestyleGallery from '@/components/guides/GuideLifestyleGallery';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import SlideSection from '@/components/guides/SlideSection';
import YouAreHere from '@/components/guides/YouAreHere';
import { getGuideEcosystemCurrentStep } from '@/lib/ecosystem';
import {
  getGuideBlogRecommendations,
  getGuideBreadcrumbs,
  getGuideJourneyPath,
  getGuideLifestyleImages,
  getGuideRealLifePrompt,
} from '@/lib/guides/experience';
import { getGuideSignOff } from '@/lib/guides/editorialSystem';
import { dedupeTextItems, getDefaultNextSteps, getGuideOrientation, getStandardGuideSlideItems, normalizeGuideLinks } from '@/lib/guides/guideFlow';
import { resolveGuideHeroImage } from '@/lib/guides/heroImages';
import { getAcademyNextStepForGuide } from '@/lib/internal-links/system';
import {
  getStrollerAcademyFlowchart,
  getStrollerAcademyLane,
  getStrollerAcademyLanes,
  getStrollerAcademyLearnModules,
  getStrollerAcademyPlanQuestions,
  getStrollerAcademyTryChecklist,
} from '@/lib/guides/strollerAcademy';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

function StageLead({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[#A15B72]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-[#2F2430] sm:text-[2.55rem]">{title}</h2>
      <p className="mt-4 text-base leading-8 text-[#5B4B55]">{description}</p>
    </div>
  );
}

export default function StrollerAcademyHub({
  guide,
  sourceRoute,
  readingTime,
}: {
  guide: GuideArticleRecord;
  sourceRoute: string;
  readingTime: number;
}) {
  const lanes = getStrollerAcademyLanes();
  const learnModules = getStrollerAcademyLearnModules();
  const flowchart = getStrollerAcademyFlowchart();
  const questions = getStrollerAcademyPlanQuestions();
  const tryChecklist = getStrollerAcademyTryChecklist();
  const slideItems = getStandardGuideSlideItems('guide');
  const orientation = getGuideOrientation({ slug: guide.slug, category: guide.category, topicCluster: guide.topicCluster });
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
  const whatThisIs =
    'A stroller decision hub that sorts the main stroller lanes before product comparisons start acting like they all solve the same job.';
  const whyItExists =
    'Stroller shopping gets noisy when every model tries to sound universal. This page exists to separate lane fit from product hype.';
  const finalThought =
    'The stroller decision usually gets much easier once the lane is clear. Then the shortlist only has to solve the right job, which is a far more civilized assignment.';
  const takeaways = dedupeTextItems(
    [
      'Choose the stroller lane before you compare the products inside it.',
      'Let your real week, not your hypothetical future, do more of the talking.',
      'Validate the fold, the lift, and the trunk reality before you buy.',
      'Move from lane to shortlist without slipping back into generic stroller browsing.',
    ],
    4,
  );
  const signOff = getGuideSignOff({
    founderSignatureEnabled: guide.founderSignatureEnabled,
    founderSignatureText: guide.founderSignatureText,
  });
  const journeyPath = getGuideJourneyPath({
    slug: guide.slug,
    title: guide.title,
    topicCluster: guide.topicCluster,
  });
  const stageItems: AcademyStageNavItem[] = [
    {
      id: 'start',
      label: 'Start',
      title: 'Get oriented fast',
      description: 'See where this page fits before the category names start running the show.',
      href: `${sourceRoute}#${slideItems[1].id}`,
    },
    {
      id: 'compare',
      label: 'Compare',
      title: 'Learn the stroller lanes',
      description: 'Use the lane map and flowchart before you open product pages.',
      href: `${sourceRoute}#${slideItems[3].id}`,
    },
    {
      id: 'decide',
      label: 'Decide',
      title: 'Run the planning flow',
      description: 'Pressure-test the lane fit against your actual week.',
      href: `${sourceRoute}#${slideItems[4].id}`,
    },
    {
      id: 'refine',
      label: 'Refine',
      title: 'Move into testing and shortlist',
      description: 'Use the checklist and next steps to turn education into action.',
      href: `${sourceRoute}#${slideItems[6].id}`,
    },
  ];
  const nextSteps = normalizeGuideLinks(
    [
      getAcademyNextStepForGuide({
        href: sourceRoute as `/${string}`,
        slug: guide.slug,
        title: guide.title,
        category: guide.category,
        topicCluster: guide.topicCluster,
      }),
      ...getDefaultNextSteps({ slug: guide.slug, topicCluster: guide.topicCluster }),
      {
        href: getStrollerAcademyLane('convertible-strollers')?.href || '/learn/gear/stroller-foundations/convertible-strollers',
        label: 'Open the Convertible Lane',
        description: 'A strong next read if future-family planning is part of the stroller decision.',
        stage: 'Decide' as const,
      },
      {
        href: getStrollerAcademyLane('compact-lightweight-strollers')?.href || '/learn/gear/stroller-foundations/compact-lightweight-strollers',
        label: 'Compare Compact',
        description: 'Use this when storage and easier loading are the real friction.',
        stage: 'Compare' as const,
      },
      {
        href: '/academy/gear/car-seat-foundations',
        label: 'Continue Into Car Seat Foundations',
        description: 'Use the Academy module once travel-system or infant-seat questions start affecting the stroller plan.',
        stage: 'Refine' as const,
      },
      {
        href: '/learn/registry/where-to-register',
        label: 'Return to Registry',
        description: 'Use the stroller lane you chose to keep the registry shortlist calmer.',
        stage: 'Refine' as const,
      },
    ],
    4,
  );
  const heroImage = resolveGuideHeroImage({
    slug: guide.slug,
    title: guide.title,
    category: guide.category,
    topicCluster: guide.topicCluster,
    imageSrc: guide.heroImageUrl,
    imageAlt: guide.heroImageAlt,
  });
  const displayHeroImage = guide.heroImageUrl?.trim()
    ? heroImage
    : {
        src: '/assets/editorial/strollers.png',
        alt: 'Editorial stroller image for the TMBC stroller academy.',
      };

  return (
    <GuideSlideDeck
      containerId={`guide-slide-deck-${guide.slug}`}
      items={slideItems}
      backLink={{ href: '/learn', label: 'Back to TMBC Hub' }}
      ecosystemCurrentStep={getGuideEcosystemCurrentStep({
        slug: guide.slug,
        path: sourceRoute,
        category: guide.category,
      })}
      journeyPathLabels={journeyPath}
    >
      <SlideSection id={slideItems[0].id} background="ivory" innerClassName="max-w-none px-0 py-0">
        <div className="space-y-6">
          <div className="mx-auto w-full max-w-[1520px] px-6 pt-8 md:px-10 xl:px-12">
            <GuideBreadcrumbs items={breadcrumbs} />
          </div>

          <AcademyHero
            eyebrow="TMBC Academy · Strollers"
            title="Choose your stroller with confidence, not confusion."
            description="Most parents do not choose the wrong stroller. They choose the wrong category. This stroller Academy helps you learn the lanes, plan around real life, test the fit, and buy without guesswork."
            note="The stroller should make your week easier. It does not need to win a showroom talent competition."
            primaryCta={{ label: 'Start Your Stroller Plan', href: `${sourceRoute}#${slideItems[4].id}` }}
            secondaryCta={{ label: 'Explore Stroller Lanes', href: `${sourceRoute}#${slideItems[3].id}` }}
            stageItems={stageItems}
            stats={[
              { label: 'Academy stages', value: '7 guide stops' },
              { label: 'Stroller lanes', value: String(lanes.length) },
              { label: 'Quick start', value: `${readingTime} min` },
            ]}
            parentLink={{ href: '/learn', label: 'TMBC Education Hub' }}
            imageSrc={displayHeroImage.src}
            imageAlt={displayHeroImage.alt}
            imageAspectClassName="aspect-[16/11]"
            imageObjectClassName="object-cover object-center"
            imagePriority
          />
        </div>
      </SlideSection>

      <SlideSection id={slideItems[1].id} background="white">
        <YouAreHere step={orientation.step} category={orientation.category} goal={orientation.goal} />
      </SlideSection>

      <SlideSection id={slideItems[2].id} background="blush">
        <div className="space-y-6">
          <GuideJourneyIntro
            title="Start here before you compare a single stroller."
            description="The Academy should make the category smaller before the product grid gets a vote."
            intro={[
              'The real-life factors that separate stroller lanes matter more than the brand page pretending every family wants the same thing.',
              'Use this page to sort daily workflow, storage pressure, travel, terrain, and future planning before you shortlist anything with a cup holder and strong opinions.',
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
            eyebrow="Orientation"
            title="Orientation"
            description="These are the lenses this hub uses to keep stroller shopping from becoming brand theater."
            items={[
              'The real-life factors that separate stroller lanes before brands enter the conversation.',
              'The stroller lane map for full-size, compact, travel, convertible, double, and jogging.',
              'A planning flow that translates routine, storage, travel, and terrain into a clearer fit.',
              'The test checklist and next links that move you from theory into validation and buying.',
            ]}
            editorialImage={{
              eyebrow: 'Editorial image',
              src: '/assets/editorial/editorialstroller.png',
              alt: 'Editorial stroller image for the TMBC stroller hub.',
              caption: 'Stroller decisions get calmer once you can see the category as a daily-life fit problem instead of a product popularity contest.',
            }}
          />

          {lifestyleImages.length > 0 ? <GuideLifestyleGallery images={lifestyleImages} /> : null}
        </div>
      </SlideSection>

      <SlideSection id={slideItems[3].id} background="ivory">
        <div className="space-y-8">
          <StageLead
            eyebrow="What Matters"
            title="Start with the role the stroller has to play in your real life."
            description="The category gets easier once you sort daily workflow, storage pressure, travel, future sibling timing, and route quality."
          />

          <div className="grid gap-5 xl:grid-cols-3">
            {learnModules.map((module) => (
              <section
                key={module.title}
                className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)]"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(215,161,175,0.14)] text-[#9F556D]">
                  <GuideGlyph icon={module.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-2xl font-medium tracking-[-0.02em] text-[#2F2430]">{module.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5B4B55]">{module.description}</p>
              </section>
            ))}
          </div>

          <DecisionFlowchart
            title="A cleaner way to narrow the lane before you compare brands."
            description="This is a decision map, not a gimmicky quiz result."
            nodes={flowchart}
          />

          <LaneOverviewGrid
            title="The six stroller lanes TMBC uses to simplify the decision."
            description="Each lane solves a different version of everyday life. Read them like roles, not status levels."
            lanes={lanes}
          />
        </div>
      </SlideSection>

      <SlideSection id={slideItems[4].id} background="white">
        <div className="space-y-8">
          <PlanningFlow
            title="Build your stroller fit."
            description="Move one question at a time. The goal is not to crown the fanciest stroller. The goal is to surface the lane that makes daily life easier."
            questions={questions}
            lanes={lanes}
          />

          <DecisionBlock
            title="Use the quick fit rules when you want the shorter version."
            description="These are the fastest lane calls when you do not need the full questionnaire."
            items={[
              {
                condition: 'need two seats now',
                recommendation: 'Start with the Double lane before future-flexibility stories start pulling you away.',
                href: getStrollerAcademyLane('double-strollers')?.href,
              },
              {
                condition: 'mostly fight storage, trunk space, or frequent loading',
                recommendation: 'Compare Compact and Travel first, because portability is doing the louder job.',
                href: getStrollerAcademyLane('compact-lightweight-strollers')?.href,
              },
              {
                condition: 'walk often or want one strong everyday stroller',
                recommendation: 'Start with Full-Size / Modular before you talk yourself into a lighter category that solves the wrong problem.',
                href: getStrollerAcademyLane('full-size-modular-strollers')?.href,
              },
            ]}
          />

          <ComparisonTable
            title="See the lanes side by side before you buy into any one story."
            description="This is the short version of the category map: what each lane does well, what it gives up, and how it tends to feel once it enters real life."
            rows={lanes.map((lane) => ({
              title: lane.title,
              bestFor: lane.bestFor,
              tradeoff: lane.tradeoff,
              everydayFeel: lane.everydayFeel,
              href: lane.href,
            }))}
          />
        </div>
      </SlideSection>

      <SlideSection id={slideItems[5].id} background="blush">
        <div className="space-y-8">
          <GuideBulletSection
            eyebrow="What People Get Wrong"
            title="What People Get Wrong"
            description="This is where stroller shopping usually gets louder than it needs to."
            items={[
              'Comparing stroller models before the lane is clear.',
              'Buying for a future family configuration before present-day use is solved.',
              'Overvaluing showroom smoothness and undervaluing fold, lift, and storage reality.',
              'Choosing the most flexible-sounding stroller instead of the one that fits the real week.',
            ]}
          />

          <ExpertTipCallout
            title="Most parents do not need more stroller options. They need better decision order."
            body="Start with lane fit first. Then compare the products inside that lane. The reverse order is how stroller shopping turns into late-night brand theater."
          />
        </div>
      </SlideSection>

      <SlideSection id={slideItems[6].id} background="ivory">
        <div className="space-y-8">
          <ChecklistCardSet
            title="What to test next."
            description="The real validation stage happens with folds, corners, trunks, baskets, and honest questions."
            sections={tryChecklist}
          />

          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {lanes.slice(0, 3).map((lane) => {
              const example = lane.productExamples[0];

              return (
                <ProductPlaceholderCard
                  key={lane.slug}
                  eyebrow={`${lane.title} lane`}
                  title={example?.name || `${lane.title} placeholder`}
                  description={example?.shortReview || lane.heroDescription}
                  bestFor={example?.bestFor || lane.bestFor}
                  standout={example?.standout || lane.everydayFeel}
                  watchout={lane.tradeoff}
                  imageSrc={example?.imageSrc}
                  imageAlt={example?.imageAlt}
                  ctas={[
                    { label: '[PRODUCT_CARD_PLACEHOLDER]' },
                    { label: '[COMPARE_CTA_PLACEHOLDER: Compare Strollers]' },
                    { label: '[REGISTRY_CTA_PLACEHOLDER: Add to Registry]' },
                  ]}
                />
              );
            })}
          </div>

          <GuideJourneyFooter
            finalThought={finalThought}
            takeaways={takeaways}
            signOff={signOff}
            nextSteps={nextSteps}
            nextStepsDescription="Once the lane is clearer, use the next guide or category while the logic is still fresh."
            blogRecommendations={blogRecommendations}
            consultationEnabled={guide.consultationCtaEnabled !== false}
            consultationLabel={guide.consultationCtaLabel}
          />

          <ExpertTipCallout
            eyebrow="TMBC Buy Rule"
            title="Do not buy the most flexible stroller. Buy the one that fits your life best right now."
            body="Future-proofing has limits. A stroller that feels wrong in present-day life rarely becomes charming later just because it had an ambitious product page."
          />

          <SaveDecisionBar
            title="Keep the decision moving."
            description="The next TMBC move is simple: open the lane page, test it in person, and save the options worth comparing."
            actions={[
              { label: 'Open the Convertible Lane', href: getStrollerAcademyLane('convertible-strollers')?.href },
              { label: '[CTA_PLACEHOLDER: Compare Strollers]' },
              { label: '[CTA_PLACEHOLDER: Save for Later]' },
            ].filter((action): action is { label: string; href?: string } => Boolean(action.label))}
          />

          {/* TODO: Replace compare/save placeholders with live TMBC compare and registry actions when those flows are wired. */}
        </div>
      </SlideSection>
    </GuideSlideDeck>
  );
}
