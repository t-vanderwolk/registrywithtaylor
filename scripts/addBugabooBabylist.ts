/**
 * Add the two Bugaboo strollers that were missing from the finder — Fox 5 and
 * Dragonfly Plus — using the exact Babylist (Impact) affiliate links Taylor
 * supplied. The finder only shows a stroller that has a public Babylist or
 * MacroBaby catalog offer, so each of these gets a `babylist_impact` product
 * (URL + image + price), public REVIEWED enrichment, and a Stroller row so the
 * travel-system checker can resolve car-seat compatibility.
 *
 * Compatibility (Nuna / Maxi-Cosi / CYBEX / Clek adapter expansion) is wired by
 * the universal-adapter script — the Bugaboo rule already matches /fox/ and
 * /dragonfly/, so run it AFTER this one:
 *   DB=... npm run catalog:universal-adapter-compatibility-apply
 *
 *   npx tsx scripts/addBugabooBabylist.ts            # dry run (default)
 *   npx tsx scripts/addBugabooBabylist.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-bugaboo-babylist-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

type Spec = {
  brand: string;
  model: string;
  productType: string;
  externalId: string; // Babylist SKU id (last path segment) so a future feed sync upserts the same row
  title: string;
  affiliateUrl: string;
  imageUrl: string;
  price: number;
};

const SPECS: Spec[] = [
  {
    brand: 'Bugaboo',
    model: 'Fox 5',
    productType: 'full-size stroller',
    // Title must NOT contain "bassinet" — the finder's noise filter
    // (STROLLER_PRODUCT_NOISE_RE) drops any product whose title matches \bbassinet\b,
    // which is why the original "…Complete Stroller & Bassinet" title never showed.
    externalId: '2365261',
    title: 'Bugaboo Fox 5 Renew Complete Stroller',
    affiliateUrl:
      'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fbugaboo-fox-5-renew-complete-stroller-bassinet%2F71205%2F2365261&partnerpropertyid=7490466',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/28dddfee9846dfe6b10b9322a81ceaba1527bd1a6bdf92e8f5761a1338ec7d4a/091d4395f09bf2ff852132907a6192cc/28dddfee9846dfe6b10b9322a81ceaba1527bd1a6bdf92e8f5761a1338ec7d4a.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 1499.0,
  },
  {
    brand: 'Bugaboo',
    model: 'Dragonfly Plus',
    productType: 'compact stroller',
    externalId: '3404353',
    title: 'Bugaboo Dragonfly Plus Seat Stroller',
    affiliateUrl:
      'https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fbugaboo-dragonfly-plus-seat-stroller%2F84627%2F3404353&partnerpropertyid=7490466',
    imageUrl:
      'https://images.ctfassets.net/50gzycvace50/20a2fffaab72b84fc935afb3fc64c2408234da2af2de0c58c15c44ce63880791/1f0743cd55286f3612eaf94bd77a13e6/20a2fffaab72b84fc935afb3fc64c2408234da2af2de0c58c15c44ce63880791.png?fl=progressive&fm=jpg&bg=rgb:fafafa&w=1240&h=1240',
    price: 1099.0,
  },
];

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
  console.log(`── Add Bugaboo (Babylist) strollers ──  (${apply ? 'APPLY' : 'dry-run'})\n`);

  for (const spec of SPECS) {
    console.log(`${spec.brand} ${spec.model}  ($${spec.price})`);
    console.log(`   ${spec.affiliateUrl.slice(0, 70)}…`);

    if (apply) {
      const product = await db.affiliateCatalogProduct.upsert({
        where: { provider_externalId: { provider: 'babylist_impact', externalId: spec.externalId } },
        update: {
          brand: spec.brand,
          title: spec.title,
          affiliateUrl: spec.affiliateUrl,
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
          affiliateUrl: spec.affiliateUrl,
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
    }

    const strollerState = await ensureStrollerRow(spec, apply);
    console.log(`   Stroller row: ${strollerState}\n`);
  }

  console.log(apply ? 'Done — added 2 Bugaboo Babylist strollers.' : '(dry run — re-run with --apply.)');
  if (apply) console.log('Next: DB=… npm run catalog:universal-adapter-compatibility-apply');
}

main()
  .catch((error) => {
    console.error('[addBugabooBabylist] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
