'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ProgressIndicatorItem } from '@/components/guides/ProgressIndicator';

type GuideStickyNavLink = {
  href: string;
  label: string;
};

const observerThresholds = [0, 0.2, 0.35, 0.5, 0.7, 0.9];

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

  useEffect(() => {
    if (items.length === 0) {
      return undefined;
    }

    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return undefined;
    }

    const root = containerId ? document.getElementById(containerId) : null;
    const visibilityById = new Map<string, number>();

    const updateActiveSection = () => {
      const [nextActiveId] =
        [...visibilityById.entries()].sort((left, right) => right[1] - left[1])[0] ?? [items[0]?.id ?? '', 0];

      if (nextActiveId) {
        setActiveId(nextActiveId);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibilityById.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        updateActiveSection();
      },
      {
        root,
        rootMargin: '-28% 0px -42% 0px',
        threshold: observerThresholds,
      },
    );

    for (const section of sections) {
      visibilityById.set(section.id, 0);
      observer.observe(section);
    }

    updateActiveSection();

    return () => {
      observer.disconnect();
    };
  }, [containerId, items]);

  const activeItem = items.find((item) => item.id === activeId) ?? items[0] ?? null;
  const resolvedBackLink = backLink ?? { href: '/guides', label: 'Back to TMBC Hub' };

  if (!resolvedBackLink && items.length === 0) {
    return null;
  }

  return (
    <div className={['sticky top-3 z-30', className].filter(Boolean).join(' ')}>
      <nav
        aria-label="Guide navigation"
        className="overflow-hidden rounded-[1.6rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(255,252,251,0.88)] shadow-[0_18px_44px_rgba(58,36,43,0.08)] backdrop-blur-[12px]"
      >
        <div className="flex flex-col gap-3 p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-2.5">
            {resolvedBackLink ? (
              <Link
                href={resolvedBackLink.href}
                className="inline-flex min-h-[44px] items-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/90 px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-[#8F4C62] transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                {resolvedBackLink.label}
              </Link>
            ) : null}

            {activeItem ? (
              <div className="inline-flex min-h-[44px] items-center rounded-full bg-[rgba(250,244,246,0.95)] px-4 py-2 text-[0.68rem] uppercase tracking-[0.2em] text-[#9F556D]">
                <span>Now viewing</span>
                <span className="ml-2 text-sm font-medium normal-case tracking-normal text-[#2F2430]">{activeItem.label}</span>
              </div>
            ) : null}
          </div>

          {items.length > 1 ? (
            <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {items.map((item, index) => {
                const isActive = item.id === activeId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      document.getElementById(item.id)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                    }}
                    aria-current={isActive ? 'step' : undefined}
                    className={`inline-flex min-h-[44px] shrink-0 items-center rounded-full border px-4 py-2 text-sm transition duration-300 ${
                      isActive
                        ? 'border-[rgba(199,125,151,0.3)] bg-[linear-gradient(135deg,#D88EA2_0%,#C77D97_100%)] text-white shadow-[0_10px_24px_rgba(199,125,151,0.18)]'
                        : 'border-[rgba(215,161,175,0.16)] bg-white/82 text-[#5B4B55] hover:-translate-y-0.5 hover:shadow-sm'
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
