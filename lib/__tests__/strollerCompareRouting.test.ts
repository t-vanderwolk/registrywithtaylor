import { describe, expect, it } from 'vitest';
import { comparePath, parseCompareIds, resolveCompareIds } from '@/lib/strollerCompareRouting';

describe('shared comparison URLs', () => {
  const available = new Set(['silver-cross-reef', 'uppababy-vista-v3']);

  it('resolves the documented Reef 2 alias while preserving other selections', () => {
    expect(resolveCompareIds(['silver-cross-reef-2', 'uppababy-vista-v3'], available))
      .toEqual(['silver-cross-reef', 'uppababy-vista-v3']);
  });

  it('deduplicates the legacy and current Reef selections', () => {
    expect(resolveCompareIds(['silver-cross-reef-2', 'silver-cross-reef'], available))
      .toEqual(['silver-cross-reef']);
  });

  it('prefers an exact catalog identity if Reef 2 is ever restored separately', () => {
    expect(resolveCompareIds(['silver-cross-reef-2'], new Set([...available, 'silver-cross-reef-2'])))
      .toEqual(['silver-cross-reef-2']);
  });

  it('rejects unresolved IDs rather than returning an empty or partial comparison', () => {
    expect(resolveCompareIds(['silver-cross-reef-3'], available)).toBeNull();
    expect(resolveCompareIds(['silver-cross-reef-2'], new Set())).toBeNull();
    expect(resolveCompareIds(['uppababy-vista-v3', 'unknown'], available)).toBeNull();
  });

  it('keeps the base tool accessible and bounds repeated selections', () => {
    expect(resolveCompareIds([], available)).toEqual([]);
    expect(comparePath([])).toBe('/tools/compare');
    expect(parseCompareIds(' a, a, b ,c,d')).toEqual(['a', 'b', 'c']);
    expect(new URL(comparePath(['a', 'b']), 'https://example.com').searchParams.get('ids')).toBe('a,b');
  });
});
