/**
 * Restore the Mima brand card in the finder + checker with its three stroller
 * product cards:
 *   • Miro  — compact travel stroller   (MacroBaby, ~$549.99)
 *   • Creo  — full-size city stroller    (MacroBaby, ~$1,199.99)
 *   • Xari  — full-size stroller (Xari Max) (MacroBaby, ~$1,499.99)
 *
 * Babylist only carries Mima Zigi, and the four Xari listings already in the
 * catalog are GoodBuyGear-only (resale) — which never render as a primary card.
 * MacroBaby stocks the full current Mima line, so we add each as a hand-added
 * catalog product (provider manual_tmbc) pointing at its live MacroBaby page.
 * The manual_tmbc router sends a macrobaby.com URL to the MacroBaby retailer
 * slot, so each surfaces as a "Via MacroBaby" buy button.
 *
 * The public finder brand card is driven by AffiliateCatalogProduct + enrichment
 * (lib/server/publicStrollerCatalog.ts), so this alone brings the Mima card back.
 * Run `npm run strollers:import` afterward only to (re)build the Stroller rows
 * the compatibility engine uses.
 *
 *   npx tsx scripts/restoreMimaStrollers.ts            # dry run (default)
 *   npx tsx scripts/restoreMimaStrollers.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/restoreMimaStrollers.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const MANUAL_PROVIDER = 'manual_tmbc';

const macroBabyUrl = (handle: string) =>
  `https://www.macrobaby.com/products/${handle}?_j=taylormadebabyco.com`;

type Spec = {
  externalId: string;
  brand: string;
  title: string; // parses to the finder model name (Miro / Creo / Xari)
  handle: string;
  productType: string;
  imageUrl: string;
  price: number;
};

const SPECS: Spec[] = [
  {
    externalId: 'mima-miro',
    brand: 'Mima',
    title: 'Mima Miro Stroller',
    handle: 'mima-miro-compact-stroller-black-chassis-black-seat',
    productType: 'compact stroller',
    imageUrl:
      'https://www.macrobaby.com/cdn/shop/files/mima-miro-compact-stroller-black-chassis-black-seat_image_1.jpg',
    price: 549.99,
  },
  {
    externalId: 'mima-creo',
    brand: 'Mima',
    title: 'Mima Creo Stroller',
    handle: 'mima-creo-single-stroller-black',
    productType: 'full-size stroller',
    imageUrl:
      'https://www.macrobaby.com/cdn/shop/files/mima-creo-single-stroller-black_image_1.jpg?v=1776446687',
    price: 1199.99,
  },
  {
    externalId: 'mima-xari',
    brand: 'Mima',
    title: 'Mima Xari Stroller',
    handle: 'mima-xari-max-stroller-black-chassis-black-seat-box-black-starter-pack',
    productType: 'full-size stroller',
    imageUrl:
      'https://www.macrobaby.com/cdn/shop/files/mima-xari-max-stroller-black-chassis-black-seat-box-black-starter-pack_image_1.jpg?v=1772352737',
    price: 1499.99,
  },
];

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Restore Mima brand card — Miro / Creo / Xari ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  for (const spec of SPECS) {
    console.log(
      `  ${spec.title.padEnd(22)} $${spec.price}  ${spec.productType.padEnd(20)} → ${spec.handle}`,
    );
    if (!apply) continue;

    const product = await db.affiliateCatalogProduct.upsert({
      where: { provider_externalId: { provider: MANUAL_PROVIDER, externalId: spec.externalId } },
      update: {
        brand: spec.brand,
        title: spec.title,
        affiliateUrl: macroBabyUrl(spec.handle),
        imageUrl: spec.imageUrl,
        price: spec.price,
        retailer: 'MacroBaby',
        isActiveInFeed: true,
        lastSyncedAt: new Date(),
      },
      create: {
        provider: MANUAL_PROVIDER,
        externalId: spec.externalId,
        brand: spec.brand,
        title: spec.title,
        affiliateUrl: macroBabyUrl(spec.handle),
        imageUrl: spec.imageUrl,
        price: spec.price,
        retailer: 'MacroBaby',
        isActiveInFeed: true,
      },
      select: { id: true },
    });

    await db.productEnrichment.upsert({
      where: { rawProductId: product.id },
      update: {
        canonicalBrand: spec.brand,
        tmbcCategory: 'Strollers',
        productType: spec.productType,
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
      create: {
        rawProductId: product.id,
        canonicalBrand: spec.brand,
        tmbcCategory: 'Strollers',
        productType: spec.productType,
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
    });
    console.log(`    ✓ upserted ${spec.title} (manual_tmbc → MacroBaby)`);
  }

  console.log(
    `\n${apply ? `Done — Mima card restored with ${SPECS.length} product(s).` : '(dry run — re-run with --apply.)'}`,
  );
  if (apply) {
    console.log('Next: `npm run strollers:import` to (re)create the Stroller rows for the checker.');
  }
}

main()
  .catch((error) => {
    console.error('[restoreMimaStrollers] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
