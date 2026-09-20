import { isHttpUrl, parseRetailerLinks, retailerUrlKey, type RetailerLink } from '@/lib/retailerLinks';

export const RETAILER_FIELDS = ['affiliateUrl', 'amazonUrl', 'secondaryUrl', 'extraUrl1', 'extraUrl2', 'extraUrl3'] as const;
type ProductLinks = { affiliateUrl?: string | null; amazonUrl?: string | null; secondaryUrl?: string | null; retailerLinks?: unknown };

export function checklistExtraRetailers(product: ProductLinks): RetailerLink[] {
  const dedicated = new Set([product.affiliateUrl, product.amazonUrl, product.secondaryUrl].filter(isHttpUrl).map(retailerUrlKey));
  return (parseRetailerLinks(product.retailerLinks) ?? []).filter((link) => !dedicated.has(retailerUrlKey(link.url)));
}

export function checklistRetailerPreferences(product: ProductLinks) {
  const extras = checklistExtraRetailers(product);
  const urls = [product.affiliateUrl, product.amazonUrl, product.secondaryUrl, ...extras.slice(0, 3).map((link) => link.url)];
  const saved = parseRetailerLinks(product.retailerLinks) ?? [];
  const fieldFor = (link?: RetailerLink) => link ? RETAILER_FIELDS[urls.findIndex((url) => isHttpUrl(url) && retailerUrlKey(url) === retailerUrlKey(link.url))] ?? '' : '';
  return {
    first: fieldFor(saved.find((link) => link.preferred)),
    second: fieldFor(saved.find((link) => link.displayOrder === 1 && !link.preferred)),
  };
}

/** Save presentation metadata alongside URLs in the existing JSON column. */
export function checklistRetailersFromForm(form: FormData, existing?: ProductLinks) {
  const text = (name: string) => String(form.get(name) ?? '').trim();
  const first = text('firstRetailer');
  const second = text('secondRetailer');
  const activeFields = RETAILER_FIELDS.filter((field) => isHttpUrl(text(field)));
  const firstField = activeFields.find((field) => field === first) ?? activeFields.find((field) => field !== second);
  const secondField = activeFields.find((field) => field === second && field !== firstField);
  const orderedFields = [firstField, secondField, ...activeFields.filter((field) => field !== firstField && field !== secondField)].filter(Boolean);
  const names = ['Babylist', 'Amazon', text('secondaryRetailer') || 'Shop', ...[1, 2, 3].map((n) => text(`extraRetailer${n}`) || 'Shop')];
  const raw = Array.isArray(existing?.retailerLinks) ? existing.retailerLinks : [];
  const links: Record<string, unknown>[] = RETAILER_FIELDS.flatMap((field, index) => {
    const url = text(field);
    if (!isHttpUrl(url)) return [];
    const previous = raw.find((entry) => entry && typeof entry === 'object' && isHttpUrl(entry.url) && retailerUrlKey(entry.url) === retailerUrlKey(url));
    return [{ ...previous, retailer: names[index], url, preferred: field === first,
      displayOrder: orderedFields.indexOf(field) }];
  });
  // Retain legacy records beyond the editable slots, rather than silently deleting them.
  for (const extra of checklistExtraRetailers(existing ?? {}).slice(3)) {
    if (!links.some((link) => link.url === extra.url)) links.push({ ...extra });
  }
  return links;
}
