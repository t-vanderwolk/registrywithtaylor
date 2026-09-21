import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ProductRetailerActions from '@/components/affiliate/ProductRetailerActions';
import BlogCatalogProductCard from '@/components/blog/BlogCatalogProductCard';
import { currentRetailerPrice, orderedProductRetailers, productPricePresentation } from '@/lib/productRetailers';
import { parseRetailerLinks, type RetailerLink } from '@/lib/retailerLinks';
import { checklistExtraRetailers, checklistRetailerPreferences, checklistRetailersFromForm } from '@/lib/checklist/retailerPreferences';
import { resolveProductLinks } from '@/lib/checklist/productLinks';
import type { ChecklistProduct } from '@/lib/checklist/products';

const links: RetailerLink[] = [
  { retailer: 'Amazon', url: 'https://www.amazon.com/dp/TEST?tag=keep' },
  { retailer: 'Babylist', url: 'https://www.babylist.com/gp/test/1/2' },
  { retailer: 'Nordstrom', url: 'https://www.nordstrom.com/s/test' },
  { retailer: "Bloomingdale's", url: 'https://www.bloomingdales.com/shop/test' },
  { retailer: 'Silver Cross', url: 'https://silvercrossus.com/product/test?ref=4762' },
];

describe('editorial retailer actions', () => {
  it.each([1, 2, 3, 4, 5])('renders %i destinations with at most two primary CTAs', (count) => {
    const html = renderToStaticMarkup(<ProductRetailerActions links={links.slice(0, count)} productName="Test product" />);
    expect((html.match(/<a /g) ?? []).length).toBe(count);
    const primary = html.split('<button')[0];
    expect((primary.match(/<a /g) ?? []).length).toBe(Math.min(2, count));
    if (count > 2) {
      expect(html).toContain('View All Retailers');
      expect(html).toContain('aria-expanded="false"');
      expect(html).toContain('hidden=""');
    } else expect(html).not.toContain('<button');
    expect(html).not.toContain('<svg');
    // Retailers carry a logo when we have the asset, and no price of their own.
    expect(html).not.toContain('Checked');
    expect((html.match(/sponsored nofollow/g) ?? []).length).toBe(count);
  });

  it('caps presentation at five without mutating stored links', () => {
    const six = [...links, { retailer: 'Target', url: 'https://www.target.com/p/test' }];
    const original = JSON.stringify(six);
    const html = renderToStaticMarkup(<ProductRetailerActions links={six} productName="Test" />);
    expect((html.match(/<a /g) ?? []).length).toBe(5);
    expect(JSON.stringify(six)).toBe(original);
  });

  it('uses product-specific preferences, not a retailer hierarchy or commission rate', () => {
    const custom = links.map((link, index) => ({ ...link, preferred: index === 3, displayOrder: index === 2 ? 1 : index + 2 }));
    expect(orderedProductRetailers(custom).slice(0, 2).map((link) => link.retailer)).toEqual(["Bloomingdale's", 'Nordstrom']);
    expect(orderedProductRetailers(links.slice().reverse())[0].retailer).toBe('Silver Cross');
  });

  it('does not repeat a primary retailer in the expanded list', () => {
    expect(orderedProductRetailers([...links, { retailer: 'Amazon', url: 'https://www.amazon.com/dp/OTHER' }])).toHaveLength(5);
  });

  it('applies the same commerce layout to blog catalog cards', () => {
    const html = renderToStaticMarkup(<BlogCatalogProductCard brand="Test" productName="Model" price={419} priceSource="Babylist"
      retailerLinks={links} position={1} />);
    expect(html).toContain('View All Retailers');
    expect(html).toContain('Shop at Amazon');
    expect(html).not.toContain('via Babylist');
    expect(html).toContain('Reference price');
    expect(html).toContain('amazon.com/dp/TEST?tag=keep');
    expect(html).toContain('go.shopmy.us/apx/y5Etg8');
    expect(html).toContain('silvercrossus.com/product/test?ref=4762');
  });
});

describe('verified retailer prices', () => {
  const now = Date.parse('2026-09-20T12:00:00Z');
  const priced = { ...links[2], price: 419, salePrice: 379, priceVerified: true, priceCheckedAt: '2026-09-20T11:00:00Z' };
  it('uses a fresh verified sale and preserves price metadata', () => {
    expect(currentRetailerPrice(priced, now)?.value).toBe(379);
    expect(currentRetailerPrice(priced, now)?.sale).toBe(true);
    expect(parseRetailerLinks([priced])?.[0]).toEqual(priced);
    // Cards show one price only: the reference price, never a retailer's.
    expect(productPricePresentation(419)).toEqual({ label: '$419', reference: true });
  });
  it('does not imply a current comparison for stale, unknown or unverified prices', () => {
    for (const link of [
      { ...priced, priceCheckedAt: undefined }, { ...priced, priceVerified: false },
      { ...priced, priceCheckedAt: '2026-09-18T11:00:00Z' }, { ...priced, priceCheckedAt: '2026-09-21T11:00:00Z' },
    ]) expect(currentRetailerPrice(link, now)).toBeNull();
    expect(productPricePresentation(419)).toEqual({ label: '$419', reference: true });
  });
});

describe('per-product retailer settings without a migration', () => {
  it('round-trips dedicated fields and extras without losing URLs or saved metadata', () => {
    const form = new FormData();
    const values = { affiliateUrl: links[1].url, amazonUrl: links[0].url, secondaryUrl: links[2].url, secondaryRetailer: 'Nordstrom',
      extraUrl1: links[3].url, extraRetailer1: "Bloomingdale's", extraUrl2: links[4].url, extraRetailer2: 'Silver Cross',
      firstRetailer: 'extraUrl1', secondRetailer: 'secondaryUrl' };
    Object.entries(values).forEach(([key, value]) => form.set(key, value));
    const existing = { ...values, retailerLinks: [{ ...links[3], price: 419, priceCheckedAt: '2026-09-20T00:00:00Z', customNote: 'keep' }, links[4]] };
    const retailerLinks = checklistRetailersFromForm(form, existing);
    expect(retailerLinks.find((link) => link.url === links[3].url)?.customNote).toBe('keep');
    expect(new Set(retailerLinks.map((link) => link.url))).toEqual(new Set(links.map((link) => link.url)));
    const saved = { ...values, retailerLinks };
    expect(checklistExtraRetailers(saved).map((link) => link.url)).toEqual([links[3].url, links[4].url]);
    expect(checklistRetailerPreferences(saved)).toEqual({ first: 'extraUrl1', second: 'secondaryUrl' });
    const resolved = resolveProductLinks({ ...saved, retailerLinks: parseRetailerLinks(retailerLinks) } as unknown as ChecklistProduct);
    expect(resolved.slice(0, 2).map((link) => link.retailer)).toEqual(["Bloomingdale's", 'Nordstrom']);
    expect(resolved).toHaveLength(5);
  });
});
