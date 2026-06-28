/**
 * Import strollers from the affiliate catalog into the Stroller table so the
 * Travel-System checker offers the same strollers the finder does.
 *
 *   npx tsx scripts/importStrollersFromCatalog.ts --dry-run   # preview, no writes
 *   npx tsx scripts/importStrollersFromCatalog.ts             # apply
 *   npx tsx scripts/importStrollersFromCatalog.ts --limit=50
 *
 * New strollers pick up compatibility automatically via the engine's same-brand
 * + shared-adapter inference. Curated strollers (with explicit Compatibility
 * rows) are matched by normalized brand+model and skipped — never overwritten.
 *
 * Run against prod by exporting the prod DB URL (same as the catalog import):
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npm run strollers:import-dry
 */
import prismaBase from '@/lib/server/prisma';
import { productModelKey } from '@/lib/catalog/modelIdentity';
import { canonicalStrollerBrand } from '@/lib/catalog/strollerFinderRules';
import { getPublicStrollerCatalogTravelSystemOptions } from '@/lib/server/publicStrollerCatalog';

// New models land in the generated client on `prisma generate`; cast keeps tsc green.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

function parseArgs() {
  const argv = process.argv.slice(2);
  const limitRaw = argv.find((a) => a.startsWith('--limit='));
  return { dryRun: argv.includes('--dry-run'), limit: limitRaw ? parseInt(limitRaw.split('=')[1] ?? '', 10) : null };
}

/** Normalized key that keeps version markers such as V2 and + distinct. */
function normKey(brand: string, model: string): string {
  return productModelKey(brand, model);
}

function isSafeCheckerModel(model: string) {
  const value = model.trim();
  if (!value || value.length > 56) return false;
  if (/["]/.test(value)) return false;
  if (/\b(?:size|base|pram|bassinet|adapter|second seat|seat pack|snack tray|cup holder|organizer|bag)\b/i.test(value)) {
    return false;
  }
  if (/\b\d+(?:\.\d+)?\s*"\b/.test(value)) return false;
  return true;
}

async function main() {
  const args = parseArgs();

  const existing: Array<{ brand: string; model: string }> = await db.stroller.findMany({
    select: { brand: true, model: true },
  });
  const keys = new Set(existing.map((s) => normKey(canonicalStrollerBrand(s.brand), s.model)));

  const rows = (await getPublicStrollerCatalogTravelSystemOptions()).slice(
    0,
    args.limit ?? undefined,
  );

  const seenGroups = new Set<string>();
  let created = 0;
  let skippedExisting = 0;
  let skippedUnsafeModel = 0;
  let errors = 0;
  const samples: string[] = [];

  for (const r of rows) {
    const rawBrand = r.brand.trim();
    const brand = canonicalStrollerBrand(rawBrand);
    const model = r.model.trim();
    if (!brand || !isSafeCheckerModel(model) || / and /i.test(model)) {
      skippedUnsafeModel += 1;
      continue;
    }
    const key = normKey(brand, model);
    if (seenGroups.has(key)) continue;
    seenGroups.add(key);

    if (keys.has(key)) {
      skippedExisting += 1;
      continue;
    }
    keys.add(key); // prevent intra-run duplicates

    if (samples.length < 25) samples.push(`${brand}  —  ${model}`);

    if (args.dryRun) {
      created += 1;
      continue;
    }

    try {
      await db.stroller.create({
        data: {
          brand,
          model,
          displayName: `${brand} ${model}`,
          babylistSku: r.babylistUrl ? `public_catalog_${key}` : null,
          babylistUrl: r.babylistUrl,
          babylistPrice: r.babylistPrice,
          babylistImage: r.babylistImage,
          babylistUpdatedAt: new Date(),
        },
      });
      created += 1;
    } catch (e) {
      errors += 1;
      console.error(`[import-strollers] ${brand} ${model}:`, e instanceof Error ? e.message : e);
    }
  }

  console.log('\n── Import strollers from catalog → Stroller table ──');
  console.log(`  public checker strollers scanned: ${rows.length}`);
  console.log(`  new strollers ${args.dryRun ? 'to add ' : 'added  '}:        ${created}`);
  console.log(`  skipped (already present):    ${skippedExisting}`);
  console.log(`  skipped (unsafe model parse): ${skippedUnsafeModel}`);
  console.log(`  errors:                       ${errors}`);
  if (samples.length) {
    console.log('\n  sample brand — model parses:');
    samples.forEach((s) => console.log(`    ${s}`));
  }
  if (args.dryRun) console.log('\n  (dry run — no writes)');

  await db.$disconnect?.();
}

main().catch((e) => {
  console.error('[importStrollersFromCatalog] failed:', e);
  process.exitCode = 1;
});
