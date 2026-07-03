/**
 * Show four Nuna travel strollers (finder + checker), with direct-fit Nuna PIPA
 * compatibility:
 *   • Nuna TRVL LX               (Babylist, travel stroller)          $600
 *   • Nuna TRVL Easy Fold        (Babylist, travel stroller)          $575
 *   • Nuna TRVL DUBL             (Babylist, double stroller)          $900
 *   • Nuna VIAA CABN             (MacroBaby, travel stroller)         $550
 *
 * Each becomes a public REVIEWED catalog product (un-hides any that were hidden,
 * e.g. TRVL Easy Fold caught by the old broad "trvl" hide rule) with a Stroller
 * row, plus DIRECT Compatibility rows to every Nuna PIPA infant seat (all four
 * click directly onto PIPA — no adapter).
 *
 *   npx tsx scripts/addNunaStrollers.ts            # dry run (default)
 *   npx tsx scripts/addNunaStrollers.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-nuna-strollers-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const babylistAffiliate = (productUrl: string) =>
  `https://babylist.pxf.io/c/6560395/1056628/13580?u=${encodeURIComponent(productUrl)}&partnerpropertyid=7490466`;

type Spec = {
  provider: 'babylist_impact' | 'shopify_macrobaby';
  externalId: string;
  brand: string;
  model: string;
  productType: string;
  title: string;
  affiliateUrl: string;
  imageUrl: string;
  price: number;
  retailer: string;
  sku?: string;
  catalogId?: string;
};

const SPECS: Spec[] = [
  {
    provider: 'babylist_impact',
    externalId: '1871701',
    brand: 'Nuna',
    model: 'TRVL LX',
    productType: 'travel stroller',
    title: 'Nuna TRVL LX',
    affiliateUrl: babylistAffiliate('https://www.babylist.com/gp/nuna-trvl-lx/46284/1871701'),
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/a8e4ab6a547247a2b8153572590a171821c79c78424fc7d934ac6785c58ce164/ca35f6b4d28c159db99b1a01ebf6c931/a8e4ab6a547247a2b8153572590a171821c79c78424fc7d934ac6785c58ce164.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 600.0,
    retailer: 'Babylist',
  },
  {
    provider: 'babylist_impact',
    externalId: '1051516',
    brand: 'Nuna',
    model: 'TRVL',
    productType: 'travel stroller',
    title: 'Nuna TRVL',
    affiliateUrl: babylistAffiliate(
      'https://www.babylist.com/gp/nuna-trvl-easy-fold-compact-stroller-carry-bag/24317/1051516',
    ),
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/5a60b0377c2f0f067e97c535a535869cbf6a73843db87b82558d51ecbf1aca5a/48d7a8dacf58dd02d9f8151b4bf5a9ad/5a60b0377c2f0f067e97c535a535869cbf6a73843db87b82558d51ecbf1aca5a.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 575.0,
    retailer: 'Babylist',
  },
  {
    provider: 'babylist_impact',
    externalId: '2042627',
    brand: 'Nuna',
    model: 'TRVL DUBL',
    productType: 'double stroller',
    title: 'Nuna TRVL DUBL',
    affiliateUrl: babylistAffiliate('https://www.babylist.com/gp/nuna-trvl-dubl/54963/2042627'),
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/fdea6c9f6757e31c177682be50bfcc46e93897c1b000bc4bc968860419ba6ad5/cd6512171cb6e7ac4d26089ddd1e8eaa/fdea6c9f6757e31c177682be50bfcc46e93897c1b000bc4bc968860419ba6ad5.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 900.0,
    retailer: 'Babylist',
  },
  {
    provider: 'shopify_macrobaby',
    externalId: '7684626481211',
    brand: 'Nuna',
    model: 'VIAA CABN',
    productType: 'travel stroller',
    title: 'Nuna VIAA CABN Ultra-Compact Stroller',
    affiliateUrl: 'https://www.macrobaby.com/products/nuna-viaa-cabn-ultra-compact-stroller-caviar?_j=taylormadebabyco.com',
    imageUrl:
      'https://cdn.shopify.com/s/files/1/0325/7932/1915/files/nuna-viaa-cabin-ultra-compact-cabin-stroller-caviar_image_1.jpg?v=1782361173',
    price: 550.0,
    retailer: 'MacroBaby',
    sku: '11445904',
    catalogId: 'macrobaby-shopify',
  },
];

async function ensureStrollerRow(brand: string, model: string, apply: boolean) {
  const existing = await db.stroller.findFirst({
    where: { brand: { equals: brand, mode: 'insensitive' }, model: { equals: model, mode: 'insensitive' } },
    select: { id: true },
  });
  if (existing) return existing.id as string;
  if (!apply) return null;
  const created = await db.stroller.create({
    data: { brand, model, displayName: `${brand} ${model}`, babylistUpdatedAt: new Date() },
    select: { id: true },
  });
  return created.id as string;
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Show Nuna travel strollers ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  // Nuna PIPA infant seats for the direct-fit compatibility rows.
  const pipaSeats: { id: string; model: string }[] = await db.carSeat.findMany({
    where: { brand: { equals: 'Nuna', mode: 'insensitive' }, seatType: 'INFANT' },
    select: { id: true, model: true },
  });
  console.log(`Nuna infant seats for direct-fit rows: ${pipaSeats.length}\n`);

  for (const spec of SPECS) {
    console.log(`${spec.model.padEnd(16)} $${spec.price}  [${spec.productType}]  via ${spec.retailer}`);
    if (!apply) continue;

    const product = await db.affiliateCatalogProduct.upsert({
      where: { provider_externalId: { provider: spec.provider, externalId: spec.externalId } },
      update: {
        brand: spec.brand,
        title: spec.title,
        affiliateUrl: spec.affiliateUrl,
        imageUrl: spec.imageUrl,
        price: spec.price,
        retailer: spec.retailer,
        isActiveInFeed: true,
        lastSyncedAt: new Date(),
      },
      create: {
        provider: spec.provider,
        externalId: spec.externalId,
        // catalogId is non-null with a default — only override for MacroBaby.
        ...(spec.catalogId ? { catalogId: spec.catalogId } : {}),
        sku: spec.sku ?? null,
        brand: spec.brand,
        title: spec.title,
        affiliateUrl: spec.affiliateUrl,
        productUrl: spec.affiliateUrl,
        imageUrl: spec.imageUrl,
        price: spec.price,
        currency: 'USD',
        retailer: spec.retailer,
        isActiveInFeed: true,
      },
      select: { id: true },
    });

    await db.productEnrichment.upsert({
      where: { rawProductId: product.id },
      update: {
        canonicalBrand: spec.brand,
        canonicalName: spec.model,
        tmbcCategory: 'Strollers',
        productType: spec.productType,
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
      create: {
        rawProductId: product.id,
        canonicalBrand: spec.brand,
        canonicalName: spec.model,
        tmbcCategory: 'Strollers',
        productType: spec.productType,
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
    });

    const strollerId = await ensureStrollerRow(spec.brand, spec.model, apply);

    // Direct-fit Nuna PIPA compatibility (all four click onto PIPA, no adapter).
    if (strollerId) {
      for (const seat of pipaSeats) {
        const existing = await db.compatibility.findFirst({
          where: { strollerId, carSeatId: seat.id },
          select: { id: true },
        });
        if (existing) continue;
        await db.compatibility.create({
          data: {
            strollerId,
            carSeatId: seat.id,
            compatibilityType: 'DIRECT',
            adapterRequired: false,
            adapterType: null,
            confidence: 'HIGH',
            notes: `${spec.brand} ${spec.model} connects directly with Nuna PIPA series infant car seats with a click — no adapter needed.`,
          },
        });
      }
    }
  }

  console.log(`\n${apply ? `Done — shown ${SPECS.length} Nuna strollers with PIPA direct-fit compatibility.` : '(dry run — re-run with --apply.)'}`);
}

main()
  .catch((error) => {
    console.error('[addNunaStrollers] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
