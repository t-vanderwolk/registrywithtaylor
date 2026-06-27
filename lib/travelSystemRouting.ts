export type TravelSystemRouteOption = {
  brand: string;
  model: string;
  displayName?: string;
};

export type TravelSystemStartKind = 'stroller' | 'carSeat';

export function travelSystemSlug(option: TravelSystemRouteOption) {
  return `${option.brand} ${option.model}`
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function findTravelSystemOptionBySlug<T extends TravelSystemRouteOption>(options: T[], slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();
  return options.find((option) => travelSystemSlug(option) === normalizedSlug) ?? null;
}

export function travelSystemResultsHref(kind: TravelSystemStartKind, option: TravelSystemRouteOption) {
  const params = new URLSearchParams({
    [kind === 'stroller' ? 'stroller' : 'carSeat']: travelSystemSlug(option),
  });
  return `/tools/travel-system/results?${params.toString()}`;
}
