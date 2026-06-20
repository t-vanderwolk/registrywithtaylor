/**
 * Babylist (Impact.com) catalog sync — seed + refresh.
 *
 * Usage:
 *   npx tsx scripts/syncBabylistCatalog.ts                 # targeted (default)
 *   npx tsx scripts/syncBabylistCatalog.ts --dry-run
 *   npx tsx scripts/syncBabylistCatalog.ts --mode=full
 *   npx tsx scripts/syncBabylistCatalog.ts --mode=adapters
 *   npx tsx scripts/syncBabylistCatalog.ts --limit=20
 *
 * Re-runnable: every write is an upsert. --dry-run touches nothing.
 *
 * NOTE: apply the babylist_api_integration migration (`npx prisma migrate deploy`)
 * and regenerate the client (`npx prisma generate`) first, so the generated Prisma
 * client knows about the new Babylist, adapter, and StrollerSpec fields.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import {
  findBabylistNearbyCandidates,
  findBabylistProduct,
  findBabylistProductBySku,
  hasStrictBabylistBrandMatch,
  listBabylistItems,
  searchBabylistProducts,
  type ImpactCatalogItem,
} from '../lib/impact/client';

const prisma = new PrismaClient();

type Mode = 'full' | 'targeted' | 'adapters';

export interface SyncOptions {
  mode?: Mode;
  dryRun?: boolean;
  limit?: number;
}

export interface SyncReport {
  mode: Mode;
  runAt: string;
  dryRun: boolean;
  strollers: { synced: number; notFound: number; notFoundNames: string[] };
  carSeats: { synced: number; notFound: number; notFoundNames: string[] };
  adapters: { synced: number; compatibilityRowsUpdated: number; unmatched: string[] };
  durationMs: number;
}

// ── Helpers ─────────────────────────────────────────────────────────────────
const priceOf = (item: ImpactCatalogItem): number | null => {
  const p = Number.parseFloat(item.CurrentPrice);
  return Number.isFinite(p) ? p : null;
};

const nameOf = (row: { brand: string; model: string; displayName: string | null }) =>
  row.displayName?.trim() || `${row.brand} ${row.model}`.trim();

const VALIDATION_STOPWORDS = new Set([
  'baby', 'stroller', 'car', 'seat', 'infant', 'series', 'system', 'travel',
  'and', 'by', 'the', 'next', 'lx', 'v2', 'v3', '2', '3', '4', '5', '6', 's',
  'g', 't',
]);

const STROLLER_REJECT_CAR_SEAT_TOKENS = new Set([
  'rava', 'mesa', 'pipa', 'keyfit', 'liing', 'cloud', 'aton', 'willow', 'cypress',
]);

const STROLLER_ONLY_TOKENS = new Set(['stroller', 'pushchair', 'pram', 'wagon']);
const CAR_SEAT_TOKENS = new Set([
  'car', 'seat', 'infant', 'convertible', 'booster', 'rava', 'mesa', 'pipa',
  'keyfit', 'liing', 'cloud', 'aton', 'willow', 'cypress',
]);

const ACCESSORY_ONLY_PATTERNS = [
  /\badapter(s)?\b/,
  /\bcup\s*holder\b/,
  /\bcupholder\b/,
  /\btray\b/,
  /\btravel\s+bag\b/,
  /\bstorage\s+bag\b/,
  /\bcarry\s+bag\b/,
  /\bseat\s+liner\b/,
  /\bliner\b/,
  /\bfootmuff\b/,
  /\bsecond\s+seat\b/,
  /\brumble\s+seat\b/,
  /\borganizer\b/,
  /\borganiser\b/,
  /\brain\s+(cover|shield)\b/,
  /\bweather\s+shield\b/,
  /\bglider\s+board\b/,
  /\bride\s+along\b/,
  /\breplacement\b/,
  /\bwheel\b/,
  /\btire\b/,
  /\bstrap\b/,
];

const normalizeForValidation = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const validationTokens = (value: string) =>
  normalizeForValidation(value).split(' ').filter(Boolean);

const hasToken = (tokens: Set<string>, values: Set<string>) => {
  for (const token of values) {
    if (tokens.has(token)) return true;
  }
  return false;
};

const hasAccessoryOnlyPattern = (normalizedName: string) => {
  if (/\bbase\b/.test(normalizedName) && !/\b(infant\s+)?car\s+seat\b/.test(normalizedName)) {
    return true;
  }

  return ACCESSORY_ONLY_PATTERNS.some((pattern) => pattern.test(normalizedName));
};

function validateStoredSkuMatch({
  name,
  brand,
  typeLabel,
  item,
}: {
  name: string;
  brand: string;
  typeLabel: string;
  item: ImpactCatalogItem;
}): { valid: boolean; reason: string } {
  const nameTokens = validationTokens(name);
  const brandTokens = new Set(validationTokens(brand));
  const modelTokens = Array.from(
    new Set(
      nameTokens.filter(
        (token) =>
          token.length >= 3 &&
          !brandTokens.has(token) &&
          !VALIDATION_STOPWORDS.has(token),
      ),
    ),
  );

  if (modelTokens.length === 0) {
    return { valid: false, reason: 'no meaningful DB model tokens' };
  }

  const itemName = normalizeForValidation(item.Name ?? '');
  const itemNameTokens = new Set(validationTokens(item.Name ?? ''));
  const matchingModelTokens = modelTokens.filter(
    (token) => itemNameTokens.has(token) || itemName.includes(token),
  );

  if (matchingModelTokens.length === 0) {
    return {
      valid: false,
      reason: `missing model token (${modelTokens.join(', ')})`,
    };
  }

  const brandMatched = hasStrictBabylistBrandMatch(
    brand,
    item.Name ?? '',
    item.Manufacturer ?? '',
  );
  const isTravelSystem =
    itemName.includes('travel system') ||
    (itemNameTokens.has('travel') && itemNameTokens.has('system'));
  const type = typeLabel.toLowerCase();

  if (hasAccessoryOnlyPattern(itemName)) {
    return { valid: false, reason: 'cached item looks accessory-only' };
  }

  if (type === 'stroller') {
    const hasCarSeatOnlyTerm = hasToken(itemNameTokens, STROLLER_REJECT_CAR_SEAT_TOKENS);
    if (hasCarSeatOnlyTerm && !isTravelSystem) {
      return { valid: false, reason: 'cached item looks car-seat-only' };
    }
  }

  if (type === 'car seat') {
    const hasStrollerOnlyTerm = hasToken(itemNameTokens, STROLLER_ONLY_TOKENS);
    const hasCarSeatTerm = hasToken(itemNameTokens, CAR_SEAT_TOKENS);
    if (hasStrollerOnlyTerm && !hasCarSeatTerm && !isTravelSystem) {
      return { valid: false, reason: 'cached item looks stroller-only' };
    }
  }

  return {
    valid: true,
    reason: `matched model token (${matchingModelTokens.join(', ')}), brand=${brandMatched ? 'yes' : 'no'}`,
  };
}

async function logNearbyBabylistCandidates({
  name,
  brand,
  label,
}: {
  name: string;
  brand: string;
  label: string;
}) {
  const candidates = await findBabylistNearbyCandidates(name, brand, 5);

  if (candidates.length === 0) {
    console.warn(`[babylist-sync] ${label}: no nearby cached catalog candidates`);
    return;
  }

  console.warn(`[babylist-sync] ${label}: nearby cached catalog candidates:`);
  for (const candidate of candidates) {
    const { item, score, matchedTokens, brandMatched } = candidate;
    console.warn(
      `  - ${item.Name} (${item.Manufacturer || 'unknown maker'}, ${item.CatalogItemId}; score=${score.toFixed(2)}, brand=${brandMatched ? 'yes' : 'no'}, tokens=${matchedTokens.join(',') || 'none'})`,
    );
  }
}

async function resolveBabylistMatch({
  name,
  brand,
  storedSku,
  typeLabel,
  fallbackSearch,
}: {
  name: string;
  brand: string;
  storedSku?: string | null;
  typeLabel: string;
  fallbackSearch?: () => ImpactCatalogItem | Promise<ImpactCatalogItem | null> | null;
}): Promise<ImpactCatalogItem | null> {
  const label = `${typeLabel} ${name}`;
  const sku = storedSku?.trim();

  if (sku) {
    console.log(`[babylist-sync] ${label}: checking cached catalog for stored SKU ${sku}`);

    const skuMatch = await findBabylistProductBySku(sku);
    if (skuMatch) {
      const validation = validateStoredSkuMatch({ name, brand, typeLabel, item: skuMatch });
      if (!validation.valid) {
        console.warn(
          `[babylist-sync] ${label}: stored SKU ${sku} matched ${skuMatch.Name} but failed validation; falling back to local search (${validation.reason})`,
        );
      } else {
        console.log(
          `[babylist-sync] ${label}: stored SKU ${sku} matched cached catalog item ${skuMatch.Name} (${skuMatch.CatalogItemId}; ${validation.reason})`,
        );
        return skuMatch;
      }
    } else {
      console.log(
        `[babylist-sync] ${label}: stored SKU ${sku} not found in cached catalog; falling back to local search`,
      );
    }
  }

  const fallbackMatch = await (fallbackSearch
    ? fallbackSearch()
    : findBabylistProduct(name, brand));
  if (fallbackMatch) {
    console.log(
      `[babylist-sync] ${label}: local search matched ${fallbackMatch.Name} (${fallbackMatch.CatalogItemId})`,
    );
    return fallbackMatch;
  }

  console.warn(`[babylist-sync] ${label}: no Babylist match found`);
  await logNearbyBabylistCandidates({ name, brand, label });
  return null;
}

// ── Adapter name parsing ─────────────────────────────────────────────────────
const STROLLER_KEYWORDS = [
  'UPPAbaby Vista', 'UPPAbaby Cruz', 'UPPAbaby Minu',
  'Nuna TRVL', 'Nuna TRIV', 'Nuna MIXX', 'Nuna TAVO',
  'Bugaboo Fox', 'Bugaboo Butterfly', 'Bugaboo Dragonfly',
  'Silver Cross', 'Cybex Gazelle', 'Cybex Mios',
  'Mockingbird', 'Stokke YOYO', 'Baby Jogger',
  'Bumbleride', 'Joolz', 'BOB',
];

const CAR_SEAT_BRANDS = [
  'Maxi-Cosi', 'Maxi Cosi', 'Nuna', 'Cybex', 'Clek', 'Chicco',
  'Peg Perego', 'Graco', 'Britax', 'Baby Jogger', 'UPPAbaby',
];

const normalizeCarSeatBrand = (brand: string) => (/maxi[\s-]?cosi/i.test(brand) ? 'Maxi-Cosi' : brand);

function parseAdapterName(name: string): { strollerKeywords: string[]; carSeatBrands: string[] } {
  const lower = name.toLowerCase();
  const strollerKeywords = STROLLER_KEYWORDS.filter((k) => lower.includes(k.toLowerCase()));
  const carSeatBrands = Array.from(
    new Set(
      CAR_SEAT_BRANDS.filter((b) => lower.includes(b.toLowerCase())).map(normalizeCarSeatBrand),
    ),
  );
  return { strollerKeywords, carSeatBrands };
}

// ── Stroller / car seat sync ─────────────────────────────────────────────────
async function syncStrollersAndCarSeats(opts: SyncOptions, report: SyncReport) {
  const [strollers, carSeats] = await Promise.all([
    prisma.stroller.findMany({ select: { id: true, brand: true, model: true, displayName: true, babylistSku: true } }),
    prisma.carSeat.findMany({ select: { id: true, brand: true, model: true, displayName: true, babylistSku: true } }),
  ]);

  const strollerList = opts.limit ? strollers.slice(0, opts.limit) : strollers;
  const carSeatList = opts.limit ? carSeats.slice(0, opts.limit) : carSeats;

  for (const s of strollerList) {
    const name = nameOf(s);
    const match = await resolveBabylistMatch({
      name,
      brand: s.brand,
      storedSku: s.babylistSku,
      typeLabel: 'stroller',
    });

    if (!match) {
      report.strollers.notFound += 1;
      report.strollers.notFoundNames.push(name);

      // Clear any stale match written by a previous, looser run.
      if (!opts.dryRun) {
        await prisma.stroller
          .update({
            where: { id: s.id },
            data: {
              babylistSku: null,
              babylistUrl: null,
              babylistPrice: null,
              babylistImage: null,
            },
          })
          .catch(() => undefined);
      }

      continue;
    }
    report.strollers.synced += 1;
    const data = {
      babylistSku: match.Id,
      babylistUrl: match.Url, // use as-is — already affiliate-tracked
      babylistPrice: priceOf(match),
      babylistImage: match.ImageUrl || null,
      babylistUpdatedAt: new Date(),
    };
    console.log(`  ✓ stroller ${name} → ${match.Name} ($${data.babylistPrice ?? '?'})`);
    if (!opts.dryRun) {
      await prisma.stroller.update({ where: { id: s.id }, data });
      // Step 7A — seed/refresh StrollerSpec with Babylist fields (quiz dims stay null).
      await prisma.strollerSpec.upsert({
        where: { strollerId: s.id },
        create: { strollerId: s.id, ...data },
        update: { ...data },
      });
    }
  }

  for (const c of carSeatList) {
    const name = nameOf(c);
    const match = await resolveBabylistMatch({
      name,
      brand: c.brand,
      storedSku: c.babylistSku,
      typeLabel: 'car seat',
    });
    if (!match) {
      report.carSeats.notFound += 1;
      report.carSeats.notFoundNames.push(name);
      // Clear any stale match written by a previous, looser run.
      if (!opts.dryRun) {
        await prisma.carSeat
          .update({
            where: { id: c.id },
            data: { babylistSku: null, babylistUrl: null, babylistPrice: null, babylistImage: null },
          })
          .catch(() => undefined);
      }
      continue;
    }
    report.carSeats.synced += 1;
    console.log(`  ✓ car seat ${name} → ${match.Name} ($${priceOf(match) ?? '?'})`);
    if (!opts.dryRun) {
      await prisma.carSeat.update({
        where: { id: c.id },
        data: {
          babylistSku: match.Id,
          babylistUrl: match.Url,
          babylistPrice: priceOf(match),
          babylistImage: match.ImageUrl || null,
          babylistUpdatedAt: new Date(),
        },
      });
    }
  }
}

// ── Adapter sync ─────────────────────────────────────────────────────────────
async function syncAdapters(opts: SyncOptions, report: SyncReport) {
  const adapters = await searchBabylistProducts('adapter stroller', { pageSize: 100 });
  const adapterList = opts.limit ? adapters.slice(0, opts.limit) : adapters;

  // Load DB once for in-memory matching.
  const [strollers, carSeats, compatibilities] = await Promise.all([
    prisma.stroller.findMany({ select: { id: true, brand: true, model: true, displayName: true, babylistSku: true } }),
    prisma.carSeat.findMany({ select: { id: true, brand: true } }),
    prisma.compatibility.findMany({ select: { id: true, strollerId: true, carSeatId: true } }),
  ]);

  const updatedRowIds = new Set<string>();

  for (const adapter of adapterList) {
    const { strollerKeywords, carSeatBrands } = parseAdapterName(adapter.Name);
    if (strollerKeywords.length === 0 || carSeatBrands.length === 0) {
      report.adapters.unmatched.push(adapter.Name);
      continue;
    }

    const matchedStrollerIds = new Set(
      strollers
        .filter((s) =>
          strollerKeywords.some((k) =>
            `${s.brand} ${s.model} ${s.displayName ?? ''}`.toLowerCase().includes(k.toLowerCase()),
          ),
        )
        .map((s) => s.id),
    );
    const matchedCarSeatIds = new Set(
      carSeats
        .filter((c) =>
          carSeatBrands.some((b) => c.brand.toLowerCase().includes(b.toLowerCase().replace('-', ' ').trim().split(' ')[0]!)),
        )
        .map((c) => c.id),
    );

    const rows = compatibilities.filter(
      (row) => matchedStrollerIds.has(row.strollerId) && matchedCarSeatIds.has(row.carSeatId),
    );
    if (rows.length === 0) {
      report.adapters.unmatched.push(adapter.Name);
      continue;
    }

    report.adapters.synced += 1;
    const data = {
      adapterBabylistUrl: adapter.Url,
      adapterPrice: priceOf(adapter),
      adapterImage: adapter.ImageUrl || null,
      adapterBabylistSku: adapter.Id,
      adapterUpdatedAt: new Date(),
    };
    for (const row of rows) {
      console.log(`  ✓ adapter "${adapter.Name}" → compatibility ${row.id}`);
      updatedRowIds.add(row.id);
      if (!opts.dryRun) {
        await prisma.compatibility.update({ where: { id: row.id }, data });
      }
    }
  }

  report.adapters.compatibilityRowsUpdated = updatedRowIds.size;
}

// ── Full mode (page entire catalog, match locally) ───────────────────────────
async function syncFull(opts: SyncOptions, report: SyncReport) {
  const items: ImpactCatalogItem[] = [];
  for await (const page of listBabylistItems({ pageSize: 100 })) {
    items.push(...page);
    if (opts.limit && items.length >= opts.limit) break;
  }
  console.log(`  fetched ${items.length} catalog items`);

  const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const localMatch = (name: string, brand: string): ImpactCatalogItem | null => {
    const target = new Set(norm(name).split(' ').filter(Boolean));
    let best: ImpactCatalogItem | null = null;
    let bestScore = 0.5; // require >50% token coverage
    for (const item of items) {
      const tokens = new Set(norm(item.Name).split(' ').filter(Boolean));
      let overlap = 0;
      for (const t of target) if (tokens.has(t)) overlap += 1;
      let score = target.size ? overlap / target.size : 0;
      if (norm(item.Manufacturer ?? '').includes(norm(brand))) score += 0.25;
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }
    return best;
  };

  const strollers = await prisma.stroller.findMany({
    select: { id: true, brand: true, model: true, displayName: true, babylistSku: true },
  });
  for (const s of strollers) {
    const name = nameOf(s);
    const match = await resolveBabylistMatch({
      name,
      brand: s.brand,
      storedSku: s.babylistSku,
      typeLabel: 'stroller',
      fallbackSearch: () => localMatch(name, s.brand),
    });
    if (!match) {
      report.strollers.notFound += 1;
      report.strollers.notFoundNames.push(name);
      // Clear any stale match written by a previous, looser run.
      if (!opts.dryRun) {
        await prisma.stroller
          .update({
            where: { id: s.id },
            data: { babylistSku: null, babylistUrl: null, babylistPrice: null, babylistImage: null },
          })
          .catch(() => undefined);
      }
      continue;
    }
    report.strollers.synced += 1;
    if (!opts.dryRun) {
      const data = {
        babylistSku: match.Id,
        babylistUrl: match.Url,
        babylistPrice: priceOf(match),
        babylistImage: match.ImageUrl || null,
        babylistUpdatedAt: new Date(),
      };
      await prisma.stroller.update({ where: { id: s.id }, data });
      await prisma.strollerSpec.upsert({
        where: { strollerId: s.id },
        create: { strollerId: s.id, ...data },
        update: { ...data },
      });
    }
  }
  // Adapters still come from the search endpoint in full mode.
  await syncAdapters(opts, report);
}

// ── Orchestrator (imported by the cron route) ────────────────────────────────
export async function runSync(options: SyncOptions = {}): Promise<SyncReport> {
  const mode: Mode = options.mode ?? 'targeted';
  const started = Date.now();
  const report: SyncReport = {
    mode,
    runAt: new Date().toISOString(),
    dryRun: Boolean(options.dryRun),
    strollers: { synced: 0, notFound: 0, notFoundNames: [] },
    carSeats: { synced: 0, notFound: 0, notFoundNames: [] },
    adapters: { synced: 0, compatibilityRowsUpdated: 0, unmatched: [] },
    durationMs: 0,
  };

  if (mode === 'adapters') {
    await syncAdapters(options, report);
  } else if (mode === 'full') {
    await syncFull(options, report);
  } else {
    await syncStrollersAndCarSeats(options, report);
    await syncAdapters(options, report);
  }

  report.durationMs = Date.now() - started;
  return report;
}

// ── CLI ──────────────────────────────────────────────────────────────────────
function parseArgs(argv: string[]): SyncOptions {
  const opts: SyncOptions = {};
  for (const arg of argv) {
    if (arg === '--dry-run') opts.dryRun = true;
    else if (arg.startsWith('--mode=')) opts.mode = arg.slice(7) as Mode;
    else if (arg.startsWith('--limit=')) opts.limit = Number.parseInt(arg.slice(8), 10) || undefined;
  }
  return opts;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  console.log(`[babylist-sync] mode=${opts.mode ?? 'targeted'} dryRun=${Boolean(opts.dryRun)} limit=${opts.limit ?? '∞'}`);

  const report = await runSync(opts);

  const dir = path.join(process.cwd(), 'scripts', 'output');
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `babylist-sync-${Date.now()}.json`);
  writeFileSync(file, JSON.stringify(report, null, 2));

  console.log('\n── Report ─────────────────────────────');
  console.log(JSON.stringify(report, null, 2));
  console.log(`\nWritten to ${file}`);
}

// Run only when invoked directly (not when imported by the cron route).
if (process.argv[1] && process.argv[1].includes('syncBabylistCatalog')) {
  main()
    .catch((error) => {
      console.error('[babylist-sync] failed:', error);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
