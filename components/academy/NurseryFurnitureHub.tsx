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
  getNurseryFurnitureCategoryCards,
  NURSERY_FURNITURE_HUB_DECISION_ITEMS,
  NURSERY_FURNITURE_HUB_NEXT_STEPS,
  NURSERY_FURNITURE_HUB_ORIENTATION_BODY,
  NURSERY_FURNITURE_HUB_PULLQUOTE,
  NURSERY_FURNITURE_HUB_SLIDES,
  NURSERY_FURNITURE_HUB_WHO_THIS_IS_FOR,
  NURSERY_FURNITURE_HUB_WHY_THIS_MATTERS,
  NURSERY_FURNITURE_JOURNEY_PATH,
} from '@/lib/academy/nurseryFurnitureAcademy';

const breadcrumbs = [
  { label: 'TMBC Academy', href: '/academy' },
  { label: 'Nursery', href: '/academy/nursery' },
  { label: 'Furniture That Actually Works' },
];

const categoryCards = getNurseryFurnitureCategoryCards();

export default function NurseryFurnitureHub() {
  return (
    <GuideSlideDeck
      containerId="academy-nursery-furniture-carousel"
      items={[...NURSERY_FURNITURE_HUB_SLIDES]}
      backLink={{ href: '/academy/nursery', label: 'Back to Nursery Path' }}
      journeyPathLabels={[...NURSERY_FURNITURE_JOURNEY_PATH]}
    >
      <SlideSection id={NURSERY_FURNITURE_HUB_SLIDES[0].id} background="ivory" innerClassName="max-w-none px-0 py-0">
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
                      <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">TMBC Nursery Module</p>
                      <h1 className="max-w-[12ch] text-[clamp(2.2rem,6.8vw,4.7rem)] font-medium leading-[0.95] tracking-[-0.05em] text-[#2F2430]">
                        Furniture That Actually Works
                      </h1>
                    </div>

                    <div className="max-w-3xl space-y-3">
                      {NURSERY_FURNITURE_HUB_ORIENTATION_BODY.map((line) => (
                        <p key={line} className="text-[1.02rem] leading-8 text-[#4B3641] md:text-[1.12rem] md:leading-9">
                          {line}
                        </p>
                      ))}
                    </div>

                    <div className="max-w-2xl rounded-[1.5rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.9)] px-5 py-5">
                      <p className="whitespace-pre-line font-serif text-[1.28rem] leading-8 text-[#4B3641] md:text-[1.45rem] md:leading-9">
                        {NURSERY_FURNITURE_HUB_PULLQUOTE}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <Link
                        href={`#${NURSERY_FURNITURE_HUB_SLIDES[3].id}`}
                        className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#A15B72] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62]"
                      >
                        Explore categories
                      </Link>
                      <Link
                        href={`#${NURSERY_FURNITURE_HUB_SLIDES[4].id}`}
                        className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white px-6 py-3 text-sm font-medium text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        See how to approach this
                      </Link>
                    </div>

                    <GuideHandwrittenNote
                      title="This module is for the furniture you feel in repetition."
                      description={
                        <p>
                          The room can look sweet and still work poorly. This is the pass where the nursery starts acting like part of your
                          routine instead of a very polite set.
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
                        src="/assets/editorial/nursery2.png"
                        alt="Editorial nursery furniture image."
                        fill
                        sizes="(min-width: 1024px) 42vw, 100vw"
                        className="object-contain p-6 md:p-8"
                        priority
                      />
                    </div>

                    <div className="grid gap-3 px-6 py-6 sm:grid-cols-3 lg:grid-cols-1 lg:px-8 lg:py-8">
                      <div className="rounded-[1.3rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4">
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Categories</p>
                        <p className="mt-2 text-base font-medium leading-7 text-[#2F2430]">6 functional lanes</p>
                      </div>
                      <div className="rounded-[1.3rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4">
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Decision lens</p>
                        <p className="mt-2 text-base font-medium leading-7 text-[#2F2430]">Routine first, furniture second</p>
                      </div>
                      <div className="rounded-[1.3rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4">
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Where it helps</p>
                        <p className="mt-2 text-base font-medium leading-7 text-[#2F2430]">Sleep, feeding, changing, storage, safety</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </SlideSection>

      <SlideSection id={NURSERY_FURNITURE_HUB_SLIDES[1].id} background="white">
        <GuideJourneyIntro
          title="What this module is"
          description="This is the functional layer of the nursery. Not decor. Not filler. The pieces here shape the daily workflow."
          intro={[
            'Furniture That Actually Works is the part of nursery planning where you stop asking how the room should look and start asking how the room should behave.',
            'That means choosing the pieces that support sleep, feeding, changing, storage, and the quieter safety decisions that show up in real life long after the registry confetti settles.',
          ]}
          calloutBody="Start with the jobs the room has to do. The right furniture usually becomes obvious much faster once each piece has a clear role."
          whatThisIs="A guided walkthrough of the hard-working nursery furniture categories that most affect daily life."
          whyItExists="Because the nursery gets easier when you choose fewer, better-fitting pieces instead of trying to complete a theme."
          whoThisIsFor={[...NURSERY_FURNITURE_HUB_WHO_THIS_IS_FOR]}
        />
      </SlideSection>

      <SlideSection id={NURSERY_FURNITURE_HUB_SLIDES[2].id} background="blush">
        <GuideBulletSection
          eyebrow="Why This Matters"
          title="Why This Matters"
          description="Small furniture decisions can create daily ease or daily friction. This module exists to help you tell the difference before the room is full."
          items={[...NURSERY_FURNITURE_HUB_WHY_THIS_MATTERS]}
        />
      </SlideSection>

      <SlideSection id={NURSERY_FURNITURE_HUB_SLIDES[3].id} background="ivory">
        <GuideCardRouter
          eyebrow="Category Cards"
          title="Open the category that supports the job in front of you."
          description="Each submodule breaks down what the product does, the main types, what actually matters, what trips parents up, and how to choose without filling the room unnecessarily."
          cards={categoryCards}
          ctaLabel="Open submodule"
        />
      </SlideSection>

      <SlideSection id={NURSERY_FURNITURE_HUB_SLIDES[4].id} background="white">
        <DecisionBlock
          title="How to approach this"
          description="You do not need to solve every furniture category in one sitting. Start with the repeated task that feels least clear."
          items={[...NURSERY_FURNITURE_HUB_DECISION_ITEMS]}
        />
      </SlideSection>

      <SlideSection id={NURSERY_FURNITURE_HUB_SLIDES[5].id} background="blush">
        <NextSteps
          title="Next Step"
          description="Use this module to make the nursery function cleaner, then either go back to the sleep or atmosphere layer or move forward into the gear journey."
          links={[...NURSERY_FURNITURE_HUB_NEXT_STEPS]}
        />
      </SlideSection>
    </GuideSlideDeck>
  );
}
