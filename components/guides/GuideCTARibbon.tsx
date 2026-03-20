import Link from 'next/link';
import type { ReactNode } from 'react';
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
        className="rounded-2xl border border-[#F1D9DF] bg-gradient-to-br from-[#F8EDEE] to-[#FDF8F9] p-6 shadow-sm md:p-10"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
            <h2 className="font-serif text-2xl tracking-tight text-charcoal md:text-3xl">{title}</h2>
            <p className="text-base leading-relaxed text-neutral-700 md:text-lg">{description}</p>
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
                    className={`inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 hover:scale-[1.02] hover:shadow-md ${
                      isPrimary
                        ? 'bg-charcoal text-white'
                        : isAccent
                          ? 'border border-[rgba(215,161,175,0.26)] bg-[linear-gradient(135deg,#D88EA2_0%,#C77D97_100%)] text-white shadow-[0_16px_34px_rgba(199,125,151,0.24)]'
                          : 'border border-[rgba(215,161,175,0.36)] bg-white/90 text-charcoal'
                    }`}
                  >
                    <span>{action.label}</span>
                    <span aria-hidden="true" className="ml-2">
                      -&gt;
                    </span>
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
