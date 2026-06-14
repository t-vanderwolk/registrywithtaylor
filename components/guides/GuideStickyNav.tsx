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
  pathLabels,
  className = '',
}: {
  items: ProgressIndicatorItem[];
  containerId?: string;
  backLink?: GuideStickyNavLink | null;
  pathLabels?: string[];
  className?: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const navRef = useRef<HTMLElement | null>(null);
  const sectionRailRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const rail = sectionRailRef.current;
    if (!rail) {
      return;
    }

    const activeButton = rail.querySelector<HTMLElement>('[data-guide-sticky-pill][aria-current="step"]');
    activeButton?.scrollIntoView({
      behavior: 'auto',
      inline: 'center',
      block: 'nearest',
    });
  }, [activeId]);

  const activeItem = items.find((item) => item.id === activeId) ?? items[0] ?? null;
  const activeIndex = Math.max(
    items.findIndex((item) => item.id === activeId),
    0,
  );
  const journeyPath = (pathLabels ?? []).filter(Boolean).join(' -> ');
  const currentLane = pathLabels?.[1] ?? activeItem?.label ?? 'Guide';
  const resolvedBackLink = backLink ?? { href: '/learn', label: 'Back to TMBC Hub' };

  if (!resolvedBackLink && items.length === 0) {
    return null;
  }

  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      <nav
        ref={navRef}
        data-guide-sticky-nav
        aria-label="Guide navigation"
        className="overflow-hidden rounded-[1rem] border border-[rgba(215,161,175,0.22)] bg-[rgba(255,252,251,0.97)] shadow-[0_12px_24px_rgba(58,36,43,0.08)] backdrop-blur-[12px] sm:rounded-[1.1rem]"
      >
        <div className="flex flex-col gap-2 p-2 sm:gap-1.5 sm:p-2">
          <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
            {resolvedBackLink ? (
              <Link
                href={resolvedBackLink.href}
                className="inline-flex min-h-[38px] max-w-full items-center justify-start self-start rounded-full border border-[rgba(161,91,114,0.16)] bg-white/94 px-3.5 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.16em] text-[#8F4C62] transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:min-h-[36px] sm:w-auto sm:text-[0.6rem] sm:tracking-[0.18em]"
              >
                {resolvedBackLink.label}
              </Link>
            ) : null}

            <div className="min-w-0 w-full rounded-[0.95rem] border border-[rgba(215,161,175,0.14)] bg-[rgba(255,255,255,0.78)] px-3 py-2.5 sm:flex-1 sm:max-w-[62%] sm:py-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {items.length > 0 ? (
                    <>
                      <span className="text-[0.82rem] font-medium leading-5 text-[#4B3641] sm:hidden">
                        {`Step ${activeIndex + 1} of ${items.length}`}
                      </span>
                      <span className="hidden text-[0.82rem] font-medium leading-6 text-[#4B3641] sm:inline sm:text-[0.9rem]">
                        {`Step ${activeIndex + 1} of ${items.length} · ${currentLane}`}
                      </span>
                    </>
                  ) : null}

                  <p className="mt-0.5 truncate text-[0.72rem] leading-5 text-[#6A5660] sm:hidden">
                    {`${currentLane} · tap a section below`}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  {items.map((item, index) => {
                    const isActive = item.id === activeId;

                    return (
                      <button
                        key={`dot-${item.id}`}
                        type="button"
                        aria-label={`Go to step ${index + 1}: ${item.label}`}
                        aria-current={isActive ? 'step' : undefined}
                        onClick={() => scrollToGuideSection(item.id, containerId)}
                        className="group inline-flex h-3.5 w-3.5 items-center justify-center"
                      >
                        <span
                          className={[
                            'block h-2 w-2 rounded-full border transition duration-200',
                            isActive
                              ? 'border-[#A15B72] bg-[#A15B72]'
                              : 'border-[rgba(161,91,114,0.32)] bg-white group-hover:border-[#A15B72]',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                {activeItem ? (
                  <p className="max-w-full truncate text-[0.76rem] leading-5 text-[#6A5660] sm:text-[0.82rem]">
                    {activeItem.label}
                  </p>
                ) : null}
                {journeyPath ? (
                  <p className="hidden text-[0.74rem] leading-5 text-[#7A6670] md:block">
                    {journeyPath}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {items.length > 1 ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-1 sm:hidden">
                <p className="text-[0.58rem] uppercase tracking-[0.2em] text-[#A15B72]">Sections</p>
                <p className="text-[0.68rem] leading-5 text-[#7A6670]">Swipe to move</p>
              </div>

              <div
                ref={sectionRailRef}
                className="-mx-0.5 flex snap-x snap-mandatory gap-1.5 overflow-x-auto px-0.5 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
              {items.map((item, index) => {
                const isActive = item.id === activeId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToGuideSection(item.id, containerId)}
                    aria-current={isActive ? 'step' : undefined}
                    data-guide-sticky-pill
                    className={`inline-flex min-h-[36px] shrink-0 items-center rounded-full border px-3 py-1.5 text-[0.74rem] transition duration-300 sm:min-h-[36px] sm:px-3 sm:py-1.5 sm:text-[0.84rem] ${
                      isActive
                        ? 'border-[rgba(199,125,151,0.38)] bg-[linear-gradient(135deg,#D88EA2_0%,#C77D97_100%)] text-white shadow-[0_10px_24px_rgba(199,125,151,0.22)]'
                        : 'border-[rgba(215,161,175,0.16)] bg-white/86 text-[#5B4B55] hover:-translate-y-0.5 hover:border-[rgba(199,125,151,0.18)] hover:shadow-sm'
                    }`}
                  >
                    <span className="sm:hidden">{item.shortLabel?.trim() || item.label}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
              </div>
            </div>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
