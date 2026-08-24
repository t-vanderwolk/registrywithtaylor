import { NextResponse } from 'next/server';
import { getPublicCarSeatBrands } from '@/lib/server/publicCarSeatCatalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/catalog/carseats
 *
 * The car-seat side of the finder: every infant car seat in the local affiliate
 * catalog, grouped by brand — the same shape as /api/catalog/strollers so the
 * finder UI can browse them "just like the strollers." Grouping, retailer
 * visibility, and the GoodBuy Gear open-box badge (with per-product admin
 * overrides) all live in getPublicCarSeatBrands so the admin audit reads the
 * same source.
 */
export async function GET() {
  const brands = await getPublicCarSeatBrands();
  return NextResponse.json(
    { brands },
    { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } },
  );
}
