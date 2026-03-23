'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { ProgressIndicatorItem } from '@/components/guides/ProgressIndicator';
import {
  getActiveGuideSectionFromScroll,
  getGuideStickyTopOffset,
  getGuideViewportOffset,
  isScrollableGuideContainer,
  scrollToGuideSection,
} from '@/lib/guides/guideNav';

type GuideStickyNavLink = {
  href: string;
  label: string;
};

export default function GuideStickyNav({
  items,
  containerId,
  backLink,
  className = '',
}: {
  items: ProgressIndicatorItem[];
  containerId?: string;
  backLink?: GuideStickyNavLink | null;
  className?: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let animationFrame = 0;

    const syncStickyMetrics = () => {
      document.documentElement.style.setProperty('--guide-sticky-top', `${getGuideStickyTopOffset()}px`);
      document.documentElement.style.setProperty(
        '--guide-sticky-nav-height',
        `${navRef.current?.getBoundingClientRect().height ?? 0}px`,
      );
    };

    const requestStickyMetricsSync = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        syncStickyMetrics();
      });
    };

    syncStickyMetrics();
    window.addEventListener('resize', requestStickyMetricsSync);
    window.addEventListener('scroll', requestStickyMetricsSync, { passive: true });

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            requestStickyMetricsSync();
          })
        : null;

    if (observer && navRef.current) {
      observer.observe(navRef.current);
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer?.disconnect();
      window.removeEventListener('resize', requestStickyMetricsSync);
      window.removeEventListener('scroll', requestStickyMetricsSync);
    };
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      return undefined;
    }

    const root = containerId ? document.getElementById(containerId) : null;
    const scrollTarget =
      root instanceof HTMLElement && isScrollableGuideContainer(root) ? root : window;
    let animationFrame = 0;

    const updateActiveSection = () => {
      const nextActiveId = getActiveGuideSectionFromScroll({
        items,
        containerId,
        viewportOffset: scrollTarget === window ? getGuideViewportOffset(containerId) : 72,
      });
      if (nextActiveId) {
        setActiveId(nextActiveId);
      }
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        updateActiveSection();
      });
    };

    updateActiveSection();
    scrollTarget.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      scrollTarget.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [containerId, items]);

  const activeItem = items.find((item) => item.id === activeId) ?? items[0] ?? null;
  const resolvedBackLink = backLink ?? { href: '/guides', label: 'Back to TMBC Hub' };

  if (!resolvedBackLink && items.length === 0) {
    return null;
  }

  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      <nav
        ref={navRef}
        data-guide-sticky-nav
        aria-label="Guide navigation"
        className="overflow-hidden rounded-[1rem] border border-[rgba(215,161,175,0.22)] bg-[rgba(255,252,251,0.97)] shadow-[0_14px_28px_rgba(58,36,43,0.08)] backdrop-blur-[12px] sm:rounded-[1.1rem]"
      >
        <div className="flex flex-col gap-1.5 p-1.5 sm:gap-2 sm:p-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {resolvedBackLink ? (
              <Link
                href={resolvedBackLink.href}
                className="inline-flex min-h-[36px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.16)] bg-white/94 px-3 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.16em] text-[#8F4C62] transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:min-h-[38px] sm:justify-start sm:text-[0.62rem] sm:tracking-[0.18em]"
              >
                {resolvedBackLink.label}
              </Link>
            ) : null}

            {activeItem ? (
              <div className="inline-flex min-h-[36px] min-w-0 max-w-full items-center rounded-full bg-[rgba(250,244,246,0.96)] px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.14em] text-[#9F556D] sm:min-h-[38px] sm:text-[0.62rem] sm:tracking-[0.16em]">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-[#C77D97]" />
                <span className="hidden shrink-0 sm:inline">Now Viewing</span>
                <span className="truncate text-[0.82rem] font-medium normal-case tracking-normal text-[#2F2430] sm:ml-2 sm:text-sm">
                  {activeItem.label}
                </span>
              </div>
            ) : null}
          </div>

          {items.length > 1 ? (
            <div className="-mx-0.5 flex snap-x snap-mandatory gap-1.5 overflow-x-auto px-0.5 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {items.map((item, index) => {
                const isActive = item.id === activeId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToGuideSection(item.id, containerId)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`inline-flex min-h-[36px] shrink-0 items-center rounded-full border px-3 py-1.5 text-[0.78rem] transition duration-300 sm:min-h-[38px] sm:py-2 sm:text-[0.88rem] ${
                      isActive
                        ? 'border-[rgba(199,125,151,0.38)] bg-[linear-gradient(135deg,#D88EA2_0%,#C77D97_100%)] text-white shadow-[0_10px_24px_rgba(199,125,151,0.22)]'
                        : 'border-[rgba(215,161,175,0.16)] bg-white/86 text-[#5B4B55] hover:-translate-y-0.5 hover:border-[rgba(199,125,151,0.18)] hover:shadow-sm'
                    }`}
                  >
                    <span className="sm:hidden">{item.shortLabel?.trim() || String(index + 1).padStart(2, '0')}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
