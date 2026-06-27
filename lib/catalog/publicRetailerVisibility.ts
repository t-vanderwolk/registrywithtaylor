type RetailOfferSignal = {
  source?: string | null;
  retailer?: string | null;
  provider?: string | null;
  url?: string | null;
  productUrl?: string | null;
  price?: number | null;
};

function normalizeRetailerSignal(value: string | null | undefined) {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');
}

export function isGoodBuyGearSource(value: string | null | undefined) {
  const normalized = normalizeRetailerSignal(value);
  if (!normalized) return false;

  return (
    normalized === 'goodbuy gear' ||
    normalized === 'goodbuygear' ||
    normalized === 'open box' ||
    normalized === 'openbox' ||
    normalized.includes('goodbuy gear') ||
    normalized.includes('goodbuygear')
  );
}

export function isGoodBuyGearUrl(value: string | null | undefined) {
  if (!value) return false;

  const raw = value.toLowerCase();
  if (raw.includes('goodbuygear') || raw.includes('goodbuy-gear')) return true;

  try {
    const parsed = new URL(value);
    const destination = parsed.searchParams.get('u');
    if (!destination) return false;

    const decoded = decodeURIComponent(destination).toLowerCase();
    return decoded.includes('goodbuygear') || decoded.includes('goodbuy-gear');
  } catch {
    return false;
  }
}

export function isGoodBuyGearOffer(offer: RetailOfferSignal) {
  return (
    isGoodBuyGearSource(offer.source) ||
    isGoodBuyGearSource(offer.retailer) ||
    isGoodBuyGearSource(offer.provider) ||
    isGoodBuyGearUrl(offer.url) ||
    isGoodBuyGearUrl(offer.productUrl)
  );
}

export function hasPublicRetailOffer(offer: RetailOfferSignal) {
  if (isGoodBuyGearOffer(offer)) return false;

  return Boolean(offer.url?.trim() || offer.productUrl?.trim() || offer.price != null);
}

export function hasNonGoodBuyGearRetailer(offers: RetailOfferSignal[]) {
  return offers.some((offer) => hasPublicRetailOffer(offer));
}
