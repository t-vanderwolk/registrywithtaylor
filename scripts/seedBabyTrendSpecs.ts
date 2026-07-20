/**
 * Research-backed spec seed: BABY TREND (alphabetical pass #2, after Baby Jogger).
 *
 * Populates the full StrollerSpec set (quiz + compare) for every Baby Trend
 * stroller in the catalog, plus a concise TMBC-toned summary. Sourced from Baby
 * Trend's official product pages and major retailers (July 2026).
 *
 * Notable: the Expedition 2-in-1 wagon is 6+ months / sits-upright-unassisted, so
 * it is NOT from-birth — a real buying constraint the quiz should respect.
 * Baby Trend doesn't publish basket weight limits, so basketCapacityLbs is left
 * unset and the Compare tool falls back to its qualitative bucket.
 *
 *   npx tsx scripts/seedBabyTrendSpecs.ts            # dry run (default)
 *   npx tsx scripts/seedBabyTrendSpecs.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:baby-trend-specs-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const norm = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

type Spec = {
  match: RegExp;
  summary: string;
  priceRange: 'budget' | 'mid' | 'premium' | 'luxury';
  foldType: 'one-hand' | 'compact' | 'standard';
  lifestyle: string[];
  maxWeightLbs: number; // per child
  ownWeightLbs: number;
  budgetMin: number;
  budgetMax: number;
  isExpandable: boolean;
  suitableFromBirth: boolean;
  suitableForJogging: boolean;
  modular: boolean;
  fitsOverheadBin: boolean;
  basketCapacityLbs?: number;
};

// Ordered most-specific → general (first match wins).
const SPECS: Spec[] = [
  {
    match: /expedition zero flat jogger/,
    summary:
      'Baby Trend’s budget flat-fold jogger: Zero Flat never-go-flat all-terrain bicycle tires, a locking swivel front wheel, multi-position recline, LED side lights and a trigger fold. Holds up to 50 lb (or 42" tall), and takes a Baby Trend infant seat from birth. A capable jogger that won’t break the bank.',
    priceRange: 'budget', foldType: 'compact', lifestyle: ['trail', 'suburban'],
    maxWeightLbs: 50, ownWeightLbs: 30, budgetMin: 160, budgetMax: 200,
    isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
    modular: false, fitsOverheadBin: false,
  },
  {
    match: /expedition 2 in 1/,
    summary:
      'Baby Trend’s convertible stroller wagon: a hideaway pull handle flips it between push and pull, with built-in seating for two, a UPF 50+ ratcheting canopy and a compact flat fold. 55 lb per seat (110 lb total). Note: it starts at 6 months — riders must sit up unassisted, so this is not a from-birth stroller.',
    priceRange: 'mid', foldType: 'compact', lifestyle: ['suburban', 'trail'],
    maxWeightLbs: 55, ownWeightLbs: 33, budgetMin: 300, budgetMax: 350,
    isExpandable: false, suitableFromBirth: false, suitableForJogging: false,
    modular: false, fitsOverheadBin: false,
  },
];

function findSpec(model: string): Spec | null {
  const nm = norm(model);
  return SPECS.find((spec) => spec.match.test(nm)) ?? null;
}

async function main() {
  const apply = process.argv.includes('--apply');
  const strollers: Array<{ id: string; brand: string; model: string }> = await db.stroller.findMany({
    where: { brand: { equals: 'Baby Trend', mode: 'insensitive' } },
    select: { id: true, brand: true, model: true },
    orderBy: [{ model: 'asc' }],
  });

  let matched = 0;
  const unmatched: string[] = [];

  for (const stroller of strollers) {
    const spec = findSpec(stroller.model);
    if (!spec) {
      unmatched.push(stroller.model);
      continue;
    }
    matched += 1;

    const specData: Record<string, unknown> = {
      priceRange: spec.priceRange,
      foldType: spec.foldType,
      lifestyle: spec.lifestyle,
      maxWeightLbs: spec.maxWeightLbs,
      ownWeightLbs: spec.ownWeightLbs,
      budgetMin: spec.budgetMin,
      budgetMax: spec.budgetMax,
      isExpandable: spec.isExpandable,
      suitableFromBirth: spec.suitableFromBirth,
      suitableForJogging: spec.suitableForJogging,
      modular: spec.modular,
      fitsOverheadBin: spec.fitsOverheadBin,
    };
    if (spec.basketCapacityLbs != null) specData.basketCapacityLbs = spec.basketCapacityLbs;

    const basketLabel = spec.basketCapacityLbs != null ? `${spec.basketCapacityLbs}lb` : '—';
    console.log(
      `${apply ? 'SET ' : 'PLAN'}  Baby Trend ${stroller.model}  ·  ${spec.priceRange} · ${spec.ownWeightLbs}lb · max ${spec.maxWeightLbs}lb · fold ${spec.foldType} · birth ${spec.suitableFromBirth} · jog ${spec.suitableForJogging} · modular ${spec.modular} · overhead ${spec.fitsOverheadBin} · basket ${basketLabel}`,
    );

    if (apply) {
      await db.stroller.update({ where: { id: stroller.id }, data: { summary: spec.summary } });
      await db.strollerSpec.upsert({
        where: { strollerId: stroller.id },
        create: { strollerId: stroller.id, ...specData },
        update: specData,
      });
    }
  }

  console.log(`\n${apply ? 'Applied' : 'Dry run'} — ${matched}/${strollers.length} Baby Trend strollers seeded.`);
  if (unmatched.length) console.log(`Unmatched (left untouched): ${unmatched.join(', ')}`);
  if (!apply) console.log('Re-run with --apply to write these values.');

  await db.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await db.$disconnect();
  process.exit(1);
});
