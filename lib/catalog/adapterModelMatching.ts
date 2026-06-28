const GENERIC_MODEL_WORDS = /\b(all terrain|stroller|complete|seat)\b/g;
const DISTINGUISHING_TOKEN_RE = /^(?:v?\d+|g\d+|gt\d+|x\d+|lx|rx|aire|air|max|plus|duo|twin|mono|double|xl|flex|primo|nxt)$/i;
const STRICT_DISTINGUISHING_TOKEN_RE = DISTINGUISHING_TOKEN_RE;
const GENERIC_SINGLE_TOKEN_RE = /^(?:single|double)$/i;

const KNOWN_STROLLER_BRANDS = [
  'Agio',
  'Baby Jogger',
  'Baby Trend',
  'Babyzen',
  'Bellini',
  'BOB',
  'BOB Gear',
  'Britax',
  'Bugaboo',
  'Bumbleride',
  'Chicco',
  'Colugo',
  'Cybex',
  'Delta Children',
  'DFY',
  'Doona',
  'Ergobaby',
  'Evenflo',
  'Graco',
  'Guava Family',
  'Inglesina',
  'Joolz',
  'Joie',
  'Larktale',
  'Maxi-Cosi',
  'Mima',
  'Mockingbird',
  'Mompush',
  'Mountain Buggy',
  'Nuna',
  'Orbit Baby',
  'Peg Perego',
  'Radio Flyer',
  'Romer',
  'Safety 1st',
  'Silver Cross',
  'Stokke',
  'Thule',
  'UPPAbaby',
  'Valco Baby',
  'Veer',
  'WonderFold',
  'Zoe',
];

function normalizeText(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[®™©]/g, '')
    .replace(/[’']/g, '')
    .replace(/\+/g, ' plus ')
    .replace(/&/g, ' and ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(value: string) {
  return normalizeText(value).split(' ').filter(Boolean);
}

function canonicalBrandKey(value: string) {
  const normalized = normalizeText(value);
  if (normalized === 'bob gear') return 'bob';
  if (normalized === 'cybex') return 'cybex';
  return normalized;
}

function titleIncludesPhrase(titleTokens: string[], phrase: string) {
  const phraseTokens = tokens(phrase);
  return phraseTokens.length > 0 && contiguousIndex(titleTokens, phraseTokens) >= 0;
}

function strollerBrandsInTitle(title: string) {
  const titleTokens = tokens(title);
  const brands = new Set<string>();
  for (const brand of KNOWN_STROLLER_BRANDS) {
    if (titleIncludesPhrase(titleTokens, brand)) brands.add(canonicalBrandKey(brand));
  }
  return brands;
}

function isSignalPhrase(phraseTokens: string[]) {
  if (phraseTokens.length >= 2) return true;
  const [token] = phraseTokens;
  if (!token || GENERIC_SINGLE_TOKEN_RE.test(token)) return false;
  return Boolean(token && (token.length >= 3 || /\d/.test(token)));
}

function stripGenericModelWords(value: string) {
  return normalizeText(value)
    .replace(GENERIC_MODEL_WORDS, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function contiguousIndex(haystack: string[], needle: string[]) {
  if (!needle.length || needle.length > haystack.length) return -1;
  for (let i = 0; i <= haystack.length - needle.length; i += 1) {
    let matches = true;
    for (let j = 0; j < needle.length; j += 1) {
      if (haystack[i + j] !== needle[j]) {
        matches = false;
        break;
      }
    }
    if (matches) return i;
  }
  return -1;
}

function phraseMatchesTitle(titleTokens: string[], phrase: string, fullModel: string) {
  const phraseTokens = tokens(phrase);
  if (!isSignalPhrase(phraseTokens)) return false;

  const index = contiguousIndex(titleTokens, phraseTokens);
  if (index < 0) return false;

  const nextTitleToken = titleTokens[index + phraseTokens.length];
  const fullModelTokens = tokens(fullModel);
  const nextModelToken = fullModelTokens[phraseTokens.length];

  // Do not let "Butterfly" match "Butterfly 2", "Minu" match "Minu Duo",
  // or "City Mini" match "City Mini GT2". Those are different model/version
  // signals, even though the base words overlap.
  if (
    nextTitleToken &&
    DISTINGUISHING_TOKEN_RE.test(nextTitleToken) &&
    nextTitleToken !== nextModelToken
  ) {
    return false;
  }

  if (
    nextModelToken &&
    STRICT_DISTINGUISHING_TOKEN_RE.test(nextModelToken) &&
    nextTitleToken !== nextModelToken
  ) {
    return false;
  }

  return true;
}

export type AdapterModelMatch = {
  matched: boolean;
  matchedModel: string | null;
  matchKind: 'full' | 'core' | null;
};

export function adapterTitleMatchesStrollerModel(
  title: string,
  strollerModel: string,
  strollerBrand?: string | null,
): AdapterModelMatch {
  if (strollerBrand) {
    const brandsInTitle = strollerBrandsInTitle(title);
    const strollerBrandKey = canonicalBrandKey(strollerBrand);
    if (brandsInTitle.size > 0 && !brandsInTitle.has(strollerBrandKey)) {
      return { matched: false, matchedModel: null, matchKind: null };
    }
  }

  const titleTokens = tokens(title);
  const full = normalizeText(strollerModel);
  const core = stripGenericModelWords(strollerModel);
  const candidates = unique([full, core]);

  for (const candidate of candidates) {
    if (!phraseMatchesTitle(titleTokens, candidate, core)) continue;
    return {
      matched: true,
      matchedModel: candidate,
      matchKind: candidate === full ? 'full' : 'core',
    };
  }

  return { matched: false, matchedModel: null, matchKind: null };
}
