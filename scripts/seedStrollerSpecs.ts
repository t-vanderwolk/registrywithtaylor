/**
 * Seed research-backed stroller specs (quiz + compare) from lib/catalog/strollerSpecSeeds.
 *
 * Data lives in one module keyed by brand, so adding a brand is a data edit — no
 * new script. Only fields a manufacturer actually publishes are written; anything
 * unset keeps whatever is already in the DB.
 *
 *   npx tsx scripts/seedStrollerSpecs.ts                      # dry run, all seeded brands
 *   npx tsx scripts/seedStrollerSpecs.ts --brand="BOB"        # dry run, one brand
 *   npx tsx scripts/seedStrollerSpecs.ts --brand="BOB" --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:stroller-specs-apply
 */
import prismaBase from '@/lib/server/prisma';
import {
  STROLLER_SPEC_SEEDS,
  findStrollerSpecSeed,
  normalizeModel,
  type StrollerSpecSeed,
} from '@/lib/catalog/strollerSpecSeeds';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

/** Spec columns we may write (summary lives on Stroller, not StrollerSpec). */
const SPEC_FIELDS = [
  'priceRange',
  'foldType',
  'lifestyle',
  'maxWeightLbs',
  'ownWeightLbs',
  'budgetMin',
  'budgetMax',
  'isExpandable',
  'suitableFromBirth',
  'suitableForJogging',
  'modular',
  'fitsOverheadBin',
  'basketCapacityLbs',
] as const;

function buildSpecData(seed: StrollerSpecSeed) {
  const data: Record<string, unknown> = {};
  for (const key of SPEC_FIELDS) {
    const value = seed[key as keyof StrollerSpecSeed];
    if (value !== undefined) data[key] = value;
  }
  return data;
}

function argValue(flag: string): string | null {
  const withEquals = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  if (withEquals) return withEquals.slice(flag.length + 1);
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] ?? null : null;
}

async function main() {
  const apply = process.argv.includes('--apply');
  const brandFilter = argValue('--brand');

  const seededBrands = Object.keys(STROLLER_SPEC_SEEDS);
  const brands = brandFilter
    ? seededBrands.filter((brand) => normalizeModel(brand) === normalizeModel(brandFilter))
    : seededBrands;

  if (brandFilter && brands.length === 0) {
    console.error(`No seed data for brand "${brandFilter}". Seeded brands: ${seededBrands.join(', ')}`);
    process.exit(1);
  }

  let totalMatched = 0;
  const unmatched: string[] = [];

  for (const brand of brands) {
    const strollers: Array<{ id: string; brand: string; model: string }> = await db.stroller.findMany({
      where: { brand: { equals: brand, mode: 'insensitive' } },
      select: { id: true, brand: true, model: true },
      orderBy: [{ model: 'asc' }],
    });

    if (strollers.length === 0) {
      console.log(`\n— ${brand}: no strollers in the catalog (skipped)`);
      continue;
    }

    console.log(`\n— ${brand} (${strollers.length} in catalog)`);

    for (const stroller of strollers) {
      const seed = findStrollerSpecSeed(stroller.brand, stroller.model);
      if (!seed) {
        unmatched.push(`${stroller.brand} ${stroller.model}`);
        continue;
      }
      totalMatched += 1;

      const specData = buildSpecData(seed);
      const bits = [
        seed.priceRange,
        seed.ownWeightLbs != null ? `${seed.ownWeightLbs}lb` : null,
        seed.maxWeightLbs != null ? `max ${seed.maxWeightLbs}lb` : null,
        seed.foldType ? `fold ${seed.foldType}` : null,
        seed.suitableFromBirth != null ? `birth ${seed.suitableFromBirth}` : null,
        seed.suitableForJogging != null ? `jog ${seed.suitableForJogging}` : null,
        seed.modular != null ? `modular ${seed.modular}` : null,
        seed.fitsOverheadBin != null ? `overhead ${seed.fitsOverheadBin}` : null,
        seed.basketCapacityLbs != null ? `basket ${seed.basketCapacityLbs}lb` : null,
      ].filter(Boolean);

      console.log(`  ${apply ? 'SET ' : 'PLAN'}  ${stroller.model}  ·  ${bits.join(' · ')}`);

      if (apply) {
        if (seed.summary) {
          await db.stroller.update({ where: { id: stroller.id }, data: { summary: seed.summary } });
        }
        await db.strollerSpec.upsert({
          where: { strollerId: stroller.id },
          create: { strollerId: stroller.id, ...specData },
          update: specData,
        });
      }
    }
  }

  console.log(`\n${apply ? 'Applied' : 'Dry run'} — ${totalMatched} strollers seeded across ${brands.length} brand(s).`);
  if (unmatched.length) {
    console.log(`No seed match (left untouched, ${unmatched.length}): ${unmatched.join(', ')}`);
  }
  if (!apply) console.log('Re-run with --apply to write these values.');

  await db.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await db.$disconnect();
  process.exit(1);
});
