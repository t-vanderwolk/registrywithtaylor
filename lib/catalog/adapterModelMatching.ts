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

// Trailing seat-count descriptors that sit on the SAME chassis and therefore
// share the same infant-seat adapter: "Summit X3 Single/Double", "City Tour 2
// Double", "Minu Duo Side by Side Double". We strip these from the END only, so
// the model still matches an adapter titled for the base model. We deliberately
// do NOT strip "twin"/"duo"/"mono" — those denote a distinct side-by-side frame
// with its own adapter (Indie vs Indie Twin), and the version guard in
// phraseMatchesTitle keeps them apart.
const TRAILING_CONFIG_TOKENS = new Set(['single', 'double', 'side', 'by']);

function stripTrailingConfig(value: string) {
  const parts = normalizeText(value).split(' ').filter(Boolean);
  while (parts.length > 1 && TRAILING_CONFIG_TOKENS.has(parts[parts.length - 1])) {
    parts.pop();
  }
  return parts.join(' ');
}

// A shortened candidate is only trustworthy if it still carries a real signal:
// two or more tokens, or a token with a digit (e.g. "summit x3", "city mini
// gt3", "minu duo"). A bare single word like "lithe" is too loose to match on.
function isTrustworthyShortCandidate(phrase: string) {
  const parts = phrase.split(' ').filter(Boolean);
  return parts.length >= 2 || /\d/.test(phrase);
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
  const titleTokens = tokens(title);

  if (strollerBrand) {
    const brandsInTitle = strollerBrandsInTitle(title);
    const strollerBrandKey = canonicalBrandKey(strollerBrand);
    if (brandsInTitle.size > 0 && !brandsInTitle.has(strollerBrandKey)) {
      return { matched: false, matchedModel: null, matchKind: null };
    }

    // Brand-wide generic adapter: a title that says "for <brand> stroller"
    // (e.g. "Mockingbird Car Seat Adapter for Mockingbird Stroller" or the Joie
    // ICS "for Mockingbird Stroller") fits every model of that brand, so match
    // regardless of the specific model/version.
    if (
      brandsInTitle.has(strollerBrandKey) &&
      contiguousIndex(titleTokens, tokens(`for ${strollerBrand} stroller`)) >= 0
    ) {
      return { matched: true, matchedModel: null, matchKind: 'core' };
    }

    // Veer's wagon adapters reference the "Cruiser" line generically ("Veer
    // Cruiser Infant Car Seat Adapter", "…for Cruiser Wagon"). Cruiser / Cruiser
    // XL / Cruiser City share the same infant-seat adapters, so a Veer stroller
    // whose model is in the Cruiser line matches any Cruiser adapter title.
    if (
      strollerBrandKey === 'veer' &&
      /\bcruiser\b/.test(normalizeText(strollerModel)) &&
      titleTokens.includes('cruiser')
    ) {
      return { matched: true, matchedModel: 'cruiser', matchKind: 'core' };
    }
  }

  const full = normalizeText(strollerModel);
  const core = stripGenericModelWords(strollerModel);

  // Primary candidates match the full model (context = core so the version guard
  // knows the "real" trailing token). Config-stripped candidates drop trailing
  // seat-count words and carry their OWN shortened context, so an adapter titled
  // for the base model ("Summit X3", "Minu Duo") matches its Single/Double/Side-
  // by-Side variants without falsely matching a different version.
  const candidates: Array<{ phrase: string; context: string; kind: 'full' | 'core' }> = [];
  const pushCandidate = (phrase: string, context: string, kind: 'full' | 'core') => {
    if (phrase && !candidates.some((c) => c.phrase === phrase)) {
      candidates.push({ phrase, context, kind });
    }
  };

  pushCandidate(full, core, 'full');
  if (core !== full) pushCandidate(core, core, 'core');

  const fullStripped = stripTrailingConfig(full);
  const coreStripped = stripTrailingConfig(core);
  if (fullStripped !== full && isTrustworthyShortCandidate(fullStripped)) {
    pushCandidate(fullStripped, fullStripped, 'full');
  }
  if (coreStripped !== core && isTrustworthyShortCandidate(coreStripped)) {
    pushCandidate(coreStripped, coreStripped, 'core');
  }

  for (const candidate of candidates) {
    if (!phraseMatchesTitle(titleTokens, candidate.phrase, candidate.context)) continue;
    return {
      matched: true,
      matchedModel: candidate.phrase,
      matchKind: candidate.kind,
    };
  }

  return { matched: false, matchedModel: null, matchKind: null };
}
