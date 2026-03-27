'use client';

import { Children, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import type { GuideProgressBarItem } from '@/components/guides/GuideProgressBar';
import GuideStickyNav from '@/components/guides/GuideStickyNav';
import EcosystemStrip from '@/components/guides/EcosystemStrip';

type GuideCarouselLayoutLink = {
  href: string;
  label: string;
};

export default function GuideCarouselLayout({
  containerId,
  items,
  backLink,
  ecosystemCurrentStep,
  journeyPathLabels,
  className = '',
  children,
}: {
  containerId: string;
  items: GuideProgressBarItem[];
  backLink?: GuideCarouselLayoutLink | null;
  ecosystemCurrentStep?: number | null;
  journeyPathLabels?: string[];
  className?: string;
  children: ReactNode;
}) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const childCount = useMemo(() => Children.count(children), [children]);
  const [activeIndex, setActiveIndex] = useState(0);

  const getSlides = () => {
    const node = carouselRef.current;
    return node ? Array.from(node.querySelectorAll<HTMLElement>('[data-guide-slide]')) : [];
  };

  const getResolvedActiveIndex = () => {
    const node = carouselRef.current;
    if (!node) {
      return 0;
    }

    const slides = getSlides();
    if (slides.length === 0) {
      return 0;
    }

    const viewportCenter = node.scrollLeft + node.clientWidth / 2;
    const currentIndex = slides.findIndex((slide) => {
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
      return Math.abs(slideCenter - viewportCenter) < slide.clientWidth / 2;
    });

    return currentIndex >= 0 ? currentIndex : 0;
  };

  const scrollToIndex = (index: number) => {
    const slides = getSlides();
    const targetSlide = slides[index];

    targetSlide?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: window.innerWidth >= 1024 ? 'nearest' : 'start',
    });
  };

  const scrollToNext = () => {
    scrollToIndex(Math.min(activeIndex + 1, childCount - 1));
  };

  const scrollToPrev = () => {
    scrollToIndex(Math.max(activeIndex - 1, 0));
  };

  useEffect(() => {
    const node = carouselRef.current;
    if (!node) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!node.matches(':focus-visible') && document.activeElement !== node) {
        return;
      }

      const slides = Array.from(node.querySelectorAll<HTMLElement>('[data-guide-slide]'));
      if (slides.length === 0) {
        return;
      }

      const resolvedIndex = getResolvedActiveIndex();

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollToIndex(Math.min(resolvedIndex + 1, slides.length - 1));
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollToIndex(Math.max(resolvedIndex - 1, 0));
      }

      if (event.key === 'Home') {
        event.preventDefault();
        scrollToIndex(0);
      }

      if (event.key === 'End') {
        event.preventDefault();
        scrollToIndex(slides.length - 1);
      }
    };

    const updateActiveIndex = () => {
      setActiveIndex(getResolvedActiveIndex());
    };

    node.addEventListener('keydown', handleKeyDown);
    node.addEventListener('scroll', updateActiveIndex, { passive: true });
    window.addEventListener('resize', updateActiveIndex);
    updateActiveIndex();

    return () => {
      node.removeEventListener('keydown', handleKeyDown);
      node.removeEventListener('scroll', updateActiveIndex);
      window.removeEventListener('resize', updateActiveIndex);
    };
  }, [childCount]);

  return (
    <div className={['relative space-y-2', className].filter(Boolean).join(' ')}>
      <div
        className="fixed inset-x-0 z-40 px-3 sm:px-5 xl:px-0"
        style={{ top: 'var(--guide-sticky-top, calc(4rem + 10px))' }}
      >
        <div className="mx-auto w-full max-w-[1680px]">
          <GuideStickyNav
            items={items}
            containerId={containerId}
            backLink={backLink}
            pathLabels={journeyPathLabels}
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="shrink-0"
        style={{ height: 'calc(var(--guide-sticky-nav-height, 76px) + 0.25rem)' }}
      />

      {typeof ecosystemCurrentStep === 'number' ? (
        <div className="pb-2">
          <EcosystemStrip currentStep={ecosystemCurrentStep} />
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[1680px]">
        <div className="relative">
          {childCount > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={scrollToPrev}
                disabled={activeIndex === 0}
                className="absolute left-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/92 text-xl text-[#4B3641] shadow-[0_16px_30px_rgba(58,36,43,0.12)] transition duration-300 hover:-translate-y-[calc(50%+1px)] hover:shadow-[0_20px_40px_rgba(58,36,43,0.16)] disabled:cursor-not-allowed disabled:opacity-38 lg:inline-flex"
              >
                <span aria-hidden="true">&lt;</span>
              </button>

              <button
                type="button"
                aria-label="Next slide"
                onClick={scrollToNext}
                disabled={activeIndex >= childCount - 1}
                className="absolute right-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/92 text-xl text-[#4B3641] shadow-[0_16px_30px_rgba(58,36,43,0.12)] transition duration-300 hover:-translate-y-[calc(50%+1px)] hover:shadow-[0_20px_40px_rgba(58,36,43,0.16)] disabled:cursor-not-allowed disabled:opacity-38 lg:inline-flex"
              >
                <span aria-hidden="true">&gt;</span>
              </button>
            </>
          ) : null}

          <div
            id={containerId}
            ref={carouselRef}
            tabIndex={0}
            data-guide-carousel="true"
            aria-label="Guide carousel"
            className="scroll-smooth outline-none lg:flex lg:items-start lg:snap-x lg:snap-mandatory lg:gap-4 lg:overflow-x-auto lg:overflow-y-hidden lg:pr-[5rem] lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
          >
            {children}
          </div>

          {childCount > 1 && activeIndex < childCount - 1 ? (
            <div className="pointer-events-none absolute inset-y-4 right-0 hidden w-24 items-center justify-end bg-[linear-gradient(90deg,rgba(255,252,251,0)_0%,rgba(255,252,251,0.88)_42%,rgba(255,252,251,0.98)_100%)] lg:flex">
              <div className="mr-4 rounded-full border border-[rgba(161,91,114,0.14)] bg-white/88 px-3 py-2 text-[0.68rem] uppercase tracking-[0.16em] text-[#8F4C62] shadow-[0_12px_24px_rgba(58,36,43,0.08)] animate-pulse">
                Swipe to continue -&gt;
              </div>
            </div>
          ) : null}

          {childCount > 1 && activeIndex > 0 ? (
            <div className="pointer-events-none absolute inset-y-6 left-0 hidden w-16 bg-[linear-gradient(270deg,rgba(255,252,251,0)_0%,rgba(255,252,251,0.92)_76%,rgba(255,252,251,0.98)_100%)] lg:block" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
