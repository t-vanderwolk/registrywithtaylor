/**
 * Add brand-specific car-seat adapters (babylist_impact, Travel Systems &
 * Adapters). Titles keep the stroller model + car-seat brand so the travel
 * system engine matches each seat to the RIGHT adapter:
 *   • Veer Switchback Infant Car Seat Adapter — UPPAbaby / Graco / Cybex·Nuna·Maxi-Cosi
 *   • Zoe Tour v3 UPPAbaby Car Seat Adapter
 *   • Zoe Twin v3 UPPAbaby Car Seat Adapter
 *
 * Pair with catalog:universal-adapter-compatibility-apply (Veer switch rule now
 * carries UPPAbaby/Graco/Britax; Zoe rule now carries UPPAbaby) so the checker
 * shows those seats as adapter-required and surfaces these adapters.
 *
 *   npx tsx scripts/addSwitchbackZoeAdapters.ts            # dry run (default)
 *   npx tsx scripts/addSwitchbackZoeAdapters.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-switchback-zoe-apply
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
    brand: 'Veer',
    externalId: '1267189',
    title: 'Veer Switchback Infant Car Seat Adapter for &Roll / &Jog (UPPAbaby)',
    productUrl: 'https://www.babylist.com/gp/veer-switchback-infant-car-seat-adapter/26605/1267189',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/c7355f8151ecc5ecfe28be7e4719224c9e87abc483557529087ceacceb260766/bc5855b5645c2f6e03dc852dafa581be/c7355f8151ecc5ecfe28be7e4719224c9e87abc483557529087ceacceb260766.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 59.0,
  },
  {
    brand: 'Veer',
    externalId: '1267187',
    title: 'Veer Switchback Infant Car Seat Adapter for &Roll / &Jog (Graco)',
    productUrl: 'https://www.babylist.com/gp/veer-switchback-infant-car-seat-adapter/26605/1267187',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/510f472a952aa73f907a36fca941d72e214ea6d6a6eb675feb036c10da375c09/50485b355a584aeefc3c84ee50d8e9e1/510f472a952aa73f907a36fca941d72e214ea6d6a6eb675feb036c10da375c09.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 59.0,
  },
  {
    brand: 'Veer',
    externalId: '1267188',
    title: 'Veer Switchback Infant Car Seat Adapter for &Roll / &Jog (Cybex / Nuna / Maxi-Cosi)',
    productUrl: 'https://www.babylist.com/gp/veer-switchback-infant-car-seat-adapter/26605/1267188',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/c9c8c0fc721c2b7435672ec9c14e57076e8f60a2aa14a8dedd88d40d23a25a0d/dc63fe6677567c75fc457f4f5862c3ce/c9c8c0fc721c2b7435672ec9c14e57076e8f60a2aa14a8dedd88d40d23a25a0d.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 59.0,
  },
  {
    brand: 'Zoe',
    externalId: '3404367',
    title: 'Zoe Tour Car Seat Adapter for UPPAbaby (Tour v3)',
    productUrl: 'https://www.babylist.com/gp/zoe-tour-v3-uppababy-car-seat-adapter/84628/3404367',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/7ec03b684317dba62e822ca30c0c46a0063acab1c84f874711e152f7bfaedd80/35f1807154699ea8aabc99bb61797180/7ec03b684317dba62e822ca30c0c46a0063acab1c84f874711e152f7bfaedd80.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 55.0,
  },
  {
    brand: 'Zoe',
    externalId: '3404323',
    title: 'Zoe Twin Car Seat Adapter for UPPAbaby (Twin v3)',
    productUrl: 'https://www.babylist.com/gp/zoe-twin-v3-uppababy-car-seat-adapter/84624/3404323',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/7ca7cf675209dbbc936c0c91cff8315a97ec2796049d4bcdae3675a2523c0061/fcc0bd78a66f5146c035b8d25450ae2e/7ca7cf675209dbbc936c0c91cff8315a97ec2796049d4bcdae3675a2523c0061.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 55.0,
  },
];

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`── Add Switchback + Zoe UPPAbaby adapters ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  for (const spec of SPECS) {
    console.log(`  ${spec.brand.padEnd(6)} $${spec.price}  ${spec.title}`);
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
  if (apply) console.log('Next: DB=… npm run catalog:universal-adapter-compatibility-apply  (wires Veer/Zoe extra-brand compatibility)');
}

main()
  .catch((error) => {
    console.error('[addSwitchbackZoeAdapters] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
