import Image from 'next/image';
import Link from 'next/link';
import GuideBreadcrumbs from '@/components/guides/GuideBreadcrumbs';
import GuideBulletSection from '@/components/guides/GuideBulletSection';
import GuideCardRouter from '@/components/guides/GuideCardRouter';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import GuideJourneyIntro from '@/components/guides/GuideJourneyIntro';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import NextSteps from '@/components/guides/NextSteps';
import SlideSection from '@/components/guides/SlideSection';
import DecisionBlock from '@/components/guides/DecisionBlock';
import {
  DAILY_USE_GEAR_HUB_DECISION_ITEMS,
  DAILY_USE_GEAR_HUB_NEXT_STEPS,
  DAILY_USE_GEAR_HUB_ORIENTATION_BODY,
  DAILY_USE_GEAR_HUB_PATH,
  DAILY_USE_GEAR_HUB_SLIDES,
  DAILY_USE_GEAR_HUB_WHO_THIS_IS_FOR,
  DAILY_USE_GEAR_JOURNEY_PATH,
  getDailyUseGearCategoryCards,
} from '@/lib/guides/dailyUseGearLane';

const breadcrumbs = [
  { label: 'TMBC Guides', href: '/guides' },
  { label: 'Daily Use Gear' },
];

const categoryCards = getDailyUseGearCategoryCards();

export default function DailyUseGearHub() {
  return (
    <GuideSlideDeck
      containerId="daily-use-gear-hub-carousel"
      items={[...DAILY_USE_GEAR_HUB_SLIDES]}
      backLink={{ href: '/guides/travel-with-baby', label: 'Back to Travel' }}
      ecosystemCurrentStep={6}
      journeyPathLabels={[...DAILY_USE_GEAR_JOURNEY_PATH]}
    >
      <SlideSection id={DAILY_USE_GEAR_HUB_SLIDES[0].id} background="ivory" innerClassName="max-w-none px-0 py-0">
        <div className="space-y-6">
          <div className="mx-auto w-full max-w-[1520px] px-6 pt-8 md:px-10 xl:px-12">
            <GuideBreadcrumbs items={breadcrumbs} />
          </div>

          <section className="bg-[linear-gradient(180deg,#FBF7F8_0%,#FFFFFF_100%)]">
            <div className="mx-auto w-full max-w-[1520px] px-6 pb-10 pt-6 md:px-10 md:pb-12 xl:px-12">
              <div className="overflow-hidden rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-white/94 shadow-[0_18px_55px_rgba(58,36,43,0.08)]">
                <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
                  <div className="space-y-6 px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
                    <div className="space-y-3">
                      <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">TMBC Daily Use Gear Lane</p>
                      <h1 className="max-w-[10ch] text-[clamp(2.3rem,7vw,4.8rem)] font-medium leading-[0.94] tracking-[-0.05em] text-[#2F2430]">
                        Daily Use Gear
                      </h1>
                    </div>

                    <div className="max-w-3xl space-y-3">
                      {DAILY_USE_GEAR_HUB_ORIENTATION_BODY.map((line) => (
                        <p key={line} className="text-[1.02rem] leading-8 text-[#4B3641] md:text-[1.12rem] md:leading-9">
                          {line}
                        </p>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <Link
                        href={`#${DAILY_USE_GEAR_HUB_SLIDES[3].id}`}
                        className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#A15B72] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62]"
                      >
                        Explore categories
                      </Link>
                      <Link
                        href={`#${DAILY_USE_GEAR_HUB_SLIDES[4].id}`}
                        className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white px-6 py-3 text-sm font-medium text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        See how to use this lane
                      </Link>
                    </div>

                    <GuideHandwrittenNote
                      title="This is the gear that gets judged by repetition."
                      description={
                        <p>
                          The expensive categories usually get the research drama. Daily use gear is quieter. It still deserves clear logic, because
                          the smaller everyday choices are the ones you feel over and over.
                        </p>
                      }
                      tone="linen"
                      size="compact"
                      presentation="margin"
                    />
                  </div>

                  <div className="border-t border-[rgba(215,161,175,0.14)] bg-[linear-gradient(180deg,#fdf6f7_0%,#fffdfc_100%)] lg:border-l lg:border-t-0">
                    <div className="relative aspect-[4/3] border-b border-[rgba(215,161,175,0.14)] bg-[linear-gradient(180deg,#f7f1ea_0%,#efe5dc_100%)]">
                      <Image
                        src="/assets/editorial/babystuff.png"
                        alt="Editorial daily use baby gear image."
                        fill
                        sizes="(min-width: 1024px) 42vw, 100vw"
                        className="object-contain p-6 md:p-8"
                        priority
                      />
                    </div>

                    <div className="grid gap-3 px-6 py-6 sm:grid-cols-3 lg:grid-cols-1 lg:px-8 lg:py-8">
                      <div className="rounded-[1.3rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4">
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Categories</p>
                        <p className="mt-2 text-base font-medium leading-7 text-[#2F2430]">6 daily-use lanes</p>
                      </div>
                      <div className="rounded-[1.3rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4">
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Journey spot</p>
                        <p className="mt-2 text-base font-medium leading-7 text-[#2F2430]">After Travel, before Buy</p>
                      </div>
                      <div className="rounded-[1.3rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4">
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Decision lens</p>
                        <p className="mt-2 text-base font-medium leading-7 text-[#2F2430]">Routine first, features later</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </SlideSection>

      <SlideSection id={DAILY_USE_GEAR_HUB_SLIDES[1].id} background="white">
        <GuideJourneyIntro
          title="What this lane is"
          description="This is the daily-life lane. The gear here usually matters because of repetition, not because it came with the largest box."
          intro={[
            'Daily use gear is the category of smaller workhorses. These are the products that keep showing up while you feed, wash, soothe, hold, and reset the room for the next round.',
            'That makes this lane deceptively important. A mediocre daily-use item can create friction every day, while a good one quietly keeps the routine moving without needing applause.',
          ]}
          calloutBody="Start with the routine that repeats most often. The products that touch that routine are the ones worth understanding first."
          whatThisIs="A guided lane for the high-frequency categories that support the real day, not the fantasy version of it."
          whyItExists="Because a lot of smaller gear gets bought fast, duplicated easily, and explained poorly. This lane is here to make those decisions calmer."
        />
      </SlideSection>

      <SlideSection id={DAILY_USE_GEAR_HUB_SLIDES[2].id} background="blush">
        <GuideBulletSection
          eyebrow="Who This Is For"
          title="Who This Is For"
          description="Use this lane when the smaller categories are starting to pile up and you want the daily-use decisions to feel smaller, faster, and more grounded."
          items={[...DAILY_USE_GEAR_HUB_WHO_THIS_IS_FOR]}
        />
      </SlideSection>

      <SlideSection id={DAILY_USE_GEAR_HUB_SLIDES[3].id} background="ivory">
        <GuideCardRouter
          eyebrow="Category Cards"
          title="Open the category that matches the friction."
          description="Each category below is built to explain the product job, the main types, what actually matters, what trips parents up, and how to choose without overbuying."
          cards={categoryCards}
          ctaLabel="Open guide"
        />
      </SlideSection>

      <SlideSection id={DAILY_USE_GEAR_HUB_SLIDES[4].id} background="white">
        <DecisionBlock
          title="How to use this lane"
          description="Open the category that solves the recurring problem in front of you. You do not need to finish the whole lane before one answer becomes useful."
          items={DAILY_USE_GEAR_HUB_DECISION_ITEMS}
        />
      </SlideSection>

      <SlideSection id={DAILY_USE_GEAR_HUB_SLIDES[5].id} background="blush">
        <NextSteps
          title="Next Step"
          description="Daily Use Gear is the final core learning lane before buying. Use Travel if away-from-home friction still needs work, or book support when you want the clearer routine translated into actual product picks."
          links={[...DAILY_USE_GEAR_HUB_NEXT_STEPS]}
        />
      </SlideSection>
    </GuideSlideDeck>
  );
}
