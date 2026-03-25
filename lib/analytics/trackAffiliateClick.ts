import { trackEvent, getClientPageAnalyticsContext } from '@/lib/analytics';
import { AnalyticsEvents } from '@/lib/analytics/events';

type AffiliateFieldValue = string | number | null | undefined;

export type AffiliateClickInput = {
  url: string;
  product?: AffiliateFieldValue;
  brand?: AffiliateFieldValue;
  category?: AffiliateFieldValue;
  guide?: AffiliateFieldValue;
  position?: AffiliateFieldValue;
};

type AffiliateMetadataInput = Omit<AffiliateClickInput, 'url'>;

type AffiliateTrackingDataAttributes = {
  'data-product'?: string;
  'data-brand'?: string;
  'data-category'?: string;
  'data-guide'?: string;
  'data-position'?: string;
};

const normalizeAffiliateValue = (value: AffiliateFieldValue) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  return normalized ? normalized : undefined;
};

const buildAffiliateMetadata = (input: AffiliateMetadataInput) => ({
  product: normalizeAffiliateValue(input.product),
  brand: normalizeAffiliateValue(input.brand),
  category: normalizeAffiliateValue(input.category),
  guide: normalizeAffiliateValue(input.guide),
  position: normalizeAffiliateValue(input.position),
});

export function getAffiliateTrackingDataAttributes(
  input: AffiliateMetadataInput,
): AffiliateTrackingDataAttributes {
  const metadata = buildAffiliateMetadata(input);

  return {
    'data-product': metadata.product,
    'data-brand': metadata.brand,
    'data-category': metadata.category,
    'data-guide': metadata.guide,
    'data-position': metadata.position,
  };
}

export function trackAffiliateClick(input: AffiliateClickInput) {
  const url = normalizeAffiliateValue(input.url);
  if (!url) {
    return;
  }

  const metadata = buildAffiliateMetadata(input);

  trackEvent(AnalyticsEvents.AFFILIATE_CLICK, {
    ...(getClientPageAnalyticsContext() ?? {}),
    url,
    ...metadata,
    timestamp: new Date().toISOString(),
  });
}
