import AcademyModuleHub from '@/components/academy/AcademyModuleHub';
import {
  getNurseryFurnitureSubmoduleCards,
  NURSERY_FURNITURE_HUB_DECISION_ITEMS,
  NURSERY_FURNITURE_HUB_GROUNDING_EXAMPLES,
  NURSERY_FURNITURE_HUB_NEXT_STEPS,
  NURSERY_FURNITURE_HUB_PULLQUOTE,
  NURSERY_FURNITURE_HUB_WHY_THIS_MATTERS,
} from '@/lib/academy/nurseryFurnitureAcademy';

const NURSERY_FURNITURE_HUB_TITLE = 'Furniture That Actually Works';
const NURSERY_FURNITURE_HUB_DECK =
  'Choose the room pieces that support sleep, feeding, changing, storage, and safety without filling the nursery for the sake of completion.';

const NURSERY_FURNITURE_HUB_INTRO = [
  'This is the part of nursery planning where the room stops trying to look finished and starts trying to work.',
  'The furniture here supports sleep, feeding, changing, storage, and the quieter safety choices that show up long after the room reveal energy wears off.',
  'The goal is not to fill the nursery. It is to choose the pieces you will actually use when you are tired, one-handed, and not interested in decorative inefficiency.',
] as const;

const NURSERY_FURNITURE_HUB_PHILOSOPHY = [
  'Good nursery furniture should make the room easier to move through, not more complete on paper.',
  'That usually means choosing fewer pieces with clearer jobs: a crib that makes nighttime straightforward, a chair that supports feeding, a changing setup that keeps your hands where the essentials already are.',
  'The room gets calmer when every piece earns its floor space through repetition instead of ambition.',
] as const;

const NURSERY_FURNITURE_HUB_GUIDANCE_LINES = NURSERY_FURNITURE_HUB_DECISION_ITEMS.map(
  (item) => `If you ${item.condition}, ${item.recommendation}`,
);

export default function NurseryFurnitureHub() {
  return (
    <AcademyModuleHub
      pathSlug="nursery"
      moduleSlug="furniture-that-actually-works"
      breadcrumbs={[
        { label: 'TMBC Academy', href: '/academy' },
        { label: 'Nursery', href: '/academy/nursery' },
        { label: NURSERY_FURNITURE_HUB_TITLE },
      ]}
      heroEyebrow="TMBC Nursery Module"
      title={NURSERY_FURNITURE_HUB_TITLE}
      deck={NURSERY_FURNITURE_HUB_DECK}
      intro={[...NURSERY_FURNITURE_HUB_INTRO]}
      heroImageSrc="/assets/nurserypath/nurseryprep.png"
      heroImageAlt="Nursery prep image for the furniture module."
      pullQuote={NURSERY_FURNITURE_HUB_PULLQUOTE}
      progress={{ current: 3, total: 6, label: 'Nursery path progress' }}
      learningTitle="What this module helps you sort out"
      learningDescription="This is the functional layer of the nursery. The pieces here shape sleep, feeding, changing, storage, and the quieter safety decisions that either support the room or slowly annoy you."
      learningHighlights={[...NURSERY_FURNITURE_HUB_WHY_THIS_MATTERS]}
      philosophyTitle="Buy for the repeated parts of the day"
      philosophy={[...NURSERY_FURNITURE_HUB_PHILOSOPHY]}
      philosophyNoteTitle="The room does not need more furniture. It needs better logic."
      philosophyNoteBody="If the piece makes the routine easier every day, it belongs. If it only sounds useful in an imaginary nursery montage, it can wait."
      submodulesTitle="Open the category that supports the job in front of you"
      submodulesDescription="Each submodule breaks down what the product does, the main types, what actually matters, what trips parents up, and how to choose without filling the room unnecessarily."
      submoduleCards={getNurseryFurnitureSubmoduleCards()}
      guidanceEyebrow="Start Here"
      guidanceTitle="Use the room behavior to choose the category"
      guidanceDescription="You do not need to solve every furniture category in one sitting. Start with the repeated task that feels least clear."
      guidanceLines={NURSERY_FURNITURE_HUB_GUIDANCE_LINES}
      taylorNoteTitle="This module is for the furniture you feel in repetition."
      taylorNoteBody="The room can look sweet and still work poorly. This is the pass where the nursery starts acting like part of your routine instead of a very polite set."
      nextTitle="Keep the Nursery path moving"
      nextDescription="Once the furniture layer feels clearer, either return to the wider nursery sequence or move forward into the next practical decision."
      nextLinks={NURSERY_FURNITURE_HUB_NEXT_STEPS.map((step) => ({
        href: step.href,
        title: step.label,
        description: step.description,
        ctaLabel: 'Open next step ->',
        eyebrow: step.stage,
      }))}
      groundingExamples={[...NURSERY_FURNITURE_HUB_GROUNDING_EXAMPLES]}
      primaryCta={{ href: '/academy/nursery/furniture-that-actually-works/cribs', label: 'Explore submodules' }}
      secondaryCta={{ href: '/academy/nursery', label: 'Back to Nursery path' }}
    />
  );
}
