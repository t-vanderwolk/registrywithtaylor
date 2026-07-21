/**
 * Remove Baby Jogger travel-system compatibility rows that the manufacturer does
 * NOT publish an adapter for.
 *
 * Baby Jogger sells a different adapter per stroller + seat-brand pairing, so the
 * shared "euro group" (Nuna / Maxi-Cosi / CYBEX / Clek) inference does not apply
 * brand-wide. Frames like the City Tour 2 take a Graco adapter only — any euro
 * rows on them came from the old universal-adapter rule or a generic adapter scan
 * and are wrong.
 *
 * Keeps:
 *   • Seat brands listed for that exact frame in lib/catalog/babyJoggerAdapters
 *     (already euro-expanded where an adapter covers any euro member).
 *   • Same-brand Baby Jogger seats (City GO) — a direct fit, no adapter needed.
 *
 * Deletes everything else, and reports each removal with a reason.
 *
 * NOTE: deleting the Nuna row also stops the engine's runtime shared-adapter
 * inference from re-adding CYBEX / Clek / Maxi-Cosi for that frame, since that
 * expansion is triggered by an explicit Nuna row.
 *
 *   npx tsx scripts/pruneBabyJoggerCompatibility.ts                    # dry run
 *   npx tsx scripts/pruneBabyJoggerCompatibility.ts --model="City Tour" # one frame
 *   npx tsx scripts/pruneBabyJoggerCompatibility.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:baby-jogger-prune-apply
 */
import prismaBase from '@/lib/server/prisma';
import { babyJoggerSeatBrands, babyJoggerNoAdapterNote } from '@/lib/catalog/babyJoggerAdapters';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const APPLY = process.argv.includes('--apply');

function argValue(flag: string): string | null {
  const withEq = process.argv.find((a) => a.startsWith(`${flag}=`));
  if (withEq) return withEq.slice(flag.length + 1);
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] ?? null : null;
}

const SELF_BRAND = 'baby jogger';

async function main() {
  const modelFilter = argValue('--model');
  console.log(
    `── Prune Baby Jogger compatibility ──  (${APPLY ? 'APPLY' : 'dry run'}${modelFilter ? `, model~"${modelFilter}"` : ''})\n`,
  );

  const strollers: Array<{ id: string; brand: string; model: string; displayName: string | null }> =
    await db.stroller.findMany({
      where: {
        brand: { equals: 'Baby Jogger', mode: 'insensitive' },
        ...(modelFilter ? { model: { contains: modelFilter, mode: 'insensitive' } } : {}),
      },
      select: { id: true, brand: true, model: true, displayName: true },
      orderBy: { model: 'asc' },
    });

  if (strollers.length === 0) {
    console.error('No matching Baby Jogger strollers found.');
    process.exitCode = 1;
    return;
  }

  let removed = 0;
  let kept = 0;

  for (const stroller of strollers) {
    const label = stroller.displayName || `${stroller.brand} ${stroller.model}`;
    const { seatBrands } = babyJoggerSeatBrands(stroller.model);
    const allowed = new Set([...seatBrands.map((b) => b.toLowerCase()), SELF_BRAND]);

    const rows: Array<{ id: string; carSeat: { brand: string; model: string } }> =
      await db.compatibility.findMany({
        where: { strollerId: stroller.id },
        select: { id: true, carSeat: { select: { brand: true, model: true } } },
      });

    if (rows.length === 0) continue;

    const doomed = rows.filter((r) => !allowed.has(r.carSeat.brand.trim().toLowerCase()));
    kept += rows.length - doomed.length;

    const note = babyJoggerNoAdapterNote(stroller.model);
    const allowedLabel = seatBrands.length ? seatBrands.join(', ') : `NONE — ${note ?? 'no adapter published'}`;
    console.log(`  ${label}`);
    console.log(`      published: ${allowedLabel}`);

    if (doomed.length === 0) {
      console.log('      ✓ nothing to remove\n');
      continue;
    }

    const byBrand = new Map<string, number>();
    for (const r of doomed) {
      const b = r.carSeat.brand;
      byBrand.set(b, (byBrand.get(b) ?? 0) + 1);
    }
    console.log(
      `      ${APPLY ? 'removing' : 'would remove'} ${doomed.length}: ` +
        [...byBrand.entries()].map(([b, n]) => `${b} (${n})`).join(', '),
    );
    console.log('');

    removed += doomed.length;
    if (APPLY) {
      await db.compatibility.deleteMany({ where: { id: { in: doomed.map((r) => r.id) } } });
    }
  }

  console.log(
    `${APPLY ? 'Applied' : 'Dry run'} — ${removed} row(s) ${APPLY ? 'removed' : 'would be removed'}, ${kept} kept.`,
  );
  if (!APPLY) console.log('Re-run with --apply to delete these rows.');

  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[pruneBabyJoggerCompatibility] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
