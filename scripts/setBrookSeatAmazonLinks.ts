/**
 * Set Amazon affiliate links on the two Brook/Grove direct-fit seats that have a
 * current, linkable Amazon listing — so they surface in the checker. The other
 * three chart seats (Cybex Aton M, Cybex Cloud Q, Maxi-Cosi Coral XP) are left
 * WITHOUT a link on purpose: Aton M / Cloud Q are discontinued and the Coral XP
 * was recalled (Mar 2023). They keep their compatibility rows but stay hidden.
 *
 *   npx tsx scripts/setBrookSeatAmazonLinks.ts            # dry run
 *   npx tsx scripts/setBrookSeatAmazonLinks.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:brook-seat-links-apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9+]+/g, ' ').replace(/\s+/g, ' ').trim();

const LINKS: Array<{ brand: string; model: string; amazonUrl: string }> = [
  { brand: 'Cybex', model: 'Aton 2', amazonUrl: 'https://www.amazon.com/dp/B0BWPXVRTC?tag=taylormadebab-20' },
  { brand: 'Maxi-Cosi', model: 'Mico 30', amazonUrl: 'https://www.amazon.com/dp/B08XNZ2LZN?tag=taylormadebab-20' },
];

async function main() {
  console.log(`── Set Brook/Grove seat Amazon links ──  (${APPLY ? 'APPLY' : 'dry run'})\n`);

  const seats: Array<{ id: string; brand: string; model: string; amazonUrl: string | null }> =
    await db.carSeat.findMany({
      where: { seatType: 'INFANT', brand: { in: ['Cybex', 'Maxi-Cosi'], mode: 'insensitive' } },
      select: { id: true, brand: true, model: true, amazonUrl: true },
    });

  let updated = 0, unchanged = 0, missing = 0;
  for (const target of LINKS) {
    const wantBrand = norm(target.brand), wantModel = norm(target.model);
    const seat =
      seats.find((s) => norm(s.brand) === wantBrand && norm(s.model) === wantModel) ??
      seats.find((s) => norm(s.brand) === wantBrand && norm(s.model).includes(wantModel));
    if (!seat) {
      missing += 1;
      console.log(`  ! no catalog seat for ${target.brand} ${target.model}`);
      continue;
    }
    if ((seat.amazonUrl ?? '') === target.amazonUrl) {
      unchanged += 1;
      console.log(`  = ${seat.brand} ${seat.model} already has this link`);
      continue;
    }
    updated += 1;
    console.log(`  → ${seat.brand} ${seat.model}  ←  ${target.amazonUrl}`);
    if (APPLY) await db.carSeat.update({ where: { id: seat.id }, data: { amazonUrl: target.amazonUrl } });
  }

  console.log(`\n${APPLY ? 'Applied' : 'Dry run'} — ${updated} updated, ${unchanged} already set, ${missing} not found.`);
  if (!APPLY) console.log('\nRe-run with --apply to write these links.');

  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[setBrookSeatAmazonLinks] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
