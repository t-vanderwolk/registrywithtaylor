// The September Silver Cross catalog consolidation renamed Reef 2 to Reef.
// Keep the old shared URL working without inferring aliases for other models.
const LEGACY_COMPARE_IDS: Record<string, string> = {
  'silver-cross-reef-2': 'silver-cross-reef',
};

export function parseCompareIds(rawIds?: string | string[]) {
  return Array.from(new Set(
    (Array.isArray(rawIds) ? rawIds[0] : rawIds ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean),
  )).slice(0, 3);
}

export function resolveCompareIds(ids: string[], availableIds: Set<string>) {
  const resolved = ids.map((id) => {
    if (availableIds.has(id)) return id;
    const alias = LEGACY_COMPARE_IDS[id];
    return alias && availableIds.has(alias) ? alias : null;
  });
  if (resolved.some((id) => id === null)) return null;
  return Array.from(new Set(resolved as string[]));
}

export function comparePath(ids: string[]): `/${string}` {
  if (ids.length === 0) return '/tools/compare';
  const params = new URLSearchParams({ ids: ids.join(',') });
  return `/tools/compare?${params.toString()}`;
}
