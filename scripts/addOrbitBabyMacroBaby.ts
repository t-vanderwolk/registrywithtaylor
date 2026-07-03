/**
 * Add via MacroBaby (shopify_macrobaby):
 *   • Orbit Baby G5 Stroller                       (Strollers, full-size)   $1,200
 *   • Orbit Baby Car Seat Adapter                  (Travel Systems & Adapters) $60
 *
 * The G5 shows in the finder + checker (new Stroller row). Orbit Baby already has
 * a universal-adapter rule (Nuna trigger → Maxi-Cosi / CYBEX / Clek expansion), so
 * running catalog:universal-adapter-compatibility-apply wires the G5's car-seat
 * compatibility. The adapter title carries "for Orbit Baby Stroller" (brand-wide
 * match) + the euro seat brands so it surfaces as the "Shop adapter" link.
 *
 *   npx tsx scripts/addOrbitBabyMacroBaby.ts            # dry run (default)
 *   npx tsx scripts/addOrbitBabyMacroBaby.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-orbit-baby-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const macroBabyUrl = (handle: string) =>
  `https://www.macrobaby.com/products/${handle}?_j=taylormadebabyco.com`;

type Spec = {
  kind: 'stroller' | 'adapter';
  externalId: string;
  sku: string;
  brand: string;
  model?: string;
  productType: string;
  tmbcCategory: string;
  title: string;
  handle: string;
  imageUrl: string;
  price: number;
};

const SPECS: Spec[] = [
  {
    kind: 'stroller',
    externalId: '7297073905723',
    sku: 'ORB001',
    brand: 'Orbit Baby',
    model: 'G5',
    productType: 'full-size stroller',
    tmbcCategory: 'Strollers',
    title: 'Orbit Baby G5 Stroller',
    handle: 'g5-stroller',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0325/7932/1915/files/G5_Stroller_Black_Rose_Gold_01.jpg?v=1736382285',
    price: 1200.0,
  },
  {
    kind: 'adapter',
    externalId: '7297074430011',
    sku: 'CSA810',
    brand: 'Orbit Baby',
    productType: 'car seat adapter',
    tmbcCategory: 'Travel Systems & Adapters',
    title: 'Orbit Baby Car Seat Adapter for Orbit Baby Stroller (Maxi-Cosi / Cybex / Nuna / Clek)',
    handle: 'car-seat-stroller-adapter',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0325/7932/1915/files/Orbit_Baby_Car_Seat_Adapter.jpg?v=1736382988',
    price: 60.0,
  },
];

async function ensureStrollerRow(brand: string, model: string, apply: boolean) {
  const existing = await db.stroller.findFirst({
    where: { brand: { equals: brand, mode: 'insensitive' }, model: { equals: model, mode: 'insensitive' } },
    select: { id: true },
  });
  if (existing) return 'exists';
  if (apply) {
    await db.stroller.create({
      data: { brand, model, displayName: `${brand} ${model}`, babylistUpdatedAt: new Date() },
    });
  }
  return 'created';
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Add Orbit Baby G5 + adapter (MacroBaby) ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  for (const spec of SPECS) {
    console.log(`  ${spec.kind.padEnd(8)} $${spec.price}  ${spec.title}`);
    if (apply) {
      const product = await db.affiliateCatalogProduct.upsert({
        where: { provider_externalId: { provider: 'shopify_macrobaby', externalId: spec.externalId } },
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
          provider: 'shopify_macrobaby',
          externalId: spec.externalId,
          catalogId: 'macrobaby-shopify',
          sku: spec.sku,
          brand: spec.brand,
          title: spec.title,
          affiliateUrl: macroBabyUrl(spec.handle),
          productUrl: macroBabyUrl(spec.handle),
          imageUrl: spec.imageUrl,
          price: spec.price,
          currency: 'USD',
          retailer: 'MacroBaby',
          isActiveInFeed: true,
        },
        select: { id: true },
      });

      const enrichment =
        spec.kind === 'stroller'
          ? {
              canonicalBrand: spec.brand,
              canonicalName: spec.model,
              tmbcCategory: spec.tmbcCategory,
              productType: spec.productType,
              reviewStatus: 'REVIEWED',
              isPublic: true,
              needsReview: false,
            }
          : {
              canonicalBrand: spec.brand,
              tmbcCategory: spec.tmbcCategory,
              productType: spec.productType,
              reviewStatus: 'REVIEWED',
              isPublic: true,
              needsReview: false,
            };

      await db.productEnrichment.upsert({
        where: { rawProductId: product.id },
        update: enrichment,
        create: { rawProductId: product.id, ...enrichment },
      });
    }

    if (spec.kind === 'stroller' && spec.model) {
      const state = await ensureStrollerRow(spec.brand, spec.model, apply);
      console.log(`           Stroller row: ${state}`);
    }
  }

  console.log(`\n${apply ? 'Done — added Orbit Baby G5 + adapter.' : '(dry run — re-run with --apply.)'}`);
  if (apply) console.log('Next: DB=… npm run catalog:universal-adapter-compatibility-apply  (wires G5 car-seat compatibility)');
}

main()
  .catch((error) => {
    console.error('[addOrbitBabyMacroBaby] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
