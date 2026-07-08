/**
 * Normalize the Cybex Priam stroller rows into one clean "Cybex Priam":
 *   • rename "Priam4" / "Priam 4" → "Priam"
 *   • merge "Priam Comfort" (and any other Priam trims) into "Priam"
 *
 * Compatibilities are keyed by strollerId (FK, unique [strollerId, carSeatId]),
 * so the merge re-points each non-duplicate Compatibility + the StrollerSpec at
 * the canonical row before deleting the extra rows — no dangling links. Leaves
 * e-Priam, Mios, Gazelle S, e-Gazelle S untouched.
 *
 *   npx tsx scripts/normalizeCybexPriam.ts            # dry run (default)
 *   npx tsx scripts/normalizeCybexPriam.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/normalizeCybexPriam.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const CANONICAL = 'Priam';
const APPLY = process.argv.includes('--apply');

type Compat = { id: string; carSeatId: string };
type Row = {
  id: string;
  brand: string;
  model: string;
  displayName: string | null;
  summary: string | null;
  amazonUrl: string | null;
  babylistSku: string | null;
  babylistUrl: string | null;
  babylistPrice: number | null;
  babylistImage: string | null;
  spec: { id: string } | null;
  compatibilities: Compat[];
};

async function main() {
  const strollers: Row[] = await db.stroller.findMany({
    where: { brand: { contains: 'Cybex', mode: 'insensitive' } },
    select: {
      id: true,
      brand: true,
      model: true,
      displayName: true,
      summary: true,
      amazonUrl: true,
      babylistSku: true,
      babylistUrl: true,
      babylistPrice: true,
      babylistImage: true,
      spec: { select: { id: true } },
      compatibilities: { select: { id: true, carSeatId: true } },
    },
  });

  // Every non-electric Priam variant: "Priam", "Priam4", "Priam 4", "Priam Comfort", …
  const priam = strollers.filter(
    (s) => /^priam\b|^priam\s*4$/i.test(s.model.trim()) && !/^e-?\s?priam/i.test(s.model.trim()),
  );

  console.log('── Normalize Cybex Priam ──');
  console.log('  Priam variants found:');
  priam.forEach((s) => console.log(`    • "${s.model}"  (${s.compatibilities.length} compat, spec: ${s.spec ? 'yes' : 'no'})`));

  if (priam.length === 0) {
    console.log('\n  No Priam rows found. Nothing to do.');
    return;
  }

  // Canonical = an existing exact "Priam", else the plain "Priam4"/"Priam 4" (renamed).
  let canonical =
    priam.find((s) => s.model.trim().toLowerCase() === CANONICAL.toLowerCase()) ??
    priam.find((s) => /^priam\s*4$/i.test(s.model.trim())) ??
    priam[0];
  const others = priam.filter((s) => s.id !== canonical.id);

  if (others.length === 0 && canonical.model === CANONICAL) {
    console.log('\n  Already a single clean "Cybex Priam". Nothing to do.');
    return;
  }

  console.log(`\n  Canonical → keep "${canonical.model}" (${canonical.id})${canonical.model !== CANONICAL ? ` → rename to "${CANONICAL}"` : ''}`);
  const seatIds = new Set(canonical.compatibilities.map((c) => c.carSeatId));
  let canonicalHasSpec = Boolean(canonical.spec);

  for (const other of others) {
    const moveCompat = other.compatibilities.filter((c) => !seatIds.has(c.carSeatId));
    const dupCompat = other.compatibilities.length - moveCompat.length;
    const moveSpec = !canonicalHasSpec && Boolean(other.spec);
    console.log(
      `  Merge "${other.model}" (${other.id}): move ${moveCompat.length} compat, drop ${dupCompat} dup, ${moveSpec ? 'move spec, ' : ''}then delete`,
    );

    if (APPLY) {
      for (const c of moveCompat) {
        await db.compatibility.update({ where: { id: c.id }, data: { strollerId: canonical.id } });
        seatIds.add(c.carSeatId);
      }
      if (moveSpec && other.spec) {
        await db.strollerSpec.update({ where: { id: other.spec.id }, data: { strollerId: canonical.id } });
        canonicalHasSpec = true;
      }
      // Backfill canonical's empty commerce fields from the row we're removing.
      const backfill: Record<string, unknown> = {};
      if (!canonical.babylistUrl && other.babylistUrl) {
        backfill.babylistUrl = other.babylistUrl;
        backfill.babylistSku = other.babylistSku;
        backfill.babylistPrice = other.babylistPrice;
        backfill.babylistImage = other.babylistImage;
      }
      if (!canonical.amazonUrl && other.amazonUrl) backfill.amazonUrl = other.amazonUrl;
      if (!canonical.displayName && other.displayName) backfill.displayName = other.displayName;
      if (!canonical.summary && other.summary) backfill.summary = other.summary;
      if (Object.keys(backfill).length) {
        await db.stroller.update({ where: { id: canonical.id }, data: backfill });
        Object.assign(canonical, backfill);
      }
      // Delete the merged row (cascades its remaining dup compatibilities + spec).
      await db.stroller.delete({ where: { id: other.id } });
    }
  }

  if (canonical.model !== CANONICAL) {
    console.log(`  Rename "${canonical.model}" → "${CANONICAL}"`);
    if (APPLY) await db.stroller.update({ where: { id: canonical.id }, data: { model: CANONICAL } });
  }

  if (!APPLY) {
    console.log('\n  (dry run — nothing changed. Re-run with --apply.)');
    return;
  }
  console.log('\n  ✓ Done. One clean "Cybex Priam" row remains.');
}

main()
  .catch((error) => {
    console.error('[normalizeCybexPriam] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
