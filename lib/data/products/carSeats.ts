import { CAR_SEAT_PRODUCT_GROUPS } from '@/lib/guides/carSeatProductCatalog';

export { CAR_SEAT_PRODUCT_GROUPS };

export type CarSeatProductGroupSlug = keyof typeof CAR_SEAT_PRODUCT_GROUPS;

export function getCarSeatProductExamples(slug: string) {
  if (!(slug in CAR_SEAT_PRODUCT_GROUPS)) {
    return [];
  }

  return [...CAR_SEAT_PRODUCT_GROUPS[slug as CarSeatProductGroupSlug]];
}
