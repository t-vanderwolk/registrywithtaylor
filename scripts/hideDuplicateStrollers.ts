/**
 * Hide a batch of duplicate / older-model / bundle strollers from BOTH tools:
 *  - Finder + checker browse: hide the matching catalog products (reviewStatus →
 *    HIDDEN, isPublic false) so they drop out of the public stroller catalog.
 *  - Checker compatibility: delete the matching Stroller rows (Compatibility +
 *    StrollerSpec cascade).
 *
 * Requested hides: Bugaboo Butterfly Complete + Butterfly 2 Complete, Bee 5,
 * Donkey 3, Fox 2, Reef; Baby Jogger City Prix (+ Bike Trailer bundle); TRVL
 * Easy Fold Compact; Bumbleride Indie Twin Double; Joolz Day+ / Day+ Complete;
 * Joolz Hub (older, NOT Hub2); Mockingbird Single-to-Double 3.0.
 *
 * DRY RUN BY DEFAULT — review the matches, then re-run with --apply.
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:hide-duplicates
 *   DB=... npm run catalog:hide-duplicates-apply
 */
import prismaBase from '@/lib/server/prisma';
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

// brand optional — when set, the canonical brand must match too (tighter).
const SPECS: { label: string; brand?: string; re: RegExp }[] = [
  // (Bugaboo Butterfly / Butterfly 2 are intentionally KEPT — restored per request.)
  { label: 'Bugaboo Bee 5', brand: 'Bugaboo', re: /\bbee ?5\b/i },
  { label: 'Bugaboo Donkey 3', brand: 'Bugaboo', re: /\bdonkey ?3\b/i },
  { label: 'Bugaboo Fox 2', brand: 'Bugaboo', re: /\bfox ?2\b/i },
  { label: 'Bugaboo Reef', brand: 'Bugaboo', re: /\breef\b/i },
  { label: 'Baby Jogger City Prix', brand: 'Baby Jogger', re: /\bcity prix\b/i },
  { label: 'Bike Trailer bundle', re: /\bbike trailer\b/i },
  // (Nuna TRVL LX / TRVL Easy Fold / TRVL DUBL are intentionally KEPT — shown per request.)
  { label: 'Joolz Day+ / Day+ Complete', brand: 'Joolz', re: /\bday\s*\+/i },
  // "Hub" but not "Hub2" / "Hub²" (the current model we keep).
  { label: 'Joolz Hub (older, not Hub2)', brand: 'Joolz', re: /\bhub\b(?![²2])/i },
  // (Mockingbird Single / Single-to-Double are intentionally KEPT — restored per request.)
];

function matchLabel(brand: string | null | undefined, text: string): string | null {
  const cb = canonicalBrand(brand ?? '').toLowerCase();
  const hit = SPECS.find((s) => (!s.brand || s.brand.toLowerCase() === cb) && s.re.test(text));
  return hit ? hit.label : null;
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Hide duplicate strollers ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  // --- Finder + checker browse (catalog) ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const catalogRows: any[] = await db.affiliateCatalogProduct.findMany({
    where: { enrichment: { is: { tmbcCategory: 'Strollers' } } },
    select: {
      id: true,
      brand: true,
      title: true,
      enrichment: { select: { id: true, productType: true, reviewStatus: true, canonicalBrand: true, canonicalName: true } },
    },
  });
  const catalogHits = catalogRows
    .map((r) => ({
      ...r,
      label: matchLabel(r.enrichment?.canonicalBrand ?? r.brand, `${r.enrichment?.canonicalName ?? ''} ${r.title}`),
    }))
    .filter((r) => r.label && strollerCategoryFromProductType(r.enrichment?.productType));
  const catalogToHide = catalogHits.filter((r) => r.enrichment && r.enrichment.reviewStatus !== 'HIDDEN');

  // --- Checker compatibility (Stroller table) ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const strollerRows: any[] = await db.stroller.findMany({
    select: { id: true, brand: true, model: true, displayName: true },
  });
  const strollerHits = strollerRows
    .map((r) => ({ ...r, label: matchLabel(r.brand, `${r.model} ${r.displayName ?? ''}`) }))
    .filter((r) => r.label);

  console.log(`  FINDER (catalog) — ${catalogToHide.length} to hide (${catalogHits.length} matched):`);
  catalogHits
    .sort((a, b) => (a.label as string).localeCompare(b.label as string))
    .forEach((r) =>
      console.log(`    [${r.label}] ${r.enrichment?.reviewStatus === 'HIDDEN' ? '(already hidden) ' : ''}${r.title.slice(0, 60)}`),
    );

  console.log(`\n  CHECKER (Stroller table) — ${strollerHits.length} to delete:`);
  strollerHits
    .sort((a, b) => (a.label as string).localeCompare(b.label as string))
    .forEach((r) => console.log(`    [${r.label}] ${r.brand} | ${r.model}${r.displayName ? ' | ' + r.displayName : ''}`));

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Review the matches, then re-run with --apply.)');
    return;
  }

  const enrichIds = catalogToHide.map((r) => r.enrichment.id);
  if (enrichIds.length) {
    const res = await db.productEnrichment.updateMany({
      where: { id: { in: enrichIds } },
      data: { reviewStatus: 'HIDDEN', isPublic: false },
    });
    console.log(`\n  Hid ${res.count} catalog products (finder + checker browse).`);
  }
  const strollerIds = strollerHits.map((r) => r.id);
  if (strollerIds.length) {
    const res = await db.stroller.deleteMany({ where: { id: { in: strollerIds } } });
    console.log(`  Deleted ${res.count} Stroller rows (checker compatibility; cascaded).`);
  }
  if (!enrichIds.length && !strollerIds.length) console.log('\n  Nothing to hide.');
}

main()
  .catch((error) => {
    console.error('[hideDuplicateStrollers] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
