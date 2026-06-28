import { NextResponse } from 'next/server';
import { getPublicStrollerCatalogBrands } from '@/lib/server/publicStrollerCatalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/catalog/strollers
 *
 * Public stroller-finder source, grouped brand → type → products.
 * Shared with the travel-system stroller selector so both tools expose the
 * same public stroller set.
 */
export async function GET() {
  const brands = await getPublicStrollerCatalogBrands();

  return NextResponse.json(
    { brands },
    { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } },
  );
}
