/**
 * Romer stroller car-seat compatibility — transcribed from Romer's own
 * "Stroller Compatibility" chart (romerbaby.com).
 *
 * Romer makes its own infant seats (Juni, Sera), so it is NOT a universal-
 * adapter brand. Both current strollers — the Tura and the Lani — share ONE
 * compatibility list:
 *
 *   • Romer   → Juni, Sera            (same-brand, direct fit)
 *   • Nuna    → Pipa Series           (the whole Pipa family)
 *   • Cybex   → Aton 2, Aton M, Cloud Q, Cloud T, Cloud G
 *   • Britax  → Willow, Willow S, Willow SC, Cypress
 *   • BOB Gear→ Champ
 *
 * Deliberately absent: Maxi-Cosi, Clek, Chicco and Graco are NOT on Romer's
 * chart. Because the list mixes euro-group brands (Nuna/Cybex) with non-euro
 * brands (Britax/BOB) but excludes Maxi-Cosi/Clek, these frames are registered
 * DIRECT_FIT_ONLY in lib/server/travelSystemCompatibility so the shared Nuna
 * euro-group inference never expands them past this list.
 *
 * The chart does not state which pairings need an adapter, so we default to:
 *   own-brand Romer seats = direct fit; every other brand = adapter-required
 *   (Romer sells a car seat adapter). Flip a rule's `fit` if Romer documents
 *   otherwise.
 *
 * Single source of truth shared by:
 *   • scripts/applyRomerCompatibility.ts  — seeds the Compatibility rows
 *   • scripts/pruneRomerCompatibility.ts  — removes rows the chart doesn't list
 */

export const ROMER_ADAPTER = 'Romer infant car seat adapter';

/** Exact seat, or a whole family matched by a pattern against the model. */
export type RomerSeatRule =
  | { kind: 'exact'; brand: string; model: string }
  | { kind: 'family'; brand: string; pattern: RegExp; label: string };

/** How the seat attaches. Own-brand Romer seats are direct; others adapter. */
export type RomerFit = 'direct' | 'adapter';

export type RomerSeatGroup = { fit: RomerFit; seats: RomerSeatRule[] };

// Both Tura and Lani accept the same seats.
const ROMER_COMPATIBLE: RomerSeatGroup[] = [
  {
    fit: 'direct',
    seats: [
      { kind: 'exact', brand: 'Romer', model: 'Juni' },
      { kind: 'exact', brand: 'Romer', model: 'Sera' },
    ],
  },
  {
    fit: 'adapter',
    seats: [
      // "Pipa Series" — every Nuna Pipa infant seat.
      { kind: 'family', brand: 'Nuna', pattern: /pipa/i, label: 'Nuna Pipa Series' },
      { kind: 'exact', brand: 'Cybex', model: 'Aton 2' },
      { kind: 'exact', brand: 'Cybex', model: 'Aton M' },
      { kind: 'exact', brand: 'Cybex', model: 'Cloud Q' },
      { kind: 'exact', brand: 'Cybex', model: 'Cloud T' },
      { kind: 'exact', brand: 'Cybex', model: 'Cloud G' },
      { kind: 'exact', brand: 'Britax', model: 'Willow' },
      { kind: 'exact', brand: 'Britax', model: 'Willow S' },
      { kind: 'exact', brand: 'Britax', model: 'Willow SC' },
      // Chart says "Cypress"; the catalog carries it as "Cypress S" (same seat).
      { kind: 'exact', brand: 'Britax', model: 'Cypress S' },
      { kind: 'exact', brand: 'BOB Gear', model: 'Champ' },
    ],
  },
];

export type RomerStrollerRule = { match: RegExp; label: string; groups: RomerSeatGroup[] };

export const ROMER_ADAPTERS: RomerStrollerRule[] = [
  { match: /\btura\b/, label: 'Tura', groups: ROMER_COMPATIBLE },
  { match: /\blani\b/, label: 'Lani', groups: ROMER_COMPATIBLE },
];

export function normalizeRomerModel(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9+]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/** The chart rule covering a Romer stroller model, or null. */
export function romerRuleForModel(model: string): RomerStrollerRule | null {
  const m = normalizeRomerModel(model);
  return ROMER_ADAPTERS.find((rule) => rule.match.test(m)) ?? null;
}

export function isRomerChartStroller(model: string): boolean {
  return romerRuleForModel(model) !== null;
}
