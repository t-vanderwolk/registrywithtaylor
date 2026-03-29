import AcademyJourneyNavigator from '@/components/academy/AcademyJourneyNavigator';
import Image from 'next/image';
import GuideBreadcrumbs from '@/components/guides/GuideBreadcrumbs';
import GuideBulletSection from '@/components/guides/GuideBulletSection';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import GuideJourneyIntro from '@/components/guides/GuideJourneyIntro';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import NextSteps from '@/components/guides/NextSteps';
import SlideSection from '@/components/guides/SlideSection';
import DecisionBlock from '@/components/guides/DecisionBlock';
import {
  getNurseryFurnitureCategory,
  getNurseryFurnitureCategoryNextStepLinks,
  getNurseryFurnitureCategoryPath,
  NURSERY_FURNITURE_HUB_PATH,
  NURSERY_FURNITURE_JOURNEY_PATH,
  type NurseryFurnitureCategorySlug,
} from '@/lib/academy/nurseryFurnitureAcademy';

const CATEGORY_SLIDES = [
  { id: 'orientation', label: 'Orientation', shortLabel: 'Start' },
  { id: 'what-it-does', label: 'What This Does', shortLabel: 'Job' },
  { id: 'types', label: 'Types', shortLabel: 'Types' },
  { id: 'what-actually-matters', label: 'What Actually Matters', shortLabel: 'Matters' },
  { id: 'common-mistakes', label: 'Common Mistakes', shortLabel: 'Avoid' },
  { id: 'how-to-choose', label: 'How To Choose', shortLabel: 'Choose' },
  { id: 'next-step', label: 'Next Step', shortLabel: 'Next' },
] as const;

export default function NurseryFurnitureCategoryPage({
  slug,
}: {
  slug: NurseryFurnitureCategorySlug;
}) {
  const category = getNurseryFurnitureCategory(slug);
  const path = getNurseryFurnitureCategoryPath(slug);
  const breadcrumbs = [
    { label: 'TMBC Academy', href: '/academy' },
    { label: 'Nursery', href: '/academy/nursery' },
    { label: 'Furniture That Actually Works', href: NURSERY_FURNITURE_HUB_PATH },
    { label: category.title },
  ];
  const nextSteps = getNurseryFurnitureCategoryNextStepLinks(slug);

  return (
    <GuideSlideDeck
      containerId={`academy-nursery-furniture-${slug}-carousel`}
      items={CATEGORY_SLIDES.map((item) => ({
        ...item,
        id: `academy-nursery-furniture-${slug}-${item.id}`,
      }))}
      backLink={{ href: NURSERY_FURNITURE_HUB_PATH, label: 'Back to Furniture That Actually Works' }}
      journeyPathLabels={[...NURSERY_FURNITURE_JOURNEY_PATH, category.title]}
    >
      <SlideSection
        id={`academy-nursery-furniture-${slug}-${CATEGORY_SLIDES[0].id}`}
        background="ivory"
        innerClassName="max-w-none px-0 py-0"
      >
        <div className="space-y-6">
          <div className="mx-auto w-full max-w-[1520px] px-6 pt-8 md:px-10 xl:px-12">
            <GuideBreadcrumbs items={breadcrumbs} />
          </div>

          <section className="bg-[linear-gradient(180deg,#FBF7F8_0%,#FFFFFF_100%)]">
            <div className="mx-auto w-full max-w-[1520px] px-6 pb-10 pt-6 md:px-10 md:pb-12 xl:px-12">
              <div className="overflow-hidden rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-white/94 shadow-[0_18px_55px_rgba(58,36,43,0.08)]">
                <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)]">
                  <div className="space-y-6 px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
                    <div className="space-y-3">
                      <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">{category.heroEyebrow}</p>
                      <h1 className="max-w-[11ch] text-[clamp(2.1rem,6.5vw,4.4rem)] font-medium leading-[0.95] tracking-[-0.05em] text-[#2F2430]">
                        {category.title}
                      </h1>
                    </div>

                    <div className="max-w-3xl space-y-3">
                      {category.orientation.map((paragraph) => (
                        <p key={paragraph} className="text-[1.02rem] leading-8 text-[#4B3641] md:text-[1.12rem] md:leading-9">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <a
                        href={`${path}#academy-nursery-furniture-${slug}-${CATEGORY_SLIDES[1].id}`}
                        className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#A15B72] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62]"
                      >
                        See what this does
                      </a>
                      <a
                        href={`${path}#academy-nursery-furniture-${slug}-${CATEGORY_SLIDES[5].id}`}
                        className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white px-6 py-3 text-sm font-medium text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        Jump to how to choose
                      </a>
                    </div>

                    <GuideHandwrittenNote
                      title="This should earn its space through repetition."
                      description={
                        <p>
                          If the piece makes the routine easier every day, it belongs. If it only sounds useful in an imaginary nursery montage,
                          it can wait.
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
                        src={category.heroImageSrc}
                        alt={category.heroImageAlt}
                        fill
                        sizes="(min-width: 1024px) 38vw, 100vw"
                        className="object-contain p-6 md:p-8"
                        priority
                      />
                    </div>

                    <div className="space-y-3 px-6 py-6 lg:px-8 lg:py-8">
                      <div className="rounded-[1.3rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4">
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Module</p>
                        <p className="mt-2 text-base font-medium leading-7 text-[#2F2430]">Furniture That Actually Works</p>
                      </div>
                      <div className="rounded-[1.3rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4">
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Sections</p>
                        <p className="mt-2 text-base font-medium leading-7 text-[#2F2430]">{CATEGORY_SLIDES.length} guide slides</p>
                      </div>
                      <div className="rounded-[1.3rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4">
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Next move</p>
                        <p className="mt-2 text-base font-medium leading-7 text-[#2F2430]">{nextSteps[0]?.label ?? 'Gear Journey'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </SlideSection>

      <SlideSection id={`academy-nursery-furniture-${slug}-${CATEGORY_SLIDES[1].id}`} background="white">
        <div className="space-y-6">
          <AcademyJourneyNavigator currentPathSlug="nursery" currentModuleSlug="furniture-that-actually-works" />
          <GuideJourneyIntro
            title="What this does"
            description={category.whatItDoes.description}
            intro={category.whatItDoes.intro}
            calloutBody={category.whatItDoes.calloutBody}
            whatThisIs={category.whatItDoes.whatThisIs}
            whyItExists={category.whatItDoes.whyItExists}
            whoThisIsFor={category.whatItDoes.supportPoints}
          />
        </div>
      </SlideSection>

      <SlideSection id={`academy-nursery-furniture-${slug}-${CATEGORY_SLIDES[2].id}`} background="blush">
        <GuideBulletSection eyebrow="Types" title="Types" description={category.typesDescription} items={category.types} />
      </SlideSection>

      <SlideSection id={`academy-nursery-furniture-${slug}-${CATEGORY_SLIDES[3].id}`} background="ivory">
        <GuideBulletSection
          eyebrow="What Actually Matters"
          title="What Actually Matters"
          description={category.whatActuallyMattersDescription}
          items={category.whatActuallyMatters}
        />
      </SlideSection>

      <SlideSection id={`academy-nursery-furniture-${slug}-${CATEGORY_SLIDES[4].id}`} background="white">
        <GuideBulletSection
          eyebrow="Common Mistakes"
          title="Common Mistakes"
          description={category.commonMistakesDescription}
          items={category.commonMistakes}
        />
      </SlideSection>

      <SlideSection id={`academy-nursery-furniture-${slug}-${CATEGORY_SLIDES[5].id}`} background="blush">
        <DecisionBlock
          title="How to Choose"
          description={category.howToChooseDescription}
          items={category.howToChoose}
        />
      </SlideSection>

      <SlideSection id={`academy-nursery-furniture-${slug}-${CATEGORY_SLIDES[6].id}`} background="ivory">
        <NextSteps
          title="Next Step"
          description="Keep the nursery decisions moving while the logic is still fresh. You do not need to finish everything before the next useful move becomes obvious."
          links={nextSteps}
        />
      </SlideSection>
    </GuideSlideDeck>
  );
}
