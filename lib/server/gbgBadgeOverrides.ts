/**
 * Server helper: load all GoodBuy Gear badge overrides into a Map keyed by
 * gbgBadgeKey. Read-only; degrades to an empty Map if the table isn't reachable
 * (e.g. before the migration deploys), so the badge stays fully automatic.
 */
import prisma from '@/lib/server/prisma';
import type { GbgBadgeState } from '@/lib/catalog/gbgBadge';

export type GbgBadgeOverrideRow = {
  key: string;
  state: GbgBadgeState;
  brand: string | null;
  name: string | null;
  surface: string | null;
  note: string | null;
  updatedAt: Date;
  updatedBy: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

/** Map of key → 'on' | 'off' (only non-auto rows are stored). */
export async function getGbgBadgeOverrides(): Promise<Map<string, GbgBadgeState>> {
  try {
    const rows: { key: string; state: string }[] = await db.gbgBadgeOverride.findMany({
      select: { key: true, state: true },
    });
    const map = new Map<string, GbgBadgeState>();
    for (const r of rows) {
      if (r.state === 'on' || r.state === 'off') map.set(r.key, r.state);
    }
    return map;
  } catch {
    return new Map();
  }
}

/** Full rows for the admin audit (includes denormalized brand/name/surface). */
export async function listGbgBadgeOverrides(): Promise<GbgBadgeOverrideRow[]> {
  try {
    return (await db.gbgBadgeOverride.findMany({ orderBy: { updatedAt: 'desc' } })) as GbgBadgeOverrideRow[];
  } catch {
    return [];
  }
}
