'use client';

import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import MotionCtaContent from '@/components/ui/MotionCtaContent';
import { scaleHover } from '@/lib/animation';

type EcosystemFlowStep = {
  stepLabel: string;
  title: string;
  description: string;
};

type EcosystemFlowProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description: string;
  steps: EcosystemFlowStep[];
  cta?: {
    href: string;
    label: string;
  };
  showLine?: boolean;
};

const flowVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const lineVariants: Variants = {
  hidden: {
    opacity: 0,
    scaleX: 0,
  },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

const flowItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export default function EcosystemFlow({
  id,
  eyebrow,
  title,
  description,
  steps,
  cta,
  showLine = true,
}: EcosystemFlowProps) {
  const prefersReducedMotion = useReducedMotion();
  const gridClassName =
    steps.length >= 5
      ? 'grid justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      : steps.length === 4
        ? 'grid justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-4'
        : steps.length === 3
          ? 'grid justify-items-center gap-8 md:grid-cols-3'
          : 'grid justify-items-center gap-8 md:grid-cols-2';

  return (
    <motion.section
      id={id}
      className="bg-[linear-gradient(180deg,#fffdfb_0%,#f8f2ea_100%)] py-24 md:py-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={flowVariants}
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div variants={flowItemVariants} className="mx-auto max-w-4xl text-center">
          {eyebrow ? (
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
          ) : null}
          <h2 className="mt-4 font-serif text-[2.15rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.55rem]">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-[44rem] text-[1rem] leading-8 text-neutral-700">{description}</p>
        </motion.div>

        <div className="relative mt-10">
          {showLine ? (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-[8%] right-[8%] top-[3.15rem] hidden h-px origin-left bg-[linear-gradient(90deg,rgba(196,156,94,0.12)_0%,rgba(216,137,160,0.26)_48%,rgba(196,156,94,0.12)_100%)] xl:block"
              variants={lineVariants}
            />
          ) : null}

          <div className={gridClassName}>
            {steps.map((step) => (
              <motion.div
                key={step.stepLabel}
                variants={flowItemVariants}
                {...(prefersReducedMotion ? {} : scaleHover)}
                className="group h-full w-full"
              >
                <article className="mx-auto flex h-full w-full max-w-[19rem] flex-col items-center rounded-[1.9rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcf7f4_100%)] p-6 text-center shadow-[0_16px_38px_rgba(55,40,46,0.05)] transition-shadow duration-200 group-hover:shadow-[0_24px_52px_rgba(55,40,46,0.08)]">
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                    {step.stepLabel}
                  </p>
                  <h3 className="mt-4 max-w-[10ch] font-serif text-[1.65rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-[18rem] text-[0.98rem] leading-8 text-neutral-700">{step.description}</p>
                </article>
              </motion.div>
            ))}
          </div>
        </div>

        {cta ? (
          <motion.div variants={flowItemVariants} className="mt-10 flex justify-center">
            <Link
              href={cta.href}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(196,156,94,0.16)] bg-white/82 px-5 py-3 text-sm font-semibold text-[var(--color-accent-dark)] shadow-[0_10px_24px_rgba(55,40,46,0.04)]"
            >
              <MotionCtaContent showArrow>{cta.label}</MotionCtaContent>
            </Link>
          </motion.div>
        ) : null}
      </div>
    </motion.section>
  );
}
