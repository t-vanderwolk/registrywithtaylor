/**
 * Read-only audit of adapter link coverage in the travel-system checker.
 *
 * For every public stroller it runs the real compatibility engine and checks each
 * adapter-required car-seat pairing: does the "Shop adapter" link point at a real
 * catalog product (Babylist / MacroBaby / manual / exact Amazon page), or at the
 * Amazon SEARCH fallback we add so no pairing is ever link-less?
 *
 * Strollers listed under "on search fallback" have no catalog adapter matching
 * their model, so every adapter pairing for them uses the generic search link.
 * Those are the ones to source an exact adapter product for (add to
 * scripts/addAdapters.ts), highest-traffic first.
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:audit-adapter-links
 */
import {
  getTravelSystemStrollers,
  getTravelSystemCompatibility,
} from '@/lib/server/travelSystemCompatibility';

// The fallback link is an Amazon search ("/s?k=..."); a real product link is not.
const isSearchFallback = (url: string | null | undefined) => !!url && /amazon\.[a-z.]+\/s\?/i.test(url);

type Row = { stroller: string; brand: string; adapterSeats: number; fallback: number; catalog: number };

async function main() {
  const strollers = await getTravelSystemStrollers();
  console.log(`── Adapter link coverage ──\n  public strollers: ${strollers.length}\n`);

  const rows: Row[] = [];
  let checked = 0;

  for (const s of strollers) {
    let adapterSeats = 0;
    let fallback = 0;
    try {
      const result = await getTravelSystemCompatibility(s.brand, s.model);
      for (const seat of result?.compatibleCarSeats ?? []) {
        if (!seat.adapterRequired) continue;
        adapterSeats += 1;
        if (isSearchFallback(seat.adapterUrl)) fallback += 1;
      }
    } catch {
      /* skip unreadable */
    }
    if (adapterSeats > 0) {
      rows.push({ stroller: `${s.brand} ${s.model}`, brand: s.brand, adapterSeats, fallback, catalog: adapterSeats - fallback });
    }
    checked += 1;
  }

  const totalAdapterSeats = rows.reduce((n, r) => n + r.adapterSeats, 0);
  const totalFallback = rows.reduce((n, r) => n + r.fallback, 0);
  const fullFallback = rows.filter((r) => r.fallback === r.adapterSeats).sort((a, b) => a.stroller.localeCompare(b.stroller));
  const partialFallback = rows.filter((r) => r.fallback > 0 && r.fallback < r.adapterSeats);

  console.log(`  checked: ${checked}`);
  console.log(`  strollers with adapter-required pairings: ${rows.length}`);
  console.log(`  adapter pairings total: ${totalAdapterSeats}`);
  console.log(`  on catalog product: ${totalAdapterSeats - totalFallback}`);
  console.log(`  on Amazon search fallback: ${totalFallback}\n`);

  console.log(`  ── Strollers with NO catalog adapter (every pairing on search fallback): ${fullFallback.length} ──`);
  let currentBrand = '';
  for (const r of fullFallback) {
    if (r.brand !== currentBrand) {
      currentBrand = r.brand;
      console.log(`    ${r.brand}`);
    }
    console.log(`      • ${r.stroller}  (${r.adapterSeats} seats)`);
  }

  if (partialFallback.length) {
    console.log(`\n  ── Partial coverage (some seats on fallback): ${partialFallback.length} ──`);
    for (const r of partialFallback.sort((a, b) => a.stroller.localeCompare(b.stroller))) {
      console.log(`    • ${r.stroller}  ${r.fallback}/${r.adapterSeats} on fallback`);
    }
  }

  console.log('\n  Everything above still has a working link — this just shows where an');
  console.log('  exact adapter product would upgrade the generic search fallback.');
}

main().catch((error) => {
  console.error('[auditAdapterLinks] failed:', error);
  process.exit(1);
});
