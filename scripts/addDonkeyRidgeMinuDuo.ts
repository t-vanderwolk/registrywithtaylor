/**
 * Add four Babylist products (finder + checker) and wire their matches:
 *
 *   ADAPTERS (Travel Systems & Adapters, provider babylist_impact):
 *     • Bugaboo Donkey Mono & Duo Adapter (Maxi-Cosi / Nuna)          $79.95
 *         Fits Donkey 3 / Donkey 5 Mono. Euro-seat (Nuna / Maxi-Cosi)
 *         compatibility is already wired by the Bugaboo donkey rule in
 *         scripts/applyUniversalAdapterCompatibility.ts.
 *     • UPPAbaby Adapters for Ridge (Aria / Mesa / Bassinet)          $39.99
 *     • UPPAbaby Adapters for Minu Duo (Mesa / Aria)                  $39.99
 *         Both are UPPAbaby-seat adapters (same-brand Aria / Mesa). Their euro
 *         adapter path on Ridge / Minu is already covered by the UPPAbaby rule.
 *
 *   STROLLER (Strollers, provider babylist_impact):
 *     • UPPAbaby Minu Duo (double stroller)                           $749.99
 *         Ensures a Stroller row and wires ADAPTER compatibility to the shared
 *         euro group (Nuna trigger → CYBEX / Clek / Maxi-Cosi / Britax) plus
 *         Chicco — matching the existing UPPAbaby universal-adapter rule.
 *
 * Adapter titles carry the stroller model tokens (Donkey 3 / Donkey 5 Mono,
 * Ridge, Minu Duo) so adapterTitleMatchesStrollerModel surfaces the right one
 * per (stroller, seat brand).
 *
 *   npx tsx scripts/addDonkeyRidgeMinuDuo.ts            # dry run (default)
 *   npx tsx scripts/addDonkeyRidgeMinuDuo.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-donkey-ridge-minu-duo-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const babylistAffiliate = (productUrl: string) =>
  `https://babylist.pxf.io/c/6560395/1056628/13580?u=${encodeURIComponent(productUrl)}&partnerpropertyid=7490466`;

const ctf = (a: string, b: string) =>
  `https://images.ctfassets.net/50gzycvace50/${a}/${b}/${a}.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240`;

type AdapterSpec = { externalId: string; brand: string; title: string; productUrl: string; imageUrl: string; price: number };

const ADAPTERS: AdapterSpec[] = [
  {
    externalId: '762793',
    brand: 'Bugaboo',
    title: 'Bugaboo Donkey Mono & Duo Car Seat Adapter (Maxi-Cosi / Nuna) - Donkey 3 / Donkey 5 Mono',
    productUrl:
      'https://www.babylist.com/gp/bugaboo-donkey-mono-and-duo-adapter-for-turtle-one-maxi-cosi-car-seats/21895/762793',
    imageUrl: ctf(
      '2b97a684a9220a0ea4b9d7cd489c087dcc34bf36615a9b870215e1ee42498e6d',
      'baee1681e5c48128e9cf6b1dbe4ae144',
    ),
    price: 79.95,
  },
  {
    externalId: '1052652',
    brand: 'UPPAbaby',
    title: 'UPPAbaby Adapters for Ridge (Aria / Mesa / Bassinet)',
    productUrl: 'https://www.babylist.com/gp/uppababy-adapters-for-ridge-aria-mesa-bassinet/24448/1052652',
    imageUrl: ctf(
      '9fe2af10f1b9a0f80708bb5a101fc0300ce856343caf40d5f46d5ea486bd55d2',
      '828f3a9513aa15eccca6e090328e4fa0',
    ),
    price: 39.99,
  },
  {
    externalId: '2306166',
    brand: 'UPPAbaby',
    title: 'UPPAbaby Adapters for Minu Duo (Mesa / Mesa V2 / Mesa Max / Mesa i-Size / Aria)',
    productUrl:
      'https://www.babylist.com/gp/uppababy-adapters-for-minu-duo-mesa-mesa-v2-mesa-max-mesa-i-size-aria/69536/2306166',
    imageUrl: ctf(
      '1d2d35be7d1fcf48f2c6d266165e2f1730e8798709ee929d45cac02b343424bc',
      '365c29bc2e52232f45f0ccff15d2e744',
    ),
    price: 39.99,
  },
];

type StrollerSpec = {
  externalId: string;
  brand: string;
  model: string;
  productType: string;
  title: string;
  productUrl: string;
  imageUrl: string;
  price: number;
};

const STROLLER: StrollerSpec = {
  externalId: '3240242',
  brand: 'UPPAbaby',
  model: 'Minu Duo',
  productType: 'double stroller',
  title: 'UPPAbaby Minu Duo Stroller',
  productUrl: 'https://www.babylist.com/gp/uppababy-minu-duo-stroller/69531/3240242',
  imageUrl: ctf(
    'fda9f80f41df7615af84044e9915eb0ca7712a48c1b4941be13a8f14c54f0abb',
    '19f1979cbfd7d131bef5662420d138e9',
  ),
  price: 749.99,
};

async function upsertAdapter(spec: AdapterSpec) {
  const product = await db.affiliateCatalogProduct.upsert({
    where: { provider_externalId: { provider: 'babylist_impact', externalId: spec.externalId } },
    update: {
      brand: spec.brand,
      title: spec.title,
      affiliateUrl: babylistAffiliate(spec.productUrl),
      imageUrl: spec.imageUrl,
      price: spec.price,
      retailer: 'Babylist',
      isActiveInFeed: true,
      lastSyncedAt: new Date(),
    },
    create: {
      provider: 'babylist_impact',
      externalId: spec.externalId,
      brand: spec.brand,
      title: spec.title,
      affiliateUrl: babylistAffiliate(spec.productUrl),
      productUrl: babylistAffiliate(spec.productUrl),
      imageUrl: spec.imageUrl,
      price: spec.price,
      currency: 'USD',
      retailer: 'Babylist',
      isActiveInFeed: true,
    },
    select: { id: true },
  });

  await db.productEnrichment.upsert({
    where: { rawProductId: product.id },
    update: {
      canonicalBrand: spec.brand,
      tmbcCategory: 'Travel Systems & Adapters',
      productType: 'car seat adapter',
      reviewStatus: 'REVIEWED',
      isPublic: true,
      needsReview: false,
    },
    create: {
      rawProductId: product.id,
      canonicalBrand: spec.brand,
      tmbcCategory: 'Travel Systems & Adapters',
      productType: 'car seat adapter',
      reviewStatus: 'REVIEWED',
      isPublic: true,
      needsReview: false,
    },
  });
}

async function ensureStrollerRow(brand: string, model: string) {
  const existing = await db.stroller.findFirst({
    where: { brand: { equals: brand, mode: 'insensitive' }, model: { equals: model, mode: 'insensitive' } },
    select: { id: true },
  });
  if (existing) return existing.id as string;
  const created = await db.stroller.create({
    data: { brand, model, displayName: `${brand} ${model}`, babylistUpdatedAt: new Date() },
    select: { id: true },
  });
  return created.id as string;
}

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Add Donkey / Ridge / Minu Duo adapters + Minu Duo stroller ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  for (const spec of ADAPTERS) {
    console.log(`  ADAPTER  $${spec.price.toFixed(2)}  ${spec.title}`);
    if (apply) await upsertAdapter(spec);
  }

  console.log(`\n  STROLLER $${STROLLER.price.toFixed(2)}  ${STROLLER.title}  [${STROLLER.productType}]`);
  if (apply) {
    const product = await db.affiliateCatalogProduct.upsert({
      where: { provider_externalId: { provider: 'babylist_impact', externalId: STROLLER.externalId } },
      update: {
        brand: STROLLER.brand,
        title: STROLLER.title,
        affiliateUrl: babylistAffiliate(STROLLER.productUrl),
        imageUrl: STROLLER.imageUrl,
        price: STROLLER.price,
        retailer: 'Babylist',
        isActiveInFeed: true,
        lastSyncedAt: new Date(),
      },
      create: {
        provider: 'babylist_impact',
        externalId: STROLLER.externalId,
        brand: STROLLER.brand,
        title: STROLLER.title,
        affiliateUrl: babylistAffiliate(STROLLER.productUrl),
        productUrl: babylistAffiliate(STROLLER.productUrl),
        imageUrl: STROLLER.imageUrl,
        price: STROLLER.price,
        currency: 'USD',
        retailer: 'Babylist',
        isActiveInFeed: true,
      },
      select: { id: true },
    });

    await db.productEnrichment.upsert({
      where: { rawProductId: product.id },
      update: {
        canonicalBrand: STROLLER.brand,
        canonicalName: STROLLER.model,
        tmbcCategory: 'Strollers',
        productType: STROLLER.productType,
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
      create: {
        rawProductId: product.id,
        canonicalBrand: STROLLER.brand,
        canonicalName: STROLLER.model,
        tmbcCategory: 'Strollers',
        productType: STROLLER.productType,
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
    });

    // Wire the Minu Duo's adapter compatibility the same way the UPPAbaby rule in
    // applyUniversalAdapterCompatibility does: one ADAPTER row per Nuna infant
    // seat (trigger → engine expands to CYBEX / Clek / Maxi-Cosi / Britax) plus
    // Chicco infant seats via the UPPAbaby Chicco adapter.
    const strollerId = await ensureStrollerRow(STROLLER.brand, STROLLER.model);
    const seats: { id: string; brand: string; model: string }[] = await db.carSeat.findMany({
      where: {
        seatType: 'INFANT',
        OR: [
          { brand: { equals: 'Nuna', mode: 'insensitive' } },
          { brand: { equals: 'Chicco', mode: 'insensitive' } },
        ],
      },
      select: { id: true, brand: true, model: true },
    });
    let created = 0;
    for (const seat of seats) {
      const existingRow = await db.compatibility.findFirst({
        where: { strollerId, carSeatId: seat.id },
        select: { id: true },
      });
      if (existingRow) continue;
      await db.compatibility.create({
        data: {
          strollerId,
          carSeatId: seat.id,
          compatibilityType: 'ADAPTER',
          adapterRequired: true,
          adapterType: null,
          confidence: 'MEDIUM',
          notes:
            'UPPAbaby Minu Duo accepts Nuna / Maxi-Cosi / CYBEX / Clek (and Chicco) infant seats via the UPPAbaby car seat adapter (sold separately). Confirm the exact adapter for your model year before purchase.',
        },
      });
      created += 1;
    }
    console.log(`  wired ${created} Minu Duo adapter compatibility rows (Nuna trigger + Chicco).`);
  }

  console.log(
    `\n${apply ? 'Done — added 3 adapters + the Minu Duo stroller.' : '(dry run — re-run with --apply.)'}`,
  );
}

main()
  .catch((error) => {
    console.error('[addDonkeyRidgeMinuDuo] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
