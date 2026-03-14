import { AnalyticsEvents } from './analytics/events';
import { event as sendGoogleAnalyticsEvent, pageview as sendGoogleAnalyticsPageview } from './analytics/gtag';

type AnalyticsPayloadValue = string | number | boolean | null | undefined;

export type AnalyticsPayload = Record<string, AnalyticsPayloadValue>;
export type AnalyticsPageType = 'homepage' | 'blog' | 'guide' | 'services' | 'contact' | 'book' | 'other';

type PageAnalyticsContext = {
  path: string;
  pageType: AnalyticsPageType;
  referrer: string | null;
  referrerPageType: AnalyticsPageType | null;
};

type GtagEvent = (
  command: 'event',
  eventName: string,
  payload?: AnalyticsPayload,
) => void;

type AnalyticsWindow = Window & typeof globalThis & { gtag?: GtagEvent };

const BOOKING_PATH_PREFIXES = ['/book', '/consultation'] as const;

const GA_EVENT_CATEGORIES: Record<string, string> = {
  [AnalyticsEvents.PAGE_VIEW]: 'navigation',
  [AnalyticsEvents.BLOG_VIEW]: 'blog',
  [AnalyticsEvents.CONSULTATION_CLICK]: 'conversion',
  [AnalyticsEvents.CONTACT_CLICK]: 'conversion',
  [AnalyticsEvents.GUIDE_DOWNLOAD]: 'guides',
  [AnalyticsEvents.AFFILIATE_OUTBOUND_CLICK]: 'affiliate',
  [AnalyticsEvents.CONSULTATION_FORM_OPEN]: 'forms',
  [AnalyticsEvents.CONSULTATION_SUBMITTED]: 'forms',
  [AnalyticsEvents.CONTACT_FORM_OPEN]: 'forms',
  [AnalyticsEvents.CONTACT_FORM_SUBMITTED]: 'forms',
  [AnalyticsEvents.BLOG_TO_CONSULTATION_CLICK]: 'conversion',
  [AnalyticsEvents.BLOG_TO_CONTACT_CLICK]: 'conversion',
  [AnalyticsEvents.BLOG_TO_SERVICES_CLICK]: 'blog',
  [AnalyticsEvents.BLOG_AFFILIATE_CTA_CLICK]: 'affiliate',
  guide_view: 'guides',
  guide_affiliate_click: 'affiliate',
  guide_to_consultation_click: 'conversion',
  guide_to_contact_click: 'conversion',
  guide_to_services_click: 'guides',
  guide_newsletter_cta_click: 'guides',
  guide_created: 'guides_admin',
  guide_updated: 'guides_admin',
  guide_saved_draft: 'guides_admin',
  guide_previewed: 'guides_admin',
  guide_published: 'guides_admin',
  guide_unpublished: 'guides_admin',
  guide_duplicated: 'guides_admin',
  guide_archived: 'guides_admin',
};

const getAnalyticsWindow = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window as AnalyticsWindow;
};

const normalizeAnalyticsPath = (value: string) => {
  if (!value.trim()) {
    return '/';
  }

  try {
    const url = value.startsWith('http://') || value.startsWith('https://')
      ? new URL(value)
      : new URL(value, 'https://taylormadebabyco.com');
    const pathname = url.pathname.replace(/\/+$/, '') || '/';

    return pathname;
  } catch {
    const withoutHash = value.split('#')[0] ?? value;
    const withoutQuery = withoutHash.split('?')[0] ?? withoutHash;
    const normalized = withoutQuery.replace(/\/+$/, '') || '/';

    return normalized.startsWith('/') ? normalized : `/${normalized}`;
  }
};

const getStringPayloadValue = (payload: AnalyticsPayload, key: string) => {
  const value = payload[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
};

const getNumericPayloadValue = (payload: AnalyticsPayload, key: string) => {
  const value = payload[key];
  return typeof value === 'number' ? value : undefined;
};

const getSourceLabelFromPayload = (payload: AnalyticsPayload) => {
  const slug = getStringPayloadValue(payload, 'slug');
  if (slug) {
    return slug;
  }

  const pageType = getStringPayloadValue(payload, 'pageType');
  if (pageType === 'homepage') {
    return 'homepage';
  }

  if (pageType) {
    return pageType;
  }

  return getStringPayloadValue(payload, 'path') ?? getStringPayloadValue(payload, 'title');
};

const getGaEventCategory = (eventName: string, payload: AnalyticsPayload) =>
  getStringPayloadValue(payload, 'category') ??
  GA_EVENT_CATEGORIES[eventName] ??
  getStringPayloadValue(payload, 'pageType') ??
  'engagement';

const getGaEventLabel = (eventName: string, payload: AnalyticsPayload) => {
  const explicitLabel = getStringPayloadValue(payload, 'label');
  if (explicitLabel) {
    return explicitLabel;
  }

  switch (eventName) {
    case AnalyticsEvents.BLOG_AFFILIATE_CTA_CLICK:
    case AnalyticsEvents.AFFILIATE_OUTBOUND_CLICK:
    case 'guide_affiliate_click':
      return (
        getStringPayloadValue(payload, 'productName') ??
        getStringPayloadValue(payload, 'partnerName') ??
        getStringPayloadValue(payload, 'partnerSlug') ??
        getStringPayloadValue(payload, 'destination') ??
        getSourceLabelFromPayload(payload)
      );
    case AnalyticsEvents.GUIDE_DOWNLOAD:
    case 'guide_view':
    case 'guide_newsletter_cta_click':
      return (
        getStringPayloadValue(payload, 'slug') ??
        getStringPayloadValue(payload, 'fileName') ??
        getSourceLabelFromPayload(payload)
      );
    default:
      return getSourceLabelFromPayload(payload);
  }
};

export function getAnalyticsPageType(path: string): AnalyticsPageType {
  const normalizedPath = normalizeAnalyticsPath(path);

  if (normalizedPath === '/') {
    return 'homepage';
  }

  if (normalizedPath === '/blog' || normalizedPath.startsWith('/blog/')) {
    return 'blog';
  }

  if (normalizedPath === '/guides' || normalizedPath.startsWith('/guides/')) {
    return 'guide';
  }

  if (normalizedPath === '/services' || normalizedPath.startsWith('/services/')) {
    return 'services';
  }

  if (normalizedPath === '/contact' || normalizedPath.startsWith('/contact/')) {
    return 'contact';
  }

  if (BOOKING_PATH_PREFIXES.some((prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`))) {
    return 'book';
  }

  return 'other';
}

const getReferrerContext = (analyticsWindow: AnalyticsWindow) => {
  const rawReferrer = analyticsWindow.document.referrer?.trim() ?? '';
  if (!rawReferrer) {
    return {
      referrer: null,
      referrerPageType: null,
    } satisfies Pick<PageAnalyticsContext, 'referrer' | 'referrerPageType'>;
  }

  try {
    const referrerUrl = new URL(rawReferrer);
    if (referrerUrl.origin !== analyticsWindow.location.origin) {
      return {
        referrer: referrerUrl.toString(),
        referrerPageType: null,
      } satisfies Pick<PageAnalyticsContext, 'referrer' | 'referrerPageType'>;
    }

    const referrerPath = normalizeAnalyticsPath(referrerUrl.pathname);
    return {
      referrer: referrerPath,
      referrerPageType: getAnalyticsPageType(referrerPath),
    } satisfies Pick<PageAnalyticsContext, 'referrer' | 'referrerPageType'>;
  } catch {
    return {
      referrer: rawReferrer,
      referrerPageType: null,
    } satisfies Pick<PageAnalyticsContext, 'referrer' | 'referrerPageType'>;
  }
};

export function getClientPageAnalyticsContext(path?: string): PageAnalyticsContext | null {
  const analyticsWindow = getAnalyticsWindow();
  if (!analyticsWindow) {
    return null;
  }

  const resolvedPath = normalizeAnalyticsPath(path ?? analyticsWindow.location.pathname);
  return {
    path: resolvedPath,
    pageType: getAnalyticsPageType(resolvedPath),
    ...getReferrerContext(analyticsWindow),
  };
}

export function getInternalPathFromHref(href: string) {
  const analyticsWindow = getAnalyticsWindow();
  if (!analyticsWindow) {
    return null;
  }

  try {
    const url = new URL(href, analyticsWindow.location.origin);
    if (url.origin !== analyticsWindow.location.origin) {
      return null;
    }

    return normalizeAnalyticsPath(url.pathname);
  } catch {
    return null;
  }
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  const analyticsWindow = getAnalyticsWindow();
  if (!analyticsWindow) {
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.info('[analytics]', eventName, payload);
  }

  sendGoogleAnalyticsEvent({
    action: eventName,
    category: getGaEventCategory(eventName, payload),
    label: getGaEventLabel(eventName, payload),
    value: getNumericPayloadValue(payload, 'value'),
    params: payload,
  });
}

export function trackPageView(
  payload: AnalyticsPayload & {
    path: string;
    pageType?: AnalyticsPageType;
  },
) {
  const context =
    getClientPageAnalyticsContext(payload.path) ?? {
      path: normalizeAnalyticsPath(payload.path),
      pageType: payload.pageType ?? getAnalyticsPageType(payload.path),
      referrer: null,
      referrerPageType: null,
    };
  const pageViewPayload = {
    ...context,
    ...payload,
    path: context.path,
    pageType: payload.pageType ?? context.pageType,
  };

  if (process.env.NODE_ENV !== 'production') {
    console.info('[analytics]', AnalyticsEvents.PAGE_VIEW, pageViewPayload);
  }

  sendGoogleAnalyticsPageview(context.path);
}
