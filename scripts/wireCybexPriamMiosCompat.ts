/**
 * Wire Cybex Priam, Mios, and e-Priam to the same infant-seat coverage as the
 * Cybex Gazelle S — they all use the Cybex car seat adapter, so their compatible
 * seats match (Cybex + Maxi-Cosi + Nuna + Clek).
 *
 * Copies the Gazelle S compatibility rows (carSeatId + type + adapterRequired)
 * onto each target, WITHOUT the Gazelle-specific adapter product links (those
 * would point at the wrong adapter). Skips pairs that already exist.
 *
 *   npx tsx scripts/wireCybexPriamMiosCompat.ts            # dry run (default)
 *   npx tsx scripts/wireCybexPriamMiosCompat.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/wireCybexPriamMiosCompat.ts --apply
 */
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const APPLY = process.argv.includes('--apply');
const TARGET_MODELS = new Set(['priam', 'mios', 'e-priam']);
const SOURCE_MODEL = 'gazelle s';

const NOTE = 'Cybex strollers share the Cybex infant car seat adapter — seat coverage mirrored from the Cybex Gazelle S.';

type Compat = {
  carSeatId: string;
  compatibilityType: string;
  adapterRequired: boolean;
  adapterType: string | null;
  carSeat: { brand: string; model: string } | null;
};
type Row = {
  id: string;
  model: string;
  compatibilities: Compat[];
};

async function main() {
  const cybex: Row[] = await db.stroller.findMany({
    where: { brand: { contains: 'Cybex', mode: 'insensitive' } },
    select: {
      id: true,
      model: true,
      compatibilities: {
        select: {
          carSeatId: true,
          compatibilityType: true,
          adapterRequired: true,
          adapterType: true,
          carSeat: { select: { brand: true, model: true } },
        },
      },
    },
  });

  const source = cybex.find((s) => s.model.trim().toLowerCase() === SOURCE_MODEL);
  if (!source) {
    console.error(`✗ Source "Cybex ${SOURCE_MODEL}" not found. Aborting.`);
    process.exit(1);
  }
  const template = source.compatibilities;
  console.log('── Wire Cybex Priam / Mios / e-Priam to Gazelle S seat coverage ──');
  console.log(`  Template: Cybex ${source.model} → ${template.length} infant seat(s):`);
  console.log('    ' + template.map((c) => `${c.carSeat?.brand} ${c.carSeat?.model}`).join(', '));

  const targets = cybex.filter((s) => TARGET_MODELS.has(s.model.trim().toLowerCase()));
  if (targets.length === 0) {
    console.log('\n  No Priam/Mios/e-Priam rows found. Run the restore + strollers:import first.');
    return;
  }

  let created = 0;
  for (const target of targets) {
    const existing = new Set(target.compatibilities.map((c) => c.carSeatId));
    const toAdd = template.filter((c) => !existing.has(c.carSeatId));
    console.log(`\n  Cybex ${target.model}: ${toAdd.length} new / ${existing.size} already present`);

    for (const c of toAdd) {
      console.log(`    + ${c.carSeat?.brand} ${c.carSeat?.model} [${c.compatibilityType}${c.adapterRequired ? '/adapter' : ''}]`);
      if (APPLY) {
        await db.compatibility.create({
          data: {
            strollerId: target.id,
            carSeatId: c.carSeatId,
            compatibilityType: c.compatibilityType,
            adapterRequired: c.adapterRequired,
            adapterType: c.adapterType ?? 'Cybex infant car seat adapter',
            confidence: 'MEDIUM',
            notes: NOTE,
          },
        });
        created += 1;
      }
    }
  }

  console.log(`\n  ${APPLY ? `✓ Created ${created} compatibility row(s).` : `Would create ${targets.reduce((n, t) => n + template.filter((c) => !t.compatibilities.some((e) => e.carSeatId === c.carSeatId)).length, 0)} row(s).`}`);
  if (!APPLY) console.log('  (dry run — nothing changed. Re-run with --apply.)');
}

main()
  .catch((error) => {
    console.error('[wireCybexPriamMiosCompat] failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
