import AcademyHero from '@/components/guides/academy/AcademyHero';
import type { AcademyStageNavItem } from '@/components/guides/academy/AcademyStageNav';
import ChecklistCardSet from '@/components/guides/academy/ChecklistCardSet';
import ComparisonTable from '@/components/guides/academy/ComparisonTable';
import ConsultCTASection from '@/components/guides/academy/ConsultCTASection';
import ExpertTipCallout from '@/components/guides/academy/ExpertTipCallout';
import ProductPlaceholderCard from '@/components/guides/academy/ProductPlaceholderCard';
import SaveDecisionBar from '@/components/guides/academy/SaveDecisionBar';
import GuideGlyph from '@/components/guides/GuideGlyph';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import SlideSection from '@/components/guides/SlideSection';
import {
  getStrollerAcademyConsultCards,
  getStrollerAcademyLane,
  getStrollerAcademyLanes,
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

  const consultCards = getStrollerAcademyConsultCards();
  const allLanes = getStrollerAcademyLanes();
  const compareLinks = lane.compareAgainst
    .map((slug) => getStrollerAcademyLane(slug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const comparisonRows = [lane, ...compareLinks].map((entry) => ({
    title: entry.title,
    bestFor: entry.bestFor,
    tradeoff: entry.tradeoff,
    everydayFeel: entry.everydayFeel,
    href: entry.href,
    isCurrent: entry.slug === lane.slug,
  }));
  const stageItems: AcademyStageNavItem[] = [
    {
      id: 'learn',
      label: 'Learn',
      title: 'Why this lane exists',
      description: 'Understand the role this stroller lane is meant to solve.',
      href: `${sourceRoute}#lane-why`,
    },
    {
      id: 'plan',
      label: 'Plan',
      title: 'Check the real-life fit',
      description: 'See who this lane helps, and where it becomes too much.',
      href: `${sourceRoute}#lane-fit`,
    },
    {
      id: 'try',
      label: 'Try',
      title: 'Test it in person',
      description: 'Pressure-test the fold, layout, steering, and actual usability.',
      href: `${sourceRoute}#lane-try`,
    },
    {
      id: 'buy',
      label: 'Buy',
      title: 'Move into compare and registry later',
      description: 'Use the lane to anchor product comparison without losing the plot.',
      href: `${sourceRoute}#lane-buy`,
    },
  ];
  const slideItems = [
    { id: 'lane-overview', label: 'Overview', shortLabel: 'Start' },
    { id: 'lane-why', label: 'Why It Exists', shortLabel: 'Why' },
    { id: 'lane-fit', label: 'Real-Life Fit', shortLabel: 'Fit' },
    { id: 'lane-compare', label: 'Compare', shortLabel: 'Compare' },
    { id: 'lane-try', label: 'Try', shortLabel: 'Try' },
    { id: 'lane-buy', label: 'Buy', shortLabel: 'Buy' },
  ];

  return (
    <GuideSlideDeck containerId={`guide-slide-deck-${guide.slug}`} items={slideItems}>
      <SlideSection id="lane-overview" background="ivory" innerClassName="max-w-none px-0 py-0">
        <AcademyHero
          eyebrow="TMBC Academy · Stroller Lane"
          title={`${lane.title} Lane`}
          description={guide.excerpt?.trim() || lane.heroDescription}
          note={lane.signatureMoment}
          primaryCta={{ label: 'Review This Lane', href: `${sourceRoute}#lane-fit` }}
          secondaryCta={{
            label: compareLinks[0] ? `Compare ${compareLinks[0].shortTitle}` : 'Back to Stroller Academy',
            href: compareLinks[0]?.href || getStrollerAcademyLane('full-size-modular-strollers')?.href || '/guides/strollers',
          }}
          stageItems={stageItems}
          stats={[
            { label: 'Best for', value: lane.bestFor },
            { label: 'Tradeoff', value: lane.tradeoff },
            { label: 'Updated', value: formatDate(displayDate) },
            { label: 'Read time', value: `${readingTime} min` },
          ]}
        />
      </SlideSection>

      <SlideSection id="lane-why" background="white">
        <div className="space-y-8">
          <StageLead
            eyebrow="Learn"
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

      <SlideSection id="lane-fit" background="blush">
        <div className="space-y-8">
          <StageLead
            eyebrow="Plan"
            title={`See whether ${lane.shortTitle} fits your real week.`}
            description="This section keeps the lane honest. It shows where the fit feels strong, where the tradeoff starts to bite, and what most parents should compare next."
          />

          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(20rem,0.65fr)]">
            <section className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:p-7">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Best For</p>
              <h3 className="mt-3 text-2xl font-medium text-[#2F2430]">{lane.worksForSummary}</h3>
              <div className="mt-5 space-y-3">
                {lane.worksForBullets.map((bullet) => (
                  <div key={bullet} className="rounded-[1.2rem] bg-[rgba(252,247,249,0.9)] px-4 py-4">
                    <p className="text-sm leading-7 text-[#4B3641]">{bullet}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:p-7">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Tradeoff</p>
              <h3 className="mt-3 text-2xl font-medium text-[#2F2430]">{lane.notBestFitSummary}</h3>
              <div className="mt-5 space-y-3">
                {lane.notBestFitBullets.map((bullet) => (
                  <div key={bullet} className="rounded-[1.2rem] bg-[rgba(250,244,246,0.92)] px-4 py-4">
                    <p className="text-sm leading-7 text-[#4B3641]">{bullet}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <ExpertTipCallout
            eyebrow="Everyday Feel"
            title={lane.everydayFeel}
            body="The right lane should feel calmer in the life you are already living, not just more impressive in a product demo."
          />
        </div>
      </SlideSection>

      <SlideSection id="lane-compare" background="ivory">
        <div className="space-y-8">
          <ComparisonTable
            title={`Compare ${lane.shortTitle} against the closest neighboring lanes.`}
            description={lane.compareNote}
            rows={comparisonRows}
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {compareLinks.map((compareLane) => (
              <a
                key={compareLane.slug}
                href={compareLane.href}
                className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(58,36,43,0.12)]"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Compare With</p>
                <h3 className="mt-3 text-xl font-medium text-[#2F2430]">{compareLane.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5B4B55]">{compareLane.definition}</p>
              </a>
            ))}
          </div>
        </div>
      </SlideSection>

      <SlideSection id="lane-try" background="blush">
        <div className="space-y-8">
          <ChecklistCardSet
            title={`What to test before you buy ${lane.shortTitle}.`}
            description="This is where the lane gets validated. The most useful questions usually show up when the stroller meets a trunk, a doorway, and an honest setup conversation."
            sections={lane.testSections}
          />

          <ConsultCTASection
            title={`Where to validate the ${lane.shortTitle} lane.`}
            description="Use this part of the process to pressure-test the lane with a plan already in hand instead of walking in cold."
            cards={consultCards}
          />
        </div>
      </SlideSection>

      <SlideSection id="lane-buy" background="white">
        <div className="space-y-8">
          <StageLead
            eyebrow="Buy"
            title={`Move from ${lane.shortTitle} lane to shortlist.`}
            description="The lane page should make product comparison smaller, not bigger. Use it to anchor the shortlist, the compare flow, and the future registry action."
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

          <ExpertTipCallout eyebrow="TMBC Buy Rule" title={lane.buyNote} body={lane.signatureMoment} />

          <SaveDecisionBar
            title={`Keep the ${lane.shortTitle} decision moving.`}
            description="Use the lane to save, compare, and validate the right options without slipping back into generic stroller browsing."
            actions={[
              { label: 'Back to Stroller Academy', href: '/guides/strollers' },
              compareLinks[0] ? { label: `Compare ${compareLinks[0].shortTitle}`, href: compareLinks[0].href } : { label: 'Explore Another Lane', href: allLanes[0]?.href },
              { label: '[CTA_PLACEHOLDER: Save for Later]' },
            ]}
          />

          {/* TODO: Replace compare/save/registry placeholders with live TMBC compare and registry wiring once those product actions exist. */}
        </div>
      </SlideSection>
    </GuideSlideDeck>
  );
}
