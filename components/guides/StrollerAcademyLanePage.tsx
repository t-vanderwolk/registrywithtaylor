import AcademyHero from '@/components/guides/academy/AcademyHero';
import type { AcademyStageNavItem } from '@/components/guides/academy/AcademyStageNav';
import ChecklistCardSet from '@/components/guides/academy/ChecklistCardSet';
import ComparisonTable from '@/components/guides/academy/ComparisonTable';
import ExpertTipCallout from '@/components/guides/academy/ExpertTipCallout';
import ProductPlaceholderCard from '@/components/guides/academy/ProductPlaceholderCard';
import SaveDecisionBar from '@/components/guides/academy/SaveDecisionBar';
import DecisionBlock from '@/components/guides/DecisionBlock';
import GuideBulletSection from '@/components/guides/GuideBulletSection';
import GuideGlyph from '@/components/guides/GuideGlyph';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import NextSteps from '@/components/guides/NextSteps';
import SlideSection from '@/components/guides/SlideSection';
import YouAreHere from '@/components/guides/YouAreHere';
import { getGuideEcosystemCurrentStep } from '@/lib/ecosystem';
import { dedupeTextItems, getGuideOrientation, getStandardGuideSlideItems, normalizeGuideLinks } from '@/lib/guides/guideFlow';
import { resolveGuideHeroImage } from '@/lib/guides/heroImages';
import {
  getStrollerAcademyLane,
  getStrollerAcademyLanes,
} from '@/lib/guides/strollerAcademy';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

const LANE_EDITORIAL_IMAGES: Partial<
  Record<
    string,
    {
      eyebrow?: string;
      src: string;
      alt: string;
      caption: string;
    }
  >
> = {
  'full-size-modular-strollers': {
    eyebrow: 'Editorial image',
    src: '/assets/editorial/fullsize.png',
    alt: 'Editorial image for the full-size modular stroller lane.',
    caption:
      'Full-size modular strollers make more sense once the category is framed around everyday comfort, storage reality, and how much stroller the week actually asks for.',
  },
  'compact-lightweight-strollers': {
    eyebrow: 'Editorial image',
    src: '/assets/editorial/compact.png',
    alt: 'Editorial image for the compact stroller lane.',
    caption:
      'Compact strollers start making more sense once the category is framed around easier folds, tighter storage, and the kind of convenience you actually feel every day.',
  },
};

const STROLLER_SUBGUIDE_HERO = {
  src: '/assets/editorial/strollers.png',
  alt: 'Editorial stroller image for TMBC stroller lane guides.',
  objectClassName: 'object-cover object-center',
} as const;

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
      <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-[#2F2430] sm:text-[2.5rem]">{title}</h2>
      <p className="mt-4 text-base leading-8 text-[#5B4B55]">{description}</p>
    </div>
  );
}

function formatDate(value: Date) {
  return value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function StrollerAcademyLanePage({
  guide,
  sourceRoute,
  displayDate,
  readingTime,
}: {
  guide: GuideArticleRecord;
  sourceRoute: string;
  displayDate: Date;
  readingTime: number;
}) {
  const lane = getStrollerAcademyLane(guide.slug);
  if (!lane) {
    return null;
  }

  const allLanes = getStrollerAcademyLanes();
  const compareLinks = lane.compareAgainst
    .map((slug) => getStrollerAcademyLane(slug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const slideItems = getStandardGuideSlideItems('guide');
  const orientation = getGuideOrientation({ slug: guide.slug, category: guide.category, topicCluster: guide.topicCluster });
  const stageItems: AcademyStageNavItem[] = [
    {
      id: 'start',
      label: 'Start',
      title: 'Get oriented',
      description: 'See what this lane is solving before you compare it to the others.',
      href: `${sourceRoute}#${slideItems[1].id}`,
    },
    {
      id: 'compare',
      label: 'Compare',
      title: 'Understand the lane',
      description: 'See why the lane exists and what kind of week it supports best.',
      href: `${sourceRoute}#${slideItems[3].id}`,
    },
    {
      id: 'decide',
      label: 'Decide',
      title: 'Pressure-test the fit',
      description: 'Use the fit logic and comparison table before you shortlist products.',
      href: `${sourceRoute}#${slideItems[4].id}`,
    },
    {
      id: 'refine',
      label: 'Refine',
      title: 'Test and shortlist',
      description: 'Move into real-world testing, compare, and save actions.',
      href: `${sourceRoute}#${slideItems[6].id}`,
    },
  ];
  const comparisonRows = [lane, ...compareLinks].map((entry) => ({
    title: entry.title,
    bestFor: entry.bestFor,
    tradeoff: entry.tradeoff,
    everydayFeel: entry.everydayFeel,
    href: entry.href,
    isCurrent: entry.slug === lane.slug,
  }));
  const nextSteps = normalizeGuideLinks(
    [
      {
        href: '/guides/strollers',
        label: 'Back to Stroller Academy',
        description: 'Return to the main stroller map if you need the wider lane overview again.',
        stage: 'Start' as const,
      },
      ...(compareLinks[0]
        ? [
            {
              href: compareLinks[0].href,
              label: `Compare ${compareLinks[0].shortTitle}`,
              description: compareLinks[0].definition,
              stage: 'Compare' as const,
            },
          ]
        : []),
      {
        href: '/guides/car-seats',
        label: 'Open Car Seats',
        description: 'Useful once travel-system or compatibility questions start affecting the lane decision.',
        stage: 'Refine' as const,
      },
      {
        href: '/guides/registry',
        label: 'Return to Registry',
        description: 'Use the lane fit to keep the registry shortlist tighter.',
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
  const heroImageOverride = STROLLER_SUBGUIDE_HERO;
  const displayHeroImage = heroImageOverride
    ? { src: heroImageOverride.src, alt: heroImageOverride.alt }
    : heroImage;
  const displayHeroObjectClassName = heroImageOverride?.objectClassName ?? 'object-cover object-[76%_center]';

  return (
    <GuideSlideDeck
      containerId={`guide-slide-deck-${guide.slug}`}
      items={slideItems}
      backLink={{ href: '/guides', label: 'Back to TMBC Hub' }}
      ecosystemCurrentStep={getGuideEcosystemCurrentStep({
        slug: guide.slug,
        path: sourceRoute,
        category: guide.category,
      })}
    >
      <SlideSection id={slideItems[0].id} background="ivory" innerClassName="max-w-none px-0 py-0">
        <AcademyHero
          eyebrow="TMBC Academy · Stroller Lane"
          title={`${lane.title} Lane`}
          description={guide.excerpt?.trim() || lane.heroDescription}
          note={lane.signatureMoment}
          primaryCta={{ label: 'Review This Lane', href: `${sourceRoute}#${slideItems[4].id}` }}
          secondaryCta={{
            label: compareLinks[0] ? `Compare ${compareLinks[0].shortTitle}` : 'Back to Stroller Academy',
            href: compareLinks[0]?.href || '/guides/strollers',
          }}
          stageItems={stageItems}
          stats={[
            { label: 'Best for', value: lane.bestFor },
            { label: 'Tradeoff', value: lane.tradeoff },
            { label: 'Updated', value: formatDate(displayDate) },
            { label: 'Read time', value: `${readingTime} min` },
          ]}
          parentLink={{ href: '/guides', label: 'TMBC Education Hub' }}
          imageSrc={displayHeroImage.src}
          imageAlt={displayHeroImage.alt}
          imageAspectClassName="aspect-[16/11]"
          imageObjectClassName={displayHeroObjectClassName}
          imagePriority
        />
      </SlideSection>

      <SlideSection id={slideItems[1].id} background="white">
        <YouAreHere step={orientation.step} category={orientation.category} goal={orientation.goal} />
      </SlideSection>

      <SlideSection id={slideItems[2].id} background="blush">
        <GuideBulletSection
          eyebrow="Editorial Intro"
          title="Editorial Intro"
          description="This lane page should stay concise and useful while it helps you decide whether the category deserves a shortlist."
          items={[
            lane.whyExists,
            `Best for: ${lane.bestFor}`,
            `Tradeoff: ${lane.tradeoff}`,
            `Compare against: ${compareLinks.map((entry) => entry.shortTitle).join(', ') || 'the closest neighboring lanes'}.`,
          ]}
          editorialImage={LANE_EDITORIAL_IMAGES[lane.slug]}
        />
      </SlideSection>

      <SlideSection id={slideItems[3].id} background="ivory">
        <div className="space-y-8">
          <StageLead
            eyebrow="Core Considerations"
            title={`Why the ${lane.title} lane exists.`}
            description={lane.whyExists}
          />

          <ExpertTipCallout title={lane.shortTitle} body={lane.expertTip} />

          <div className="grid gap-5 xl:grid-cols-3">
            {lane.lessons.map((lesson) => (
              <section
                key={lesson.title}
                className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)]"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(215,161,175,0.14)] text-[#9F556D]">
                  <GuideGlyph icon={lane.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-2xl font-medium tracking-[-0.02em] text-[#2F2430]">{lesson.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5B4B55]">{lesson.body}</p>
              </section>
            ))}
          </div>
        </div>
      </SlideSection>

      <SlideSection id={slideItems[4].id} background="white">
        <div className="space-y-8">
          <DecisionBlock
            title={`Use the ${lane.shortTitle} fit check before you compare products.`}
            description="This is the shorter lane logic when you want the answer without rereading the whole page."
            items={[
              ...lane.worksForBullets.slice(0, 2).map((bullet) => ({
                condition: bullet.toLowerCase(),
                recommendation: `This lane is usually a strong fit. ${lane.worksForSummary}`,
                href: `${sourceRoute}#${slideItems[3].id}`,
              })),
              ...lane.notBestFitBullets.slice(0, 1).map((bullet) => ({
                condition: bullet.toLowerCase(),
                recommendation: `Compare ${compareLinks[0]?.shortTitle || 'a neighboring lane'} next. ${lane.notBestFitSummary}`,
                href: compareLinks[0]?.href,
              })),
            ]}
          />

          <ComparisonTable
            title={`Compare ${lane.shortTitle} against the closest neighboring lanes.`}
            description={lane.compareNote}
            rows={comparisonRows}
          />
        </div>
      </SlideSection>

      <SlideSection id={slideItems[5].id} background="blush">
        <div className="space-y-8">
          <GuideBulletSection
            eyebrow="Common Mistakes"
            title="Common Mistakes"
            description="These are the lane-specific misses that usually make a good category feel wrong."
            items={dedupeTextItems(
              [
                'Choosing the lane for hypothetical flexibility instead of for the current routine.',
                'Testing the showroom push and skipping the fold, lift, and storage reality.',
                `Assuming ${lane.shortTitle.toLowerCase()} is automatically smarter because the category sounds more ambitious.`,
                lane.notBestFitSummary,
              ],
              4,
            )}
          />

          <ExpertTipCallout
            eyebrow="Everyday Feel"
            title={lane.everydayFeel}
            body="The right lane should feel calmer in the life you are already living, not just more impressive in a product demo."
          />
        </div>
      </SlideSection>

      <SlideSection id={slideItems[6].id} background="ivory">
        <div className="space-y-8">
          <ChecklistCardSet
            title={`What to test before you buy ${lane.shortTitle}.`}
            description="This is where the lane gets validated. The useful questions show up when the stroller meets a trunk, a doorway, and an honest setup conversation."
            sections={lane.testSections}
          />

          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {lane.productExamples.map((example) => (
              <ProductPlaceholderCard
                key={example.name}
                eyebrow={`${lane.shortTitle} example`}
                title={example.name}
                description={example.shortReview || lane.heroDescription}
                bestFor={example.bestFor || lane.bestFor}
                standout={example.standout || lane.everydayFeel}
                watchout={lane.tradeoff}
                imageSrc={example.imageSrc}
                imageAlt={example.imageAlt}
                ctas={[
                  { label: '[PRODUCT_CARD_PLACEHOLDER]' },
                  { label: '[COMPARE_CTA_PLACEHOLDER: Compare This Stroller]' },
                  { label: '[REGISTRY_CTA_PLACEHOLDER: Add to Registry]' },
                ]}
              />
            ))}
          </div>

          <NextSteps title="Next Steps" links={nextSteps} />

          <GuideBulletSection
            eyebrow="Keep In Mind"
            title="Keep In Mind"
            description="The lane page should make comparison smaller, not bigger."
            items={dedupeTextItems(
              [
                lane.worksForSummary,
                lane.notBestFitSummary,
                lane.buyNote,
                lane.signatureMoment,
              ],
              4,
            )}
          />

          <ExpertTipCallout eyebrow="TMBC Buy Rule" title={lane.buyNote} body={lane.signatureMoment} />

          <SaveDecisionBar
            title={`Keep the ${lane.shortTitle} decision moving.`}
            description="Use the lane to save, compare, and validate the right options without slipping back into generic stroller browsing."
            actions={[
              { label: 'Back to Stroller Academy', href: '/guides/strollers' },
              compareLinks[0]
                ? { label: `Compare ${compareLinks[0].shortTitle}`, href: compareLinks[0].href }
                : { label: 'Explore Another Lane', href: allLanes[0]?.href },
              { label: '[CTA_PLACEHOLDER: Save for Later]' },
            ]}
          />

          {/* TODO: Replace compare/save/registry placeholders with live TMBC compare and registry wiring once those product actions exist. */}
        </div>
      </SlideSection>
    </GuideSlideDeck>
  );
}
