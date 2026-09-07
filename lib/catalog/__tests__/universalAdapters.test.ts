import { describe, expect, it } from 'vitest';
import { universalAdapterFamily } from '@/lib/catalog/universalAdapters';

describe('universal adapter rules', () => {
  it('covers PEG June 2026 shared-adapter chassis', () => {
    for (const model of ['YPSI', 'Vivace', 'Switch', 'City Loop', 'City Loop Pro']) {
      expect(universalAdapterFamily({ brand: 'Peg Perego', model })).toBe('Ypsi / Vivace / Switch / City Loop');
    }
  });
});
