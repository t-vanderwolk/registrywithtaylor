/**
 * Derive a clean model name from a catalog stroller title — drop the brand
 * prefix, the word "Stroller" and anything after it, and a trailing
 * " in <colour>". Shared by the catalog→Stroller import and the catalog stroller
 * API so the finder's "check compatibility" CTA and the imported travel-system
 * entries land on the same brand:::model key.
 */
export function parseStrollerModel(title: string, brand: string): string {
  let m = title.trim().replace(/^["'\s]+|["'\s]+$/g, ''); // strip stray feed quoting
  if (brand && m.toLowerCase().startsWith(brand.toLowerCase())) {
    m = m.slice(brand.length);
  } else if (brand) {
    const brandPrefix = brand
      .trim()
      .split(/\s+/)
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('[-\\s]+');
    m = m.replace(new RegExp(`^${brandPrefix}\\b`, 'i'), '');
  }
  m = m.replace(/^\s*[-:–—]\s*/, '');
  m = m.replace(/^strollers?\s+/i, '');
  m = m.replace(/\s*[,(].*$/, ''); // drop colour/fabric variants
  m = m.replace(/\bstrollers?\b.*$/i, ''); // drop "Stroller…" and everything after
  m = m.replace(/\s+in\s+[^,]+$/i, ''); // drop trailing " in <colour>"
  m = m.replace(/[–—-]\s*$/g, ''); // trailing dash
  // Drop bundle / line descriptors so models read cleanly: "Fox 5 Renew Complete"
  // → "Fox 5", "Butterfly 2 Complete" → "Butterfly 2", "eGazelle S Electronic
  // Assist" → "eGazelle S".
  m = m.replace(/\b(?:electronic assist|easy fold compact|renew|complete|single[-\s]?to[-\s]?double)\b/gi, '');
  m = m.replace(/\b(?:compact|lightweight|full.?size|jogging|all.?terrain|reversible)\b/gi, '');
  m = m.replace(/\be[-\s]?gazelle\b/gi, 'e-Gazelle');
  m = m.replace(/\be[-\s]?priam\b/gi, 'e-Priam');
  return m.replace(/\s{2,}/g, ' ').trim();
}

/**
 * Car-seat variant of parseStrollerModel: collapse a catalog car-seat title to
 * just the style name so colour / fabric / year variants group into ONE card.
 *   "Clek Liing Lightweight Infant Car Seat With Load Leg - Edge Ziip" → "Liing"
 *   "Britax B-Safe Gen2 Infant Car Seat, 2022, Cobblestone"           → "B-Safe Gen2"
 *   "Nuna PIPA RX Infant Car Seat - Caviar"                            → "PIPA RX"
 */
export function parseCarSeatModel(title: string, brand: string): string {
  let m = title.trim().replace(/^["'\s]+|["'\s]+$/g, '');
  if (/^doona\+/i.test(m)) return 'Doona+';
  if (/^doona\b/i.test(m)) return 'Doona';
  if (brand && m.toLowerCase().startsWith(brand.toLowerCase())) {
    m = m.slice(brand.length);
  } else if (brand) {
    const brandPrefix = brand
      .trim()
      .split(/\s+/)
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('[-\\s]+');
    m = m.replace(new RegExp(`^${brandPrefix}\\b`, 'i'), '');
  }
  m = m.replace(/^\s*[-:–—]\s*/, '');
  m = m.trim();
  m = m.replace(/\s*\+\s.*$/i, ''); // bundled base/accessory details
  // Everything from the first product-copy descriptor onward is variant detail.
  m = m.replace(/\b(?:lightweight|baseless|rotating|swivel|reversible)\b.*$/i, '');
  m = m.replace(/\binfant\b.*$/i, ''); // "Infant Car Seat…"
  m = m.replace(/\bcar ?seat\b.*$/i, ''); // bare "Car Seat…"
  m = m.replace(/\s+(?:in|with)\s+.*$/i, ''); // " in <colour>" / " with <base>"
  m = m.replace(/\s+[–—-]\s.*$/, ''); // " - <colour>" (space-dash-space; keeps "B-Safe")
  m = m.replace(/\s*[,(].*$/, ''); // trailing ", <colour>" / "(…)"
  return m.replace(/\s{2,}/g, ' ').trim();
}
