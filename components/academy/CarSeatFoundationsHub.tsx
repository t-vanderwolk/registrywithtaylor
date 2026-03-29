import AcademyModuleHub from '@/components/academy/AcademyModuleHub';
import {
  CAR_SEAT_FOUNDATIONS_ACADEMY_DECK,
  CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_NEXT_LINKS,
  CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_PATH,
  CAR_SEAT_FOUNDATIONS_ACADEMY_INTRO,
  CAR_SEAT_FOUNDATIONS_ACADEMY_LEARNING_HIGHLIGHTS,
  CAR_SEAT_FOUNDATIONS_ACADEMY_PHILOSOPHY,
  CAR_SEAT_FOUNDATIONS_ACADEMY_PULL_QUOTE,
  CAR_SEAT_FOUNDATIONS_ACADEMY_REAL_LIFE_GUIDANCE,
  CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE,
  getCarSeatFoundationsAcademySubmoduleCards,
} from '@/lib/academy/carSeatFoundationsAcademy';

export default function CarSeatFoundationsHub() {
  return (
    <AcademyModuleHub
      pathSlug="gear"
      moduleSlug="car-seat-foundations"
      breadcrumbs={[
        { label: 'TMBC Academy', href: '/academy' },
        { label: 'Gear', href: '/academy/gear' },
        { label: CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE },
      ]}
      heroEyebrow="TMBC Gear Module"
      title={CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE}
      deck={CAR_SEAT_FOUNDATIONS_ACADEMY_DECK}
      intro={[...CAR_SEAT_FOUNDATIONS_ACADEMY_INTRO]}
      heroImageSrc="/assets/editorial/gear.jpg"
      heroImageAlt="Editorial car seat planning image for Taylor-Made Baby Co."
      pullQuote={CAR_SEAT_FOUNDATIONS_ACADEMY_PULL_QUOTE}
      progress={{ current: 3, total: 5, label: 'Gear path progress' }}
      learningTitle="How to choose the right category before the features get loud"
      learningDescription="This module is built around stage, fit, and real-life use so the car seat decision can get safer and simpler at the same time."
      learningHighlights={[...CAR_SEAT_FOUNDATIONS_ACADEMY_LEARNING_HIGHLIGHTS]}
      philosophyTitle="Car seat clarity usually starts with the stage, not the headline feature"
      philosophy={[...CAR_SEAT_FOUNDATIONS_ACADEMY_PHILOSOPHY]}
      philosophyNoteTitle="The point is not to find the seat with the most impressive paragraph."
      philosophyNoteBody="The point is to find the category that fits the stage, the vehicle, and the adults who have to use it well every day."
      submodulesTitle="Open the car seat category that matches the question you are actually asking"
      submodulesDescription="Each category page is a guided Academy submodule built around fit, tradeoffs, pressure-testing, and real-life use. Start with the stage that sounds most like your current chapter."
      submoduleCards={getCarSeatFoundationsAcademySubmoduleCards()}
      guidanceEyebrow="Start Here"
      guidanceTitle="Start with the stage and the loading routine"
      guidanceDescription="Parents usually feel calmer here once they separate the stage question from the convenience question and let the actual car do some of the talking."
      guidanceLines={[...CAR_SEAT_FOUNDATIONS_ACADEMY_REAL_LIFE_GUIDANCE]}
      taylorNoteTitle="The best car seat category is the one you can use confidently when you are tired and still getting everyone out the door."
      taylorNoteBody="If the setup only makes sense when you are well rested and deeply optimistic, that is useful information."
      nextTitle="Keep the Gear path moving"
      nextDescription="Once the car seat category is clearer, keep going into travel systems so compatibility questions stop borrowing stress from both sides."
      nextLinks={[...CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_NEXT_LINKS]}
      primaryCta={{ href: `${CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_PATH}/infant-car-seats`, label: 'Start with categories' }}
      secondaryCta={{ href: '/academy/gear', label: 'Back to Gear path' }}
    />
  );
}
