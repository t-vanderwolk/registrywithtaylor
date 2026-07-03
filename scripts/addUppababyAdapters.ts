/**
 * Add UPPAbaby / Nuna car-seat adapters (babylist_impact, Travel Systems &
 * Adapters) and match them in the checker. The UPPAbaby universal-adapter rule
 * already wires Vista / Cruz / Minu compatibility (euro group + Chicco), so these
 * just need to exist with titles that name the target stroller model(s) + version
 * so the engine surfaces the right one per (stroller, seat brand):
 *   • UPPAbaby Minu V3 (Maxi-Cosi / Nuna / Clek)                       $69.99
 *   • UPPAbaby Vista & Cruz (Maxi-Cosi / Nuna / Cybex)                 $49.99
 *   • Nuna PIPA Adapter for UPPAbaby Vista & Cruz (Nuna PIPA only)     $75.00
 *
 *   npx tsx scripts/addUppababyAdapters.ts            # dry run (default)
 *   npx tsx scripts/addUppababyAdapters.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-uppababy-adapters-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const babylistAffiliate = (productUrl: string) =>
  `https://babylist.pxf.io/c/6560395/1056628/13580?u=${encodeURIComponent(productUrl)}&partnerpropertyid=7490466`;

const ctf = (a: string, b: string) =>
  `https://images.ctfassets.net/50gzycvace50/${a}/${b}/${a}.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240`;

type Spec = { externalId: string; brand: string; title: string; productUrl: string; imageUrl: string; price: number };

const SPECS: Spec[] = [
  {
    externalId: '2351354',
    brand: 'UPPAbaby',
    title: 'UPPAbaby Minu V3 Car Seat Adapters (Maxi-Cosi / Nuna / Clek)',
    productUrl: 'https://www.babylist.com/gp/uppababy-minu-v3-car-seat-adapters-for-maxi-cosi-nuna-and-clek/70618/2351354',
    imageUrl: ctf('63978ba77e5149526988bcb8c21d72cbdaacb305277244a27cdee3ae97be2f40', '3884b8cba550514c671748c1be9b8c7a'),
    price: 69.99,
  },
  {
    externalId: '1052650',
    brand: 'UPPAbaby',
    title: 'UPPAbaby Vista & Cruz Car Seat Adapters (Maxi-Cosi / Nuna / Cybex) - Vista V2 / Vista V3 / Cruz V2 / Cruz V3',
    productUrl: 'https://www.babylist.com/gp/uppababy-vista-cruz-car-seat-adapters-for-maxi-cosi-nuna-and-cybex/24444/1052650',
    imageUrl: ctf('d2d356b18074f74fce6c89be53cce738e53ad2570b32cf785f8a80cfec6402ae', 'b0d203e9b72a463aa08f65343fd3b6f5'),
    price: 49.99,
  },
  {
    externalId: '31191',
    brand: 'Nuna',
    title: 'Nuna PIPA Adapter for UPPAbaby Vista & Cruz - Vista V2 / Vista V3 / Cruz V2 / Cruz V3',
    productUrl: 'https://www.babylist.com/gp/nuna-pipa-adapter-for-uppababy-vista-and-cruz/14468/31191',
    imageUrl: ctf('8d9c0f79a27054129873cfba0b2d63867ce3462beba32f0914946d117850fa09', '0cb665800885862c396c14ab92591875'),
    price: 75.0,
  },
];

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Add UPPAbaby / Nuna Vista-Cruz-Minu adapters ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  for (const spec of SPECS) {
    console.log(`  $${spec.price}  ${spec.title}`);
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

  console.log(`\n${apply ? `Done — added ${SPECS.length} UPPAbaby/Nuna adapters.` : '(dry run — re-run with --apply.)'}`);
}

main()
  .catch((error) => {
    console.error('[addUppababyAdapters] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
