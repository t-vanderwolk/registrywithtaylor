/**
 * Static affiliate link lookup for travel system products.
 *
 * Keys match the `brand:::model` format used in TravelSystemGenerator
 * (same as `buildOptionValue`).
 *
 * babylistUrl: confirmed Babylist product page (affiliate traffic via TMBC partner agreement)
 * amazonUrl:   EXACT Amazon product page (/dp/<ASIN>) with affiliate tag taylormadebab-20.
 *              Only added when the exact product was verified on amazon.com. Products we
 *              could not confirm — and every Nuna product (Nuna is not sold on Amazon) —
 *              intentionally have NO amazonUrl, so no Amazon button renders for them.
 */

export type ProductAffiliateLinks = {
  babylistUrl?: string;
  amazonUrl?: string;
};

const AMAZON_TAG = 'taylormadebab-20';

function amazonDp(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

// ─── Babylist Impact affiliate tracking ───────────────────────────────────────
// All babylist.com destination URLs are routed through the Impact tracker so
// clicks are attributed to the TMBC publisher account.
//
// Tracking base:  https://babylist.pxf.io/c/6560395/1056628/13580
// Destination:    ?u=<URL-encoded babylist.com path>
// Partner ID:     &partnerpropertyid=7490466

const BABYLIST_TRACKER_BASE = 'https://babylist.pxf.io/c/6560395/1056628/13580';
const BABYLIST_PARTNER_ID   = '7490466';

function babylistTracked(destUrl: string): string {
  return `${BABYLIST_TRACKER_BASE}?u=${encodeURIComponent(destUrl)}&partnerpropertyid=${BABYLIST_PARTNER_ID}`;
}

/**
 * Affiliate-tracked link to any babylist.com page (product or store category).
 * Use for curated picks that live outside the stroller/car-seat catalogue — e.g.
 * nursery essentials — where there's no synced SKU to resolve.
 */
export function babylistShopLink(destUrl: string): string {
  return babylistTracked(destUrl);
}

// Babylist confirmed deep links (brand:::model → babylist product page)
// To get a new ID: find product on babylist.com → hover the "Add to registry" button
// → URL contains /gp/[slug]/[product-id]/[variant-id]
const BABYLIST_CONFIRMED: Record<string, string> = {
  // Strollers
  'Bugaboo:::Butterfly': babylistTracked(
    'https://www.babylist.com/gp/bugaboo-butterfly-complete-stroller/25163/1154565',
  ),

  // Car seats
  'Nuna:::PIPA RX': babylistTracked(
    'https://www.babylist.com/gp/nuna-pipa-rx/16140/310275',
  ),
};

// ─── Main lookup table ────────────────────────────────────────────────────────

export const TRAVEL_SYSTEM_AFFILIATE_LINKS: Record<string, ProductAffiliateLinks> = {
  // ── STROLLERS ──────────────────────────────────────────────────────────────

  // Bugaboo
  'Bugaboo:::Fox 5': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bugaboo'),
    amazonUrl: amazonDp('B0BX4PF2KG'),
  },
  'Bugaboo:::Butterfly': {
    babylistUrl: BABYLIST_CONFIRMED['Bugaboo:::Butterfly'],
    amazonUrl: amazonDp('B0B1QRC69X'),
  },
  'Bugaboo:::Butterfly 2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bugaboo'),
    amazonUrl: amazonDp('B0F8RBF72G'),
  },
  // Donkey 6 / Bee 6 not found as exact Amazon listings → no amazonUrl.
  'Bugaboo:::Donkey 6': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bugaboo'),
  },
  'Bugaboo:::Bee 6': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bugaboo'),
  },
  'Bugaboo:::Dragonfly': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bugaboo'),
    amazonUrl: amazonDp('B0C5B9CH91'),
  },
  'Bugaboo:::Dragonfly Plus': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bugaboo'),
    amazonUrl: amazonDp('B0C5B9CH91'),
  },
  'Bugaboo:::Lynx': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bugaboo'),
  },
  'Bugaboo:::Kangaroo': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bugaboo'),
  },

  // Nuna — NOT sold on Amazon; Babylist only.
  'Nuna:::MIXX next': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=nuna'),
  },
  'Nuna:::TRVL lx': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=nuna'),
  },
  'Nuna:::DEMI next': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=nuna'),
  },
  'Nuna:::TRIV next': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=nuna'),
  },
  'Nuna:::TAVO next': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=nuna'),
  },
  'Nuna:::SWIV': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=nuna'),
  },
  'Nuna:::TRVL Dubl': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=nuna'),
  },

  // UPPAbaby
  'UPPAbaby:::Vista V2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=uppababy'),
    amazonUrl: amazonDp('B09BXZZR7H'),
  },
  'UPPAbaby:::Vista V3': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=uppababy'),
    amazonUrl: amazonDp('B0D9XSJ5X5'),
  },
  'UPPAbaby:::Cruz V2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=uppababy'),
    amazonUrl: amazonDp('B07Z6YWM7D'),
  },
  'UPPAbaby:::Cruz V3': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=uppababy'),
    amazonUrl: amazonDp('B0FHM3LGY7'),
  },
  'UPPAbaby:::Minu V2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=uppababy'),
    amazonUrl: amazonDp('B09XZ1RXRK'),
  },
  'UPPAbaby:::Minu V3': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=uppababy'),
  },
  'UPPAbaby:::Ridge': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=uppababy'),
    amazonUrl: amazonDp('B0BHZXDNCS'),
  },

  // CYBEX
  'CYBEX:::Balios S Lux': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=cybex'),
  },
  'CYBEX:::Gazelle S': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=cybex'),
    amazonUrl: amazonDp('B0BV7DWQY7'),
  },
  'CYBEX:::Libelle': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=cybex'),
    amazonUrl: amazonDp('B0B729KDCM'),
  },
  'CYBEX:::Priam': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=cybex'),
    amazonUrl: amazonDp('B07N1DHKTM'),
  },
  'CYBEX:::Mios': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=cybex'),
    amazonUrl: amazonDp('B07VNNKQC7'),
  },
  'CYBEX:::Eezy S Twist': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=cybex'),
    amazonUrl: amazonDp('B08BVRJHSZ'),
  },
  'CYBEX:::Melio': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=cybex'),
    amazonUrl: amazonDp('B0BTTPCJ7X'),
  },
  'CYBEX:::Beezy': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=cybex'),
  },
  'CYBEX:::Coya': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=cybex'),
  },
  'CYBEX:::Eos': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=cybex'),
  },

  // Silver Cross
  'Silver Cross:::Reef 2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=silver-cross'),
  },
  'Silver Cross:::Wave 3': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=silver-cross'),
  },
  'Silver Cross:::Jet 5': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=silver-cross'),
    amazonUrl: amazonDp('B0D5BPPVN9'),
  },
  'Silver Cross:::Clic': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=silver-cross'),
    amazonUrl: amazonDp('B0FFVSBSTT'),
  },
  'Silver Cross:::Dune 2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=silver-cross'),
    amazonUrl: amazonDp('B0C86M3NBD'),
  },
  'Silver Cross:::Comet': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=silver-cross'),
  },
  'Silver Cross:::Jet Double': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=silver-cross'),
    amazonUrl: amazonDp('B0DDL4NRMF'),
  },

  // Mockingbird — direct-to-consumer only; not on Amazon.
  'Mockingbird:::Single 3.0': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=mockingbird'),
  },
  'Mockingbird:::Single-to-Double 3.0': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=mockingbird'),
  },

  // Baby Jogger
  'Baby Jogger:::City Select 2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=baby-jogger'),
    amazonUrl: amazonDp('B094NYCVJ5'),
  },
  'Baby Jogger:::City Tour 2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=baby-jogger'),
    amazonUrl: amazonDp('B07NZPT3TR'),
  },
  'Baby Jogger:::City Mini 2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=baby-jogger'),
    amazonUrl: amazonDp('B08C9XSM1V'),
  },
  'Baby Jogger:::City Mini GT2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=baby-jogger'),
    amazonUrl: amazonDp('B08ZJTNY7Y'),
  },
  'Baby Jogger:::City Mini GT2 Double': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=baby-jogger'),
    amazonUrl: amazonDp('B07YGVFZFH'),
  },
  'Baby Jogger:::City Mini Double': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=baby-jogger'),
  },
  'Baby Jogger:::City Sights': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=baby-jogger'),
  },

  // BOB
  'BOB:::Revolution Flex 3.0': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bob'),
    amazonUrl: amazonDp('B0829PMJ8D'),
  },
  'BOB:::Revolution Flex 3.0 Duallie': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bob'),
    amazonUrl: amazonDp('B084CK55RW'),
  },
  'BOB:::Wayfinder': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bob'),
    amazonUrl: amazonDp('B0BTZCRGGV'),
  },
  'BOB:::Rambler': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bob'),
    amazonUrl: amazonDp('B0829P1RF6'),
  },

  // Bumbleride
  'Bumbleride:::Indie': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bumbleride'),
    amazonUrl: amazonDp('B0DJ3BTB3K'),
  },
  'Bumbleride:::Speed': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bumbleride'),
  },
  'Bumbleride:::Indie Twin': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bumbleride'),
    amazonUrl: amazonDp('B0DJ3DBQG6'),
  },
  'Bumbleride:::Era': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bumbleride'),
    amazonUrl: amazonDp('B0DJ3BDZKZ'),
  },

  // BABYZEN
  'BABYZEN:::YOYO2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?q=babyzen+yoyo'),
    amazonUrl: amazonDp('B0856NX5D7'),
  },
  'BABYZEN:::YOYO Origin': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?q=babyzen+yoyo'),
  },

  // Stokke
  'Stokke:::Yoyo 3': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=stokke'),
  },

  // Thule
  'Thule:::Urban Glide 2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=thule'),
    amazonUrl: amazonDp('B081ZVSJR2'),
  },
  'Thule:::Urban Glide 2 Double': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=thule'),
    amazonUrl: amazonDp('B08JDC7Q7M'),
  },
  'Thule:::Sleek': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=thule'),
  },

  // Joolz
  'Joolz:::Hub 2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=joolz'),
    amazonUrl: amazonDp('B0DYVNXJ65'),
  },
  'Joolz:::Hub': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=joolz'),
    amazonUrl: amazonDp('B085G2FNSK'),
  },
  'Joolz:::Day': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=joolz'),
  },
  'Joolz:::Geo': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=joolz'),
  },
  'Joolz:::Aer+': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=joolz'),
    amazonUrl: amazonDp('B0CYQ89PC7'),
  },

  // Baby Jogger (additional)
  'Baby Jogger:::Summit X3': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=baby-jogger'),
    amazonUrl: amazonDp('B0C4D7VTCQ'),
  },
  'Baby Jogger:::Summit X3 Double': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=baby-jogger'),
    amazonUrl: amazonDp('B0BWSJH1Z1'),
  },

  // BABYZEN (additional)
  'BABYZEN:::YOYO+': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?q=babyzen+yoyo'),
  },

  // Britax
  'Britax:::B-Clever': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=britax'),
  },
  'Britax:::B-Lively': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=britax'),
    amazonUrl: amazonDp('B07D15XKGY'),
  },

  // Bugaboo (additional)
  'Bugaboo:::Ant': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bugaboo'),
  },
  'Bugaboo:::Bee 5': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bugaboo'),
    amazonUrl: amazonDp('B07BMPLVPZ'),
  },
  'Bugaboo:::Donkey 3': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bugaboo'),
  },
  'Bugaboo:::Fox 2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=bugaboo'),
  },

  // Joovy
  'Joovy:::Caboose S': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=joovy'),
  },
  'Joovy:::Caboose Ultralight Graphite': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=joovy'),
  },
  'Joovy:::Qool': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=joovy'),
    amazonUrl: amazonDp('B07CC5X39W'),
  },
  'Joovy:::Twin Roo+': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=joovy'),
  },

  // Silver Cross (additional)
  'Silver Cross:::Reef': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=silver-cross'),
  },
  'Silver Cross:::Wave': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=silver-cross'),
  },

  // Thule (additional)
  'Thule:::Glide 2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/strollers?brand=thule'),
  },

  // ── CAR SEATS ──────────────────────────────────────────────────────────────

  // Nuna — NOT sold on Amazon; Babylist only.
  'Nuna:::PIPA RX': {
    babylistUrl: BABYLIST_CONFIRMED['Nuna:::PIPA RX'],
  },
  'Nuna:::PIPA Lite RX': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=nuna'),
  },
  'Nuna:::PIPA urbn': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=nuna'),
  },
  'Nuna:::PIPA Aire rx': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=nuna'),
  },

  // Bugaboo Turtle (made by Nuna) — Babylist only.
  'Bugaboo:::Turtle Air': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=bugaboo'),
  },
  'Bugaboo:::Turtle One': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=bugaboo'),
  },

  // UPPAbaby
  'UPPAbaby:::Aria': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=uppababy'),
    amazonUrl: amazonDp('B0CVBNKXZS'),
  },
  'UPPAbaby:::Aria V2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=uppababy'),
    amazonUrl: amazonDp('B0FPJLLV8L'),
  },
  'UPPAbaby:::Mesa Max': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=uppababy'),
    amazonUrl: amazonDp('B0BTJGBN8K'),
  },

  // CYBEX
  'CYBEX:::Aton G': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=cybex'),
    amazonUrl: amazonDp('B0F4963KZS'),
  },

  // Silver Cross
  'Silver Cross:::Glide Plus 360': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=silver-cross'),
  },
  'Silver Cross:::Dream i-Size': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=silver-cross'),
  },

  // Britax
  'Britax:::Willow S': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=britax'),
    amazonUrl: amazonDp('B0BWHD71J9'),
  },
  'Britax:::Cypress S': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=britax'),
    amazonUrl: amazonDp('B0CWS89KX9'),
  },

  // Baby Jogger
  'Baby Jogger:::City GO 2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=baby-jogger'),
    amazonUrl: amazonDp('B08G1X46GJ'),
  },

  // Maxi-Cosi
  'Maxi-Cosi:::Mico Luxe': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=maxi-cosi'),
    amazonUrl: amazonDp('B0BTQ4FZC1'),
  },
  'Maxi-Cosi:::Mico Pro': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=maxi-cosi'),
  },
  'Maxi-Cosi:::Coral XP': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=maxi-cosi'),
    amazonUrl: amazonDp('B092S884JV'),
  },
  'Maxi-Cosi:::Peri 180': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=maxi-cosi'),
    amazonUrl: amazonDp('B0CT62H9FC'),
  },

  // Chicco
  'Chicco:::KeyFit 35': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=chicco'),
    amazonUrl: amazonDp('B089HG2QTT'),
  },
  'Chicco:::Fit2': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=chicco'),
    amazonUrl: amazonDp('B07ZWVKR73'),
  },

  // Clek
  'Clek:::Liing': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=clek'),
    amazonUrl: amazonDp('B0CZPB9GT7'),
  },
  'Clek:::Liingo': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=clek'),
    amazonUrl: amazonDp('B0BSLX5JXV'),
  },

  // Stokke PIPA (made by Nuna) — Babylist only.
  'Stokke:::PIPA': {
    babylistUrl: babylistTracked('https://www.babylist.com/store/car-seats?brand=stokke'),
  },
};

/** Returns affiliate links for a given brand + model. Empty object if not found. */
export function getAffiliateLinks(brand: string, model: string): ProductAffiliateLinks {
  return TRAVEL_SYSTEM_AFFILIATE_LINKS[`${brand}:::${model}`] ?? {};
}

function brandSlug(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Always returns a Babylist affiliate-tracked URL for a product, in priority:
 *   1. the exact synced product URL (already affiliate-tracked by Impact), else
 *   2. the confirmed/brand link from the static map (affiliate-tracked), else
 *   3. an affiliate-tracked Babylist brand listing as a last resort.
 * Use this so every buy CTA carries the TMBC Babylist affiliate code.
 */
export function babylistAffiliateUrl(
  brand: string,
  model: string,
  kind: 'stroller' | 'carSeat' = 'stroller',
  syncedUrl?: string | null,
): string {
  if (syncedUrl) return syncedUrl;
  const fromMap = getAffiliateLinks(brand, model).babylistUrl;
  if (fromMap) return fromMap;
  const path = kind === 'carSeat' ? 'car-seats' : 'strollers';
  return babylistTracked(`https://www.babylist.com/store/${path}?brand=${brandSlug(brand)}`);
}
