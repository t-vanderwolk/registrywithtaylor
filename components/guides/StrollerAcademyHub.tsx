import AcademyHero from '@/components/guides/academy/AcademyHero';
import type { AcademyStageNavItem } from '@/components/guides/academy/AcademyStageNav';
import ChecklistCardSet from '@/components/guides/academy/ChecklistCardSet';
import ComparisonTable from '@/components/guides/academy/ComparisonTable';
import ConsultCTASection from '@/components/guides/academy/ConsultCTASection';
import DecisionFlowchart from '@/components/guides/academy/DecisionFlowchart';
import ExpertTipCallout from '@/components/guides/academy/ExpertTipCallout';
import LaneOverviewGrid from '@/components/guides/academy/LaneOverviewGrid';
import PlanningFlow from '@/components/guides/academy/PlanningFlow';
import ProductPlaceholderCard from '@/components/guides/academy/ProductPlaceholderCard';
import SaveDecisionBar from '@/components/guides/academy/SaveDecisionBar';
import GuideGlyph from '@/components/guides/GuideGlyph';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import SlideSection from '@/components/guides/SlideSection';
import {
  getStrollerAcademyConsultCards,
  getStrollerAcademyFlowchart,
  getStrollerAcademyLane,
  getStrollerAcademyLanes,
  getStrollerAcademyLearnModules,
  getStrollerAcademyPlanQuestions,
  getStrollerAcademyStages,
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
  const consultCards = getStrollerAcademyConsultCards();
  const stageItems: AcademyStageNavItem[] = getStrollerAcademyStages().map((stage) => ({
    id: stage.id,
    label: stage.label,
    title: stage.title,
    description: stage.description,
    href: `${sourceRoute}#academy-${stage.id}`,
  }));
  const slideItems = [
    { id: 'academy-overview', label: 'Overview', shortLabel: 'Start' },
    { id: 'academy-learn', label: 'Learn', shortLabel: 'Learn' },
    { id: 'academy-plan', label: 'Plan', shortLabel: 'Plan' },
    { id: 'academy-try', label: 'Try', shortLabel: 'Try' },
    { id: 'academy-buy', label: 'Buy', shortLabel: 'Buy' },
    { id: 'academy-next', label: 'Next Steps', shortLabel: 'Next' },
  ];

  return (
    <GuideSlideDeck containerId={`guide-slide-deck-${guide.slug}`} items={slideItems}>
      <SlideSection id="academy-overview" background="ivory" innerClassName="max-w-none px-0 py-0">
        <AcademyHero
          eyebrow="TMBC Academy · Strollers"
          title="Choose your stroller with confidence, not confusion."
          description="Most parents do not choose the wrong stroller. They choose the wrong category. This stroller Academy helps you learn the lanes, plan around real life, test the fit, and buy without guesswork."
          note="The stroller should make your week easier. It does not need to win a showroom talent competition."
          primaryCta={{ label: 'Start Your Stroller Plan', href: `${sourceRoute}#academy-plan` }}
          secondaryCta={{ label: 'Explore Stroller Lanes', href: `${sourceRoute}#academy-learn` }}
          stageItems={stageItems}
          stats={[
            { label: 'Academy stages', value: '4' },
            { label: 'Stroller lanes', value: String(lanes.length) },
            { label: 'Quick start', value: `${readingTime} min` },
          ]}
        />
      </SlideSection>

      <SlideSection id="academy-learn" background="white">
        <div className="space-y-8">
          <StageLead
            eyebrow="Learn"
            title="Start with the role the stroller has to play in your real life."
            description="The category gets easier once you sort daily workflow, storage pressure, travel, future sibling timing, and route quality. This is the part long guide pages usually bury under too much prose."
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
                <div className="mt-5 space-y-3">
                  {module.bullets.map((bullet) => (
                    <div key={bullet} className="rounded-[1.2rem] bg-[rgba(252,247,249,0.9)] px-4 py-4">
                      <p className="text-sm leading-7 text-[#4B3641]">{bullet}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <DecisionFlowchart
            title="A cleaner way to narrow the lane before you compare brands."
            description="This is not a quiz result pretending to know your soul. It is a decision map that keeps the first question in the right order."
            nodes={flowchart}
          />

          <LaneOverviewGrid
            title="The six stroller lanes TMBC uses to simplify the decision."
            description="Each lane solves a different version of everyday life. Read them like roles, not like status levels."
            lanes={lanes}
          />
        </div>
      </SlideSection>

      <SlideSection id="academy-plan" background="blush">
        <div className="space-y-8">
          <StageLead
            eyebrow="Plan"
            title="Use the planning flow to identify the lane that fits your actual week."
            description="The right answer usually shows up once you answer the practical questions honestly: current seats, future timing, car life, storage, travel, terrain, and whether you want less stroller or more capability."
          />

          <PlanningFlow
            title="Build your stroller fit."
            description="Move one question at a time. The goal is not to crown the fanciest stroller. The goal is to surface the lane that makes daily life easier."
            questions={questions}
            lanes={lanes}
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

          <ExpertTipCallout
            title="Most parents do not need more stroller options. They need better decision order."
            body="Start with lane fit first. Then compare the products inside that lane. The reverse order is how stroller shopping turns into late-night brand theater."
          />
        </div>
      </SlideSection>

      <SlideSection id="academy-try" background="ivory">
        <div className="space-y-8">
          <ChecklistCardSet
            title="Try the stroller in the ways your week will actually use it."
            description="The real validation stage happens with folds, corners, trunks, baskets, and honest questions. The quick showroom push is not enough."
            sections={tryChecklist}
          />

          <ConsultCTASection
            title="Bridge the digital plan into a real-world test."
            description="This stage matters because trust gets built when the recommendation survives a trunk, a curb, and a real conversation."
            cards={consultCards}
          />

          <ExpertTipCallout
            title="Test the fold, not just the push."
            body="A stroller can feel lovely gliding across a polished floor and still be deeply annoying the third time you load it into a trunk with one hand occupied."
          />
        </div>
      </SlideSection>

      <SlideSection id="academy-buy" background="blush">
        <div className="space-y-8">
          <StageLead
            eyebrow="Buy"
            title="Buy from the lane that fits, not the stroller that sounds the most flexible."
            description="This layer is designed for future compare, registry, and affiliate wiring. For now it gives the experience a calm, confidence-driven buying structure instead of dropping you back into blog chaos."
          />

          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {lanes.map((lane) => {
              const example = lane.productExamples[0];

              return (
                <ProductPlaceholderCard
                  key={lane.slug}
                  eyebrow={`${lane.title} lane`}
                  title={example?.name || `${lane.title} recommendation placeholder`}
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

          <ExpertTipCallout
            eyebrow="TMBC Buy Rule"
            title="Do not buy the most flexible stroller. Buy the one that fits your life best right now."
            body="Future-proofing has limits. A stroller that feels wrong in present-day life rarely becomes charming later just because it had an ambitious product page."
          />
        </div>
      </SlideSection>

      <SlideSection id="academy-next" background="white">
        <div className="space-y-8">
          <SaveDecisionBar
            title="Move into the next TMBC step with a lane already in focus."
            description="Once the lane is clear, the next step is simple: open the lane page, test it in person, and save the options worth comparing. That is how this turns from education into confident action."
            actions={[
              { label: 'Open the Convertible Lane', href: getStrollerAcademyLane('convertible-strollers')?.href },
              { label: '[CTA_PLACEHOLDER: Compare Strollers]' },
              { label: '[CTA_PLACEHOLDER: Save for Later]' },
            ].filter((action): action is { label: string; href?: string } => Boolean(action.label))}
          />

          <div className="grid gap-5 lg:grid-cols-3">
            <section className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)]">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Explore</p>
              <h3 className="mt-3 text-xl font-medium text-[#2F2430]">Open the lane details.</h3>
              <p className="mt-3 text-sm leading-7 text-[#5B4B55]">
                Each lane page keeps the same Academy structure, so the next decision still feels guided instead of stacked.
              </p>
            </section>

            <section className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)]">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Validate</p>
              <h3 className="mt-3 text-xl font-medium text-[#2F2430]">Book or visit with a plan in hand.</h3>
              <p className="mt-3 text-sm leading-7 text-[#5B4B55]">
                The consult and in-store stage works better once you know what you are testing and what tradeoff you are willing to keep.
              </p>
            </section>

            <section className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)]">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Save</p>
              <h3 className="mt-3 text-xl font-medium text-[#2F2430]">Keep the decision ready for compare and registry wiring.</h3>
              <p className="mt-3 text-sm leading-7 text-[#5B4B55]">
                The hub is already structured for future compare tables, registry hooks, and affiliate actions without turning into a retailer page.
              </p>
            </section>
          </div>

          {/* TODO: Replace compare/save placeholders with live TMBC compare and registry actions when those flows are wired. */}
        </div>
      </SlideSection>
    </GuideSlideDeck>
  );
}
