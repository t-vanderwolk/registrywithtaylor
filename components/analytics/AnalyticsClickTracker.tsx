'use client';

import { useEffect, useEffectEvent } from 'react';
import { AnalyticsEvents } from '@/lib/analytics/events';
import { GA_ID } from '@/lib/analytics/gtag';
import { getClientPageAnalyticsContext, getAnalyticsPageType, trackEvent } from '@/lib/analytics';

const DOWNLOAD_FILE_PATTERN = /\.(pdf|docx?|xlsx?|zip)(?:[?#].*)?$/i;

const isManagedAnalyticsLink = (anchor: HTMLAnchorElement) => anchor.dataset.analyticsManaged === 'true';

const getLinkText = (anchor: HTMLAnchorElement) => anchor.textContent?.replace(/\s+/g, ' ').trim() || null;

const getSourceLabel = (path: string, pageType: string) => {
  if (pageType === 'homepage') {
    return 'homepage';
  }

  if (pageType === 'guide' || pageType === 'blog') {
    return path.split('/').filter(Boolean).pop() ?? path;
  }

  return pageType === 'other' ? path : pageType;
};

const isAffiliateLink = (anchor: HTMLAnchorElement, url: URL, origin: string) => {
  if (url.origin === origin) {
    return false;
  }

  if (anchor.dataset.affiliatePartner || anchor.dataset.affiliateContext) {
    return true;
  }

  const rel = anchor.rel.toLowerCase();
  return rel.includes('sponsored') || rel.includes('nofollow');
};

export default function AnalyticsClickTracker() {
  const handleDocumentClick = useEffectEvent((event: MouseEvent) => {
    if (!GA_ID) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const anchor = target.closest('a[href]');
    if (!(anchor instanceof HTMLAnchorElement) || isManagedAnalyticsLink(anchor)) {
      return;
    }

    const context =
      getClientPageAnalyticsContext() ?? {
        path: window.location.pathname,
        pageType: getAnalyticsPageType(window.location.pathname),
        referrer: document.referrer || null,
        referrerPageType: null,
      };
    const sourceLabel = getSourceLabel(context.path, context.pageType);

    let destinationUrl: URL;
    try {
      destinationUrl = new URL(anchor.href, window.location.origin);
    } catch {
      return;
    }

    const destinationPath =
      destinationUrl.origin === window.location.origin
        ? `${destinationUrl.pathname}${destinationUrl.search}`
        : destinationUrl.toString();
    const linkText = getLinkText(anchor);

    if (
      destinationUrl.origin === window.location.origin &&
      (destinationUrl.pathname === '/consultation' || destinationUrl.pathname === '/book')
    ) {
      trackEvent(AnalyticsEvents.CONSULTATION_CLICK, {
        ...context,
        category: 'conversion',
        label: sourceLabel,
        ctaLabel: linkText ?? 'Book a Consultation',
        destination: destinationPath,
        destinationPageType: 'book',
      });
      return;
    }

    if (
      context.pageType === 'guide' &&
      (anchor.hasAttribute('download') ||
        DOWNLOAD_FILE_PATTERN.test(destinationUrl.pathname) ||
        /\bdownload\b/i.test(linkText ?? ''))
    ) {
      const fileName = destinationUrl.pathname.split('/').filter(Boolean).pop() ?? 'resource';

      trackEvent(AnalyticsEvents.GUIDE_DOWNLOAD, {
        ...context,
        category: 'guides',
        label: sourceLabel,
        destination: destinationPath,
        fileName,
      });
      return;
    }

    if (isAffiliateLink(anchor, destinationUrl, window.location.origin)) {
      trackEvent(AnalyticsEvents.AFFILIATE_OUTBOUND_CLICK, {
        ...context,
        category: 'affiliate',
        label: anchor.dataset.affiliatePartner || linkText || sourceLabel,
        destination: destinationUrl.toString(),
        partnerSlug: anchor.dataset.affiliatePartner || undefined,
        affiliateContext: anchor.dataset.affiliateContext || undefined,
      });
    }
  });

  useEffect(() => {
    if (!GA_ID) {
      return;
    }

    document.addEventListener('click', handleDocumentClick, true);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [handleDocumentClick]);

  return null;
}
