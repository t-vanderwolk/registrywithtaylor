import LearnHubLayout from '@/components/learn/LearnHubLayout';
import {
  CAR_SEAT_FOUNDATIONS_ACADEMY_DECK,
  CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_NEXT_LINKS,
  CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_PATH,
  CAR_SEAT_FOUNDATIONS_ACADEMY_INTRO,
  CAR_SEAT_FOUNDATIONS_ACADEMY_LEARNING_HIGHLIGHTS,
  CAR_SEAT_FOUNDATIONS_ACADEMY_PHILOSOPHY,
  CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE,
  getCarSeatFoundationsAcademySubmoduleCards,
} from '@/lib/academy/carSeatFoundationsAcademy';

export default function CarSeatFoundationsHub() {
  return (
    <LearnHubLayout
      pathSlug="gear"
      moduleSlug="car-seat-foundations"
      breadcrumbs={[
        { label: 'Academy', href: '/learn' },
        { label: 'Gear', href: '/learn/gear' },
        { label: CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE },
      ]}
      title={CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE}
      deck={CAR_SEAT_FOUNDATIONS_ACADEMY_DECK}
      intro={[...CAR_SEAT_FOUNDATIONS_ACADEMY_INTRO]}
      heroImageSrc="/assets/editorial/gear.jpg"
      heroImageAlt="Editorial car seat planning image for Taylor-Made Baby Co."
      progress={{ current: 3, total: 9 }}
      learningHighlights={[...CAR_SEAT_FOUNDATIONS_ACADEMY_LEARNING_HIGHLIGHTS]}
      philosophy={[...CAR_SEAT_FOUNDATIONS_ACADEMY_PHILOSOPHY]}
      taylorNoteTitle="The best car seat category is the one you can use confidently when you are tired and still getting everyone out the door."
      taylorNoteBody="If the setup only makes sense when you are well rested and deeply optimistic, that is useful information."
      submodulesTitle="Open the car seat category that matches the question you are actually asking"
      submodulesDescription="Each category page is a guided lesson built around fit, tradeoffs, pressure-testing, and real-life use. Start with the stage that sounds most like your current chapter."
      submoduleCards={getCarSeatFoundationsAcademySubmoduleCards()}
      primaryCta={{ href: `${CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_PATH}/infant-car-seats`, label: 'Start with categories' }}
      nextLinks={[...CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_NEXT_LINKS]}
    />
  );
}
