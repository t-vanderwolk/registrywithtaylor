'use client';

import { useEffect, useState } from 'react';
import {
  getActiveGuideSectionFromScroll,
  getGuideViewportOffset,
  isScrollableGuideContainer,
  scrollToGuideSection,
} from '@/lib/guides/guideNav';

export type ProgressIndicatorItem = {
  id: string;
  label: string;
  shortLabel?: string;
};

export default function ProgressIndicator({
  items,
  containerId,
  className = '',
}: {
  items: ProgressIndicatorItem[];
  containerId?: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

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

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Guide progress"
      className={[
        'rounded-[1.8rem] border border-[rgba(196,156,94,0.14)] bg-white/78 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.07)] backdrop-blur-[10px]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/76">Guide progress</p>

      <ol className="mt-4 space-y-2.5">
        {items.map((item, index) => {
          const isActive = item.id === activeId;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollToGuideSection(item.id, containerId)}
                aria-current={isActive ? 'step' : undefined}
                className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition duration-300 ${
                  isActive ? 'bg-[#FCF4F6]' : 'hover:bg-[#FCFAFB]'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition duration-300 ${
                    isActive
                      ? 'border-[rgba(199,125,151,0.34)] bg-[linear-gradient(135deg,#D88EA2_0%,#C77D97_100%)] text-white shadow-[0_8px_20px_rgba(199,125,151,0.18)]'
                      : 'border-[rgba(196,156,94,0.16)] bg-white text-neutral-500'
                  }`}
                >
                  {item.shortLabel?.trim() || String(index + 1).padStart(2, '0')}
                </span>

                <span className={`text-sm leading-tight transition duration-300 ${isActive ? 'text-charcoal' : 'text-neutral-500'}`}>
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
