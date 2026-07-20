import type { StrollerCategory } from '@/lib/guides/travelSystemCompatibility';

/**
 * Curated Compare-tool attributes that aren't in the product feed:
 *   • modular          — accepts a bassinet and/or reverses / adds a second seat
 *   • fitsOverheadBin  — folds small enough for an airplane carry-on / overhead bin
 *   • basketCapacity   — qualitative storage size (Small / Medium / Large)
 *
 * (The fourth new row, "travel system compatible", is derived live from the real
 * compatibility data, not curated here.)
 *
 * Every stroller resolves to a value — an explicit override when we know the model,
 * otherwise a sensible default from its finder category — so no Compare cell is
 * ever blank. Overrides are matched by canonical brand + a model regex.
 */

export type BasketSize = 'Small' | 'Medium' | 'Large';

export type CompareAttributes = {
  modular: boolean;
  fitsOverheadBin: boolean;
  basketCapacity: BasketSize;
};

const norm = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

type Override = {
  brand: string;
  match: RegExp;
  modular?: boolean;
  fitsOverheadBin?: boolean;
  basketCapacity?: BasketSize;
};

const OVERRIDES: Override[] = [
  // ── Airline carry-on / overhead-bin travel strollers ──────────────────────
  // The YOYO moved from Babyzen to Stokke — keep the Stokke rule ABOVE Stokke's
  // modular pram rule so the YOYO doesn't get treated as an Xplory.
  { brand: 'Stokke', match: /yoyo/, modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },
  { brand: 'gb', match: /pockit/, modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },
  { brand: 'Joolz', match: /\baer\b/, modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },
  // The TRVL is NOT carry-on: Nuna states its folded size does not meet the
  // IATA cabin standard, so it's a gate-check stroller despite the name.
  { brand: 'Nuna', match: /trvl/, modular: false, fitsOverheadBin: false, basketCapacity: 'Small' },
  { brand: 'Cybex', match: /libelle/, modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },
  { brand: 'Cybex', match: /(eezy|orfeo|beezy)/, modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },
  { brand: 'Bugaboo', match: /butterfly/, modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },
  { brand: 'Silver Cross', match: /\bjet\b/, modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },
  { brand: 'Mountain Buggy', match: /nano/, modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },
  { brand: 'Ergobaby', match: /metro/, modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },
  { brand: 'UPPAbaby', match: /minu/, modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },
  { brand: 'Zoe', match: /(tour|traveler|deux|twin|xl)/, modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },
  { brand: 'Colugo', match: /compact/, modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },
  { brand: 'Inglesina', match: /quid/, modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },
  { brand: 'Maxi-Cosi', match: /lara/, modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },
  { brand: 'Summer Infant', match: /3dlite/, modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },

  // ── Modular flagships (bassinet + reversible / second-seat) ────────────────
  { brand: 'UPPAbaby', match: /vista/, modular: true, fitsOverheadBin: false, basketCapacity: 'Large' },
  { brand: 'UPPAbaby', match: /cruz/, modular: true, fitsOverheadBin: false, basketCapacity: 'Large' },
  { brand: 'Mockingbird', match: /./, modular: true, fitsOverheadBin: false, basketCapacity: 'Large' },
  { brand: 'Nuna', match: /(mixx|demi)/, modular: true, fitsOverheadBin: false, basketCapacity: 'Large' },
  { brand: 'Bugaboo', match: /(fox|donkey|lynx|dragonfly|cameleon)/, modular: true, fitsOverheadBin: false, basketCapacity: 'Large' },
  { brand: 'Cybex', match: /(priam|balios|gazelle|e-priam|eos)/, modular: true, fitsOverheadBin: false, basketCapacity: 'Large' },
  { brand: 'Silver Cross', match: /(wave|reef|dune|comet)/, modular: true, fitsOverheadBin: false, basketCapacity: 'Large' },
  { brand: 'Joolz', match: /(geo|day|hub)/, modular: true, fitsOverheadBin: false, basketCapacity: 'Large' },
  { brand: 'Peg Perego', match: /(ypsi|veloce|book)/, modular: true, fitsOverheadBin: false, basketCapacity: 'Medium' },
  { brand: 'Thule', match: /(sleek|shine)/, modular: true, fitsOverheadBin: false, basketCapacity: 'Large' },
  { brand: 'Stokke', match: /(xplory|trailz|beat)/, modular: true, fitsOverheadBin: false, basketCapacity: 'Medium' },
  { brand: 'Baby Jogger', match: /city select/, modular: true, fitsOverheadBin: false, basketCapacity: 'Large' },
  { brand: 'Redsbaby', match: /(nuvo|skip)/, modular: true, fitsOverheadBin: false, basketCapacity: 'Large' },
  { brand: 'Mima', match: /(xari|creo)/, modular: true, fitsOverheadBin: false, basketCapacity: 'Small' },
  { brand: 'Uppababy', match: /ridge/, modular: false, fitsOverheadBin: false, basketCapacity: 'Large' },

  // ── All-terrain / jogging (large basket, not modular, not overhead) ────────
  { brand: 'Thule', match: /(urban glide|spring)/, modular: false, fitsOverheadBin: false, basketCapacity: 'Large' },
  { brand: 'BOB', match: /./, modular: false, fitsOverheadBin: false, basketCapacity: 'Large' },
  { brand: 'Baby Jogger', match: /city mini/, modular: false, fitsOverheadBin: false, basketCapacity: 'Medium' },
];

const CATEGORY_DEFAULTS: Record<StrollerCategory, CompareAttributes> = {
  'full-size': { modular: true, fitsOverheadBin: false, basketCapacity: 'Large' },
  'full-size-non-modular': { modular: false, fitsOverheadBin: false, basketCapacity: 'Large' },
  'compact': { modular: false, fitsOverheadBin: false, basketCapacity: 'Medium' },
  'travel': { modular: false, fitsOverheadBin: true, basketCapacity: 'Small' },
  'convertible-modular': { modular: true, fitsOverheadBin: false, basketCapacity: 'Large' },
  'convertible-non-modular': { modular: false, fitsOverheadBin: false, basketCapacity: 'Large' },
  'double': { modular: false, fitsOverheadBin: false, basketCapacity: 'Large' },
  'double-travel': { modular: false, fitsOverheadBin: false, basketCapacity: 'Medium' },
  'double-jogging': { modular: false, fitsOverheadBin: false, basketCapacity: 'Large' },
  'jogging': { modular: false, fitsOverheadBin: false, basketCapacity: 'Large' },
  'wagon': { modular: false, fitsOverheadBin: false, basketCapacity: 'Large' },
  'umbrella': { modular: false, fitsOverheadBin: false, basketCapacity: 'Small' },
};

const FALLBACK: CompareAttributes = { modular: false, fitsOverheadBin: false, basketCapacity: 'Medium' };

export function resolveCompareAttributes(
  brand: string,
  model: string,
  category: string | null,
): CompareAttributes {
  const base = (category && CATEGORY_DEFAULTS[category as StrollerCategory]) || FALLBACK;
  const nb = norm(brand);
  const nm = norm(model);
  const override = OVERRIDES.find((entry) => norm(entry.brand) === nb && entry.match.test(nm));
  return {
    modular: override?.modular ?? base.modular,
    fitsOverheadBin: override?.fitsOverheadBin ?? base.fitsOverheadBin,
    basketCapacity: override?.basketCapacity ?? base.basketCapacity,
  };
}
