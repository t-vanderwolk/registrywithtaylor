/**
 * Backfill missing infant car-seat images for the travel-system checker from the
 * Albee Baby catalog. The checker shows CarSeat.babylistImage (then a static map)
 * on every compatible car-seat card; this fills that field for any INFANT CarSeat
 * lacking an image, matching by canonical brand + the seat model appearing in an
 * Albee Baby product title.
 *
 * Only fills empty images — never overwrites an existing (synced Babylist) image.
 *
 *   npx tsx scripts/backfillCarSeatImages.ts          # dry-run (default)
 *   npx tsx scripts/backfillCarSeatImages.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:backfill-carseat-images-apply
 */
import prismaBase from '@/lib/server/prisma';
import { canonicalBrand } from '@/lib/catalog/brandAliases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const ALBEE = 'cj_albeebaby';
// Squash to alphanumerics only (drop spaces/punctuation) so "Gen2" matches
// "Gen 2", "KeyFit 35" matches "KeyFit35", "B-Safe" matches "BSafe", etc.
const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

type SeatRow = { id: string; brand: string; model: string; babylistImage: string | null };
type Prod = { brand: string | null; title: string; imageUrl: string | null };

async function main() {
  const apply = process.argv.includes('--apply');

  const seats: SeatRow[] = await db.carSeat.findMany({
    where: { seatType: 'INFANT', OR: [{ babylistImage: null }, { babylistImage: '' }] },
    select: { id: true, brand: true, model: true, babylistImage: true },
  });

  const prods: Prod[] = await db.affiliateCatalogProduct.findMany({
    where: {
      provider: ALBEE,
      isActiveInFeed: true,
      imageUrl: { not: null },
      enrichment: { is: { productType: 'infant car seat', reviewStatus: { not: 'HIDDEN' } } },
    },
    select: { brand: true, title: true, imageUrl: true },
  });

  const byBrand = new Map<string, Prod[]>();
  for (const p of prods) {
    const k = canonicalBrand(p.brand).toLowerCase();
    (byBrand.get(k) ?? byBrand.set(k, []).get(k)!).push(p);
  }

  const matches: Array<{ seat: SeatRow; image: string; title: string }> = [];
  const unmatched: SeatRow[] = [];
  for (const seat of seats) {
    const m = squash(seat.model);
    const cands = byBrand.get(canonicalBrand(seat.brand).toLowerCase()) ?? [];
    const hit = cands.find((p) => m.length >= 4 && p.imageUrl && squash(p.title).includes(m));
    if (hit?.imageUrl) matches.push({ seat, image: hit.imageUrl, title: hit.title });
    else unmatched.push(seat);
  }

  console.log('── Backfill infant car-seat images from Albee Baby ──');
  console.log(`  infant seats missing an image: ${seats.length}   Albee infant-seat products: ${prods.length}`);
  console.log(`  matched: ${matches.length}   still missing: ${unmatched.length}\n`);
  matches.slice(0, 25).forEach((x) => console.log(`    ✓ ${x.seat.brand} ${x.seat.model}   ←   ${x.title}`));
  if (unmatched.length) {
    console.log('\n  no Albee match (still imageless — fall back to the static map):');
    unmatched.slice(0, 25).forEach((s) => console.log(`    • ${s.brand} ${s.model}`));
  }

  if (!apply) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }

  let set = 0;
  for (const x of matches) {
    await db.carSeat.update({ where: { id: x.seat.id }, data: { babylistImage: x.image } });
    set += 1;
  }
  console.log(`\n  Set images on ${set} infant car seats (empty-only; nothing overwritten).`);
}

main()
  .catch((error) => {
    console.error('[backfillCarSeatImages] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
