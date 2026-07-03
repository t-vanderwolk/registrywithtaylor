/**
 * Clean the affiliate catalog: KEEP only strollers, infant car seats, and car
 * seat adapters. DELETE everything else (accessories, bassinets, convertible /
 * booster / all-in-one car seats, travel systems, bases, nursery, feeding, and
 * any product with no enrichment). ProductEnrichment cascades on delete.
 *
 * KEEP:
 *   • Strollers        — tmbcCategory "Strollers" with a stroller productType
 *   • Infant car seats — productType "infant car seat"
 *   • Car seat adapters — productType "car seat adapter" / "infant car seat
 *                          adapter" / "stroller adapter"
 *
 * DRY RUN BY DEFAULT — review the breakdown, then re-run with --apply.
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:clean
 *   DB=... npm run catalog:clean-apply
 */
import prismaBase from '@/lib/server/prisma';
import { STROLLER_PRODUCT_TYPES } from '@/lib/catalog/taxonomy';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const STROLLER_TYPES = new Set<string>(STROLLER_PRODUCT_TYPES);
const INFANT_SEAT_TYPES = new Set(['infant car seat']);
const ADAPTER_TYPES = new Set(['car seat adapter', 'infant car seat adapter', 'stroller adapter']);

type Row = {
  id: string;
  brand: string | null;
  title: string;
  enrichment: { tmbcCategory: string | null; productType: string | null } | null;
};

function isKeeper(row: Row): boolean {
  const e = row.enrichment;
  if (!e) return false; // no enrichment = uncategorized → delete
  const pt = (e.productType ?? '').toLowerCase().trim();
  // Infant car seats + car seat adapters (checked first so "stroller adapter"
  // isn't swept up by the stroller rule below).
  if (INFANT_SEAT_TYPES.has(pt)) return true;
  if (ADAPTER_TYPES.has(pt)) return true;
  // Strollers — keep regardless of (mis)category and tolerant of feed spellings
  // (e.g. "full size stroller", "double travel stroller", "lightweight stroller"),
  // but NOT stroller accessories.
  if (STROLLER_TYPES.has(pt)) return true;
  if (pt.includes('stroller') && pt !== 'stroller accessory') return true;
  return false;
}

function bucket(row: Row): string {
  const e = row.enrichment;
  if (!e) return '(no enrichment)';
  return `${e.tmbcCategory ?? '(no category)'} :: ${e.productType ?? '(no type)'}`;
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Clean affiliate catalog (keep strollers, infant car seats, adapters) ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  const rows: Row[] = await db.affiliateCatalogProduct.findMany({
    select: { id: true, brand: true, title: true, enrichment: { select: { tmbcCategory: true, productType: true } } },
  });

  const keep = rows.filter(isKeeper);
  const toDelete = rows.filter((r) => !isKeeper(r));

  console.log(`Total catalog products: ${rows.length}`);
  console.log(`  KEEP:   ${keep.length}`);
  console.log(`  DELETE: ${toDelete.length}\n`);

  // Breakdown of what's kept.
  const keepByType = new Map<string, number>();
  for (const r of keep) keepByType.set(bucket(r), (keepByType.get(bucket(r)) ?? 0) + 1);
  console.log('  Keeping, by category :: type:');
  [...keepByType.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, n]) => console.log(`     ${String(n).padStart(4)}  ${k}`));

  // Breakdown of what's deleted.
  const delByType = new Map<string, number>();
  for (const r of toDelete) delByType.set(bucket(r), (delByType.get(bucket(r)) ?? 0) + 1);
  console.log('\n  Deleting, by category :: type:');
  [...delByType.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, n]) => console.log(`     ${String(n).padStart(4)}  ${k}`));

  if (!apply) {
    console.log('\n  (dry run — nothing deleted. Review the breakdown, then re-run with --apply.)');
    return;
  }

  const ids = toDelete.map((r) => r.id);
  const BATCH = 500;
  let deleted = 0;
  for (let i = 0; i < ids.length; i += BATCH) {
    const res = await db.affiliateCatalogProduct.deleteMany({ where: { id: { in: ids.slice(i, i + BATCH) } } });
    deleted += res.count;
  }
  console.log(`\n  Deleted ${deleted} catalog products (enrichment cascaded). Kept ${keep.length}.`);
}

main()
  .catch((error) => {
    console.error('[cleanAffiliateCatalog] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
