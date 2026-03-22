import GuideBulletSection from '@/components/guides/GuideBulletSection';
import DecisionBlock from '@/components/guides/DecisionBlock';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import HubHero from '@/components/guides/HubHero';
import NextSteps from '@/components/guides/NextSteps';
import SlideSection from '@/components/guides/SlideSection';
import YouAreHere from '@/components/guides/YouAreHere';
import {
  getGuideOrientation,
  getStandardGuideSlideItems,
  guideHubLinkToNextStepLink,
  normalizeGuideLinks,
  type GuideStageLabel,
} from '@/lib/guides/guideFlow';
import { guidesEducationHubContent } from '@/lib/guides/educationHub';

type StageGroup = {
  stage: GuideStageLabel;
  title: string;
  description: string;
  cards: Array<{
    title: string;
    description: string;
    href: string;
  }>;
};

const stageGroups: StageGroup[] = [
  {
    stage: 'Start',
    title: 'Start with the planning foundations.',
    description: 'These guides help you set the order before the gear categories get loud.',
    cards: [
      {
        title: 'Nursery',
        description: 'Plan the room around routine, not just the reveal photo.',
        href: '/guides/nursery',
      },
      {
        title: 'Registry',
        description: 'Build the list around what actually matters first.',
        href: '/guides/registry',
      },
      {
        title: 'Essentials',
        description: 'Filter what belongs in the early setup and what can wait.',
        href: '/guides/essentials',
      },
    ],
  },
  {
    stage: 'Compare',
    title: 'Compare the big gear categories clearly.',
    description: 'Use these guides when the lane or seat path matters more than the product page.',
    cards: [
      {
        title: 'Strollers',
        description: 'Choose the stroller lane before comparing models.',
        href: '/guides/strollers',
      },
      {
        title: 'Car Seats',
        description: 'Choose the car seat path before comparing seats.',
        href: '/guides/car-seats',
      },
    ],
  },
  {
    stage: 'Optimize',
    title: 'Optimize the everyday setup.',
    description: 'These guides help once the fundamentals are set and the routine details start to matter more.',
    cards: [
      {
        title: 'Travel With Baby',
        description: 'Make leaving home and going farther feel less chaotic.',
        href: '/guides/travel-with-baby',
      },
      {
        title: 'Feeding',
        description: 'Sort feeding gear without building a cart out of panic.',
        href: '/guides/feeding',
      },
      {
        title: 'Postpartum',
        description: 'Keep the adult recovery setup in the plan too.',
        href: '/guides/postpartum',
      },
    ],
  },
];

export default function GuidesEducationHub() {
  const slideItems = getStandardGuideSlideItems('guides');
  const orientation = getGuideOrientation({ slug: 'guides-hub', category: 'TMBC Academy' });
  const featuredStages: GuideStageLabel[] = ['Start', 'Optimize', 'Decide', 'Compare'];
  const nextSteps = normalizeGuideLinks(
    guidesEducationHubContent.featured.links.map((link, index) =>
      guideHubLinkToNextStepLink(link, featuredStages[index] ?? 'Refine'),
    ),
  );

  return (
    <GuideSlideDeck containerId="guide-slide-deck-guides-hub" items={slideItems} ecosystemCurrentStep={4}>
      <SlideSection id={slideItems[0].id} background="ivory" innerClassName="max-w-none px-0 py-0">
        <HubHero
          eyebrow={guidesEducationHubContent.hero.eyebrow}
          title={guidesEducationHubContent.hero.title}
          description={guidesEducationHubContent.hero.description}
          note={guidesEducationHubContent.hero.note}
          stats={guidesEducationHubContent.hero.stats}
          highlights={guidesEducationHubContent.hero.highlights}
          jumpLinks={slideItems.slice(1).map((item) => ({ href: `#${item.id}`, label: item.label }))}
        />
      </SlideSection>

      <SlideSection id={slideItems[1].id} background="white">
        <YouAreHere step={orientation.step} category={orientation.category} goal={orientation.goal} />
      </SlideSection>

      <SlideSection id={slideItems[2].id} background="blush">
        <GuideBulletSection
          eyebrow="What This Guide Covers"
          title="What This Guide Covers"
          description="The hub is meant to answer three questions quickly: where to start, what category to open next, and how the guides connect."
          items={[
            'The best starting point based on the decision that feels most immediate.',
            'The main guide categories grouped by stage instead of by content dump.',
            'A clearer route from broad planning into specific comparison guides.',
            'The next links that keep you moving without dead ends.',
          ]}
        />
      </SlideSection>

      <SlideSection id={slideItems[3].id} background="ivory">
        <div className="space-y-8">
          {stageGroups.map((group) => (
            <section key={group.stage} className="rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] md:p-8">
              <div className="space-y-3">
                <span className="inline-flex min-h-[32px] items-center rounded-full bg-[rgba(215,161,175,0.14)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-[#8F4C62]">
                  {group.stage}
                </span>
                <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.2rem]">{group.title}</h2>
                <p className="max-w-4xl text-base leading-8 text-[#5B4B55] md:text-lg">{group.description}</p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.cards.map((card) => (
                  <a
                    key={card.href}
                    href={card.href}
                    className="group rounded-[1.5rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.9)] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(58,36,43,0.10)]"
                  >
                    <span className="inline-flex min-h-[28px] items-center rounded-full bg-white/90 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-[#8F4C62]">
                      {group.stage}
                    </span>
                    <h3 className="mt-4 text-[1.25rem] font-medium leading-[1.1] tracking-[-0.02em] text-[#2F2430]">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5B4B55]">{card.description}</p>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </SlideSection>

      <SlideSection id={slideItems[4].id} background="white">
        <DecisionBlock
          title="Choose your entry point by the decision, not by the longest page."
          description="This is the fastest way into the system if you do not want to guess which guide deserves your attention first."
          items={[
            {
              condition: 'are building the plan from scratch',
              recommendation: 'Start with Registry or Nursery so the order is doing some of the work for you.',
              href: '/guides/registry',
            },
            {
              condition: 'are already comparing major gear',
              recommendation: 'Open Strollers or Car Seats and choose the right lane before comparing products.',
              href: '/guides/strollers',
            },
            {
              condition: 'mostly need the supporting routine dialed in',
              recommendation: 'Move into Travel, Feeding, or Postpartum to tighten the setup around everyday life.',
              href: '/guides/travel-with-baby',
            },
          ]}
        />
      </SlideSection>

      <SlideSection id={slideItems[5].id} background="blush">
        <GuideBulletSection
          eyebrow="Common Mistakes"
          title="Common Mistakes"
          description="The hub works best when it acts like a route map instead of another place to drift."
          items={[
            'Starting with whichever guide title sounds the most urgent instead of the decision you actually need to make.',
            'Treating every category like a same-day problem.',
            'Opening the sub-guides before the parent guide has made the lane or category clear.',
            'Finishing a guide without taking the next linked step while the context is still fresh.',
          ]}
        />
      </SlideSection>

      <SlideSection id={slideItems[6].id} background="ivory">
        <NextSteps
          title="Next Steps"
          description="If you want the shortest route from here, these are the strongest starting points right now."
          links={nextSteps}
        />
      </SlideSection>

      <SlideSection id={slideItems[7].id} background="white">
        <GuideBulletSection
          eyebrow="Takeaways"
          title="Takeaways"
          description="The TMBC Academy works best when it moves in sequence."
          items={guidesEducationHubContent.learningPath.steps.map((step) => `${step.title}: ${step.description}`)}
        />
      </SlideSection>
    </GuideSlideDeck>
  );
}
