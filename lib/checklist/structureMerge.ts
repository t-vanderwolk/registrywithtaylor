import {
  categories as staticCategories,
  checklistItems as staticItems,
  isPublicChecklistItem,
  type ChecklistItem,
  type ChecklistTake,
  type ChecklistTiming,
  type ChecklistType,
} from '@/lib/checklist/data';

const VALID_VERSIONS: ChecklistType[] = ['girl', 'boy', 'neutral', 'twins'];
const VALID_TIMINGS: ChecklistTiming[] = [
  'before-baby',
  'first-8-weeks',
  '3-6-months',
  '6-12-months',
  'later',
];
const VALID_TAKES: ChecklistTake[] = [
  'essential',
  'try-first',
  'register-early',
  'nice-to-have',
  'lifestyle-dependent',
  'wait',
];

export type ChecklistStructureCategory = {
  id: string;
  title: string;
  sortOrder: number;
  hidden?: boolean;
  source?: 'static' | 'db' | 'merged';
};

export type ChecklistStructureItem = ChecklistItem & {
  sortOrder: number;
  hidden?: boolean;
  source?: 'static' | 'db' | 'merged';
};

export type DbChecklistCategory = {
  id: string;
  title: string;
  sortOrder: number;
  hidden?: boolean | null;
};

export type DbChecklistItem = {
  id: string;
  categoryId: string;
  title: string;
  note: string | null;
  badge: string | null;
  taylorsTake: string | null;
  includeVersions: string[];
  timing?: string | null;
  take?: string | null;
  sortOrder: number;
  hidden?: boolean | null;
};

export type ChecklistStructure = {
  categories: ChecklistStructureCategory[];
  items: ChecklistStructureItem[];
};

type MergeOptions = {
  includeHidden?: boolean;
};

const categoryFallback = new Map<string, { title: string; sortOrder: number }>(
  staticCategories.map((category, index) => [
    category.id,
    { title: category.title, sortOrder: index * 10 },
  ]),
);

const staticItemSort = new Map<string, number>();
const perCategoryCount = new Map<string, number>();
for (const item of staticItems) {
  const index = perCategoryCount.get(item.category) ?? 0;
  staticItemSort.set(item.id, index * 10);
  perCategoryCount.set(item.category, index + 1);
}

const staticItemById = new Map(staticItems.map((item) => [item.id, item]));

function validVersions(values: string[] | undefined): ChecklistType[] | undefined {
  const include = (Array.isArray(values) ? values : []).filter((v): v is ChecklistType =>
    VALID_VERSIONS.includes(v as ChecklistType),
  );
  return include.length ? include : undefined;
}

function validTiming(value: string | null | undefined): ChecklistTiming | undefined {
  return VALID_TIMINGS.includes(value as ChecklistTiming) ? (value as ChecklistTiming) : undefined;
}

function validTake(value: string | null | undefined): ChecklistTake | undefined {
  return VALID_TAKES.includes(value as ChecklistTake) ? (value as ChecklistTake) : undefined;
}

function staticItemHidden(item: ChecklistItem): boolean | undefined {
  return isPublicChecklistItem(item) ? undefined : true;
}

function categoryFromDb(
  id: string,
  dbCategory: DbChecklistCategory,
  source: ChecklistStructureCategory['source'],
): ChecklistStructureCategory {
  return {
    id,
    title: dbCategory.title,
    sortOrder:
      typeof dbCategory.sortOrder === 'number'
        ? dbCategory.sortOrder
        : categoryFallback.get(id)?.sortOrder ?? 100,
    hidden: Boolean(dbCategory.hidden),
    source,
  };
}

function itemFromDb(
  dbItem: DbChecklistItem,
  staticItem: ChecklistItem | undefined,
): ChecklistStructureItem {
  const include = validVersions(dbItem.includeVersions);
  const timing = validTiming(dbItem.timing) ?? staticItem?.timing;
  const take = validTake(dbItem.take) ?? staticItem?.take;
  return {
    ...(staticItem ?? {}),
    id: dbItem.id,
    category: dbItem.categoryId,
    title: dbItem.title,
    note: dbItem.note ?? undefined,
    badge: dbItem.badge ?? undefined,
    taylorsTake: dbItem.taylorsTake ?? undefined,
    include,
    timing,
    take,
    sortOrder:
      typeof dbItem.sortOrder === 'number'
        ? dbItem.sortOrder
        : staticItem
          ? staticItemSort.get(staticItem.id) ?? 100
          : 100,
    hidden: Boolean(dbItem.hidden),
    source: staticItem ? 'merged' : 'db',
  };
}

export function mergeChecklistStructure(
  dbCategories: DbChecklistCategory[] = [],
  dbItems: DbChecklistItem[] = [],
  options: MergeOptions = {},
): ChecklistStructure {
  const includeHidden = Boolean(options.includeHidden);
  const dbCategoryById = new Map(dbCategories.map((category) => [category.id, category]));

  const categories: ChecklistStructureCategory[] = [];
  for (const category of staticCategories) {
    const dbCategory = dbCategoryById.get(category.id);
    const merged = dbCategory
      ? categoryFromDb(category.id, dbCategory, 'merged')
      : {
          id: category.id,
          title: category.title,
          sortOrder: categoryFallback.get(category.id)?.sortOrder ?? 100,
          source: 'static' as const,
        };
    if (includeHidden || !merged.hidden) categories.push(merged);
  }
  for (const dbCategory of dbCategories) {
    if (categoryFallback.has(dbCategory.id)) continue;
    const merged = categoryFromDb(dbCategory.id, dbCategory, 'db');
    if (includeHidden || !merged.hidden) categories.push(merged);
  }

  const dbItemById = new Map(dbItems.map((item) => [item.id, item]));
  const items: ChecklistStructureItem[] = [];
  for (const staticItem of staticItems) {
    const dbItem = dbItemById.get(staticItem.id);
    const merged = dbItem
      ? itemFromDb(dbItem, staticItem)
      : {
          ...staticItem,
          sortOrder: staticItemSort.get(staticItem.id) ?? 100,
          hidden: staticItemHidden(staticItem),
          source: 'static' as const,
        };
    if (includeHidden || isPublicChecklistItem(merged)) items.push(merged);
  }
  for (const dbItem of dbItems) {
    if (staticItemById.has(dbItem.id)) continue;
    const merged = itemFromDb(dbItem, undefined);
    if (includeHidden || isPublicChecklistItem(merged)) items.push(merged);
  }

  categories.sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
  const categoryOrder = new Map(categories.map((category, index) => [category.id, index]));
  items.sort((a, b) => {
    const categoryDelta =
      (categoryOrder.get(a.category) ?? Number.MAX_SAFE_INTEGER) -
      (categoryOrder.get(b.category) ?? Number.MAX_SAFE_INTEGER);
    if (categoryDelta) return categoryDelta;
    return a.sortOrder - b.sortOrder || a.title.localeCompare(b.title);
  });

  return { categories, items };
}
