'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import MotionCtaContent from '@/components/ui/MotionCtaContent';
import { fadeIn, fadeInUp } from '@/lib/animation';

type StartHereCard = {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
};

const startHereCards: StartHereCard[] = [
  {
    title: "I Don't Know Where to Start",
    description:
      "Start with a simple, structured plan so you're not trying to figure everything out at once.",
    ctaLabel: 'Start My Plan',
    href: '/consultation',
  },
  {
    title: 'I Want to Build My Registry',
    description: 'Follow a step-by-step system to choose what you need - and when to buy it.',
    ctaLabel: 'Build My Registry',
    href: '/academy/registry/what-to-register-first',
  },
  {
    title: "I'm Comparing Gear",
    description:
      'Explore strollers, car seats, and gear with guidance that focuses on real-life use.',
    ctaLabel: 'Explore Gear',
    href: '/academy/gear/stroller-foundations',
  },
];

const cardStaggerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function StartHereSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { amount: 0.2, margin: '-100px 0px', once: true });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="start-here-title"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdfb_0%,#fbf6f1_100%)] py-8 md:py-14"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          ref={sectionRef}
          className="relative overflow-hidden rounded-[1.6rem] border border-[rgba(220,182,193,0.34)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(252,247,244,0.96)_48%,rgba(249,241,236,0.98)_100%)] px-5 py-6 shadow-[0_24px_64px_rgba(72,49,56,0.08)] sm:rounded-[2.1rem] sm:px-8 sm:py-10 lg:px-10 lg:py-12"
          initial="initial"
          animate={isInView || prefersReducedMotion ? 'animate' : 'initial'}
          variants={fadeIn}
        >
          <div className="pointer-events-none absolute left-[-3.5rem] top-[-3rem] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.2)_0%,rgba(232,154,174,0)_72%)] blur-2xl" />
          <div className="pointer-events-none absolute bottom-[-3.5rem] right-[-2.5rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(196,156,94,0.12)_0%,rgba(196,156,94,0)_74%)] blur-2xl" />

          <motion.div variants={fadeInUp} className="relative z-[1] max-w-2xl">
              <h2
                id="start-here-title"
                className="font-serif text-[1.95rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.55rem]"
              >
                Start Here
              </h2>
              <p className="mt-4 max-w-[38rem] text-[1rem] leading-8 text-neutral-700">
                Not sure where to begin? Choose what feels closest - we&apos;ll guide you from there.
              </p>
            </motion.div>

          <div className="relative z-[1] mt-8">
            <div className="mb-3 flex items-center justify-between md:hidden">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/78">Choose a path</p>
              <p className="text-[0.84rem] leading-6 text-neutral-600">Swipe for more</p>
            </div>

            <div className="relative">
              <motion.div
                variants={cardStaggerVariants}
                className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 pr-10 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 md:pr-0 [&::-webkit-scrollbar]:hidden"
              >
                {startHereCards.map((card) => (
                  <motion.div
                    key={card.title}
                    variants={fadeInUp}
                    className="group h-full min-w-[84vw] snap-start md:min-w-0"
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : {
                            y: -6,
                            scale: 1.01,
                            transition: {
                              duration: 0.2,
                              ease: 'easeOut',
                            },
                          }
                    }
                  >
                    <article className="flex h-full flex-col rounded-[1.45rem] border border-[rgba(215,161,175,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(252,247,244,0.93)_100%)] p-5 shadow-[0_14px_34px_rgba(72,49,56,0.05)] transition-shadow duration-200 group-hover:shadow-[0_22px_52px_rgba(72,49,56,0.09)] sm:rounded-2xl sm:p-6">
                      <h3 className="font-serif text-[1.34rem] leading-[1.08] tracking-[-0.03em] text-neutral-900 sm:text-[1.58rem]">
                        {card.title}
                      </h3>
                      <p className="mt-4 text-[0.98rem] leading-7 text-neutral-700">{card.description}</p>
                      <Link
                        href={card.href}
                        className="mt-auto inline-flex min-h-[44px] items-center pt-6 text-sm font-semibold text-[var(--color-accent-dark)] transition-opacity duration-200 hover:opacity-75"
                      >
                        <MotionCtaContent align="start" showArrow underline>
                          {card.ctaLabel}
                        </MotionCtaContent>
                      </Link>
                    </article>
                  </motion.div>
                ))}
              </motion.div>

              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-[linear-gradient(90deg,rgba(251,246,241,0)_0%,rgba(251,246,241,0.92)_72%,rgba(251,246,241,0.98)_100%)] md:hidden" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
