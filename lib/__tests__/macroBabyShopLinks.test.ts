import { describe, expect, it } from 'vitest';

import {
  isBlockedMacroBabyShopUrl,
  isMacroBabyAllowedForBrand,
  isMacroBabyProductUrl,
  MACROBABY_SHOP_LINKS_ENABLED,
} from '@/lib/affiliateShopFallbacks';

const wrap = (url: string) => `https://go.shopmy.us/apx/y5Etg8?url=${encodeURIComponent(url)}`;

describe('MacroBaby shop-link switch', () => {
  it('is switched off', () => {
    expect(MACROBABY_SHOP_LINKS_ENABLED).toBe(false);
  });

  it.each([
    'https://www.macrobaby.com/products/nuna-pipa-rx-infant-car-seat',
    'https://www.macrobaby.com/products/baby-jogger-city-select-2-car-seat-adapter?_j=taylormadebabyco.com',
    'https://www.macrobaby.com/collections/strollers/products/bugaboo-donkey-6',
    wrap('https://www.macrobaby.com/products/mima-xari'),
  ])('treats %s as a shop link and blocks it', (url) => {
    expect(isMacroBabyProductUrl(url)).toBe(true);
    expect(isBlockedMacroBabyShopUrl(url)).toBe(true);
  });

  it.each([
    'https://www.macrobaby.com/',
    'https://www.macrobaby.com/pages/macrobaby-baby-registry',
    'https://www.macrobaby.com/pages/macrobaby-gift-box',
    'https://www.macrobaby.com/cdn/shop/files/nuna-demi-icon.jpg',
    'https://notmacrobaby.com/products/x',
    'https://www.babylist.com/gp/example/1/2',
    'not a url',
  ])('keeps %s', (url) => {
    expect(isMacroBabyProductUrl(url)).toBe(false);
    expect(isBlockedMacroBabyShopUrl(url)).toBe(false);
  });

  it('turns the MacroBaby button off for every brand', () => {
    expect(isMacroBabyAllowedForBrand('Nuna')).toBe(false);
    expect(isMacroBabyAllowedForBrand('UPPAbaby')).toBe(false);
    expect(isMacroBabyAllowedForBrand('Silver Cross')).toBe(false);
  });
});
