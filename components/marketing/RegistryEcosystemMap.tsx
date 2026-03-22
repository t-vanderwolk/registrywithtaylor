'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import MotionCtaContent from '@/components/ui/MotionCtaContent';
import { TMBC_ECOSYSTEM_STEPS } from '@/lib/ecosystem';

const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export default function RegistryEcosystemMap() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { amount: 0.2, margin: '-100px 0px', once: true });
  const prefersReducedMotion = useReducedMotion();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const syncScrollButtons = () => {
      setCanScrollPrev(scroller.scrollLeft > 4);
      setCanScrollNext(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 4);
    };

    syncScrollButtons();
    scroller.addEventListener('scroll', syncScrollButtons, { passive: true });
    window.addEventListener('resize', syncScrollButtons);

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            syncScrollButtons();
          })
        : null;

    observer?.observe(scroller);

    return () => {
      observer?.disconnect();
      scroller.removeEventListener('scroll', syncScrollButtons);
      window.removeEventListener('resize', syncScrollButtons);
    };
  }, []);

  const scrollCards = (direction: 'prev' | 'next') => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const distance = Math.max(scroller.clientWidth * 0.78, 280);

    scroller.scrollBy({
      left: direction === 'next' ? distance : -distance,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="registry-ecosystem-title"
      className="bg-[linear-gradient(180deg,#fffdfb_0%,#fbf6f1_100%)] py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1680px] px-6">
        <motion.div
          initial="initial"
          animate={isInView || prefersReducedMotion ? 'animate' : 'initial'}
          variants={containerVariants}
          className="space-y-10 md:space-y-12"
        >
          <motion.div variants={cardVariants} className="mx-auto max-w-3xl text-center">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-black/45">TMBC Ecosystem</p>
            <h2
              id="registry-ecosystem-title"
              className="mt-4 font-serif text-[2.2rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.7rem]"
            >
              Most people start with products.
              <br />
              We start with your life.
            </h2>
            <p className="mt-4 text-[1rem] leading-8 text-neutral-700">
              The point is not to buy everything faster. It is to move in the right order, with less second-guessing.
            </p>
          </motion.div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-x-8 top-[2.8rem] hidden h-px bg-[linear-gradient(90deg,rgba(215,161,175,0)_0%,rgba(215,161,175,0.42)_18%,rgba(196,156,94,0.24)_82%,rgba(196,156,94,0)_100%)] md:block" />

            <motion.div variants={cardVariants} className="mb-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => scrollCards('prev')}
                disabled={!canScrollPrev}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-sm tracking-[0.18em] transition duration-200 ${
                  canScrollPrev
                    ? 'border-[rgba(215,161,175,0.22)] bg-white/90 text-[#8F4C62] shadow-[0_12px_26px_rgba(58,36,43,0.06)] hover:-translate-y-0.5 hover:bg-white'
                    : 'border-[rgba(215,161,175,0.12)] bg-white/72 text-[#BEA8B1]'
                }`}
                aria-label="Scroll ecosystem cards left"
              >
                <span aria-hidden="true">&lt;-</span>
              </button>

              <button
                type="button"
                onClick={() => scrollCards('next')}
                disabled={!canScrollNext}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-sm tracking-[0.18em] transition duration-200 ${
                  canScrollNext
                    ? 'border-[rgba(215,161,175,0.22)] bg-white/90 text-[#8F4C62] shadow-[0_12px_26px_rgba(58,36,43,0.06)] hover:-translate-y-0.5 hover:bg-white'
                    : 'border-[rgba(215,161,175,0.12)] bg-white/72 text-[#BEA8B1]'
                }`}
                aria-label="Scroll ecosystem cards right"
              >
                <span aria-hidden="true">-&gt;</span>
              </button>
            </motion.div>

            <motion.div
              ref={scrollerRef}
              variants={containerVariants}
              className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 pt-2 [scrollbar-width:none] md:snap-none xl:gap-6 [&::-webkit-scrollbar]:hidden"
            >
              {TMBC_ECOSYSTEM_STEPS.map((step, index) => {
                const isBlush = index % 2 === 1;

                return (
                  <motion.article
                    key={step.step}
                    variants={cardVariants}
                    className={`relative flex min-h-[21rem] min-w-[82%] snap-center flex-col justify-between overflow-hidden rounded-[1.85rem] border p-6 shadow-[0_20px_42px_rgba(58,36,43,0.07)] sm:min-w-[20rem] md:min-h-[19rem] md:min-w-[18rem] md:snap-start md:p-7 lg:min-w-[19rem] xl:min-w-[20rem] ${
                      isBlush
                        ? 'border-[rgba(215,161,175,0.24)] bg-[linear-gradient(180deg,rgba(252,244,246,0.98)_0%,rgba(249,240,243,0.94)_100%)]'
                        : 'border-[rgba(196,156,94,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(252,248,243,0.96)_100%)]'
                    }`}
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.86),rgba(255,255,255,0))]"
                    />

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="space-y-3">
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">{step.label}</p>
                        <div className="h-px w-10 bg-[rgba(161,91,114,0.24)]" />
                      </div>
                      <span
                        className="inline-flex min-h-[3.5rem] min-w-[3.5rem] items-center justify-center rounded-full border border-white/70 bg-white/90 px-3 text-[1.18rem] font-semibold uppercase tracking-[0.08em] text-[#8F4C62] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                        style={{ fontFamily: 'var(--font-accent)' }}
                      >
                        {step.step}
                      </span>
                    </div>

                    <div className="relative mt-8 space-y-5">
                      <h3 className="max-w-[11ch] font-serif text-[2rem] leading-[0.92] tracking-[-0.04em] text-[#2F2430]">
                        {step.title}
                      </h3>
                      <p className="max-w-[18rem] text-[1rem] leading-8 text-[#5B4B55]">{step.description}</p>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>

          <motion.div variants={cardVariants} className="flex justify-center">
            <Link
              href="/guides/registry"
              className="inline-flex min-h-[48px] items-center rounded-full border border-[rgba(215,161,175,0.22)] bg-white/88 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)] shadow-[0_14px_28px_rgba(58,36,43,0.06)] transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_34px_rgba(58,36,43,0.08)]"
            >
              <MotionCtaContent align="start" showArrow underline>
                Start Your Registry Plan
              </MotionCtaContent>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
