'use client';

import Link from 'next/link';
import { Body, H2 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { getAnalyticsPageType, getClientPageAnalyticsContext, getInternalPathFromHref, trackEvent } from '@/lib/analytics';
import { AnalyticsEvents } from '@/lib/analytics/events';

type BlogSoftCTAProps = {
  className?: string;
  postId: string;
  postSlug: string;
  postTitle: string;
};

export default function BlogSoftCTA({
  className = '',
  postId,
  postSlug,
  postTitle,
}: BlogSoftCTAProps) {
  const trackBlogCta = (href: string, ctaLabel: string) => {
    const destinationPath = getInternalPathFromHref(href);
    const destinationPageType = destinationPath ? getAnalyticsPageType(destinationPath) : null;
    const eventName =
      destinationPageType === 'book'
        ? AnalyticsEvents.BLOG_TO_CONSULTATION_CLICK
        : destinationPageType === 'contact'
          ? AnalyticsEvents.BLOG_TO_CONTACT_CLICK
          : destinationPageType === 'services'
            ? AnalyticsEvents.BLOG_TO_SERVICES_CLICK
            : null;

    if (!eventName) {
      return;
    }

    const payload = {
      ...(getClientPageAnalyticsContext(`/blog/${postSlug}`) ?? {
        path: `/blog/${postSlug}`,
        pageType: 'blog' as const,
        referrer: null,
        referrerPageType: null,
      }),
      postId,
      slug: postSlug,
      title: postTitle,
      ctaLabel,
      destination: destinationPath ?? href,
      destinationPageType,
    };

    trackEvent(eventName, payload);
    void fetch(`/api/blog/${postId}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'click',
        meta: {
          ...payload,
          eventName,
        },
      }),
      keepalive: true,
      credentials: 'same-origin',
    }).catch(() => undefined);
  };

  return (
    <MarketingSurface
      className={['text-center', className].filter(Boolean).join(' ')}
    >
      <RevealOnScroll>
        <div className="mx-auto max-w-2xl space-y-6">
          <span className="block text-xs uppercase tracking-[0.28em] text-charcoal/55">Need expert guidance?</span>
          <H2 className="font-serif leading-tight text-neutral-900">
            Bring your baby gear questions to Taylor when the guide gets you close, but not all the way there.
          </H2>
          <Body className="mx-auto text-charcoal/75">
            The journal builds clarity. The consultation applies that clarity to your stroller, car seat, registry,
            nursery, and purchase-timing decisions.
          </Body>
          <div className="flex flex-col justify-center gap-4 pt-2 sm:flex-row">
            <Link
              href="/book"
              className="btn btn--primary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              onClick={() => trackBlogCta('/book', 'Book a Consultation')}
            >
              Book a Consultation
            </Link>
            <Link
              href="/contact"
              className="btn btn--secondary w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              onClick={() => trackBlogCta('/contact', 'Contact Taylor')}
            >
              Contact Taylor
            </Link>
          </div>
        </div>
      </RevealOnScroll>
    </MarketingSurface>
  );
}
