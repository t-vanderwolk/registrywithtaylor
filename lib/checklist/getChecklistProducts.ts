import 'server-only';
import prismaBase from '@/lib/server/prisma';
import { products as staticProducts, type ChecklistProduct } from '@/lib/checklist/products';

// ChecklistProduct lands in the generated client on the Heroku build; cast so
// this typechecks before `prisma generate` runs in a fresh checkout.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

/**
 * Returns the checklist products keyed by id. Prefers the admin-editable DB rows
 * (ChecklistProduct); falls back to the static products.ts map when the table is
 * empty or unavailable (e.g. before the migration/seed have run) so the tool
 * never breaks.
 */
export async function getChecklistProducts(): Promise<Record<string, ChecklistProduct>> {
  try {
    const rows = await db.checklistProduct.findMany({ orderBy: { sortOrder: 'asc' } });
    if (!rows || rows.length === 0) return staticProducts;

    const map: Record<string, ChecklistProduct> = {};
    for (const r of rows) {
      map[r.id] = {
        id: r.id,
        brand: r.brand,
        product: r.product,
        review: r.review ?? '',
        bestFor: r.bestFor ?? '',
        standout: r.standout ?? '',
        affiliateUrl: r.affiliateUrl,
        amazonUrl: r.amazonUrl ?? undefined,
        secondaryUrl: r.secondaryUrl ?? undefined,
        secondaryRetailer: r.secondaryRetailer ?? undefined,
        price: r.price ?? undefined,
        priceSource: r.priceSource ?? undefined,
        retailer: r.retailer ?? undefined,
        imageUrl: r.imageUrl ?? undefined,
        badge: r.badge ?? undefined,
        disclosure: r.disclosure ?? undefined,
        checklistItemId: r.checklistItemId ?? undefined,
        sortOrder: typeof r.sortOrder === 'number' ? r.sortOrder : undefined,
      };
    }
    return map;
  } catch {
    return staticProducts;
  }
}
