/**
 * Pull the Albee Baby catalog from CJ Affiliate (Commission Junction) and store
 * its strollers + infant car seats in the affiliate catalog (provider
 * "cj_albeebaby"), categorized with the same engine as Babylist / GoodBuyGear.
 * Accessories and everything that isn't a stroller or infant car seat is skipped.
 *
 * Auth: Bearer CJ_PERSONAL_ACCESS_TOKEN against CJ's GraphQL endpoint.
 *   CJ_PUBLISHER_ID_OR_CID   — your CJ company (publisher) id
 *   CJ_ALLOWED_ADVERTISERS   — advertiser id(s), comma-separated (Albee Baby)
 *
 * CJ `link` is the tracked affiliate URL — stored EXACTLY as returned.
 *
 *   npx tsx scripts/importCjAlbeebaby.ts            # dry run (default)
 *   npx tsx scripts/importCjAlbeebaby.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:import-cj
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { categorizeProduct } from '@/lib/catalog/categorize';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';

// Load .env for local CLI runs without a dotenv dependency; never overrides a
// variable already exported in the shell.
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
    /* .env optional */
  }
}
loadDotEnv();

const CJ_ENDPOINT = 'https://ads.api.cj.com/query';
const TOKEN = process.env.CJ_PERSONAL_ACCESS_TOKEN;
const COMPANY_ID = process.env.CJ_PUBLISHER_ID_OR_CID;
const ADVERTISERS = (process.env.CJ_ALLOWED_ADVERTISERS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const PROVIDER = 'cj_albeebaby';
const PID = process.env.CJ_PROPERTY_ID_OR_PID;

// Accessory / part false-positives — names with "stroller"/"car seat"/a model
// that aren't the product itself. Skipped before categorizing.
const ACCESSORY_RE =
  /\b(?:adapter|adaptor|\bbag\b|tote|caddy|organi[sz]er|cup ?holder|\btray\b|belly bar|bumper bar|rain ?cover|rain ?shield|rainshield|weather ?shield|sun ?shade|sunshade|sun ?cover|parasol|\bcanopy\b|footmuff|bunting|cocoon|blanket|\bsheet\b|\bliner\b|\binsert\b|cushion|mattress|\bpad\b|bassinet|carry ?cot|\bcot\b|second seat|sibling seat|rumble ?seat|seat pack|seat pad|ride[- ]?along|ride[- ]?on|skateboard|glider board|piggy ?back|\bboard\b|wheel ?kit|sidewall|\bkit\b|inner tube|\btube\b|\btire\b|\bwheel\b|replacement|\bstand\b|console|\bhook\b|cage|mosquito|\bnet\b|skirt|apron|\bmuff\b|sleeve|\brug\b|\bcover\b|\bbundle\b)\b/i;

const KNOWN_BRANDS = [
  'Baby Jogger', 'Silver Cross', 'Maxi-Cosi', 'Peg Perego', 'Orbit Baby', 'Delta Children', 'Radio Flyer',
  'BOB Gear', 'Baby Trend', 'Valco Baby', 'Guava Family', 'Charlie Crane', 'Mountain Buggy',
  'UPPAbaby', 'Bugaboo', 'Cybex', 'Nuna', 'Joolz', 'Joie', 'Chicco', 'Graco', 'Britax', 'Bumbleride',
  'Mockingbird', 'Mompush', 'Thule', 'Stokke', 'Evenflo', 'Veer', 'Clek', 'Doona', 'Romer', 'Ergobaby',
  'Inglesina', 'Zoe', 'WonderFold', 'Larktale', 'Colugo', 'Mima', 'Jeep', 'Ingenuity', 'Summer',
  'Munchkin', 'Bombi', 'Babyark', 'Diono', 'Cosatto', 'Babyzen', 'Keenz', 'egg',
].sort((a, b) => b.length - a.length);

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

type CjMoney = { amount?: string | number; currency?: string } | null;
type CjProduct = {
  id?: string;
  advertiserId?: string;
  advertiserName?: string;
  title?: string;
  description?: string;
  brand?: string;
  link?: string;
  linkCode?: { clickUrl?: string | null } | null;
  imageLink?: string;
  availability?: string;
  price?: CjMoney;
  salePrice?: CjMoney;
  productType?: string[] | string | null;
};

function parsePrice(v?: CjMoney): number | null {
  if (!v || v.amount == null) return null;
  const n = Number(String(v.amount).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function pathOf(p: CjProduct): string {
  return Array.isArray(p.productType) ? p.productType.join(' > ') : (p.productType ?? '');
}

/** Decode the real destination from a CJ click URL, for image scraping only. */
function decodeCjDestination(link: string): string | null {
  if (!link) return null;
  try {
    const u = new URL(link);
    const param = u.searchParams.get('url') || u.searchParams.get('u');
    if (param) return decodeURIComponent(param);
    // CJ deep links embed the destination as a trailing http(s) URL in the path.
    const m = link.match(/https?(?::|%3A)[^\s]+$/i);
    if (m) return m[0].includes('%3A') ? decodeURIComponent(m[0]) : m[0];
    return null;
  } catch {
    return null;
  }
}

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

async function cjGraphql<T>(query: string): Promise<T> {
  const res = await fetch(CJ_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`CJ ${res.status} ${res.statusText} — ${text.slice(0, 500)}`);
  const json = JSON.parse(text) as { data?: T; errors?: unknown };
  if (json.errors) throw new Error(`CJ GraphQL errors: ${JSON.stringify(json.errors).slice(0, 500)}`);
  if (!json.data) throw new Error(`CJ returned no data: ${text.slice(0, 300)}`);
  return json.data;
}

type ShoppingResult = { shoppingProducts: { totalCount: number; count: number; resultList: CjProduct[] } };

async function* listProducts(): AsyncGenerator<CjProduct[]> {
  const limit = 1000;
  let offset = 0;
  // Only the CJ numeric advertiser CIDs can be passed to partnerIds; names are
  // filtered client-side after the pull.
  const numericAdvertisers = ADVERTISERS.filter((a) => /^\d+$/.test(a));
  const partnerArg = numericAdvertisers.length
    ? `, partnerIds: [${numericAdvertisers.map((a) => `"${a}"`).join(', ')}]`
    : '';
  // CJ returns the raw destination in `link`; a tracked click URL needs your PID.
  const linkCodeField = PID ? ` linkCode(pid: "${PID}") { clickUrl }` : '';
  for (let guard = 0; guard < 500; guard += 1) {
    if (offset >= 10000) {
      console.log('  (CJ caps offset paging at 10,000 records — stopping. Set a numeric advertiser CID to narrow the pull.)');
      return;
    }
    const pageLimit = Math.min(limit, 10000 - offset);
    const query = `{
      shoppingProducts(companyId: "${COMPANY_ID}"${partnerArg}, limit: ${pageLimit}, offset: ${offset}) {
        totalCount
        count
        resultList {
          id advertiserId advertiserName title description brand link${linkCodeField} imageLink availability
          price { amount currency } salePrice { amount currency } productType
        }
      }
    }`;
    const data = await cjGraphql<ShoppingResult>(query);
    const sp = data.shoppingProducts;
    if (offset === 0) console.log(`  totalCount ${sp?.totalCount ?? '?'} across the matched advertisers`);
    const list = sp?.resultList ?? [];
    if (list.length === 0) return;
    yield list;
    offset += list.length;
    if (offset >= (sp.totalCount ?? 0)) return;
  }
}

async function main() {
  const apply = process.argv.includes('--apply');
  if (!TOKEN || !COMPANY_ID) throw new Error('Set CJ_PERSONAL_ACCESS_TOKEN and CJ_PUBLISHER_ID_OR_CID.');

  console.log('── CJ / Albee Baby catalog import ──');
  console.log(`  company ${COMPANY_ID} · advertisers ${ADVERTISERS.join(', ') || '(all joined)'}`);

  const allItems: CjProduct[] = [];
  for await (const page of listProducts()) {
    allItems.push(...page);
    console.log(`  …pulled ${allItems.length}`);
  }
  console.log(`  pulled ${allItems.length} products`);

  // Show every advertiser in the pull so you can grab Albee Baby's numeric CID.
  const advCount = new Map<string, { name: string; n: number }>();
  for (const p of allItems) {
    const id = p.advertiserId ?? '?';
    const e = advCount.get(id) ?? { name: p.advertiserName ?? '?', n: 0 };
    e.n += 1;
    advCount.set(id, e);
  }
  console.log('  advertisers found:');
  [...advCount.entries()].forEach(([id, e]) => console.log(`    ${id}  ${e.name}  (${e.n})`));

  // Filter to the configured advertiser(s); names match advertiserName, numeric CIDs were already server-filtered.
  const wantNames = ADVERTISERS.filter((a) => !/^\d+$/.test(a)).map((a) => a.toLowerCase());
  const items =
    wantNames.length > 0
      ? allItems.filter((p) => wantNames.some((w) => (p.advertiserName ?? '').toLowerCase().includes(w)))
      : allItems;
  console.log(`  matched advertiser filter: ${items.length}`);
  console.log('\n  raw sample (Title | Brand | productType):');
  items.slice(0, 5).forEach((p) =>
    console.log(`    ${(p.title ?? '').slice(0, 50)} | ${p.brand ?? ''} | ${pathOf(p).slice(0, 40)}`),
  );
  const sampleLinked = items.find((p) => p.linkCode?.clickUrl || p.link);
  console.log(
    `  sample link (stored verbatim — confirm it's a tracked CJ url): ${sampleLinked?.linkCode?.clickUrl ?? sampleLinked?.link ?? '(none)'}`,
  );

  type Keep = {
    item: CjProduct;
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
    const name = it.title ?? '';
    if (!it.id || !name) continue;
    if (ACCESSORY_RE.test(name)) continue;
    const brand = detectBrand(name);
    const cat = categorizeProduct({ title: name, brand, productTypePath: pathOf(it) });
    const isStroller = cat.tmbcCategory === 'Strollers' && !!strollerCategoryFromProductType(cat.productType);
    const isInfantSeat = cat.productType === 'infant car seat';
    if (!isStroller && !isInfantSeat) continue;
    keep.push({
      item: it,
      brand,
      productType: cat.productType!,
      tmbcCategory: cat.tmbcCategory,
      needsReview: cat.needsReview,
      confidenceScore: cat.confidenceScore,
      parentJourney: cat.parentJourney,
      tags: cat.tags,
    });
    dist[cat.productType!] = (dist[cat.productType!] ?? 0) + 1;
  }

  console.log(`\n  strollers + infant car seats kept: ${keep.length} of ${items.length}`);
  Object.entries(dist)
    .sort((a, b) => b[1] - a[1])
    .forEach(([t, n]) => console.log(`    ${String(n).padStart(4)}  ${t}`));
  console.log('\n  kept sample (first 18):');
  keep.slice(0, 18).forEach((k) => console.log(`    [${k.productType}] ${k.brand} · ${k.item.title ?? ''}`.slice(0, 88)));

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
    const externalId = (it.id || '').trim();
    const raw = {
      provider: PROVIDER,
      externalId,
      sku: externalId,
      brand: k.brand || null,
      title: it.title ?? '',
      description: it.description || null,
      productTypePath: pathOf(it) || null,
      price: parsePrice(it.price) ?? parsePrice(it.salePrice),
      currency: it.price?.currency || 'USD',
      imageUrl: it.imageLink || null,
      affiliateUrl: (it.linkCode?.clickUrl || it.link || '').trim() || null, // tracked link; PRESERVE EXACTLY
      availability: it.availability || null,
      inStock: /in.?stock|available/i.test(it.availability ?? ''),
      itemGroupId: null as string | null,
      retailer: 'Albee Baby',
      rawPayload: it as unknown,
      lastSyncedAt: runStart,
    };
    try {
      const existing = await db.affiliateCatalogProduct.findUnique({
        where: { provider_externalId: { provider: PROVIDER, externalId } },
        select: { id: true },
      });
      // New to the DB and no image from the feed → fetch one from the product page.
      if (!existing && !raw.imageUrl) {
        const landing = decodeCjDestination(it.link ?? '');
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
            canonicalName: raw.title,
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
            parentJourney: k.parentJourney,
            confidenceScore: k.confidenceScore,
            needsReview: k.needsReview,
            reviewStatus: autoStatus,
          },
        });
        enriched += 1;
      } else {
        skippedReviewed += 1;
      }
    } catch (e) {
      errors += 1;
      console.error(`[cj] ${externalId}:`, e instanceof Error ? e.message : e);
    }
  }

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
  console.error('[importCjAlbeebaby] failed:', error);
  process.exit(1);
});
