import GuideBreadcrumbs from '@/components/guides/GuideBreadcrumbs';
import GuideBulletSection from '@/components/guides/GuideBulletSection';
import GuideCardRouter from '@/components/guides/GuideCardRouter';
import GuideCarouselLayout from '@/components/guides/GuideCarouselLayout';
import GuideContinueJourney from '@/components/guides/GuideContinueJourney';
import DecisionBlock from '@/components/guides/DecisionBlock';
import GuideJourneyFooter from '@/components/guides/GuideJourneyFooter';
import GuideJourneyIntro from '@/components/guides/GuideJourneyIntro';
import GuideLifestyleGallery from '@/components/guides/GuideLifestyleGallery';
import GuideSlide from '@/components/guides/GuideSlide';
import AcademyHero from '@/components/guides/academy/AcademyHero';
import {
  getGuideBlogRecommendations,
  getGuideBreadcrumbs,
  getGuideJourneyPath,
  getGuideLifestyleImages,
  getGuideRealLifePrompt,
} from '@/lib/guides/experience';
import { getGuideSignOff } from '@/lib/guides/editorialSystem';
import { normalizeGuideLinks } from '@/lib/guides/guideFlow';
import { getMasterGuideFlowCards } from '@/lib/guides/masterJourney';

const HUB_SLIDES = [
  { id: 'guides-hub-hero', label: 'Start Here', shortLabel: 'Start' },
  { id: 'guides-hub-flow', label: 'Step Flow', shortLabel: 'Flow' },
  { id: 'guides-hub-categories', label: 'Categories', shortLabel: 'Route' },
  { id: 'guides-hub-next', label: 'Next Steps', shortLabel: 'Next' },
] as const;

export default function GuidesEducationHub() {
  const breadcrumbs = getGuideBreadcrumbs({ slug: 'guides-hub', title: 'Guide Hub' });
  const lifestyleImages = getGuideLifestyleImages({ slug: 'guides-hub', category: 'TMBC Guide Hub' });
  const blogRecommendations = getGuideBlogRecommendations({ slug: 'guides-hub', category: 'TMBC Guide Hub' });
  const journeyPath = getGuideJourneyPath({ slug: 'guides-hub', title: 'TMBC Guide Hub' });
  const masterFlowCards = getMasterGuideFlowCards();
  const extendedGuides = [
    {
      title: 'Essentials',
      description: 'Use the essentials filter when you want fewer assumptions and a calmer first-weeks baseline.',
      href: '/guides/essentials',
      icon: 'book' as const,
    },
    {
      title: 'Feeding',
      description: 'Build one practical feeding setup before you buy backup systems for every possible outcome.',
      href: '/guides/feeding',
      icon: 'bag' as const,
    },
    {
      title: 'Postpartum',
      description: 'Make room for recovery, support, and the adult part of the plan too.',
      href: '/guides/postpartum',
      icon: 'layers' as const,
    },
  ];
  const nextSteps = normalizeGuideLinks(
    masterFlowCards.slice(0, 4).map((card, index) => ({
      href: card.href,
      label: card.title,
      description:
        index === 0
          ? 'Start here if the whole plan still feels noisy and you want the sequence to make more sense first.'
          : `Use ${card.title} once the step before it already feels steadier.`,
      stage: index === 0 ? 'Start' : 'Refine',
    })),
  );
  const whatThisIs =
    'A registry-first guide hub that turns baby prep into a sequence instead of a pile of categories with equally loud opinions.';
  const whyItExists =
    'Parents usually do not need more information. They need a clearer order for using it. This hub exists to supply that order.';
  const finalThought =
    'The TMBC guide system works best when it behaves like a calm route, not a buffet. Registry first. Then the rest gets easier to trust.';
  const takeaways = [
    'Start with Registry when the whole plan still feels noisy.',
    'Let Nursery shape the room before the bigger gear decisions start competing for attention.',
    'Move into Strollers, then Car Seats, then Travel in that order when the foundation underneath them is steadier.',
  ];
  const signOff = getGuideSignOff({});

  return (
    <GuideCarouselLayout
      containerId="guides-hub-carousel"
      items={[...HUB_SLIDES]}
      backLink={{ href: '/', label: 'Back to TMBC Home' }}
      ecosystemCurrentStep={1}
      journeyPathLabels={journeyPath}
    >
      <GuideSlide id={HUB_SLIDES[0].id} background="ivory" innerClassName="max-w-none px-0 py-0">
        <div className="space-y-6">
          <div className="mx-auto w-full max-w-[1520px] px-6 pt-8 md:px-10 xl:px-12">
            <GuideBreadcrumbs items={breadcrumbs} />
          </div>

          <section className="bg-[linear-gradient(180deg,#FBF7F8_0%,#FFFFFF_100%)]">
            <div className="mx-auto w-full max-w-[1520px] px-6 pb-12 pt-10 md:px-10 md:pb-16 md:pt-14 xl:px-12">
              <div className="space-y-6">
                <AcademyHero
                  eyebrow="TMBC Guide Hub"
                  title="Start Your Baby Prep the Right Way"
                  description="TMBC works best as a guided decision platform, not a content pile. Start with Registry, move into Nursery, then let Strollers, Car Seats, Travel, and Daily Use Gear enter the conversation in the right order."
                  note="Some baby prep gets complicated because the categories show up in the wrong order. Registry first fixes more than it gets credit for."
                  primaryCta={{ href: '/guides/registry', label: 'Start with Registry' }}
                  secondaryCta={{ href: `#${HUB_SLIDES[1].id}`, label: 'See the 6-step flow' }}
                  stageItems={masterFlowCards.map((card, index) => ({
                    id: card.slug,
                    label: String(index + 1).padStart(2, '0'),
                    title: card.title,
                    description: `Step ${index + 1} in the TMBC journey.`,
                    href: card.href,
                  }))}
                  stats={[
                    { label: 'Core steps', value: '6 before buy' },
                    { label: 'Entry point', value: 'Registry first' },
                    { label: 'Built for', value: 'Decision clarity' },
                  ]}
                  parentLink={{ href: '/', label: 'Taylor-Made Baby Co.' }}
                  imageSrc="/assets/editorial/registry.jpg"
                  imageAlt="Editorial registry planning image for the TMBC guide hub."
                  imageAspectClassName="aspect-[16/11]"
                  imageObjectClassName="object-cover object-center"
                  imagePriority
                />

                <GuideContinueJourney />
              </div>
            </div>
          </section>
        </div>
      </GuideSlide>

      <GuideSlide id={HUB_SLIDES[1].id} background="white">
        <div className="space-y-8">
          <GuideJourneyIntro
            title="The TMBC guide system has a real order."
            description="This is not a scavenger hunt. It is a calmer sequence built to keep your decisions smaller as you move."
            intro={[
              'Registry comes first because it forces the whole plan into better order. Nursery comes next because room flow affects what belongs in the house. Then the gear categories get much easier to judge because they are finally being asked to support a clearer life.',
              'If you skip the order, baby prep starts sounding like six urgent categories instead of one guided journey. That is a rough trade.',
            ]}
            calloutBody={getGuideRealLifePrompt({ slug: 'guides-hub', category: 'TMBC Guide Hub' })}
            whatThisIs={whatThisIs}
            whyItExists={whyItExists}
          />

          <GuideCardRouter
            eyebrow="Step Flow"
            title="Registry -> Nursery -> Strollers -> Car Seats -> Travel -> Daily Use Gear"
            description="This is the core TMBC order. The goal is not to make you read more. The goal is to stop each new category from showing up before the one underneath it is clear."
            cards={masterFlowCards.map((card, index) => ({
              ...card,
              bestFor: `Step ${index + 1}`,
            }))}
            ctaLabel="Open step"
          />

          <GuideLifestyleGallery images={lifestyleImages} />
        </div>
      </GuideSlide>

      <GuideSlide id={HUB_SLIDES[2].id} background="blush">
        <div className="space-y-8">
          <GuideCardRouter
            eyebrow="Category Carousel"
            title="Choose the right category without losing the sequence."
            description="Open the lane that matches where you are in the journey. Registry is the front door. The rest should follow because they need something steadier to attach themselves to."
            cards={masterFlowCards}
            ctaLabel="Start here"
          />

          <GuideCardRouter
            eyebrow="Additional Hubs"
            title="Use these once the core path is steady."
            description="Essentials, Feeding, and Postpartum matter. They just work better when the core planning structure is already in place."
            cards={extendedGuides}
            ctaLabel="Open hub"
          />

          <GuideBulletSection
            eyebrow="What People Get Wrong"
            title="What People Get Wrong"
            description="The hub works best when it acts like a front door, not a category buffet."
            items={[
              'Starting with the loudest expensive category instead of the sequence that makes the whole plan cleaner.',
              'Opening a narrow sub-guide before the main guide has explained the category itself.',
              'Treating the guide system like a reading assignment instead of a routing system.',
              'Skipping Registry because it sounds administrative, then wondering why the rest of the decisions keep sprawling.',
            ]}
          />
        </div>
      </GuideSlide>

      <GuideSlide id={HUB_SLIDES[3].id} background="ivory">
        <div className="space-y-8">
          <DecisionBlock
            title="Choose your first click by the stage, not by the mood."
            description="If you are not sure where to begin, use the shortest possible routing logic."
            items={[
              {
                condition: 'need the whole plan to make more sense before you buy much of anything',
                recommendation: 'Start with Registry. It gives the rest of the prep work a steadier order.',
                href: '/guides/registry',
              },
              {
                condition: 'already know the room setup is the part creating friction',
                recommendation: 'Move into Nursery next. That usually sharpens what belongs in the home and what can wait.',
                href: '/guides/nursery',
              },
              {
                condition: 'are ready to compare the large mobility gear',
                recommendation: 'Open Strollers first, then Car Seats once the stroller lane is clear enough to judge compatibility calmly.',
                href: '/guides/strollers',
              },
              {
                condition: 'mostly need the away-from-home setup after the big decisions are steadier',
                recommendation: 'Travel should hand off to Daily Use Gear before you move into actual buying.',
                href: '/guides/travel-with-baby',
              },
            ]}
          />

          <GuideJourneyFooter
            finalThought={finalThought}
            takeaways={takeaways}
            signOff={signOff}
            nextSteps={nextSteps}
            nextStepsTitle="Keep the Journey Moving"
            nextStepsDescription="If you want TMBC to choose the next move for you, use the sequence instead of reopening the whole decision from scratch."
            blogRecommendations={blogRecommendations}
          />
        </div>
      </GuideSlide>
    </GuideCarouselLayout>
  );
}
