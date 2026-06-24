/**
 * Remove specific stroller models from BOTH tools:
 *  - Finder: hide the matching catalog products (reviewStatus → HIDDEN). Hiding
 *    also makes the stroller import skip them, so the checker deletes below stick
 *    across re-imports.
 *  - Checker: delete the matching rows from the Stroller table (Compatibility +
 *    StrollerSpec cascade automatically).
 *
 * Models removed: Bugaboo Bee 6, Bugaboo Lynx, Zoe Single (Tour), Zoe Double
 * (Twin), Cybex LIBELLE, Cybex Priam 4. (Cybex Priam Comfort / e-Priam are kept.)
 *
 *   npx tsx scripts/removeStrollerModels.ts            # dry run (default)
 *   npx tsx scripts/removeStrollerModels.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:remove-models
 */
import prismaBase from '@/lib/server/prisma';
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { strollerCategoryFromProductType } from '@/lib/catalog/strollerCategoryMap';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const SPECS: { label: string; brand: string; re: RegExp }[] = [
  { label: 'Bugaboo Bee 6', brand: 'Bugaboo', re: /\bbee ?6\b/i },
  { label: 'Bugaboo Lynx', brand: 'Bugaboo', re: /\blynx\b/i },
  { label: 'Zoe Single', brand: 'Zoe', re: /\b(?:single|tour)\b/i },
  { label: 'Zoe Double', brand: 'Zoe', re: /\b(?:double|twin)\b/i },
  { label: 'Cybex Priam 4', brand: 'Cybex', re: /\bpriam ?4\b/i },
  { label: 'Bugaboo Kangaroo Seat', brand: 'Bugaboo', re: /\bkangaroo seat\b/i },
];

// Brand strings to fetch (include the CYBEX casing variant we canonicalize).
const FETCH_BRANDS = ['Bugaboo', 'Zoe', 'Cybex', 'CYBEX'];

function matchLabel(brand: string | null, text: string): string | null {
  const cb = canonicalBrand(brand).toLowerCase();
  const hit = SPECS.find((s) => s.brand.toLowerCase() === cb && s.re.test(text));
  return hit ? hit.label : null;
}

async function main() {
  const apply = process.argv.includes('--apply');

  // --- Finder (catalog), strollers only ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const catalogRows: any[] = await db.affiliateCatalogProduct.findMany({
    where: { brand: { in: FETCH_BRANDS } },
    select: {
      id: true,
      brand: true,
      title: true,
      enrichment: { select: { id: true, productType: true, reviewStatus: true } },
    },
  });
  const catalogHits = catalogRows
    .map((r) => ({ ...r, label: matchLabel(r.brand, r.title) }))
    .filter((r) => r.label && strollerCategoryFromProductType(r.enrichment?.productType));
  const catalogToHide = catalogHits.filter((r) => r.enrichment && r.enrichment.reviewStatus !== 'HIDDEN');

  // --- Checker (Stroller table) ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const strollerRows: any[] = await db.stroller.findMany({
    where: { brand: { in: FETCH_BRANDS } },
    select: { id: true, brand: true, model: true, displayName: true },
  });
  const strollerHits = strollerRows
    .map((r) => ({ ...r, label: matchLabel(r.brand, `${r.model} ${r.displayName ?? ''}`) }))
    .filter((r) => r.label);

  console.log('── Remove stroller models from finder + checker ──');
  console.log(`\n  FINDER (catalog) — ${catalogToHide.length} to hide:`);
  catalogHits.forEach((r) =>
    console.log(
      `    [${r.label}] ${r.enrichment?.reviewStatus === 'HIDDEN' ? '(already hidden) ' : ''}${r.title.slice(0, 58)}`,
    ),
  );
  console.log(`\n  CHECKER (Stroller table) — ${strollerHits.length} to delete:`);
  strollerHits.forEach((r) =>
    console.log(`    [${r.label}] ${r.brand} | ${r.model}${r.displayName ? ' | ' + r.displayName : ''}`),
  );

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }

  const enrichIds = catalogToHide.map((r) => r.enrichment.id);
  if (enrichIds.length) {
    const res = await db.productEnrichment.updateMany({
      where: { id: { in: enrichIds } },
      data: { reviewStatus: 'HIDDEN', isPublic: false },
    });
    console.log(`\n  Hid ${res.count} catalog products (finder).`);
  }
  const strollerIds = strollerHits.map((r) => r.id);
  if (strollerIds.length) {
    const res = await db.stroller.deleteMany({ where: { id: { in: strollerIds } } });
    console.log(`  Deleted ${res.count} Stroller rows (checker; Compatibility cascaded).`);
  }
  if (!enrichIds.length && !strollerIds.length) console.log('\n  Nothing to remove.');
}

main()
  .catch((error) => {
    console.error('[removeStrollerModels] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
