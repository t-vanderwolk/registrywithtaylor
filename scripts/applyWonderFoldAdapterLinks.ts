/**
 * Attach WonderFold car-seat adapter Amazon links + WonderFold variant images
 * to existing WonderFold compatibility rows. Compatibility verdicts are left
 * unchanged; this only fills empty adapter retail metadata.
 *
 *   npx tsx scripts/applyWonderFoldAdapterLinks.ts            # dry run
 *   npx tsx scripts/applyWonderFoldAdapterLinks.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:wonderfold-adapters-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

const AMAZON_TAG = 'taylormadebab-20';
const AMAZON_FAMILY_ASIN = 'B0C346TF1B';
const AMAZON_FAMILY_URL = `https://www.amazon.com/dp/${AMAZON_FAMILY_ASIN}?tag=${AMAZON_TAG}`;

type SizeBucket =
  | 'W4 OG | Elite | Luxe'
  | 'W2 Elite | Luxe'
  | 'W4/W6 Pro'
  | 'W2 Pro'
  | 'L4'
  | 'L2';

type SeatBucket =
  | 'UPPAbaby'
  | 'Nuna | Cybex | Maxi-Cosi | Clek'
  | 'Graco'
  | 'Britax'
  | 'Chicco';

type AdapterSpec = {
  sizeBucket: SizeBucket;
  seatBucket: SeatBucket;
  sku: string;
  shopifyVariantId: string;
  price: number;
  imageUrl: string;
  asin?: string;
};

const image = (path: string) => `https://wonderfold.com/cdn/shop/files/${path}`;

const VARIANTS: AdapterSpec[] = [
  {
    sizeBucket: 'W4 OG | Elite | Luxe',
    seatBucket: 'UPPAbaby',
    sku: 'W4CSA-UPB',
    shopifyVariantId: '51114033545400',
    price: 99.99,
    imageUrl: image('241204-W2-CSA-UppaBaby-Product-01_5538fd0b-c69b-4b80-8679-3ec721bee86f.png?v=1774634730'),
  },
  {
    sizeBucket: 'W4 OG | Elite | Luxe',
    seatBucket: 'Nuna | Cybex | Maxi-Cosi | Clek',
    sku: 'W4CSA-CNM',
    shopifyVariantId: '42071097868472',
    price: 99.99,
    imageUrl: image('221221-CarSeatAdapter-05_7e47a4a3-e2c3-4fc8-a1d4-f37c49efd485.png?v=1774634730'),
    asin: 'B0C346TF1B',
  },
  {
    sizeBucket: 'W4 OG | Elite | Luxe',
    seatBucket: 'Graco',
    sku: 'W4CSA-GRC',
    shopifyVariantId: '43286913122488',
    price: 99.99,
    imageUrl: image('240325-Graco4Seater-07_ebd09532-3c0d-4340-aab8-156a4a4c78f6.png?v=1774634730'),
    asin: 'B0D82LZ2RP',
  },
  {
    sizeBucket: 'W4 OG | Elite | Luxe',
    seatBucket: 'Britax',
    sku: 'W4CSA-BRT',
    shopifyVariantId: '43286913188024',
    price: 99.99,
    imageUrl: image('240325-Britax4Seater-07_020373bd-2f20-4a45-a5a5-fd12744e53a0.png?v=1774634730'),
    asin: 'B0D82DGLLF',
  },
  {
    sizeBucket: 'W4 OG | Elite | Luxe',
    seatBucket: 'Chicco',
    sku: 'W4CSA-CHC',
    shopifyVariantId: '48425026650296',
    price: 99.99,
    imageUrl: image('240325-Chicco4Seater-07_efaa0fb3-b2d9-4f71-bac0-ed797ef3e0da.png?v=1774634730'),
  },
  {
    sizeBucket: 'W2 Elite | Luxe',
    seatBucket: 'UPPAbaby',
    sku: 'W2CSA-UPB',
    shopifyVariantId: '51114033578168',
    price: 94.99,
    imageUrl: image('241120-UppaBaby2S-01_d1b606e9-20ea-46f9-8003-8abf78993fe6.png?v=1774634730'),
  },
  {
    sizeBucket: 'W2 Elite | Luxe',
    seatBucket: 'Nuna | Cybex | Maxi-Cosi | Clek',
    sku: 'W2CSA-CNM',
    shopifyVariantId: '42289032069304',
    price: 94.99,
    imageUrl: image('230407-CarSeatAdapter-2.png?v=1774634730'),
  },
  {
    sizeBucket: 'W2 Elite | Luxe',
    seatBucket: 'Graco',
    sku: 'W2CSA-GRC',
    shopifyVariantId: '43286913220792',
    price: 94.99,
    imageUrl: image('240325-Graco2Seater-07_f0ef61d5-9738-4c0b-8920-58d4c820ac4a.png?v=1774634730'),
  },
  {
    sizeBucket: 'W2 Elite | Luxe',
    seatBucket: 'Britax',
    sku: 'W2CSA-BRT',
    shopifyVariantId: '43286913319096',
    price: 94.99,
    imageUrl: image('240325-Britax2Seater-07_65b108f2-44c1-4028-8065-d014ed7c2ef3.png?v=1774634730'),
    asin: 'B0CCB3RP4R',
  },
  {
    sizeBucket: 'W2 Elite | Luxe',
    seatBucket: 'Chicco',
    sku: 'W2CSA-CHC',
    shopifyVariantId: '48425026683064',
    price: 94.99,
    imageUrl: image('240325-Chicco2Seater-07_e26a7a7b-7cd2-4f2e-a5bd-4c1640f2a149.png?v=1774634730'),
  },
  {
    sizeBucket: 'W4/W6 Pro',
    seatBucket: 'UPPAbaby',
    sku: 'W4W6PCSA-UPB',
    shopifyVariantId: '52188688351416',
    price: 99.99,
    imageUrl: image('241129-W4-CSA-UppaBaby-Product-12.png?v=1774634730'),
    asin: 'B0FVGHLBV6',
  },
  {
    sizeBucket: 'W4/W6 Pro',
    seatBucket: 'Nuna | Cybex | Maxi-Cosi | Clek',
    sku: 'W4W6PCSA-CNM',
    shopifyVariantId: '52188688220344',
    price: 99.99,
    imageUrl: image('221221-CarSeatAdapter-05_7e47a4a3-e2c3-4fc8-a1d4-f37c49efd485.png?v=1774634730'),
  },
  {
    sizeBucket: 'W4/W6 Pro',
    seatBucket: 'Graco',
    sku: 'W4W6PCSA-GRC',
    shopifyVariantId: '52188688253112',
    price: 99.99,
    imageUrl: image('241129-W4-CSA-Graco-Product-11.png?v=1774634730'),
  },
  {
    sizeBucket: 'W4/W6 Pro',
    seatBucket: 'Britax',
    sku: 'W4W6PCSA-BRT',
    shopifyVariantId: '52188688285880',
    price: 99.99,
    imageUrl: image('241128-W4-Pro-CSA-Britax-Product-12_1cada53c-6b42-48e9-8900-dbaac9a8c136.png?v=1774634730'),
    asin: 'B0FVGHY9GC',
  },
  {
    sizeBucket: 'W4/W6 Pro',
    seatBucket: 'Chicco',
    sku: 'W4W6PCSA-CHC',
    shopifyVariantId: '52188688318648',
    price: 99.99,
    imageUrl: image('241129-W4-CSA-Chicco-Product-12.png?v=1774634730'),
  },
  {
    sizeBucket: 'W2 Pro',
    seatBucket: 'UPPAbaby',
    sku: 'W2PCSA-UPB',
    shopifyVariantId: '52188688515256',
    price: 94.99,
    imageUrl: image('241204-W2-CSA-UppaBaby-Product-05.png?v=1774634730'),
  },
  {
    sizeBucket: 'W2 Pro',
    seatBucket: 'Nuna | Cybex | Maxi-Cosi | Clek',
    sku: 'W2PCSA-CNM',
    shopifyVariantId: '52188688384184',
    price: 94.99,
    imageUrl: image('241129-W2-CSA-Nuna--Product-10.png?v=1774634730'),
    asin: 'B0FV3PTXYN',
  },
  {
    sizeBucket: 'W2 Pro',
    seatBucket: 'Graco',
    sku: 'W2PCSA-GRC',
    shopifyVariantId: '52188688416952',
    price: 94.99,
    imageUrl: image('241202-W2-CSA-Graco-Product-13_5d647a1f-9de7-44b5-ac2b-0d7c40c8d2c5.png?v=1774634730'),
  },
  {
    sizeBucket: 'W2 Pro',
    seatBucket: 'Britax',
    sku: 'W2PCSA-BRT',
    shopifyVariantId: '52188688449720',
    price: 94.99,
    imageUrl: image('241205-W2-CSA-Britax-Product-05.png?v=1774634730'),
  },
  {
    sizeBucket: 'W2 Pro',
    seatBucket: 'Chicco',
    sku: 'W2PCSA-CHC',
    shopifyVariantId: '52188688482488',
    price: 94.99,
    imageUrl: image('241204-W2-CSA-Chicco-Product-04.png?v=1774634730'),
  },
  {
    sizeBucket: 'L4',
    seatBucket: 'UPPAbaby',
    sku: 'L4CSA-UPB',
    shopifyVariantId: '52188946301112',
    price: 99.99,
    imageUrl: image('250618-L4-CSA-Uppababy-Product-10.png?v=1774634730'),
  },
  {
    sizeBucket: 'L4',
    seatBucket: 'Nuna | Cybex | Maxi-Cosi | Clek',
    sku: 'L4CSA-CNM',
    shopifyVariantId: '52188946170040',
    price: 99.99,
    imageUrl: image('250616-L4-CSA-CNM-Product-07_1.png?v=1774634730'),
    asin: 'B0FVGG4CJ9',
  },
  {
    sizeBucket: 'L4',
    seatBucket: 'Graco',
    sku: 'L4CSA-GRC',
    shopifyVariantId: '52188946202808',
    price: 99.99,
    imageUrl: image('L4-CSA-Graco-Product-14.png?v=1774634730'),
    asin: 'B0FVGHZ39P',
  },
  {
    sizeBucket: 'L4',
    seatBucket: 'Britax',
    sku: 'L4CSA-BRT',
    shopifyVariantId: '52188946235576',
    price: 99.99,
    imageUrl: image('250612-L4-CSA-Britax-Product-12.png?v=1774634730'),
  },
  {
    sizeBucket: 'L4',
    seatBucket: 'Chicco',
    sku: 'L4CSA-CHC',
    shopifyVariantId: '52188946268344',
    price: 99.99,
    imageUrl: image('250624-L4-CSA-Chicco-Product-11.png?v=1774634730'),
  },
  {
    sizeBucket: 'L2',
    seatBucket: 'UPPAbaby',
    sku: 'L2CSA-UPB',
    shopifyVariantId: '52188946464952',
    price: 94.99,
    imageUrl: image('250619-L2-CSA-Uppa-Baby-Product.png?v=1774634730'),
  },
  {
    sizeBucket: 'L2',
    seatBucket: 'Nuna | Cybex | Maxi-Cosi | Clek',
    sku: 'L2CSA-CNM',
    shopifyVariantId: '52188946333880',
    price: 94.99,
    imageUrl: image('250619-L2-CSA-Nuna-Product.png?v=1774634730'),
    asin: 'B0FV3V6V2H',
  },
  {
    sizeBucket: 'L2',
    seatBucket: 'Graco',
    sku: 'L2CSA-GRC',
    shopifyVariantId: '52188946366648',
    price: 94.99,
    imageUrl: image('250619-L2-CSA-Graco-Product.png?v=1774634730'),
  },
  {
    sizeBucket: 'L2',
    seatBucket: 'Britax',
    sku: 'L2CSA-BRT',
    shopifyVariantId: '52188946399416',
    price: 94.99,
    imageUrl: image('L2-CSA-Britax-Product-10.png?v=1774634730'),
    asin: 'B0FVGCKDMX',
  },
  {
    sizeBucket: 'L2',
    seatBucket: 'Chicco',
    sku: 'L2CSA-CHC',
    shopifyVariantId: '52188946432184',
    price: 94.99,
    imageUrl: image('L2-CSA-Chicco-Product-10.png?v=1774634730'),
    asin: 'B0FVGFX9RV',
  },
];

const VARIANT_BY_KEY = new Map(VARIANTS.map((variant) => [`${variant.sizeBucket}::${variant.seatBucket}`, variant]));

const has = (value: string | null | undefined) => typeof value === 'string' && value.trim().length > 0;
const norm = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
const amazonDp = (asin: string) => `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
const amazonSearch = (variant: AdapterSpec) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(`WonderFold ${variant.sku} car seat adapter`)}&tag=${AMAZON_TAG}`;
const amazonUrl = (variant: AdapterSpec) => (variant.asin ? amazonDp(variant.asin) : amazonSearch(variant));
const amazonAsinFromUrl = (url: string | null | undefined) =>
  url?.match(/\/(?:dp|product|asin)\/([A-Z0-9]{10})/i)?.[1]?.toUpperCase() ?? null;

type WonderFoldCompatibilityRow = {
  id: string;
  compatibilityType: string;
  adapterRequired: boolean;
  adapterType: string | null;
  adapterBabylistUrl: string | null;
  adapterImage: string | null;
  adapterPrice: number | null;
  stroller: { brand: string; model: string; displayName: string | null };
  carSeat: { brand: string; model: string };
};

function sizeBucketFor(model: string): SizeBucket | null {
  const normalized = norm(model);

  if (/\bl2\b/.test(normalized)) return 'L2';
  if (/\bl4\b/.test(normalized)) return 'L4';
  if (/\bw6\b/.test(normalized)) return 'W4/W6 Pro';
  if (/\bw4\b/.test(normalized) && /\bpro\b/.test(normalized)) return 'W4/W6 Pro';
  if (/\bw2\b/.test(normalized) && /\bpro\b/.test(normalized)) return 'W2 Pro';
  if (/\bvw\b/.test(normalized) && /\bquad\b/.test(normalized)) return 'W4 OG | Elite | Luxe';
  if (/\bw2\b/.test(normalized) || /\bvolkswagon\b/.test(normalized) || /\bvolkswagen\b/.test(normalized)) {
    return 'W2 Elite | Luxe';
  }
  if (/\bvw\b/.test(normalized) || /\bw4\b/.test(normalized)) return 'W4 OG | Elite | Luxe';

  return null;
}

function seatBucketFor(brand: string): SeatBucket | null {
  const normalized = norm(brand);
  if (normalized === 'uppababy') return 'UPPAbaby';
  if (['nuna', 'cybex', 'maxi cosi', 'clek'].includes(normalized)) return 'Nuna | Cybex | Maxi-Cosi | Clek';
  if (normalized === 'graco') return 'Graco';
  if (normalized === 'britax') return 'Britax';
  if (normalized === 'chicco') return 'Chicco';
  return null;
}

function adapterSpecFor(row: WonderFoldCompatibilityRow): AdapterSpec | null {
  const sizeBucket = sizeBucketFor(row.stroller.model);
  const seatBucket = seatBucketFor(row.carSeat.brand);
  if (!sizeBucket || !seatBucket) return null;
  return VARIANT_BY_KEY.get(`${sizeBucket}::${seatBucket}`) ?? null;
}

function adapterTypeFor(variant: AdapterSpec) {
  return `WonderFold ${variant.sizeBucket} Car Seat Adapter - ${variant.seatBucket} (${variant.sku})`;
}

function adapterUrlNeedsUpdate(row: WonderFoldCompatibilityRow, variant: AdapterSpec) {
  if (!has(row.adapterBabylistUrl)) return true;
  if (!variant.asin) return false;

  const currentAsin = amazonAsinFromUrl(row.adapterBabylistUrl);
  if (currentAsin) return currentAsin !== variant.asin;

  return row.adapterBabylistUrl!.includes(`WonderFold%20${variant.sku}%20car%20seat%20adapter`);
}

async function main() {
  console.log(`Attach WonderFold adapter links + images (${APPLY ? 'APPLY' : 'dry run'})\n`);
  console.log(`  Amazon family page: ${AMAZON_FAMILY_URL}`);
  console.log(`  WonderFold variant specs loaded: ${VARIANTS.length}\n`);

  const rows: WonderFoldCompatibilityRow[] = await db.compatibility.findMany({
    where: {
      stroller: {
        brand: { startsWith: 'WonderFold', mode: 'insensitive' },
      },
      OR: [{ compatibilityType: 'ADAPTER' }, { adapterRequired: true }],
    },
    select: {
      id: true,
      compatibilityType: true,
      adapterRequired: true,
      adapterType: true,
      adapterBabylistUrl: true,
      adapterImage: true,
      adapterPrice: true,
      stroller: { select: { brand: true, model: true, displayName: true } },
      carSeat: { select: { brand: true, model: true } },
    },
    orderBy: [{ stroller: { model: 'asc' } }, { carSeat: { brand: 'asc' } }, { carSeat: { model: 'asc' } }],
  });

  const targets = rows.filter((row) => {
    const variant = adapterSpecFor(row);
    return (
      !has(row.adapterBabylistUrl) ||
      !has(row.adapterImage) ||
      row.adapterPrice == null ||
      (variant ? adapterUrlNeedsUpdate(row, variant) : false)
    );
  });
  const missingVariantRows = targets.filter((row) => !adapterSpecFor(row));
  const fillableRows = targets.filter((row) => adapterSpecFor(row));
  const alreadyComplete = rows.length - targets.length;

  const perVariant = new Map<string, number>();
  for (const row of fillableRows) {
    const variant = adapterSpecFor(row)!;
    perVariant.set(variant.sku, (perVariant.get(variant.sku) ?? 0) + 1);
  }

  console.log(`  WonderFold adapter rows scanned: ${rows.length}`);
  console.log(`  rows needing link/image/price update: ${targets.length}`);
  console.log(`  rows with variant mapping: ${fillableRows.length}`);
  console.log(`  rows missing variant mapping: ${missingVariantRows.length}`);
  console.log(`  rows already complete: ${alreadyComplete}\n`);

  for (const [sku, count] of [...perVariant.entries()].sort()) {
    const variant = VARIANTS.find((item) => item.sku === sku)!;
    const linkKind = variant.asin ? `ASIN ${variant.asin}` : 'Amazon search';
    console.log(`  ${sku.padEnd(12)} ${variant.sizeBucket} / ${variant.seatBucket} - ${count} row(s), ${linkKind}`);
  }

  if (missingVariantRows.length > 0) {
    console.log('\nRows needing manual mapping:');
    for (const row of missingVariantRows) {
      console.log(`  ${row.stroller.brand} ${row.stroller.model} / ${row.carSeat.brand} ${row.carSeat.model}`);
    }
  }

  if (!APPLY) {
    console.log('\nDry run only - re-run with --apply to write these fields.');
    await db.$disconnect?.();
    return;
  }

  let updated = 0;
  for (const row of fillableRows) {
    const variant = adapterSpecFor(row)!;
    await db.compatibility.update({
      where: { id: row.id },
      data: {
        adapterType: row.adapterType ?? adapterTypeFor(variant),
        adapterBabylistUrl: adapterUrlNeedsUpdate(row, variant) ? amazonUrl(variant) : row.adapterBabylistUrl,
        adapterImage: has(row.adapterImage) ? row.adapterImage : variant.imageUrl,
        adapterPrice: row.adapterPrice ?? variant.price,
        adapterUpdatedAt: new Date(),
      },
    });
    updated += 1;
  }

  console.log(`\nApplied - ${updated} WonderFold adapter row(s) updated.`);
  if (missingVariantRows.length > 0) {
    console.log(`${missingVariantRows.length} row(s) were skipped because no WonderFold variant mapping was available.`);
  }

  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[applyWonderFoldAdapterLinks] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
