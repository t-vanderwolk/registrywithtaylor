import { canonicalBrand } from '@/lib/catalog/brandAliases';

const EXCLUDED_STROLLER_BRAND_KEYS = new Set([
  '7am enfant',
  'baby',
  'baby delight swerve',
  'babyfrrr',
  'bright',
  'comfy',
  'contours',
  'cool',
  'crane',
  'crane baby',
  'diono',
  'disney',
  'erommy',
  'evolur',
  'garvee',
  'gladly',
  'infans',
  'jl',
  'jl childress',
  'kolcraft',
  'lillebaby',
  'maclaren',
  'mamazing',
  'mentari',
  'parents',
  'smartrike',
  'the puppet company',
  'ternx',
  'tiny love',
]);

const EXCLUDED_STROLLER_PRODUCT_RULES: Array<{ brandKey: string; title: RegExp }> = [
  { brandKey: 'baby delight', title: /\bswerve\b/i },
  { brandKey: 'nuna', title: /\bbmw\b/i },
];

const STROLLER_PRODUCT_NOISE_RE =
  /travel system|\bsnap-?n-?go\b|car ?seat carrier|\bmagnetic buckles?\b|\bbassinet\b|\bcot\b|\badapters?\b|footboard|conversion kit|\b(?:stroller|seat|car seat)\s+frame\b|\bframe\s+(?:stroller|only)\b|\bchassis\s+(?:only|replacement)\b|\bstroller\s+chassis\b|\bboard\b|transport bag|\bbag\b|organizer|organi[sz]er|snack tray|\btray\b|rain cover|rain shield|weather shield|sun ?shade|\bcanopy\b|parasol|cup ?holder|seat liner|second seat|sibling seat|rumble ?seat|seat unit|toddler seat|stroller seat|\b(?:front|rear|replacement|spare)\s+(?:wheel|tire)s?\b|\b(?:wheel|tire)s?\s+(?:replacement|set|kit|assembly)\b|inner tube|\bbasket\b|\bcaddy\b|footmuff|\bcover\b|bumper bar|belly bar|ride[- ]?along|glider board|piggy ?back|replacement|\bstand\b|console|\bhook\b|cage|mosquito|\bnet\b|\bbundle\b/i;

function brandKey(value: string | null | undefined) {
  return (value || 'Other')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function canonicalStrollerBrand(brand: string | null | undefined): string {
  const canonical = canonicalBrand(brand);
  switch (brandKey(canonical)) {
    case 'bob':
    case 'bob gear':
      return 'BOB';
    case 'phil':
    case 'phil teds':
    case 'phil and teds':
      return 'Phil & Teds';
    case 'safety':
    case 'safety 1st':
    case 'safety first':
      return 'Safety 1st';
    case 'summer':
    case 'summer infant':
      return 'Ingenuity';
    case 'babyzen':
    case 'stokke yoyo':
      return 'Stokke';
    case 'wonderfold':
    case 'wonderfold wagon':
      return 'WonderFold';
    default:
      return canonical;
  }
}

export function isExcludedStrollerFinderBrand(brand: string | null | undefined) {
  return EXCLUDED_STROLLER_BRAND_KEYS.has(brandKey(brand));
}

export function isExcludedStrollerFinderProduct({
  brand,
  title,
}: {
  brand: string | null | undefined;
  title: string;
  productUrl?: string | null | undefined;
  affiliateUrl?: string | null | undefined;
}) {
  const rawBrandKey = brandKey(brand);
  const canonicalBrandKey = brandKey(canonicalStrollerBrand(brand));
  const searchableText = title;

  if (
    isExcludedStrollerFinderBrand(brand) ||
    isExcludedStrollerFinderBrand(canonicalStrollerBrand(brand))
  ) {
    return true;
  }

  if (STROLLER_PRODUCT_NOISE_RE.test(searchableText)) {
    return true;
  }

  return EXCLUDED_STROLLER_PRODUCT_RULES.some(
    (rule) =>
      (rule.brandKey === rawBrandKey || rule.brandKey === canonicalBrandKey) &&
      rule.title.test(title),
  );
}
