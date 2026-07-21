/**
 * Adapter-coverage audit.
 *
 * Scans every stroller in every finder category EXCEPT umbrella, and flags any
 * that is missing an exact adapter LINK and/or adapter IMAGE for a pairing that
 * actually requires an adapter.
 *
 * What counts as a gap:
 *   • A Compatibility row whose type is ADAPTER (or adapterRequired = true) but
 *     whose adapterBabylistUrl is empty  → "missing link"
 *   • …or whose adapterImage is empty     → "missing image"
 *   DIRECT-fit and same-brand rows need no adapter and are never flagged.
 *
 * A stroller with NO compatibility rows at all is reported separately ("no
 * travel-system rows") — that's a coverage gap of a different kind, worth seeing.
 *
 * Read-only. Writes reports/stroller-adapter-audit.csv for the full detail.
 *
 *   npx tsx scripts/auditStrollerAdapters.ts
 *   npx tsx scripts/auditStrollerAdapters.ts --category=jogging   # one category
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)?sslmode=require" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:audit-adapters
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import prismaBase from '@/lib/server/prisma';
import { getTravelSystemStrollers } from '@/lib/server/travelSystemCompatibility';
import { STROLLER_CATEGORY_LABELS } from '@/lib/guides/travelSystemCompatibility';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const norm = (v: string) => v.toLowerCase().replace(/\s+/g, ' ').trim();
const key = (brand: string, model: string) => `${norm(brand)}|${norm(model)}`;
const has = (v: string | null | undefined) => typeof v === 'string' && v.trim().length > 0;

function argValue(flag: string): string | null {
  const withEq = process.argv.find((a) => a.startsWith(`${flag}=`));
  if (withEq) return withEq.slice(flag.length + 1);
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] ?? null : null;
}

type CompatRow = {
  brand: string;
  model: string;
  type: string;
  adapter_required: boolean;
  adapter_url: string | null;
  adapter_image: string | null;
  seat_brand: string;
  seat_model: string;
};

async function main() {
  const categoryFilter = argValue('--category');
  console.log('── Stroller adapter-coverage audit (excludes umbrella) ──\n');

  // 1. category per stroller, from the same source the finder uses.
  const options = await getTravelSystemStrollers();
  const categoryOf = new Map<string, string | null>();
  for (const o of options as Array<{ brand: string; model: string; strollerCategory?: string | null }>) {
    categoryOf.set(key(o.brand, o.model), o.strollerCategory ?? null);
  }

  // 2. every stroller + its adapter compatibility rows (raw join, stale-client-proof).
  const rows: CompatRow[] = await db.$queryRawUnsafe(`
    SELECT s."brand", s."model",
           c."compatibilityType" AS type,
           c."adapterRequired"   AS adapter_required,
           c."adapterBabylistUrl" AS adapter_url,
           c."adapterImage"       AS adapter_image,
           cs."brand" AS seat_brand, cs."model" AS seat_model
    FROM "Stroller" s
    JOIN "Compatibility" c ON c."strollerId" = s."id"
    JOIN "CarSeat" cs ON cs."id" = c."carSeatId"
    ORDER BY LOWER(s."brand"), LOWER(s."model")
  `);

  // group by stroller
  type Bucket = {
    brand: string;
    model: string;
    category: string | null;
    adapterRows: CompatRow[];
    missingLink: CompatRow[];
    missingImage: CompatRow[];
    totalRows: number;
  };
  const byStroller = new Map<string, Bucket>();
  const seenAnyRow = new Set<string>();

  for (const r of rows) {
    const k = key(r.brand, r.model);
    seenAnyRow.add(k);
    const b =
      byStroller.get(k) ??
      ({ brand: r.brand, model: r.model, category: categoryOf.get(k) ?? null, adapterRows: [], missingLink: [], missingImage: [], totalRows: 0 } as Bucket);
    b.totalRows += 1;
    const needsAdapter = r.type === 'ADAPTER' || r.adapter_required === true;
    if (needsAdapter) {
      b.adapterRows.push(r);
      if (!has(r.adapter_url)) b.missingLink.push(r);
      if (!has(r.adapter_image)) b.missingImage.push(r);
    }
    byStroller.set(k, b);
  }

  // Strollers with a (non-umbrella) category but NO compatibility rows at all.
  const noRows: Array<{ brand: string; model: string; category: string | null }> = [];
  for (const o of options as Array<{ brand: string; model: string; strollerCategory?: string | null }>) {
    const k = key(o.brand, o.model);
    const cat = o.strollerCategory ?? null;
    if (cat === 'umbrella') continue;
    if (!seenAnyRow.has(k)) noRows.push({ brand: o.brand, model: o.model, category: cat });
  }

  // Filter to non-umbrella (+ optional single category) and flag.
  const flagged = [...byStroller.values()].filter((b) => {
    if (b.category === 'umbrella') return false;
    if (categoryFilter && b.category !== categoryFilter) return false;
    return b.missingLink.length > 0 || b.missingImage.length > 0;
  });

  // ── report, grouped by category ──
  const catLabel = (c: string | null) => (c ? STROLLER_CATEGORY_LABELS[c as keyof typeof STROLLER_CATEGORY_LABELS] ?? c : '(uncategorized)');
  const byCat = new Map<string, Bucket[]>();
  for (const b of flagged) {
    const list = byCat.get(b.category ?? '') ?? [];
    list.push(b);
    byCat.set(b.category ?? '', list);
  }

  let totalFlagged = 0;
  for (const [cat, list] of [...byCat.entries()].sort()) {
    console.log(`\n## ${catLabel(cat || null)}  —  ${list.length} stroller(s) with adapter gaps`);
    for (const b of list.sort((a, z) => `${a.brand} ${a.model}`.localeCompare(`${z.brand} ${z.model}`))) {
      totalFlagged += 1;
      const bits = [
        `${b.adapterRows.length} adapter pairing(s)`,
        b.missingLink.length ? `${b.missingLink.length} missing link` : null,
        b.missingImage.length ? `${b.missingImage.length} missing image` : null,
      ].filter(Boolean);
      console.log(`   • ${b.brand} ${b.model}  —  ${bits.join(', ')}`);
      // show which seat pairings are short, deduped by seat brand
      const seatBrands = new Map<string, { link: boolean; image: boolean }>();
      for (const r of b.adapterRows) {
        const flag = seatBrands.get(r.seat_brand) ?? { link: true, image: true };
        if (!has(r.adapter_url)) flag.link = false;
        if (!has(r.adapter_image)) flag.image = false;
        seatBrands.set(r.seat_brand, flag);
      }
      for (const [sb, f] of seatBrands) {
        if (f.link && f.image) continue;
        const need = [!f.link ? 'link' : null, !f.image ? 'image' : null].filter(Boolean).join(' + ');
        console.log(`        ↳ ${sb} adapter: missing ${need}`);
      }
    }
  }

  console.log(`\n────────────────────────────────────────`);
  console.log(`Flagged (missing adapter link/image):  ${totalFlagged} stroller(s)`);
  console.log(`No travel-system rows at all:          ${noRows.filter((r) => !categoryFilter || r.category === categoryFilter).length} stroller(s)`);
  if (noRows.length) {
    for (const r of noRows.filter((r) => !categoryFilter || r.category === categoryFilter)) {
      console.log(`   · ${r.brand} ${r.model}  (${catLabel(r.category)})`);
    }
  }

  // ── CSV ──
  mkdirSync(resolve(process.cwd(), 'reports'), { recursive: true });
  const esc = (v: unknown) => {
    const t = v == null ? '' : String(v);
    return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
  };
  const csv = [['category', 'stroller', 'seat_brand', 'seat_model', 'type', 'has_link', 'has_image'].join(',')];
  for (const b of byStroller.values()) {
    if (b.category === 'umbrella') continue;
    for (const r of b.adapterRows) {
      csv.push(
        [catLabel(b.category), `${b.brand} ${b.model}`, r.seat_brand, r.seat_model, r.type, has(r.adapter_url), has(r.adapter_image)].map(esc).join(','),
      );
    }
  }
  writeFileSync(resolve(process.cwd(), 'reports/stroller-adapter-audit.csv'), `${csv.join('\n')}\n`);
  console.log(`\nFull detail → reports/stroller-adapter-audit.csv`);

  await db.$disconnect?.();
}

main().catch(async (error) => {
  console.error('[auditStrollerAdapters] failed:', error);
  await db.$disconnect?.();
  process.exit(1);
});
