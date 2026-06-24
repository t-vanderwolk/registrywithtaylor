/**
 * Remove whole brands from the tools — non-stroller/seat brands the catalog
 * picked up (luggage, clothing, toys, travel accessories). Hidden = reversible:
 * rows stay in the DB, drop out of every tool, and survive a re-import.
 *
 *   npx tsx scripts/hideBrands.ts            # dry run (default)
 *   npx tsx scripts/hideBrands.ts --apply    # hide them
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:hide-brands
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

// Exact catalog brand strings (case-sensitive, as they appear in the feed).
const BRANDS = [
  'BEIS Travel',
  "Burt's Bees Baby",
  'Caden Lane',
  'CALPAK',
  'Charlie Crane',
  'Crane Baby',
  'Itzy Ritzy',
  'JL Childress',
  'Lovevery',
];

type Row = {
  id: string;
  brand: string | null;
  enrichment: { id: string; reviewStatus: string } | null;
};

async function main() {
  const apply = process.argv.includes('--apply');

  const products: Row[] = await db.affiliateCatalogProduct.findMany({
    where: { brand: { in: BRANDS } },
    select: { id: true, brand: true, enrichment: { select: { id: true, reviewStatus: true } } },
  });

  const toHide = products.filter((p) => p.enrichment && p.enrichment.reviewStatus !== 'HIDDEN');
  const alreadyHidden = products.filter((p) => p.enrichment?.reviewStatus === 'HIDDEN').length;
  const noEnrich = products.filter((p) => !p.enrichment).length;

  const byBrand: Record<string, number> = {};
  products.forEach((p) => {
    const b = p.brand ?? '?';
    byBrand[b] = (byBrand[b] ?? 0) + 1;
  });

  console.log('── Hide brands from the tools ──');
  console.log(
    `  matched products: ${products.length}   to hide now: ${toHide.length}   already hidden: ${alreadyHidden}   no-enrichment: ${noEnrich}`,
  );
  console.log('\n  by brand:');
  BRANDS.forEach((b) => console.log(`    ${String(byBrand[b] ?? 0).padStart(4)}  ${b}`));

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }

  const ids = toHide.map((p) => p.enrichment!.id);
  const res = await db.productEnrichment.updateMany({
    where: { id: { in: ids } },
    data: { reviewStatus: 'HIDDEN', isPublic: false },
  });
  console.log(`\n  Hid ${res.count} products across ${BRANDS.length} brands (reversible).`);
}

main()
  .catch((error) => {
    console.error('[hideBrands] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
