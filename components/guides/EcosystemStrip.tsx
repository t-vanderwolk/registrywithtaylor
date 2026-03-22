'use client';

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
        <div className="overflow-hidden rounded-[1.2rem] border border-[rgba(215,161,175,0.18)] bg-[rgba(255,251,250,0.94)] px-3 py-3 shadow-[0_12px_30px_rgba(58,36,43,0.06)] backdrop-blur-[10px] sm:px-4">
          <div className="flex items-center justify-between gap-4 pb-2">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">TMBC Ecosystem</p>
            <p className="text-[0.8rem] text-[#6E6068]">There is a system. You are inside it.</p>
          </div>

          <motion.div
            initial="initial"
            animate={prefersReducedMotion ? 'animate' : 'animate'}
            variants={stripVariants}
            className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TMBC_ECOSYSTEM_STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;

              return (
                <motion.article
                  key={step.step}
                  variants={itemVariants}
                  className={`min-w-[15rem] snap-start rounded-2xl border p-4 transition duration-300 md:min-w-[16rem] ${
                    isActive
                      ? 'border-[rgba(199,125,151,0.36)] bg-[linear-gradient(135deg,rgba(248,233,238,0.98)_0%,rgba(244,226,232,0.96)_100%)] shadow-[0_18px_36px_rgba(199,125,151,0.16)]'
                      : 'border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(252,247,244,0.92)_100%)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#A15B72]">{step.label}</p>
                      <h3 className="mt-3 font-serif text-[1.15rem] leading-[1.08] tracking-[-0.02em] text-[#2F2430]">
                        {step.title}
                      </h3>
                    </div>
                    <span
                      className={`inline-flex h-11 min-w-[2.8rem] items-center justify-center rounded-full px-2.5 text-[0.96rem] font-semibold uppercase tracking-[0.08em] ${
                        isActive ? 'bg-white text-[#8F4C62]' : 'bg-white/84 text-[#9B7C88]'
                      }`}
                      style={{ fontFamily: 'var(--font-accent)' }}
                    >
                      {step.step}
                    </span>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
