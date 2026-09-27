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
    expect(checklistItems).toHaveLength(211);
    expect(itemsForType('neutral')).toHaveLength(161);
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

  it('separates bundled items in every version without duplicating existing rows', () => {
    const separateIds = [
      'nursery-landing-zone', 'nursery-side-table', 'diaper-caddy',
      'nursery-drawer-organizers', 'nursery-closet-organizers', 'nursery-storage-bins',
      'first-spoons', 'bowls-plates', 'baby-plates', 'open-straw-cups', 'straw-cup',
      'newborn-diapers', 'size-one-diapers', 'hooded-towels', 'washcloths',
      'nursing-pads-balm', 'nipple-balm', 'nasal-saline', 'nasal-saline-drops',
      'postpartum-underwear-pads', 'postpartum-pads', 'peri-bottle-cold-packs',
      'postpartum-cold-packs', 'parent-station', 'parent-snacks', 'long-charging-cable',
    ];
    for (const type of ['girl', 'boy', 'neutral', 'twins'] as const) {
      const items = itemsForType(type);
      for (const id of separateIds) {
        expect(items.filter((item) => item.id === id), `${type}: ${id}`).toHaveLength(1);
      }
      expect(items.find((item) => item.id === 'bottle-brush')?.title).toBe('Bottle brush');
      expect(items.find((item) => item.id === 'air-purifier')).toMatchObject({
        category: 'sleep', title: 'Air purifier', take: 'nice-to-have', timing: 'before-baby',
      });
    }
  });

  it('keeps alternative choices together', () => {
    const items = itemsForType('neutral');
    expect(items.find((item) => item.id === 'warm-water-dispenser')?.title)
      .toBe('Bottle warmer or warm-water dispenser');
    expect(items.find((item) => item.id === 'travel-crib')?.title)
      .toBe('Portable playard / travel crib');
    expect(items.find((item) => item.id === 'bottle-washer')?.title)
      .toBe('Bottle washer or countertop sterilizer');
  });

  it('places individual picks under the separated item while keeping sets intact', () => {
    expect(products['amzcc-evolur-aurora-7-drawer-double-dresser'].checklistItemId).toBe('nursery-dresser');
    expect(products['amzcc-haakaa-silicone-shampoo-cradle-cap-brush'].checklistItemId).toBe('brush-comb');
    expect(products['amzcc-momcozy-nipple-cream-lanolin-free'].checklistItemId).toBe('nipple-balm');
    expect(products['amzcc-momcozy-a1pro-lactation-massager-with-heat'].checklistItemId).toBe('lactation-massager');
    expect(products['amzcc-papablic-bottle-washer-tablets-120ct'].checklistItemId).toBe('bottle-washer-detergent');
    expect(products['amzcc-momcozy-7-in-1-bottle-brush-set-with-drying-rack'].checklistItemId).toBe('bottle-brush');
    expect(Object.values(products).filter((product) => product.id === 'amzcc-grownsy-postpartum-recovery-kit')).toHaveLength(1);
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
