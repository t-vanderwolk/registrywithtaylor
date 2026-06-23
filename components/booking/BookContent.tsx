'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

// The Calendly event link. Set NEXT_PUBLIC_CALENDLY_URL in the environment to the
// 1-hour, $75 "Registry Consult" event (payment required at booking via Stripe).
// Falls back to the existing event so the page keeps working until it's set.
const CALENDLY_BASE =
  process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/registrywithtaylor/30min';

export default function BookContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const email = searchParams.get('email') ?? '';
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = widgetRef.current;
    if (!el) return;

    // Clear any previous iframe so re-renders stay clean.
    el.innerHTML = '';

    const sep = CALENDLY_BASE.includes('?') ? '&' : '?';
    const calendlyUrl =
      `${CALENDLY_BASE}${sep}` +
      `name=${encodeURIComponent(name)}` +
      `&email=${encodeURIComponent(email)}` +
      '&background_color=fbf7f4' +
      '&primary_color=D889A0' +
      '&text_color=2b2628' +
      '&hide_gdpr_banner=1';

    function initWidget() {
      const Calendly = (window as unknown as { Calendly?: { initInlineWidget: (o: { url: string; parentElement: HTMLElement }) => void } }).Calendly;
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
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.onload = initWidget;
        document.head.appendChild(script);
      }
    }
  }, [name, email]);

  return (
    <div
      ref={widgetRef}
      className="mx-auto w-full"
      style={{ minWidth: '320px', height: '760px', maxWidth: '900px' }}
      aria-label="Booking calendar"
    />
  );
}
