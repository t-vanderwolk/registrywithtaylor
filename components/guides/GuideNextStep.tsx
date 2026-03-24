'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { GuideStageLabel } from '@/lib/guides/guideFlow';

export default function GuideNextStep({
  label,
  href,
  description,
  stage,
  mode = 'link',
  direction = 'next',
  layout = 'button',
  className = '',
}: {
  label?: string;
  href?: string;
  description?: string;
  stage?: GuideStageLabel;
  mode?: 'link' | 'carousel';
  direction?: 'next' | 'prev';
  layout?: 'button' | 'footer';
  className?: string;
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [hasTarget, setHasTarget] = useState(true);

  useEffect(() => {
    if (mode !== 'carousel') {
      return;
    }

    const updateTargetState = () => {
      const button = buttonRef.current;
      if (!button) {
        return;
      }

      const currentSlide = button.closest<HTMLElement>('[data-guide-slide]');
      const container = currentSlide?.closest<HTMLElement>('[data-guide-carousel="true"]');
      const slides = container ? Array.from(container.querySelectorAll<HTMLElement>('[data-guide-slide]')) : [];
      const currentIndex = currentSlide ? slides.findIndex((slide) => slide === currentSlide) : -1;
      const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

      setHasTarget(targetIndex >= 0 && targetIndex < slides.length);
    };

    updateTargetState();
    window.addEventListener('resize', updateTargetState);

    return () => {
      window.removeEventListener('resize', updateTargetState);
    };
  }, [direction, mode]);

  if (mode === 'carousel') {
    if (!hasTarget) {
      return null;
    }

    const buttonLabel = direction === 'prev' ? '<- Back' : 'Continue ->';
    const buttonClassName = [
      'inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/92 px-5 py-3 text-[0.98rem] font-medium text-[#4B3641] shadow-[0_12px_28px_rgba(58,36,43,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(58,36,43,0.12)] sm:w-auto',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const button = (
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          const button = buttonRef.current;
          if (!button) {
            return;
          }

          const currentSlide = button.closest<HTMLElement>('[data-guide-slide]');
          const container = currentSlide?.closest<HTMLElement>('[data-guide-carousel="true"]');
          const slides = container ? Array.from(container.querySelectorAll<HTMLElement>('[data-guide-slide]')) : [];
          const currentIndex = currentSlide ? slides.findIndex((slide) => slide === currentSlide) : -1;
          const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
          const targetSlide = targetIndex >= 0 ? slides[targetIndex] : null;

          targetSlide?.scrollIntoView({
            behavior: 'smooth',
            inline: 'start',
            block: window.innerWidth >= 1024 ? 'nearest' : 'start',
          });
        }}
        className={buttonClassName}
      >
        {label?.trim() || buttonLabel}
      </button>
    );

    if (layout === 'footer') {
      return (
        <div className="mt-5 rounded-[1.25rem] border border-[rgba(161,91,114,0.12)] bg-white/72 p-3.5 shadow-[0_10px_24px_rgba(58,36,43,0.04)] sm:mt-6 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:p-4">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">Next section</p>
            <p className="mt-1 text-[0.98rem] leading-7 text-[#6A5660]">Continue -&gt;</p>
          </div>
          {button}
        </div>
      );
    }

    return button;
  }

  if (!href || !label) {
    return null;
  }

  return (
    <Link
      href={href}
      className={[
        'group rounded-[1.35rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.9)] p-4 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(58,36,43,0.10)] sm:rounded-[1.5rem] sm:p-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {stage ? (
        <span className="inline-flex min-h-[32px] items-center rounded-full bg-[rgba(215,161,175,0.14)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-[#8F4C62]">
          {stage}
        </span>
      ) : null}
      <h3 className="mt-4 text-[1.28rem] font-medium leading-[1.14] tracking-[-0.02em] text-[#2F2430] md:text-[1.34rem]">{label}</h3>
      <p className="mt-3 text-[1.02rem] leading-8 text-[#5B4B55] md:text-[1.06rem]">{description}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-[#8F4C62]">
        <span>Continue</span>
        <span aria-hidden="true">-&gt;</span>
      </span>
    </Link>
  );
}
