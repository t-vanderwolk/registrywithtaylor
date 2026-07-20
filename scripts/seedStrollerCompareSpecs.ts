/**
 * Seed two Compare-tool booleans into StrollerSpec for well-known models:
 *   • modular         — accepts a bassinet and/or reverses / adds a 2nd seat
 *   • fitsOverheadBin — folds small enough for an airplane carry-on
 *
 * Basket weight limit (basketCapacityLbs) is set per-brand in the researched
 * spec seeds (e.g. seedBabyJoggerSpecs) or by hand in the admin Strollers editor —
 * not here. Existing quiz-spec fields are never touched.
 *
 *   npx tsx scripts/seedStrollerCompareSpecs.ts            # dry run (default)
 *   npx tsx scripts/seedStrollerCompareSpecs.ts --apply
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:compare-specs-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const norm = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

type Seed = {
  brand: string;
  match: RegExp;
  modular: boolean;
  fitsOverheadBin: boolean;
};

const SEEDS: Seed[] = [
  // ── Airline carry-on / overhead-bin travel strollers ──────────────────────
  // The YOYO is now sold under Stokke (Babyzen retired as a catalog brand).
  { brand: 'Stokke', match: /yoyo/, modular: false, fitsOverheadBin: true },
  { brand: 'gb', match: /pockit/, modular: false, fitsOverheadBin: true },
  { brand: 'Joolz', match: /\baer\b/, modular: false, fitsOverheadBin: true },
  { brand: 'Nuna', match: /trvl/, modular: false, fitsOverheadBin: true },
  { brand: 'Cybex', match: /libelle/, modular: false, fitsOverheadBin: true },
  { brand: 'Cybex', match: /(eezy|orfeo|beezy)/, modular: false, fitsOverheadBin: true },
  { brand: 'Bugaboo', match: /butterfly/, modular: false, fitsOverheadBin: true },
  { brand: 'Silver Cross', match: /\bjet\b/, modular: false, fitsOverheadBin: true },
  { brand: 'Mountain Buggy', match: /nano/, modular: false, fitsOverheadBin: true },
  { brand: 'Ergobaby', match: /metro/, modular: false, fitsOverheadBin: true },
  { brand: 'UPPAbaby', match: /minu/, modular: false, fitsOverheadBin: true },
  { brand: 'Zoe', match: /(tour|traveler|deux|twin|xl)/, modular: false, fitsOverheadBin: true },
  { brand: 'Colugo', match: /compact/, modular: false, fitsOverheadBin: true },
  { brand: 'Inglesina', match: /quid/, modular: false, fitsOverheadBin: true },
  { brand: 'Maxi-Cosi', match: /lara/, modular: false, fitsOverheadBin: true },
  { brand: 'Summer Infant', match: /3dlite/, modular: false, fitsOverheadBin: true },

  // ── Modular flagships (bassinet + reversible / second-seat) ────────────────
  { brand: 'UPPAbaby', match: /vista/, modular: true, fitsOverheadBin: false },
  { brand: 'UPPAbaby', match: /cruz/, modular: true, fitsOverheadBin: false },
  { brand: 'Mockingbird', match: /./, modular: true, fitsOverheadBin: false },
  { brand: 'Nuna', match: /(mixx|demi)/, modular: true, fitsOverheadBin: false },
  { brand: 'Bugaboo', match: /fox/, modular: true, fitsOverheadBin: false },
  { brand: 'Bugaboo', match: /(donkey|lynx|dragonfly|cameleon)/, modular: true, fitsOverheadBin: false },
  { brand: 'Cybex', match: /(priam|balios|gazelle|e-priam|eos)/, modular: true, fitsOverheadBin: false },
  { brand: 'Silver Cross', match: /(wave|reef|dune|comet)/, modular: true, fitsOverheadBin: false },
  { brand: 'Joolz', match: /(geo|day|hub)/, modular: true, fitsOverheadBin: false },
  { brand: 'Peg Perego', match: /(ypsi|veloce|book)/, modular: true, fitsOverheadBin: false },
  { brand: 'Thule', match: /(sleek|shine)/, modular: true, fitsOverheadBin: false },
  { brand: 'Stokke', match: /(xplory|trailz|beat)/, modular: true, fitsOverheadBin: false },
  { brand: 'Baby Jogger', match: /city select/, modular: true, fitsOverheadBin: false },
  { brand: 'Redsbaby', match: /(nuvo|skip)/, modular: true, fitsOverheadBin: false },
  { brand: 'Mima', match: /(xari|creo)/, modular: true, fitsOverheadBin: false },
  { brand: 'Uppababy', match: /ridge/, modular: false, fitsOverheadBin: false },

  // ── All-terrain / jogging ─────────────────────────────────────────────────
  { brand: 'Thule', match: /(urban glide|spring)/, modular: false, fitsOverheadBin: false },
  { brand: 'BOB', match: /./, modular: false, fitsOverheadBin: false },
  { brand: 'Baby Jogger', match: /city mini/, modular: false, fitsOverheadBin: false },
];

function findSeed(brand: string, model: string): Seed | null {
  const nb = norm(brand);
  const nm = norm(model);
  return SEEDS.find((seed) => norm(seed.brand) === nb && seed.match.test(nm)) ?? null;
}

async function main() {
  const apply = process.argv.includes('--apply');
  const strollers: Array<{ id: string; brand: string; model: string }> = await db.stroller.findMany({
    select: { id: true, brand: true, model: true },
    orderBy: [{ brand: 'asc' }, { model: 'asc' }],
  });

  let matched = 0;

  for (const stroller of strollers) {
    const seed = findSeed(stroller.brand, stroller.model);
    if (!seed) continue;
    matched += 1;

    const data: Record<string, unknown> = {
      modular: seed.modular,
      fitsOverheadBin: seed.fitsOverheadBin,
    };

    console.log(
      `${apply ? 'SET ' : 'PLAN'}  ${stroller.brand} ${stroller.model}  ·  modular=${seed.modular}  overhead=${seed.fitsOverheadBin}`,
    );

    if (apply) {
      await db.strollerSpec.upsert({
        where: { strollerId: stroller.id },
        create: { strollerId: stroller.id, ...data },
        update: data,
      });
    }
  }

  console.log(
    `\n${apply ? 'Applied' : 'Dry run'} — ${matched} strollers matched. ` +
      `Unmatched strollers keep the Compare tool's category defaults; basket weight limits are set per-brand (e.g. the Baby Jogger seed) or in the admin Strollers editor.`,
  );
  if (!apply) console.log('Re-run with --apply to write these values.');

  await db.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await db.$disconnect();
  process.exit(1);
});
