'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function BookContent() {
  const searchParams = useSearchParams();
  const name  = searchParams.get('name')  ?? '';
  const email = searchParams.get('email') ?? '';
  const widgetRef = useRef<HTMLDivElement>(null);

  const calendlyUrl =
    'https://calendly.com/registrywithtaylor/30min' +
    `?name=${encodeURIComponent(name)}` +
    `&email=${encodeURIComponent(email)}` +
    '&background_color=fbf7f4' +
    '&primary_color=D889A0';

  useEffect(() => {
    const el = widgetRef.current;
    if (!el) return;

    // Remove any previous Calendly iframe so re-renders stay clean
    el.innerHTML = '';

    function initWidget() {
      if (typeof (window as any).Calendly !== 'undefined') {
        (window as any).Calendly.initInlineWidget({
          url: calendlyUrl,
          parentElement: el,
        });
      }
    }

    if (typeof (window as any).Calendly !== 'undefined') {
      initWidget();
    } else {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    }
  }, [calendlyUrl]);

  return (
    <>
      {/* Confirmation header */}
      <div className="px-6 pb-4 pt-14 text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#D889A0]">
          You&rsquo;re almost there
        </p>
        <h1 className="mt-3 font-serif text-[2rem] leading-[1.1] tracking-[-0.03em] text-neutral-800">
          {name ? `Thanks, ${name}!` : 'One last step.'}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-7 text-neutral-500">
          Choose a time below and I&rsquo;ll send you a confirmation with
          everything you need before our call.
        </p>
      </div>

      {/* Calendly inline widget */}
      <div
        ref={widgetRef}
        className="mx-auto w-full"
        style={{ minWidth: '320px', height: '700px', maxWidth: '900px' }}
      />
    </>
  );
}
