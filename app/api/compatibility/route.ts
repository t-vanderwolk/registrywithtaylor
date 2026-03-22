import { NextRequest, NextResponse } from 'next/server';
import {
  getTravelSystemCompatibility,
  getTravelSystemCompatibilityByCarSeat,
} from '@/lib/server/travelSystemCompatibility';

export const runtime = 'nodejs';

const asText = (value: string | null) => value?.trim() ?? '';

export async function GET(request: NextRequest) {
  const strollerBrand = asText(request.nextUrl.searchParams.get('strollerBrand'));
  const strollerModel = asText(request.nextUrl.searchParams.get('strollerModel'));
  const carSeatBrand = asText(request.nextUrl.searchParams.get('carSeatBrand'));
  const carSeatModel = asText(request.nextUrl.searchParams.get('carSeatModel'));

  if (strollerBrand && strollerModel) {
    const result = await getTravelSystemCompatibility(strollerBrand, strollerModel);

    if (!result) {
      return NextResponse.json({ error: 'Stroller not found.' }, { status: 404 });
    }

    return NextResponse.json(
      { queryType: 'stroller', ...result },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  }

  if (carSeatBrand && carSeatModel) {
    const result = await getTravelSystemCompatibilityByCarSeat(carSeatBrand, carSeatModel);

    if (!result) {
      return NextResponse.json({ error: 'Car seat not found.' }, { status: 404 });
    }

    return NextResponse.json(
      { queryType: 'carSeat', ...result },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  }

  if (!strollerBrand && !strollerModel && !carSeatBrand && !carSeatModel) {
    return NextResponse.json(
      { error: 'Provide either strollerBrand and strollerModel, or carSeatBrand and carSeatModel.' },
      { status: 400 },
    );
  }

  return NextResponse.json(
    { error: 'Provide a complete stroller or car seat selection before querying compatibility.' },
    { status: 400 },
  );
}
