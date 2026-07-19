/**
 * First research-backed spec seed: BABY JOGGER.
 *
 * Populates the full StrollerSpec set (quiz + compare) for every Baby Jogger
 * stroller in the catalog, plus a concise TMBC-toned summary. Values are sourced
 * from Baby Jogger's official spec sheets / help centre and major retailers
 * (July 2026). See the source list in the accompanying chat message.
 *
 * Note on basket capacity: Baby Jogger publishes basket *weight* limits (lb), not
 * volume. `basketCapacityLiters` here is an approximate physical-size estimate;
 * the exact weight limit is recorded in each summary. Everything else (weights,
 * child limits, fold, from-birth, jogging, modular) is from published specs.
 *
 *   npx tsx scripts/seedBabyJoggerSpecs.ts            # dry run (default)
 *   npx tsx scripts/seedBabyJoggerSpecs.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:baby-jogger-specs-apply
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
  basketCapacityLiters: number; // approximate (BJ publishes lb limits)
};

// Ordered most-specific → general (first match wins).
const SPECS: Spec[] = [
  {
    match: /city mini gt2 double/,
    summary:
      'The all-terrain City Mini GT2 in a side-by-side double — forever-air tires, all-wheel suspension, one-hand fold, 65 lb per seat. A go-anywhere everyday double (not for jogging).',
    priceRange: 'premium', foldType: 'one-hand', lifestyle: ['city', 'suburban', 'trail'],
    maxWeightLbs: 65, ownWeightLbs: 30.6, budgetMin: 550, budgetMax: 650,
    isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
    modular: false, fitsOverheadBin: false, basketCapacityLiters: 24,
  },
  {
    match: /city mini gt2/,
    summary:
      'Baby Jogger’s all-terrain everyday hero: never-flat forever-air tires, all-wheel suspension, signature one-hand fold, 65 lb limit. Handles curbs, gravel and grass — but it is not a running stroller.',
    priceRange: 'premium', foldType: 'one-hand', lifestyle: ['city', 'suburban', 'trail'],
    maxWeightLbs: 65, ownWeightLbs: 21.4, budgetMin: 380, budgetMax: 450,
    isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
    modular: false, fitsOverheadBin: false, basketCapacityLiters: 24,
  },
  {
    match: /city mini gt3/,
    summary:
      'The newest all-terrain City Mini: forever-air rubber tires and all-wheel suspension for streets and trails, one-hand fold, from birth (with an infant seat) to 65 lb. An everyday all-terrain, not a jogger.',
    priceRange: 'premium', foldType: 'one-hand', lifestyle: ['city', 'suburban', 'trail'],
    maxWeightLbs: 65, ownWeightLbs: 21.8, budgetMin: 400, budgetMax: 480,
    isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
    modular: false, fitsOverheadBin: false, basketCapacityLiters: 24,
  },
  {
    match: /city mini double/,
    summary:
      'The everyday City Mini as a fits-through-doorways double — signature one-hand fold, near-flat recline from birth, 50 lb per seat. Light and nimble for two.',
    priceRange: 'mid', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
    maxWeightLbs: 50, ownWeightLbs: 28, budgetMin: 430, budgetMax: 520,
    isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
    modular: false, fitsOverheadBin: false, basketCapacityLiters: 20,
  },
  {
    match: /city mini air/,
    summary:
      'The City Mini with air-filled tires for a smoother roll — signature one-hand fold, near-flat recline from birth, 50 lb limit. Everyday city comfort.',
    priceRange: 'mid', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
    maxWeightLbs: 50, ownWeightLbs: 20.5, budgetMin: 280, budgetMax: 360,
    isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
    modular: false, fitsOverheadBin: false, basketCapacityLiters: 22,
  },
  {
    match: /city mini 2/,
    summary:
      'The everyday classic: 19.3 lb, signature one-hand fold with auto-lock, near-flat recline from birth, 50 lb limit and a 10 lb under-seat basket. City-friendly and easy to live with.',
    priceRange: 'mid', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
    maxWeightLbs: 50, ownWeightLbs: 19.3, budgetMin: 300, budgetMax: 380,
    isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
    modular: false, fitsOverheadBin: false, basketCapacityLiters: 22,
  },
  {
    match: /city tour 2 double/,
    summary:
      'The ultra-compact travel double — lightweight, easy compact fold, near-flat recline from birth, 45 lb per seat. Great for trips, though a double is too big for the overhead bin.',
    priceRange: 'premium', foldType: 'compact', lifestyle: ['travel', 'city'],
    maxWeightLbs: 45, ownWeightLbs: 23, budgetMin: 450, budgetMax: 550,
    isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
    modular: false, fitsOverheadBin: false, basketCapacityLiters: 14,
  },
  {
    match: /city tour 2/,
    summary:
      'Baby Jogger’s carry-on travel stroller: just 14 lb, folds 85% smaller into a compact cube, near-flat recline from birth, 45 lb limit. Marketed as carry-on approved — confirm your airline’s bin.',
    priceRange: 'mid', foldType: 'compact', lifestyle: ['travel', 'city'],
    maxWeightLbs: 45, ownWeightLbs: 14, budgetMin: 250, budgetMax: 320,
    isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
    modular: false, fitsOverheadBin: true, basketCapacityLiters: 12,
  },
  {
    match: /city select 2/,
    summary:
      'The single-to-double modular workhorse: 24 configurations, second seat included, bassinet-ready from birth, 45 lb per seat and a big 15 lb basket. Grows from one kid to three (with a glider board).',
    priceRange: 'premium', foldType: 'standard', lifestyle: ['city', 'suburban'],
    maxWeightLbs: 45, ownWeightLbs: 26.4, budgetMin: 550, budgetMax: 650,
    isExpandable: true, suitableFromBirth: true, suitableForJogging: false,
    modular: true, fitsOverheadBin: false, basketCapacityLiters: 30,
  },
  {
    match: /city sights/,
    summary:
      'Compact-modular everyday stroller with a reversible, reclining seat and bassinet compatibility for use from birth. 24.4 lb, one-hand fold, 50 lb limit.',
    priceRange: 'premium', foldType: 'one-hand', lifestyle: ['city', 'suburban'],
    maxWeightLbs: 50, ownWeightLbs: 24.4, budgetMin: 400, budgetMax: 480,
    isExpandable: false, suitableFromBirth: true, suitableForJogging: false,
    modular: true, fitsOverheadBin: false, basketCapacityLiters: 25,
  },
  {
    match: /summit x3 double/,
    summary:
      'A true all-terrain jogging double — air-filled tires, all-wheel suspension, hand-operated deceleration brake and a lockable front wheel for runs. One-hand fold, 50 lb per seat.',
    priceRange: 'premium', foldType: 'one-hand', lifestyle: ['trail', 'suburban', 'city'],
    maxWeightLbs: 50, ownWeightLbs: 40, budgetMin: 650, budgetMax: 750,
    isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
    modular: false, fitsOverheadBin: false, basketCapacityLiters: 25,
  },
  {
    match: /summit x3/,
    summary:
      'Baby Jogger’s real running stroller: 12"/16" air tires, all-wheel suspension, hand-operated deceleration brake and lockable front wheel. 28.5 lb, one-hand fold, up to 75 lb. From birth with an infant seat.',
    priceRange: 'premium', foldType: 'one-hand', lifestyle: ['trail', 'suburban', 'city'],
    maxWeightLbs: 75, ownWeightLbs: 28.5, budgetMin: 420, budgetMax: 500,
    isExpandable: false, suitableFromBirth: true, suitableForJogging: true,
    modular: false, fitsOverheadBin: false, basketCapacityLiters: 25,
  },
];

function findSpec(model: string): Spec | null {
  const nm = norm(model);
  return SPECS.find((spec) => spec.match.test(nm)) ?? null;
}

async function main() {
  const apply = process.argv.includes('--apply');
  const strollers: Array<{ id: string; brand: string; model: string }> = await db.stroller.findMany({
    where: { brand: { equals: 'Baby Jogger', mode: 'insensitive' } },
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

    const specData = {
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
      basketCapacityLiters: spec.basketCapacityLiters,
    };

    console.log(
      `${apply ? 'SET ' : 'PLAN'}  Baby Jogger ${stroller.model}  ·  ${spec.priceRange} · ${spec.ownWeightLbs}lb · max ${spec.maxWeightLbs}lb · fold ${spec.foldType} · birth ${spec.suitableFromBirth} · jog ${spec.suitableForJogging} · modular ${spec.modular} · overhead ${spec.fitsOverheadBin} · basket ~${spec.basketCapacityLiters}L`,
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

  console.log(`\n${apply ? 'Applied' : 'Dry run'} — ${matched}/${strollers.length} Baby Jogger strollers seeded.`);
  if (unmatched.length) console.log(`Unmatched (left untouched): ${unmatched.join(', ')}`);
  if (!apply) console.log('Re-run with --apply to write these values.');

  await db.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await db.$disconnect();
  process.exit(1);
});
