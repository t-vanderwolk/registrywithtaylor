import AcademyModuleHub from '@/components/academy/AcademyModuleHub';
import {
  STROLLER_FOUNDATIONS_ACADEMY_DECK,
  STROLLER_FOUNDATIONS_ACADEMY_HUB_NEXT_LINKS,
  STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH,
  STROLLER_FOUNDATIONS_ACADEMY_INTRO,
  STROLLER_FOUNDATIONS_ACADEMY_LEARNING_HIGHLIGHTS,
  STROLLER_FOUNDATIONS_ACADEMY_PHILOSOPHY,
  STROLLER_FOUNDATIONS_ACADEMY_PULL_QUOTE,
  STROLLER_FOUNDATIONS_ACADEMY_REAL_LIFE_GUIDANCE,
  STROLLER_FOUNDATIONS_ACADEMY_TITLE,
  getStrollerFoundationsAcademySubmoduleCards,
} from '@/lib/academy/strollerFoundationsAcademy';

export default function StrollerFoundationsHub() {
  return (
    <AcademyModuleHub
      pathSlug="gear"
      moduleSlug="stroller-foundations"
      breadcrumbs={[
        { label: 'TMBC Academy', href: '/academy' },
        { label: 'Gear', href: '/academy/gear' },
        { label: STROLLER_FOUNDATIONS_ACADEMY_TITLE },
      ]}
      heroEyebrow="TMBC Gear Module"
      title={STROLLER_FOUNDATIONS_ACADEMY_TITLE}
      deck={STROLLER_FOUNDATIONS_ACADEMY_DECK}
      intro={[...STROLLER_FOUNDATIONS_ACADEMY_INTRO]}
      heroImageSrc="/assets/editorial/strollers.png"
      heroImageAlt="Editorial stroller planning image for Taylor-Made Baby Co."
      pullQuote={STROLLER_FOUNDATIONS_ACADEMY_PULL_QUOTE}
      progress={{ current: 2, total: 9, label: 'Gear path progress' }}
      learningTitle="How to choose the stroller lane before you compare the stroller models"
      learningDescription="This module is built to sort the main stroller lanes first, because that is usually where the shortlist starts acting more civilized."
      learningHighlights={[...STROLLER_FOUNDATIONS_ACADEMY_LEARNING_HIGHLIGHTS]}
      philosophyTitle="The stroller decision gets easier once the lane is honest"
      philosophy={[...STROLLER_FOUNDATIONS_ACADEMY_PHILOSOPHY]}
      philosophyNoteTitle="Parents do not need another giant stroller roundup before this step."
      philosophyNoteBody="They need the category map. Once the lane fits the week, the comparison usually gets much quieter."
      submodulesTitle="Open the stroller lane that matches the job in front of you"
      submodulesDescription="Each stroller submodule is a focused Academy page built around fit, tradeoffs, and real-life use. Start with the lane that sounds most like your week, not the one that sounds most ambitious."
      submoduleCards={getStrollerFoundationsAcademySubmoduleCards()}
      guidanceEyebrow="Start Here"
      guidanceTitle="Start with your real route"
      guidanceDescription="The stroller answer usually gets cleaner once the sidewalks, trunk, storage spot, and fold routine are allowed to matter."
      guidanceLines={[...STROLLER_FOUNDATIONS_ACADEMY_REAL_LIFE_GUIDANCE]}
      taylorNoteTitle="A stroller can look right online and still be deeply annoying on Tuesday."
      taylorNoteBody="That is not being picky. That is noticing the part that actually decides whether the stroller helps."
      nextTitle="Keep the Gear path moving"
      nextDescription="Once the stroller lane is clearer, keep going into car seats so the travel-system conversation stops dragging two categories around at once."
      nextLinks={[...STROLLER_FOUNDATIONS_ACADEMY_HUB_NEXT_LINKS]}
      primaryCta={{ href: `${STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH}/full-size-modular-strollers`, label: 'Start with stroller lanes' }}
      secondaryCta={{ href: '/academy/gear', label: 'Back to Gear path' }}
    />
  );
}
