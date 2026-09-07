export type CompatibilityResultBucket = 'direct' | 'adapter' | 'other';

export function compatibilityResultBucket(item: {
  compatibilityType: string;
  adapterRequired: boolean;
}): CompatibilityResultBucket {
  if (item.compatibilityType === 'DIRECT' && !item.adapterRequired) return 'direct';
  if (item.adapterRequired || item.compatibilityType === 'ADAPTER' || item.compatibilityType === 'LIMITED') {
    return 'adapter';
  }
  return 'other';
}
