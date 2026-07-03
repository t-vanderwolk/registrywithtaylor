/**
 * Read-only: fresh GoodBuyGear (Impact) API fetch, cross-referenced against the
 * CURRENTLY publicly-visible strollers in the finder. Reports any open-box GBG
 * deals for strollers shoppers can actually see. Writes nothing to the DB.
 *
 * Auth: HTTP Basic base64(IMPACT_GOODBUYGEAR_ACCOUNT_SID:IMPACT_GOODBUYGEAR_AUTH_TOKEN)
 * (same creds as catalog:import-gbg — set in .env or the shell).
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:report-gbg-open-box
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getPublicStrollerCatalogTravelSystemOptions } from '@/lib/server/publicStrollerCatalog';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';
import { parseStrollerModel } from '@/lib/catalog/strollerModel';
import { productModelKey } from '@/lib/catalog/modelIdentity';
import { canonicalStrollerBrand, isExcludedStrollerFinderProduct } from '@/lib/catalog/strollerFinderRules';

function loadDotEnv() {
  try {
    const text = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
    for (const line of text.split('\n')) {
      const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (!m) continue;
      let val = m[2];
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      if (process.env[m[1]] === undefined) process.env[m[1]] = val;
    }
  } catch {
    /* optional */
  }
}
loadDotEnv();

const BASE_URL = 'https://api.impact.com';
const API_VERSION = 16;
const SID = process.env.IMPACT_GOODBUYGEAR_ACCOUNT_SID;
const TOKEN = process.env.IMPACT_GOODBUYGEAR_AUTH_TOKEN;

const ACCESSORY_RE =
  /\b(?:adapter|adaptor|\bbag\b|tote|caddy|organi[sz]er|cup ?holder|\btray\b|belly bar|bumper bar|rain ?cover|sun ?shade|sunshade|\bcanopy\b|footmuff|bunting|cocoon|blanket|\bsheet\b|\bliner\b|\binsert\b|cushion|mattress|\bpad\b|bassinet|carry ?cot|\bcot\b|second seat|sibling seat|rumble ?seat|seat pack|ride[- ]?along|glider board|piggy ?back|\bboard\b|wheel ?kit|\bkit\b|\btire\b|\bwheel\b|replacement|\bstand\b|console|\bhook\b|skirt|\bmuff\b|sleeve|\bcover\b|\bbundle\b)\b/i;

const KNOWN_BRANDS = [
  'Baby Jogger', 'Silver Cross', 'Maxi-Cosi', 'Peg Perego', 'Orbit Baby', 'Delta Children', 'Radio Flyer',
  'BOB Gear', 'Baby Trend', 'Valco Baby', 'Guava Family', 'Charlie Crane', 'Mountain Buggy',
  'UPPAbaby', 'Bugaboo', 'Cybex', 'Nuna', 'Joolz', 'Joie', 'Chicco', 'Graco', 'Britax', 'Bumbleride',
  'Mockingbird', 'Mompush', 'Thule', 'Stokke', 'Evenflo', 'Veer', 'Clek', 'Doona', 'Romer', 'Ergobaby',
  'Inglesina', 'Zoe', 'WonderFold', 'Larktale', 'Colugo', 'Mima', 'Jeep', 'Ingenuity', 'Summer',
  'Munchkin', 'Bombi', 'Babyark', 'Diono', 'Cosatto', 'Babyzen', 'Keenz', 'egg',
].sort((a, b) => b.length - a.length);

function detectBrand(name: string): string {
  const lower = name.toLowerCase().trim();
  for (const b of KNOWN_BRANDS) {
    const bl = b.toLowerCase();
    if (lower === bl || lower.startsWith(`${bl} `)) return b;
  }
  return name.trim().split(/[\s,]+/)[0] || 'Other';
}

function normalizedTitle(value: string) {
  return value
    .normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[®™©]/g, '').replace(/[’']/g, '')
    .replace(/\+/g, ' plus ').replace(/&/g, ' and ').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function gbgStrollerProductType(title: string, brand: string) {
  const text = normalizedTitle(`${brand} ${title}`);
  if (/\b(bob|duallie|double jogging|summit x3 double|urban glide \d* double)\b/.test(text) && /\b(double|duallie)\b/.test(text)) return 'double jogging stroller';
  if (/\b(bob|revolution|alterrain|rambler|wayfinder|jogging stroller|summit x3|urban glide|guava roam|ridge)\b/.test(text)) return 'jogging stroller';
  if (/\b(wonderfold|stroller wagon|wagon|veer cruiser|larktale caravan|keenz|pivot xplore|radio flyer)\b/.test(text)) return 'wagon';
  if (/\b(donkey|kangaroo|vista|demi next|demi grow|gazelle|wave|ypsi|agio z4|mockingbird single to double|pivot xpand|ready2grow|nest2grow|single to double)\b/.test(text)) return 'single-to-double stroller';
  if (/\b(minu duo|trvl dubl|jet double|double stroller|twin stroller|g link|city mini gt2 double|city mini double|side by side)\b/.test(text)) return 'double stroller';
  if (/\b(g luxe|g lite|maclaren|3d lite|liteway|umbrella stroller)\b/.test(text)) return 'umbrella stroller';
  if (/\b(butterfly|trvl|minu|yoyo|aer|aer2|jet|coya|libelle|beezy|quid|metro|mima miro|city tour|clic|volo|dot|nia|breez|lithe)\b/.test(text)) return 'travel stroller';
  if (/\b(dragonfly|triv|dune|mios|joolz hub|swiv|electa|city mini air|city mini gt3|presto)\b/.test(text)) return 'compact stroller';
  if (/\b(priam|e priam|mixx|cruz|fox|reef|xplory|joolz day|cove|balios|brook|grove)\b/.test(text)) return 'full-size stroller';
  return 'full-size stroller';
}

function parsePrice(v?: string): number | null {
  if (!v) return null;
  const n = Number(String(v).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

type ImpactItem = {
  Id: string; Name: string; Manufacturer?: string; Url: string;
  CurrentPrice?: string; OriginalPrice?: string; StockAvailability?: string;
};

function authHeader(): string {
  if (!SID || !TOKEN) throw new Error('Set IMPACT_GOODBUYGEAR_ACCOUNT_SID and IMPACT_GOODBUYGEAR_AUTH_TOKEN in the environment.');
  return `Basic ${Buffer.from(`${SID}:${TOKEN}`).toString('base64')}`;
}

async function get<T>(url: string, attempt = 0): Promise<T | null> {
  const res = await fetch(url, { headers: { Authorization: authHeader(), Accept: 'application/json', ImpactAPIVersion: String(API_VERSION) }, cache: 'no-store' });
  if (res.status === 404) return null;
  if (res.status === 429 && attempt === 0) { await new Promise((r) => setTimeout(r, 2000)); return get<T>(url, 1); }
  if (!res.ok) throw new Error(`Impact ${res.status} ${res.statusText} for ${url}`);
  return (await res.json()) as T;
}

async function resolveCatalogId(): Promise<string> {
  const envId = process.env.IMPACT_GOODBUYGEAR_CATALOG_ID?.trim();
  const data = await get<{ Catalogs?: Array<{ Id: string; Name: string }> }>(`${BASE_URL}/Mediapartners/${SID}/Catalogs`);
  const catalogs = data?.Catalogs ?? [];
  if (envId && catalogs.some((c) => c.Id === envId)) return envId;
  const named = catalogs.find((c) => /good\s*buy\s*gear/i.test(c.Name));
  if (named) return named.Id;
  if (envId) return envId;
  throw new Error('No GoodBuyGear catalog visible; set IMPACT_GOODBUYGEAR_CATALOG_ID.');
}

async function* listItems(catalogId: string): AsyncGenerator<ImpactItem[]> {
  let next = `${BASE_URL}/Mediapartners/${SID}/Catalogs/${catalogId}/Items?PageSize=100`;
  for (let guard = 0; guard < 3000; guard += 1) {
    const data = await get<{ Items?: ImpactItem[]; '@nextpageuri'?: string }>(next);
    if (!data?.Items?.length) return;
    yield data.Items;
    const n = data['@nextpageuri'];
    if (!n) return;
    next = `${BASE_URL}${n}`;
  }
}

async function main() {
  console.log('── GoodBuyGear open-box deals on publicly-visible strollers ──\n');

  // 1. Currently public strollers (finder) → key set.
  const publicOptions = await getPublicStrollerCatalogTravelSystemOptions();
  const publicKeys = new Map<string, { brand: string; model: string }>();
  for (const o of publicOptions) publicKeys.set(productModelKey(o.brand, o.model), { brand: o.brand, model: o.model });
  console.log(`Public strollers in finder: ${publicKeys.size}`);

  // 2. Fresh GBG fetch.
  const catalogId = await resolveCatalogId();
  console.log(`GoodBuyGear catalog: ${catalogId}\n`);

  const deals: Array<{
    brand: string; model: string; gbgTitle: string; gbgPrice: number | null;
    originalPrice: number | null; pctOff: number | null; inStock: boolean; url: string;
  }> = [];
  let scanned = 0;

  for await (const batch of listItems(catalogId)) {
    for (const item of batch) {
      scanned += 1;
      const name = item.Name || '';
      if (!name || ACCESSORY_RE.test(name)) continue;
      const brand = detectBrand(name);
      const productType = gbgStrollerProductType(name, brand);
      if (!strollerCategoryFromProductType(productType)) continue;
      const model = parseStrollerModel(name, brand);
      if (!model) continue;
      if (isExcludedStrollerFinderProduct({ brand, title: name, productUrl: item.Url, affiliateUrl: item.Url })) continue;

      const key = productModelKey(canonicalStrollerBrand(brand), model);
      const match = publicKeys.get(key);
      if (!match) continue;

      const price = parsePrice(item.CurrentPrice);
      const original = parsePrice(item.OriginalPrice);
      const pctOff = price != null && original != null && original > price ? Math.round((1 - price / original) * 100) : null;
      deals.push({
        brand: match.brand, model: match.model, gbgTitle: name, gbgPrice: price,
        originalPrice: original, pctOff, inStock: !/out|unavailable/i.test(item.StockAvailability ?? ''), url: item.Url,
      });
    }
  }

  deals.sort((a, b) => (b.pctOff ?? 0) - (a.pctOff ?? 0) || a.brand.localeCompare(b.brand));

  console.log(`Scanned ${scanned} GoodBuyGear items → ${deals.length} open-box deal(s) on visible strollers:\n`);
  for (const d of deals) {
    const price = d.gbgPrice != null ? `$${d.gbgPrice.toFixed(2)}` : '—';
    const off = d.pctOff != null ? ` (${d.pctOff}% off $${d.originalPrice?.toFixed(2)})` : '';
    console.log(`  ${d.brand} ${d.model}  ${price}${off}${d.inStock ? '' : '  [OUT OF STOCK]'}`);
    console.log(`      ${d.gbgTitle.slice(0, 74)}`);
  }
  if (deals.length === 0) console.log('  None — no visible stroller currently has a GoodBuyGear open-box listing.');

  mkdirSync(resolve(process.cwd(), 'reports'), { recursive: true });
  writeFileSync(resolve(process.cwd(), 'reports/gbg-open-box-deals.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), scanned, deals }, null, 2)}\n`);
  const csv = [
    ['brand', 'model', 'gbgPrice', 'originalPrice', 'pctOff', 'inStock', 'gbgTitle', 'url'].join(','),
    ...deals.map((d) => [d.brand, d.model, d.gbgPrice ?? '', d.originalPrice ?? '', d.pctOff ?? '', d.inStock, `"${d.gbgTitle.replace(/"/g, '""')}"`, d.url].join(',')),
  ].join('\n');
  writeFileSync(resolve(process.cwd(), 'reports/gbg-open-box-deals.csv'), `${csv}\n`);
  console.log('\n  Reports: reports/gbg-open-box-deals.json, reports/gbg-open-box-deals.csv');
}

main()
  .catch((error) => {
    console.error('[reportGbgOpenBoxDeals] failed:', error);
    process.exit(1);
  });
