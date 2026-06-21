/**
 * Audit each synced stroller's Babylist match — so you can confirm the photo and
 * link point at the actual stroller, not an accessory.
 *
 *   npx tsx scripts/auditStrollerMatches.ts                          # local DB
 *   heroku run "npx tsx scripts/auditStrollerMatches.ts" -a registrywithtaylor   # the live site's data
 *
 * The finder reads the LIVE (Heroku) data, so run it there to check what visitors
 * see. Resolves each match by image URL first (what the finder shows; immune to
 * SKU-format drift), then by SKU, against the BabylistCatalogItem cache — so the
 * cache must be current on whichever DB you run it against (cacheBabylistCatalog.ts).
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ACCESSORY_HINT =
  /\b(adapter|adapters|cup\s*holder|cupholder|tray|bassinet\s+(stand|fabric|bundle|adapter)|bumper|backpack|rain\s*cover|footmuff|liner|board\b|organi[sz]er|second\s*seat|sibling\s*seat|snack|bottle\s*cage|carry\s*bag|travel\s*bag|canopy|sun\s*shade|parasol|walker)\b/i;

function uniq(values: (string | null)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v)))];
}

async function main() {
  const strollers = await prisma.stroller.findMany({
    select: { brand: true, model: true, babylistSku: true, babylistImage: true, babylistPrice: true },
    orderBy: [{ brand: 'asc' }, { model: 'asc' }],
  });

  const images = uniq(strollers.map((s) => s.babylistImage));
  const skus = uniq(strollers.map((s) => s.babylistSku));

  const [byImage, bySku] = await Promise.all([
    images.length
      ? prisma.babylistCatalogItem.findMany({ where: { imageUrl: { in: images } }, select: { imageUrl: true, name: true } })
      : [],
    skus.length
      ? prisma.babylistCatalogItem.findMany({ where: { sku: { in: skus } }, select: { sku: true, name: true } })
      : [],
  ]);
  const nameByImage = new Map(byImage.map((i) => [i.imageUrl, i.name]));
  const nameBySku = new Map(bySku.map((i) => [i.sku, i.name]));

  let synced = 0;
  let notSynced = 0;
  let unresolved = 0;
  let flagged = 0;

  for (const s of strollers) {
    const label = `${s.brand} ${s.model}`.padEnd(34);
    if (!s.babylistSku && !s.babylistImage) {
      notSynced += 1;
      console.log(`  ·   ${label}  (not synced — finder shows no photo)`);
      continue;
    }
    synced += 1;
    const name =
      (s.babylistImage && nameByImage.get(s.babylistImage)) ||
      (s.babylistSku && nameBySku.get(s.babylistSku)) ||
      null;

    if (!name) {
      unresolved += 1;
      console.log(`  ?   ${label}  →  (couldn't resolve — re-cache the catalogue on this DB)`);
      continue;
    }
    const isAccessory = ACCESSORY_HINT.test(name);
    if (isAccessory) flagged += 1;
    console.log(`  ${isAccessory ? '⚠️ ' : '✓  '} ${label}  →  ${name}`);
    if (isAccessory) console.log(`         image: ${s.babylistImage ?? '(none)'}`);
  }

  console.log(
    `\nSynced ${synced} · not synced ${notSynced} · unresolved ${unresolved} · ⚠️ possible accessory ${flagged}`,
  );
  if (flagged > 0) {
    console.log('Clear/reassign the ⚠️ rows in /admin/babylist, or re-run: npx tsx scripts/syncBabylistCatalog.ts --mode=full');
  } else if (unresolved > 0) {
    console.log('Some matches could not be resolved — refresh the cache first: npx tsx scripts/cacheBabylistCatalog.ts');
  } else if (synced > 0) {
    console.log('Clean — every synced stroller maps to a stroller product, not an accessory.');
  }
}

main()
  .catch((error) => {
    console.error('[audit] failed:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
