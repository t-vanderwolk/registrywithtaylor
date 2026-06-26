/**
 * Import the ANB Baby catalog from its Awin product datafeed (CSV.gz), keeping
 * only strollers + infant car seats (provider "awin_anbbaby"), categorized with
 * the same engine as Babylist / Albee Baby / GoodBuyGear.
 *
 * Tracked links come straight from the feed's `aw_deep_link` (already carries your
 * Awin publisher tracking) — stored EXACTLY as given.
 *
 * Feed URL is built from env (publisher / datafeed key / feed id):
 *   https://ui.awin.com/productdata-darwin-download/publisher/{AWIN_ID}/{AWIN_FEED_API_KEY}/1/feed/{AWIN_ANB_FEED_ID}.csv.gz
 *   …or set AWIN_ANB_FEED_URL to the full URL, or pass --file <path.csv|.gz>.
 *
 *   npx tsx scripts/importAwinAnb.ts                  # dry run (default)
 *   npx tsx scripts/importAwinAnb.ts --apply
 *   npx tsx scripts/importAwinAnb.ts --file feed.csv  # parse a local file instead
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:import-awin
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { categorizeProduct } from '@/lib/catalog/categorize';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';

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
    /* .env optional */
  }
}
loadDotEnv();

const PROVIDER = 'awin_anbbaby';
const AWIN_ID = process.env.AWIN_ID;
const FEED_KEY = process.env.AWIN_FEED_API_KEY;
const FEED_ID = process.env.AWIN_ANB_FEED_ID || 'F2965';
const FEED_URL =
  process.env.AWIN_ANB_FEED_URL ||
  (AWIN_ID && FEED_KEY
    ? `https://ui.awin.com/productdata-darwin-download/publisher/${AWIN_ID}/${FEED_KEY}/1/feed/${FEED_ID}.csv.gz`
    : null);

const ACCESSORY_RE =
  /\b(?:adapter|adaptor|\bbag\b|tote|caddy|organi[sz]er|cup ?holder|\btray\b|belly bar|bumper bar|rain ?cover|rain ?shield|rainshield|weather ?shield|sun ?shade|sunshade|sun ?cover|parasol|\bcanopy\b|footmuff|bunting|cocoon|blanket|\bsheet\b|\bliner\b|\binsert\b|cushion|mattress|\bpad\b|bassinet|carry ?cot|\bcot\b|second seat|sibling seat|rumble ?seat|seat pack|seat pad|ride[- ]?along|ride[- ]?on|skateboard|glider board|piggy ?back|\bboard\b|wheel ?kit|sidewall|\bkit\b|inner tube|\btube\b|\btire\b|\bwheel\b|replacement|\bstand\b|console|\bhook\b|cage|mosquito|\bnet\b|skirt|apron|\bmuff\b|sleeve|\brug\b|\bcover\b|\bbundle\b|\bframe\b|seat unit|base only|car ?seat base|protector|\bstorage\b|capsule cover)\b/i;

const KNOWN_BRANDS = [
  'Baby Jogger', 'Silver Cross', 'Maxi-Cosi', 'Peg Perego', 'Orbit Baby', 'Delta Children', 'Radio Flyer',
  'BOB Gear', 'Baby Trend', 'Valco Baby', 'Guava Family', 'Charlie Crane', 'Mountain Buggy',
  'UPPAbaby', 'Bugaboo', 'Cybex', 'Nuna', 'Joolz', 'Joie', 'Chicco', 'Graco', 'Britax', 'Bumbleride',
  'Mockingbird', 'Mompush', 'Thule', 'Stokke', 'Evenflo', 'Veer', 'Clek', 'Doona', 'Romer', 'Ergobaby',
  'Inglesina', 'Zoe', 'WonderFold', 'Larktale', 'Colugo', 'Mima', 'Jeep', 'Ingenuity', 'Summer',
  'Munchkin', 'Bombi', 'Babyark', 'Diono', 'Cosatto', 'Babyzen', 'Keenz', 'egg',
].sort((a, b) => b.length - a.length);
const KNOWN = new Set(KNOWN_BRANDS.map((b) => b.toLowerCase()));
const BRAND_ALIASES: Record<string, string> = { peg: 'Peg Perego', maxicosi: 'Maxi-Cosi' };

function detectBrand(name: string): string {
  const lower = name.toLowerCase().trim();
  for (const b of KNOWN_BRANDS) {
    const bl = b.toLowerCase();
    if (lower === bl || lower.startsWith(`${bl} `)) return b;
  }
  const first = name.trim().split(/[\s,]+/)[0] || 'Other';
  return BRAND_ALIASES[first.toLowerCase()] ?? first;
}

/** Prefer a known brand from the title; fall back to the feed's brand column. */
function pickBrand(brandField: string, title: string): string {
  const fromTitle = detectBrand(title);
  if (KNOWN.has(fromTitle.toLowerCase())) return fromTitle;
  if (brandField) {
    const fromField = detectBrand(brandField);
    return KNOWN.has(fromField.toLowerCase()) ? fromField : brandField.trim();
  }
  return fromTitle;
}

function parsePriceStr(s?: string | null): number | null {
  if (!s) return null;
  const n = Number(String(s).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Minimal RFC-4180 CSV parser (handles quoted fields with commas/newlines/""). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let q = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; } else q = false;
      } else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\r') { /* skip */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

async function loadFeed(fileArg?: string): Promise<string> {
  if (fileArg) {
    const buf = readFileSync(resolve(process.cwd(), fileArg));
    return fileArg.endsWith('.gz') ? gunzipSync(buf).toString('utf8') : buf.toString('utf8');
  }
  if (!FEED_URL) throw new Error('Set AWIN_ID + AWIN_FEED_API_KEY (+ AWIN_ANB_FEED_ID), or pass --file <path>.');
  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`Awin feed ${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  try { return gunzipSync(buf).toString('utf8'); } catch { return buf.toString('utf8'); }
}

type Item = {
  id: string;
  title: string;
  description: string;
  affiliateUrl: string;
  image: string;
  productType: string;
  brandRaw: string;
  price: number | null;
  availability: string;
  itemGroupId: string | null;
};

async function main() {
  const apply = process.argv.includes('--apply');
  const fi = process.argv.indexOf('--file');
  const fileArg = fi >= 0 ? process.argv[fi + 1] : undefined;

  const text = (await loadFeed(fileArg)).replace(/^﻿/, '');
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error('Feed parsed to <2 rows — check the source.');
  const header = rows[0].map((h) => h.replace(/^﻿/, '').trim());
  const at = (name: string) => header.indexOf(name);
  const c = {
    id: at('id'), title: at('title'), description: at('description'),
    deep: at('aw_deep_link'), link: at('link'),
    image: at('image_link'), addImage: at('additional_image_link'),
    type: at('product_type'), brand: at('brand'),
    price: at('price'), sale: at('sale_price'),
    avail: at('availability'), group: at('item_group_id'),
  };
  const g = (r: string[], i: number) => (i >= 0 ? (r[i] ?? '').trim() : '');

  const items: Item[] = rows.slice(1).filter((r) => r.length > 1).map((r) => ({
    id: g(r, c.id),
    title: g(r, c.title),
    description: g(r, c.description),
    affiliateUrl: g(r, c.deep) || g(r, c.link),
    image: g(r, c.image) || g(r, c.addImage),
    productType: g(r, c.type),
    brandRaw: g(r, c.brand),
    price: parsePriceStr(g(r, c.price)) ?? parsePriceStr(g(r, c.sale)),
    availability: g(r, c.avail),
    itemGroupId: g(r, c.group) || null,
  }));

  console.log('── Awin / ANB Baby catalog import ──');
  console.log(`  source: ${fileArg ? `file ${fileArg}` : FEED_URL}`);
  console.log(`  rows in feed: ${items.length}`);
  const sample = items.find((i) => i.affiliateUrl);
  console.log(`  sample aw_deep_link (stored verbatim): ${sample?.affiliateUrl?.slice(0, 90) ?? '(none)'}`);

  type Keep = { item: Item; brand: string; productType: string; tmbcCategory: string; needsReview: boolean; confidenceScore: number; parentJourney: string | null; tags: string[] };
  const keep: Keep[] = [];
  const dist: Record<string, number> = {};
  for (const it of items) {
    if (!it.id || !it.title) continue;
    if (ACCESSORY_RE.test(it.title)) continue;
    const brand = pickBrand(it.brandRaw, it.title);
    const cat = categorizeProduct({ title: it.title, brand, productTypePath: it.productType });
    const isStroller = cat.tmbcCategory === 'Strollers' && !!strollerCategoryFromProductType(cat.productType);
    const isInfantSeat = cat.productType === 'infant car seat';
    if (!isStroller && !isInfantSeat) continue;
    keep.push({ item: it, brand, productType: cat.productType!, tmbcCategory: cat.tmbcCategory, needsReview: cat.needsReview, confidenceScore: cat.confidenceScore, parentJourney: cat.parentJourney, tags: cat.tags });
    dist[cat.productType!] = (dist[cat.productType!] ?? 0) + 1;
  }

  console.log(`\n  strollers + infant car seats kept: ${keep.length} of ${items.length}`);
  Object.entries(dist).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => console.log(`    ${String(n).padStart(4)}  ${t}`));
  const byBrand: Record<string, number> = {};
  keep.forEach((k) => (byBrand[k.brand] = (byBrand[k.brand] ?? 0) + 1));
  console.log('\n  by brand:');
  Object.entries(byBrand).sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([b, n]) => console.log(`    ${String(n).padStart(4)}  ${b}`));
  console.log('\n  kept sample (first 20):');
  keep.slice(0, 20).forEach((k) => console.log(`    [${k.productType}] ${k.brand} · ${k.item.title}`.slice(0, 92)));

  if (!apply) {
    console.log('\n  (dry run — nothing written. Re-run with --apply.)');
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = ((await import('@/lib/server/prisma')).default) as any;
  const runStart = new Date();
  let created = 0, updated = 0, enriched = 0, skippedReviewed = 0, errors = 0;

  for (const k of keep) {
    const it = k.item;
    const externalId = it.id;
    const raw = {
      provider: PROVIDER,
      externalId,
      sku: externalId,
      brand: k.brand || null,
      title: it.title,
      description: it.description || null,
      productTypePath: it.productType || null,
      price: it.price,
      currency: 'USD',
      imageUrl: it.image || null,
      affiliateUrl: it.affiliateUrl || null, // aw_deep_link — tracked; PRESERVE EXACTLY
      availability: it.availability || null,
      inStock: /in.?stock|available/i.test(it.availability),
      itemGroupId: it.itemGroupId,
      retailer: 'ANB Baby',
      rawPayload: it as unknown,
      lastSyncedAt: runStart,
    };
    try {
      const existing = await db.affiliateCatalogProduct.findUnique({
        where: { provider_externalId: { provider: PROVIDER, externalId } },
        select: { id: true },
      });
      let productId: string;
      if (!existing) {
        const r = await db.affiliateCatalogProduct.create({
          data: { ...raw, firstSeenAt: runStart, isActiveInFeed: true, lastChangedAt: runStart },
          select: { id: true },
        });
        productId = r.id;
        created += 1;
      } else {
        await db.affiliateCatalogProduct.update({ where: { id: existing.id }, data: { ...raw, isActiveInFeed: true } });
        productId = existing.id;
        updated += 1;
      }
      const enr = await db.productEnrichment.findUnique({ where: { rawProductId: productId }, select: { id: true, reviewStatus: true } });
      const autoStatus = k.needsReview ? 'NEEDS_REVIEW' : 'AUTO_CATEGORIZED';
      if (!enr) {
        await db.productEnrichment.create({
          data: { rawProductId: productId, canonicalBrand: raw.brand, canonicalName: raw.title, tmbcCategory: k.tmbcCategory, productType: k.productType, parentJourney: k.parentJourney, tags: k.tags, confidenceScore: k.confidenceScore, needsReview: k.needsReview, reviewStatus: autoStatus },
        });
        enriched += 1;
      } else if (enr.reviewStatus === 'AUTO_CATEGORIZED' || enr.reviewStatus === 'NEEDS_REVIEW') {
        await db.productEnrichment.update({ where: { id: enr.id }, data: { tmbcCategory: k.tmbcCategory, productType: k.productType, parentJourney: k.parentJourney, confidenceScore: k.confidenceScore, needsReview: k.needsReview, reviewStatus: autoStatus } });
        enriched += 1;
      } else {
        skippedReviewed += 1;
      }
    } catch (e) {
      errors += 1;
      console.error(`[awin] ${externalId}:`, e instanceof Error ? e.message : e);
    }
  }

  const inactive = await db.affiliateCatalogProduct.updateMany({
    where: { provider: PROVIDER, lastSyncedAt: { lt: runStart }, isActiveInFeed: true },
    data: { isActiveInFeed: false },
  });
  console.log(`\n  created ${created} · updated ${updated} · enriched ${enriched} · skipped(reviewed) ${skippedReviewed} · errors ${errors} · deactivated ${inactive.count}`);
  await db.$disconnect?.();
}

main().catch((error) => {
  console.error('[importAwinAnb] failed:', error);
  process.exit(1);
});
