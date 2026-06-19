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

/**
 * Find the single best Babylist match for a product name.
 *
 * Optionally scopes the search by manufacturer.
 * Used to match DB stroller/car seat names to feed entries.
 */
export async function findBabylistProduct(
  name: string,
  manufacturer?: string,
): Promise<ImpactCatalogItem | null> {
  const query = manufacturer ? `${manufacturer} ${name}` : name;

  const items = await searchBabylistProducts(query, { pageSize: 50 });
  if (items.length === 0) return null;

  const targetTokens = new Set(normalize(name).split(' ').filter(Boolean));
  const wantManufacturer = manufacturer ? normalize(manufacturer) : null;

  let best: ImpactCatalogItem | null = null;
  let bestScore = -1;

  for (const item of items) {
    const itemName = normalize(item.Name ?? '');
    const itemTokens = new Set(itemName.split(' ').filter(Boolean));

    let overlap = 0;

    for (const token of targetTokens) {
      if (itemTokens.has(token)) overlap += 1;
    }

    const coverage = targetTokens.size > 0 ? overlap / targetTokens.size : 0;

    let score = coverage;

    if (wantManufacturer) {
      const itemMaker = normalize(item.Manufacturer ?? '');

      if (
        itemMaker &&
        (itemMaker.includes(wantManufacturer) || wantManufacturer.includes(itemMaker))
      ) {
        score += 0.5;
      } else if (itemMaker) {
        score -= 0.25;
      }
    }

    if (itemName === normalize(name)) {
      score += 0.5;
    }

    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  if (best) {
    const bestTokens = new Set(normalize(best.Name ?? '').split(' ').filter(Boolean));

    let overlap = 0;

    for (const token of targetTokens) {
      if (bestTokens.has(token)) overlap += 1;
    }

    if (targetTokens.size > 0 && overlap / targetTokens.size < 0.5) {
      return null;
    }
  }

  return best;
}

export const IMPACT_CONFIG = {
  BASE_URL,
  BABYLIST_CATALOG_ID,
  API_VERSION,
} as const;