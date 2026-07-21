/**
 * Universal ("click-and-go") car-seat adapter families.
 *
 * These are strollers whose BRAND makes no infant car seat of its own but which
 * accept the shared Maxi-Cosi / Nuna / CYBEX / Clek adapter standard. Their
 * adapter products deliberately name no seat brand — "Joolz Hub2 car seat
 * adapter set" fits the whole shared group — so any check that expects a seat
 * brand in the title will flag them as ambiguous even though they are fully
 * handled.
 *
 * Single source of truth shared by:
 *   • scripts/applyUniversalAdapterCompatibility.ts — seeds the Compatibility rows
 *   • app/admin/catalog/health — so covered adapters aren't reported as broken
 */

export type UniversalAdapterRule = {
  brand: string;
  /** Match against "<model> <displayName>". null = every model of this brand. */
  model: RegExp | null;
  family: string;
  /**
   * Extra infant-seat brands this stroller's adapter supports beyond the shared
   * Nuna / CYBEX / Clek / Maxi-Cosi group.
   *
   * Britax is NOT part of the shared group (see SHARED_ADAPTER_EXPANSION_BRANDS
   * in lib/server/travelSystemCompatibility). It may only be listed here when
   * the stroller's MANUFACTURER specifically states Britax compatibility —
   * never as a general euro-group assumption.
   */
  extraSeatBrands?: string[];
  /** Models to exclude even when `model` matches (e.g. a direct-fit-only frame). */
  excludeModel?: RegExp;
};

// Strollers whose brand makes no infant seat but accepts the shared
// Maxi-Cosi / Nuna / CYBEX / Clek click-and-go adapter (sold separately).
export const UNIVERSAL_ADAPTER_RULES: UniversalAdapterRule[] = [
  // Bugaboo Donkey / Dragonfly / Butterfly take Maxi-Cosi / Nuna / CYBEX / Clek
  // via the Bugaboo car seat adapter (sold separately).
  { brand: 'Bugaboo', model: /\b(donkey|dragonfly|butterfly|fox)\b/i, family: 'Donkey / Dragonfly / Butterfly / Fox' },
  // Joolz Dot / Geo / Hub take Maxi-Cosi / Nuna / CYBEX / Clek via the Joolz car
  // seat adapter (the Hub2 uses the Joolz Hub2 adapter set). \bhub\d*\b matches the
  // "Hub2" model string.
  { brand: 'Joolz', model: /\b(dot|geo)\b|\bhub\d*\b/i, family: 'Dot / Geo / Hub' },
  { brand: 'Mima', model: /\b(miro|xari|zigi|creo)\b/i, family: 'Miro / Xari / Zigi / Creo' },
  // Zoe frames all take the shared euro group (Nuna / Maxi-Cosi / CYBEX / Clek)
  // via Zoe's Nuna/euro car seat adapters.
  { brand: 'Zoe', model: null, family: 'all Zoe strollers' },
  // Tour / Twin / Trio / Tribe additionally take Graco + Chicco (Graco/Chicco
  // adapter) and UPPAbaby Mesa/Aria (UPPAbaby adapter).
  { brand: 'Zoe', model: /\b(tour|twin|trio|tribe)\b/i, family: 'Tour / Twin / Trio / Tribe', extraSeatBrands: ['UPPAbaby', 'Graco', 'Chicco'] },
  // The Journey additionally takes Chicco via the Journey Chicco adapter.
  { brand: 'Zoe', model: /\bjourney\b/i, family: 'The Journey', extraSeatBrands: ['Chicco'] },
  { brand: 'Ergobaby', model: /\bmetro\b/i, family: 'Metro / Metro+' },
  // Mompush Ultimate / Meteor / Velo take a Maxi-Cosi / Nuna / CYBEX car seat
  // adapter; Wiz adds a separate Chicco adapter. (Lithe has an integrated,
  // non-removable seat — it cannot take a car seat, so it stays out.)
  { brand: 'Mompush', model: /\b(ultimate|meteor|velo)\b/i, family: 'Ultimate / Meteor / Velo' },
  { brand: 'Mompush', model: /\bwiz\b/i, family: 'Wiz', extraSeatBrands: ['Chicco'] },
  { brand: 'Mercedes', model: null, family: 'Mercedes-Benz (Hartan)' },
  // Peg Perego City Loop takes Peg Perego seats directly (same-brand default) AND
  // other-brand infant seats via its Foldable Car Seat Adapter — so it also earns
  // the shared Nuna / Maxi-Cosi / CYBEX / Clek expansion on top of its own seats.
  { brand: 'Peg Perego', model: /\bcity loop\b/i, family: 'City Loop' },
  // Orbit Baby strollers take the Orbit Baby seat (same-brand default) AND other
  // brands via the universal Orbit Baby car seat adapter — same expansion.
  { brand: 'Orbit Baby', model: null, family: 'all Orbit Baby strollers' },
  // Thule joggers take Nuna / Maxi-Cosi / CYBEX (+ Chicco) via the Urban Glide /
  // Spring / Sleek universal car seat adapter. Chariot (sling, not a car seat) is
  // excluded by matching only the glide / spring / sleek frames.
  { brand: 'Thule', model: /\b(glide|spring|sleek|shine)\b/i, family: 'Urban Glide / Glide / Spring / Sleek / Shine' },
  // UPPAbaby Vista / Cruz / Minu / Ridge take UPPAbaby Mesa (same-brand default),
  // Nuna / Maxi-Cosi / CYBEX / Clek via the UPPAbaby adapter, AND Chicco KeyFit via
  // the separate UPPAbaby Chicco adapter.
  { brand: 'UPPAbaby', model: /\b(ridge|vista|cruz|minu)\b/i, family: 'Vista / Cruz / Minu / Ridge', extraSeatBrands: ['Chicco'] },
  // BOB joggers take Britax / Nuna / CYBEX / Maxi-Cosi via the BOB universal infant
  // car seat adapter (Wayfinder / Revolution / Alterrain).
  { brand: 'BOB', model: /\b(wayfinder|revolution|alterrain)\b/i, family: 'Wayfinder / Revolution / Alterrain' },
  // Silver Cross modular + travel frames take Nuna / Maxi-Cosi / CYBEX / Clek via
  // their car seat adapter (on top of the same-brand Silver Cross Dream seat).
  // The Clic is EXCLUDED — it direct-fits Nuna + Joie only, no adapter (handled
  // by scripts/fixSilverCrossClic.ts).
  { brand: 'Silver Cross', model: null, family: 'all Silver Cross frames', excludeModel: /\bclic\b/i },
  // Guava Roam takes Nuna / Maxi-Cosi / CYBEX (+ Chicco / Graco / Britax) via the
  // Roam car seat adapter.
  { brand: 'Guava Family', model: /\broam\b/i, family: 'Roam' },
  // Older Baby Jogger frames not already covered take Maxi-Cosi / CYBEX / Nuna via
  // the Baby Jogger car seat adapter (Graco City GO is handled separately).
  { brand: 'Baby Jogger', model: /\b(city prix|city mini air)\b/i, family: 'City Prix / City Mini Air' },
  // WonderFold W & L Series wagons take a 360° car seat adapter: shared Nuna /
  // CYBEX / Clek / Maxi-Cosi group PLUS Graco / Chicco / UPPAbaby Mesa.
  // (Brand match is startsWith, so this also covers the "WonderFold Wagon" rows.)
  { brand: 'WonderFold', model: null, family: 'W & L Series', extraSeatBrands: ['Graco', 'Chicco', 'UPPAbaby'] },
  // Veer Switchback (&Roll / &Jog) takes Maxi-Cosi / Nuna / Clek / CYBEX (shared
  // euro group) PLUS UPPAbaby / Graco / Britax via the brand-specific Switchback
  // infant car seat adapters.
  { brand: 'Veer', model: /\bswitch\b/i, family: 'Switchback (&Roll / &Jog)', extraSeatBrands: ['UPPAbaby', 'Graco', 'Britax'] },
  // Veer Cruiser / Cruiser City / All-Terrain wagons take Maxi-Cosi / Nuna / CYBEX
  // (shared euro group) via the Cruiser infant car seat adapter, PLUS UPPAbaby via
  // the Cruiser UPPAbaby adapter. Toddler comfort-seat / nap-system accessories are
  // excluded (they aren't the wagon frame that takes an infant seat).
  { brand: 'Veer', model: /\bcruiser\b/i, family: 'Cruiser / Cruiser City / All-Terrain', extraSeatBrands: ['UPPAbaby'], excludeModel: /(comfort seat|nap system)/i },
  // Bumbleride Era / Indie / Speed (and the Indie Twin double) take Nuna / Maxi-Cosi
  // / CYBEX / Clek via the Bumbleride car seat adapter; the single frames also take
  // Graco / Chicco via the Bumbleride Single (Graco / Chicco) adapter.
  { brand: 'Bumbleride', model: /\b(era|indie|speed)\b/i, family: 'Era / Indie / Speed / Indie Twin', extraSeatBrands: ['Graco', 'Chicco'] },
  // Bombi Bēbee (V3 + Twin V2) makes no infant seat of its own. Its Universal Car
  // Seat Adapter Straps wrap around the seat base, so they fit essentially every
  // major infant car seat: the shared Nuna / Maxi-Cosi / CYBEX / Clek euro group
  // (via the Nuna trigger) PLUS Graco / Chicco / UPPAbaby / Britax.
  { brand: 'Bombi', model: null, family: 'Bēbee (V3 / Twin V2)', extraSeatBrands: ['Graco', 'Chicco', 'UPPAbaby', 'Britax'] },
  // Babyzen / Stokke YOYO takes Maxi-Cosi / Nuna / CYBEX via the YOYO car seat
  // adapter (shared euro group). Scoped to the YOYO model so Stokke's own
  // Xplory / Trailz frames (different, seat-specific adapters) stay out.
  { brand: 'Babyzen', model: /\byoyo\b/i, family: 'YOYO' },
  { brand: 'Stokke', model: /\byoyo\b/i, family: 'YOYO' },
  // Momcozy ChangeGo (the "23-in-1" double stroller) takes Maxi-Cosi / Nuna /
  // CYBEX via its ChangeGo car seat adapter. (ClickGo is a compact lightweight
  // travel stroller with no car seat — it stays out.)
  { brand: 'Momcozy', model: /\bchangego\b/i, family: 'ChangeGo' },
  // Larktale Caravan (Coupe / Quad stroller-wagons) takes Maxi-Cosi / Nuna / Clek
  // via the Caravan car seat adapter, plus a separate Chicco adapter.
  { brand: 'Larktale', model: /\bcaravan\b/i, family: 'Caravan', extraSeatBrands: ['Chicco'] },
  // Mockingbird makes no car seat of its own. The Single / Single-to-Double take
  // the shared Nuna / Maxi-Cosi / CYBEX / Clek group via the Mockingbird
  // Car Seat Adapter, PLUS Graco / Chicco / Baby Jogger / UPPAbaby via the other
  // Mockingbird adapter variants and Joie via the Joie ICS adapter.
  { brand: 'Mockingbird', model: null, family: 'Single / Single-to-Double', extraSeatBrands: ['Graco', 'Chicco', 'Baby Jogger', 'UPPAbaby', 'Joie'] },
  // Inglesina Quid³ takes the Quid³ Car Seat Adapter, which Inglesina lists for
  // Nuna (Pipa Aire / Rx / urbn), Maxi-Cosi (Peri 180, Mico Pro / Luxe), CYBEX
  // (Cloud G / G Lux / T / Q, Aton G) and Clek (Liing / Liingo) only — Chicco is
  // explicitly NOT compatible, so no extraSeatBrands. Inglesina's own Darwin
  // infant seat isn't sold in the US, so the frame has no same-brand seat.
  // No trailing \b: the model is stored as "Quid³", and a superscript is a
  // non-word char (boundary matches) while a normalized "Quid3" is not (it
  // wouldn't). Leaving the boundary off matches Quid, Quid³ and Quid3 alike.
  { brand: 'Inglesina', model: /\bquid/i, family: 'Quid³' },
  // DFY R1 takes the R1 Car Seat Adapters. DFY's tested list is the same shared
  // euro group: Maxi-Cosi (Mico Luxe), CYBEX (Aton G, Cloud Q / G / T), Nuna
  // (Pipa Rx, Pipa Aire Rx) and Clek (Liing). No extra brands.
  { brand: 'DFY', model: /\br1\b/i, family: 'R1' },
];

/** True when a stroller row is covered by a universal-adapter family. */
export function matchesUniversalRule(
  rule: UniversalAdapterRule,
  stroller: { brand: string; model: string; displayName?: string | null },
): boolean {
  // Brand match is startsWith so the WonderFold rule also covers "WonderFold Wagon".
  if (!stroller.brand.toLowerCase().startsWith(rule.brand.toLowerCase())) return false;
  const haystack = `${stroller.model} ${stroller.displayName ?? ''}`;
  if (rule.excludeModel && rule.excludeModel.test(haystack)) return false;
  if (rule.model === null) return true;
  return rule.model.test(haystack);
}

/** The family covering this stroller, or null. */
export function universalAdapterFamily(
  stroller: { brand: string; model: string; displayName?: string | null },
): string | null {
  const hit = UNIVERSAL_ADAPTER_RULES.find((rule) => matchesUniversalRule(rule, stroller));
  return hit ? hit.family : null;
}

/**
 * True when an adapter PRODUCT title belongs to a universal-adapter brand.
 * Used by the health report: these titles legitimately name no seat brand.
 */
export function isUniversalAdapterBrand(brand: string | null | undefined): boolean {
  if (!brand) return false;
  const b = brand.toLowerCase();
  return UNIVERSAL_ADAPTER_RULES.some((rule) => b.startsWith(rule.brand.toLowerCase()));
}
