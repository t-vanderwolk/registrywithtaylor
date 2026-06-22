/**
 * Derive a clean model name from a catalog stroller title — drop the brand
 * prefix, the word "Stroller" and anything after it, and a trailing
 * " in <colour>". Shared by the catalog→Stroller import and the catalog stroller
 * API so the finder's "check compatibility" CTA and the imported travel-system
 * entries land on the same brand:::model key.
 */
export function parseStrollerModel(title: string, brand: string): string {
  let m = title.trim().replace(/^["'\s]+|["'\s]+$/g, ''); // strip stray feed quoting
  if (brand && m.toLowerCase().startsWith(brand.toLowerCase())) m = m.slice(brand.length);
  m = m.replace(/\bstrollers?\b.*$/i, ''); // drop "Stroller…" and everything after
  m = m.replace(/\s+in\s+[^,]+$/i, ''); // drop trailing " in <colour>"
  m = m.replace(/[–—-]\s*$/g, ''); // trailing dash
  return m.replace(/\s{2,}/g, ' ').trim();
}
