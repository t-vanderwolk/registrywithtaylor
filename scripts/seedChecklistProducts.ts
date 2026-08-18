/**
 * Seed the ChecklistProduct table from the static lib/checklist/products.ts map.
 * Idempotent: existing rows are preserved (admin edits are never clobbered on a
 * re-run) — only missing rows are inserted.
 *
 * Run after deploying the `checklist_products` migration:
 *   heroku run npm run checklist:seed
 */
import { PrismaClient } from '@prisma/client';
import { products } from '@/lib/checklist/products';

const prisma = new PrismaClient();
// ChecklistProduct lands in the generated client on the next `prisma generate`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

async function main() {
  const list = Object.values(products);
  for (let i = 0; i < list.length; i++) {
    const p = list[i];
    await db.checklistProduct.upsert({
      where: { id: p.id },
      update: {}, // preserve admin edits on re-run
      create: {
        id: p.id,
        brand: p.brand,
        product: p.product,
        review: p.review ?? '',
        bestFor: p.bestFor ?? '',
        standout: p.standout ?? '',
        affiliateUrl: p.affiliateUrl,
        amazonUrl: p.amazonUrl ?? null,
        secondaryUrl: p.secondaryUrl ?? null,
        secondaryRetailer: p.secondaryRetailer ?? null,
        price: p.price ?? null,
        priceSource: p.priceSource ?? null,
        retailer: p.retailer ?? null,
        imageUrl: p.imageUrl ?? null,
        badge: p.badge ?? null,
        disclosure: p.disclosure ?? false,
        sortOrder: i,
      },
    });
  }
  console.log(`Seeded/ensured ${list.length} checklist products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
