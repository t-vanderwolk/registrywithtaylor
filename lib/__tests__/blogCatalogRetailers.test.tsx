import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseStyledBlock } from '@/lib/blog/styledBlocks';
import { enrichProductBlockWithCatalog } from '@/lib/blog/enrichCatalogProduct';
import BlogProductInsightCard from '@/components/blog/BlogProductInsightCard';
import BlogCatalogProductCard from '@/components/blog/BlogCatalogProductCard';

const kona = `:::catalog-product
Brand: UPPAbaby
Product: Kona
Note: 22 lb everyday stroller · Reversible seat · 30 lb basket · Available now
Babylist: https://babylist.pxf.io/c/6560395/1056628/13580?u=https%3A%2F%2Fwww.babylist.com%2Fgp%2Fuppababy-kona-stroller%2F85560%2F3544349&partnerpropertyid=7490466
Target: https://www.target.com/p/uppababy-kona-lightweight-stroller/-/A-1012609690?preselect=1011306502
Amazon: https://amzn.to/3ThLk4c
Nordstrom: https://www.nordstrom.com/s/uppababy-kona-stroller-evelyn-meado/9238422?origin=keywordsearch-personalizedsort&breadcrumb=Home%2FAll+Results&color=44444G3K2B
Pottery Barn Kids: https://www.potterybarnkids.com/products/uppababy-kona-stroller/
UPPAbaby: https://uppababy.com/strollers/full-size/kona/
Primary: Babylist
Price: $649.99
Status: Available
Image: https://www.modernnursery.com/cdn/shop/files/uppababy-kona-stroller-james_1.jpg?v=1787076257&width=1080
:::`;
function parse(text: string) {
  const block = parseStyledBlock(text.split('\n'), 0)?.block;
  if (block?.type !== 'catalog-product') throw new Error('Missing catalog block');
  return block;
}

describe('blog catalog retailer links', () => {
  it.each(['inline', 'grid'] as const)('renders all six supplied Kona retailers in the %s card', layout => {
    const block = parse(kona);
    expect(block.retailerLinks?.map(l => l.retailer)).toEqual(['Babylist', 'Target', 'Amazon', 'Nordstrom', 'Pottery Barn Kids', 'UPPAbaby']);
    expect(block.price).toBe(649.99);
    const html = renderToStaticMarkup(<BlogCatalogProductCard {...block} layout={layout} position={1} />);
    expect((html.match(/<a /g) ?? []).length).toBe(6);
    expect(html).not.toContain('View All Retailers');
    expect(html).not.toMatch(/\shidden(?:=|\s|>)/);
    expect(html.indexOf('Shop at Babylist')).toBeLessThan(html.indexOf('Shop at Target'));
    expect(html.indexOf('Shop at Target')).toBeLessThan(html.indexOf('Shop at Amazon'));
    expect(html).toContain('https://amzn.to/3ThLk4c');
    expect(html).not.toContain('href="https://babylist.pxf.io');
    expect(html).toContain('go.shopmy.us/apx/y5Etg8');
    expect(html).toContain('preselect%3D1011306502');
    expect(html).toContain('/assets/logos/pbkids.png');
    expect((html.match(/sponsored nofollow/g) ?? []).length).toBe(6);
  });

  it('accepts Markdown links and escaped URL punctuation without changing destinations', () => {
    const markdown = kona.replace(/^(.*?): (https?:\/\/.*)$/gm, (_, label, url) => `${label}: [Shop](${url.replace(/([&_])/g, '\\$1')})`);
    expect(parse(markdown)).toEqual(parse(kona));
  });

  it('honors a named primary retailer and preserves all authored links through enrichment', () => {
    const block = parse(kona.replace('Primary: Babylist', 'Primary: Pottery Barn Kids'));
    const enriched = enrichProductBlockWithCatalog(block, {});
    expect(enriched).toEqual(block);
    const html = renderToStaticMarkup(<BlogCatalogProductCard {...block} position={1} />);
    expect(html.indexOf('Shop at Pottery Barn Kids')).toBeLessThan(html.indexOf('Shop at Babylist'));
  });

  it('keeps legacy Shop slots and rejects non-shopping schemes', () => {
    const block = parse(`:::catalog-product\nBrand: Test\nProduct: Model\nShop: https://example.com/one\nRetailer: Store One\nShop 2: https://example.org/two\nRetailer 2: Store Two\nPrimary: Shop\nBad Store: javascript:alert(1)\nOther: [Click](javascript:alert(1))\n:::`);
    const html = renderToStaticMarkup(<BlogCatalogProductCard {...block} position={1} />);
    expect((html.match(/<a /g) ?? []).length).toBe(2);
    expect(html).toContain('Shop at Store One');
    expect(html).toContain('Shop at Store Two');
    expect(html).not.toContain('javascript:');
  });
});


it('keeps every distinct retailer on editorial product cards too', () => {
  const links = Array.from({length: 6}, (_, n) => ({label: `Store ${n + 1}`,url:`https://www.target.com/p/product-${n + 1}`}));
  const html = renderToStaticMarkup(<BlogProductInsightCard name="Example" details={[]} category="gear" position={1} links={[...links, links[0]]} />);
  for (const link of links) expect(html).toContain(`aria-label="${link.label}"`);
  expect((html.match(/aria-label="Store 6"/g) ?? []).length).toBe(1);
});


describe('blog GoodBuy Gear badge', () => {
  const url = 'https://goodbuygear.com/products/uppababy-mesa-v3';
  it.each(['inline', 'grid'] as const)('uses the shared pink badge and tracked link in %s cards', layout => {
    const html = renderToStaticMarkup(<BlogCatalogProductCard brand="UPPAbaby" productName="Mesa V3" layout={layout} position={2} babylistUrl="https://www.babylist.com/gp/mesa-v3/123/456" openBoxUrl={url} openBoxPrice={180} openBoxAvailable={true} retailerLinks={[{retailer:'GoodBuy Gear (open box)',url}]} />);
    expect(html).toContain('tool-open-box-badge');
    expect(html).toContain('/assets/logos/goodbuygear2.png');
    expect(html).toContain('from $180');
    expect((html.match(/href="https:\/\/goodbuygear.com/g) ?? []).length).toBe(1);
    expect(html).toContain('data-analytics-managed="true"');
    expect(html).not.toContain('Shop at GoodBuy Gear');
  });
  it('hides sold-out offers without falling back to a retailer pill', () => {
    const html = renderToStaticMarkup(<BlogCatalogProductCard brand="UPPAbaby" productName="Mesa V3" position={2} babylistUrl="https://www.babylist.com/gp/mesa-v3/123/456" openBoxUrl={url} openBoxAvailable={false} retailerLinks={[{retailer:'GoodBuy Gear',url}]} />);
    expect(html).not.toContain('tool-open-box-badge');
    expect(html).not.toContain(url);
    expect(html).toContain('Shop at Babylist');
  });
});
