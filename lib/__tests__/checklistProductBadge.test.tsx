import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import ChecklistProductBadge from '@/components/checklist/ChecklistProductBadge';

const offer = { retailer: 'GoodBuy Gear', url: 'https://goodbuygear.pxf.io/c/6560395/3220593/40600?u=https%3A%2F%2Fgoodbuygear.com%2Fproducts%2Ftest&partnerpropertyid=7490466' };
describe('checklist GoodBuy Gear badge', () => {
  it('renders the shared stroller design with the listing price and accurate condition', () => {
    const html=renderToStaticMarkup(<ChecklistProductBadge badge="GoodBuy Gear" links={[offer]} productName="Test" onRetailerClick={()=>{}}
      goodBuyGearOffer={{url:offer.url,price:239.99,condition:'Barely Used'}} />);
    expect(html).toContain('tool-open-box-badge__eyebrow');
    expect(html).toContain('Barely Used');
    expect(html).toContain('from $239.99');
    expect(html).not.toContain('tmbc-rec__pill');
    expect(html).not.toContain('Open Box');
  });

  it('keeps editorial badges noninteractive and never invents an offer', () => {
    for (const props of [{badge:"Taylor's Pick",links:[offer]}, {badge:'GoodBuy Gear',links:[]}]) {
      const html=renderToStaticMarkup(<ChecklistProductBadge {...props} productName="Test" onRetailerClick={()=>{}} />);
      expect(html).toContain('<span');
      expect(html).not.toContain('<a');
    }
  });
  it('uses the exact saved affiliate destination and a single manual tracking callback', () => {
    const onRetailerClick=vi.fn();
    const props={badge:'GoodBuy Gear', links:[{retailer:'Amazon',url:'https://amzn.to/keep'},offer],productName:'Brand Model',onRetailerClick};
    const element=ChecklistProductBadge(props)!;
    element.props.onClick();
    expect(onRetailerClick).toHaveBeenCalledExactlyOnceWith(offer);
    const html=renderToStaticMarkup(element);
    expect(html).toContain('Shop at GoodBuy Gear for Brand Model');
    expect(html).toContain('data-affiliate-track-source="manual"');
    expect(html).toContain('data-analytics-managed="true"');
    expect(html).toContain('shopmyskip');
    expect(html).toContain('goodbuygear.pxf.io');
    expect(html).not.toContain('go.shopmy.us');
    expect(html).toContain('tool-open-box-badge');
    expect(html).toContain('/assets/logos/goodbuygear2.png');
    expect(html).not.toContain('Open Box');
  });
});
