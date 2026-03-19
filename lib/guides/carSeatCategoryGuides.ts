import type { ParsedStyledBlock } from '@/lib/blog/styledBlocks';
import type { GuideHubLink } from '@/lib/guides/hubs';
import { CAR_SEAT_SYSTEM_PATHS } from '@/lib/guides/carSeatSystem';

export const CAR_SEAT_CATEGORY_GUIDE_SLUGS = ['rotating-car-seats', 'travel-lightweight-car-seats'] as const;

export type CarSeatCategoryGuideSlug = (typeof CAR_SEAT_CATEGORY_GUIDE_SLUGS)[number];

type CarSeatGuideProductExample = Extract<ParsedStyledBlock, { type: 'product' }>;

type CarSeatGuideContext = {
  breadcrumb: readonly string[];
  currentLabel: string;
  compareLabel: string;
  compareHref: string;
  compareCtaLabel: string;
  hubLabel: string;
  hubHref: string;
  hubCtaLabel: string;
};

type CarSeatGuideConfig = {
  heroEyebrow: string;
  heroDescription: string;
  context: CarSeatGuideContext;
  startPanel: {
    startDescription: string;
    questionTitle: string;
    summaryCards: Array<{
      eyebrow: string;
      text: string;
    }>;
  };
  fitCheck: {
    title: string;
    description: string;
    fitSummary: string;
    fitBullets: string[];
    notFitSummary: string;
    notFitBullets: string[];
    signatureMoment: string;
  };
  productExamples: CarSeatGuideProductExample[];
  continueExploring: {
    title: string;
    description: string;
    links: GuideHubLink[];
  };
};

const ROTATING_PRODUCT_EXAMPLES: CarSeatGuideProductExample[] = [
  {
    type: 'product',
    brand: 'Nuna',
    productName: 'REVV maxx',
    shortReview:
      'A strong rotating example because it shows the category at its most obvious: a premium convenience-first seat built around easier loading in one heavily used vehicle.',
    pros: ['Rotation convenience', 'Primary-car logic', 'Premium convenience lane'],
    bestFor:
      'Families who want the turning feature to matter every day and are comfortable paying for convenience in a main vehicle.',
    standout: 'Daily buckle-in ease',
    affiliateLinks: [],
    imageUrl: null,
    imageAlt: 'Nuna REVV maxx car seat image',
  },
  {
    type: 'product',
    brand: 'CYBEX',
    productName: 'Callisto',
    shortReview:
      'Helpful here because it broadens the rotating conversation beyond one premium flagship seat and shows how the swivel lane can still be about daily loading ease first.',
    pros: ['Rotating convenience', 'Useful comparison point', 'Daily loading focus'],
    bestFor:
      'Parents who want to compare more than one kind of rotating setup before deciding whether the convenience payoff is worth it.',
    standout: 'Balanced rotating design',
    affiliateLinks: [],
    imageUrl: null,
    imageAlt: 'CYBEX Callisto car seat image',
  },
  {
    type: 'product',
    brand: 'Maxi-Cosi',
    productName: 'Peri 180',
    shortReview:
      'Useful because it rounds out the rotating lane with another convenience-first example, reinforcing that the value of rotation depends on your loading routine more than the demo itself.',
    pros: ['Convenience-first design', 'Rotation category context', 'Everyday loading focus'],
    bestFor:
      'Parents who keep coming back to the swivel feature and want to compare how different rotating seats answer the same daily-use problem.',
    standout: 'Premium rotating execution',
    affiliateLinks: [],
    imageUrl: null,
    imageAlt: 'Maxi-Cosi Peri 180 car seat image',
  },
];

const TRAVEL_LIGHTWEIGHT_PRODUCT_EXAMPLES: CarSeatGuideProductExample[] = [
  {
    type: 'product',
    brand: 'WAYB',
    productName: 'Pico',
    shortReview:
      'A good reminder that travel and lightweight is not only a newborn conversation. Later-stage travel seats solve a very different problem once portability becomes the whole job.',
    pros: ['Later-stage travel option', 'Movement-first design', 'Secondary-seat logic'],
    bestFor:
      'Families who are past the infant stage and need something genuinely easier for travel, carpools, grandparents, or occasional use.',
    standout: 'Later-stage travel seat example',
    affiliateLinks: [],
    imageUrl: null,
    imageAlt: 'WAYB Pico car seat image',
  },
  {
    type: 'product',
    brand: 'Maxi-Cosi',
    productName: 'Romi',
    shortReview:
      'Useful because it keeps the travel-and-lightweight lane grounded in what many families actually need: something simpler, smaller, and easier to move when the seat does not stay in one place.',
    pros: ['Lightweight secondary-seat logic', 'Travel-friendly setup', 'Less-bulk option'],
    bestFor:
      'Families who need a genuinely easier seat for travel, grandparents, carpools, or occasional use beyond the infant stage.',
    standout: 'Portable without overcomplicating the job',
    affiliateLinks: [],
    imageUrl: null,
    imageAlt: 'Maxi-Cosi Romi car seat image',
  },
];

const CAR_SEAT_CATEGORY_GUIDE_CONFIG: Record<CarSeatCategoryGuideSlug, CarSeatGuideConfig> = {
  'rotating-car-seats': {
    heroEyebrow: 'Car Seat Sub-Guide',
    heroDescription:
      'A calmer guide to what rotating car seats actually solve, when the turn feature is worth paying for, and when it is just extra bulk wearing expensive shoes.',
    context: {
      breadcrumb: ['TMBC Guides', 'Car Seats', 'Specialized Paths'],
      currentLabel: 'Rotating Car Seats',
      compareLabel: 'Travel & Lightweight Car Seats',
      compareHref: CAR_SEAT_SYSTEM_PATHS.travelLightweight,
      compareCtaLabel: 'Compare the lighter, more portable lane ->',
      hubLabel: 'Car Seat Hub',
      hubHref: CAR_SEAT_SYSTEM_PATHS.hub,
      hubCtaLabel: 'Return to the stage map ->',
    },
    startPanel: {
      startDescription:
        'Rotating seats are a convenience category first. They matter when loading, buckling, and daily angles are the real source of frustration, not because rotation makes the seat automatically better at everything else.',
      questionTitle: 'Are you trying to solve daily buckle-ins, or are you actually trying to solve portability?',
      summaryCards: [
        {
          eyebrow: 'Best signal',
          text: 'You load in and out constantly, the seat lives in one main vehicle, and the physical act of buckling is the part that keeps getting old.',
        },
        {
          eyebrow: 'Usually worth paying for',
          text: 'A rotation feature that genuinely reduces awkward loading, especially if rear-facing years will be long and this is a heavily used primary seat.',
        },
        {
          eyebrow: 'Common trap',
          text: 'Treating rotation like a universal upgrade when the real need was a lighter seat, better portability, or a cleaner fit in a tighter vehicle.',
        },
      ],
    },
    fitCheck: {
      title: 'Use rotation as a convenience test, not a status symbol',
      description:
        'The right rotating seat should make everyday loading easier. If it is not solving that problem clearly, it may just be adding cost and footprint to the wrong conversation.',
      fitSummary:
        'This guide is for you if the turning feature keeps catching your eye and you want to know when it is actually useful versus merely impressive in the showroom.',
      fitBullets: [
        'You are comparing rotating seats to standard convertibles or all-in-ones.',
        'Daily loading ease matters more than portable carry or travel-system use.',
        'You want to understand the category before falling in love with a feature list.',
      ],
      notFitSummary:
        'This may not be your best fit if your real priority is newborn portability, multi-car movement, or keeping the seat as light and simple as possible.',
      notFitBullets: [
        'You are mainly solving flights, ride shares, grandparents, or frequent vehicle swaps.',
        'You want a seat that is easy to move between cars rather than easy to rotate in one car.',
        'You are chasing the lightest setup, not the easiest buckle-in angle.',
      ],
      signatureMoment: 'A rotating seat is not a better car seat by default. It is a better answer only when the loading problem is real.',
    },
    productExamples: ROTATING_PRODUCT_EXAMPLES,
    continueExploring: {
      title: 'Continue exploring the car seat map',
      description:
        'If rotation feels close but not quite right, the better answer is usually either a more portable setup or a calmer return to the main stage-based guide.',
      links: [
        {
          title: 'Car Seat Guide',
          description: 'Go back to the full stage map if you need the bigger infant-versus-convertible-versus-all-in-one decision to feel clearer first.',
          bestFor: 'Parents who still need the main category map before narrowing the seat type.',
          href: CAR_SEAT_SYSTEM_PATHS.hub,
          icon: 'carseat',
        },
        {
          title: 'Travel & Lightweight Car Seats',
          description: 'Open this next if portability, secondary vehicles, or travel logistics are the real friction point instead of buckle-in angles.',
          bestFor: 'Families who need less weight, less bulk, and easier movement between vehicles.',
          href: CAR_SEAT_SYSTEM_PATHS.travelLightweight,
          icon: 'plane',
        },
        {
          title: 'Travel With Baby Guide',
          description: 'Helpful once the car seat decision starts overlapping with flights, rentals, grandparents, or away-from-home routines.',
          bestFor: 'Parents planning around actual travel life, not just the primary-car setup.',
          href: '/guides/travel-with-baby',
          icon: 'bag',
        },
      ],
    },
  },
  'travel-lightweight-car-seats': {
    heroEyebrow: 'Car Seat Sub-Guide',
    heroDescription:
      'A practical guide to the car seats that matter when you need less weight, easier transfers, and fewer logistics headaches once flights, ride shares, grandparents, or second vehicles enter the picture.',
    context: {
      breadcrumb: ['TMBC Guides', 'Car Seats', 'Specialized Paths'],
      currentLabel: 'Travel & Lightweight Car Seats',
      compareLabel: 'Rotating Car Seats',
      compareHref: CAR_SEAT_SYSTEM_PATHS.rotating,
      compareCtaLabel: 'Compare the convenience-first lane ->',
      hubLabel: 'Car Seat Hub',
      hubHref: CAR_SEAT_SYSTEM_PATHS.hub,
      hubCtaLabel: 'Return to the stage map ->',
    },
    startPanel: {
      startDescription:
        'Travel and lightweight is not one life stage. It is a use-case filter. This category matters when moving the seat between places becomes the real problem to solve.',
      questionTitle: 'Do you need one seat for one main car, or one that keeps moving with you?',
      summaryCards: [
        {
          eyebrow: 'Best signal',
          text: 'Flights, ride shares, grandparents, taxis, second vehicles, or frequent transfers keep showing up often enough to shape the purchase.',
        },
        {
          eyebrow: 'Usually worth paying for',
          text: 'Lower carry weight, cleaner movement between cars, and a setup that does not become the hardest part of getting out the door.',
        },
        {
          eyebrow: 'Common trap',
          text: 'Buying the lightest-looking option and realizing later that lightweight did not automatically mean easier install, better comfort, or the right stage.',
        },
      ],
    },
    fitCheck: {
      title: 'Use portability as the fit check',
      description:
        'The right travel or lightweight seat should reduce carrying, transferring, or second-car friction. If the seat mostly lives in one vehicle, the value story can change fast.',
      fitSummary:
        'This guide is for you if your car seat decision keeps overlapping with movement: airports, carpools, grandparents, taxis, or lighter everyday carrying.',
      fitBullets: [
        'You need less weight, less bulk, or easier movement between vehicles.',
        'You want to separate newborn portability from later-stage travel needs.',
        'You are trying to avoid turning a travel problem into a giant full-time seat setup.',
      ],
      notFitSummary:
        'This may not be your best fit if the seat will stay installed in one primary car and your bigger priority is long-term everyday use rather than portability.',
      notFitBullets: [
        'You are mostly choosing for a single main vehicle and a predictable routine.',
        'You care more about a long runway in one seat than moving that seat often.',
        'You are drawn to lightweight as a vibe, but not because your real life asks for it.',
      ],
      signatureMoment: 'A travel-friendly seat is not about doing less. It is about asking the seat to do the right job in a more mobile life.',
    },
    productExamples: TRAVEL_LIGHTWEIGHT_PRODUCT_EXAMPLES,
    continueExploring: {
      title: 'Continue exploring the car seat map',
      description:
        'Once you know portability matters, the next question is whether you need a specialized travel answer, a rotating convenience answer, or a return to the main stage guide.',
      links: [
        {
          title: 'Car Seat Guide',
          description: 'Go back to the main stage map if you still need the infant-versus-convertible-versus-all-in-one decision to feel more settled.',
          bestFor: 'Parents who need the bigger stage choice to become clearer before choosing a specialized lane.',
          href: CAR_SEAT_SYSTEM_PATHS.hub,
          icon: 'carseat',
        },
        {
          title: 'Rotating Car Seats',
          description: 'Compare this next if the real problem is not movement between cars, but the daily ergonomics of loading and buckling in one main car.',
          bestFor: 'Families deciding between portability and convenience-first rotation.',
          href: CAR_SEAT_SYSTEM_PATHS.rotating,
          icon: 'convertible',
        },
        {
          title: 'Travel With Baby Guide',
          description: 'Helpful when the seat choice is only one part of a larger airport, rental car, or away-from-home planning system.',
          bestFor: 'Parents working through the broader travel routine, not just the seat in isolation.',
          href: '/guides/travel-with-baby',
          icon: 'plane',
        },
      ],
    },
  },
};

export function isCarSeatCategoryGuideSlug(slug: string): slug is CarSeatCategoryGuideSlug {
  return (CAR_SEAT_CATEGORY_GUIDE_SLUGS as readonly string[]).includes(slug);
}

export function getCarSeatCategoryGuideConfig(slug: CarSeatCategoryGuideSlug) {
  return CAR_SEAT_CATEGORY_GUIDE_CONFIG[slug];
}
