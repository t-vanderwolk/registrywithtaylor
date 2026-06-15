/**
 * Static affiliate link lookup for travel system products.
 *
 * Keys match the `brand:::model` format used in TravelSystemGenerator
 * (same as `buildOptionValue`).
 *
 * babylistUrl: confirmed Babylist product page (affiliate traffic via TMBC partner agreement)
 * amazonUrl:   Amazon search or ASIN with affiliate tag taylormadebab-20
 *
 * Add new entries as you confirm product IDs with Babylist.
 */

export type ProductAffiliateLinks = {
  babylistUrl?: string;
  amazonUrl?: string;
};

const AMAZON_TAG = 'taylormadebab-20';

function amazonSearch(query: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`;
}

function amazonDp(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

// Babylist confirmed deep links (brand:::model → babylist product page)
// To get a new ID: find product on babylist.com → hover the "Add to registry" button
// → URL contains /gp/[slug]/[product-id]/[variant-id]
const BABYLIST_CONFIRMED: Record<string, string> = {
  // Strollers
  'Bugaboo:::Butterfly':
    'https://www.babylist.com/gp/bugaboo-butterfly-complete-stroller/25163/1154565',

  // Car seats
  'Nuna:::PIPA RX':
    'https://www.babylist.com/gp/nuna-pipa-rx/16140/310275',
};

// ─── Main lookup table ────────────────────────────────────────────────────────

export const TRAVEL_SYSTEM_AFFILIATE_LINKS: Record<string, ProductAffiliateLinks> = {
  // ── STROLLERS ──────────────────────────────────────────────────────────────

  // Bugaboo
  'Bugaboo:::Fox 5': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=bugaboo',
    amazonUrl: amazonSearch('Bugaboo Fox 5 stroller'),
  },
  'Bugaboo:::Butterfly': {
    babylistUrl: BABYLIST_CONFIRMED['Bugaboo:::Butterfly'],
    amazonUrl: amazonSearch('Bugaboo Butterfly stroller'),
  },
  'Bugaboo:::Butterfly 2': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=bugaboo',
    amazonUrl: amazonSearch('Bugaboo Butterfly 2 stroller'),
  },
  'Bugaboo:::Donkey 6': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=bugaboo',
    amazonUrl: amazonSearch('Bugaboo Donkey 6 stroller'),
  },
  'Bugaboo:::Bee 6': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=bugaboo',
    amazonUrl: amazonSearch('Bugaboo Bee 6 stroller'),
  },
  'Bugaboo:::Dragonfly': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=bugaboo',
    amazonUrl: amazonSearch('Bugaboo Dragonfly stroller'),
  },
  'Bugaboo:::Lynx': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=bugaboo',
    amazonUrl: amazonSearch('Bugaboo Lynx stroller'),
  },
  'Bugaboo:::Kangaroo': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=bugaboo',
    amazonUrl: amazonSearch('Bugaboo Kangaroo stroller'),
  },

  // Nuna
  'Nuna:::MIXX next': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=nuna',
    amazonUrl: amazonSearch('Nuna MIXX next stroller'),
  },
  'Nuna:::TRVL lx': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=nuna',
    amazonUrl: amazonSearch('Nuna TRVL lx stroller'),
  },
  'Nuna:::DEMI next': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=nuna',
    amazonUrl: amazonSearch('Nuna DEMI next stroller'),
  },
  'Nuna:::TRIV next': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=nuna',
    amazonUrl: amazonSearch('Nuna TRIV next stroller'),
  },
  'Nuna:::TAVO next': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=nuna',
    amazonUrl: amazonSearch('Nuna TAVO next stroller'),
  },
  'Nuna:::SWIV': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=nuna',
    amazonUrl: amazonSearch('Nuna SWIV stroller'),
  },
  'Nuna:::TRVL Dubl': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=nuna',
    amazonUrl: amazonSearch('Nuna TRVL Dubl stroller'),
  },

  // UPPAbaby
  'UPPAbaby:::Vista V2': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=uppababy',
    amazonUrl: amazonDp('B08H2GXCWK'),
  },
  'UPPAbaby:::Vista V3': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=uppababy',
    amazonUrl: amazonSearch('UPPAbaby Vista V3 stroller'),
  },
  'UPPAbaby:::Cruz V2': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=uppababy',
    amazonUrl: amazonDp('B08H2GXCWK'),
  },
  'UPPAbaby:::Cruz V3': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=uppababy',
    amazonUrl: amazonSearch('UPPAbaby Cruz V3 stroller'),
  },
  'UPPAbaby:::Minu V2': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=uppababy',
    amazonUrl: amazonSearch('UPPAbaby Minu V2 stroller'),
  },
  'UPPAbaby:::Minu V3': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=uppababy',
    amazonUrl: amazonSearch('UPPAbaby Minu V3 stroller'),
  },
  'UPPAbaby:::Ridge': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=uppababy',
    amazonUrl: amazonSearch('UPPAbaby Ridge stroller'),
  },

  // CYBEX
  'CYBEX:::Balios S Lux': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=cybex',
    amazonUrl: amazonSearch('CYBEX Balios S Lux stroller'),
  },
  'CYBEX:::Gazelle S': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=cybex',
    amazonUrl: amazonSearch('CYBEX Gazelle S stroller'),
  },
  'CYBEX:::Libelle': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=cybex',
    amazonUrl: amazonSearch('CYBEX Libelle stroller'),
  },
  'CYBEX:::Priam': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=cybex',
    amazonUrl: amazonSearch('CYBEX Priam stroller'),
  },
  'CYBEX:::Mios': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=cybex',
    amazonUrl: amazonSearch('CYBEX Mios stroller'),
  },
  'CYBEX:::Eezy S Twist': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=cybex',
    amazonUrl: amazonSearch('CYBEX Eezy S Twist stroller'),
  },
  'CYBEX:::Melio': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=cybex',
    amazonUrl: amazonSearch('CYBEX Melio stroller'),
  },
  'CYBEX:::Beezy': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=cybex',
    amazonUrl: amazonSearch('CYBEX Beezy stroller'),
  },
  'CYBEX:::Coya': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=cybex',
    amazonUrl: amazonSearch('CYBEX Coya stroller'),
  },
  'CYBEX:::Eos': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=cybex',
    amazonUrl: amazonSearch('CYBEX Eos stroller'),
  },

  // Silver Cross
  'Silver Cross:::Reef 2': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=silver-cross',
    amazonUrl: amazonSearch('Silver Cross Reef 2 stroller'),
  },
  'Silver Cross:::Wave 3': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=silver-cross',
    amazonUrl: amazonSearch('Silver Cross Wave 3 stroller'),
  },
  'Silver Cross:::Jet 5': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=silver-cross',
    amazonUrl: amazonSearch('Silver Cross Jet 5 stroller'),
  },
  'Silver Cross:::Clic': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=silver-cross',
    amazonUrl: amazonSearch('Silver Cross Clic stroller'),
  },
  'Silver Cross:::Dune 2': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=silver-cross',
    amazonUrl: amazonSearch('Silver Cross Dune 2 stroller'),
  },
  'Silver Cross:::Comet': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=silver-cross',
    amazonUrl: amazonSearch('Silver Cross Comet stroller'),
  },
  'Silver Cross:::Jet Double': {
    amazonUrl: amazonSearch('Silver Cross Jet Double stroller'),
  },

  // Mockingbird
  'Mockingbird:::Single 3.0': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=mockingbird',
    amazonUrl: amazonSearch('Mockingbird Single 3.0 stroller'),
  },
  'Mockingbird:::Single-to-Double 3.0': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=mockingbird',
    amazonUrl: amazonSearch('Mockingbird Single to Double 3.0 stroller'),
  },

  // Baby Jogger
  'Baby Jogger:::City Select 2': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=baby-jogger',
    amazonUrl: amazonSearch('Baby Jogger City Select 2 stroller'),
  },
  'Baby Jogger:::City Tour 2': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=baby-jogger',
    amazonUrl: amazonSearch('Baby Jogger City Tour 2 stroller'),
  },
  'Baby Jogger:::City Mini 2': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=baby-jogger',
    amazonUrl: amazonDp('B08C9XSM1V'),
  },
  'Baby Jogger:::City Mini GT2': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=baby-jogger',
    amazonUrl: amazonSearch('Baby Jogger City Mini GT2 stroller'),
  },
  'Baby Jogger:::City Mini Double': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=baby-jogger',
    amazonUrl: amazonSearch('Baby Jogger City Mini Double stroller'),
  },
  'Baby Jogger:::City Sights': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=baby-jogger',
    amazonUrl: amazonSearch('Baby Jogger City Sights stroller'),
  },

  // BOB
  'BOB:::Revolution Flex 3.0': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=bob',
    amazonUrl: amazonSearch('BOB Revolution Flex 3.0 jogging stroller'),
  },
  'BOB:::Revolution Flex 3.0 Duallie': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=bob',
    amazonUrl: amazonSearch('BOB Revolution Flex 3.0 Duallie'),
  },
  'BOB:::Wayfinder': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=bob',
    amazonUrl: amazonSearch('BOB Wayfinder jogging stroller'),
  },
  'BOB:::Rambler': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=bob',
    amazonUrl: amazonSearch('BOB Rambler jogging stroller'),
  },
  'BOB:::Alterrain Pro': {
    amazonUrl: amazonSearch('BOB Alterrain Pro stroller'),
  },
  'BOB:::Renegade Wagon': {
    amazonUrl: amazonSearch('BOB Renegade Wagon'),
  },

  // Bumbleride
  'Bumbleride:::Indie': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=bumbleride',
    amazonUrl: amazonSearch('Bumbleride Indie stroller'),
  },
  'Bumbleride:::Speed': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=bumbleride',
    amazonUrl: amazonSearch('Bumbleride Speed stroller'),
  },
  'Bumbleride:::Indie Twin': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=bumbleride',
    amazonUrl: amazonSearch('Bumbleride Indie Twin stroller'),
  },
  'Bumbleride:::Era': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=bumbleride',
    amazonUrl: amazonSearch('Bumbleride Era stroller'),
  },

  // Stokke
  'Stokke:::Yoyo 3': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=stokke',
    amazonUrl: amazonSearch('Stokke Yoyo 3 stroller'),
  },

  // Thule
  'Thule:::Urban Glide 2': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=thule',
    amazonUrl: amazonSearch('Thule Urban Glide 2 jogging stroller'),
  },
  'Thule:::Urban Glide 2 Double': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=thule',
    amazonUrl: amazonSearch('Thule Urban Glide 2 Double stroller'),
  },
  'Thule:::Sleek': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=thule',
    amazonUrl: amazonSearch('Thule Sleek stroller'),
  },

  // Joolz
  'Joolz:::Hub 2': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=joolz',
    amazonUrl: amazonSearch('Joolz Hub 2 stroller'),
  },
  'Joolz:::Hub': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=joolz',
    amazonUrl: amazonSearch('Joolz Hub stroller'),
  },
  'Joolz:::Day': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=joolz',
    amazonUrl: amazonSearch('Joolz Day stroller'),
  },
  'Joolz:::Geo': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=joolz',
    amazonUrl: amazonSearch('Joolz Geo stroller'),
  },
  'Joolz:::Aer+': {
    babylistUrl: 'https://www.babylist.com/store/strollers?brand=joolz',
    amazonUrl: amazonSearch('Joolz Aer+ travel stroller'),
  },

  // Egg
  'Egg:::Egg': {
    amazonUrl: amazonSearch('Egg stroller'),
  },

  // Mima
  'Mima:::Xari': {
    amazonUrl: amazonSearch('Mima Xari stroller'),
  },
  'Mima:::Zigi': {
    amazonUrl: amazonSearch('Mima Zigi stroller'),
  },
  'Mima:::Creo': {
    amazonUrl: amazonSearch('Mima Creo stroller'),
  },

  // Peg Perego
  'Peg Perego:::YPSI': {
    amazonUrl: amazonSearch('Peg Perego YPSI stroller'),
  },
  'Peg Perego:::Z4': {
    amazonUrl: amazonSearch('Peg Perego Z4 stroller'),
  },
  'Peg Perego:::Selfie': {
    amazonUrl: amazonSearch('Peg Perego Selfie stroller'),
  },

  // Orbit Baby
  'Orbit Baby:::G5': {
    amazonUrl: amazonSearch('Orbit Baby G5 stroller'),
  },
  'Orbit Baby:::X5': {
    amazonUrl: amazonSearch('Orbit Baby X5 stroller'),
  },

  // Joie
  'Joie:::Ginger': {
    amazonUrl: amazonSearch('Joie Ginger stroller'),
  },
  'Joie:::Hazel': {
    amazonUrl: amazonSearch('Joie Hazel stroller'),
  },
  'Joie:::Kava': {
    amazonUrl: amazonSearch('Joie Kava stroller'),
  },
  'Joie:::Nutmeg': {
    amazonUrl: amazonSearch('Joie Nutmeg stroller'),
  },
  'Joie:::Rosemary': {
    amazonUrl: amazonSearch('Joie Rosemary stroller'),
  },
  'Joie:::Tansy': {
    amazonUrl: amazonSearch('Joie Tansy stroller'),
  },

  // Romer
  'Romer:::Tura': {
    amazonUrl: amazonSearch('Romer Tura stroller'),
  },

  // ── CAR SEATS ──────────────────────────────────────────────────────────────

  // Nuna
  'Nuna:::PIPA RX': {
    babylistUrl: BABYLIST_CONFIRMED['Nuna:::PIPA RX'],
    amazonUrl: amazonSearch('Nuna PIPA RX infant car seat'),
  },
  'Nuna:::PIPA Lite RX': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=nuna',
    amazonUrl: amazonSearch('Nuna PIPA Lite RX infant car seat'),
  },
  'Nuna:::PIPA urbn': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=nuna',
    amazonUrl: amazonSearch('Nuna PIPA urbn infant car seat'),
  },
  'Nuna:::PIPA Aire rx': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=nuna',
    amazonUrl: amazonSearch('Nuna PIPA Aire rx infant car seat'),
  },

  // Bugaboo
  'Bugaboo:::Turtle Air': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=bugaboo',
    amazonUrl: amazonSearch('Bugaboo Turtle Air by Nuna infant car seat'),
  },
  'Bugaboo:::Turtle One': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=bugaboo',
    amazonUrl: amazonSearch('Bugaboo Turtle One by Nuna infant car seat'),
  },

  // UPPAbaby
  'UPPAbaby:::Aria': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=uppababy',
    amazonUrl: amazonSearch('UPPAbaby Aria infant car seat'),
  },
  'UPPAbaby:::Aria V2': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=uppababy',
    amazonUrl: amazonSearch('UPPAbaby Aria V2 infant car seat'),
  },
  'UPPAbaby:::Mesa Max': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=uppababy',
    amazonUrl: amazonSearch('UPPAbaby Mesa Max infant car seat'),
  },

  // CYBEX
  'CYBEX:::Aton G': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=cybex',
    amazonUrl: amazonSearch('CYBEX Aton G infant car seat'),
  },

  // Silver Cross
  'Silver Cross:::Glide Plus 360': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=silver-cross',
    amazonUrl: amazonSearch('Silver Cross Glide Plus 360 infant car seat'),
  },
  'Silver Cross:::Dream i-Size': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=silver-cross',
    amazonUrl: amazonSearch('Silver Cross Dream i-Size infant car seat'),
  },

  // Britax
  'Britax:::Willow S': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=britax',
    amazonUrl: amazonSearch('Britax Willow S infant car seat'),
  },
  'Britax:::Cypress S': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=britax',
    amazonUrl: amazonSearch('Britax Cypress S infant car seat'),
  },

  // Baby Jogger
  'Baby Jogger:::City GO 2': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=baby-jogger',
    amazonUrl: amazonSearch('Baby Jogger City GO 2 infant car seat'),
  },

  // Maxi-Cosi
  'Maxi-Cosi:::Mico Luxe': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=maxi-cosi',
    amazonUrl: amazonSearch('Maxi-Cosi Mico Luxe infant car seat'),
  },
  'Maxi-Cosi:::Mico Pro': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=maxi-cosi',
    amazonUrl: amazonSearch('Maxi-Cosi Mico Pro infant car seat'),
  },
  'Maxi-Cosi:::Coral XP': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=maxi-cosi',
    amazonUrl: amazonSearch('Maxi-Cosi Coral XP infant car seat'),
  },
  'Maxi-Cosi:::Peri 180': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=maxi-cosi',
    amazonUrl: amazonSearch('Maxi-Cosi Peri 180 infant car seat'),
  },

  // Chicco
  'Chicco:::KeyFit 35': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=chicco',
    amazonUrl: amazonSearch('Chicco KeyFit 35 infant car seat'),
  },
  'Chicco:::Fit2': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=chicco',
    amazonUrl: amazonSearch('Chicco Fit2 infant car seat'),
  },

  // Clek
  'Clek:::Liing': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=clek',
    amazonUrl: amazonSearch('Clek Liing infant car seat'),
  },
  'Clek:::Liingo': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=clek',
    amazonUrl: amazonSearch('Clek Liingo infant car seat'),
  },

  // Stokke
  'Stokke:::PIPA': {
    babylistUrl: 'https://www.babylist.com/store/car-seats?brand=stokke',
    amazonUrl: amazonSearch('Stokke PIPA infant car seat'),
  },

  // Orbit Baby
  'Orbit Baby:::G5 Infant Seat': {
    amazonUrl: amazonSearch('Orbit Baby G5 infant car seat'),
  },

  // Peg Perego
  'Peg Perego:::Primo Viaggio 4-35': {
    amazonUrl: amazonSearch('Peg Perego Primo Viaggio 4-35 infant car seat'),
  },

  // Joie
  'Joie:::Infant Seat Series': {
    amazonUrl: amazonSearch('Joie infant car seat'),
  },

  // Romer
  'Romer:::Infant Seat Series': {
    amazonUrl: amazonSearch('Romer infant car seat'),
  },
};

/** Returns affiliate links for a given brand + model. Empty object if not found. */
export function getAffiliateLinks(brand: string, model: string): ProductAffiliateLinks {
  return TRAVEL_SYSTEM_AFFILIATE_LINKS[`${brand}:::${model}`] ?? {};
}
