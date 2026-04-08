import GuideBulletSection from '@/components/guides/GuideBulletSection';
import DecisionBlock from '@/components/guides/DecisionBlock';
import GuideBreadcrumbs from '@/components/guides/GuideBreadcrumbs';
import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideJourneyFooter from '@/components/guides/GuideJourneyFooter';
import GuideJourneyIntro from '@/components/guides/GuideJourneyIntro';
import GuideLifestyleGallery from '@/components/guides/GuideLifestyleGallery';
import {
  GUIDE_SECTION_FRAME_CLASSNAME,
  GUIDE_SUPPORT_CARD_CLASSNAME,
  GuideSectionHeading,
} from '@/components/guides/GuidePrimitives';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import HubHero from '@/components/guides/HubHero';
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
  const breadcrumbs = getGuideBreadcrumbs({ slug, title: config.title });
  const lifestyleImages = getGuideLifestyleImages({ slug, category: config.eyebrow });
  const blogRecommendations = getGuideBlogRecommendations({ slug, category: config.eyebrow });
  const journeyPath = getGuideJourneyPath({ slug, title: config.title });
  const nextSteps = normalizeGuideLinks(config.continueLinks.map((link) => guideHubLinkToNextStepLink(link, 'Refine')));
  const whatThisIs =
    'A TMBC category hub in progress that still routes you to the strongest current guide instead of pretending the unfinished page is the destination.';
  const whyItExists =
    'Not every category grows at the same speed. This page exists to keep the next move obvious while the fuller hub is still being built.';
  const finalThought =
    'A placeholder hub is still responsible for leaving you with a clear next move. That is the whole job for now, and it is enough.';
  const takeaways = [
    'Use the strongest current guide instead of waiting for a future hub to feel finished.',
    'Treat this page like a routing tool, not a dead end.',
    'Keep moving through the TMBC sequence while the fuller category path is still growing.',
  ];
  const signOff = getGuideSignOff({});

  return (
    <GuideSlideDeck
      containerId={`guide-slide-deck-${config.path.replace(/\//g, '-')}`}
      items={slideItems}
      backLink={{ href: '/guides', label: 'Back to TMBC Hub' }}
      ecosystemCurrentStep={getGuideEcosystemCurrentStep({ slug, path: config.path, category: config.eyebrow })}
      journeyPathLabels={journeyPath}
    >
      <SlideSection id={slideItems[0].id} background="ivory" innerClassName="max-w-none px-0 py-0">
        <div className="space-y-6">
          <div className="mx-auto w-full max-w-[1520px] px-6 pt-8 md:px-10 xl:px-12">
            <GuideBreadcrumbs items={breadcrumbs} />
          </div>

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
        </div>
      </SlideSection>

      <SlideSection id={slideItems[1].id} background="white">
        <YouAreHere step={orientation.step} category={orientation.category} goal={orientation.goal} />
      </SlideSection>

      <SlideSection id={slideItems[2].id} background="blush">
        <div className="space-y-6">
          <GuideJourneyIntro
            title="Start here while the full hub is still taking shape."
            description="Even when a category is still growing, the page should give you a clear orientation and a useful next move."
            intro={[
              config.description,
              'You do not need to wait for the finished hub to keep moving. You need the strongest current route that answers the decision in front of you.',
            ]}
            calloutBody={getGuideRealLifePrompt({ slug, category: config.eyebrow })}
            whatThisIs={whatThisIs}
            whyItExists={whyItExists}
          />

          <GuideBulletSection
            eyebrow="Orientation"
            title="Orientation"
            description="These are the questions this future hub is being built to answer."
            items={config.plannedTopics.slice(0, 5)}
            editorialImage={config.editorialIntroImage}
          />

          {lifestyleImages.length > 0 ? <GuideLifestyleGallery images={lifestyleImages} /> : null}
        </div>
      </SlideSection>

      <SlideSection id={slideItems[3].id} background="ivory">
        <section className={GUIDE_SECTION_FRAME_CLASSNAME}>
          <GuideSectionHeading
            eyebrow="What Matters"
            title="This hub is being built around real questions, not filler."
            description="Until the full pathway is live, these are the questions this section is being shaped to answer."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {config.plannedTopics.map((topic) => (
              <div
                key={topic}
                className={`${GUIDE_SUPPORT_CARD_CLASSNAME} border-[rgba(215,161,175,0.14)] px-4 py-4`}
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
          eyebrow="What People Get Wrong"
          title="What People Get Wrong"
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
          <GuideJourneyFooter
            finalThought={finalThought}
            takeaways={takeaways}
            signOff={signOff}
            nextSteps={nextSteps}
            nextStepsTitle={config.continueTitle}
            nextStepsDescription={config.continueDescription}
            blogRecommendations={blogRecommendations}
          />

        </div>
      </SlideSection>
    </GuideSlideDeck>
  );
}
