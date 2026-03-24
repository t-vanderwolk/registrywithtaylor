'use client';

import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { TMBC_ECOSYSTEM_STEPS } from '@/lib/ecosystem';

const stripVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
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

export default function EcosystemStrip({ currentStep }: { currentStep: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section aria-label="TMBC ecosystem path" className="w-full">
      <div className="mx-auto w-full max-w-[1680px] px-3 sm:px-5 xl:px-0">
        <div className="relative overflow-hidden rounded-[1rem] border border-[rgba(215,161,175,0.18)] bg-[rgba(255,251,250,0.94)] px-2.5 py-2.5 shadow-[0_10px_24px_rgba(58,36,43,0.06)] backdrop-blur-[10px] sm:px-4 sm:py-3">
          <div className="flex flex-col items-start justify-between gap-1 pb-1.5 sm:flex-row sm:items-center sm:gap-4">
            <p className="text-[0.64rem] uppercase tracking-[0.2em] text-[#A15B72]">TMBC Ecosystem</p>
            <p className="text-[0.7rem] text-[#6E6068] sm:hidden">{`Step ${currentStep} of ${TMBC_ECOSYSTEM_STEPS.length} · swipe through the path`}</p>
            <p className="hidden text-[0.72rem] text-[#6E6068] sm:block sm:text-[0.78rem]">There is a system. You are inside it.</p>
          </div>

          <motion.div
            initial="initial"
            animate={prefersReducedMotion ? 'animate' : 'animate'}
            variants={stripVariants}
            className="-mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-1 pb-1 pr-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TMBC_ECOSYSTEM_STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;

              return (
                <Link
                  key={step.step}
                  href={step.href}
                  aria-current={isActive ? 'page' : undefined}
                  className="block min-w-[9.5rem] snap-start outline-none sm:min-w-[12rem] md:min-w-[13.25rem]"
                >
                  <motion.article
                    variants={itemVariants}
                    className={`h-full rounded-[1.1rem] border p-2.5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(58,36,43,0.10)] focus-visible:ring-2 focus-visible:ring-[#A15B72]/30 sm:rounded-[1.2rem] sm:p-3.5 md:min-w-[13.25rem] ${
                      isActive
                        ? 'border-[rgba(199,125,151,0.36)] bg-[linear-gradient(135deg,rgba(248,233,238,0.98)_0%,rgba(244,226,232,0.96)_100%)] shadow-[0_18px_36px_rgba(199,125,151,0.16)]'
                        : 'border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(252,247,244,0.92)_100%)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[0.58rem] uppercase tracking-[0.18em] text-[#A15B72]">{step.label}</p>
                        <h3 className="mt-2 font-serif text-[0.88rem] leading-[1.05] tracking-[-0.02em] text-[#2F2430] sm:text-[1.02rem]">
                          {step.title}
                        </h3>
                      </div>
                      <span
                        className={`inline-flex h-9 min-w-[2.35rem] items-center justify-center rounded-full px-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] sm:h-10 sm:min-w-[2.55rem] sm:text-[0.88rem] ${
                          isActive ? 'bg-white text-[#8F4C62]' : 'bg-white/84 text-[#9B7C88]'
                        }`}
                        style={{ fontFamily: 'var(--font-accent)' }}
                      >
                        {step.step}
                      </span>
                    </div>
                  </motion.article>
                </Link>
              );
            })}
          </motion.div>

          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-[linear-gradient(90deg,rgba(255,251,250,0)_0%,rgba(255,251,250,0.9)_72%,rgba(255,251,250,0.98)_100%)] sm:w-12" />
        </div>
      </div>
    </section>
  );
}
