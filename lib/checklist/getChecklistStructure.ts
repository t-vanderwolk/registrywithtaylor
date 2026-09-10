import 'server-only';
import prismaBase from '@/lib/server/prisma';
import {
  mergeChecklistStructure,
  type ChecklistStructure,
  type DbChecklistCategory,
  type DbChecklistItem,
} from '@/lib/checklist/structureMerge';

// ChecklistCategory / ChecklistItem land in the generated client on the Heroku
// build; cast so this typechecks before `prisma generate` runs in a fresh checkout.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

type GetChecklistStructureOptions = {
  includeHidden?: boolean;
};

/**
 * The checklist's categories and line items: the static lib/checklist/data.ts baseline
 * merged with DB overrides (ChecklistCategory / ChecklistItem).
 *
 * A DB row with the same id as a static category/item makes that previously
 * hard-coded row editable from admin. Static metadata that the DB does not own
 * yet (for example product recommendation ids and twins overrides) remains as a
 * fallback, so admin edits do not drop existing affiliate-powered picks.
 *
 * Degrades to the static-only structure if the tables aren't reachable (e.g.
 * before the migration runs), so the tool never breaks.
 */
export async function getChecklistStructure(
  options: GetChecklistStructureOptions = {},
): Promise<ChecklistStructure> {
  let dbCats: DbChecklistCategory[] = [];
  let dbItems: DbChecklistItem[] = [];
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

  return mergeChecklistStructure(dbCats, dbItems, options);
}
