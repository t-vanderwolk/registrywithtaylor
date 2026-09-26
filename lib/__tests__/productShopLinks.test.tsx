import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ProductShopLink from '@/components/affiliate/ProductShopLink';
import BabylistShopLink from '@/components/affiliate/BabylistShopLink';
import TrackedAffiliateLink from '@/components/analytics/TrackedAffiliateLink';
import ToolAffiliateLink from '@/components/tools/ToolAffiliateLink';
import { OpenBoxBadge } from '@/components/tools/StrollerCatalogFinder';
import { babylistShopMyUrl, shopMyProductUrl } from '@/lib/affiliateShopMy';
import { parseRetailerLinks } from '@/lib/retailerLinks';
import { resolveProductLinks } from '@/lib/checklist/productLinks';
import { checklistProductLinkError } from '@/lib/checklist/productLinkForm';
import { babylist, type ChecklistProduct } from '@/lib/checklist/products';
import { babylistShopLink, TRAVEL_SYSTEM_AFFILIATE_LINKS } from '@/lib/travelSystemAffiliateLinks';
import { babylistBrandShopUrl } from '@/lib/affiliateShopFallbacks';
import { getPipaUrbnTravelSystemUrl } from '@/lib/catalog/pipaUrbnTravelSystems';

describe('ShopMy product links', () => {
  it.each(['target.com', 'nordstrom.com', 'bloomingdales.com', 'potterybarnkids.com', 'crateandbarrel.com'])(
    'wraps %s at render, including the exact variant query', (host) => {
      const original = `https://www.${host}/product/AbC?color=Pink&size=2`;
      const wrapped = new URL(shopMyProductUrl(original));
      expect(wrapped.origin + wrapped.pathname).toBe('https://go.shopmy.us/apx/y5Etg8');
      expect(wrapped.searchParams.get('url')).toBe(original);
    },
  );

  it.each([
    'https://silvercrossus.com/product/reef/?ref=4762',
    'https://www.amazon.com/dp/ABC?tag=keep', 'https://amzn.to/AbCd',
    'https://babylist.pxf.io/example?u=keep',
    'https://goodbuygear.pxf.io/AbCd', 'https://www.awin1.com/cread.php?awinmid=123',
    'https://www.dpbolvw.net/click-123', 'https://shop.sjv.io/AbCd',
    'https://www.macrobaby.com/products/example', 'https://www.albeebaby.com/example',
    'https://www.anbbaby.com/products/example', 'https://www.instagram.com/example',
    'https://images.ctfassets.net/example', 'https://brand.example/product?affiliate_pid=123',
    'https://brand.example/product?ref=ABC', 'https://brand.example/product?sca_ref=ABC',
    'https://go.shopmy.us/p-12345', '/resources', 'mailto:hello@example.com',
  ])('preserves protected destination %s byte-for-byte', (href) => {
    expect(shopMyProductUrl(href)).toBe(href);
  });

  it('is idempotent and uses hostname boundaries', () => {
    const href = shopMyProductUrl('https://www.target.com/p/example');
    expect(shopMyProductUrl(href)).toBe(href);
    expect(shopMyProductUrl('https://notamazon.com/product')).toContain('go.shopmy.us');
  });

  it('renders vendor opt-out and the required referrer policy before hydration', () => {
    const html = renderToStaticMarkup(<ProductShopLink href="https://www.target.com/p/example" className="shop-button" rel="noreferrer">Target</ProductShopLink>);
    expect(html).toContain('https://go.shopmy.us/apx/y5Etg8?url=');
    expect(html).toContain('shopmyskip shop-button');
    expect(html).toContain('referrerPolicy="no-referrer-when-downgrade"');
    expect(html).not.toContain('noreferrer');
  });

  it('keeps original affiliate links exempt from the installed vendor script', () => {
    const href = 'https://silvercrossus.com/product/reef/?ref=4762';
    const html = renderToStaticMarkup(<ProductShopLink href={href}>Silver Cross</ProductShopLink>);
    expect(html).toContain(`href="${href}"`);
    expect(html).toContain('shopmyskip');
    expect(html).toContain('noreferrer');
  });

  it('protects existing GoodBuy Gear open-box referrals from the vendor script', () => {
    const href = 'https://goodbuygear.pxf.io/AbCd';
    const html = renderToStaticMarkup(<OpenBoxBadge offer={{ url: href, price: 100 }} />);
    expect(html).toContain(`href="${href}"`);
    expect(html).toContain('shopmyskip tool-open-box-badge');
  });
});

describe('Babylist to ShopMy', () => {
  const product = 'https://www.babylist.com/gp/nuna-mixx-next/21607/2072845?color=Granite&size=2#details';
  const impact = `https://babylist.pxf.io/c/6560395/1160375/13580?prodsku=2072845&u=${encodeURIComponent(product)}&intsrc=CATF_8981`;

  it.each([product, impact])('routes the exact product through ShopMy without nesting Impact: %s', (href) => {
    const result = shopMyProductUrl(href);
    expect(new URL(result).searchParams.get('url')).toBe(product);
    expect(result).not.toContain('pxf.io');
    expect(shopMyProductUrl(result)).toBe(result);
  });

  it.each([
    'https://babylist.pxf.io/AbCd',
    'https://babylist.pxf.io/c/123?u=https%3A%2F%2Fevil.example%2Fgp%2Fproduct',
    'https://babylist.pxf.io/c/123?u=javascript%3Aalert(1)',
    'https://www.babylist.com/list/private-registry',
    'https://my.babylist.com/private-registry',
    'https://www.babylist.com/login',
    'https://www.babylist.com',
    'https://images.babylist.com/product.jpg',
    'https://www.babylist.com.evil.example/gp/product',
    'https://user:password@www.babylist.com/gp/product',
    'https://goodbuygear.pxf.io/c/123?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fproduct',
  ])('leaves unresolvable and non-shopping links unchanged: %s', (href) => {
    expect(babylistShopMyUrl(href)).toBe(href);
  });

  it('renders editorial links with ShopMy referrer support without changing unrelated links', () => {
    const html = renderToStaticMarkup(<BabylistShopLink href={impact} rel="noreferrer" target="_blank">Babylist</BabylistShopLink>);
    expect(html).toContain('go.shopmy.us');
    expect(html).not.toContain('noreferrer');
    expect(html).toContain('shopmyskip');
    expect(html).toContain('referrerPolicy="no-referrer-when-downgrade"');
    expect(renderToStaticMarkup(<BabylistShopLink href="/contact">Contact</BabylistShopLink>)).toBe('<a href="/contact">Contact</a>');
  });

  it('generates ShopMy links at the source across curated shopping surfaces', () => {
    const cases = [
      [babylist(product), product],
      [babylistShopLink(product), product],
      [babylistBrandShopUrl('Baby Jogger'), 'https://www.babylist.com/store/strollers?brand=baby-jogger'],
      [getPipaUrbnTravelSystemUrl('Nuna', 'MIXX next'), 'https://www.babylist.com/gp/nuna-mixx-next-pipa-urbn/36335/1925316'],
      [TRAVEL_SYSTEM_AFFILIATE_LINKS['Bugaboo:::Butterfly'].babylistUrl, 'https://www.babylist.com/gp/bugaboo-butterfly-complete-stroller/25163/1154565'],
    ];
    for (const [href, expected] of cases) {
      const url = new URL(href!);
      expect(url.origin + url.pathname).toBe('https://go.shopmy.us/apx/y5Etg8');
      expect(url.searchParams.get('url')).toBe(expected);
      expect(shopMyProductUrl(href!)).toBe(href);
    }
  });

  it('keeps tracking attributes when the source already supplies a ShopMy link', () => {
    const html = renderToStaticMarkup(<BabylistShopLink href={babylist(product)} rel="noreferrer">Babylist</BabylistShopLink>);
    expect(html).toContain('shopmyskip');
    expect(html).toContain('sponsored nofollow noopener');
    expect(html).toContain('referrerPolicy="no-referrer-when-downgrade"');
    expect(html).not.toContain('noreferrer');
    expect(html).not.toContain('pxf.io');
  });

  it('covers both tracked blog cards and tool result buttons', () => {
    for (const element of [
      <TrackedAffiliateLink href={impact} ctaText="Babylist">Babylist</TrackedAffiliateLink>,
      <ToolAffiliateLink href={impact} tool="stroller-compare" retailer="babylist">Babylist</ToolAffiliateLink>,
    ]) {
      const html = renderToStaticMarkup(element);
      expect(html).toContain('go.shopmy.us/apx/y5Etg8');
      expect(html).not.toContain('pxf.io');
      expect(html).not.toContain('noreferrer');
    }
  });
});

describe('checklist link limits', () => {
  const entries = {
    affiliateUrl: 'https://babylist.pxf.io/a', amazonUrl: 'https://amzn.to/a',
    secondaryUrl: 'https://www.target.com/p/a', extraUrl1: 'https://www.nordstrom.com/s/a',
    extraUrl2: 'https://www.potterybarnkids.com/products/a', extraUrl3: 'https://www.bloomingdales.com/shop/a',
  };
  const form = (values: Record<string, string>) => {
    const data = new FormData();
    for (const [key, value] of Object.entries(values)) data.set(key, value);
    return data;
  };
  it('accepts five links and rejects six before saving', () => {
    expect(checklistProductLinkError(form({ ...entries, extraUrl3: '' }))).toBeNull();
    expect(checklistProductLinkError(form(entries))).toContain('Choose up to 5');
  });
  it('ignores placeholders and duplicate destinations but preserves case-sensitive paths', () => {
    expect(checklistProductLinkError(form({ ...entries, extraUrl3: entries.extraUrl1 }))).toBeNull();
    expect(checklistProductLinkError(form({ ...entries, affiliateUrl: 'AFFILIATE_LINK_NEEDED' }))).toBeNull();
    expect(checklistProductLinkError(form({ ...entries, extraUrl3: 'https://www.nordstrom.com/s/A' }))).not.toBeNull();
  });
  it('rejects malformed or unsafe links', () => {
    for (const url of ['https://', 'javascript:alert(1)', 'https://user:password@example.com']) {
      expect(checklistProductLinkError(form({ extraUrl1: url }))).not.toBeNull();
      expect(parseRetailerLinks([{ retailer: 'Bad', url }])).toBeUndefined();
    }
  });
  it('does not hide a sixth link that is already stored', () => {
    const product = { ...entries, secondaryRetailer: 'Target', retailerLinks: [
      { retailer: 'Nordstrom', url: entries.extraUrl1 },
      { retailer: 'Pottery Barn Kids', url: entries.extraUrl2 },
      { retailer: 'Bloomingdale\'s', url: entries.extraUrl3 },
    ] } as unknown as ChecklistProduct;
    expect(resolveProductLinks(product)).toHaveLength(6);
    expect(resolveProductLinks(product)[5].url).toBe(entries.extraUrl3);
  });
});
