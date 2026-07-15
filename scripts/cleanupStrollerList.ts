/**
 * Clean up the stroller catalog: remove products that are already HIDDEN, and
 * de-duplicate strollers that collapse to the same brand + model (keeping the
 * best row of each group).
 *
 * Default is a DRY RUN that only reports. Choose how to apply:
 *   --hide     mark the extras HIDDEN (reversible; survives a feed re-import)
 *   --delete   hard-delete the rows (irreversible; feed rows may return on the
 *              next import, so --hide is usually the durable choice)
 *   --restore  UNDO: for any model whose variants were all hidden (so it vanished
 *              from the finder), un-hide the best one so the model reappears.
 *
 *   npx tsx scripts/cleanupStrollerList.ts             # dry run (report only)
 *   npx tsx scripts/cleanupStrollerList.ts --hide
 *   npx tsx scripts/cleanupStrollerList.ts --delete
 *   npx tsx scripts/cleanupStrollerList.ts --restore   # dry run of the undo
 *   npx tsx scripts/cleanupStrollerList.ts --restore --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:cleanup-strollers-hide
 */
import prismaBase from '@/lib/server/prisma';
import { canonicalStrollerBrand } from '@/lib/catalog/strollerFinderRules';
import { parseStrollerModel } from '@/lib/catalog/strollerModel';
import { normalizeStrollerVariantModel } from '@/lib/catalog/strollerVariantIdentity';
import { productModelKey } from '@/lib/catalog/modelIdentity';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

type Row = {
  id: string;
  brand: string | null;
  title: string;
  price: number | null;
  imageUrl: string | null;
  affiliateUrl: string | null;
  isActiveInFeed: boolean;
  enrichment: {
    id: string;
    reviewStatus: string | null;
    needsReview: boolean | null;
    canonicalBrand: string | null;
    canonicalName: string | null;
  } | null;
};

/** Matches the finder's public filter: active, not hidden/needs-review. */
function isFinderVisible(r: Row): boolean {
  const e = r.enrichment;
  return Boolean(
    r.isActiveInFeed && e && !e.needsReview && e.reviewStatus !== 'HIDDEN' && e.reviewStatus !== 'NEEDS_REVIEW',
  );
}

function variantKey(r: Row): string {
  const brand = canonicalStrollerBrand((r.enrichment?.canonicalBrand || r.brand || '').trim());
  const rawModel = r.enrichment?.canonicalName || parseStrollerModel(r.title, brand) || r.title;
  return productModelKey(brand, normalizeStrollerVariantModel(rawModel, brand) || rawModel);
}

/** Higher = keep. Prefer rows that actually carry a buy link, price, image. */
function keepScore(r: Row): number {
  return (
    (r.affiliateUrl?.trim() ? 8 : 0) +
    (r.price != null ? 4 : 0) +
    (r.imageUrl?.trim() ? 2 : 0) +
    (r.isActiveInFeed ? 1 : 0)
  );
}

async function main() {
  const hide = process.argv.includes('--hide');
  const del = process.argv.includes('--delete');
  const restore = process.argv.includes('--restore');
  const applyFlag = process.argv.includes('--apply');
  const apply = restore ? applyFlag : hide || del;

  const rows: Row[] = await db.affiliateCatalogProduct.findMany({
    where: { enrichment: { is: { tmbcCategory: 'Strollers' } } },
    select: {
      id: true, brand: true, title: true, price: true, imageUrl: true, affiliateUrl: true, isActiveInFeed: true,
      enrichment: { select: { id: true, reviewStatus: true, needsReview: true, canonicalBrand: true, canonicalName: true } },
    },
  });

  // ── Restore (undo an over-aggressive --hide) ──────────────────────────────
  // For every model group with NO finder-visible row, un-hide the best hidden
  // one so the model reappears. Leaves models that still show one alone.
  if (restore) {
    const byKey = new Map<string, Row[]>();
    for (const r of rows) (byKey.get(variantKey(r)) ?? byKey.set(variantKey(r), []).get(variantKey(r))!).push(r);

    const toRestore: Row[] = [];
    for (const g of byKey.values()) {
      if (g.some(isFinderVisible)) continue; // still has a visible card — skip
      const hidden = g.filter((r) => r.enrichment && r.enrichment.reviewStatus === 'HIDDEN');
      if (hidden.length === 0) continue;
      toRestore.push([...hidden].sort((a, b) => keepScore(b) - keepScore(a) || a.title.length - b.title.length)[0]);
    }

    console.log(`── Restore vanished strollers ──  (${apply ? 'APPLY' : 'dry-run'})\n`);
    console.log(`  models with no visible variant: ${toRestore.length}\n`);
    for (const r of toRestore.slice(0, 120)) console.log(`    ✚ ${r.brand ?? '?'} — ${r.title}`);
    if (toRestore.length > 120) console.log(`    …and ${toRestore.length - 120} more`);

    if (!apply) {
      console.log('\n  (dry run — nothing changed. Re-run with --restore --apply.)');
      return;
    }
    const enrichmentIds = toRestore.map((r) => r.enrichment!.id);
    const res = await db.productEnrichment.updateMany({
      where: { id: { in: enrichmentIds } },
      data: { reviewStatus: 'REVIEWED', isPublic: true, needsReview: false },
    });
    console.log(`\n  Restored ${res.count} model(s) to the finder.`);
    return;
  }

  const hidden = rows.filter((r) => r.enrichment?.reviewStatus === 'HIDDEN');
  const visible = rows.filter((r) => r.enrichment?.reviewStatus !== 'HIDDEN');

  // Group the visible rows by canonical brand + normalized variant model.
  const groups = new Map<string, Row[]>();
  for (const r of visible) {
    const brand = canonicalStrollerBrand((r.enrichment?.canonicalBrand || r.brand || '').trim());
    const rawModel = r.enrichment?.canonicalName || parseStrollerModel(r.title, brand) || r.title;
    const key = productModelKey(brand, normalizeStrollerVariantModel(rawModel, brand) || rawModel);
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(r);
  }

  const dupExtras: Row[] = [];
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    const sorted = [...g].sort((a, b) => keepScore(b) - keepScore(a) || a.title.length - b.title.length);
    dupExtras.push(...sorted.slice(1)); // keep the first, the rest are duplicates
  }

  console.log(`── Clean up stroller list ──  (${del ? 'DELETE' : hide ? 'HIDE' : 'dry-run'})\n`);
  console.log(`  hidden rows:        ${hidden.length}`);
  console.log(`  duplicate extras:   ${dupExtras.length}`);
  console.log(`  total to remove:    ${hidden.length + dupExtras.length}\n`);

  const removeHidden = hidden;
  const removeDupes = dupExtras;

  if (removeHidden.length) {
    console.log('  Hidden:');
    for (const r of removeHidden.slice(0, 60)) console.log(`    · ${r.brand ?? '?'} — ${r.title}`);
    if (removeHidden.length > 60) console.log(`    …and ${removeHidden.length - 60} more`);
  }
  if (removeDupes.length) {
    console.log('\n  Duplicate extras (kept the best of each group):');
    for (const r of removeDupes.slice(0, 60)) console.log(`    · ${r.brand ?? '?'} — ${r.title}`);
    if (removeDupes.length > 60) console.log(`    …and ${removeDupes.length - 60} more`);
  }

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --hide or --delete.)');
    return;
  }

  const ids = [...removeHidden, ...removeDupes].map((r) => r.id);
  const enrichmentIds = [...removeHidden, ...removeDupes].map((r) => r.enrichment?.id).filter(Boolean);

  if (del) {
    const res = await db.affiliateCatalogProduct.deleteMany({ where: { id: { in: ids } } });
    console.log(`\n  Deleted ${res.count} stroller row(s). (Feed rows may return on the next import.)`);
  } else {
    const res = await db.productEnrichment.updateMany({
      where: { id: { in: enrichmentIds } },
      data: { reviewStatus: 'HIDDEN', isPublic: false },
    });
    console.log(`\n  Hid ${res.count} stroller row(s) (reversible).`);
  }
}

main()
  .catch((error) => {
    console.error('[cleanupStrollerList] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
