'use client';

import type { ChangeEvent } from 'react';
import type { GuideTocItem } from '@/lib/guides/articleOutline';

function navigateToAnchor(href: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.location.href = href;
}

export default function GuideTableOfContents({
  currentPath,
  items,
  mode = 'responsive',
  layout = 'sidebar',
}: {
  currentPath: string;
  items: GuideTocItem[];
  mode?: 'mobile' | 'desktop' | 'responsive';
  layout?: 'sidebar' | 'band';
}) {
  if (items.length === 0) {
    return null;
  }

  const showMobile = mode === 'mobile' || mode === 'responsive';
  const showDesktop = mode === 'desktop' || mode === 'responsive';

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextHref = event.target.value;
    if (!nextHref) {
      return;
    }

    navigateToAnchor(nextHref);
  };

  return (
    <>
      {showMobile ? (
        <div className="lg:hidden">
          <div className="rounded-[1.5rem] border border-black/6 bg-white/88 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
            <label htmlFor="guide-toc-select" className="text-[0.72rem] uppercase tracking-[0.2em] text-black/48">
              On this page
            </label>
            <select
              id="guide-toc-select"
              defaultValue=""
              onChange={handleSelectChange}
              className="mt-3 w-full rounded-xl border border-black/8 bg-[rgba(248,243,238,0.92)] px-4 py-3 text-sm text-neutral-800 outline-none"
            >
              <option value="" disabled>
                Jump to a section
              </option>
              {items.map((item) => (
                <option key={item.id} value={`${currentPath}#${item.id}`}>
                  {item.level === 3 ? `- ${item.label}` : item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      {showDesktop ? (
        <aside className="hidden lg:block">
          <div
            className={
              layout === 'band'
                ? 'sticky top-24 z-20 rounded-[1.85rem] border border-[rgba(196,156,94,0.18)] bg-white/88 p-4 shadow-[0_18px_42px_rgba(0,0,0,0.05)] backdrop-blur-[6px] xl:p-5'
                : 'sticky top-28 max-h-[calc(100vh-8rem)] overflow-auto rounded-[1.6rem] border border-black/6 bg-white/90 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)]'
            }
          >
            <div className={layout === 'band' ? 'flex items-center justify-between gap-4' : ''}>
              <p className="text-[0.72rem] uppercase tracking-[0.2em] text-black/48">On this page</p>
              {layout === 'band' ? (
                <p className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-accent-dark)]/72">
                  Jump through the guide
                </p>
              ) : null}
            </div>
            <nav
              className={
                layout === 'band'
                  ? 'mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                  : 'mt-4 space-y-2'
              }
              aria-label="Guide table of contents"
            >
              {items.map((item) => (
                <a
                  key={item.id}
                  href={`${currentPath}#${item.id}`}
                  className={
                    layout === 'band'
                      ? `shrink-0 rounded-full border px-4 py-2.5 text-sm leading-6 text-neutral-700 transition hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.28)] hover:bg-white hover:text-neutral-900 ${
                          item.level === 3
                            ? 'border-black/6 bg-[rgba(252,247,242,0.66)] text-black/58'
                            : 'border-[rgba(196,156,94,0.18)] bg-[rgba(255,251,247,0.96)]'
                        }`
                      : `block rounded-[1rem] px-3 py-2 text-sm leading-6 text-neutral-700 transition hover:bg-[rgba(248,243,238,0.9)] hover:text-neutral-900 ${
                          item.level === 3 ? 'pl-6 text-black/58' : 'bg-[rgba(252,247,242,0.72)]'
                        }`
                  }
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      ) : null}
    </>
  );
}
