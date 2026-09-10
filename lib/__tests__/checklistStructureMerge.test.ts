import { describe, expect, it } from 'vitest';
import { mergeChecklistStructure } from '@/lib/checklist/structureMerge';

describe('checklist structure merge', () => {
  it('lets DB category rows override original static categories', () => {
    const structure = mergeChecklistStructure([
      { id: 'sleep', title: 'Sleep, Nursery + Setup', sortOrder: 95, hidden: false },
    ]);

    const category = structure.categories.find((candidate) => candidate.id === 'sleep');
    expect(category).toMatchObject({
      id: 'sleep',
      title: 'Sleep, Nursery + Setup',
      sortOrder: 95,
      hidden: false,
      source: 'merged',
    });
  });

  it('lets DB item rows override copy and placement while preserving static metadata', () => {
    const structure = mergeChecklistStructure(
      [],
      [
        {
          id: 'crib',
          categoryId: 'feeding',
          title: 'Edited safe sleep space',
          note: 'Edited admin note.',
          badge: null,
          taylorsTake: null,
          includeVersions: [],
          timing: null,
          take: null,
          sortOrder: 15,
          hidden: false,
        },
      ],
    );

    const item = structure.items.find((candidate) => candidate.id === 'crib');
    expect(item).toMatchObject({
      id: 'crib',
      category: 'feeding',
      title: 'Edited safe sleep space',
      note: 'Edited admin note.',
      timing: 'before-baby',
      take: 'essential',
      sortOrder: 15,
      hidden: false,
      source: 'merged',
    });
    expect(item?.recommendationIds).toEqual(['davinci-dylan-mini-crib', 'stokke-sleepi-crib']);
  });

  it('filters hidden overrides publicly while keeping them editable for admin', () => {
    const publicStructure = mergeChecklistStructure(
      [{ id: 'sleep', title: 'Sleep + Nursery', sortOrder: 0, hidden: true }],
      [{ id: 'crib', categoryId: 'sleep', title: 'Crib', note: null, badge: null, taylorsTake: null, includeVersions: [], sortOrder: 0, hidden: true }],
    );
    expect(publicStructure.categories.some((category) => category.id === 'sleep')).toBe(false);
    expect(publicStructure.items.some((item) => item.id === 'crib')).toBe(false);

    const adminStructure = mergeChecklistStructure(
      [{ id: 'sleep', title: 'Sleep + Nursery', sortOrder: 0, hidden: true }],
      [{ id: 'crib', categoryId: 'sleep', title: 'Crib', note: null, badge: null, taylorsTake: null, includeVersions: [], sortOrder: 0, hidden: true }],
      { includeHidden: true },
    );
    expect(adminStructure.categories.find((category) => category.id === 'sleep')?.hidden).toBe(true);
    expect(adminStructure.items.find((item) => item.id === 'crib')?.hidden).toBe(true);
  });

  it('keeps condensed static rows hidden by default but restorable through a DB override', () => {
    expect(mergeChecklistStructure().items.some((item) => item.id === 'safe-sleep-boundaries')).toBe(false);

    const adminStructure = mergeChecklistStructure([], [], { includeHidden: true });
    expect(adminStructure.items.find((item) => item.id === 'safe-sleep-boundaries')?.hidden).toBe(true);

    const restored = mergeChecklistStructure(
      [],
      [
        {
          id: 'safe-sleep-boundaries',
          categoryId: 'sleep',
          title: 'Bare-crib safe sleep boundaries',
          note: 'Restored from admin.',
          badge: null,
          taylorsTake: null,
          includeVersions: [],
          sortOrder: 50,
          hidden: false,
        },
      ],
    );
    expect(restored.items.find((item) => item.id === 'safe-sleep-boundaries')?.hidden).toBe(false);
  });
});

