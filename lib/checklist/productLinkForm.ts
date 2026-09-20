import { isHttpUrl, retailerUrlKey } from '@/lib/retailerLinks';
import { AFFILIATE_LINK_NEEDED } from '@/lib/checklist/products';
import { MAX_PRODUCT_LINKS } from '@/lib/checklist/productLinks';

export function checklistProductLinkError(form: FormData): string | null {
  const fields = ['affiliateUrl', 'amazonUrl', 'secondaryUrl', 'extraUrl1', 'extraUrl2', 'extraUrl3'];
  const seen = new Set<string>();
  for (const name of fields) {
    const value = String(form.get(name) ?? '').trim();
    if (!value || value === AFFILIATE_LINK_NEEDED) continue;
    if (!isHttpUrl(value)) return 'Enter a complete http:// or https:// shopping link.';
    seen.add(retailerUrlKey(value));
  }
  return seen.size > MAX_PRODUCT_LINKS
    ? `This product has ${seen.size} shopping links. Choose up to ${MAX_PRODUCT_LINKS} before saving; your existing links have not been changed.`
    : null;
}
