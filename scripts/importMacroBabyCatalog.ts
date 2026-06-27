/**
 * MacroBaby Shopify catalog import.
 *
 * Keeps only TMBC-eligible strollers, true infant car seats, and stroller/car-seat
 * adapters. Dry run is the default and writes JSON + CSV reports under reports/.
 *
 *   npm run catalog:import-macrobaby-dry-run
 *   npm run catalog:import-macrobaby-apply
 *
 * The MacroBaby referral parameter is preserved on stored product URLs:
 *   ?_j=taylormadebabyco.com
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import https from 'node:https';
import { resolve } from 'node:path';
import crypto from 'node:crypto';
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { parseCarSeatModel, parseStrollerModel } from '@/lib/catalog/strollerModel';
import { CATEGORY_TO_JOURNEY } from '@/lib/catalog/taxonomy';
import { canonicalStrollerBrand } from '@/lib/catalog/strollerFinderRules';

const PROVIDER = 'shopify_macrobaby';
const RETAILER = 'MacroBaby';
const AFFILIATE_PARAM = '_j';
const AFFILIATE_VALUE = 'taylormadebabyco.com';
const BASE_URL = 'https://www.macrobaby.com';
const REPORT_JSON = 'reports/macrobaby-import-dry-run.json';
const REPORT_CSV = 'reports/macrobaby-import-dry-run.csv';

const COLLECTIONS = [
  { handle: 'stroller', kind: 'strollers' },
  { handle: 'infant-car-seats', kind: 'infant car seats' },
  { handle: 'adapters', kind: 'adapters' },
  { handle: 'car-seat-accessories', kind: 'car seat accessories fallback' },
];

const KNOWN_BRANDS = [
  'Baby Jogger',
  'Silver Cross',
  'Maxi-Cosi',
  'Peg Perego',
  'Orbit Baby',
  'Radio Flyer',
  'BOB Gear',
  'Baby Trend',
  'Valco Baby',
  'Guava Family',
  'Mountain Buggy',
  'UPPAbaby',
  'Bugaboo',
  'Cybex',
  'CYBEX',
  'Nuna',
  'Joolz',
  'Joie',
  'Chicco',
  'Graco',
  'Britax',
  'Bumbleride',
  'Mockingbird',
  'Mompush',
  'Thule',
  'Stokke',
  'Evenflo',
  'Veer',
  'Clek',
  'Doona',
  'Romer',
  'Ergobaby',
  'Inglesina',
  'Zoe',
  'WonderFold',
  'Larktale',
  'Colugo',
  'Mima',
  'Jeep',
  'Ingenuity',
  'Summer',
  'Diono',
  'Cosatto',
  'Babyzen',
  'Keenz',
  'egg',
  'Munchkin',
  'Safety 1st',
  'Dorel',
].sort((a, b) => b.length - a.length);

const COLOR_WORDS = [
  'ada',
  'anthracite',
  'ash',
  'beige',
  'black',
  'blue',
  'brown',
  'caviar',
  'charcoal',
  'chestnut',
  'cream',
  'dark cherry',
  'desert taupe',
  'eclipse',
  'frost',
  'graphite',
  'green',
  'grey',
  'greyson',
  'hazelwood',
  'jade',
  'jake',
  'leaf green',
  'moon black',
  'navy',
  'noa',
  'ocean',
  'pink',
  'red',
  'sand',
  'sandstone',
  'savannah',
  'slate',
  'stone',
  'taupe',
  'toffee',
  'white',
].sort((a, b) => b.length - a.length);

const VERSION_TERMS = [
  'v2',
  'v3',
  'v4',
  'next',
  'lx',
  'rx',
  'aire',
  'air',
  'max',
  'plus',
  '+',
  'duo',
  'twin',
  'mono',
];

const EXCLUDED_REASON_RULES: Array<{ reason: SkipReason; re: RegExp }> = [
  { reason: 'skippedTravelSystems', re: /\b(travel systems?|infant car seat\s*&\s*stroller combo|car seat\s*&\s*stroller combo|flex system)\b/i },
  { reason: 'skippedBundles', re: /\b(bundle|registry set|package)\b/i },
  { reason: 'skippedReplacementParts', re: /\b(replacement|spare part|wheel|tire|inner tube|tube|chassis|frame only|stroller frame|(?:priam|epriam|e priam|mios|mios3)\s*\d*\s*frame|fabric set|seat fabric)\b/i },
  { reason: 'skippedStrollerAccessories', re: /\b(cup ?holders?|snack trays?|parent organizers?|organizers?|cadd(?:y|ies)|cargo net|gate check bag|rain cover|rain shield|weather shield|mosquito|insect net|travel bags?|carry bags?|transport bags?|footmuffs?|muffs?|parasol|sun shade|canopy|bumper bar|belly bar|board|glider board|piggyback|basket|liner|seat liner|stroller fans?|portable baby stroller fan|stroller cooler|cooler bag|clip n carry|phone holders?|hangers?|hooks?|console|toy|attachment|bike trailer|trailer conversion|conversion kit|car seat carrier|caddy frame|pediatric wheelchair|adaptive stroller|medical stroller|napper|bassinet|bassinet stand|storage basket|second seat|sibling seat|rumble ?seat|rumbleseat|toddler seat|seat unit|stroller accessories|yoyo.? connect|yoyo.*frame)\b/i },
  { reason: 'skippedCarSeatAccessories', re: /\b(car mirror|seat protector|sun ?shade|sunshade|weather shield|heat shield|car seat net|mosquito net|insect net|car seat cover|car seat canopy|body support|harness cover|strap cover|cup holder|base only|extra base|recline base|load leg base|stay.?in.?car base|car seat base|infant insert|\binsert\b|inlay|bassinet)\b/i },
  { reason: 'skippedNonInfantCarSeats', re: /\b(convertible|all.?in.?one|booster|rotating|360|swivel)\s+(?:car\s*)?seats?\b/i },
  { reason: 'skippedNurseryPackages', re: /\b(nursery package|crib|dresser|glider|bedding set)\b/i },
];

const STROLLER_ACCESSORY_RE =
  /\b(adapter|adaptor|cup ?holders?|snack trays?|parent organizers?|organizers?|cadd(?:y|ies)|cargo net|gate check bag|rain cover|rain shield|weather shield|mosquito|insect net|travel bags?|carry bags?|transport bags?|footmuffs?|parasol|sun shade|canopy|bumper bar|belly bar|board|basket|liner|phone holders?|hangers?|hooks?|console|toy|attachment|bike trailer|trailer conversion|conversion kit|car seat carrier|caddy frame|pediatric wheelchair|adaptive stroller|medical stroller|napper|bassinet|bassinet stand|storage basket|second seat|sibling seat|rumble ?seat|rumbleseat|seat unit|stroller fans?|portable baby stroller fan|stroller cooler|cooler bag|clip n carry|replacement|wheel|tire|stroller frame|stroller accessories|yoyo.? connect|yoyo.*frame)\b/i;

const INFANT_SEAT_MODEL_RE =
  /\b(pipa|mesa|aria|liing|cloud|aton|keyfit|fit2|snugride|litemax|ez-?lift|primo viaggio|turtle|mico|willow|safe-?wash|b-?safe|doona|orbit baby g5)\b/i;

const INFANT_SEAT_BRANDS = [
  'Maxi-Cosi',
  'Nuna',
  'Cybex',
  'CYBEX',
  'Clek',
  'Britax',
  'Chicco',
  'Graco',
  'Peg Perego',
  'UPPAbaby',
  'Bugaboo',
  'Doona',
  'Evenflo',
  'Silver Cross',
  'Baby Trend',
  'Orbit Baby',
  'Joie',
  'Romer',
];

const STROLLER_FAMILY_PATTERNS: Array<{ family: string; res: RegExp[] }> = [
  { family: 'UPPAbaby Minu', res: [/\bminu\b/i] },
  { family: 'UPPAbaby Vista', res: [/\bvista\b/i] },
  { family: 'UPPAbaby Cruz', res: [/\bcruz\b/i] },
  { family: 'UPPAbaby Ridge', res: [/\bridge\b/i] },
  { family: 'Bugaboo Butterfly', res: [/\bbutterfly\b/i] },
  { family: 'Bugaboo Fox', res: [/\bfox\b/i] },
  { family: 'Bugaboo Donkey', res: [/\bdonkey\b/i] },
  { family: 'Bugaboo Dragonfly', res: [/\bdragonfly\b/i] },
  { family: 'Nuna TRVL', res: [/\btrvl\b/i] },
  { family: 'Nuna TRIV', res: [/\btriv\b/i] },
  { family: 'Nuna MIXX', res: [/\bmixx\b/i] },
  { family: 'Nuna DEMI', res: [/\bdemi\b/i] },
  { family: 'Cybex Gazelle', res: [/\be-?gazelle\b/i, /\bgazelle\b/i] },
  { family: 'Cybex Priam', res: [/\be-?priam\b/i, /\bpriam\b/i] },
  { family: 'Cybex Mios', res: [/\bmios\b/i] },
  { family: 'Cybex Coya', res: [/\bcoya\b/i] },
  { family: 'Cybex Libelle', res: [/\blibelle\b/i] },
  { family: 'Silver Cross Wave', res: [/\bwave\b/i] },
  { family: 'Silver Cross Reef', res: [/\breef\b/i] },
  { family: 'Silver Cross Dune', res: [/\bdune\b/i] },
  { family: 'Silver Cross Jet', res: [/\bjet\b/i] },
  { family: 'Baby Jogger City Select', res: [/\bcity select\b/i] },
  { family: 'Baby Jogger City Mini', res: [/\bcity mini\b/i] },
  { family: 'Baby Jogger Summit', res: [/\bsummit\b/i] },
  { family: 'Veer Cruiser', res: [/\bcruiser\b/i] },
  { family: 'Veer Switchback', res: [/\bswitchback\b/i] },
  { family: 'Stokke YOYO', res: [/\byoyo/i] },
  { family: 'Joolz Aer', res: [/\baer\b/i] },
  { family: 'Joolz Hub', res: [/\bhub\b/i] },
];

type Args = { apply: boolean; dryRun: boolean; limit: number | null; file: string | null };
type ShopifyVariant = {
  id: number;
  title: string;
  sku?: string | null;
  available?: boolean;
  price?: string | null;
  compare_at_price?: string | null;
};
type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  body_html?: string | null;
  vendor?: string | null;
  product_type?: string | null;
  tags?: string[];
  variants?: ShopifyVariant[];
  images?: Array<{ src?: string | null; position?: number | null }>;
  collectionHandles?: string[];
};

type ExistingProduct = {
  id: string;
  provider?: string | null;
  brand: string | null;
  title: string;
  productType: string | null;
  canonicalBrand: string | null;
  canonicalName: string | null;
  strollerCategory: string | null;
};

type CanonicalEntity = {
  table: 'Stroller' | 'CarSeat';
  id: string;
  brand: string;
  model: string;
  productType: 'stroller' | 'infant car seat';
  strollerCategory: string | null;
};

type ProductKind = 'stroller' | 'infant car seat' | 'adapter';
type SkipReason =
  | 'skippedTravelSystems'
  | 'skippedStrollerAccessories'
  | 'skippedCarSeatAccessories'
  | 'skippedNonInfantCarSeats'
  | 'skippedReplacementParts'
  | 'skippedBundles'
  | 'skippedNurseryPackages'
  | 'skippedNotEligible';

type Decision =
  | {
      action: 'eligible';
      kind: ProductKind;
      productType: string;
      tmbcCategory: string;
      brand: string;
      model: string;
      strollerCategory: string | null;
      confidenceScore: number;
      needsReview: boolean;
      adapterParse?: AdapterParse;
    }
  | { action: 'skip'; reason: SkipReason; detail: string };

type AdapterParse = {
  adapterBrand: string;
  strollerFamilies: string[];
  infantSeatBrands: string[];
  infantSeatModels: string[];
  ambiguous: boolean;
};

type ImportCandidate = {
  product: ShopifyProduct;
  decision: Extract<Decision, { action: 'eligible' }>;
  url: string;
  sku: string | null;
  price: number | null;
  salePrice: number | null;
  compareAtPrice: number | null;
  image: string | null;
  availability: string;
  inStock: boolean;
  matchedExisting: ExistingProduct | CanonicalEntity | null;
  duplicateRisk: string[];
  manualReviewReasons: string[];
  createAllowed: boolean;
};

type ReportRow = {
  externalId: string;
  title: string;
  brand: string;
  model: string;
  kind: string;
  productType: string;
  strollerCategory: string | null;
  url: string;
  price: number | null;
  salePrice: number | null;
  availability: string;
  action: 'match-existing' | 'create-new' | 'manual-review' | 'skip';
  matched: string | null;
  reasons: string[];
  collections: string[];
  adapter?: AdapterParse;
};

type Report = {
  generatedAt: string;
  source: string;
  affiliateParam: string;
  totals: Record<string, number>;
  byCollection: Record<string, number>;
  rows: ReportRow[];
};

function loadDotEnv() {
  try {
    const text = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
    for (const line of text.split('\n')) {
      const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (!m) continue;
      let val = m[2];
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (process.env[m[1]] === undefined) process.env[m[1]] = val;
    }
  } catch {
    /* optional */
  }
}
loadDotEnv();

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get = (name: string) => {
    const exact = argv.indexOf(`--${name}`);
    if (exact >= 0) return argv[exact + 1];
    const hit = argv.find((a) => a.startsWith(`--${name}=`));
    return hit ? hit.slice(name.length + 3) : undefined;
  };
  const limitRaw = get('limit');
  return {
    apply: argv.includes('--apply'),
    dryRun: argv.includes('--dry-run') || !argv.includes('--apply'),
    limit: limitRaw ? Number.parseInt(limitRaw, 10) : null,
    file: get('file') ?? null,
  };
}

function normalizeText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[®™©]/g, '')
    .replace(/[’']/g, '')
    .replace(/&/g, ' and ')
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function displayBrand(value: string | null | undefined) {
  const raw = (value ?? '').trim();
  if (!raw) return 'Other';
  const fromKnown = KNOWN_BRANDS.find((b) => normalizeText(raw) === normalizeText(b));
  return canonicalBrand(fromKnown ?? raw.replace(/-/g, ' '));
}

function detectBrand(product: ShopifyProduct) {
  const titleNorm = normalizeText(product.title);
  if (/\bbob gear\b/i.test(product.title)) return 'BOB Gear';
  const fromTitle = KNOWN_BRANDS.find((b) => titleNorm.startsWith(normalizeText(b)));
  if (fromTitle) return displayBrand(fromTitle);
  const vendor = displayBrand(product.vendor);
  if (vendor && vendor !== 'Other') return vendor;
  return displayBrand(product.title.split(/\s+/)[0]);
}

function stripHtml(value: string | null | undefined) {
  return (value ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h2|h3)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePrice(value: string | number | null | undefined) {
  if (value == null) return null;
  const n = Number(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function addAffiliateParam(pathOrUrl: string) {
  const url = new URL(pathOrUrl, BASE_URL);
  url.searchParams.set(AFFILIATE_PARAM, AFFILIATE_VALUE);
  return url.toString();
}

function productUrl(product: ShopifyProduct) {
  return addAffiliateParam(`/products/${product.handle}`);
}

function collectionUrl(handle: string) {
  return addAffiliateParam(`/collections/${handle}`);
}

function bestVariant(product: ShopifyProduct) {
  const variants = product.variants ?? [];
  return variants.find((v) => v.available) ?? variants[0] ?? null;
}

function primaryImage(product: ShopifyProduct) {
  const images = [...(product.images ?? [])].sort((a, b) => (a.position ?? 99) - (b.position ?? 99));
  return images.find((i) => i.src)?.src ?? null;
}

function allText(product: ShopifyProduct) {
  return [
    product.title,
    product.vendor,
    product.product_type,
    ...(product.tags ?? []),
    stripHtml(product.body_html),
  ].join(' ');
}

function hasTag(product: ShopifyProduct, re: RegExp) {
  return (product.tags ?? []).some((tag) => re.test(tag));
}

function isPrimaryStroller(product: ShopifyProduct) {
  const title = product.title;
  const path = product.product_type ?? '';
  const tags = product.tags?.join(' ') ?? '';
  const text = `${title} ${path} ${tags}`;
  if (!/\b(stroller|strollers|wagon|cruiser)\b/i.test(text)) return false;
  if (/\bbaby stroller accessories\b/i.test(path)) return false;
  if (STROLLER_ACCESSORY_RE.test(title) && !/\bwith travel bag\b/i.test(title)) return false;
  return /baby strollers/i.test(path) || /\bstrollers?\b/i.test(title) || /\bwagon\b/i.test(title);
}

function isInfantSeat(product: ShopifyProduct) {
  const text = [product.title, product.product_type ?? '', ...(product.tags ?? [])].join(' ');
  const title = product.title;
  if (/\b(extra base|recline base|car seat base|base only|stay.?in.?car base)\b/i.test(title)) return false;
  if (/\b(bassinet|insert|inlay|sun ?shade|sunshade|body support)\b/i.test(title)) return false;
  if (/\bbase\b/i.test(title) && !isInfantSeatWithIncludedBase(title)) return false;
  if (/\b(convertible|all.?in.?one|booster)\s+(?:car\s*)?seats?\b/i.test(text)) return false;
  if (/\b(rotating|360|swivel)\s+(?:car\s*)?seats?\b/i.test(text) && !/\baton g2 swivel infant car seat\b/i.test(text)) {
    return false;
  }
  return (
    hasTag(product, /Category_Infant-Car-Seats/i) ||
    /\binfant car ?seats?\b/i.test(text) ||
    (INFANT_SEAT_MODEL_RE.test(text) && /\b(car ?seats?|baby transport)\b/i.test(text))
  );
}

function isInfantSeatWithIncludedBase(title: string) {
  return /\binfant car ?seat\b/i.test(title) && /(?:\+|&|\bwith\b)/i.test(title) && /\bbase\b/i.test(title);
}

function isAdapterCandidate(product: ShopifyProduct) {
  const title = product.title;
  const text = allText(product);
  if (!/\b(adapters?|adaptors?)\b/i.test(title)) return false;
  if (!/(car ?seat|infant|pipa|nuna|cybex|aton|cloud|maxi[\s-]?cosi|mico|clek|liing|chicco|keyfit|graco|snugride|peg[\s-]?perego|primo|mesa|aria|turtle|doona|britax|b-?safe|willow)/i.test(text)) {
    return false;
  }
  if (/\b(storage basket|cup ?holder|snack tray|rain cover|travel bag|mosquito|insect net|footmuff|organizer|mirror|seat protector)\b/i.test(product.title)) {
    return false;
  }
  return true;
}

function skipReason(product: ShopifyProduct): { reason: SkipReason; detail: string } | null {
  const title = product.title;
  const path = product.product_type ?? '';
  const text = [title, path, ...(product.tags ?? [])].join(' ');
  const adapterProtected = isAdapterCandidate(product) && !/\b(rumble ?seat|rumbleseat|second seat|sibling seat|toddler seat|basket|bassinet|stroller\s*\|)\b/i.test(title);

  for (const rule of EXCLUDED_REASON_RULES) {
    if (!rule.re.test(text)) continue;
    if (rule.reason === 'skippedStrollerAccessories' && (isPrimaryStroller(product) || adapterProtected)) continue;
    if (rule.reason === 'skippedCarSeatAccessories' && adapterProtected) continue;
    if (rule.reason === 'skippedCarSeatAccessories' && isInfantSeatWithIncludedBase(title)) continue;
    return { reason: rule.reason, detail: `Matched exclusion in "${title || path}"` };
  }
  return null;
}

function strollerProductType(product: ShopifyProduct) {
  const text = normalizeText([product.title, product.product_type ?? '', ...(product.tags ?? [])].join(' '));
  const title = normalizeText(product.title);
  const brand = normalizeText(product.vendor);

  if (/\b(wonderfold|stroller wagon|wagon|veer cruiser|larktale caravan|keenz|pivot xplore|radio flyer)\b/.test(title)) return 'wagon';
  if (/\b(donkey|kangaroo|vista|demi next|demi grow|e gazelle|egazelle|gazelle|wave|ypsi|agio z4|mockingbird single to double|pivot xpand|city select|single to double)\b/.test(title)) {
    return 'single-to-double stroller';
  }
  if (/\b(priam|e priam|epriam|mixx|cruz|fox|reef|xplory|joolz day|cove)\b/.test(title)) return 'full-size stroller';
  if (/\b(dragonfly|triv|triv next|dune|mios|joolz hub|swiv|electa|city mini air)\b/.test(title)) return 'compact stroller';
  if (/\b(duallie|urban glide\s+\d*\s*double|summit x3\s+double|alterrain duallie|double jogging)\b/.test(title)) return 'double jogging stroller';
  if (/\b(urban glide|bob revolution|alterrain|summit x3|guava roam|uppababy ridge|switch and jog|switch jog|wayfinder)\b/.test(title)) return 'jogging stroller';
  if (/\b(minu duo|trvl dubl|trvl double|jet lightweight double|jet double|double stroller|duo stroller|twin stroller|g link|snap duo|city mini gt2 double|city mini gt 2 double|city mini double|side by side)\b/.test(title)) {
    return 'double stroller';
  }
  if (/\b(city mini gt2|city mini gt 2|city mini gt3|city mini gt 3)\b/.test(title)) return 'compact stroller';
  if (/\b(g luxe|g lite|maclaren|3d lite|liteway|umbrella stroller)\b/.test(title)) return 'umbrella stroller';
  if (/\b(butterfly|trvl|minu|yoyo|yoyo3|yoyo 3|aer|aer2|jet|coya|libelle|beezy|quid|quid3|metro|orbit baby m\+|mima miro|city tour|clic|volo|dot|nia|breez)\b/.test(title)) {
    return 'travel stroller';
  }
  if (/\b(wonderfold|stroller wagon|wagon|veer cruiser|larktale caravan|keenz|pivot xplore|radio flyer)\b/.test(text)) return 'wagon';
  if (/\b(duallie|urban glide double|summit x3 double|alterrain duallie|double jogging)\b/.test(text)) return 'double jogging stroller';
  if (/\b(donkey|kangaroo|vista|demi next|demi grow|e gazelle|egazelle|gazelle|wave|ypsi|agio z4|mockingbird single to double|pivot xpand|city select)\b/.test(text)) {
    return 'single-to-double stroller';
  }
  if (/\b(urban glide|bob revolution|alterrain|summit x3|guava roam|uppababy ridge|switch and jog|switch jog)\b/.test(text)) return 'jogging stroller';
  if (/\b(minu duo|trvl dubl|trvl double|double stroller|twin stroller|g link|snap duo|city mini gt2 double|city mini double)\b/.test(text)) return 'double stroller';
  if (/\b(g luxe|g lite|maclaren|3d lite|liteway)\b/.test(text)) return 'umbrella stroller';
  if (/\b(butterfly|trvl|minu|yoyo|yoyo3|yoyo 3|aer|aer2|jet|coya|libelle|beezy|quid|quid3|metro|orbit baby m\+|mima miro|city tour|clic|volo|dot|nia|breez)\b/.test(text)) {
    return 'travel stroller';
  }
  if (/\b(dragonfly|triv|triv next|dune|mios|joolz hub|swiv|electa|city mini)\b/.test(text)) return 'compact stroller';
  if (/\bcompact stroller\b/.test(title) && /\b(overhead|airline|travel|cabin|lightweight)\b/.test(text)) return 'travel stroller';
  if (/\bcompact stroller\b/.test(title)) return 'compact stroller';
  if (brand === 'mima' && /\bmiro\b/.test(text)) return 'travel stroller';
  return 'full-size stroller';
}

function strollerCategory(productType: string) {
  switch (productType) {
    case 'full-size stroller':
      return 'Full-Size';
    case 'compact stroller':
      return 'Compact / Mid-Size';
    case 'travel stroller':
      return 'Travel';
    case 'umbrella stroller':
      return 'Umbrella';
    case 'single-to-double stroller':
      return 'Single-to-Double';
    case 'double stroller':
      return 'Double';
    case 'jogging stroller':
      return 'Jogging';
    case 'double jogging stroller':
      return 'Double Jogging';
    case 'wagon':
      return 'Stroller Wagon';
    default:
      return null;
  }
}

function inferExistingStrollerCategory(brand: string, model: string) {
  const productType = strollerProductType({
    id: 0,
    title: `${brand} ${model} Stroller`,
    handle: '',
    vendor: brand,
    product_type: 'Baby Strollers',
    tags: [],
  });
  return strollerCategory(productType);
}

function parseAdapter(product: ShopifyProduct, brand: string): AdapterParse {
  const text = allText(product);
  const strollerFamilies = new Set<string>();
  const infantSeatBrands = new Set<string>();
  const infantSeatModels = new Set<string>();

  for (const family of STROLLER_FAMILY_PATTERNS) {
    if (family.res.some((re) => re.test(text))) strollerFamilies.add(family.family);
  }
  for (const seatBrand of INFANT_SEAT_BRANDS) {
    const re = new RegExp(`\\b${seatBrand.replace(/[-\s]/g, '[-\\s]?')}\\b`, 'i');
    if (re.test(text)) infantSeatBrands.add(displayBrand(seatBrand));
  }
  const modelPatterns = [
    /\bpipa(?:\s+(?:lite|rx|lite rx|lite lx|lite r|aire|aire rx|urbn))?\b/gi,
    /\bmesa(?:\s+v\d)?\b/gi,
    /\baria\b/gi,
    /\bliing\b/gi,
    /\bcloud\s?[a-z0-9]+\b/gi,
    /\baton\s?[a-z0-9]*\b/gi,
    /\bkeyfit\s?\d*\b/gi,
    /\bsnugride\b/gi,
    /\bprimo viaggio\b/gi,
    /\bturtle(?: air| one)?\b/gi,
    /\bmico(?: max plus| max 30| luxe| xp| ap| nxt)?\b/gi,
    /\bwillow\b/gi,
    /\bdoona\b/gi,
  ];
  for (const re of modelPatterns) {
    for (const match of text.matchAll(re)) infantSeatModels.add(match[0].replace(/\s+/g, ' ').trim());
  }

  return {
    adapterBrand: brand,
    strollerFamilies: [...strollerFamilies].sort(),
    infantSeatBrands: [...infantSeatBrands].sort(),
    infantSeatModels: [...infantSeatModels].sort(),
    ambiguous: strollerFamilies.size === 0 || infantSeatBrands.size === 0,
  };
}

function infantSeatDecision(product: ShopifyProduct, rawBrand: string): Extract<Decision, { action: 'eligible' }> {
  const brand = displayBrand(rawBrand);
  return {
    action: 'eligible',
    kind: 'infant car seat',
    productType: 'infant car seat',
    tmbcCategory: 'Car Seats',
    brand,
    model: parseCarSeatModel(product.title, brand),
    strollerCategory: null,
    confidenceScore: 0.86,
    needsReview: false,
  };
}

function decide(product: ShopifyProduct): Decision {
  const excluded = skipReason(product);
  if (excluded) return { action: 'skip', ...excluded };

  const rawBrand = detectBrand(product);
  const text = allText(product);

  if (isAdapterCandidate(product)) {
    const adapter = parseAdapter(product, displayBrand(rawBrand));
    return {
      action: 'eligible',
      kind: 'adapter',
      productType: 'stroller adapter',
      tmbcCategory: 'Travel Systems & Adapters',
      brand: displayBrand(rawBrand),
      model: product.title,
      strollerCategory: null,
      confidenceScore: adapter.ambiguous ? 0.62 : 0.82,
      needsReview: adapter.ambiguous,
      adapterParse: adapter,
    };
  }

  if (/\binfant car ?seat\b/i.test(product.title) && isInfantSeat(product)) {
    return infantSeatDecision(product, rawBrand);
  }

  if (isPrimaryStroller(product)) {
    const brand = canonicalStrollerBrand(rawBrand);
    const productType = strollerProductType(product);
    return {
      action: 'eligible',
      kind: 'stroller',
      productType,
      tmbcCategory: 'Strollers',
      brand,
      model: parseStrollerModel(product.title, rawBrand || brand),
      strollerCategory: strollerCategory(productType),
      confidenceScore: 0.86,
      needsReview: false,
    };
  }

  if (isInfantSeat(product)) {
    return infantSeatDecision(product, rawBrand);
  }

  if (/\bcar ?seats?\b/i.test(text)) {
    return { action: 'skip', reason: 'skippedNonInfantCarSeats', detail: 'Car seat was not a true infant car seat' };
  }
  if (/\bstroller|wagon|adapter|adaptor\b/i.test(text)) {
    return { action: 'skip', reason: 'skippedStrollerAccessories', detail: 'Stroller-related item was not a primary stroller or clear car-seat adapter' };
  }
  return { action: 'skip', reason: 'skippedNotEligible', detail: 'Not a stroller, infant car seat, or stroller/car-seat adapter' };
}

function modelKey(brand: string, model: string, kind: ProductKind, strollerCat: string | null) {
  const nBrand = normalizeText(brand);
  let m = normalizeText(model)
    .replace(/\b(stroller|infant car seat|car seat|lightweight|luxury|complete|with|and|the)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  for (const color of COLOR_WORDS) {
    const c = normalizeText(color);
    m = m.replace(new RegExp(`\\b${c}\\b`, 'g'), ' ');
  }
  m = m.replace(/\s+/g, ' ').trim();

  const versionMarkers = VERSION_TERMS.filter((term) => {
    if (term === '+') return model.includes('+');
    return new RegExp(`\\b${term}\\b`, 'i').test(model);
  }).sort();
  const eModel = /\be[-\s]?(priam|gazelle)\b/i.exec(model)?.[1] ?? null;
  const generation = [...model.matchAll(/\b(?:fox|donkey|vista|cruz|minu|jet|wave|reef|dune|yoyo)\s*(\d+)\b/gi)]
    .map((m2) => m2[0].toLowerCase())
    .sort();

  return [kind, nBrand, m, strollerCat ?? '', eModel ? `e-${eModel.toLowerCase()}` : '', ...versionMarkers, ...generation]
    .filter(Boolean)
    .join('|');
}

function matchExisting(
  candidate: Extract<Decision, { action: 'eligible' }>,
  existing: ExistingProduct[],
  entities: CanonicalEntity[],
) {
  if (candidate.kind === 'adapter') return null;
  const key = modelKey(candidate.brand, candidate.model, candidate.kind, candidate.strollerCategory);
  const catalogMatch = existing.find((row) => {
    const rowKind = row.productType === 'infant car seat' ? 'infant car seat' : row.productType?.includes('stroller') || row.productType === 'wagon' ? 'stroller' : null;
    if (rowKind !== candidate.kind) return false;
    return (
      modelKey(
        row.canonicalBrand ?? row.brand ?? '',
        row.canonicalName ?? row.title,
        rowKind,
        row.strollerCategory,
      ) === key
    );
  });
  if (catalogMatch) return catalogMatch;

  return entities.find(
    (row) =>
      row.productType === candidate.kind &&
      modelKey(row.brand, row.model, candidate.kind, row.strollerCategory) === key,
  ) ?? null;
}

function duplicateRisks(candidate: Extract<Decision, { action: 'eligible' }>, existing: ExistingProduct[], entities: CanonicalEntity[]) {
  if (candidate.kind === 'adapter') return [];
  const base = normalizeText(candidate.model).replace(/\b(v\d+|next|lx|rx|aire|air|max|plus|duo|twin|mono)\b/g, '').trim();
  if (base.length < 4) return [];
  const sameBrandRows = [
    ...existing.map((row) => ({
      label: `${row.canonicalBrand ?? row.brand} ${row.canonicalName ?? row.title}`,
      kind: row.productType === 'infant car seat' ? 'infant car seat' : row.productType?.includes('stroller') || row.productType === 'wagon' ? 'stroller' : null,
      brand: normalizeText(row.canonicalBrand ?? row.brand),
      model: normalizeText(row.canonicalName ?? row.title),
    })),
    ...entities.map((row) => ({
      label: `${row.brand} ${row.model}`,
      kind: row.productType,
      brand: normalizeText(row.brand),
      model: normalizeText(row.model),
    })),
  ];
  return sameBrandRows
    .filter((row) => row.kind === candidate.kind && row.brand === normalizeText(candidate.brand))
    .filter((row) => row.model.includes(base) || base.includes(row.model))
    .map((row) => row.label)
    .slice(0, 8);
}

function csvEscape(value: unknown) {
  const s = value == null ? '' : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function writeReports(report: Report) {
  mkdirSync(resolve(process.cwd(), 'reports'), { recursive: true });
  writeFileSync(resolve(process.cwd(), REPORT_JSON), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  const header = [
    'externalId',
    'title',
    'brand',
    'model',
    'kind',
    'productType',
    'strollerCategory',
    'url',
    'price',
    'salePrice',
    'availability',
    'action',
    'matched',
    'reasons',
    'collections',
  ];
  const lines = [
    header.join(','),
    ...report.rows.map((row) =>
      [
        row.externalId,
        row.title,
        row.brand,
        row.model,
        row.kind,
        row.productType,
        row.strollerCategory,
        row.url,
        row.price,
        row.salePrice,
        row.availability,
        row.action,
        row.matched,
        row.reasons.join('; '),
        row.collections.join('; '),
      ]
        .map(csvEscape)
        .join(','),
    ),
  ];
  writeFileSync(resolve(process.cwd(), REPORT_CSV), `${lines.join('\n')}\n`, 'utf8');
}

function feedHash(product: ShopifyProduct, url: string, price: number | null, image: string | null) {
  return crypto
    .createHash('sha1')
    .update([product.title, product.vendor, product.product_type, price, image, url, bestVariant(product)?.available].join('|'))
    .digest('hex');
}

async function fetchCollection(handle: string): Promise<ShopifyProduct[]> {
  const products: ShopifyProduct[] = [];
  for (let page = 1; page <= 100; page += 1) {
    const url = `${BASE_URL}/collections/${handle}/products.json?limit=250&page=${page}`;
    const data = await getJson<{ products?: ShopifyProduct[] }>(url, handle);
    const pageProducts = data.products ?? [];
    if (pageProducts.length === 0) break;
    products.push(...pageProducts.map((p) => ({ ...p, collectionHandles: [handle] })));
    if (pageProducts.length < 250) break;
  }
  return products;
}

function getJson<T>(url: string, label: string, redirectCount = 0): Promise<T> {
  return new Promise((resolveJson, reject) => {
    const req = https.get(
      url,
      { headers: { 'User-Agent': 'TMBC-catalog-import/1.0', Accept: 'application/json' } },
      (res) => {
        const status = res.statusCode ?? 0;
        const location = res.headers.location;
        if (status >= 300 && status < 400 && location && redirectCount < 5) {
          res.resume();
          getJson<T>(new URL(location, url).toString(), label, redirectCount + 1).then(resolveJson, reject);
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf8');
          if (status < 200 || status >= 300) {
            reject(new Error(`MacroBaby ${label} ${status}: ${body.slice(0, 300)}`));
            return;
          }
          try {
            resolveJson(JSON.parse(body) as T);
          } catch (error) {
            reject(new Error(`MacroBaby ${label} returned invalid JSON: ${error instanceof Error ? error.message : error}`));
          }
        });
      },
    );
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy(new Error(`MacroBaby ${label} request timed out`));
    });
  });
}

async function loadProducts(args: Args): Promise<{ products: ShopifyProduct[]; byCollection: Record<string, number> }> {
  if (args.file) {
    const parsed = JSON.parse(readFileSync(resolve(process.cwd(), args.file), 'utf8')) as { products?: ShopifyProduct[] } | ShopifyProduct[];
    const products = Array.isArray(parsed) ? parsed : parsed.products ?? [];
    return { products: args.limit ? products.slice(0, args.limit) : products, byCollection: { file: products.length } };
  }

  const byId = new Map<number, ShopifyProduct>();
  const byCollection: Record<string, number> = {};
  for (const collection of COLLECTIONS) {
    const items = await fetchCollection(collection.handle);
    byCollection[collection.handle] = items.length;
    for (const item of items) {
      const existing = byId.get(item.id);
      if (existing) {
        existing.collectionHandles = [...new Set([...(existing.collectionHandles ?? []), collection.handle])];
      } else {
        byId.set(item.id, item);
      }
    }
  }

  const products = [...byId.values()];
  return { products: args.limit ? products.slice(0, args.limit) : products, byCollection };
}

async function loadExisting(): Promise<{ existing: ExistingProduct[]; entities: CanonicalEntity[] }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = ((await import('@/lib/server/prisma')).default) as any;
  const hasAffiliateCatalog = await db
    .$queryRawUnsafe("SELECT to_regclass('public.\"AffiliateCatalogProduct\"')::text AS exists")
    .then((rows: Array<{ exists: string | null }>) => Boolean(rows[0]?.exists))
    .catch(() => false);
  const catalogPromise = hasAffiliateCatalog
    ? db.affiliateCatalogProduct.findMany({
        where: {
          provider: { not: PROVIDER },
          isActiveInFeed: true,
          enrichment: {
            is: {
              reviewStatus: { not: 'HIDDEN' },
              OR: [
                { tmbcCategory: 'Strollers' },
                { productType: 'infant car seat' },
                { productType: 'stroller adapter' },
                { productType: 'infant car seat adapter' },
              ],
            },
          },
        },
        select: {
          id: true,
          provider: true,
          brand: true,
          title: true,
          enrichment: {
            select: {
              productType: true,
              canonicalBrand: true,
              canonicalName: true,
            },
          },
        },
      })
    : Promise.resolve([]);

  const [catalogRows, strollers, carSeats] = await Promise.all([
    catalogPromise,
    db.stroller.findMany({ select: { id: true, brand: true, model: true } }).catch(() => []),
    db.carSeat.findMany({ where: { seatType: 'INFANT' }, select: { id: true, brand: true, model: true } }).catch(() => []),
  ]);

  const existing: ExistingProduct[] = catalogRows.map((row: any) => {
    const pt = row.enrichment?.productType ?? null;
    return {
      id: row.id,
      provider: row.provider,
      brand: row.brand,
      title: row.title,
      productType: pt,
      canonicalBrand: row.enrichment?.canonicalBrand ?? null,
      canonicalName: row.enrichment?.canonicalName ?? null,
      strollerCategory: pt ? strollerCategory(pt) : null,
    };
  });
  const entities: CanonicalEntity[] = [
    ...strollers.map((row: any) => ({
      table: 'Stroller' as const,
      id: row.id,
      brand: row.brand,
      model: row.model,
      productType: 'stroller' as const,
      strollerCategory: inferExistingStrollerCategory(row.brand, row.model),
    })),
    ...carSeats.map((row: any) => ({
      table: 'CarSeat' as const,
      id: row.id,
      brand: row.brand,
      model: row.model,
      productType: 'infant car seat' as const,
      strollerCategory: null,
    })),
  ];
  return { existing, entities };
}

function buildCandidates(products: ShopifyProduct[], existing: ExistingProduct[], entities: CanonicalEntity[]) {
  const candidates: ImportCandidate[] = [];
  const rows: ReportRow[] = [];
  const totals: Record<string, number> = {
    totalMacroBabyProductsScanned: products.length,
    eligibleStrollers: 0,
    eligibleInfantCarSeats: 0,
    eligibleAdapters: 0,
    skippedTravelSystems: 0,
    skippedStrollerAccessories: 0,
    skippedCarSeatAccessories: 0,
    skippedNonInfantCarSeats: 0,
    skippedReplacementParts: 0,
    skippedBundles: 0,
    skippedNurseryPackages: 0,
    skippedNotEligible: 0,
    matchedExistingProducts: 0,
    newlyCreatedProducts: 0,
    manualReviewItems: 0,
    duplicateRiskItems: 0,
    adaptersParsed: 0,
    adaptersFlaggedAmbiguous: 0,
  };

  for (const product of products) {
    const decision = decide(product);
    const externalId = String(product.id);
    const collections = product.collectionHandles ?? [];

    if (decision.action === 'skip') {
      totals[decision.reason] = (totals[decision.reason] ?? 0) + 1;
      rows.push({
        externalId,
        title: product.title,
        brand: detectBrand(product),
        model: '',
        kind: '',
        productType: '',
        strollerCategory: null,
        url: productUrl(product),
        price: null,
        salePrice: null,
        availability: '',
        action: 'skip',
        matched: null,
        reasons: [decision.detail],
        collections,
      });
      continue;
    }

    if (decision.kind === 'stroller') totals.eligibleStrollers += 1;
    if (decision.kind === 'infant car seat') totals.eligibleInfantCarSeats += 1;
    if (decision.kind === 'adapter') {
      totals.eligibleAdapters += 1;
      totals.adaptersParsed += 1;
      if (decision.adapterParse?.ambiguous) totals.adaptersFlaggedAmbiguous += 1;
    }

    const variant = bestVariant(product);
    const currentPrice = parsePrice(variant?.price);
    const compareAtPrice = parsePrice(variant?.compare_at_price);
    const salePrice = compareAtPrice != null && currentPrice != null && compareAtPrice > currentPrice ? currentPrice : null;
    const url = productUrl(product);
    const image = primaryImage(product);
    const matchedExisting = matchExisting(decision, existing, entities);
    const risks = duplicateRisks(decision, existing, entities);
    const manualReviewReasons = [
      ...(decision.needsReview ? ['low-confidence categorization or ambiguous adapter'] : []),
      ...(!matchedExisting && decision.kind !== 'adapter' && risks.length > 0 ? ['similar existing product/version requires review'] : []),
    ];
    const createAllowed = Boolean(matchedExisting) || (manualReviewReasons.length === 0 && decision.confidenceScore >= 0.82);

    if (matchedExisting) totals.matchedExistingProducts += 1;
    else if (createAllowed) totals.newlyCreatedProducts += 1;
    else totals.manualReviewItems += 1;
    if (risks.length > 0) totals.duplicateRiskItems += 1;

    const candidate: ImportCandidate = {
      product,
      decision,
      url,
      sku: variant?.sku ?? null,
      price: currentPrice,
      salePrice,
      compareAtPrice,
      image,
      availability: variant?.available ? 'in stock' : 'out of stock',
      inStock: Boolean(variant?.available),
      matchedExisting,
      duplicateRisk: risks,
      manualReviewReasons,
      createAllowed,
    };
    candidates.push(candidate);

    rows.push({
      externalId,
      title: product.title,
      brand: decision.brand,
      model: decision.model,
      kind: decision.kind,
      productType: decision.productType,
      strollerCategory: decision.strollerCategory,
      url,
      price: currentPrice,
      salePrice,
      availability: candidate.availability,
      action: matchedExisting ? 'match-existing' : createAllowed ? 'create-new' : 'manual-review',
      matched: matchedExisting
        ? 'table' in matchedExisting
          ? `${matchedExisting.table}:${matchedExisting.brand} ${matchedExisting.model}`
          : `${matchedExisting.provider}:${matchedExisting.canonicalBrand ?? matchedExisting.brand} ${matchedExisting.canonicalName ?? matchedExisting.title}`
        : null,
      reasons: [...manualReviewReasons, ...risks.map((risk) => `duplicate risk: ${risk}`)],
      collections,
      adapter: decision.adapterParse,
    });
  }

  return { candidates, rows, totals };
}

async function applyCandidates(candidates: ImportCandidate[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = ((await import('@/lib/server/prisma')).default) as any;
  const runStart = new Date();
  let created = 0;
  let updated = 0;
  let enriched = 0;
  let skippedManualReview = 0;
  let skippedReviewed = 0;
  let errors = 0;

  for (const c of candidates) {
    if (!c.createAllowed) {
      skippedManualReview += 1;
      continue;
    }
    const product = c.product;
    const externalId = String(product.id);
    const raw = {
      provider: PROVIDER,
      catalogId: 'macrobaby-shopify',
      externalId,
      sku: c.sku,
      brand: c.decision.brand || null,
      title: product.title,
      description: stripHtml(product.body_html) || null,
      rawCategory: null,
      productTypePath: product.product_type ?? null,
      price: c.price,
      salePrice: c.salePrice,
      currency: 'USD',
      imageUrl: c.image,
      productUrl: c.url,
      affiliateUrl: c.url,
      availability: c.availability,
      inStock: c.inStock,
      itemGroupId: String(product.id),
      color: null,
      material: null,
      size: null,
      gender: null,
      ageGroup: null,
      retailer: RETAILER,
      rawPayload: {
        ...product,
        tmbcMacroBaby: {
          sourceCollections: product.collectionHandles ?? [],
          affiliateCollectionUrls: (product.collectionHandles ?? []).map(collectionUrl),
          compareAtPrice: c.compareAtPrice,
          matchedExisting: c.matchedExisting,
          duplicateRisk: c.duplicateRisk,
          adapterParse: c.decision.adapterParse,
        },
      },
      feedHash: feedHash(product, c.url, c.price, c.image),
      lastSyncedAt: runStart,
    };

    try {
      const existing = await db.affiliateCatalogProduct.findUnique({
        where: { provider_externalId: { provider: PROVIDER, externalId } },
        select: { id: true, feedHash: true },
      });

      let productId: string;
      if (!existing) {
        const row = await db.affiliateCatalogProduct.create({
          data: { ...raw, firstSeenAt: runStart, isActiveInFeed: true, lastChangedAt: runStart },
          select: { id: true },
        });
        productId = row.id;
        created += 1;
      } else {
        const changed = existing.feedHash !== raw.feedHash;
        await db.affiliateCatalogProduct.update({
          where: { id: existing.id },
          data: { ...raw, isActiveInFeed: true, ...(changed ? { lastChangedAt: runStart } : {}) },
        });
        productId = existing.id;
        updated += 1;
      }

      const enr = await db.productEnrichment.findUnique({
        where: { rawProductId: productId },
        select: { id: true, reviewStatus: true },
      });
      const needsReview = c.decision.needsReview;
      const autoStatus = needsReview ? 'NEEDS_REVIEW' : 'AUTO_CATEGORIZED';
      const parentJourney = CATEGORY_TO_JOURNEY[c.decision.tmbcCategory] ?? null;
      const tags = [
        c.decision.tmbcCategory,
        c.decision.productType,
        c.decision.strollerCategory,
        RETAILER,
      ]
        .filter((v): v is string => Boolean(v))
        .map((v) => normalizeText(v).replace(/\s+/g, '-'));

      if (!enr) {
        await db.productEnrichment.create({
          data: {
            rawProductId: productId,
            canonicalBrand: c.decision.brand,
            canonicalName: c.decision.model || product.title,
            tmbcCategory: c.decision.tmbcCategory,
            productType: c.decision.productType,
            parentJourney,
            tags,
            confidenceScore: c.decision.confidenceScore,
            needsReview,
            reviewStatus: autoStatus,
          },
        });
        enriched += 1;
      } else if (enr.reviewStatus === 'AUTO_CATEGORIZED' || enr.reviewStatus === 'NEEDS_REVIEW') {
        await db.productEnrichment.update({
          where: { id: enr.id },
          data: {
            canonicalBrand: c.decision.brand,
            canonicalName: c.decision.model || product.title,
            tmbcCategory: c.decision.tmbcCategory,
            productType: c.decision.productType,
            parentJourney,
            tags,
            confidenceScore: c.decision.confidenceScore,
            needsReview,
            reviewStatus: autoStatus,
          },
        });
        enriched += 1;
      } else {
        skippedReviewed += 1;
      }
    } catch (error) {
      errors += 1;
      console.error(`[macrobaby] ${externalId}:`, error instanceof Error ? error.message : error);
    }
  }

  const inactive = await db.affiliateCatalogProduct.updateMany({
    where: { provider: PROVIDER, lastSyncedAt: { lt: runStart }, isActiveInFeed: true },
    data: { isActiveInFeed: false },
  });

  await db.$disconnect?.();
  return { created, updated, enriched, skippedManualReview, skippedReviewed, errors, deactivated: inactive.count };
}

async function main() {
  const args = parseArgs();
  console.log('── MacroBaby catalog import ──');
  console.log(`  mode: ${args.apply ? 'apply' : 'dry run'}`);
  console.log(`  affiliate parameter: ?${AFFILIATE_PARAM}=${AFFILIATE_VALUE}`);

  const { products, byCollection } = await loadProducts(args);
  const { existing, entities } = await loadExisting();
  const { candidates, rows, totals } = buildCandidates(products, existing, entities);

  const report: Report = {
    generatedAt: new Date().toISOString(),
    source: COLLECTIONS.map((c) => collectionUrl(c.handle)).join(', '),
    affiliateParam: `?${AFFILIATE_PARAM}=${AFFILIATE_VALUE}`,
    totals,
    byCollection,
    rows,
  };
  writeReports(report);

  console.log(`  total MacroBaby products scanned: ${totals.totalMacroBabyProductsScanned}`);
  console.log(`  eligible strollers:              ${totals.eligibleStrollers}`);
  console.log(`  eligible infant car seats:       ${totals.eligibleInfantCarSeats}`);
  console.log(`  eligible adapters:               ${totals.eligibleAdapters}`);
  console.log(`  matched existing products:       ${totals.matchedExistingProducts}`);
  console.log(`  new products high confidence:    ${totals.newlyCreatedProducts}`);
  console.log(`  manual review items:             ${totals.manualReviewItems}`);
  console.log(`  duplicate-risk items:            ${totals.duplicateRiskItems}`);
  console.log(`  adapters parsed / ambiguous:     ${totals.adaptersParsed} / ${totals.adaptersFlaggedAmbiguous}`);
  console.log(`  reports:                         ${REPORT_JSON}, ${REPORT_CSV}`);

  console.log('\n  skips:');
  for (const key of [
    'skippedTravelSystems',
    'skippedStrollerAccessories',
    'skippedCarSeatAccessories',
    'skippedNonInfantCarSeats',
    'skippedBundles',
    'skippedReplacementParts',
    'skippedNurseryPackages',
    'skippedNotEligible',
  ]) {
    console.log(`    ${key}: ${totals[key] ?? 0}`);
  }

  console.log('\n  eligible sample:');
  rows
    .filter((row) => row.action !== 'skip')
    .slice(0, 20)
    .forEach((row) => console.log(`    [${row.action}] ${row.kind} · ${row.brand} ${row.model}`.slice(0, 110)));

  if (!args.apply) {
    console.log('\n  (dry run only — no database writes.)');
    return;
  }

  const result = await applyCandidates(candidates);
  console.log(
    `\n  created ${result.created} · updated ${result.updated} · enriched ${result.enriched} · manual-review skipped ${result.skippedManualReview} · skipped(reviewed) ${result.skippedReviewed} · errors ${result.errors} · deactivated ${result.deactivated}`,
  );
}

main().catch((error) => {
  console.error('[importMacroBabyCatalog] failed:', error);
  process.exit(1);
});
