type GtagPrimitive = string | number | boolean;
type GtagParams = Record<string, GtagPrimitive | null | undefined>;

type GtagConfigCommand = (
  command: 'config',
  targetId: string,
  config?: GtagParams,
) => void;

type GtagEventCommand = (
  command: 'event',
  action: string,
  config?: GtagParams,
) => void;

type GtagCommand = GtagConfigCommand & GtagEventCommand;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagCommand;
    __tmbcLastTrackedPageview?: string;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || undefined;

const normalizePagePath = (value: string) => {
  if (!value.trim()) {
    return '/';
  }

  try {
    const url = value.startsWith('http://') || value.startsWith('https://')
      ? new URL(value)
      : new URL(value, 'https://www.taylormadebabyco.com');
    const pathname = url.pathname.replace(/\/+$/, '') || '/';

    return `${pathname}${url.search}`;
  } catch {
    const [withoutHash = '/'] = value.split('#');
    const normalized = withoutHash.replace(/\/+$/, '') || '/';

    return normalized.startsWith('/') ? normalized : `/${normalized}`;
  }
};

const pruneParams = (params: GtagParams) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ) as Record<string, GtagPrimitive>;

const getAnalyticsWindow = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window;
};

export const config = (url?: string) => {
  const analyticsWindow = getAnalyticsWindow();

  if (!analyticsWindow || !GA_ID || typeof analyticsWindow.gtag !== 'function') {
    return;
  }

  const resolvedPath = normalizePagePath(
    url ?? `${analyticsWindow.location.pathname}${analyticsWindow.location.search}`,
  );

  if (analyticsWindow.__tmbcLastTrackedPageview === resolvedPath) {
    return;
  }

  analyticsWindow.__tmbcLastTrackedPageview = resolvedPath;
  analyticsWindow.gtag('config', GA_ID, pruneParams({
    page_path: resolvedPath,
    page_title: analyticsWindow.document.title || undefined,
  }));
};

export const pageview = (url: string) => {
  config(url);
};

export const event = ({
  action,
  category,
  label,
  value,
  params = {},
}: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  params?: GtagParams;
}) => {
  const analyticsWindow = getAnalyticsWindow();

  if (!analyticsWindow || !GA_ID || typeof analyticsWindow.gtag !== 'function') {
    return;
  }

  analyticsWindow.gtag('event', action, pruneParams({
    ...params,
    event_category: category,
    event_label: label,
    value,
  }));
};
