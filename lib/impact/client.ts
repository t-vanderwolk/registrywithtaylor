/**
 * Impact.com API client — single source of truth for all Impact.com calls.
 *
 * ── Environment variables ─────────────────────────────────────────────────────
 *   IMPACT_ACCOUNT_SID  — Impact.com Account SID
 *   IMPACT_AUTH_TOKEN   — Impact.com Auth Token
 *
 * Auth: HTTP Basic — base64(IMPACT_ACCOUNT_SID:IMPACT_AUTH_TOKEN)
 * Catalog: Babylist, Catalog ID 8981.
 *
 * All Babylist product URLs returned by the API already contain Taylor's
 * affiliate tracking code. Use the `Url` field exactly as returned — never
 * construct or modify it.
 */

// ── API CONFIG ────────────────────────────────────────────────────────────────
const BASE_URL = 'https://api.impact.com';
const ACCOUNT_SID = process.env.IMPACT_ACCOUNT_SID;
const AUTH_TOKEN = process.env.IMPACT_AUTH_TOKEN;
const BABYLIST_CATALOG_ID = '8981';
const API_VERSION = 16;

const isDev = process.env.NODE_ENV !== 'production';

// ── TYPES ─────────────────────────────────────────────────────────────────────
export interface ImpactCatalogItem {
  Id: string;
  CatalogId: string;
  CatalogItemId: string;
  Name: string;
  Description: string;
  Manufacturer: string;
  Url: string;
  ImageUrl: string;
  AdditionalImageUrls: string[];
  CurrentPrice: string;
  OriginalPrice: string;
  Currency: string;
  StockAvailability: string;
  Bullets: string[];
  Labels: string[];
}

export interface CatalogItemsResponse {
  Items: ImpactCatalogItem[];
  '@numpages': string;
  '@pageindex': string;
  '@pagesize': string;
  '@total': string;
}

// ── INTERNAL: auth + fetch with retry ─────────────────────────────────────────

function authHeader(): string {
  if (!ACCOUNT_SID || !AUTH_TOKEN) {
    throw new Error(
      'Impact.com credentials missing: set IMPACT_ACCOUNT_SID and IMPACT_AUTH_TOKEN in the environment.',
    );
  }

  return `Basic ${Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64')}`;
}

function buildUrl(
  path: string,
  params: Record<string, string | number | undefined> = {},
): string {
  const url = new URL(`${BASE_URL}${path}`);

  /**
   * Do NOT add apiVersion as a URL query param.
   *
   * Impact rejected:
   *   apiVersion
   *   CatalogId
   *   PageIndex
   *
   * on /Catalogs/ItemSearch.
   *
   * API version is sent through the ImpactAPIVersion header instead.
   */
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Low-level GET. Returns parsed JSON, or null on 404.
 * Retries once on 429. Throws on other 4xx/5xx.
 */
async function impactGet<T>(url: string, attempt = 0): Promise<T | null> {
  if (isDev) console.log(`[impact] GET ${url}`);

  const res = await fetch(url, {
    headers: {
      Authorization: authHeader(),
      Accept: 'application/json',
      ImpactAPIVersion: String(API_VERSION),
    },
    cache: 'no-store',
  });

  if (res.status === 404) return null;

  if (res.status === 429 && attempt === 0) {
    if (isDev) console.warn('[impact] 429 rate-limited — retrying in 2s');
    await sleep(2000);
    return impactGet<T>(url, attempt + 1);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');

    throw new Error(
      `Impact.com request failed ${res.status} ${res.statusText} for ${url}${
        body ? ` — ${body.slice(0, 300)}` : ''
      }`,
    );
  }

  return (await res.json()) as T;
}

const accountPath = (suffix: string) => {
  if (!ACCOUNT_SID) {
    throw new Error('IMPACT_ACCOUNT_SID is not set.');
  }

  return `/Mediapartners/${ACCOUNT_SID}${suffix}`;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const tokensOf = (value: string) => normalize(value).split(' ').filter(Boolean);

const WEAK_BRAND_TOKENS = new Set(['baby', 'cross', 'kids', 'co', 'company', 'the']);

const STRICT_BRAND_ALIASES: Record<string, string[]> = {
  'baby jogger': ['baby jogger'],
  'silver cross': ['silver cross'],
  bob: ['bob', 'bob gear'],
  'bob gear': ['bob', 'bob gear'],
  uppababy: ['uppababy'],
  cybex: ['cybex'],
  nuna: ['nuna'],
  bugaboo: ['bugaboo'],
  joie: ['joie'],
};

const hasTokenSequence = (haystackTokens: string[], needleTokens: string[]) => {
  if (needleTokens.length === 0 || needleTokens.length > haystackTokens.length) {
    return false;
  }

  for (let start = 0; start <= haystackTokens.length - needleTokens.length; start += 1) {
    const matches = needleTokens.every(
      (token, index) => haystackTokens[start + index] === token,
    );
    if (matches) return true;
  }

  return false;
};

/**
 * Strict brand matching for diagnostics.
 *
 * Multi-word brands must match as full normalized phrases. Single-token brands
 * must match as exact tokens, never loose substrings, and weak standalone brand
 * tokens are ignored unless they are part of a known phrase alias.
 */
export function hasStrictBabylistBrandMatch(
  brand: string,
  itemName: string,
  itemManufacturer = '',
): boolean {
  const normalizedBrand = normalize(brand);
  if (!normalizedBrand) return false;

  const haystackTokens = tokensOf(`${itemManufacturer} ${itemName}`);
  if (haystackTokens.length === 0) return false;

  const aliases = STRICT_BRAND_ALIASES[normalizedBrand] ?? [normalizedBrand];

  return aliases.some((alias) => {
    const aliasTokens = tokensOf(alias);
    if (aliasTokens.length === 0) return false;

    if (aliasTokens.length === 1) {
      const [token] = aliasTokens;
      if (!token || WEAK_BRAND_TOKENS.has(token)) return false;
      return haystackTokens.includes(token);
    }

    return hasTokenSequence(haystackTokens, aliasTokens);
  });
}

// ── PUBLIC FUNCTIONS ──────────────────────────────────────────────────────────

/**
 * Fetch a single Babylist catalog item by CatalogItemId/SKU.
 *
 * GET /Mediapartners/{AccountSID}/Catalogs/8981/Items/{ItemID}
 */
export async function getBabylistItem(sku: string): Promise<ImpactCatalogItem | null> {
  const trimmed = sku.trim();
  if (!trimmed) return null;

  const url = buildUrl(
    accountPath(`/Catalogs/${BABYLIST_CATALOG_ID}/Items/${encodeURIComponent(trimmed)}`),
  );

  const data = await impactGet<ImpactCatalogItem | CatalogItemsResponse>(url);

  if (!data) return null;
  if ('Items' in data) return data.Items[0] ?? null;
  if ('CatalogItemId' in data) return data;

  return null;
}

/**
 * List every item in the Babylist catalog, paginated.
 *
 * GET /Mediapartners/{AccountSID}/Catalogs/8981/Items
 */
export async function* listBabylistItems(
  options: { pageSize?: number } = {},
): AsyncGenerator<ImpactCatalogItem[]> {
  const pageSize = Math.min(options.pageSize ?? 100, 100);
  let pageIndex = 1;
  let numPages = 1;

  do {
    const url = buildUrl(accountPath(`/Catalogs/${BABYLIST_CATALOG_ID}/Items`), {
      PageSize: pageSize,
      PageIndex: pageIndex,
    });

    const data = await impactGet<CatalogItemsResponse>(url);

    if (!data || data.Items.length === 0) return;

    numPages = Number.parseInt(data['@numpages'] ?? '1', 10) || 1;

    yield data.Items;

    pageIndex += 1;
  } while (pageIndex <= numPages);
}

// ── LOCAL BABYLIST SEARCH ─────────────────────────────────────────────────────

let babylistCatalogCache: ImpactCatalogItem[] | null = null;

async function getAllBabylistItemsCached(): Promise<ImpactCatalogItem[]> {
  if (babylistCatalogCache) return babylistCatalogCache;

  const allItems: ImpactCatalogItem[] = [];

  for await (const page of listBabylistItems({ pageSize: 100 })) {
    allItems.push(...page);
  }

  babylistCatalogCache = allItems;

  if (isDev) {
    console.log(`[impact] cached ${allItems.length} Babylist catalog items`);
  }

  return allItems;
}

/**
 * Resolve a Babylist catalog item from the cached catalog list.
 *
 * This deliberately does NOT call /Catalogs/8981/Items/{sku}; Impact has
 * rejected bare CatalogItemId values on that endpoint for Babylist.
 */
export async function findBabylistProductBySku(
  sku: string,
): Promise<ImpactCatalogItem | null> {
  const trimmed = sku.trim();
  if (!trimmed) return null;

  const candidateIds = new Set([
    trimmed,
    trimmed.startsWith(`product_${BABYLIST_CATALOG_ID}_`)
      ? trimmed
      : `product_${BABYLIST_CATALOG_ID}_${trimmed}`,
  ]);
  const items = await getAllBabylistItemsCached();

  return (
    items.find(
      (item) =>
        item.CatalogId === BABYLIST_CATALOG_ID &&
        (candidateIds.has(item.CatalogItemId) || candidateIds.has(item.Id)),
    ) ?? null
  );
}

/**
 * Search Babylist products locally.
 *
 * Impact's /Catalogs/ItemSearch endpoint rejected plain text queries like:
 *   "Bugaboo Bugaboo Fox 5"
 *
 * So instead, we load the Babylist catalog through the normal paginated
 * /Catalogs/8981/Items endpoint and search locally.
 */
export async function searchBabylistProducts(
  query: string,
  options: { pageSize?: number; pageIndex?: number } = {},
): Promise<ImpactCatalogItem[]> {
  const pageSize = Math.min(options.pageSize ?? 50, 100);
  const normalizedQuery = normalize(query);
  const queryTokens = normalizedQuery.split(' ').filter(Boolean);

  if (queryTokens.length === 0) return [];

  const items = await getAllBabylistItemsCached();

  const scored = items
    .filter((item) => item.CatalogId === BABYLIST_CATALOG_ID)
    .map((item) => {
      const itemName = normalize(item.Name ?? '');
      const itemManufacturer = normalize(item.Manufacturer ?? '');

      const haystack = normalize(
        [
          item.Name,
          item.Manufacturer,
          item.Description,
          ...(item.Bullets ?? []),
          ...(item.Labels ?? []),
        ]
          .filter(Boolean)
          .join(' '),
      );

      let score = 0;

      for (const token of queryTokens) {
        if (haystack.includes(token)) score += 1;
        if (itemName.includes(token)) score += 2;
        if (itemManufacturer.includes(token)) score += 1;
      }

      if (itemName === normalizedQuery) score += 10;
      if (itemName.includes(normalizedQuery)) score += 5;

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, pageSize).map(({ item }) => item);
}

// Catalog items that are accessories / parts — never the stroller or car seat itself.
const ACCESSORY_DENYLIST = [
  'adapter', 'cup holder', 'cupholder', 'tray', 'travel bag', 'storage bag',
  'carry bag', 'seat liner', 'liner', 'footmuff', 'bassinet', 'rocker',
  'second seat', 'rumble seat', 'organizer', 'organiser', 'cage', 'parasol',
  'rain cover', 'rain shield', 'weather shield', 'sun shade', 'sunshade',
  'snack', 'cushion', 'mosquito', 'replacement', 'wheel', 'tire', 'glider board',
  'ride along', 'stand', 'caddy', 'console', 'hook', 'cover only', 'bundle',
];

// Generic version / line suffixes that don't identify a specific product.
const MODEL_STOPWORDS = new Set([
  'next', 'lux', 'plus', 'pro', 'complete', 'stroller', 'pushchair', 'mini',
  'max', 'gt', 'gt2', 'gt3', 'v1', 'v2', 'v3', 's', 'lx', 'the', 'and',
  '1', '2', '3', '4', '5', '6', 'i', 'ii', 'iii',
]);

const NEARBY_CANDIDATE_WEAK_TOKENS = new Set([
  ...MODEL_STOPWORDS,
  'baby', 'car', 'seat', 'infant', 'series', 'system', 'travel', 'by',
  'g', 't', 'kids', 'co', 'company', 'cross',
]);

const isAccessoryItem = (name: string): boolean => {
  const n = ` ${name.toLowerCase()} `;
  return ACCESSORY_DENYLIST.some((kw) => n.includes(kw));
};

export interface BabylistCandidateDiagnostic {
  item: ImpactCatalogItem;
  score: number;
  matchedTokens: string[];
  brandMatched: boolean;
}

/**
 * Return nearby catalog candidates for diagnostics when strict matching fails.
 * This uses the cached list endpoint data and scores by brand/name token overlap.
 */
export async function findBabylistNearbyCandidates(
  name: string,
  manufacturer?: string,
  limit = 5,
): Promise<BabylistCandidateDiagnostic[]> {
  const nameTokens = tokensOf(name);
  const brandTokens = new Set(tokensOf(manufacturer ?? ''));
  const meaningfulNameTokens = nameTokens.filter(
    (token) =>
      token.length >= 3 &&
      !brandTokens.has(token) &&
      !NEARBY_CANDIDATE_WEAK_TOKENS.has(token),
  );
  const exactTarget = normalize(name);

  if (meaningfulNameTokens.length === 0 && brandTokens.size === 0) return [];

  const items = await getAllBabylistItemsCached();

  return items
    .filter((item) => item.CatalogId === BABYLIST_CATALOG_ID)
    .map((item) => {
      const itemName = normalize(item.Name ?? '');
      const itemManufacturer = normalize(item.Manufacturer ?? '');
      const itemTokens = new Set(
        `${itemName} ${itemManufacturer}`.split(' ').filter(Boolean),
      );

      const matchedTokens = meaningfulNameTokens.filter(
        (token) => itemTokens.has(token) || itemName.includes(token),
      );
      const brandMatched = hasStrictBabylistBrandMatch(
        manufacturer ?? '',
        item.Name ?? '',
        item.Manufacturer ?? '',
      );

      let score =
        meaningfulNameTokens.length > 0
          ? matchedTokens.length / meaningfulNameTokens.length
          : 0;
      if (brandMatched) score += 1;
      if (exactTarget && itemName.includes(exactTarget)) score += 0.5;
      if (isAccessoryItem(item.Name ?? '')) score -= 0.15;

      return { item, score, matchedTokens, brandMatched };
    })
    .filter(({ brandMatched, matchedTokens, score }) => {
      if (score <= 0) return false;
      return brandMatched || matchedTokens.length > 0;
    })
    .sort((a, b) => {
      if (a.brandMatched !== b.brandMatched) return b.brandMatched ? 1 : -1;
      return b.score - a.score;
    })
    .filter(({ item }, index, candidates) => {
      const key = item.CatalogItemId || item.Id || `${item.Name}:${item.Url}`;
      return candidates.findIndex(({ item: candidateItem }) => {
        const candidateKey =
          candidateItem.CatalogItemId ||
          candidateItem.Id ||
          `${candidateItem.Name}:${candidateItem.Url}`;
        return candidateKey === key;
      }) === index;
    })
    .slice(0, limit);
}

/**
 * Find the single best Babylist match for a product name.
 *
 * Strict matching to avoid false positives against a 9k-item catalog that's
 * mostly accessories:
 *   - excludes accessory/part items (cup holders, adapters, bags, bassinets…)
 *   - requires the manufacturer to agree
 *   - requires every DISTINCTIVE model token (brand + version words removed) to
 *     be present, so "CYBEX Libelle" can't match "Cybex MIOS Stroller"
 * Returns null when nothing clears the bar (caller falls back to the static link).
 */
export async function findBabylistProduct(
  name: string,
  manufacturer?: string,
): Promise<ImpactCatalogItem | null> {
  const lowerName = name.toLowerCase();
  const lowerMaker = manufacturer?.toLowerCase() ?? '';
  // Avoid "Bugaboo Bugaboo Fox 5" when the name already leads with the brand.
  const query =
    manufacturer && !lowerName.startsWith(lowerMaker) ? `${manufacturer} ${name}` : name;

  const items = await searchBabylistProducts(query, { pageSize: 50 });
  if (items.length === 0) return null;

  const brandTokens = new Set(normalize(manufacturer ?? '').split(' ').filter(Boolean));
  const nameTokens = normalize(name).split(' ').filter(Boolean);
  const distinctiveTokens = nameTokens.filter(
    (t) => !brandTokens.has(t) && !MODEL_STOPWORDS.has(t) && t.length >= 3,
  );
  // If the name is only brand + generic words (e.g. "Egg Stroller"), still require
  // the non-brand tokens (e.g. "stroller") so it can't match "Robin's Egg Bow".
  const requiredTokens =
    distinctiveTokens.length > 0 ? distinctiveTokens : nameTokens.filter((t) => !brandTokens.has(t));
  const wantManufacturer = manufacturer ? normalize(manufacturer) : null;
  const exactTarget = normalize(name);

  let best: ImpactCatalogItem | null = null;
  let bestScore = -1;

  for (const item of items) {
    if (isAccessoryItem(item.Name ?? '')) continue;

    const itemName = normalize(item.Name ?? '');
    const itemTokens = new Set(itemName.split(' ').filter(Boolean));

    // Manufacturer must agree.
    if (wantManufacturer) {
      const itemMaker = normalize(item.Manufacturer ?? '');
      const brandOk =
        (itemMaker && (itemMaker.includes(wantManufacturer) || wantManufacturer.includes(itemMaker))) ||
        itemName.includes(wantManufacturer);
      if (!brandOk) continue;
    }

    // Every required model token must appear (the real differentiator).
    if (requiredTokens.length > 0) {
      const allPresent = requiredTokens.every((t) => itemTokens.has(t) || itemName.includes(t));
      if (!allPresent) continue;
    }

    // Among the survivors, prefer the closest overall name.
    let overlap = 0;
    for (const t of nameTokens) if (itemTokens.has(t)) overlap += 1;
    let score = nameTokens.length > 0 ? overlap / nameTokens.length : 0;
    if (itemName === exactTarget) score += 1;
    if (/\b(stroller|car seat|travel system|pushchair)\b/.test(itemName)) score += 0.25;

    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  return best;
}

export const IMPACT_CONFIG = {
  BASE_URL,
  BABYLIST_CATALOG_ID,
  API_VERSION,
} as const;
