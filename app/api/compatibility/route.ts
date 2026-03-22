import { NextRequest, NextResponse } from 'next/server';
import { getTravelSystemCompatibility } from '@/lib/server/travelSystemCompatibility';

export const runtime = 'nodejs';

const asText = (value: string | null) => value?.trim() ?? '';

export async function GET(request: NextRequest) {
  const strollerBrand = asText(request.nextUrl.searchParams.get('strollerBrand'));
  const strollerModel = asText(request.nextUrl.searchParams.get('strollerModel'));

  if (!strollerBrand || !strollerModel) {
    return NextResponse.json(
      { error: 'strollerBrand and strollerModel are required.' },
      { status: 400 },
    );
  }

  const result = await getTravelSystemCompatibility(strollerBrand, strollerModel);

  if (!result) {
    return NextResponse.json({ error: 'Stroller not found.' }, { status: 404 });
  }

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
