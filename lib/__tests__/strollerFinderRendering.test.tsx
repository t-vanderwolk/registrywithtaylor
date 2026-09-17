import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import StrollerCatalogFinder from '@/components/tools/StrollerCatalogFinder';
import type { PublicStrollerBrand, PublicStrollerProduct } from '@/lib/server/publicStrollerCatalog';

const product: PublicStrollerProduct = {
  name: 'Orbit Baby G5', model: 'G5', displayModel: 'G5',
  summary: 'A rotating stroller seat.', price: 999, image: 'https://example.com/g5.jpg',
  affiliateUrl: 'https://www.babylist.com/g5?affiliate=keep', source: 'babylist',
  retailers: {
    babylist: { price: 999, url: 'https://www.babylist.com/g5?affiliate=keep' },
    amazon: { price: 999, url: 'https://www.amazon.com/dp/example?tag=keep' },
    macrobaby: null, bombi: null, anb: null, goodbuygear: null,
  },
};
const brands: PublicStrollerBrand[] = [{
  brand: 'Orbit Baby', count: 1,
  types: [{ category: 'full-size', label: 'Full Size', products: [product] }],
}];

describe('stroller finder initial HTML', () => {
  it('includes products, summaries, prices and preserved affiliate links before JavaScript runs', () => {
    const html = renderToStaticMarkup(<StrollerCatalogFinder brands={brands} initialBrand="Orbit Baby" />);
    expect(html).toContain('G5');
    expect(html).toContain('A rotating stroller seat.');
    expect(html).toContain('999.00');
    expect(html).toContain('https://www.babylist.com/g5?affiliate=keep');
    expect(html).toContain('https://www.amazon.com/dp/example?tag=keep');
    expect(html).toContain('/tools/compare?ids=orbit-baby-g5');
    expect(html).toContain('/tools/travel-system/results?stroller=orbit-baby-g5');
    expect(html).not.toContain('Loading the live catalog');
  });

  it('renders category products on the server as well', () => {
    const html = renderToStaticMarkup(<StrollerCatalogFinder brands={brands} initialCategory="full-size" />);
    expect(html).toContain('/tools/compare?ids=orbit-baby-g5');
    expect(html).toContain('A rotating stroller seat.');
  });

  it('gives crawlers real brand and category navigation links', () => {
    const brandHtml = renderToStaticMarkup(<StrollerCatalogFinder brands={brands} />);
    const categoryHtml = renderToStaticMarkup(<StrollerCatalogFinder brands={brands} initialMode="category" />);
    expect(brandHtml).toContain('href="/tools/stroller-finder?brand=Orbit%20Baby"');
    expect(categoryHtml).toContain('href="/tools/stroller-finder?category=full-size"');
  });
});
