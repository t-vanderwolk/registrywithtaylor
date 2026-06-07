import LearnHubLayout from '@/components/learn/LearnHubLayout';
import {
  DAILY_USE_GEAR_ACADEMY_DECK,
  DAILY_USE_GEAR_ACADEMY_HUB_NEXT_LINKS,
  DAILY_USE_GEAR_ACADEMY_INTRO,
  DAILY_USE_GEAR_ACADEMY_LEARNING_HIGHLIGHTS,
  DAILY_USE_GEAR_ACADEMY_PHILOSOPHY,
  DAILY_USE_GEAR_ACADEMY_TITLE,
  getDailyUseGearAcademySubmoduleCards,
} from '@/lib/academy/dailyUseGearAcademy';

export default function DailyUseGearHub() {
  return (
    <LearnHubLayout
      pathSlug="gear"
      moduleSlug="daily-use-gear"
      breadcrumbs={[
        { label: 'Academy', href: '/learn' },
        { label: 'Gear', href: '/learn/gear' },
        { label: DAILY_USE_GEAR_ACADEMY_TITLE },
      ]}
      title={DAILY_USE_GEAR_ACADEMY_TITLE}
      deck={DAILY_USE_GEAR_ACADEMY_DECK}
      intro={[...DAILY_USE_GEAR_ACADEMY_INTRO]}
      heroImageSrc="/assets/gearpath/momcozypurehug.png"
      heroImageAlt="Daily-use baby carrier image for Daily Use Gear."
      progress={{ current: 6, total: 9 }}
      learningHighlights={[...DAILY_USE_GEAR_ACADEMY_LEARNING_HIGHLIGHTS]}
      philosophy={[...DAILY_USE_GEAR_ACADEMY_PHILOSOPHY]}
      taylorNoteTitle="The right setup should make the day feel quieter."
      taylorNoteBody="Daily-use gear is not the place to perform preparedness. It is the place to support the routines you will repeat when no one is in the mood for friction."
      submodulesTitle="Open the part of the routine that needs the clearer answer"
      submodulesDescription="Each submodule is a guided lesson, not a roundup. The goal is to help you understand the job, test the fit, and buy less randomly."
      submoduleCards={getDailyUseGearAcademySubmoduleCards()}
      primaryCta={{ href: '/academy/gear/daily-use-gear/carrier', label: 'Explore submodules' }}
      nextLinks={[...DAILY_USE_GEAR_ACADEMY_HUB_NEXT_LINKS]}
    />
  );
}
