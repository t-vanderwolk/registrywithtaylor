/**
 * Refresh the local Babylist catalog mirror (BabylistCatalogItem) used by the
 * admin SKU search at /admin/babylist.
 *
 * Run periodically (it pages the full ~9k-item catalog, a few minutes):
 *   npx tsx scripts/cacheBabylistCatalog.ts
 *
 * Requires the babylist_catalog_cache migration applied + `prisma generate`.
 */
import { PrismaClient } from '@prisma/client';
import { listBabylistItems } from '../lib/impact/client';

const prisma = new PrismaClient();

type Row = {
  sku: string;
  name: string;
  manufacturer: string | null;
  url: string;
  imageUrl: string | null;
  price: number | null;
  updatedAt: Date;
};

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  const seen = new Map<string, Row>();

  for await (const page of listBabylistItems({ pageSize: 100 })) {
    for (const item of page) {
      if (!item.CatalogItemId) continue;
      const price = Number.parseFloat(item.CurrentPrice);
      seen.set(item.CatalogItemId, {
        sku: item.CatalogItemId,
        name: item.Name ?? '',
        manufacturer: item.Manufacturer || null,
        url: item.Url ?? '',
        imageUrl: item.ImageUrl || null,
        price: Number.isFinite(price) ? price : null,
        updatedAt: new Date(),
      });
    }
    console.log(`fetched ${seen.size}...`);
  }

  const rows = [...seen.values()];
  await prisma.babylistCatalogItem.deleteMany({});
  for (const batch of chunk(rows, 500)) {
    await prisma.babylistCatalogItem.createMany({ data: batch, skipDuplicates: true });
  }

  console.log(`Cached ${rows.length} Babylist catalog items.`);
}

main()
  .catch((error) => {
    console.error('[cache-babylist] failed:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
