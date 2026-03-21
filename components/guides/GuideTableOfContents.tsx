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
          <div className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-5 shadow-[0_18px_55px_rgba(58,36,43,0.08)]">
            <label htmlFor="guide-toc-select" className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">
              On this page
            </label>
            <select
              id="guide-toc-select"
              defaultValue=""
              onChange={handleSelectChange}
              className="mt-3 min-h-[44px] w-full rounded-[1rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.92)] px-4 py-3 text-base text-[#2F2430] outline-none"
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
                ? 'sticky top-24 z-20 rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-5 shadow-[0_18px_55px_rgba(58,36,43,0.08)] backdrop-blur-[6px]'
                : 'sticky top-28 max-h-[calc(100vh-8rem)] overflow-auto rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-5 shadow-[0_18px_55px_rgba(58,36,43,0.08)]'
            }
          >
            <div className={layout === 'band' ? 'flex items-center justify-between gap-4' : ''}>
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">On this page</p>
              {layout === 'band' ? (
                <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[#A15B72]/72">
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
                      ? `shrink-0 rounded-full border px-4 py-2.5 text-base leading-relaxed text-[#5B4B55] transition hover:-translate-y-0.5 hover:bg-white hover:text-[#2F2430] ${
                          item.level === 3
                            ? 'border-[rgba(215,161,175,0.12)] bg-[rgba(252,247,249,0.66)] text-[#7E6973]'
                            : 'border-[rgba(215,161,175,0.18)] bg-[rgba(255,251,247,0.96)]'
                        }`
                      : `block rounded-[1rem] px-3 py-3 text-base leading-relaxed text-[#5B4B55] transition hover:bg-[rgba(252,247,249,0.9)] hover:text-[#2F2430] ${
                          item.level === 3 ? 'pl-6 text-[#7E6973]' : 'bg-[rgba(252,247,249,0.72)]'
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
