import { describe, expect, it } from 'vitest';

import {
  amazonUrlHasPartnerTag,
  assertAmazonDetailPageUrl,
  extractAmazonUrlsFromText,
  parseAmazonAsinFromUrl,
} from '@/lib/server/amazonCreators/url';

describe('Amazon URL helpers', () => {
  it('parses ASINs from known Amazon product URL shapes', () => {
    expect(parseAmazonAsinFromUrl('https://www.amazon.com/dp/B0BK1421MF?tag=taylormadebab-20')).toBe('B0BK1421MF');
    expect(parseAmazonAsinFromUrl('https://www.amazon.com/gp/product/b075wgcscm?tag=taylormadebab-20')).toBe('B075WGCSCM');
  });

  it('does not invent ASINs for short links', () => {
    expect(parseAmazonAsinFromUrl('https://amzn.to/4hdEYM0')).toBeNull();
  });

  it('confirms the required TMBC partner tag', () => {
    expect(amazonUrlHasPartnerTag('https://www.amazon.com/dp/B0BK1421MF?tag=taylormadebab-20', 'taylormadebab-20')).toBe(true);
    expect(assertAmazonDetailPageUrl('https://www.amazon.com/dp/B0BK1421MF?tag=wrong-20', 'taylormadebab-20')).toMatchObject({
      ok: false,
    });
  });

  it('extracts only Amazon URLs from rich text', () => {
    expect(
      extractAmazonUrlsFromText('See https://example.com and https://www.amazon.com/dp/B0BK1421MF?tag=taylormadebab-20.'),
    ).toEqual(['https://www.amazon.com/dp/B0BK1421MF?tag=taylormadebab-20']);
  });
});
