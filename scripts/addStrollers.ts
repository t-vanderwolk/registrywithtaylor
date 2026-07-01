/**
 * Add strollers to the public catalog + travel-system checker, and refresh the
 * Peg Perego City Loop image.
 *
 * For each stroller this:
 *   1. Finds the catalog product (by provider+externalId, else by brand+model in
 *      ANY provider's feed). If found it PROMOTES it (fills a missing image /
 *      affiliate link, never clobbering feed-owned values); if absent it CREATES
 *      a catalog product from the researched MacroBaby / manufacturer data.
 *   2. Sets the enrichment public + REVIEWED with a clean canonicalBrand /
 *      canonicalName so the finder + checker show the exact model we want.
 *   3. Upserts the Stroller row (brand + model) so the checker can resolve
 *      compatibility — the retailer offer attaches at runtime via brand:::model.
 *
 * City Loop: the user asked for the actual stroller photo (the Albee Black/Metal
 * bundle image), so this OVERWRITES the City Loop product image (deliberate,
 * unlike the fill-only promote above).
 *
 * Compatibility (Nuna / Maxi-Cosi / CYBEX / Clek adapter expansion) is wired by
 * the universal-adapter script — run it AFTER this one:
 *   • Joolz Hub  → covered (the Joolz rule now matches \bhub\d*\b)
 *   • Mima Xari  → covered (Mima miro/xari/zigi/creo rule)
 *   • Silver Cross Cove 2 → covered (Silver Cross "all frames" rule)
 *   • City Loop  → already wired (Peg Perego same-brand seats + City Loop adapter)
 *
 *   npx tsx scripts/addStrollers.ts            # dry run (default)
 *   npx tsx scripts/addStrollers.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-strollers-apply
 *   # then:
 *   DB=... npm run catalog:universal-adapter-compatibility-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const CITY_LOOP_IMAGE =
  'https://cdn.shopify.com/s/files/1/0685/7329/8919/files/peg-city-loop-stroller-bundle-black-metal-1205499790.jpg?v=1782175958';

type Spec = {
  brand: string;
  /** Clean model shown in the finder/checker (drives canonicalName + Stroller.model). */
  model: string;
  productType: string;
  /** Preferred catalog identity for the create / exact-match path. */
  provider: string;
  externalId: string;
  title: string;
  affiliateUrl: string;
  /** Optional: omit to let the promote-if-found path use the feed's image/price. */
  imageUrl?: string;
  price?: number;
  retailer: string;
  /** Loose token used to find an existing feed product when the externalId differs. */
  searchModel: string;
};

const SPECS: Spec[] = [
  {
    brand: 'Joolz',
    model: 'Hub2',
    productType: 'compact stroller',
    provider: 'shopify_macrobaby',
    externalId: '7354069516347',
    title: 'Joolz - Hub² Compact Stroller Lightweight, Forest Green',
    affiliateUrl:
      'https://www.macrobaby.com/products/joolz-hub-compact-stroller-lightweight-forest-green?_j=taylormadebabyco.com',
    imageUrl:
      'https://cdn.shopify.com/s/files/1/0325/7932/1915/files/joolz-hub-compact-stroller-lightweight-forest-green_image_1.jpg?v=1773160721',
    price: 679.2,
    retailer: 'MacroBaby',
    searchModel: 'Hub',
  },
  {
    brand: 'Mima',
    model: 'Xari Max',
    productType: 'full-size stroller',
    provider: 'shopify_macrobaby',
    externalId: '7208529461307',
    title: 'Mima - Xari Max Stroller, Black/Camel/Black',
    affiliateUrl:
      'https://www.macrobaby.com/products/mima-xari-max-stroller-black-camel-black?_j=taylormadebabyco.com',
    imageUrl:
      'https://cdn.shopify.com/s/files/1/0325/7932/1915/files/mima-xari-max-stroller-black-camel-black_image_1.jpg?v=1772352748',
    price: 1499.99,
    retailer: 'MacroBaby',
    searchModel: 'Xari',
  },
  {
    // MacroBaby has not listed the Cove 2 yet (2026 launch), so this creates a
    // manual_tmbc product linking the official Silver Cross page. Once MacroBaby
    // carries it, the brand:::model offer match upgrades the link automatically.
    brand: 'Silver Cross',
    model: 'Cove 2',
    productType: 'full-size stroller',
    provider: 'manual_tmbc',
    externalId: 'tmbc-silver-cross-cove-2',
    title: 'Silver Cross - Cove 2 Full-Size All-Terrain Stroller',
    affiliateUrl: 'https://silvercrossus.com/product/cove-2-full-size-stroller/?ref=4762',
    imageUrl:
      'https://cdn.shopify.com/s/files/1/1101/4990/files/Cove2_Onyx_Stroller_1200x1200_1.jpg?v=1780942774',
    price: 999.99,
    retailer: 'Silver Cross',
    searchModel: 'Cove 2',
  },
  {
    // Compact / mid-size. Sold on MacroBaby, so the promote path attaches the
    // feed image/price; the create fallback only fires if it's not in the feed.
    brand: 'Bugaboo',
    model: 'Dragonfly',
    productType: 'compact stroller',
    provider: 'shopify_macrobaby',
    externalId: 'tmbc-bugaboo-dragonfly',
    title: 'Bugaboo - Dragonfly Stroller, Black',
    affiliateUrl: 'https://www.macrobaby.com/products/bugaboo-dragonfly-stroller-black?_j=taylormadebabyco.com',
    retailer: 'MacroBaby',
    searchModel: 'Dragonfly',
  },
  {
    // Bugaboo's full-size all-terrain flagship. On MacroBaby, so the promote path
    // attaches the feed image/price.
    brand: 'Bugaboo',
    model: 'Fox 5',
    productType: 'full-size stroller',
    provider: 'shopify_macrobaby',
    externalId: 'tmbc-bugaboo-fox-5',
    title: 'Bugaboo - Fox 5 Complete Stroller, Black/Forest Green',
    affiliateUrl: 'https://www.macrobaby.com/products/bugaboo-fox-5-complete-stroller-black-forest-green?_j=taylormadebabyco.com',
    retailer: 'MacroBaby',
    searchModel: 'Fox 5',
  },
  {
    brand: 'Cybex',
    model: 'Eezy S Twist 2',
    productType: 'compact stroller',
    provider: 'shopify_macrobaby',
    externalId: 'tmbc-cybex-eezy-s-twist-2',
    title: 'Cybex - Eezy S Twist 2 Stroller, Soho Grey',
    affiliateUrl: 'https://www.macrobaby.com/products/cybex-eezy-s-twist-2-soho-grey?_j=taylormadebabyco.com',
    retailer: 'MacroBaby',
    searchModel: 'Eezy S',
  },
  {
    // New 2026 IATA cabin-approved ultra-compact travel stroller. Not yet on
    // MacroBaby (pre-order), so this creates it; the promote path upgrades the
    // link once a feed carries it. Connects to Nuna PIPA seats directly — Nuna's
    // closed ecosystem gives it Nuna infant seats only (handled by the engine).
    brand: 'Nuna',
    model: 'VIAA cabn',
    productType: 'travel stroller',
    provider: 'manual_tmbc',
    externalId: 'tmbc-nuna-viaa-cabn',
    title: 'Nuna - VIAA cabn Ultra-Compact Travel Stroller',
    affiliateUrl: 'https://nunababy.com/usa/viaa-cabn-stroller',
    imageUrl:
      'https://cdn.shopify.com/s/files/1/1101/4990/files/Nuna_VIAAcabn_CaviarCCR_Angle_CD_US_web_22acfa65-b3d7-4c72-9ccf-3a105c7aee69.png?v=1781964830',
    price: 550.0,
    retailer: 'Nuna',
    searchModel: 'VIAA',
  },
  {
    // Compact / mid-size. On MacroBaby, so the promote path attaches feed
    // image/price; thule.com link is only a create fallback.
    brand: 'Thule',
    model: 'Shine',
    productType: 'compact stroller',
    provider: 'shopify_macrobaby',
    externalId: 'tmbc-thule-shine',
    title: 'Thule - Shine Compact Stroller, Misty Rose',
    affiliateUrl: 'https://www.thule.com/en-us/strollers/compact-strollers/thule-shine-_-11400202',
    retailer: 'MacroBaby',
    searchModel: 'Shine',
  },
];

const isStrollerTitle = (t: string) =>
  /\bstroller\b/i.test(t) && !/\b(adapter|bassinet|seat box|seat pack|car ?seat|travel bag|chassis|organi[sz]er|footmuff|rain cover)\b/i.test(t);

async function promoteEnrichment(rawProductId: string, spec: Spec, apply: boolean) {
  const data = {
    canonicalBrand: spec.brand,
    canonicalName: spec.model,
    tmbcCategory: 'Strollers',
    productType: spec.productType,
    reviewStatus: 'REVIEWED',
    isPublic: true,
    needsReview: false,
  };
  if (!apply) return;
  await db.productEnrichment.upsert({
    where: { rawProductId },
    update: data,
    create: { rawProductId, ...data },
  });
}

async function ensureStrollerRow(spec: Spec, apply: boolean) {
  const existing = await db.stroller.findFirst({
    where: { brand: { equals: spec.brand, mode: 'insensitive' }, model: { equals: spec.model, mode: 'insensitive' } },
    select: { id: true },
  });
  if (existing) return 'exists';
  if (apply) {
    await db.stroller.create({
      data: {
        brand: spec.brand,
        model: spec.model,
        displayName: `${spec.brand} ${spec.model}`,
        babylistSku: null,
        babylistUrl: null,
        babylistPrice: null,
        babylistImage: null,
        babylistUpdatedAt: new Date(),
      },
    });
  }
  return 'created';
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Add strollers + refresh City Loop image ──  (${apply ? 'apply' : 'dry-run'})\n`);

  // ── 1) City Loop image override ──
  const cityLoop: Array<{ id: string; externalId: string; title: string; imageUrl: string | null }> =
    await db.affiliateCatalogProduct.findMany({
      where: { title: { contains: 'City Loop', mode: 'insensitive' } },
      select: { id: true, externalId: true, title: true, imageUrl: true },
    });
  const cityLoopTargets = cityLoop.filter(
    (p) => p.externalId === '7373396312123' || (/city loop/i.test(p.title) && isStrollerTitle(p.title)),
  );
  console.log(`City Loop image → ${CITY_LOOP_IMAGE.split('/').pop()}`);
  cityLoopTargets.forEach((p) => console.log(`   • ${p.title.slice(0, 70)}  (was ${p.imageUrl ? 'set' : 'null'})`));
  if (cityLoopTargets.length === 0) console.log('   (no City Loop stroller product found — run catalog:fix-city-loop first)');
  if (apply && cityLoopTargets.length) {
    await db.affiliateCatalogProduct.updateMany({
      where: { id: { in: cityLoopTargets.map((p) => p.id) } },
      data: { imageUrl: CITY_LOOP_IMAGE },
    });
  }

  // ── 2) Add the strollers ──
  for (const spec of SPECS) {
    console.log(`\n${spec.brand} ${spec.model}`);

    let product = await db.affiliateCatalogProduct.findFirst({
      where: { provider: spec.provider, externalId: spec.externalId },
      select: { id: true, imageUrl: true, affiliateUrl: true, price: true },
    });
    if (!product) {
      const candidates = await db.affiliateCatalogProduct.findMany({
        where: {
          brand: { startsWith: spec.brand, mode: 'insensitive' },
          title: { contains: spec.searchModel, mode: 'insensitive' },
        },
        select: { id: true, title: true, imageUrl: true, affiliateUrl: true, price: true },
      });
      product = candidates.find((c: { title: string }) => isStrollerTitle(c.title)) ?? null;
    }

    if (product) {
      console.log('   found existing catalog product → promote (fill-only)');
      if (apply) {
        await db.affiliateCatalogProduct.update({
          where: { id: product.id },
          data: {
            imageUrl: product.imageUrl ?? spec.imageUrl,
            affiliateUrl: product.affiliateUrl ?? spec.affiliateUrl,
            price: product.price ?? spec.price,
          },
        });
      }
    } else {
      console.log(`   not in catalog → create ${spec.provider} product`);
      if (apply) {
        product = await db.affiliateCatalogProduct.upsert({
          where: { provider_externalId: { provider: spec.provider, externalId: spec.externalId } },
          update: {
            brand: spec.brand,
            title: spec.title,
            affiliateUrl: spec.affiliateUrl,
            imageUrl: spec.imageUrl,
            price: spec.price,
            isActiveInFeed: true,
            lastSyncedAt: new Date(),
          },
          create: {
            provider: spec.provider,
            externalId: spec.externalId,
            brand: spec.brand,
            title: spec.title,
            affiliateUrl: spec.affiliateUrl,
            imageUrl: spec.imageUrl,
            price: spec.price,
            retailer: spec.retailer,
            isActiveInFeed: true,
          },
          select: { id: true },
        });
      }
    }

    if (apply && product) await promoteEnrichment(product.id, spec, apply);
    const strollerState = await ensureStrollerRow(spec, apply);
    console.log(`   Stroller row: ${strollerState}`);
  }

  console.log(`\n${apply ? 'Done.' : '(dry run — re-run with --apply.)'}`);
  if (apply) {
    console.log('Next: run catalog:universal-adapter-compatibility-apply to wire car-seat compatibility.');
  }
}

main()
  .catch((error) => {
    console.error('[addStrollers] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
