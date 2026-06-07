import LearnHubLayout from '@/components/learn/LearnHubLayout';
import {
  STROLLER_FOUNDATIONS_ACADEMY_DECK,
  STROLLER_FOUNDATIONS_ACADEMY_HUB_NEXT_LINKS,
  STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH,
  STROLLER_FOUNDATIONS_ACADEMY_INTRO,
  STROLLER_FOUNDATIONS_ACADEMY_LEARNING_HIGHLIGHTS,
  STROLLER_FOUNDATIONS_ACADEMY_PHILOSOPHY,
  STROLLER_FOUNDATIONS_ACADEMY_TITLE,
  getStrollerFoundationsAcademySubmoduleCards,
} from '@/lib/academy/strollerFoundationsAcademy';

export default function StrollerFoundationsHub() {
  return (
    <LearnHubLayout
      pathSlug="gear"
      moduleSlug="stroller-foundations"
      breadcrumbs={[
        { label: 'Academy', href: '/learn' },
        { label: 'Gear', href: '/learn/gear' },
        { label: STROLLER_FOUNDATIONS_ACADEMY_TITLE },
      ]}
      title={STROLLER_FOUNDATIONS_ACADEMY_TITLE}
      deck={STROLLER_FOUNDATIONS_ACADEMY_DECK}
      intro={[...STROLLER_FOUNDATIONS_ACADEMY_INTRO]}
      heroImageSrc="/assets/editorial/strollers.png"
      heroImageAlt="Editorial stroller planning image for Taylor-Made Baby Co."
      progress={{ current: 2, total: 9 }}
      learningHighlights={[...STROLLER_FOUNDATIONS_ACADEMY_LEARNING_HIGHLIGHTS]}
      philosophy={[...STROLLER_FOUNDATIONS_ACADEMY_PHILOSOPHY]}
      taylorNoteTitle="A stroller can look right online and still be deeply annoying on Tuesday."
      taylorNoteBody="That is not being picky. That is noticing the part that actually decides whether the stroller helps."
      submodulesTitle="Open the stroller lane that matches the job in front of you"
      submodulesDescription="Each stroller submodule is a focused lesson built around fit, tradeoffs, and real-life use. Start with the lane that sounds most like your week."
      submoduleCards={getStrollerFoundationsAcademySubmoduleCards()}
      primaryCta={{ href: `${STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH}/full-size-modular-strollers`, label: 'Start with stroller lanes' }}
      nextLinks={[...STROLLER_FOUNDATIONS_ACADEMY_HUB_NEXT_LINKS]}
    />
  );
}
