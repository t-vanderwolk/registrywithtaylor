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

type ImpactItem = {
  Id: string;
  CatalogId?: string;
  CatalogItemId?: string;
  Name: string;
  Description?: string;
  Manufacturer?: string;
  Url: string;
  ImageUrl?: string;
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
  const envId = process.env.IMPACT_GOODBUYGEAR_CATALOG_ID;
  if (envId && envId.trim()) return envId.trim();

  const data = await get<{ Catalogs?: Array<{ Id: string; Name: string; NumberOfItems?: string }> }>(
    `${BASE_URL}/Mediapartners/${SID}/Catalogs`,
  );
  const catalogs = data?.Catalogs ?? [];
  if (catalogs.length === 0) {
    throw new Error(
      `No catalogs found for the GoodBuyGear account. Set IMPACT_GOODBUYGEAR_CATALOG_ID. Raw: ${JSON.stringify(data).slice(0, 400)}`,
    );
  }
  console.log('  GoodBuyGear catalogs on this account:');
  catalogs.forEach((c) => console.log(`    ${c.Id}  ${c.Name}  (${c.NumberOfItems ?? '?'} items)`));
  const pick = [...catalogs].sort((a, b) => Number(b.NumberOfItems ?? 0) - Number(a.NumberOfItems ?? 0))[0];
  console.log(`  → using catalog ${pick.Id} (${pick.Name}). Override with IMPACT_GOODBUYGEAR_CATALOG_ID.`);
  return pick.Id;
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
    const path = (it.Labels ?? []).join(' > ');
    const cat = categorizeProduct({ title: it.Name, brand: it.Manufacturer, productTypePath: path });
    const isStroller = cat.tmbcCategory === 'Strollers' && !!strollerCategoryFromProductType(cat.productType);
    const isInfantSeat = cat.productType === 'infant car seat';
    if (!isStroller && !isInfantSeat) continue;
    keep.push({
      item: it,
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
  console.log('\n  kept sample (first 14):');
  keep.slice(0, 14).forEach((k) =>
    console.log(`    [${k.productType}] ${`${k.item.Manufacturer ?? ''} ${k.item.Name}`.trim().slice(0, 74)}`),
  );

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
  let errors = 0;

  for (const k of keep) {
    const it = k.item;
    const externalId = (it.Id || '').trim();
    const raw = {
      provider: PROVIDER,
      catalogId,
      externalId,
      sku: externalId,
      brand: it.Manufacturer || null,
      title: it.Name,
      description: it.Description || null,
      productTypePath: (it.Labels ?? []).join(' > ') || null,
      price: parsePrice(it.CurrentPrice),
      currency: it.Currency || 'USD',
      imageUrl: it.ImageUrl || null,
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
    `\n  created ${created} · updated ${updated} · enriched ${enriched} · skipped(reviewed) ${skippedReviewed} · errors ${errors} · deactivated ${inactive.count}`,
  );
  await db.$disconnect?.();
}

main().catch((error) => {
  console.error('[importGoodBuyGearCatalog] failed:', error);
  process.exit(1);
});
