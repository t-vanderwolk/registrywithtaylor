'use client';

import { useEffect, useState } from 'react';

export type ProgressIndicatorItem = {
  id: string;
  label: string;
  shortLabel?: string;
};

const observerThresholds = [0, 0.2, 0.35, 0.5, 0.7, 0.9];

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
                onClick={() => {
                  document.getElementById(item.id)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }}
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
