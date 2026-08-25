import 'server-only';
import prismaBase from '@/lib/server/prisma';
import {
  categories as staticCategories,
  checklistItems as staticItems,
  type ChecklistItem,
  type ChecklistType,
} from '@/lib/checklist/data';

// ChecklistCategory / ChecklistItem land in the generated client on the Heroku
// build; cast so this typechecks before `prisma generate` runs in a fresh checkout.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const VALID_VERSIONS: ChecklistType[] = ['girl', 'boy', 'neutral', 'twins'];

export type ChecklistStructure = {
  categories: { id: string; title: string }[];
  items: ChecklistItem[];
};

/**
 * The checklist's categories and line items: the static lib/checklist/data.ts
 * baseline merged with any admin-created rows (ChecklistCategory / ChecklistItem).
 *
 * - Categories: static ones hold positions 0,10,20…; admin categories interleave
 *   by their sortOrder. An admin row may reuse a static id to override its title.
 * - Items: static items keep file order; admin items are appended within their
 *   category (a static CategoryId or an admin category id) by sortOrder.
 *
 * Degrades to the static-only structure if the tables aren't reachable (e.g.
 * before the migration runs), so the tool never breaks.
 */
export async function getChecklistStructure(): Promise<ChecklistStructure> {
  let dbCats: Array<{ id: string; title: string; sortOrder: number }> = [];
  let dbItems: Array<{
    id: string;
    categoryId: string;
    title: string;
    note: string | null;
    badge: string | null;
    taylorsTake: string | null;
    includeVersions: string[];
    sortOrder: number;
  }> = [];
  try {
    dbCats = await db.checklistCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  } catch {
    dbCats = [];
  }
  try {
    dbItems = await db.checklistItem.findMany({ orderBy: { sortOrder: 'asc' } });
  } catch {
    dbItems = [];
  }

  // Categories — static baseline first, admin rows merged/interleaved by sortOrder.
  const order = new Map<string, number>();
  const title = new Map<string, string>();
  staticCategories.forEach((c, i) => {
    order.set(c.id, i * 10);
    title.set(c.id, c.title);
  });
  for (const c of dbCats) {
    title.set(c.id, c.title);
    order.set(c.id, typeof c.sortOrder === 'number' ? c.sortOrder : 100);
  }
  const categories = [...title.entries()]
    .map(([id, t]) => ({ id, title: t, o: order.get(id) ?? 100 }))
    .sort((a, b) => a.o - b.o || a.title.localeCompare(b.title))
    .map(({ id, title: t }) => ({ id, title: t }));

  // Items — map admin rows into the ChecklistItem shape, appended after statics.
  const mappedDbItems: ChecklistItem[] = dbItems.map((r) => {
    const include = (Array.isArray(r.includeVersions) ? r.includeVersions : []).filter(
      (v): v is ChecklistType => VALID_VERSIONS.includes(v as ChecklistType),
    );
    return {
      id: r.id,
      category: r.categoryId,
      title: r.title,
      note: r.note ?? undefined,
      badge: r.badge ?? undefined,
      taylorsTake: r.taylorsTake ?? undefined,
      include: include.length ? include : undefined,
    };
  });

  return { categories, items: [...staticItems, ...mappedDbItems] };
}
