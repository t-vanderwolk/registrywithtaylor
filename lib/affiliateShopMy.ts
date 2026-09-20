// Documented manual wrapping uses the same public ID as our installed script.
// https://guide.shopmy.us/creating-and-sharing-links/3ViMaZXyQ3oy7Ai2FXgQY8/auto-linking-for-publishers/4tx5RgywPA7Aybno4Vv5RA
const SHOPMY_ID = 'y5Etg8';

// Preserve our existing networks and the retailer exclusions configured in ShopMy.
const PRESERVED_DOMAINS = [
  'amazon.com', 'amzn.to', 'amzn.eu', 'babylist.com', 'pxf.io', 'sjv.io',
  'goodbuygear.com', 'macrobaby.com', 'albeebaby.com', 'anbbaby.com',
  'awin1.com', 'awin.com', 'dpbolvw.net', 'tkqlhce.com', 'jdoqocy.com',
  'anrdoezrs.net', 'kqzyfj.com', 'qksrv.net', 'linksynergy.com', 'shareasale.com',
  'shopmy.us', 'silvercrossus.com', 'taylormadebabyco.com',
  'instagram.com', 'wa.me', 'facebook.com', 'pinterest.com', 'youtube.com',
  'tiktok.com', 'ctfassets.net',
];
const AFFILIATE_PARAMS = /^(ref|referral|referrer|affiliate.*|aff_.*|affid|aff_id|tag|irclickid|irgwc|cjevent|clickid|click_id|sscid|sca_ref|rfsn)$/i;

/** Unwrap only Babylist shopping destinations, never registries or opaque short links. */
export function babylistShopMyUrl(href: string): string {
  try {
    const source = new URL(href);
    if (source.protocol !== 'https:' || source.username || source.password) return href;
    const destination = source.hostname === 'babylist.pxf.io'
      ? source.searchParams.get('u')
      : href;
    if (!destination) return href;
    const product = new URL(destination);
    if (product.protocol !== 'https:' || product.username || product.password) return href;
    if (!['www.babylist.com', 'babylist.com'].includes(product.hostname)) return href;
    if (!/^\/(gp|store|products)(\/|$)/.test(product.pathname)) return href;
    return `https://go.shopmy.us/apx/${SHOPMY_ID}?url=${encodeURIComponent(destination)}`;
  } catch {
    return href;
  }
}

/** Only call for deliberate product shopping links, never general navigation. */
export function shopMyProductUrl(href: string): string {
  const babylist = babylistShopMyUrl(href);
  if (babylist !== href) return babylist;
  let url: URL;
  try { url = new URL(href); } catch { return href; }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return href;
  const host = url.hostname.toLowerCase();
  if (PRESERVED_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`))) return href;
  if (Array.from(url.searchParams.keys()).some((key) => AFFILIATE_PARAMS.test(key))) return href;
  return `https://go.shopmy.us/apx/${SHOPMY_ID}?url=${encodeURIComponent(href)}`;
}
