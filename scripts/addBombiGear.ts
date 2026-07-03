/**
 * Add Bombi Gear (a direct retailer — provider bombi_direct):
 *   • Bombi Bēbee V3 Lightweight Stroller     (Strollers, travel)     $225
 *   • Bombi Bēbee Car Seat Adapter Straps V2  (Travel Systems & Adapters, manual_tmbc)
 *
 * The Bēbee shows in the finder's travel category with a "Shop Bombi" buy button
 * (Bombi is now a first-class public retailer). The adapter straps title carries
 * "Bēbee V3" so the travel-system engine matches them to the Bēbee.
 *
 * NOTE: bombigear.com timed out on fetch, so product images are blank (finder
 * falls back to the brand label) and the adapter price is unset. Re-run with real
 * imageUrl / price once available — the upsert keys on provider + externalId.
 *
 *   npx tsx scripts/addBombiGear.ts            # dry run (default)
 *   npx tsx scripts/addBombiGear.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-bombi-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

type Spec = {
  kind: 'stroller' | 'adapter';
  provider: 'bombi_direct' | 'manual_tmbc';
  externalId: string;
  sku: string;
  brand: string;
  model?: string;
  productType: string;
  tmbcCategory: string;
  title: string;
  affiliateUrl: string;
  imageUrl: string | null;
  price: number | null;
};

const SPECS: Spec[] = [
  {
    kind: 'stroller',
    provider: 'bombi_direct',
    externalId: '8742544965814',
    sku: 'BEBEE-V3',
    brand: 'Bombi',
    model: 'Bēbee V3',
    productType: 'travel stroller',
    tmbcCategory: 'Strollers',
    title: 'Bombi Bēbee V3 Lightweight Stroller',
    // Amazon affiliate link (tag=taylormadebab-20) per request.
    affiliateUrl:
      'https://www.amazon.com/Bombi-B%C4%93bee-V2-Lightweight-Stroller/dp/B0DX8BW2Z2?linkCode=ll1&tag=taylormadebab-20&language=en_US&ref_=as_li_ss_tl',
    imageUrl: null,
    price: 225.0,
  },
  {
    kind: 'adapter',
    provider: 'manual_tmbc',
    externalId: '7891478085814',
    sku: 'CSA-STRAPS-V2',
    brand: 'Bombi',
    productType: 'car seat adapter',
    tmbcCategory: 'Travel Systems & Adapters',
    title: 'Bombi Bēbee V3 Car Seat Adapter Straps',
    affiliateUrl: 'https://bombigear.com/products/stroller-car-seat-adapter-straps-v2',
    imageUrl: null,
    price: null,
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
  console.log(`── Add Bombi Gear (Bēbee V3 + adapter straps) ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  for (const spec of SPECS) {
    console.log(`  ${spec.kind.padEnd(8)} ${spec.price != null ? `$${spec.price}` : '(no price)'}  ${spec.title}`);
    if (apply) {
      const product = await db.affiliateCatalogProduct.upsert({
        where: { provider_externalId: { provider: spec.provider, externalId: spec.externalId } },
        update: {
          brand: spec.brand,
          title: spec.title,
          affiliateUrl: spec.affiliateUrl,
          imageUrl: spec.imageUrl,
          price: spec.price,
          retailer: 'Bombi',
          isActiveInFeed: true,
          lastSyncedAt: new Date(),
        },
        create: {
          provider: spec.provider,
          externalId: spec.externalId,
          sku: spec.sku,
          brand: spec.brand,
          title: spec.title,
          affiliateUrl: spec.affiliateUrl,
          productUrl: spec.affiliateUrl,
          imageUrl: spec.imageUrl,
          price: spec.price,
          currency: 'USD',
          retailer: 'Bombi',
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

  console.log(`\n${apply ? 'Done — Bombi Bēbee V3 + adapter straps added.' : '(dry run — re-run with --apply.)'}`);
}

main()
  .catch((error) => {
    console.error('[addBombiGear] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
