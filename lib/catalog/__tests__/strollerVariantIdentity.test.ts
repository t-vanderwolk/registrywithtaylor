import { describe, expect, it } from 'vitest';
import {
  normalizeStrollerVariantModel,
  strollerPublicDisplayModel,
} from '@/lib/catalog/strollerVariantIdentity';

describe('Veer stroller variants', () => {
  it('keeps the 2-seat and 4-seat Cruiser models distinct', () => {
    expect(normalizeStrollerVariantModel('Cruiser (2 Seater)', 'Veer')).toBe('cruiser');
    expect(normalizeStrollerVariantModel('Cruiser XL (4 Seater)', 'Veer')).toBe('cruiser xl');
    expect(normalizeStrollerVariantModel('Cruiser City (2 Seater)', 'Veer')).toBe('cruiser city');
    expect(normalizeStrollerVariantModel('Cruiser City XL (4 Seater)', 'Veer')).toBe('cruiser city xl');
  });

  it('adds seat capacity to Veer public labels only', () => {
    expect(strollerPublicDisplayModel('Cruiser', 'Veer')).toBe('Cruiser (2 Seater)');
    expect(strollerPublicDisplayModel('Cruiser XL', 'Veer')).toBe('Cruiser XL (4 Seater)');
    expect(strollerPublicDisplayModel('Cruiser City', 'Veer')).toBe('Cruiser City (2 Seater)');
    expect(strollerPublicDisplayModel('Cruiser City XL', 'Veer')).toBe('Cruiser City XL (4 Seater)');
    expect(strollerPublicDisplayModel('Vista V3', 'UPPAbaby')).toBe('Vista V3');
  });
});
