/**
 * Import / sync the full affiliate catalog (Babylist via Impact, catalog 8981)
 * into AffiliateCatalogProduct + auto-categorized ProductEnrichment.
 *
 * Bulk load from the Google TXT feed (tab-delimited — unzip the upload first):
 *   npx tsx scripts/importAffiliateCatalog.ts --file="/path/Babylist-Product-Feed_GOOGLE_TXT.txt"
 * Ongoing (Heroku Scheduler) from a hosted feed URL:
 *   FEED_URL="https://…" npx tsx scripts/importAffiliateCatalog.ts
 * Test without writing / a small slice:
 *   npx tsx scripts/importAffiliateCatalog.ts --file="…" --dry-run
 *   npx tsx scripts/importAffiliateCatalog.ts --file="…" --limit=200
 *
 * AFFILIATE RULE: the feed `link` is the pre-tracked affiliate URL. It is stored
 * EXACTLY as provided — never reconstructed, cleaned, or regenerated.
 *
 * ENRICHMENT RULE: the sync may create enrichment + refresh AUTO-categorized
 * values, but NEVER overwrites TMBC fields once reviewStatus is REVIEWED/HIDDEN
 * (i.e. once Taylor has touched it).
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import { categorizeProduct } from '@/lib/catalog/categorize';

const PROVIDER = 'babylist_impact';
const CATALOG_ID = '8981';

type Args = { file?: string; url?: string; dryRun: boolean; limit: number | null };

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get = (name: string) => {
    const hit = argv.find((a) => a.startsWith(`--${name}=`));
    return hit ? hit.slice(name.length + 3) : undefined;
  };
  const limitRaw = get('limit');
  return {
    file: get('file'),
    url: get('url'),
    dryRun: argv.includes('--dry-run'),
    limit: limitRaw ? parseInt(limitRaw, 10) : null,
  };
}

function parsePrice(raw?: string): { price: number | null; currency: string } {
  if (!raw) return { price: null, currency: 'USD' };
  const [amt, cur] = raw.trim().split(/\s+/);
  const n = parseFloat(amt);
  return { price: Number.isFinite(n) ? n : null, currency: cur || 'USD' };
}

/** Decode the babylist.com landing URL from the affiliate link's `u=` param. */
function decodeDestination(link: string): string | null {
  if (!link) return null;
  try {
    const dest = new URL(link).searchParams.get('u');
    return dest ? decodeURIComponent(dest) : null;
  } catch {
    return null;
  }
}

function rowHash(row: Record<string, string>): string {
  const key = [row.title, row.price, row.sale_price, row.image_link, row.link, row.availability].join('|');
  return crypto.createHash('sha1').update(key).digest('hex');
}

async function loadFeed(args: Args): Promise<string> {
  if (args.file) return fs.readFileSync(args.file, 'utf8');
  const url = args.url || process.env.FEED_URL;
  if (url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Feed fetch failed: ${res.status} ${res.statusText}`);
    return res.text();
  }
  throw new Error('Provide --file=<path> or set FEED_URL.');
}

function parseTsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return [];
  const header = lines[0].split('\t');
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    const row: Record<string, string> = {};
    header.forEach((h, idx) => {
      row[h] = (cols[idx] ?? '').trim();
    });
    rows.push(row);
  }
  return rows;
}

function buildRaw(row: Record<string, string>, runStart: Date) {
  const affiliateUrl = (row.link || '').trim(); // PRESERVE EXACTLY
  const { price, currency } = parsePrice(row.price);
  const { price: salePrice } = parsePrice(row.sale_price);
  const availability = (row.availability || '').trim();
  return {
    provider: PROVIDER,
    catalogId: CATALOG_ID,
    externalId: (row.id || '').trim(),
    sku: (row.id || '').trim() || null,
    gtin: row.gtin || null,
    brand: row.brand || null,
    title: row.title,
    description: row.description || null,
    rawCategory: row.google_product_category || null,
    productTypePath: row.product_type || null,
    price,
    salePrice: salePrice ?? null,
    currency,
    imageUrl: row.image_link || null,
    productUrl: decodeDestination(affiliateUrl),
    affiliateUrl: affiliateUrl || null,
    availability: availability || null,
    inStock: /in.?stock/i.test(availability),
    itemGroupId: row.item_group_id || null,
    color: row.color || null,
    material: row.material || null,
    size: row.size || null,
    gender: row.gender || null,
    ageGroup: row.age_group || null,
    retailer: 'Babylist',
    rawPayload: row,
    feedHash: rowHash(row),
    lastSyncedAt: runStart,
  };
}

async function main() {
  const args = parseArgs();
  const runStart = new Date();
  const fullRun = args.limit == null;

  const text = await loadFeed(args);
  let rows = parseTsv(text);
  if (args.limit != null) rows = rows.slice(0, args.limit);

  // ── Dry run: validate parsing + categorization, no DB writes ──
  if (args.dryRun) {
    const dist: Record<string, number> = {};
    let needReview = 0;
    for (const row of rows) {
      if (!row.id || !row.title) continue;
      const cat = categorizeProduct({
        title: row.title,
        brand: row.brand,
        productTypePath: row.product_type,
        rawCategory: row.google_product_category,
      });
      dist[cat.tmbcCategory] = (dist[cat.tmbcCategory] ?? 0) + 1;
      if (cat.needsReview) needReview += 1;
    }
    console.log(`\n── DRY RUN (no writes) · ${rows.length} feed rows ──`);
    Object.entries(dist)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, n]) => console.log(`  ${String(n).padStart(5)}  ${cat}`));
    console.log(`\n  needs review: ${needReview} / ${rows.length}`);
    console.log('  Sample affiliate URL (stored verbatim):');
    console.log(`    ${rows.find((r) => r.link)?.link ?? '(none)'}`);
    return;
  }

  // Lazy-load Prisma only for real runs — keeps --dry-run dependency-free and lets
  // `tsc --noEmit` stay green before `prisma generate` adds the new model types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = ((await import('@/lib/server/prisma')).default) as any;

  let created = 0;
  let updated = 0;
  let autoCategorized = 0;
  let needingReview = 0;
  let skippedReviewed = 0;
  let errors = 0;

  for (const row of rows) {
    const externalId = (row.id || '').trim();
    if (!externalId || !row.title) continue;
    const raw = buildRaw(row, runStart);

    try {
      const existing = await db.affiliateCatalogProduct.findUnique({
        where: { provider_externalId: { provider: PROVIDER, externalId } },
        select: { id: true, feedHash: true },
      });

      let productId: string;
      if (!existing) {
        const row2 = await db.affiliateCatalogProduct.create({
          data: { ...raw, firstSeenAt: runStart, isActiveInFeed: true, lastChangedAt: runStart },
          select: { id: true },
        });
        productId = row2.id;
        created += 1;
      } else {
        const changed = existing.feedHash !== raw.feedHash;
        await db.affiliateCatalogProduct.update({
          where: { id: existing.id },
          data: { ...raw, isActiveInFeed: true, ...(changed ? { lastChangedAt: runStart } : {}) },
        });
        productId = existing.id;
        updated += 1;
      }

      // ── Enrichment (sync-protected) ──
      const enr = await db.productEnrichment.findUnique({
        where: { rawProductId: productId },
        select: { id: true, reviewStatus: true },
      });
      const cat = categorizeProduct({
        title: raw.title,
        brand: raw.brand,
        productTypePath: raw.productTypePath,
        rawCategory: raw.rawCategory,
      });
      const autoStatus = cat.needsReview ? 'NEEDS_REVIEW' : 'AUTO_CATEGORIZED';

      if (!enr) {
        await db.productEnrichment.create({
          data: {
            rawProductId: productId,
            canonicalBrand: raw.brand,
            canonicalName: raw.title,
            tmbcCategory: cat.tmbcCategory,
            productType: cat.productType,
            parentJourney: cat.parentJourney,
            tags: cat.tags,
            confidenceScore: cat.confidenceScore,
            needsReview: cat.needsReview,
            reviewStatus: autoStatus,
          },
        });
        autoCategorized += 1;
        if (cat.needsReview) needingReview += 1;
      } else if (enr.reviewStatus === 'AUTO_CATEGORIZED' || enr.reviewStatus === 'NEEDS_REVIEW') {
        // Not yet human-reviewed → safe to refresh the auto fields only.
        await db.productEnrichment.update({
          where: { id: enr.id },
          data: {
            tmbcCategory: cat.tmbcCategory,
            productType: cat.productType,
            parentJourney: cat.parentJourney,
            confidenceScore: cat.confidenceScore,
            needsReview: cat.needsReview,
            reviewStatus: autoStatus,
          },
        });
        autoCategorized += 1;
        if (cat.needsReview) needingReview += 1;
      } else {
        // REVIEWED or HIDDEN → human-owned. Never overwrite.
        skippedReviewed += 1;
      }
    } catch (e) {
      errors += 1;
      console.error(`[import] ${externalId}:`, e instanceof Error ? e.message : e);
    }
  }

  // Products no longer present in the feed → inactive (full runs only; never deleted).
  let markedInactive = 0;
  if (fullRun) {
    const res = await db.affiliateCatalogProduct.updateMany({
      where: { provider: PROVIDER, lastSyncedAt: { lt: runStart }, isActiveInFeed: true },
      data: { isActiveInFeed: false },
    });
    markedInactive = res.count;
  }

  console.log('\n── Affiliate catalog import ──');
  console.log(`  feed rows:               ${rows.length}`);
  console.log(`  created:                 ${created}`);
  console.log(`  updated:                 ${updated}`);
  console.log(`  auto-categorized:        ${autoCategorized}`);
  console.log(`  needing review:          ${needingReview}`);
  console.log(`  skipped (human-reviewed): ${skippedReviewed}`);
  console.log(`  marked inactive:         ${markedInactive}`);
  console.log(`  errors:                  ${errors}`);

  await db.$disconnect?.();
}

main().catch((e) => {
  console.error('[importAffiliateCatalog] failed:', e);
  process.exitCode = 1;
});
