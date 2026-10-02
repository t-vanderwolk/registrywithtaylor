import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import ChecklistProductBadge from '@/components/checklist/ChecklistProductBadge';

const offer = { retailer: 'GoodBuy Gear', url: 'https://goodbuygear.pxf.io/c/6560395/3220593/40600?u=https%3A%2F%2Fgoodbuygear.com%2Fproducts%2Ftest&partnerpropertyid=7490466' };
describe('checklist GoodBuy Gear badge', () => {
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
    expect(html).not.toContain('Open Box');
  });
});
