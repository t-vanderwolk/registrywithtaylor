import { describe, expect, it } from 'vitest';
import { mergeStrollerModel, overrideStrollerCategory } from '@/lib/catalog/strollerModelMerges';
import { universalAdapterFamily } from '@/lib/catalog/universalAdapters';

describe('universal adapter rules', () => {
  it('covers PEG June 2026 shared-adapter chassis', () => {
    for (const model of ['YPSI', 'Vivace', 'Switch', 'City Loop', 'City Loop Pro']) {
      expect(universalAdapterFamily({ brand: 'Peg Perego', model })).toBe('Ypsi / Vivace / Switch / City Loop');
    }
  });

  it('covers only the Silver Cross shared-adapter target lineup', () => {
    const expectedFamily = 'Reef / Cove 2 / Breez / Nia / Jet Double / Wave / Wave 3';

    for (const model of ['Reef', 'Reef 2', 'Cove 2', 'Breez', 'Nia', 'Nia Travel', 'Jet Double', 'Wave', 'Wave 3']) {
      expect(universalAdapterFamily({ brand: 'Silver Cross', model })).toBe(expectedFamily);
    }

    for (const model of ['Clic', 'Clic Compact', 'Dune', 'Dune 2', 'Comet', 'Jet 5', 'Wave 3 Single to Double']) {
      expect(universalAdapterFamily({ brand: 'Silver Cross', model })).toBeNull();
    }
  });

  it('collapses Silver Cross catalog aliases to the intended public models', () => {
    expect(mergeStrollerModel('Silver Cross', 'Clic Compact')).toBe('Clic');
    expect(mergeStrollerModel('Silver Cross', 'Nia Travel')).toBe('Nia');
    expect(mergeStrollerModel('Silver Cross', 'Reef 2')).toBe('Reef');
    expect(mergeStrollerModel('Silver Cross', 'Wave 3 Single to Double')).toBe('Wave 3');

    expect(overrideStrollerCategory('Silver Cross', 'Reef', 'travel')).toBe('full-size');
    expect(overrideStrollerCategory('Silver Cross', 'Nia', 'compact')).toBe('travel');
    expect(overrideStrollerCategory('Silver Cross', 'Wave 3', 'full-size')).toBe('convertible-modular');
  });
});
