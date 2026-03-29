import AcademyModuleHub from '@/components/academy/AcademyModuleHub';
import {
  DAILY_USE_GEAR_ACADEMY_DECK,
  DAILY_USE_GEAR_ACADEMY_HUB_NEXT_LINKS,
  DAILY_USE_GEAR_ACADEMY_INTRO,
  DAILY_USE_GEAR_ACADEMY_LEARNING_HIGHLIGHTS,
  DAILY_USE_GEAR_ACADEMY_PHILOSOPHY,
  DAILY_USE_GEAR_ACADEMY_PULL_QUOTE,
  DAILY_USE_GEAR_ACADEMY_REAL_LIFE_GUIDANCE,
  DAILY_USE_GEAR_ACADEMY_TITLE,
  getDailyUseGearAcademySubmoduleCards,
} from '@/lib/academy/dailyUseGearAcademy';

export default function DailyUseGearHub() {
  return (
    <AcademyModuleHub
      pathSlug="gear"
      moduleSlug="daily-use-gear"
      breadcrumbs={[
        { label: 'TMBC Academy', href: '/academy' },
        { label: 'Gear', href: '/academy/gear' },
        { label: DAILY_USE_GEAR_ACADEMY_TITLE },
      ]}
      heroEyebrow="TMBC Gear Module"
      title={DAILY_USE_GEAR_ACADEMY_TITLE}
      deck={DAILY_USE_GEAR_ACADEMY_DECK}
      intro={[...DAILY_USE_GEAR_ACADEMY_INTRO]}
      heroImageSrc="/assets/editorial/babystuff.png"
      heroImageAlt="Editorial baby gear image for Daily Use Gear."
      pullQuote={DAILY_USE_GEAR_ACADEMY_PULL_QUOTE}
      progress={{ current: 5, total: 5, label: 'Gear path progress' }}
      learningTitle="How to judge the products that touch the day most"
      learningDescription="This module is built around the categories that get used constantly, cleaned constantly, and felt immediately if the fit is wrong."
      learningHighlights={[...DAILY_USE_GEAR_ACADEMY_LEARNING_HIGHLIGHTS]}
      philosophyTitle="Daily use gear deserves calmer logic than it usually gets"
      philosophy={[...DAILY_USE_GEAR_ACADEMY_PHILOSOPHY]}
      philosophyNoteTitle="Parents do not need more products here. They need better guidance."
      philosophyNoteBody="Daily-use gear works best when it is edited around the repeated parts of the day, not around the fear of missing one more thing."
      submodulesTitle="Open the part of the routine that needs the clearer answer"
      submodulesDescription="Each submodule is built as a guided Academy page, not a roundup. The goal is to help you understand the job, test the fit, and buy less randomly."
      submoduleCards={getDailyUseGearAcademySubmoduleCards()}
      guidanceEyebrow="Start Here"
      guidanceTitle="Start with your real life"
      guidanceDescription="This is the edit pass that keeps Daily Use Gear from turning into a pile of almost-right products."
      guidanceLines={[...DAILY_USE_GEAR_ACADEMY_REAL_LIFE_GUIDANCE]}
      taylorNoteTitle="The right setup should make the day feel quieter."
      taylorNoteBody="Daily-use gear is not the place to perform preparedness. It is the place to support the routines you will repeat when no one is in the mood for friction."
      nextTitle="Keep the Academy moving"
      nextDescription="Daily Use Gear is the final core Gear module. Use the links below to revisit the last Gear decision or continue the Academy into the adult side of early parenthood."
      nextLinks={[...DAILY_USE_GEAR_ACADEMY_HUB_NEXT_LINKS]}
      primaryCta={{ href: '/academy/gear/daily-use-gear/carrier', label: 'Explore submodules' }}
      secondaryCta={{ href: '/academy/gear', label: 'Back to Gear path' }}
    />
  );
}
