import { describe, expect, it } from 'vitest';
import {
  CHECKLIST_TAKE_FILTERS,
  CHECKLIST_TIMING_FILTERS,
  categories,
  checklistItems,
  groupedItemsForType,
  itemsForType,
  itemMatchesChecklistFilters,
  type ChecklistTakeFilter,
  type ChecklistTimingFilter,
} from '@/lib/checklist/data';
import { products } from '@/lib/checklist/products';

describe('comprehensive baby checklist data', () => {
  it('keeps the public checklist curated while preserving the full static source list', () => {
    expect(checklistItems).toHaveLength(175);
    expect(itemsForType('neutral')).toHaveLength(123);
    expect(categories.map((category) => category.title)).toEqual([
      'Sleep + Nursery',
      'Feeding + Pumping',
      'Starting Solids',
      'Diapering',
      'Bath',
      'Health + Grooming',
      'Getting Around',
      'Diaper Bag',
      'Clothing',
      'Play + Development',
      'Awake-Time Gear',
      'Travel',
      'Home + Safety',
      'Postpartum',
      'Support + Services',
      'Registry Strategy',
    ]);
  });

  it('has unique ids, valid categories, and filter metadata on every static row', () => {
    const ids = checklistItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    const categoryIds = new Set<string>(categories.map((category) => category.id));
    expect(checklistItems.filter((item) => !categoryIds.has(item.category))).toEqual([]);
    expect(checklistItems.filter((item) => !item.timing || !item.take)).toEqual([]);
  });

  it('keeps every structured filter populated', () => {
    const publicItems = itemsForType('neutral');
    for (const option of CHECKLIST_TIMING_FILTERS) {
      if (option.id === 'all') continue;
      expect(publicItems.some((item) => item.timing === option.id)).toBe(true);
    }

    for (const option of CHECKLIST_TAKE_FILTERS) {
      if (option.id === 'all') continue;
      expect(publicItems.some((item) => item.take === option.id)).toBe(true);
    }
  });

  it('filters resolved rows by timing and Taylor take', () => {
    const items = groupedItemsForType('neutral').flatMap((group) => group.items);
    const onlyFirstEightEssential = items.filter((item) =>
      itemMatchesChecklistFilters(item, 'first-8-weeks', 'essential'),
    );

    expect(onlyFirstEightEssential.map((item) => item.id)).toEqual(['play-mat']);
    expect(items.every((item) => itemMatchesChecklistFilters(item, 'all', 'all'))).toBe(true);

    const timingFilter: ChecklistTimingFilter = '6-12-months';
    const takeFilter: ChecklistTakeFilter = 'wait';
    expect(
      items
        .filter((item) => itemMatchesChecklistFilters(item, timingFilter, takeFilter))
        .every((item) => item.timing === timingFilter && item.take === takeFilter),
    ).toBe(true);
  });

  it('keeps static recommendation references connected to real checklist products', () => {
    const missing = checklistItems
      .flatMap((item) =>
        [...(item.recommendationIds ?? []), ...(item.recommendationId ? [item.recommendationId] : [])]
          .map((productId) => ({ itemId: item.id, productId })),
      )
      .filter(({ productId }) => !products[productId]);

    expect(missing).toEqual([]);
  });

  it('preserves the original pick-bearing row ids so assigned picks stay visible', () => {
    const legacyPickRows = new Map<string, string[]>([
      ['crib', ['davinci-dylan-mini-crib', 'stokke-sleepi-crib']],
      ['travel-crib', ['playard-pick']],
      ['monitor', ['monitor-pick']],
      ['audio-monitor', ['audio-monitor-pick']],
      ['bottle-trial', ['bottle-trial-pick']],
      ['primary-pump', ['breast-pump-pick']],
      ['high-chair', ['high-chair-pick']],
      ['bathtub', ['bathtub-pick']],
      ['primary-stroller', ['primary-stroller-pick', 'nuna-demi-icon']],
      ['infant-car-seat', ['infant-car-seat-pick']],
      ['convertible-car-seat', ['britax-galaxy360']],
      ['carrier', ['baby-carrier-pick']],
      ['diaper-pail', ['diaper-pail-pick']],
    ]);

    for (const [itemId, productIds] of legacyPickRows) {
      const item = checklistItems.find((candidate) => candidate.id === itemId);
      expect(item, itemId).toBeDefined();
      const actualProductIds = [
        ...(item?.recommendationIds ?? []),
        ...(item?.recommendationId ? [item.recommendationId] : []),
      ];
      expect(actualProductIds, itemId).toEqual(expect.arrayContaining(productIds));
    }
  });

  it('keeps the original row ids used by live checklist product assignments', () => {
    const assignedPickRowIds = [
      'audio-monitor',
      'awake-seat',
      'baby-lotion',
      'baby-wash',
      'bath-stand',
      'bath-thermometer',
      'bathtub',
      'blackout',
      'bodysuits',
      'bottle-brush',
      'bottle-drying-rack',
      'bottle-trial',
      'bottle-washer',
      'carrier',
      'changing-pad',
      'convertible-car-seat',
      'crib',
      'crib-mattress',
      'crib-sheets',
      'diaper-caddy',
      'diaper-pail',
      'dishwasher-basket',
      'high-chair',
      'infant-car-seat',
      'kneeler',
      'manual-pump',
      'mattress-protector',
      'milk-storage',
      'monitor',
      'night-light',
      'pacifier-trial',
      'play-mat',
      'primary-pump',
      'primary-stroller',
      'push-walker',
      'spout-cover',
      'sterilizer',
      'swaddles',
      'travel-crib',
      'travel-system-stroller',
      'warm-water-dispenser',
    ];
    const currentIds = new Set(itemsForType('neutral').map((item) => item.id));

    expect(assignedPickRowIds.filter((id) => !currentIds.has(id))).toEqual([]);
  });
});
