import Link from 'next/link';
import type { ReactNode } from 'react';
import GuideGlyph from '@/components/guides/GuideGlyph';
import type { GuideHubIconKey } from '@/lib/guides/hubs';

export const GUIDE_SECTION_FRAME_CLASSNAME =
  'rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] md:p-8';

export const GUIDE_SECTION_FRAME_WARM_CLASSNAME =
  'rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,#fffdfd_0%,#fbf4f7_100%)] p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] md:p-8';

export const GUIDE_SUPPORT_CARD_CLASSNAME =
  'rounded-[1.45rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.9)] p-5';

export function GuideSectionHeading({
  eyebrow,
  title,
  description,
  titleAs = 'h2',
  className = '',
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  titleAs?: 'h2' | 'h3';
  className?: string;
}) {
  const TitleTag = titleAs;

  return (
    <div className={['space-y-3', className].filter(Boolean).join(' ')}>
      <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">{eyebrow}</p>
      <TitleTag className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.35rem]">
        {title}
      </TitleTag>
      {description ? (
        <div className="max-w-4xl text-base leading-8 text-[#5B4B55] md:text-lg">{description}</div>
      ) : null}
    </div>
  );
}

export function GuideRouteCard({
  href,
  title,
  description,
  icon,
  eyebrow = 'Next read',
  ctaLabel = 'Open guide',
  stage,
  bestFor,
  compact = false,
  className = '',
}: {
  href: string;
  title: string;
  description: string;
  icon?: GuideHubIconKey;
  eyebrow?: string;
  ctaLabel?: string;
  stage?: string;
  bestFor?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        'group flex h-full min-w-0 flex-col rounded-[1.5rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.92)] p-5 shadow-[0_16px_36px_rgba(58,36,43,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(161,91,114,0.24)] hover:bg-white hover:shadow-[0_22px_52px_rgba(58,36,43,0.11)]',
        compact ? 'p-4 md:p-5' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 text-[#A15B72]">
          {icon ? (
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
              <GuideGlyph icon={icon} />
            </span>
          ) : null}
          <span className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">{eyebrow}</span>
        </div>

        {stage ? (
          <span className="inline-flex min-h-[32px] items-center rounded-full bg-[rgba(215,161,175,0.14)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-[#8F4C62]">
            {stage}
          </span>
        ) : null}
      </div>

      <h3 className="mt-4 font-serif text-[1.35rem] leading-[1.08] tracking-[-0.03em] text-[#2F2430] md:text-[1.5rem]">
        {title}
      </h3>
      <p className="mt-3 text-base leading-8 text-[#5B4B55]">{description}</p>

      {bestFor ? (
        <p className="mt-4 rounded-[1rem] border border-[rgba(215,161,175,0.14)] bg-white/92 px-3 py-2.5 text-[0.98rem] leading-[1.68] text-[#5B4B55]">
          <span className="mr-2 text-[0.64rem] uppercase tracking-[0.13em] text-[var(--color-accent-dark)]/82">
            Best for
          </span>
          <span>{bestFor.replace(/^best for\s+/i, '').trim()}</span>
        </p>
      ) : null}

      <div className="mt-auto pt-5 text-sm font-medium uppercase tracking-[0.16em] text-[#8F4C62]">
        <span>{ctaLabel}</span>
        <span aria-hidden="true" className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
          -&gt;
        </span>
      </div>
    </Link>
  );
}
