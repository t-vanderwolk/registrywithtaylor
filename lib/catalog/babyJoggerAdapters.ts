/**
 * Baby Jogger car-seat adapter matrix — transcribed from the manufacturer's own
 * adapter catalogue:
 *   https://www.babyjogger.com/accessories/car-seat-adapters/  (14 adapters)
 *
 * WHY THIS IS NOT A "UNIVERSAL ADAPTER" BRAND
 * Baby Jogger makes its own infant seat (City GO 2) and sells a DIFFERENT
 * adapter per stroller + seat-brand combination. There is no single shared
 * click-and-go adapter covering the Nuna / Maxi-Cosi / CYBEX / Clek group, so
 * the universal-adapter inference does not apply. Every pairing below is
 * explicitly listed by Baby Jogger; anything not listed is deliberately absent.
 *
 * Notable consequences of following the manufacturer exactly:
 *   • Clek appears NOWHERE in Baby Jogger's range — no Clek adapter is sold.
 *   • Nuna is only offered for the City Mini Air and City Mini GT3.
 *   • The City Prix has NO car-seat adapter listed at all.
 *   • Britax is offered for the City Select 2 only.
 */

export type BabyJoggerAdapterRule = {
  /** Matches the catalog stroller model (already lowercased + de-punctuated). */
  match: RegExp;
  /** Models to exclude even when `match` hits — usually the double variants. */
  exclude?: RegExp;
  /** Infant-seat brands Baby Jogger explicitly supports for this frame. */
  seatBrands: string[];
  /** The adapter product(s) backing this pairing, for the audit report. */
  source: string;
};

/**
 * Ordered most-specific first: double frames must match before their single
 * counterparts, since "city mini gt2 double" also contains "city mini gt2".
 */
export const BABY_JOGGER_ADAPTERS: BabyJoggerAdapterRule[] = [
  {
    // Summit X3 Double → Graco only.
    match: /summit x3 double/,
    seatBrands: ['Graco'],
    source: 'Summit X3 Double + Graco',
  },
  {
    // City Mini 2 Double / GT2 Double → Graco, plus Maxi-Cosi / CYBEX (the
    // adapter also lists BeSafe, which is not sold in the US catalog).
    match: /city mini (2|gt2) double/,
    seatBrands: ['Graco', 'Maxi-Cosi', 'Cybex'],
    source: 'City Mini 2 Double & GT2 Double + Graco / Maxi-Cosi, BeSafe & Cybex',
  },
  {
    // Older "City Mini Double" shares the City Mini 2 Double adapters.
    match: /city mini double/,
    seatBrands: ['Graco', 'Maxi-Cosi', 'Cybex'],
    source: 'City Mini 2 Double & GT2 Double + Graco / Maxi-Cosi, BeSafe & Cybex',
  },
  {
    // City Select / 2 / LUX → Graco, Chicco + Peg Perego, Maxi-Cosi + CYBEX,
    // and Britax (Britax adapter is listed for the City Select 2).
    match: /city select/,
    seatBrands: ['Graco', 'Chicco', 'Peg Perego', 'Maxi-Cosi', 'Cybex', 'Britax'],
    source: 'City Select/2/LUX + Graco / Chicco+Peg Perego / Maxi-Cosi+Cybex / Britax (Select 2)',
  },
  {
    // City Sights → Graco and Chicco.
    match: /city sights/,
    seatBrands: ['Graco', 'Chicco'],
    source: 'City Sights + Graco / Chicco',
  },
  {
    // City Mini GT3 (incl. All-Terrain / Single) → Nuna only.
    match: /city mini gt3/,
    seatBrands: ['Nuna'],
    source: 'City Mini GT3 + Nuna',
  },
  {
    // City Mini Air → Nuna only.
    match: /city mini air/,
    seatBrands: ['Nuna'],
    source: 'City Mini Air + Nuna',
  },
  {
    // City Mini 2 / GT2 singles → Chicco KeyFit only. Baby Jogger does not sell
    // a Graco or euro-group adapter for the SINGLE City Mini frames.
    match: /city mini (2|gt2)/,
    exclude: /double/,
    seatBrands: ['Chicco'],
    source: 'City Mini 2, GT2 & City Elite 2 + Chicco KeyFit',
  },
  {
    // City Tour 2 single → Graco only. No adapter is listed for the Double.
    match: /city tour 2/,
    exclude: /double/,
    seatBrands: ['Graco'],
    source: 'City Tour 2 Single + Graco',
  },
  {
    // Summit X3 singles → Graco only.
    match: /summit x3/,
    exclude: /double/,
    seatBrands: ['Graco'],
    source: 'Summit X3 + Graco',
  },
];

/**
 * Frames Baby Jogger lists NO car-seat adapter for. Kept explicit so the
 * absence is a documented decision rather than an oversight.
 */
export const BABY_JOGGER_NO_ADAPTER: Array<{ match: RegExp; note: string }> = [
  {
    match: /city prix/,
    note: 'No car-seat adapter appears in Baby Jogger’s adapter catalogue for the City Prix.',
  },
  {
    match: /city tour 2 double/,
    note: 'Baby Jogger lists a City Tour 2 SINGLE adapter only — none for the Double.',
  },
];

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

/** Seat brands Baby Jogger explicitly supports for a stroller model, or []. */
export function babyJoggerSeatBrands(model: string): { seatBrands: string[]; source: string | null } {
  const m = normalize(model);
  const hit = BABY_JOGGER_ADAPTERS.find((rule) => rule.match.test(m) && !(rule.exclude?.test(m) ?? false));
  return hit ? { seatBrands: hit.seatBrands, source: hit.source } : { seatBrands: [], source: null };
}

/** Documented reason a frame has no adapter, if it is a known no-adapter model. */
export function babyJoggerNoAdapterNote(model: string): string | null {
  const m = normalize(model);
  return BABY_JOGGER_NO_ADAPTER.find((entry) => entry.match.test(m))?.note ?? null;
}
