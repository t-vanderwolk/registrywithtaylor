import { describe, expect, it } from 'vitest';
import { compatibilityResultBucket } from '@/lib/compatibilityResultBuckets';

describe('compatibility result buckets', () => {
  it('groups logical adapter matches with adapter-required results', () => {
    expect(compatibilityResultBucket({ compatibilityType: 'LIMITED', adapterRequired: true })).toBe('adapter');
    expect(compatibilityResultBucket({ compatibilityType: 'ADAPTER', adapterRequired: true })).toBe('adapter');
  });

  it('keeps direct rows separate from adapter rows', () => {
    expect(compatibilityResultBucket({ compatibilityType: 'DIRECT', adapterRequired: false })).toBe('direct');
  });
});
