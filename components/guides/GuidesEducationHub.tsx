import Link from 'next/link';
import GuideBulletSection from '@/components/guides/GuideBulletSection';
import DecisionBlock from '@/components/guides/DecisionBlock';
import EcosystemStrip from '@/components/guides/EcosystemStrip';
import GuideEditorialImage from '@/components/guides/GuideEditorialImage';
import GuideGlyph from '@/components/guides/GuideGlyph';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import GuideInkBadge from '@/components/guides/GuideInkBadge';
import HubHero from '@/components/guides/HubHero';
import NextSteps from '@/components/guides/NextSteps';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import type { GuideHubIconKey } from '@/lib/guides/hubs';
import {
  getGuideOrientation,
  guideHubLinkToNextStepLink,
  normalizeGuideLinks,
  type GuideStageLabel,
} from '@/lib/guides/guideFlow';
import { guidesEducationHubContent } from '@/lib/guides/educationHub';

type PortalCard = {
  title: string;
  description: string;
  bestFor?: string;
  href: string;
  icon: GuideHubIconKey;
  ctaLabel?: string;
};

function PortalSection({
  id,
  background,
  children,
}: {
  id?: string;
  background: 'ivory' | 'blush' | 'white';
  children: React.ReactNode;
}) {
  const backgroundClasses = {
    ivory: 'bg-[linear-gradient(180deg,#FBF7F1_0%,#FFFDFC_100%)]',
    blush: 'bg-[linear-gradient(180deg,#FBF2F5_0%,#FFF9FB_100%)]',
    white: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFCFB_100%)]',
  } as const;

  return (
    <section id={id} className={backgroundClasses[background]}>
      <div className="mx-auto w-full max-w-[1520px] px-5 py-18 sm:px-6 sm:py-22 md:px-10 md:py-24 xl:px-12">
        {children}
      </div>
    </section>
  );
}

function PortalLinkCard({
  card,
  eyebrow,
}: {
  card: PortalCard;
  eyebrow: string;
}) {
  return (
    <Link
      href={card.href}
      className="group rounded-[1.6rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.92)] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(58,36,43,0.10)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(215,161,175,0.14)] text-[#8F4C62]">
          <GuideGlyph icon={card.icon} className="h-5 w-5" />
        </div>
        <span className="inline-flex min-h-[28px] items-center rounded-full bg-white/90 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-[#8F4C62]">
          {eyebrow}
        </span>
      </div>

      <h3 className="mt-5 text-[1.3rem] font-medium leading-[1.08] tracking-[-0.02em] text-[#2F2430]">
        {card.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[#5B4B55]">{card.description}</p>

      {card.bestFor ? (
        <div className="mt-4 rounded-[1.2rem] border border-[rgba(196,156,94,0.14)] bg-white/78 px-4 py-3">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/76">Best for</p>
          <p className="mt-2 text-sm leading-7 text-[#4B3641]">{card.bestFor}</p>
        </div>
      ) : null}

      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-[#8F4C62]">
        <span>{card.ctaLabel ?? 'Open hub'}</span>
        <span aria-hidden="true">-&gt;</span>
      </span>
    </Link>
  );
}

function PortalCardSection({
  eyebrow,
  title,
  description,
  cards,
  cardEyebrow,
}: {
  eyebrow: string;
  title: string;
  description: string;
  cards: readonly PortalCard[];
  cardEyebrow: string;
}) {
  return (
    <RevealOnScroll>
      <section className="space-y-5">
        <div className="max-w-3xl space-y-3">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">{eyebrow}</p>
          <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.15rem]">{title}</h2>
          <p className="text-base leading-8 text-[#5B4B55] md:text-lg">{description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <PortalLinkCard key={card.href} card={card} eyebrow={cardEyebrow} />
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}

function OverviewMiniCard({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.9)] p-5">
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#8F4C62]">{eyebrow}</p>
      <h3 className="mt-3 text-[1.15rem] font-medium leading-[1.1] tracking-[-0.02em] text-[#2F2430]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[#5B4B55]">{body}</p>
    </div>
  );
}

export default function GuidesEducationHub() {
  const orientation = getGuideOrientation({ slug: 'guides-hub', category: 'TMBC Guide Hub' });
  const featuredStages: GuideStageLabel[] = ['Start', 'Start', 'Compare', 'Decide'];
  const nextSteps = normalizeGuideLinks(
    guidesEducationHubContent.featured.links.map((link, index) =>
      guideHubLinkToNextStepLink(link, featuredStages[index] ?? 'Refine'),
    ),
  );

  return (
    <div className="bg-[linear-gradient(180deg,#FFFDFC_0%,#FFF9FB_48%,#FBF7F1_100%)]">
      <PortalSection background="ivory">
        <div className="space-y-6">
          <EcosystemStrip currentStep={4} />

          <HubHero
            slug="guides-hub"
            eyebrow={guidesEducationHubContent.hero.eyebrow}
            category="TMBC Guide Hub"
            title={guidesEducationHubContent.hero.title}
            description={guidesEducationHubContent.hero.description}
            note={guidesEducationHubContent.hero.note}
            stats={guidesEducationHubContent.hero.stats}
            highlights={guidesEducationHubContent.hero.highlights}
            jumpLinks={[
              { href: '#hub-overview', label: 'How The Hub Works' },
              { href: '#hub-start-here', label: 'Start Here' },
              { href: '#hub-main-hubs', label: 'Main Hubs' },
              { href: '#hub-next-steps', label: 'Strong Starting Points' },
            ]}
          />
        </div>
      </PortalSection>

      <PortalSection id="hub-overview" background="white">
        <div className="space-y-6">
          <RevealOnScroll>
            <MarketingSurface className="border-[rgba(215,161,175,0.16)] bg-white/92 shadow-[0_18px_55px_rgba(58,36,43,0.08)]">
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Editorial Intro</p>
                    <h2 className="max-w-5xl text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.5rem]">
                      The TMBC Guide Hub is the front door to the system.
                    </h2>
                  </div>
                  <GuideInkBadge label="begin with registry" className="bg-white/84" />
                </div>

                <p className="max-w-4xl text-base leading-8 text-[#5B4B55] md:text-lg">
                  This page exists to do three things well: help you figure out where to begin, explain how the guide hubs connect, and stop you from wandering into three categories that all technically sound relevant. Baby prep has a talent for that.
                </p>
                <p className="max-w-4xl text-base leading-8 text-[#5B4B55] md:text-lg">
                  Each TMBC hub starts broad on purpose. It gives you the landscape first, then helps you move into the narrower guide that actually fits your life. That means fewer random tabs, less product theater, and a better chance of making one clear decision before midnight.
                </p>
                <p className="max-w-4xl text-base leading-8 text-[#5B4B55] md:text-lg">
                  If the whole plan feels noisy, start with Registry. If your home setup still feels fuzzy, start with Nursery. If large gear is suddenly dominating the conversation, open Strollers or Car Seats and let the category explain itself before the models try to.
                </p>

                <GuideEditorialImage
                  eyebrow="Editorial image"
                  src="/assets/editorial/registry.png"
                  alt="Editorial registry image for the TMBC guide hub overview."
                  caption="Registry is usually the cleanest way into the system because it gives the rest of baby prep a calmer order."
                />
              </div>
            </MarketingSurface>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="grid gap-4 lg:grid-cols-3">
              <OverviewMiniCard
                eyebrow="You Are Here"
                title={`${orientation.step} with the hub`}
                body="This page is the overview layer. Use it when you need the right first click, not when you need a deep dive on one category."
              />
              <OverviewMiniCard
                eyebrow="Best Use"
                title={orientation.category}
                body={orientation.goal}
              />
              <OverviewMiniCard
                eyebrow="TMBC Reality Check"
                title="You do not need all of it."
                body="You need the page that makes the next decision feel more manageable. Different assignment."
              />
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <GuideHandwrittenNote
              tone="linen"
              title="If you are unsure, begin with Registry."
              description={
                <p>
                  Registry is usually the cleanest first move because it forces the whole plan into better order.
                  Then Nursery, Strollers, Car Seats, and the rest have something steadier to attach themselves to.
                </p>
              }
            />
          </RevealOnScroll>
        </div>
      </PortalSection>

      <PortalSection id="hub-start-here" background="blush">
        <div className="space-y-10">
          <PortalCardSection
            eyebrow={guidesEducationHubContent.startHere.eyebrow}
            title={guidesEducationHubContent.startHere.title}
            description={guidesEducationHubContent.startHere.description}
            cards={guidesEducationHubContent.startHere.cards}
            cardEyebrow="Start here"
          />

          <GuideBulletSection
            eyebrow="How To Use It"
            title="How To Use It"
            description="The hub works best when you use it like a map."
            items={[
              'Choose the category that solves the current problem, not the one that sounds the most important in theory.',
              'Use the parent hub before the narrower guide. That is usually where the category finally starts making sense.',
              'Follow the next linked step while the logic is still fresh instead of starting over in a new tab.',
            ]}
          />
        </div>
      </PortalSection>

      <PortalSection id="hub-main-hubs" background="ivory">
        <div className="space-y-10">
          <PortalCardSection
            eyebrow={guidesEducationHubContent.categoryGrid.eyebrow}
            title={guidesEducationHubContent.categoryGrid.title}
            description={guidesEducationHubContent.categoryGrid.description}
            cards={guidesEducationHubContent.categoryGrid.cards}
            cardEyebrow="Hub"
          />

          <RevealOnScroll>
            <section className="rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] md:p-8">
              <div className="max-w-3xl space-y-3">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">
                  {guidesEducationHubContent.learningPath.eyebrow}
                </p>
                <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.15rem]">
                  {guidesEducationHubContent.learningPath.title}
                </h2>
                <p className="text-base leading-8 text-[#5B4B55] md:text-lg">
                  {guidesEducationHubContent.learningPath.description}
                </p>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {guidesEducationHubContent.learningPath.steps.map((step, index) => (
                  <div
                    key={`${step.title}-${index}`}
                    className="rounded-[1.5rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.9)] p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex min-h-[30px] items-center rounded-full bg-white/92 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-[#8F4C62]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(215,161,175,0.14)] text-[#8F4C62]">
                        <GuideGlyph icon={step.icon} className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="mt-5 text-[1.2rem] font-medium leading-[1.1] tracking-[-0.02em] text-[#2F2430]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#5B4B55]">{step.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </RevealOnScroll>
        </div>
      </PortalSection>

      <PortalSection background="white">
        <DecisionBlock
          title="Choose your first click by the decision, not by the mood."
          description="If you are not sure where to begin, use the shortest possible routing logic."
          items={[
            {
              condition: 'need the whole plan to make more sense before you buy much of anything',
              recommendation: 'Start with Registry. It usually gives the rest of the prep work a steadier order.',
              href: '/guides/registry',
            },
            {
              condition: 'want the room, storage, and sleep setup to feel calmer first',
              recommendation: 'Open Nursery. It is often the clearest starting point when the home setup still feels fuzzy.',
              href: '/guides/nursery',
            },
            {
              condition: 'are comparing expensive gear and all the categories are blurring together',
              recommendation: 'Start with Strollers or Car Seats so the hub can explain the lanes before you compare products.',
              href: '/guides/strollers',
            },
            {
              condition: 'mostly need help with the daily rhythm around outings, feeding, or early recovery',
              recommendation: 'Move into Travel, Feeding, or Postpartum once the big structure is steady enough to support the routine details.',
              href: '/guides/travel-with-baby',
            },
          ]}
        />
      </PortalSection>

      <PortalSection background="blush">
        <GuideBulletSection
          eyebrow="Common Mistakes"
          title="Common Mistakes"
          description="The hub works best when it acts like a front door, not a scavenger hunt."
          items={[
            'Opening several hubs at once because technically all of them feel relevant.',
            'Skipping the parent hub and landing in a narrower guide before the category itself is clear.',
            'Starting with the most expensive category instead of the one causing the current friction.',
            'Treating the hub like a reading assignment instead of a navigation tool.',
          ]}
        />
      </PortalSection>

      <PortalSection id="hub-next-steps" background="ivory">
        <div className="space-y-8">
          <NextSteps
            title={guidesEducationHubContent.featured.title}
            description={guidesEducationHubContent.featured.description}
            links={nextSteps}
          />

          <GuideBulletSection
            eyebrow="Keep In Mind"
            title="Keep In Mind"
            description="TMBC works best when the next step stays obvious."
            items={[
              'Start with the question that feels immediate. The rest of the map usually gets clearer from there.',
              'Use the hub to understand the category before you ask a narrower guide to solve it.',
              'Follow the next linked move while the logic is still fresh.',
            ]}
          />
        </div>
      </PortalSection>
    </div>
  );
}
