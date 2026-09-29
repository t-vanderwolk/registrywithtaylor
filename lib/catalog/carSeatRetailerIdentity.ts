/** Match reviewed infant-feed aliases without collapsing generations or packages. */
export function carSeatRetailerIdentity(brand: string, model: string, title?: string): string | null {
  const brandKey = brand.toLowerCase().replace(/[^a-z0-9]/g, '');
  let name = model.trim();
  // These feeds currently use a full title (including color) as their model key.
  // Restrict this repair to reviewed models; never discard arbitrary variant words.
  if (brandKey === 'nuna') {
    name = name.replace(/^(?:Nuna\s+)?(PIPA\s+(?:aire\s+rx|rx))\s+in\s+.+$/i, '$1');
  } else if (brandKey === 'uppababy') {
    name = name.replace(/^(?:UPPAbaby\s+)?(Aria\s+V2|Mesa\s+V3)\s+in\s+.+$/i, '$1');
  }
  let modelKey = name.toLowerCase().replace(/[^a-z0-9+]/g, '');
  if (brandKey === 'cybex' && modelKey === 'cloudtcomfortextend') modelKey = 'cloudt';
  // The current feed calls a Pro+ product "Mico Pro". Do not attach Pro offers
  // until that catalogue conflict is resolved. Keep + significant everywhere.
  if (brandKey === 'maxicosi' && modelKey === 'micopro' && /mico\s+pro\s*\+/i.test(title ?? '')) return null;
  return `${brandKey}|${modelKey}`;
}
