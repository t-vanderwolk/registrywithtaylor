/**
 * Two Bombi product fixes:
 *   1. "Bombi Twin"  → rename to "Bēbee Twin V2" + set the green zipped image.
 *   2. "Bombi Bēbee V3" → set the black zipped V3 image.
 *
 * Updates both the public stroller catalog (AffiliateCatalogProduct + enrichment,
 * which drives the finder card image + name) AND the Stroller table (checker +
 * admin), so the change shows everywhere. Renaming the model keeps the row id, so
 * existing Compatibility rows are preserved.
 *
 *   npx tsx scripts/updateBombiProducts.ts            # dry run (report)
 *   npx tsx scripts/updateBombiProducts.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/updateBombiProducts.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

const TWIN_IMAGE =
  'https://bombigear.com/cdn/shop/files/Dual_Green_zipped_b661970f-ccdf-4cb9-9bf7-0570a89c97f7.jpg?height=1024&v=1773170721&width=1024';
// The pasted V3 URL was a 100x100 thumbnail; request 1024 of the same asset so it
// isn't pixelated in a product card.
const V3_IMAGE = 'https://bombigear.com/cdn/shop/files/V3_black_zipped.png?height=1024&v=1775245744&width=1024';

const TWIN_MODEL = 'Bēbee Twin V2';
const TWIN_TITLE = 'Bombi Bēbee Twin V2';

const isTwin = (s: string) => /\btwin\b/i.test(s) && !/v2/i.test(s);
const isV3 = (s: string) => /b[eē]bee\s*v?3\b/i.test(s) || /\bv3\b/i.test(s);

type Cat = {
  id: string;
  provider: string;
  title: string;
  imageUrl: string | null;
  enrichment: { id: string } | null;
};
type Str = { id: string; brand: string; model: string; displayName: string | null };

async function main() {
  console.log(`── Update Bombi products ──  (${APPLY ? 'APPLY' : 'dry-run'})\n`);

  const catalog: Cat[] = await db.affiliateCatalogProduct.findMany({
    where: { brand: { contains: 'Bombi', mode: 'insensitive' } },
    select: { id: true, provider: true, title: true, imageUrl: true, enrichment: { select: { id: true } } },
  });
  const strollers: Str[] = await db.stroller.findMany({
    where: { brand: { contains: 'Bombi', mode: 'insensitive' } },
    select: { id: true, brand: true, model: true, displayName: true },
  });

  console.log(`Found ${catalog.length} Bombi catalog product(s), ${strollers.length} Bombi stroller row(s):`);
  catalog.forEach((c) => console.log(`   [catalog/${c.provider}] "${c.title}"  img=${c.imageUrl ? 'yes' : 'none'}`));
  strollers.forEach((s) => console.log(`   [stroller] ${s.brand} / ${s.model}`));
  console.log('');

  // ── 1. Twin → Bēbee Twin V2 + green image ────────────────────────────────
  for (const c of catalog.filter((c) => isTwin(c.title))) {
    console.log(`  Twin catalog: "${c.title}" → title "${TWIN_TITLE}", image set  ${APPLY ? '(APPLY)' : '(would)'}`);
    if (APPLY) {
      await db.affiliateCatalogProduct.update({
        where: { id: c.id },
        data: { title: TWIN_TITLE, imageUrl: TWIN_IMAGE },
      });
      if (c.enrichment) {
        await db.productEnrichment.update({
          where: { id: c.enrichment.id },
          data: { canonicalBrand: 'Bombi', canonicalName: TWIN_MODEL },
        });
      }
    }
  }
  for (const s of strollers.filter((s) => isTwin(s.model))) {
    console.log(`  Twin stroller: ${s.model} → ${TWIN_MODEL}, image set  ${APPLY ? '(APPLY)' : '(would)'}`);
    if (APPLY) {
      await db.stroller.update({
        where: { id: s.id },
        data: { model: TWIN_MODEL, displayName: TWIN_TITLE, babylistImage: TWIN_IMAGE },
      });
    }
  }

  // ── 2. Bēbee V3 → black image ────────────────────────────────────────────
  const v3Cat = catalog.filter((c) => isV3(c.title));
  for (const c of v3Cat) {
    console.log(`  V3 catalog: "${c.title}" → image set  ${APPLY ? '(APPLY)' : '(would)'}`);
    if (APPLY) await db.affiliateCatalogProduct.update({ where: { id: c.id }, data: { imageUrl: V3_IMAGE } });
  }
  const v3Str = strollers.filter((s) => isV3(s.model));
  for (const s of v3Str) {
    console.log(`  V3 stroller: ${s.model} → image set  ${APPLY ? '(APPLY)' : '(would)'}`);
    if (APPLY) await db.stroller.update({ where: { id: s.id }, data: { babylistImage: V3_IMAGE } });
  }
  if (v3Cat.length === 0 && v3Str.length === 0) console.log('  ⚠ No "Bēbee V3" catalog product or stroller row matched.');

  console.log(`\n${APPLY ? '✓ Applied.' : '(dry run — re-run with --apply.)'}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
