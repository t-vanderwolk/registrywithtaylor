'use client';

import { useEffect, useState } from 'react';
import {
  getActiveGuideSectionFromScroll,
  getGuideViewportOffset,
  isScrollableGuideContainer,
} from '@/lib/guides/guideNav';

export type GuideProgressBarItem = {
  id: string;
  label: string;
  shortLabel?: string;
};

export default function GuideProgressBar({
  items,
  pathLabels,
  containerId,
  className = '',
}: {
  items: GuideProgressBarItem[];
  pathLabels?: string[];
  containerId?: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    if (items.length === 0) {
      return undefined;
    }

    const root = containerId ? document.getElementById(containerId) : null;
    const scrollTarget = root instanceof HTMLElement && isScrollableGuideContainer(root) ? root : window;
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

  if (items.length === 0 && (!pathLabels || pathLabels.length === 0)) {
    return null;
  }

  const activeIndex = Math.max(items.findIndex((item) => item.id === activeId), 0);
  const activeItem = items[activeIndex] ?? items[0] ?? null;
  const journeyPath = (pathLabels ?? []).filter(Boolean).join(' -> ');
  const currentLane = pathLabels?.[1] ?? activeItem?.label ?? 'Guide';

  return (
    <nav
      aria-label="Guide progression"
      className={[
        'sticky z-30 rounded-[1.4rem] border border-[rgba(215,161,175,0.18)] bg-white/94 p-4 shadow-[0_18px_42px_rgba(58,36,43,0.08)] backdrop-blur-[6px] md:p-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        top: 'calc(var(--guide-sticky-top, calc(4rem + 10px)) + var(--guide-sticky-nav-height, 76px) + 0.5rem)',
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {items.length > 0 ? (
              <span className="text-sm font-medium leading-7 text-[#4B3641] md:text-[0.98rem]">
                {`Step ${activeIndex + 1} of ${items.length} · ${currentLane}`}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {items.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to step ${index + 1}: ${item.label}`}
                  aria-current={isActive ? 'step' : undefined}
                  onClick={() => {
                    const root = containerId ? document.getElementById(containerId) : null;
                    const slides = root
                      ? Array.from(root.querySelectorAll<HTMLElement>('[data-guide-slide]'))
                      : Array.from(document.querySelectorAll<HTMLElement>('[data-guide-slide]'));

                    slides[index]?.scrollIntoView({
                      behavior: 'smooth',
                      inline: 'start',
                      block: window.innerWidth >= 1024 ? 'nearest' : 'start',
                    });
                  }}
                  className="group inline-flex h-4 w-4 items-center justify-center"
                >
                  <span
                    className={[
                      'block h-2.5 w-2.5 rounded-full border transition duration-200',
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

          {activeItem ? <p className="text-[0.82rem] leading-6 text-[#6A5660]">{activeItem.label}</p> : null}

          {journeyPath ? <p className="text-[0.82rem] leading-6 text-[#6A5660] md:text-[0.9rem]">{journeyPath}</p> : null}
        </div>
      </div>
    </nav>
  );
}
