export type TravelSystemEcosystemType =
  | 'closed'
  | 'semiClosed'
  | 'openAdapter'
  | 'universal'
  | 'niche';

export type TravelSystemBrandInsight = {
  brand: string;
  ecosystemType: TravelSystemEcosystemType;
  ecosystemLabel: string;
  compatibilityPattern: string;
  supportedBrands: string[];
  tmbcInsight: string;
};

export const TRAVEL_SYSTEM_STROLLER_PATTERNS: Array<{
  id: TravelSystemEcosystemType;
  label: string;
  description: string;
}> = [
  {
    id: 'closed',
    label: 'Closed systems',
    description: 'Plug-and-play inside one brand. Easiest to use, least flexible if you change your mind later.',
  },
  {
    id: 'semiClosed',
    label: 'Semi-closed systems',
    description: 'Best within brand, but still capable of a few adapter-based detours when needed.',
  },
  {
    id: 'openAdapter',
    label: 'Open adapter systems',
    description: 'Most flexible on paper, but they ask you to think through adapters before you buy.',
  },
];

export const TRAVEL_SYSTEM_CAR_SEAT_PATTERNS: Array<{
  id: TravelSystemEcosystemType;
  label: string;
  description: string;
}> = [
  {
    id: 'closed',
    label: 'Closed systems',
    description: 'Plug-and-play inside one brand. Cleanest daily experience, least flexibility if you want to mix brands later.',
  },
  {
    id: 'semiClosed',
    label: 'Semi-closed systems',
    description: 'Best within brand, with a smaller adapter lane when you need to widen the search.',
  },
  {
    id: 'universal',
    label: 'Universal systems',
    description: 'The most adapter-friendly infant seat lane. Better when flexibility matters more than brand purity.',
  },
  {
    id: 'niche',
    label: 'Niche systems',
    description: 'More selective compatibility. These can still be great, but they reward planning instead of guesswork.',
  },
];

const BRAND_INSIGHTS: Record<string, TravelSystemBrandInsight> = {
  'baby jogger': {
    brand: 'Baby Jogger',
    ecosystemType: 'openAdapter',
    ecosystemLabel: 'Open adapter system',
    compatibilityPattern: 'Baby Jogger strollers are flexible, but the travel-system answer usually runs through adapters.',
    supportedBrands: ['Nuna', 'CYBEX', 'Maxi-Cosi'],
    tmbcInsight: 'Highly flexible, but almost always adapter-dependent.',
  },
  bob: {
    brand: 'BOB',
    ecosystemType: 'openAdapter',
    ecosystemLabel: 'Open adapter system',
    compatibilityPattern: 'BOB strollers prioritize jogging performance first, so infant-seat pairings are usually less seamless and more adapter-driven.',
    supportedBrands: ['Britax', 'Nuna', 'CYBEX', 'Chicco'],
    tmbcInsight: 'Great for running. Less elegant as an everyday travel system.',
  },
  bugaboo: {
    brand: 'Bugaboo',
    ecosystemType: 'openAdapter',
    ecosystemLabel: 'Open adapter system',
    compatibilityPattern: 'Bugaboo travel systems are modular and premium, but the infant-seat step usually still depends on adapters.',
    supportedBrands: ['Nuna', 'CYBEX', 'Maxi-Cosi'],
    tmbcInsight: 'Premium stroller, adapter-based travel system.',
  },
  bumbleride: {
    brand: 'Bumbleride',
    ecosystemType: 'openAdapter',
    ecosystemLabel: 'Open adapter system',
    compatibilityPattern: 'Bumbleride leans eco and terrain-friendly, but the car-seat side is still adapter-based.',
    supportedBrands: ['Nuna', 'CYBEX', 'Maxi-Cosi'],
    tmbcInsight: 'Useful if you want performance and flexibility, but not a tight native ecosystem.',
  },
  cybex: {
    brand: 'CYBEX',
    ecosystemType: 'semiClosed',
    ecosystemLabel: 'Semi-closed system',
    compatibilityPattern: 'CYBEX works best within the brand, then opens outward with adapters for a few common cross-brand pairings.',
    supportedBrands: ['CYBEX', 'Nuna', 'Maxi-Cosi'],
    tmbcInsight: 'Strong in-brand system with a little room to flex.',
  },
  egg: {
    brand: 'Egg',
    ecosystemType: 'openAdapter',
    ecosystemLabel: 'Open adapter system',
    compatibilityPattern: 'Egg is mostly an adapter story, with the common pairings clustering around the usual premium infant-seat brands.',
    supportedBrands: ['Nuna', 'Maxi-Cosi'],
    tmbcInsight: 'Niche brand, adapter-based only.',
  },
  joie: {
    brand: 'Joie',
    ecosystemType: 'closed',
    ecosystemLabel: 'Closed system',
    compatibilityPattern: 'Joie makes the most sense when you stay inside the Joie ecosystem instead of trying to force broad cross-brand compatibility.',
    supportedBrands: ['Joie'],
    tmbcInsight: 'Best used within the Joie ecosystem.',
  },
  joolz: {
    brand: 'Joolz',
    ecosystemType: 'openAdapter',
    ecosystemLabel: 'Open adapter system',
    compatibilityPattern: 'Joolz uses a polished modular setup, but the infant-seat answer still depends on adapters.',
    supportedBrands: ['Nuna', 'CYBEX', 'Maxi-Cosi'],
    tmbcInsight: 'Beautiful design, still a modular compatibility story.',
  },
  mima: {
    brand: 'Mima',
    ecosystemType: 'openAdapter',
    ecosystemLabel: 'Open adapter system',
    compatibilityPattern: 'Mima pairings tend to be more limited, which matters if flexibility is a core reason you are shopping this tool.',
    supportedBrands: ['Nuna', 'Maxi-Cosi'],
    tmbcInsight: 'Style-first brand with a narrower travel-system lane.',
  },
  nuna: {
    brand: 'Nuna',
    ecosystemType: 'closed',
    ecosystemLabel: 'Closed system',
    compatibilityPattern: 'Nuna is easiest when you stay inside the PIPA ecosystem. It is a cleaner setup, but not the most flexible if you want to mix brands.',
    supportedBrands: ['Nuna'],
    tmbcInsight: 'Closed ecosystem: easiest setup, least flexible.',
  },
  'orbit baby': {
    brand: 'Orbit Baby',
    ecosystemType: 'closed',
    ecosystemLabel: 'Closed system',
    compatibilityPattern: 'Orbit Baby is fully proprietary. It is designed to work as one contained system, not a mix-and-match platform.',
    supportedBrands: ['Orbit Baby'],
    tmbcInsight: 'Fully proprietary system.',
  },
  'peg perego': {
    brand: 'Peg Perego',
    ecosystemType: 'semiClosed',
    ecosystemLabel: 'Semi-closed system',
    compatibilityPattern: 'Peg Perego works most naturally with its own infant seats, then expands outward with adapters in a smaller way.',
    supportedBrands: ['Peg Perego', 'Nuna'],
    tmbcInsight: 'Semi-closed ecosystem with a bit of adapter flexibility.',
  },
  romer: {
    brand: 'Romer',
    ecosystemType: 'closed',
    ecosystemLabel: 'Closed system',
    compatibilityPattern: 'Romer stays tight to its own car-seat lane and does not pretend to be a broad adapter-first ecosystem.',
    supportedBrands: ['Romer'],
    tmbcInsight: 'Best when you want the Romer lane and do not need much cross-brand freedom.',
  },
  'silver cross': {
    brand: 'Silver Cross',
    ecosystemType: 'openAdapter',
    ecosystemLabel: 'Open adapter system',
    compatibilityPattern: 'Silver Cross behaves like a luxury modular system. Beautiful stroller, but the infant-seat answer usually still runs through adapters.',
    supportedBrands: ['Nuna', 'CYBEX', 'Maxi-Cosi', 'Silver Cross'],
    tmbcInsight: 'Luxury modular system with adapter planning baked in.',
  },
  uppababy: {
    brand: 'UPPAbaby',
    ecosystemType: 'semiClosed',
    ecosystemLabel: 'Semi-closed system',
    compatibilityPattern: 'UPPAbaby is most seamless with Aria and Mesa, but it can widen out with adapters when you want a Nuna path instead.',
    supportedBrands: ['UPPAbaby', 'Nuna'],
    tmbcInsight: 'Best inside brand, with a very common Nuna adapter lane.',
  },
};

const CAR_SEAT_INSIGHTS: Record<string, TravelSystemBrandInsight> = {
  britax: {
    brand: 'Britax',
    ecosystemType: 'semiClosed',
    ecosystemLabel: 'Semi-closed system',
    compatibilityPattern: 'Britax infant seats make the most sense in a Britax-first lane, then widen selectively with adapters when the stroller choice points elsewhere.',
    supportedBrands: ['Britax', 'BOB', 'UPPAbaby'],
    tmbcInsight: 'Britax-first system with selective expansion.',
  },
  bugaboo: {
    brand: 'Bugaboo',
    ecosystemType: 'semiClosed',
    ecosystemLabel: 'Semi-closed system',
    compatibilityPattern: 'Bugaboo Turtle seats stay mostly inside the Bugaboo lane, with a smaller adapter story outside it.',
    supportedBrands: ['Bugaboo'],
    tmbcInsight: 'Primarily in-brand, with limited expansion.',
  },
  chicco: {
    brand: 'Chicco',
    ecosystemType: 'universal',
    ecosystemLabel: 'Universal system',
    compatibilityPattern: 'Chicco infant seats are some of the most adapter-friendly in the category, which is why they keep showing up in flexible travel-system conversations.',
    supportedBrands: ['Chicco', 'Baby Jogger', 'UPPAbaby', 'Bugaboo', 'Silver Cross'],
    tmbcInsight: 'One of the most flexible infant-seat ecosystems.',
  },
  clek: {
    brand: 'Clek',
    ecosystemType: 'niche',
    ecosystemLabel: 'Niche system',
    compatibilityPattern: 'Clek infant seats have a narrower travel-system lane, which is fine if you plan for it and frustrating if you assume broad compatibility.',
    supportedBrands: ['UPPAbaby', 'Bugaboo'],
    tmbcInsight: 'More niche. Better when the seat choice is intentional, not accidental.',
  },
  cybex: {
    brand: 'CYBEX',
    ecosystemType: 'semiClosed',
    ecosystemLabel: 'Semi-closed system',
    compatibilityPattern: 'CYBEX infant seats are strongest inside the brand, then widen into the premium adapter lane more easily than most.',
    supportedBrands: ['CYBEX', 'Bugaboo', 'Silver Cross', 'Baby Jogger'],
    tmbcInsight: 'Strong ecosystem with wide premium-brand adapter reach.',
  },
  joie: {
    brand: 'Joie',
    ecosystemType: 'closed',
    ecosystemLabel: 'Closed system',
    compatibilityPattern: 'Joie is easiest when you stay inside the brand instead of expecting a broad cross-brand adapter map.',
    supportedBrands: ['Joie'],
    tmbcInsight: 'Mostly closed. Best when you want a single-brand answer.',
  },
  'maxi-cosi': {
    brand: 'Maxi-Cosi',
    ecosystemType: 'universal',
    ecosystemLabel: 'Universal system',
    compatibilityPattern: 'Maxi-Cosi remains the most adapter-friendly infant-seat lane. If flexibility is your top priority, this is usually where the conversation starts.',
    supportedBrands: ['Maxi-Cosi', 'Bugaboo', 'Baby Jogger', 'UPPAbaby', 'CYBEX', 'Silver Cross'],
    tmbcInsight: 'Most universal system in the category.',
  },
  nuna: {
    brand: 'Nuna',
    ecosystemType: 'closed',
    ecosystemLabel: 'Closed system',
    compatibilityPattern: 'Nuna is premium, polished, and easy inside the PIPA ecosystem. It can expand outward with adapters, but the cleanest experience is still in-brand.',
    supportedBrands: ['Nuna', 'Bugaboo', 'Silver Cross', 'UPPAbaby', 'Baby Jogger'],
    tmbcInsight: 'Premium standard with wide compatibility, but still easiest inside brand.',
  },
  'orbit baby': {
    brand: 'Orbit Baby',
    ecosystemType: 'closed',
    ecosystemLabel: 'Closed system',
    compatibilityPattern: 'Orbit Baby is fully proprietary. The brand is the ecosystem.',
    supportedBrands: ['Orbit Baby'],
    tmbcInsight: 'Fully closed ecosystem.',
  },
  'peg perego': {
    brand: 'Peg Perego',
    ecosystemType: 'semiClosed',
    ecosystemLabel: 'Semi-closed system',
    compatibilityPattern: 'Peg Perego works most naturally with Peg Perego strollers, then offers a smaller adapter lane if you need to widen out.',
    supportedBrands: ['Peg Perego', 'Nuna'],
    tmbcInsight: 'Semi-closed ecosystem.',
  },
  romer: {
    brand: 'Romer',
    ecosystemType: 'niche',
    ecosystemLabel: 'Niche system',
    compatibilityPattern: 'Romer stays tighter and more selective, which matters if you are hoping to mix it into a broader stroller ecosystem.',
    supportedBrands: ['Romer'],
    tmbcInsight: 'Niche and relatively closed.',
  },
  uppababy: {
    brand: 'UPPAbaby',
    ecosystemType: 'closed',
    ecosystemLabel: 'Closed system',
    compatibilityPattern: 'UPPAbaby Aria and Mesa are at their best inside the UPPAbaby lane. The system is polished because it is not trying to be endlessly flexible.',
    supportedBrands: ['UPPAbaby'],
    tmbcInsight: 'Closed and seamless ecosystem.',
  },
};

function normalizeBrand(value: string) {
  return value.trim().toLowerCase();
}

export function getTravelSystemBrandInsight(brand: string) {
  return BRAND_INSIGHTS[normalizeBrand(brand)] ?? null;
}

export function getTravelSystemCarSeatInsight(brand: string) {
  return CAR_SEAT_INSIGHTS[normalizeBrand(brand)] ?? null;
}
