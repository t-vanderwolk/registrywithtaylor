/**
 * Add the full set of Zoe car-seat adapters (babylist_impact, Travel Systems &
 * Adapters) and match them in the travel-system checker. Each title carries the
 * target Zoe stroller model + the car-seat brands it covers so the engine attaches
 * the RIGHT adapter per (stroller, seat brand). Pair with
 * catalog:universal-adapter-compatibility-apply (Zoe rules now wire euro group +
 * UPPAbaby / Graco / Chicco for Tour/Twin/Trio/Tribe and Chicco for The Journey).
 *
 *   • The Journey  → euro (Nuna/Maxi-Cosi/Cybex/Britax) + Chicco
 *   • Tour v3      → euro + Graco/Chicco + UPPAbaby
 *   • Twin v3      → euro + Graco/Chicco + UPPAbaby
 *
 *   npx tsx scripts/addZoeAdapters.ts            # dry run (default)
 *   npx tsx scripts/addZoeAdapters.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-zoe-adapters-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const babylistAffiliate = (productUrl: string) =>
  `https://babylist.pxf.io/c/6560395/1056628/13580?u=${encodeURIComponent(productUrl)}&partnerpropertyid=7490466`;

const ctf = (a: string, b: string) =>
  `https://images.ctfassets.net/50gzycvace50/${a}/${b}/${a}.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240`;

type Spec = { externalId: string; title: string; productUrl: string; imageUrl: string };

const PRICE = 55.0;

const SPECS: Spec[] = [
  {
    externalId: '2332490',
    title: 'Zoe The Journey Car Seat Adapter (Nuna / Maxi-Cosi / Cybex / Britax)',
    productUrl: 'https://www.babylist.com/gp/zoe-journey-car-seat-adapter-nuna-maxi-cosi-cybex-britax/69947/2332490',
    imageUrl: ctf('08ba5fc75e627ab91049c2f501c7844fcf8d838c5adbf0bb13a4e04af9c9791b', '0e54f592d624d123a0003f95964f753a'),
  },
  {
    externalId: '2332488',
    title: 'Zoe The Journey Car Seat Adapter (Chicco)',
    productUrl: 'https://www.babylist.com/gp/zoe-journey-car-seat-adapter-chicco/69946/2332488',
    imageUrl: ctf('1d111714cb311882ec382eaeac2fc92e7b3fcb3509a833abb006641e07e2216c', 'a1662ba6c4d2214b652eb5a5a02fade5'),
  },
  {
    externalId: '3404306',
    title: 'Zoe Tour Car Seat Adapter (Nuna / Maxi-Cosi / Cybex / Britax) - Tour v3',
    productUrl: 'https://www.babylist.com/gp/zoe-tour-v3-nuna-car-seat-adapter/84622/3404306',
    imageUrl: ctf('dd061c9c9429932bde2e984c8015df2d5a61dc9eefe121ccd1ecc992426c0039', 'bc1be64dafcbc5e5ee47dc6e3e026024'),
  },
  {
    externalId: '3404323',
    title: 'Zoe Twin Car Seat Adapter for UPPAbaby (Twin v3)',
    productUrl: 'https://www.babylist.com/gp/zoe-twin-v3-uppababy-car-seat-adapter/84624/3404323',
    imageUrl: ctf('7ca7cf675209dbbc936c0c91cff8315a97ec2796049d4bcdae3675a2523c0061', 'fcc0bd78a66f5146c035b8d25450ae2e'),
  },
  {
    externalId: '3404326',
    title: 'Zoe Tour Car Seat Adapter (Graco / Chicco) - Tour v3',
    productUrl: 'https://www.babylist.com/gp/zoe-tour-v3-graco-chicco-car-seat-adapter/84625/3404326',
    imageUrl: ctf('cedab2a30d8548db65e4f717b16e38ebb587eead065fc506ea4d45214cf3bd19', 'a20dd6c2c8d8b6630756dfe8d0f2b956'),
  },
  {
    externalId: '2082699',
    title: 'Zoe Twin Car Seat Adapter (Nuna / Maxi-Cosi / Cybex / Britax) - Twin / Trio / Tribe',
    productUrl: 'https://www.babylist.com/gp/zoe-the-twin-trio-tribe-nuna-car-seat-adapter/57083/2082699',
    imageUrl: ctf('b703bf970f87849200c03cdba60a3bdd2b890cdebe20b77ce8452f49712bd70a', '6a2e542745562b3d31a198baeaede157'),
  },
  {
    externalId: '2082700',
    title: 'Zoe Twin & Tour Car Seat Adapter (Graco / Chicco) - Twin / Trio / Tribe',
    productUrl: 'https://www.babylist.com/gp/zoe-the-twin-trio-tribe-and-tour-v3-graco-chicco-car-seat-adapter/55624/2082700',
    imageUrl: ctf('6a2a3a39d15c2548c16016ea85266ef7655ff6846f2492b92217c5642b4b58a4', '5608570cf444be28d0b703597d617958'),
  },
];

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Add Zoe car-seat adapters ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  for (const spec of SPECS) {
    console.log(`  $${PRICE}  ${spec.title}`);
    if (!apply) continue;

    const product = await db.affiliateCatalogProduct.upsert({
      where: { provider_externalId: { provider: 'babylist_impact', externalId: spec.externalId } },
      update: {
        brand: 'Zoe',
        title: spec.title,
        affiliateUrl: babylistAffiliate(spec.productUrl),
        imageUrl: spec.imageUrl,
        price: PRICE,
        retailer: 'Babylist',
        isActiveInFeed: true,
        lastSyncedAt: new Date(),
      },
      create: {
        provider: 'babylist_impact',
        externalId: spec.externalId,
        brand: 'Zoe',
        title: spec.title,
        affiliateUrl: babylistAffiliate(spec.productUrl),
        imageUrl: spec.imageUrl,
        price: PRICE,
        retailer: 'Babylist',
        isActiveInFeed: true,
      },
      select: { id: true },
    });

    await db.productEnrichment.upsert({
      where: { rawProductId: product.id },
      update: {
        canonicalBrand: 'Zoe',
        tmbcCategory: 'Travel Systems & Adapters',
        productType: 'car seat adapter',
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
      create: {
        rawProductId: product.id,
        canonicalBrand: 'Zoe',
        tmbcCategory: 'Travel Systems & Adapters',
        productType: 'car seat adapter',
        reviewStatus: 'REVIEWED',
        isPublic: true,
        needsReview: false,
      },
    });
  }

  console.log(`\n${apply ? `Done — added ${SPECS.length} Zoe adapters.` : '(dry run — re-run with --apply.)'}`);
  if (apply) console.log('Next: DB=… npm run catalog:universal-adapter-compatibility-apply  (wires Zoe Graco/Chicco/UPPAbaby compatibility)');
}

main()
  .catch((error) => {
    console.error('[addZoeAdapters] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
