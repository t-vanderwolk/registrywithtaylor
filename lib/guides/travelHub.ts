import type { GuideTocItem } from '@/lib/guides/articleOutline';
import type { GuideHubDecisionItem, GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';

function withAnchor(path: string, id: string) {
  return `${path}#${id}`;
}

const TRAVEL_PATHS = {
  strollers: '/learn/gear/travel-systems-guide',
  carSeats: '/guides/travel-car-seats-guide',
  carriers: '/guides/baby-carriers-guide',
  essentials: '/guides/travel-essentials-guide',
} as const;

const BLOG_PATHS = {
  airportTravel: '/blog/traveling-with-baby-by-plane',
  roadTrip: '/blog/baby-road-trip-essentials',
  hotelTravel: '/blog/staying-in-hotels-with-baby',
} as const;

export type TravelEditorialCallout = {
  matchTitle: string;
  text: string;
  icon: GuideHubIconKey;
};

export type TravelDecisionStrip = {
  matchTitles: string[];
  title: string;
  bullets: string[];
  href: string;
  ctaLabel: string;
  icon: GuideHubIconKey;
};

export type TravelRealityCheckCard = {
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

export const TRAVEL_START_HERE_ITEMS: GuideHubDecisionItem[] = [
  {
    title: 'I need a travel stroller for airports',
    description: 'Start with travel strollers if airport navigation and compact storage are your priorities.',
    href: TRAVEL_PATHS.strollers,
    icon: 'plane',
  },
  {
    title: 'I want to compare baby carriers',
    description: 'Focus on carriers if hands-free mobility and babywearing appeal to your travel style.',
    href: TRAVEL_PATHS.carriers,
    icon: 'layers',
  },
  {
    title: 'I need travel essentials and accessories',
    description: 'Explore travel essentials if you want practical solutions for feeding, sleep, and comfort on the go.',
    href: TRAVEL_PATHS.essentials,
    icon: 'bag',
  },
];

export const TRAVEL_NAVIGATOR_CARDS: GuideHubLink[] = [
  {
    title: 'Travel Strollers',
    description: 'Lightweight, compact strollers designed for airports, hotels, and quick outings.',
    href: TRAVEL_PATHS.strollers,
    icon: 'plane',
    imageSrc: '/assets/travel/strollers.png',
    imageAlt: 'Illustration representing travel strollers.',
  },
  {
    title: 'Travel Car Seats',
    description: 'Portable car seats that work for rentals, rideshares, and travel between vehicles.',
    href: TRAVEL_PATHS.carSeats,
    icon: 'carseat',
    imageSrc: '/assets/travel/car-seats.png',
    imageAlt: 'Illustration representing travel car seats.',
  },
  {
    title: 'Baby Carriers',
    description: 'Hands-free carriers for walking, hiking, and navigating crowded travel spaces.',
    href: TRAVEL_PATHS.carriers,
    icon: 'layers',
    imageSrc: '/assets/travel/carriers.png',
    imageAlt: 'Illustration representing baby carriers.',
  },
  {
    title: 'Travel Essentials',
    description: 'Portable high chairs, sound machines, and accessories that make travel more manageable.',
    href: TRAVEL_PATHS.essentials,
    icon: 'bag',
    imageSrc: '/assets/travel/essentials.png',
    imageAlt: 'Illustration representing travel essentials.',
  },
];

export const TRAVEL_REALITY_CHECK_CARDS: TravelRealityCheckCard[] = [
  {
    brand: 'Bugaboo',
    productName: 'Butterfly',
    category: 'Travel Strollers',
    review: 'At 16 lbs, the Butterfly offers one-handed fold and self-standing design in a compact package. The premium build and smooth maneuverability make it ideal for frequent travelers who want quality over absolute minimalism.',
    bestFor: 'Frequent travelers who want premium quality and performance in a lightweight stroller.',
    standout: 'Premium performance at 16 lbs',
    pros: ['One-handed fold', 'Self-standing design', 'Smooth maneuverability', 'Premium build quality'],
    imageUrl: '/assets/travel/strollers.png',
    imageAlt: 'Bugaboo Butterfly travel stroller.',
  },
  {
    brand: 'Ergobaby',
    productName: '360 Cool Air Mesh Carrier',
    category: 'Baby Carriers',
    review: 'At $160, the 360 Carrier offers breathable mesh, ergonomic design, and multiple carry positions. The comfort and versatility make it a worthwhile investment for parents who travel frequently or spend time outdoors.',
    bestFor: 'Active parents who want comfort, breathability, and versatility for various travel scenarios.',
    standout: 'Breathable comfort at $160',
    pros: ['Breathable mesh', 'Multiple carry positions', 'Ergonomic design', 'Versatile for travel'],
    imageUrl: '/assets/travel/carriers.png',
    imageAlt: 'Ergobaby 360 Cool Air Mesh Carrier.',
  },
  {
    brand: 'Chicco',
    productName: 'KeyFit 30 Infant Car Seat',
    category: 'Travel Car Seats',
    review: 'At 9.5 lbs, the KeyFit 30 offers a narrow design that fits three across in many vehicles. The combination of safety features and travel-friendly design makes it practical for families who travel often.',
    bestFor: 'Traveling families who need a car seat that works well in rentals and fits multiple configurations.',
    standout: 'Travel-friendly at 9.5 lbs',
    pros: ['Fits three across', 'Narrow design', 'Strong safety ratings', 'Travel practical'],
    imageUrl: '/assets/travel/car-seats.png',
    imageAlt: 'Chicco KeyFit 30 Infant Car Seat.',
  },
];

const TRAVEL_VISIBLE_TOC_MATCHES = [
  { match: 'Introduction', label: 'Introduction', level: 2 as const },
  { match: 'Travel Categories', label: 'Travel Categories', level: 2 as const },
  { match: 'Airport Travel', label: 'Airport Travel', level: 3 as const },
  { match: 'Packing Strategies', label: 'Packing', level: 2 as const },
  { match: 'FAQ', label: 'FAQ', level: 2 as const, id: 'guide-faq' },
  { match: 'Final Thoughts', label: 'Final Thoughts', level: 2 as const },
];

const TRAVEL_REALITY_CHECKS: TravelEditorialCallout[] = [
  {
    matchTitle: 'Why Travel With Baby Feels Overwhelming',
    text: 'Most parents do not struggle with travel because they lack gear. They struggle because they try to bring everything instead of focusing on what actually makes travel easier.',
    icon: 'strategy',
  },
  {
    matchTitle: 'Travel Categories',
    text: 'Most families discover that 3-5 well-chosen travel items serve them better than an entire suitcase of baby gear. The right selection makes all the difference.',
    icon: 'layers',
  },
  {
    matchTitle: 'Packing Strategies',
    text: 'A travel item can look essential online and still be unnecessary for your specific trip. The real test is whether it reduces stress rather than adding complexity.',
    icon: 'bag',
  },
];

const TRAVEL_EDITORIAL_IMAGES: any[] = [
  {
    matchTitle: 'Travel Categories',
    eyebrow: 'Editorial break',
    src: '/assets/editorial/travel-categories.jpg',
    alt: 'Editorial placeholder image for travel categories.',
    caption: 'Travel categories become clearer once you understand how they fit into your specific travel scenarios.',
  },
];

export const TRAVEL_DECISION_STRIPS: TravelDecisionStrip[] = [
  {
    matchTitles: ['Travel strollers', 'Travel Strollers'],
    title: 'Best fit if you:',
    bullets: ['fly frequently', 'need compact storage', 'want easy navigation'],
    href: TRAVEL_PATHS.strollers,
    ctaLabel: 'Explore strollers',
    icon: 'plane',
  },
  {
    matchTitles: ['Baby carriers', 'Baby Carriers'],
    title: 'Best fit if you:',
    bullets: ['prefer hands-free', 'travel in cities', 'want ergonomic comfort'],
    href: TRAVEL_PATHS.carriers,
    ctaLabel: 'Explore carriers',
    icon: 'layers',
  },
  {
    matchTitles: ['Travel essentials', 'Travel Essentials'],
    title: 'Best fit if you:',
    bullets: ['need portable solutions', 'travel with gear', 'want comfort on the go'],
    href: TRAVEL_PATHS.essentials,
    ctaLabel: 'Explore essentials',
    icon: 'bag',
  },
];