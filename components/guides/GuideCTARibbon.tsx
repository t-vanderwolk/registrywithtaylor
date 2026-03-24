import Link from 'next/link';
import type { ReactNode } from 'react';
import MotionCtaContent from '@/components/ui/MotionCtaContent';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

type GuideCTARibbonAction = {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'accent';
};

export default function GuideCTARibbon({
  id,
  eyebrow = 'Next step',
  title,
  description,
  primaryCta,
  secondaryCta,
  actionsSlot,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta?: GuideCTARibbonAction | null;
  secondaryCta?: GuideCTARibbonAction | null;
  actionsSlot?: ReactNode;
}) {
  if (!primaryCta && !secondaryCta && !actionsSlot) {
    return null;
  }

  const actions = [
    primaryCta
      ? {
          ...primaryCta,
          variant: primaryCta.variant ?? 'primary',
        }
      : null,
    secondaryCta
      ? {
          ...secondaryCta,
          variant: secondaryCta.variant ?? 'secondary',
        }
      : null,
  ].filter(Boolean) as Required<GuideCTARibbonAction>[];

  return (
    <RevealOnScroll>
      <section
        id={id}
        className="rounded-[1.6rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(251,245,239,0.97),rgba(255,250,252,0.95))] p-4 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:rounded-[2rem] sm:p-5 md:p-7"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">{eyebrow}</p>
            <h2 className="text-[1.8rem] font-medium leading-[1.04] tracking-[-0.03em] text-[#2F2430] sm:text-3xl md:text-[2.3rem]">{title}</h2>
            <p className="text-[1rem] leading-7 text-[#5B4B55] md:text-lg md:leading-8">{description}</p>
          </div>

          {actionsSlot ? (
            <div className="flex flex-col gap-3 sm:flex-row">{actionsSlot}</div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              {actions.map((action) => {
                const isPrimary = action.variant === 'primary';
                const isAccent = action.variant === 'accent';

                return (
                  <Link
                    key={`${action.href}-${action.label}`}
                    href={action.href}
                    className={`inline-flex min-h-[46px] w-full items-center justify-center rounded-full px-5 py-3 text-center text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:w-auto ${
                      isPrimary
                        ? 'border border-[rgba(215,161,175,0.26)] bg-[linear-gradient(135deg,#D88EA2_0%,#C77D97_100%)] text-white shadow-[0_16px_34px_rgba(199,125,151,0.24)]'
                        : isAccent
                          ? 'border border-[rgba(215,161,175,0.26)] bg-[linear-gradient(135deg,#D88EA2_0%,#C77D97_100%)] text-white shadow-[0_16px_34px_rgba(199,125,151,0.24)]'
                          : 'border border-[rgba(161,91,114,0.18)] bg-white/88 text-[#4B3641]'
                    }`}
                  >
                    <MotionCtaContent showArrow>{action.label}</MotionCtaContent>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </RevealOnScroll>
  );
}
