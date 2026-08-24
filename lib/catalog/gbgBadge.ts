/**
 * GoodBuy Gear badge overrides — shared key + apply logic.
 *
 * The funnel tools (stroller finder, quiz, travel-system, checklist) and blog
 * product cards show an "Open Box … at GoodBuy Gear" badge automatically when a
 * matching open-box offer exists in the catalog. `GbgBadgeOverride` rows let the
 * admin force a badge on or off per product card; this module defines the single
 * key namespace those overrides live in and the tiny function that applies them.
 */

export type GbgBadgeState = 'auto' | 'on' | 'off';

function normPart(value: string | null | undefined): string {
  return (value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Canonical key for a product card's GBG badge override. `name` is the model
 * (strollers/car seats) or product name (blog/checklist). Callers must pass the
 * same brand+name they display so the override matches consistently.
 */
export function gbgBadgeKey(brand: string, name: string): string {
  return `${normPart(brand)}:::${normPart(name)}`;
}

/**
 * Decide whether the badge should render, given whether an open-box offer was
 * matched and the admin's override state (undefined = 'auto').
 *   off  → never render
 *   on   → render whenever an offer exists (falls back to hasMatch if no offer)
 *   auto → render iff a match exists (default)
 */
export function applyGbgBadge(
  hasMatch: boolean,
  state: GbgBadgeState | undefined,
): boolean {
  if (state === 'off') return false;
  if (state === 'on') return true;
  return hasMatch;
}
