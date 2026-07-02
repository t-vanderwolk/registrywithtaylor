/**
 * Add car-seat adapters via Babylist links (babylist_impact catalog products,
 * Travel Systems & Adapters). Titles keep the stroller model so the travel-system
 * engine can attach them as the "Shop adapter" link:
 *   • Zoe Journey Car Seat Adapter (Chicco)               — The Journey
 *   • Cybex Gazelle S Infant Car Seat Adapter (Graco/Chicco/Peg Perego)
 *   • Baby Jogger Chicco/Peg Perego Adapter — City Mini 2 & City Mini GT2
 *
 *   npx tsx scripts/addBabylistAdapters.ts            # dry run (default)
 *   npx tsx scripts/addBabylistAdapters.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-babylist-adapters-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const babylistAffiliate = (productUrl: string) =>
  `https://babylist.pxf.io/c/6560395/1056628/13580?u=${encodeURIComponent(productUrl)}&partnerpropertyid=7490466`;

type Spec = {
  brand: string;
  externalId: string;
  title: string;
  productUrl: string;
  imageUrl: string;
  price: number;
};

const SPECS: Spec[] = [
  {
    brand: 'Zoe',
    externalId: '2332488',
    title: 'Zoe Journey Car Seat Adapter (Chicco)',
    productUrl: 'https://www.babylist.com/gp/zoe-journey-car-seat-adapter-chicco/69946/2332488',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/1d111714cb311882ec382eaeac2fc92e7b3fcb3509a833abb006641e07e2216c/a1662ba6c4d2214b652eb5a5a02fade5/1d111714cb311882ec382eaeac2fc92e7b3fcb3509a833abb006641e07e2216c.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 55.0,
  },
  {
    brand: 'Cybex',
    externalId: '851066',
    title: 'Cybex Gazelle S Infant Car Seat Adapter (Graco / Chicco / Peg Perego)',
    productUrl: 'https://www.babylist.com/gp/cybex-gazelle-s-infant-car-seat-adapter/26553/851066',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/6e70e69952b98fc22b2e5868d4d06bc1a4a32130b4d0eb0ae4c0ae2a3303a436/5c16c602ba82cccdc0a38e5d579e2bfa/6e70e69952b98fc22b2e5868d4d06bc1a4a32130b4d0eb0ae4c0ae2a3303a436.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 79.95,
  },
  {
    brand: 'Baby Jogger',
    externalId: '219587',
    title: 'Baby Jogger Chicco / Peg Perego Car Seat Adapter for City Mini 2 & City Mini GT2',
    productUrl:
      'https://www.babylist.com/gp/baby-jogger-chicco-peg-perego-car-seat-adapter-for-city-mini-2-city-mini-gt2/15103/219587',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/a8f7db092d4207148f12ce58d45f3e9a53891e2754e053943dae1f84353193bd/26342cc3c32141fa98db13c77c6ce490/a8f7db092d4207148f12ce58d45f3e9a53891e2754e053943dae1f84353193bd.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 84.99,
  },
];

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Add Babylist car-seat adapters ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  for (const spec of SPECS) {
    console.log(`  ${spec.brand.padEnd(12)} $${spec.price}  ${spec.title.slice(0, 62)}`);
    if (!apply) continue;

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
        imageUrl: spec.imageUrl,
        price: spec.price,
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

  console.log(`\n${apply ? `Done — added ${SPECS.length} adapter link(s).` : '(dry run — re-run with --apply.)'}`);
}

main()
  .catch((error) => {
    console.error('[addBabylistAdapters] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
