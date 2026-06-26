/**
 * Delete the retired Albee Baby (CJ) catalog — ANB Baby (Awin) replaced it as the
 * third retailer. Removes every affiliateCatalogProduct with provider
 * "cj_albeebaby" and its ProductEnrichment. The retailer CTA + lookup plumbing
 * already moved to ANB Baby, so nothing references this data anymore.
 *
 *   npx tsx scripts/deleteAlbeeData.ts            # dry run (default)
 *   npx tsx scripts/deleteAlbeeData.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:delete-albee-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const PROVIDER = 'cj_albeebaby';

async function main() {
  const apply = process.argv.includes('--apply');

  const rows: Array<{ id: string }> = await db.affiliateCatalogProduct.findMany({
    where: { provider: PROVIDER },
    select: { id: true },
  });
  const ids = rows.map((r) => r.id);

  console.log('── Delete Albee Baby (cj_albeebaby) catalog ──');
  console.log(`  products to delete: ${ids.length}`);

  if (!apply) {
    console.log('\n  (dry run — nothing deleted. Re-run with --apply.)');
    return;
  }

  // Enrichment first (in case the FK isn't ON DELETE CASCADE), then the products.
  const enr = await db.productEnrichment.deleteMany({ where: { rawProductId: { in: ids } } });
  const prod = await db.affiliateCatalogProduct.deleteMany({ where: { provider: PROVIDER } });
  console.log(`\n  deleted ${prod.count} products + ${enr.count} enrichment rows.`);
}

main()
  .catch((error) => {
    console.error('[deleteAlbeeData] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
