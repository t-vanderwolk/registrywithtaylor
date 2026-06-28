/**
 * Pull the GoodBuyGear catalog from Impact and store its strollers + infant car
 * seats in the affiliate catalog (provider "impact_goodbuygear"), categorized
 * with the same auto-categorizer as Babylist. Everything that isn't a browsable
 * stroller or an infant car seat is skipped.
 *
 * Auth: HTTP Basic base64(IMPACT_GOODBUYGEAR_ACCOUNT_SID:IMPACT_GOODBUYGEAR_AUTH_TOKEN)
 * Catalog: IMPACT_GOODBUYGEAR_CATALOG_ID (optional — the largest catalog on the
 * account is auto-detected if unset).
 *
 * GoodBuyGear product URLs from Impact already carry Taylor's tracking — the `Url`
 * field is stored EXACTLY as returned, never reconstructed.
 *
 *   npx tsx scripts/importGoodBuyGearCatalog.ts            # dry run (default)
 *   npx tsx scripts/importGoodBuyGearCatalog.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:import-gbg
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { categorizeProduct } from '@/lib/catalog/categorize';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';
import { parseCarSeatModel, parseStrollerModel } from '@/lib/catalog/strollerModel';
import {
  canonicalStrollerBrand,
  isExcludedStrollerFinderProduct,
} from '@/lib/catalog/strollerFinderRules';

// Load .env for local CLI runs without a dotenv dependency. Tolerant of quirks
// (skips unparseable lines instead of throwing) and never overrides a variable
// already exported in the shell — so an inline prod DATABASE_URL still wins.
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
    /* .env is optional — the creds may already be exported */
  }
}
loadDotEnv();

const BASE_URL = 'https://api.impact.com';
const API_VERSION = 16;
const SID = process.env.IMPACT_GOODBUYGEAR_ACCOUNT_SID;
const TOKEN = process.env.IMPACT_GOODBUYGEAR_AUTH_TOKEN;
const PROVIDER = 'impact_goodbuygear';

// Accessory / part false-positives — names that contain "stroller"/"car seat"/a
// model but aren't the product itself. Skipped before categorizing.
const ACCESSORY_RE =
  /\b(?:adapter|adaptor|\bbag\b|tote|caddy|organi[sz]er|cup ?holder|\btray\b|belly bar|bumper bar|rain ?cover|rain ?shield|rainshield|weather ?shield|sun ?shade|sunshade|sun ?cover|parasol|\bcanopy\b|footmuff|bunting|cocoon|blanket|\bsheet\b|\bliner\b|\binsert\b|cushion|mattress|\bpad\b|bassinet|carry ?cot|\bcot\b|second seat|sibling seat|rumble ?seat|seat pack|seat pad|ride[- ]?along|glider board|piggy ?back|\bboard\b|wheel ?kit|sidewall|\bkit\b|inner tube|\btube\b|\btire\b|\bwheel\b|replacement|\bstand\b|console|\bhook\b|cage|mosquito|\bnet\b|skirt|apron|\bmuff\b|sleeve|\bcover\b|\bbundle\b)\b/i;

const TRUE_INFANT_SEAT_RE =
  /\b(infant car ?seat|pipa|mesa|aria|liing|cloud|aton|keyfit|fit2|snugride|litemax|ez-?lift|primo viaggio|turtle|mico|willow|b-?safe|doona|city go)\b/i;

const NON_INFANT_CAR_SEAT_RE =
  /\b(convertible|all.?in.?one|booster|rotating|swivel|360|city turn|turn2me|extend2fit|4ever|forever|slimfit|rava|exec|revv|fllo|foonf|one4life|poplar|advocate|marathon|emblem|grow and go|pria|magellan|everfit|sequel|nextfit|fit360|revolve)\b/i;

// GoodBuyGear's "Manufacturer" is a vendor code (e.g. "NQC-10004721",
// "GBG Returns-…"), not the brand — the real brand leads the product name.
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

type ImpactItem = {
  Id: string;
  CatalogId?: string;
  CatalogItemId?: string;
  Name: string;
  Description?: string;
  Manufacturer?: string;
  Url: string;
  ImageUrl?: string;
  AdditionalImageUrls?: string[];
  CurrentPrice?: string;
  OriginalPrice?: string;
  Currency?: string;
  StockAvailability?: string;
  Labels?: string[];
  Bullets?: string[];
};

function authHeader(): string {
  if (!SID || !TOKEN) {
    throw new Error('Set IMPACT_GOODBUYGEAR_ACCOUNT_SID and IMPACT_GOODBUYGEAR_AUTH_TOKEN in the environment.');
  }
  return `Basic ${Buffer.from(`${SID}:${TOKEN}`).toString('base64')}`;
}

async function get<T>(url: string, attempt = 0): Promise<T | null> {
  const res = await fetch(url, {
    headers: { Authorization: authHeader(), Accept: 'application/json', ImpactAPIVersion: String(API_VERSION) },
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (res.status === 429 && attempt === 0) {
    await new Promise((r) => setTimeout(r, 2000));
    return get<T>(url, 1);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Impact ${res.status} ${res.statusText} for ${url}${body ? ` — ${body.slice(0, 300)}` : ''}`);
  }
  return (await res.json()) as T;
}

async function resolveCatalogId(): Promise<string> {
  const data = await get<{ Catalogs?: Array<{ Id: string; Name: string; NumberOfItems?: string }> }>(
    `${BASE_URL}/Mediapartners/${SID}/Catalogs`,
  );
  const catalogs = data?.Catalogs ?? [];
  console.log('  Catalogs visible to these credentials:');
  catalogs.forEach((c) => console.log(`    ${c.Id}  ${c.Name}  (${c.NumberOfItems ?? '?'} items)`));

  const envId = process.env.IMPACT_GOODBUYGEAR_CATALOG_ID?.trim();
  if (envId) {
    const found = catalogs.find((c) => c.Id === envId);
    console.log(`  → using catalog ${envId}${found ? ` (${found.Name})` : ' (not in the list above — double-check)'}`);
    return envId;
  }

  // Only auto-select when a catalog is actually named GoodBuyGear — never the
  // largest (that grabbed the Babylist feed, which is a duplicate import).
  const named = catalogs.find((c) => /good\s*buy\s*gear/i.test(c.Name));
  if (named) {
    console.log(`  → matched GoodBuyGear catalog ${named.Id} (${named.Name})`);
    return named.Id;
  }

  throw new Error(
    'No catalog named "GoodBuyGear" is visible to these credentials, and IMPACT_GOODBUYGEAR_CATALOG_ID is not set. ' +
      'Pick the right Id from the list above and set IMPACT_GOODBUYGEAR_CATALOG_ID=<id>, then re-run. ' +
      'Do NOT use 8981 — that is the Babylist feed you already import.',
  );
}

async function* listItems(catalogId: string): AsyncGenerator<ImpactItem[]> {
  let next = `${BASE_URL}/Mediapartners/${SID}/Catalogs/${catalogId}/Items?PageSize=100`;
  for (let guard = 0; guard < 3000; guard += 1) {
    const data = await get<{ Items?: ImpactItem[]; '@nextpageuri'?: string }>(next);
    if (!data || !data.Items || data.Items.length === 0) return;
    yield data.Items;
    const n = data['@nextpageuri'];
    if (!n) return;
    next = `${BASE_URL}${n}`;
  }
}

function parsePrice(v?: string): number | null {
  if (!v) return null;
  const n = Number(String(v).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function normalizedTitle(value: string) {
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

function goodBuyGearStrollerProductType(title: string, brand: string, fallback: string) {
  const text = normalizedTitle(`${brand} ${title}`);

  if (/\b(bob|duallie|alterrain double|double jogging|summit x3 double|urban glide \d* double)\b/.test(text) && /\b(double|duallie)\b/.test(text)) {
    return 'double jogging stroller';
  }
  if (/\b(bob|revolution|alterrain|rambler|wayfinder|jogging stroller|summit x3|urban glide|guava roam|ridge)\b/.test(text)) {
    return 'jogging stroller';
  }
  if (/\b(wonderfold|stroller wagon|wagon|veer cruiser|larktale caravan|keenz|pivot xplore|radio flyer)\b/.test(text)) {
    return 'wagon';
  }
  if (/\b(donkey|kangaroo|vista|demi next|demi grow|e gazelle|egazelle|gazelle|wave|ypsi|agio z4|mockingbird single to double|pivot xpand|ready2grow|modes nest2grow|single to double)\b/.test(text)) {
    return 'single-to-double stroller';
  }
  if (/\b(minu duo|trvl dubl|trvl double|jet double|double stroller|duo stroller|twin stroller|g link|snap duo|city mini gt2 double|city mini double|side by side|bravofor2|cortina together)\b/.test(text)) {
    return 'double stroller';
  }
  if (/\b(g luxe|g lite|maclaren|3d lite|liteway|umbrella stroller|classic umbrella)\b/.test(text)) {
    return 'umbrella stroller';
  }
  if (/\b(butterfly|trvl|minu|yoyo|yoyo3|yoyo 3|aer|aer2|jet|coya|libelle|beezy|quid|quid3|metro|orbit baby m plus|mima miro|city tour|clic|volo|dot|nia|breez|lithe)\b/.test(text)) {
    return 'travel stroller';
  }
  if (/\b(dragonfly|triv|dune|mios|joolz hub|swiv|electa|city mini air|city mini gt3|city mini gt 3|presto|reversi)\b/.test(text)) {
    return 'compact stroller';
  }
  if (/\b(priam|e priam|epriam|mixx|cruz|fox|reef|xplory|joolz day|cove|balios|brook|grove)\b/.test(text)) {
    return 'full-size stroller';
  }

  return fallback;
}

function canonicalModelForGoodBuyGear(title: string, brand: string, productType: string) {
  if (productType === 'infant car seat') return parseCarSeatModel(title, brand);
  if (strollerCategoryFromProductType(productType)) return parseStrollerModel(title, brand);
  return title;
}

/** Decode the real landing URL from an Impact affiliate link's `u=` param. */
function decodeDestination(link: string): string | null {
  if (!link) return null;
  try {
    const dest = new URL(link).searchParams.get('u');
    return dest ? decodeURIComponent(dest) : null;
  } catch {
    return null;
  }
}

/**
 * Pull a product image off the listing page (og:image / twitter:image). Used only
 * for brand-new products whose Impact item ships no image. Fetches the DECODED
 * landing page, never the tracking link, so it doesn't register an affiliate click.
 */
async function fetchOgImage(landingUrl: string): Promise<string | null> {
  try {
    const res = await fetch(landingUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TMBC-catalog/1.0)' },
      redirect: 'follow',
    });
    if (!res.ok) return null;
    const html = await res.text();
    const patterns = [
      /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    ];
    for (const re of patterns) {
      const m = html.match(re);
      if (m?.[1]) return m[1].trim();
    }
    return null;
  } catch {
    return null;
  }
}

async function main() {
  const apply = process.argv.includes('--apply');
  if (!SID || !TOKEN) throw new Error('Set IMPACT_GOODBUYGEAR_ACCOUNT_SID and IMPACT_GOODBUYGEAR_AUTH_TOKEN.');

  console.log('── GoodBuyGear catalog import (Impact) ──');
  const catalogId = await resolveCatalogId();

  const items: ImpactItem[] = [];
  for await (const page of listItems(catalogId)) items.push(...page);
  console.log(`  pulled ${items.length} catalog items`);
  console.log('\n  raw sample (Name | Manufacturer | Labels):');
  items.slice(0, 5).forEach((it) =>
    console.log(`    ${it.Name?.slice(0, 50)} | ${it.Manufacturer ?? ''} | ${(it.Labels ?? []).join(', ').slice(0, 40)}`),
  );

  type Keep = {
    item: ImpactItem;
    brand: string;
    productType: string;
    tmbcCategory: string;
    needsReview: boolean;
    confidenceScore: number;
    parentJourney: string | null;
    tags: string[];
  };
  const keep: Keep[] = [];
  const dist: Record<string, number> = {};
  for (const it of items) {
    if (!it.Id || !it.Name) continue;
    if (ACCESSORY_RE.test(it.Name)) continue;
    // Categorize by NAME only — GoodBuyGear's labels lump accessories into
    // "Strollers" collections, which would mis-tag them as strollers.
    const detectedBrand = detectBrand(it.Name);
    const cat = categorizeProduct({ title: it.Name, brand: detectedBrand });
    const isStroller = cat.tmbcCategory === 'Strollers' && !!strollerCategoryFromProductType(cat.productType);
    const isInfantSeat =
      cat.productType === 'infant car seat' &&
      TRUE_INFANT_SEAT_RE.test(it.Name) &&
      !NON_INFANT_CAR_SEAT_RE.test(it.Name);
    if (!isStroller && !isInfantSeat) continue;
    if (isStroller && isExcludedStrollerFinderProduct({ brand: detectedBrand, title: it.Name })) continue;
    const brand = isStroller ? canonicalStrollerBrand(detectedBrand) : detectedBrand;
    const productType = isStroller
      ? goodBuyGearStrollerProductType(it.Name, brand, cat.productType!)
      : cat.productType!;
    keep.push({
      item: it,
      brand,
      productType,
      tmbcCategory: cat.tmbcCategory,
      needsReview: false,
      confidenceScore: Math.max(cat.confidenceScore, 0.8),
      parentJourney: cat.parentJourney,
      tags: cat.tags,
    });
    dist[productType] = (dist[productType] ?? 0) + 1;
  }

  console.log(`\n  strollers + infant car seats kept: ${keep.length} of ${items.length}`);
  Object.entries(dist)
    .sort((a, b) => b[1] - a[1])
    .forEach(([t, n]) => console.log(`    ${String(n).padStart(4)}  ${t}`));
  console.log('\n  kept sample (first 14):');
  keep.slice(0, 18).forEach((k) => console.log(`    [${k.productType}] ${k.brand} · ${k.item.Name}`.slice(0, 88)));

  if (!apply) {
    console.log('\n  (dry run — nothing written. Re-run with --apply.)');
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = ((await import('@/lib/server/prisma')).default) as any;
  const runStart = new Date();
  let created = 0;
  let updated = 0;
  let enriched = 0;
  let skippedReviewed = 0;
  let imagesFetched = 0;
  let errors = 0;

  for (const k of keep) {
    const it = k.item;
    const externalId = (it.Id || '').trim();
    const raw = {
      provider: PROVIDER,
      catalogId,
      externalId,
      sku: externalId,
      brand: k.brand || null,
      title: it.Name,
      description: it.Description || null,
      productTypePath: (it.Labels ?? []).join(' > ') || null,
      price: parsePrice(it.CurrentPrice),
      currency: it.Currency || 'USD',
      imageUrl: it.ImageUrl || it.AdditionalImageUrls?.[0] || null,
      affiliateUrl: (it.Url || '').trim() || null, // PRESERVE EXACTLY
      availability: it.StockAvailability || null,
      inStock: /in.?stock|available/i.test(it.StockAvailability ?? ''),
      itemGroupId: null as string | null,
      retailer: 'GoodBuyGear',
      rawPayload: it as unknown,
      lastSyncedAt: runStart,
    };
    try {
      const existing = await db.affiliateCatalogProduct.findUnique({
        where: { provider_externalId: { provider: PROVIDER, externalId } },
        select: { id: true },
      });
      // New to the DB and no image from the feed → fetch one from the product
      // page (decoded landing URL, so no affiliate click is logged).
      if (!existing && !raw.imageUrl) {
        const landing = decodeDestination(it.Url);
        if (landing) {
          raw.imageUrl = await fetchOgImage(landing);
          if (raw.imageUrl) imagesFetched += 1;
        }
      }
      let productId: string;
      if (!existing) {
        const r = await db.affiliateCatalogProduct.create({
          data: { ...raw, firstSeenAt: runStart, isActiveInFeed: true, lastChangedAt: runStart },
          select: { id: true },
        });
        productId = r.id;
        created += 1;
      } else {
        await db.affiliateCatalogProduct.update({
          where: { id: existing.id },
          data: { ...raw, isActiveInFeed: true },
        });
        productId = existing.id;
        updated += 1;
      }

      const enr = await db.productEnrichment.findUnique({
        where: { rawProductId: productId },
        select: { id: true, reviewStatus: true },
      });
      const autoStatus = k.needsReview ? 'NEEDS_REVIEW' : 'AUTO_CATEGORIZED';
      if (!enr) {
        await db.productEnrichment.create({
          data: {
            rawProductId: productId,
            canonicalBrand: raw.brand,
            canonicalName: canonicalModelForGoodBuyGear(raw.title, k.brand, k.productType),
            tmbcCategory: k.tmbcCategory,
            productType: k.productType,
            parentJourney: k.parentJourney,
            tags: k.tags,
            confidenceScore: k.confidenceScore,
            needsReview: k.needsReview,
            reviewStatus: autoStatus,
          },
        });
        enriched += 1;
      } else if (enr.reviewStatus === 'AUTO_CATEGORIZED' || enr.reviewStatus === 'NEEDS_REVIEW') {
        await db.productEnrichment.update({
          where: { id: enr.id },
          data: {
            tmbcCategory: k.tmbcCategory,
            productType: k.productType,
            canonicalBrand: raw.brand,
            canonicalName: canonicalModelForGoodBuyGear(raw.title, k.brand, k.productType),
            parentJourney: k.parentJourney,
            confidenceScore: k.confidenceScore,
            needsReview: k.needsReview,
            reviewStatus: autoStatus,
          },
        });
        enriched += 1;
      } else {
        skippedReviewed += 1; // REVIEWED / HIDDEN — human-owned, never overwritten
      }
    } catch (e) {
      errors += 1;
      console.error(`[gbg] ${externalId}:`, e instanceof Error ? e.message : e);
    }
  }

  // GoodBuyGear products no longer in the catalog → inactive (scoped to this provider).
  const inactive = await db.affiliateCatalogProduct.updateMany({
    where: { provider: PROVIDER, lastSyncedAt: { lt: runStart }, isActiveInFeed: true },
    data: { isActiveInFeed: false },
  });

  console.log(
    `\n  created ${created} · updated ${updated} · enriched ${enriched} · images fetched ${imagesFetched} · skipped(reviewed) ${skippedReviewed} · errors ${errors} · deactivated ${inactive.count}`,
  );
  await db.$disconnect?.();
}

main().catch((error) => {
  console.error('[importGoodBuyGearCatalog] failed:', error);
  process.exit(1);
});
