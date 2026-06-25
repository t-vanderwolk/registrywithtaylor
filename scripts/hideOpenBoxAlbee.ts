/**
 * Hide every Albee Baby (cj_albeebaby) product with "OPEN BOX" in the title.
 * Hidden = reversible: rows stay in the DB, drop out of every tool, and survive
 * a re-import (until the next import re-adds them — re-run if so).
 *
 *   npx tsx scripts/hideOpenBoxAlbee.ts            # dry run (default)
 *   npx tsx scripts/hideOpenBoxAlbee.ts --apply    # hide them
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:hide-openbox-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const PROVIDER = 'cj_albeebaby';

type Row = {
  id: string;
  title: string;
  enrichment: { id: string; reviewStatus: string } | null;
};

async function main() {
  const apply = process.argv.includes('--apply');

  const products: Row[] = await db.affiliateCatalogProduct.findMany({
    where: { provider: PROVIDER, title: { contains: 'OPEN BOX', mode: 'insensitive' } },
    select: { id: true, title: true, enrichment: { select: { id: true, reviewStatus: true } } },
  });

  const toHide = products.filter((p) => p.enrichment && p.enrichment.reviewStatus !== 'HIDDEN');
  const alreadyHidden = products.filter((p) => p.enrichment?.reviewStatus === 'HIDDEN').length;
  const noEnrich = products.filter((p) => !p.enrichment).length;

  console.log('── Hide Albee Baby "OPEN BOX" products ──');
  console.log(
    `  matched: ${products.length}   to hide now: ${toHide.length}   already hidden: ${alreadyHidden}   no-enrichment: ${noEnrich}`,
  );
  console.log('\n  sample titles:');
  products.slice(0, 12).forEach((p) => console.log(`    • ${p.title}`));

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }

  const ids = toHide.map((p) => p.enrichment!.id);
  const res = await db.productEnrichment.updateMany({
    where: { id: { in: ids } },
    data: { reviewStatus: 'HIDDEN', isPublic: false },
  });
  // Belt-and-suspenders: also drop any matched rows that somehow lack enrichment
  // out of the active feed so they can never surface.
  const orphanIds = products.filter((p) => !p.enrichment).map((p) => p.id);
  if (orphanIds.length > 0) {
    await db.affiliateCatalogProduct.updateMany({
      where: { id: { in: orphanIds } },
      data: { isActiveInFeed: false },
    });
  }
  console.log(`\n  Hid ${res.count} Albee Baby OPEN BOX products (reversible).`);
}

main()
  .catch((error) => {
    console.error('[hideOpenBoxAlbee] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
