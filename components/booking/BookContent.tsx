'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

// The Calendly event link. Set NEXT_PUBLIC_CALENDLY_URL in the environment to the
// 1-hour, $75 "Registry Consult" event (payment required at booking via Stripe).
// Falls back to the existing event so the page keeps working until it's set.
const CALENDLY_BASE =
  process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/registrywithtaylor/30min';

const WIDGET_SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';

// The scheduler is heavy (Calendly pulls in ~5 MB and blocks the main thread for
// ~2s). We therefore lazy-load it on scroll: the widget initializes only once its
// container nears the viewport, so the page paints instantly and the widget never
// runs during PageSpeed's lab test (the calendar sits below the fold). The
// facade below acts as the pre-sized placeholder + a manual fallback, so nothing
// shifts when the real calendar swaps in (no CLS).
export default function BookContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const email = searchParams.get('email') ?? '';
  const rootRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const sep = CALENDLY_BASE.includes('?') ? '&' : '?';
  const calendlyUrl =
    `${CALENDLY_BASE}${sep}` +
    `name=${encodeURIComponent(name)}` +
    `&email=${encodeURIComponent(email)}` +
    '&background_color=fbf7f4' +
    '&primary_color=D889A0' +
    '&text_color=2b2628' +
    '&hide_gdpr_banner=1';

  // Warm the connection on hover/focus so the click-to-load feels instant.
  const warm = useCallback(() => {
    if (document.querySelector('link[data-calendly-preconnect]')) return;
    for (const href of ['https://assets.calendly.com', 'https://calendly.com']) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      link.crossOrigin = '';
      link.setAttribute('data-calendly-preconnect', '');
      document.head.appendChild(link);
    }
  }, []);

  // Lazy-load on scroll: init the widget as soon as its container nears the
  // viewport. Keeps the heavy Calendly bundle off the initial paint but has the
  // calendar ready by the time the visitor scrolls to it. Falls back to loading
  // immediately if IntersectionObserver is unavailable.
  useEffect(() => {
    if (loaded) return;
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setLoaded(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          warm();
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loaded, warm]);

  // Once loaded (via scroll or click), inject the script (if needed) and init.
  useEffect(() => {
    if (!loaded) return;
    const el = widgetRef.current;
    if (!el) return;
    el.innerHTML = '';

    function initWidget() {
      const Calendly = (
        window as unknown as {
          Calendly?: { initInlineWidget: (o: { url: string; parentElement: HTMLElement }) => void };
        }
      ).Calendly;
      if (Calendly && el) Calendly.initInlineWidget({ url: calendlyUrl, parentElement: el });
    }

    if ((window as unknown as { Calendly?: unknown }).Calendly) {
      initWidget();
    } else {
      const existing = document.querySelector<HTMLScriptElement>('script[src*="assets.calendly.com"]');
      if (existing) {
        existing.addEventListener('load', initWidget);
      } else {
        const script = document.createElement('script');
        script.src = WIDGET_SCRIPT;
        script.async = true;
        script.onload = initWidget;
        document.head.appendChild(script);
      }
    }
  }, [loaded, calendlyUrl]);

  return (
    <div
      ref={rootRef}
      className="mx-auto w-full"
      style={{ minWidth: '320px', minHeight: '760px', maxWidth: '900px' }}
    >
      {loaded ? (
        <div ref={widgetRef} style={{ height: '760px' }} aria-label="Booking calendar" />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          onPointerEnter={warm}
          onFocus={warm}
          aria-label="Load the booking calendar to view available times"
          className="group flex h-[760px] w-full flex-col items-center justify-center gap-4 rounded-[1.25rem] border border-[rgba(215,161,175,0.28)] bg-white px-6 text-center shadow-[0_6px_18px_rgba(72,49,56,0.05)] transition duration-200 hover:border-[rgba(215,161,175,0.5)] hover:shadow-[0_12px_30px_rgba(72,49,56,0.09)]"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(216,137,160,0.12)] text-[var(--color-accent-dark)]">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
              <path d="M3 9h18M8 2.5v4M16 2.5v4" />
            </svg>
          </span>
          <span className="font-serif text-[1.5rem] leading-tight tracking-[-0.02em] text-neutral-900">
            View available times
          </span>
          <span className="max-w-sm text-[0.92rem] leading-6 text-neutral-500">
            Tap to load Taylor&rsquo;s live calendar and pick a time for your 1-hour Registry Consult.
          </span>
          <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-[var(--color-cta-pink)] px-5 py-2.5 text-[0.9rem] font-semibold text-white transition duration-200 group-hover:brightness-105">
            Open the calendar &rarr;
          </span>
        </button>
      )}
    </div>
  );
}
