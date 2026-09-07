import { describe, expect, it } from 'vitest';
import { adapterTitleMatchesStrollerModel } from '@/lib/catalog/adapterModelMatching';

describe('Veer adapter capacity matching', () => {
  const twoSeatAdapter = 'Veer Cruiser Infant Car Seat Adapter - Chicco';
  const fourSeatAdapter = 'Veer Cruiser XL Infant Car Seat Adapter - Chicco';

  it('shares adapters between Cruiser and Cruiser City of the same capacity', () => {
    expect(adapterTitleMatchesStrollerModel(twoSeatAdapter, 'Cruiser', 'Veer').matched).toBe(true);
    expect(adapterTitleMatchesStrollerModel(twoSeatAdapter, 'Cruiser City', 'Veer').matched).toBe(true);
    expect(adapterTitleMatchesStrollerModel(fourSeatAdapter, 'Cruiser XL', 'Veer').matched).toBe(true);
    expect(adapterTitleMatchesStrollerModel(fourSeatAdapter, 'Cruiser City XL', 'Veer').matched).toBe(true);
  });

  it('does not cross-match 2-seat and XL 4-seat adapters', () => {
    expect(adapterTitleMatchesStrollerModel(twoSeatAdapter, 'Cruiser XL', 'Veer').matched).toBe(false);
    expect(adapterTitleMatchesStrollerModel(twoSeatAdapter, 'Cruiser City XL', 'Veer').matched).toBe(false);
    expect(adapterTitleMatchesStrollerModel(fourSeatAdapter, 'Cruiser', 'Veer').matched).toBe(false);
    expect(adapterTitleMatchesStrollerModel(fourSeatAdapter, 'Cruiser City', 'Veer').matched).toBe(false);
  });
});
