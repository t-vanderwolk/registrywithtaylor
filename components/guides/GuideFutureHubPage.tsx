import GuideBulletSection from '@/components/guides/GuideBulletSection';
import DecisionBlock from '@/components/guides/DecisionBlock';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import HubHero from '@/components/guides/HubHero';
import NextSteps from '@/components/guides/NextSteps';
import SlideSection from '@/components/guides/SlideSection';
import YouAreHere from '@/components/guides/YouAreHere';
import { getGuideEcosystemCurrentStep } from '@/lib/ecosystem';
import {
  getGuideOrientation,
  getStandardGuideSlideItems,
  guideHubLinkToNextStepLink,
  normalizeGuideLinks,
} from '@/lib/guides/guideFlow';
import type { FutureGuideHubConfig } from '@/lib/guides/educationHub';

export default function GuideFutureHubPage({
  config,
}: {
  config: FutureGuideHubConfig;
}) {
  const slug = config.path.split('/').pop() ?? 'guide';
  const slideItems = getStandardGuideSlideItems(`future-${slug}`);
  const orientation = getGuideOrientation({ slug, category: config.eyebrow });
  const nextSteps = normalizeGuideLinks(config.continueLinks.map((link) => guideHubLinkToNextStepLink(link, 'Refine')));

  return (
    <GuideSlideDeck
      containerId={`guide-slide-deck-${config.path.replace(/\//g, '-')}`}
      items={slideItems}
      backLink={{ href: '/guides', label: 'Back to TMBC Hub' }}
      ecosystemCurrentStep={getGuideEcosystemCurrentStep({ slug, path: config.path, category: config.eyebrow })}
    >
      <SlideSection id={slideItems[0].id} background="ivory" innerClassName="max-w-none px-0 py-0">
        <HubHero
          slug={slug}
          parentLink={{ href: '/guides', label: 'TMBC Education Hub' }}
          eyebrow={config.eyebrow}
          category={config.eyebrow}
          title={config.title}
          description={config.description}
          note={config.note}
          stats={config.stats}
          highlights={config.highlights}
          jumpLinks={slideItems.slice(1).map((item) => ({ href: `#${item.id}`, label: item.label }))}
        />
      </SlideSection>

      <SlideSection id={slideItems[1].id} background="white">
        <YouAreHere step={orientation.step} category={orientation.category} goal={orientation.goal} />
      </SlideSection>

      <SlideSection id={slideItems[2].id} background="blush">
        <GuideBulletSection
          eyebrow="Editorial Intro"
          title="Editorial Intro"
          description="Even while the full hub is growing, the structure is still meant to be clear and scannable."
          items={config.plannedTopics.slice(0, 5)}
          editorialImage={config.editorialIntroImage}
        />
      </SlideSection>

      <SlideSection id={slideItems[3].id} background="ivory">
        <section className="rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] md:p-8">
          <div className="space-y-3">
            <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">Core Considerations</p>
            <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.35rem]">
              This hub is being built around real questions, not filler.
            </h2>
            <p className="max-w-4xl text-base leading-8 text-[#5B4B55] md:text-lg">
              Until the full pathway is live, these are the questions this section is being shaped to answer.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {config.plannedTopics.map((topic) => (
              <div
                key={topic}
                className="rounded-[1.35rem] border border-[rgba(215,161,175,0.14)] bg-[rgba(252,247,249,0.9)] px-4 py-4"
              >
                <p className="text-base leading-7 text-[#4B3641]">{topic}</p>
              </div>
            ))}
          </div>
        </section>
      </SlideSection>

      <SlideSection id={slideItems[4].id} background="white">
        <DecisionBlock
          title="Use the strongest current route while this hub is still growing."
          description="You do not need to wait for the perfect future hub to keep moving. Use the best adjacent guide that already answers the decision in front of you."
          items={config.continueLinks.slice(0, 3).map((link) => ({
            condition: `need help with ${link.title.toLowerCase()}`,
            recommendation: link.description,
            href: link.href,
          }))}
        />
      </SlideSection>

      <SlideSection id={slideItems[5].id} background="blush">
        <GuideBulletSection
          eyebrow="Common Mistakes"
          title="Common Mistakes"
          description="These future hubs are placeholders, but they still need to keep the flow practical."
          items={[
            'Waiting for a future hub instead of using the best current guide that already answers the question.',
            'Treating this placeholder like a dead end instead of a routing step.',
            'Opening related topics without checking which one actually solves the present decision first.',
          ]}
        />
      </SlideSection>

      <SlideSection id={slideItems[6].id} background="ivory">
        <div className="space-y-8">
          <NextSteps
            title={config.continueTitle}
            description={config.continueDescription}
            links={nextSteps}
          />

          <GuideBulletSection
            eyebrow="Keep In Mind"
            title="Keep In Mind"
            description="The future hub still needs to leave you with a clear route."
            items={[
              'The TMBC Academy should always offer a practical next move, even when a category is still growing.',
              'Use the strongest current guide instead of waiting for the whole section to be finished.',
              'Come back here once the broader hub is live, but keep moving now.',
            ]}
          />
        </div>
      </SlideSection>
    </GuideSlideDeck>
  );
}
