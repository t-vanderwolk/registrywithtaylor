/**
 * Britax US stroller car-seat compatibility matrix — transcribed cell-by-cell
 * from Britax's own "U.S. Stroller Compatibility Chart" (03.2026):
 *   https://us.britax.com  →  Compatibility Charts  →  US_Stroller_Compatibility_Chart_3.2026
 *
 * WHY THIS IS NOT A "UNIVERSAL ADAPTER" BRAND
 * Britax makes its own infant seats (Willow / Willow S / Willow SC / Cypress /
 * Arbor), so it is NOT in universalAdapters.ts. Its strollers accept a hand-
 * picked list of seat MODELS — not whole brands — and the pairings differ per
 * frame. Following the chart exactly has some notable consequences:
 *
 *   • Clek appears NOWHERE on the chart — no Britax stroller takes a Clek seat.
 *   • Chicco and Graco are absent too — only Britax, Nuna, Maxi-Cosi and CYBEX
 *     seats are ever listed.
 *   • Legacy Britax B-Safe, B-Safe Gen2 and Endeavours are explicitly NOT
 *     compatible with any of these strollers (chart footnote).
 *   • The Juniper (compact) takes NO infant car seat at all.
 *   • The Phases takes ONLY the Britax Arbor.
 *   • Which exact Maxi-Cosi / CYBEX / Nuna models fit flips between the direct-
 *     fit frames (Brook / Brook+ / Grove) and the adapter frames (Juniper+ /
 *     Prism) — e.g. Maxi-Cosi Coral XP + Mico 30 fit Brook direct, but Juniper+
 *     takes Peri 180 + Mico XP instead.
 *
 * Because Britax picks specific models (not brands) and deliberately excludes
 * Clek, these strollers are registered as DIRECT_FIT_ONLY in
 * lib/server/travelSystemCompatibility so the shared Nuna euro-group inference
 * never expands them past this list.
 *
 * Single source of truth shared by:
 *   • scripts/applyBritaxCompatibility.ts  — seeds the Compatibility rows
 *   • scripts/pruneBritaxCompatibility.ts  — removes rows the chart doesn't list
 */

/** The cross-brand adapter Britax sells for the Juniper+. */
export const BRITAX_ADAPTER_SKU = 'S15054400';
export const BRITAX_JUNIPER_PLUS_ADAPTER = `Britax Juniper+ Infant Car Seat Adapter (${BRITAX_ADAPTER_SKU})`;

/** How a compatible seat attaches. 'none' rows are omitted entirely. */
export type BritaxFit = 'direct' | 'adapter' | 'included';

export type BritaxSeat = { brand: string; model: string };

// ── Seat model lists, exactly as the chart labels them ────────────────────────
// (Canonical Title Case; matching against the catalog is case-insensitive.)
const BRITAX_SEATS = {
  willow: { brand: 'Britax', model: 'Willow' },
  willowS: { brand: 'Britax', model: 'Willow S' },
  willowSC: { brand: 'Britax', model: 'Willow SC' },
  cypress: { brand: 'Britax', model: 'Cypress' },
  arbor: { brand: 'Britax', model: 'Arbor' },
} as const;
const NUNA = {
  pipa: { brand: 'Nuna', model: 'Pipa' },
  pipaAire: { brand: 'Nuna', model: 'Pipa Aire' },
  pipaAireRx: { brand: 'Nuna', model: 'Pipa Aire RX' },
  pipaUrbn: { brand: 'Nuna', model: 'Pipa urbn' },
  pipaLite: { brand: 'Nuna', model: 'Pipa Lite' },
} as const;
const MAXICOSI = {
  peri180: { brand: 'Maxi-Cosi', model: 'Peri 180' },
  micoXp: { brand: 'Maxi-Cosi', model: 'Mico XP' },
  coralXp: { brand: 'Maxi-Cosi', model: 'Coral XP' },
  micoXpMax: { brand: 'Maxi-Cosi', model: 'Mico XP Max' },
  mico30: { brand: 'Maxi-Cosi', model: 'Mico 30' },
} as const;
const CYBEX = {
  aton2: { brand: 'Cybex', model: 'Aton 2' },
  atonG: { brand: 'Cybex', model: 'Aton G' },
  atonM: { brand: 'Cybex', model: 'Aton M' },
  cloudQ: { brand: 'Cybex', model: 'Cloud Q' },
  cloudG: { brand: 'Cybex', model: 'Cloud G' },
  cloudT: { brand: 'Cybex', model: 'Cloud T' },
} as const;

// Direct-fit frames (Brook / Brook+ / Grove) share one column of compatible
// seats — all attach with NO adapter.
const DIRECT_FIT_SEATS: BritaxSeat[] = [
  BRITAX_SEATS.willow, BRITAX_SEATS.willowS, BRITAX_SEATS.willowSC, BRITAX_SEATS.cypress,
  NUNA.pipa, NUNA.pipaAire, NUNA.pipaLite,
  MAXICOSI.coralXp, MAXICOSI.mico30,
  CYBEX.aton2, CYBEX.atonM, CYBEX.cloudQ,
];

// Juniper+ takes this set via the S15054400 adapter.
const JUNIPER_PLUS_SEATS: BritaxSeat[] = [
  BRITAX_SEATS.willow, BRITAX_SEATS.willowS, BRITAX_SEATS.willowSC, BRITAX_SEATS.cypress,
  NUNA.pipa, NUNA.pipaAire, NUNA.pipaAireRx, NUNA.pipaUrbn,
  MAXICOSI.peri180, MAXICOSI.micoXp,
  CYBEX.atonG, CYBEX.atonM, CYBEX.cloudQ, CYBEX.cloudG, CYBEX.cloudT,
];

// Prism takes this set with adapters INCLUDED in the box.
const PRISM_SEATS: BritaxSeat[] = [
  BRITAX_SEATS.willow, BRITAX_SEATS.willowS, BRITAX_SEATS.willowSC, BRITAX_SEATS.cypress,
  NUNA.pipa, NUNA.pipaAire, NUNA.pipaUrbn,
  MAXICOSI.peri180, MAXICOSI.micoXp,
  CYBEX.atonG, CYBEX.atonM, CYBEX.cloudQ, CYBEX.cloudG, CYBEX.cloudT,
];

export type BritaxStrollerRule = {
  /** Matches the catalog stroller model (see normalizeBritaxModel — keeps '+'). */
  match: RegExp;
  /** Human label for the audit log. */
  label: string;
  fit: BritaxFit;
  seats: BritaxSeat[];
};

/**
 * Ordered MOST-SPECIFIC FIRST. Critically, "Juniper+" must match before the
 * plain "Juniper" (which takes no seat at all), so the '+' is preserved by the
 * normalizer and the Juniper+ rule is listed first.
 */
export const BRITAX_ADAPTERS: BritaxStrollerRule[] = [
  // Juniper+ must match before plain "Juniper". Accept "Juniper+" and "Juniper Plus".
  { match: /juniper ?\+|juniper plus/, label: 'Juniper+', fit: 'adapter', seats: JUNIPER_PLUS_SEATS },
  { match: /prism/, label: 'Prism', fit: 'included', seats: PRISM_SEATS },
  { match: /brook|grove/, label: 'Brook / Brook+ / Grove', fit: 'direct', seats: DIRECT_FIT_SEATS },
  { match: /phases/, label: 'Phases', fit: 'direct', seats: [BRITAX_SEATS.arbor] },
  // Plain Juniper (compact) — reached only when NOT "juniper+". No infant seat.
  { match: /juniper/, label: 'Juniper', fit: 'direct', seats: [] },
];

/**
 * Normalize a stroller model for matching. Unlike the Baby Jogger normalizer we
 * KEEP '+' so "Juniper+" stays distinct from "Juniper".
 */
export function normalizeBritaxModel(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9+]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/** The chart rule covering a Britax stroller model, or null. */
export function britaxRuleForModel(model: string): BritaxStrollerRule | null {
  const m = normalizeBritaxModel(model);
  return BRITAX_ADAPTERS.find((rule) => rule.match.test(m)) ?? null;
}

/** True when this Britax stroller model is one the 03.2026 chart covers. */
export function isBritaxChartStroller(model: string): boolean {
  return britaxRuleForModel(model) !== null;
}
