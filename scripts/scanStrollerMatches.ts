/**
 * Read-only scan: which public strollers land on an EMPTY travel-system results
 * page (zero compatible infant car seats). Runs the real compatibility engine
 * per stroller, so it mirrors exactly what a user would see after the one-click
 * funnel routes them to results.
 *
 * Note: umbrella strollers, some wagons, and integrated-seat strollers legitimately
 * take no infant car seat — those are expected zeros, not bugs. Paste the output
 * and we'll separate the real gaps (should have matches) from the expected ones.
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:scan-no-matches
 */
import {
  getTravelSystemStrollers,
  getTravelSystemCompatibility,
} from '@/lib/server/travelSystemCompatibility';

async function main() {
  const strollers = await getTravelSystemStrollers();
  console.log(`── Stroller match scan ──`);
  console.log(`  public strollers: ${strollers.length}\n`);

  const noMatch: Array<{ brand: string; model: string }> = [];
  let checked = 0;

  for (const s of strollers) {
    let count = 0;
    try {
      const result = await getTravelSystemCompatibility(s.brand, s.model);
      count = result?.compatibleCarSeats?.length ?? 0;
    } catch {
      count = 0;
    }
    if (count === 0) noMatch.push({ brand: s.brand, model: s.model });
    checked += 1;
  }

  const byBrand = noMatch.reduce<Record<string, string[]>>((acc, s) => {
    (acc[s.brand] ??= []).push(s.model);
    return acc;
  }, {});

  console.log(`  checked: ${checked}`);
  console.log(`  strollers with ZERO compatible car seats: ${noMatch.length}\n`);
  Object.keys(byBrand)
    .sort()
    .forEach((brand) => {
      console.log(`  ${brand}`);
      byBrand[brand].sort().forEach((model) => console.log(`    • ${model}`));
    });
}

main()
  .catch((error) => {
    console.error('[scanStrollerMatches] failed:', error);
    process.exit(1);
  });
