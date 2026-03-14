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

  analyticsWindow.gtag?.('event', eventName, payload);
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

  trackEvent('page_view', {
    ...context,
    ...payload,
    path: context.path,
    pageType: payload.pageType ?? context.pageType,
  });
}
