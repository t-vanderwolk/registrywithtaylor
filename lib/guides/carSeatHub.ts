import type { GuideTocItem } from '@/lib/guides/articleOutline';
import type { GuideHubDecisionItem, GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';

function withAnchor(path: string, id: string) {
  return `${path}#${id}`;
}

const CAR_SEAT_PATHS = {
  infant: '/guides/best-infant-car-seats',
  convertible: '/guides/best-convertible-car-seats',
  allInOne: '/guides/best-all-in-one-car-seats',
  booster: '/guides/best-booster-seats',
} as const;

const BLOG_PATHS = {
  carSeatSafety: '/blog/car-seat-safety-basics',
  carSeatInstallation: '/blog/car-seat-installation-guide',
  carSeatBuyingGuide: '/blog/when-to-buy-car-seats',
} as const;

export type CarSeatEditorialCallout = {
  matchTitle: string;
  text: string;
  icon: GuideHubIconKey;
};

export type CarSeatDecisionStrip = {
  matchTitles: string[];
  title: string;
  bullets: string[];
  href: string;
  ctaLabel: string;
  icon: GuideHubIconKey;
};

export type CarSeatRealityCheckCard = {
  brand: string;
  productName: string;
  category: string;
  review: string;
  bestFor: string;
  standout: string;
  pros: string[];
  imageUrl?: string;
  imageAlt?: string;
};

export const CAR_SEAT_START_HERE_ITEMS: GuideHubDecisionItem[] = [
  {
    title: 'I need an infant car seat for the first year',
    description: 'Start with infant seats if rear-facing safety and newborn comfort are your top priorities.',
    href: CAR_SEAT_PATHS.infant,
    icon: 'carseat',
  },
  {
    title: 'I want one seat that grows with my child',
    description: 'Convertible seats offer the most flexibility, growing from infant to toddler in one system.',
    href: CAR_SEAT_PATHS.convertible,
    icon: 'convertible',
  },
  {
    title: "I'm planning for multiple children",
    description: 'All-in-one seats can serve siblings at different stages, maximizing your car seat investment.',
    href: CAR_SEAT_PATHS.allInOne,
    icon: 'layers',
  },
];

export const CAR_SEAT_NAVIGATOR_CARDS: GuideHubLink[] = [
  {
    title: 'Infant Car Seats',
    description: 'Rear-facing seats designed specifically for newborns and infants up to 35 lbs.',
    href: CAR_SEAT_PATHS.infant,
    icon: 'carseat',
    imageSrc: '/assets/car-seats/infant.png',
    imageAlt: 'Illustration representing infant car seats.',
  },
  {
    title: 'Convertible Car Seats',
    description: 'Versatile seats that convert from rear-facing infant mode to forward-facing toddler mode.',
    href: CAR_SEAT_PATHS.convertible,
    icon: 'convertible',
    imageSrc: '/assets/car-seats/convertible.png',
    imageAlt: 'Illustration representing convertible car seats.',
  },
  {
    title: 'All-in-One Car Seats',
    description: 'Comprehensive systems that serve from infant through booster, often with built-in bases.',
    href: CAR_SEAT_PATHS.allInOne,
    icon: 'layers',
    imageSrc: '/assets/car-seats/all-in-one.png',
    imageAlt: 'Illustration representing all-in-one car seats.',
  },
  {
    title: 'Booster Seats',
    description: 'Forward-facing seats for children who have outgrown convertible seats but still need height.',
    href: CAR_SEAT_PATHS.booster,
    icon: 'shield',
    imageSrc: '/assets/car-seats/booster.png',
    imageAlt: 'Illustration representing booster car seats.',
  },
];

export const CAR_SEAT_REALITY_CHECK_CARDS: CarSeatRealityCheckCard[] = [
  {
    brand: 'Graco',
    productName: 'SnugRide Click Connect 35',
    category: 'Infant',
    review: 'At 7.1 lbs, the SnugRide Click Connect offers reliable safety ratings and easy installation. Compatible with Graco strollers, it provides peace of mind for parents prioritizing crash protection and convenience.',
    bestFor: 'Parents seeking a lightweight infant seat with strong safety ratings and stroller compatibility.',
    standout: 'Strong safety ratings at 7.1 lbs',
    pros: ['Strong safety ratings', 'Stroller compatible', 'Easy installation', 'Lightweight design'],
    imageUrl: '/assets/car-seats/infant.png',
    imageAlt: 'Graco SnugRide Click Connect 35 car seat.',
  },
  {
    brand: 'Britax',
    productName: 'Boulevard ClickTight',
    category: 'Convertible',
    review: 'Weighing 22 lbs, the Boulevard ClickTight offers premium safety features and easy installation. With advanced side impact protection and a 5-year warranty, it provides long-term value for safety-conscious families.',
    bestFor: 'Parents who want top-tier safety features and are willing to invest in premium quality.',
    standout: 'Premium safety features at 22 lbs',
    pros: ['Advanced side impact protection', '5-year warranty', 'Easy ClickTight installation', 'Premium build quality'],
    imageUrl: '/assets/car-seats/convertible.png',
    imageAlt: 'Britax Boulevard ClickTight car seat.',
  },
  {
    brand: 'Evenflo',
    productName: 'Gold Maxx',
    category: 'All-in-One',
    review: 'At 25 lbs, the Gold Maxx serves from infant through booster with comprehensive safety features. The built-in base and multi-stage design offer flexibility, though the weight may be a consideration for some parents.',
    bestFor: 'Families planning to use one seat system for multiple children or long-term needs.',
    standout: 'Comprehensive system at 25 lbs',
    pros: ['Serves infant to booster', 'Built-in base included', 'Multi-stage design', 'Comprehensive safety features'],
    imageUrl: '/assets/car-seats/all-in-one.png',
    imageAlt: 'Evenflo Gold Maxx car seat.',
  },
];

const CAR_SEAT_VISIBLE_TOC_MATCHES = [
  { match: 'Introduction', label: 'Introduction', level: 2 as const },
  { match: 'Car Seat Types', label: 'Car Seat Types', level: 2 as const },
  { match: 'Safety Ratings', label: 'Safety Ratings', level: 3 as const },
  { match: 'Installation Guide', label: 'Installation', level: 2 as const },
  { match: 'FAQ', label: 'FAQ', level: 2 as const, id: 'guide-faq' },
  { match: 'Final Thoughts', label: 'Final Thoughts', level: 2 as const },
];

const CAR_SEAT_REALITY_CHECKS: CarSeatEditorialCallout[] = [
  {
    matchTitle: 'Why Car Seats Feel Confusing',
    text: 'Most parents do not choose the wrong car seat because they missed a safety feature. They choose the wrong car seat because installation difficulty and daily use realities matter more than advertised ratings.',
    icon: 'shield',
  },
  {
    matchTitle: 'Car Seat Types',
    text: 'Most families eventually use multiple car seat types as their child grows. Understanding this progression early makes the initial decision far less overwhelming.',
    icon: 'layers',
  },
  {
    matchTitle: 'Installation Guide',
    text: 'A car seat can look perfect in the showroom and still be frustrating to install correctly. The real test happens at home, not in the store.',
    icon: 'calendar',
  },
];

const CAR_SEAT_EDITORIAL_IMAGES: any[] = [
  {
    matchTitle: 'Car Seat Types',
    eyebrow: 'Editorial break',
    src: '/assets/editorial/car-seat-types.jpg',
    alt: 'Editorial placeholder image for car seat categories.',
    caption: 'Car seat categories become clearer once you understand how they fit into your vehicle and daily routine.',
  },
];

export const CAR_SEAT_DECISION_STRIPS: CarSeatDecisionStrip[] = [
  {
    matchTitles: ['Infant car seats', 'Infant Car Seats'],
    title: 'Best fit if you:',
    bullets: ['prioritize rear-facing safety', 'want the lightest option', 'need stroller compatibility'],
    href: CAR_SEAT_PATHS.infant,
    ctaLabel: 'Explore infant seats',
    icon: 'carseat',
  },
  {
    matchTitles: ['Convertible car seats', 'Convertible Car Seats'],
    title: 'Best fit if you:',
    bullets: ['want one seat to grow with baby', 'prioritize installation ease', 'value long-term flexibility'],
    href: CAR_SEAT_PATHS.convertible,
    ctaLabel: 'Explore convertibles',
    icon: 'convertible',
  },
  {
    matchTitles: ['All-in-one car seats', 'All-in-One Car Seats'],
    title: 'Best fit if you:',
    bullets: ['plan for multiple children', 'want maximum longevity', 'prefer comprehensive systems'],
    href: CAR_SEAT_PATHS.allInOne,
    ctaLabel: 'Explore all-in-one',
    icon: 'layers',
  },
];