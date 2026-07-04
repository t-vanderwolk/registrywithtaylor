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

export function isBabylistOffer(offer: RetailOfferSignal) {
  const source = normalizeRetailerSignal(offer.source);
  const retailer = normalizeRetailerSignal(offer.retailer);
  const provider = normalizeRetailerSignal(offer.provider);

  return source === 'babylist' || retailer === 'babylist' || provider === 'babylist impact';
}

export function isMacroBabyOffer(offer: RetailOfferSignal) {
  const source = normalizeRetailerSignal(offer.source);
  const retailer = normalizeRetailerSignal(offer.retailer);
  const provider = normalizeRetailerSignal(offer.provider);

  return (
    source === 'macrobaby' ||
    source === 'macro baby' ||
    retailer === 'macrobaby' ||
    retailer === 'macro baby' ||
    provider === 'shopify macrobaby'
  );
}

export function hasPublicRetailOffer(offer: RetailOfferSignal) {
  if (isGoodBuyGearOffer(offer)) return false;

  return Boolean(offer.url?.trim() || offer.productUrl?.trim() || offer.price != null);
}

export function isBombiOffer(offer: RetailOfferSignal) {
  const source = normalizeRetailerSignal(offer.source);
  const retailer = normalizeRetailerSignal(offer.retailer);
  const provider = normalizeRetailerSignal(offer.provider);

  return source === 'bombi' || retailer === 'bombi' || retailer === 'bombi gear' || provider === 'bombi direct';
}

export function isAmazonUrl(value: string | null | undefined) {
  if (!value) return false;
  const raw = value.toLowerCase();
  if (raw.includes('amazon.') || raw.includes('amzn.to') || raw.includes('amzn.eu')) return true;
  try {
    const destination = new URL(value).searchParams.get('u');
    return destination ? /amazon\.|amzn\./.test(decodeURIComponent(destination).toLowerCase()) : false;
  } catch {
    return false;
  }
}

export function isAmazonOffer(offer: RetailOfferSignal) {
  const source = normalizeRetailerSignal(offer.source);
  const retailer = normalizeRetailerSignal(offer.retailer);
  const provider = normalizeRetailerSignal(offer.provider);
  return (
    source === 'amazon' ||
    retailer === 'amazon' ||
    provider === 'amazon' ||
    isAmazonUrl(offer.url) ||
    isAmazonUrl(offer.productUrl)
  );
}

/** A hand-added TMBC catalog product (provider "manual_tmbc", retailer "Manual"). */
export function isManualOffer(offer: RetailOfferSignal) {
  const source = normalizeRetailerSignal(offer.source);
  const retailer = normalizeRetailerSignal(offer.retailer);
  const provider = normalizeRetailerSignal(offer.provider);
  return provider === 'manual tmbc' || retailer === 'manual' || source === 'manual';
}

export function hasPublicCoreRetailer(offerOrOffers: RetailOfferSignal | RetailOfferSignal[]) {
  const offers = Array.isArray(offerOrOffers) ? offerOrOffers : [offerOrOffers];
  return offers.some(
    (offer) =>
      hasPublicRetailOffer(offer) &&
      (isBabylistOffer(offer) ||
        isMacroBabyOffer(offer) ||
        isBombiOffer(offer) ||
        isAmazonOffer(offer) ||
        isManualOffer(offer)),
  );
}

export function hasNonGoodBuyGearRetailer(offers: RetailOfferSignal[]) {
  return offers.some((offer) => hasPublicRetailOffer(offer));
}
