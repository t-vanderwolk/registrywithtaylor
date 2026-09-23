import { describe, expect, it } from 'vitest';
import { finderSelectionFromSearch } from '@/lib/catalog/finderSelection';

const brands = ['Orbit Baby', 'Peg Perego', 'Stokke', 'UPPAbaby'];

describe('finder selection from the URL', () => {
  it('opens the brand the URL names', () => {
    expect(finderSelectionFromSearch('?brand=Orbit%20Baby', brands)).toEqual({
      brand: 'Orbit Baby',
      category: null,
      mode: 'brand',
    });
  });

  it('resolves brand spellings the catalog merges, like the server does', () => {
    expect(finderSelectionFromSearch('?brand=uppababy', brands).brand).toBe('UPPAbaby');
    expect(finderSelectionFromSearch('?brand=Babyzen', brands).brand).toBe('Stokke');
  });

  it('falls back to the brand grid for a brand that is not in the catalog', () => {
    expect(finderSelectionFromSearch('?brand=Nonesuch', brands)).toEqual({
      brand: null,
      category: null,
      mode: 'brand',
    });
  });

  it('opens a category in category mode', () => {
    expect(finderSelectionFromSearch('?category=full-size', brands)).toEqual({
      brand: null,
      category: 'full-size',
      mode: 'category',
    });
  });

  it('opens the type picker on ?view=category', () => {
    expect(finderSelectionFromSearch('?view=category', brands)).toEqual({
      brand: null,
      category: null,
      mode: 'category',
    });
  });

  it('lets a brand win over a category, exactly as the server resolves it', () => {
    expect(finderSelectionFromSearch('?brand=Stokke&category=full-size', brands)).toEqual({
      brand: 'Stokke',
      category: null,
      mode: 'brand',
    });
  });

  it('treats an empty query string as the plain finder', () => {
    expect(finderSelectionFromSearch('', brands)).toEqual({ brand: null, category: null, mode: 'brand' });
  });
});
