import Link from 'next/link';
import type { ReactNode } from 'react';
import DecisionTag from '@/components/academy/DecisionTag';
import type { DecisionTagLabel } from '@/lib/academy/decisionSupport';

type AcademyConnectionPath = {
  href: string;
  label: string;
  current?: boolean;
};

export function AcademySectionHeading({
  eyebrow,
  title,
  description,
  note,
  className = '',
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  note?: ReactNode;
  className?: string;
}) {
  return (
    <div className={['max-w-3xl min-w-0', className].filter(Boolean).join(' ')}>
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose,#A15B72)]">{eyebrow}</p>
      <h2 className="mt-4 break-words font-serif text-[clamp(2rem,4vw,2.8rem)] leading-[1.08] tracking-[-0.04em] text-[var(--tmbc-blog-charcoal,#2F2430)]">
        {title}
      </h2>
      <div className="mt-4 h-1 w-[78px] rounded-full bg-[linear-gradient(90deg,rgba(232,154,174,0.9)_0%,rgba(215,161,175,1)_100%)] shadow-[0_10px_24px_rgba(232,154,174,0.18)]" />
      {description ? (
        <div className="mt-5 break-words text-[1rem] leading-8 text-[var(--tmbc-blog-soft-text,#5B4B55)] sm:text-[1.05rem]">
          {description}
        </div>
      ) : null}
      {note ? <div className="academy-handwritten-aside mt-4">{note}</div> : null}
    </div>
  );
}

export function AcademyRouteCard({
  href,
  title,
  description,
  ctaLabel,
  eyebrow,
  tag,
  className = '',
}: {
  href?: string;
  title: string;
  description: string;
  ctaLabel: string;
  eyebrow?: string;
  tag?: DecisionTagLabel;
  className?: string;
}) {
  const classes = [
    'group flex h-full min-w-0 flex-col rounded-[1.7rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,247,250,0.92)_100%)] p-5 shadow-[0_20px_48px_rgba(58,36,43,0.08)] transition duration-300 sm:p-6',
    href
      ? 'hover:-translate-y-1 hover:border-[rgba(161,91,114,0.28)] hover:bg-white hover:shadow-[0_28px_62px_rgba(58,36,43,0.12)]'
      : 'opacity-85',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {tag ? <DecisionTag label={tag} className="w-fit" /> : null}
        {eyebrow ? <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">{eyebrow}</p> : null}
      </div>
      <h3 className="mt-4 break-words font-serif text-[1.45rem] leading-[1.08] tracking-[-0.04em] text-[#2F2430] sm:text-[1.65rem]">
        {title}
      </h3>
      <p className="mt-4 break-words text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">{description}</p>
      <span className="mt-auto pt-6 text-sm uppercase tracking-[0.16em] text-[#8F4C62] transition duration-200 group-hover:translate-x-1">
        {ctaLabel}
      </span>
    </>
  );

  if (!href) {
    return <div className={classes}>{content}</div>;
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

export function AcademyConnectedPaths({
  title = 'Connected To',
  description,
  paths,
}: {
  title?: string;
  description: string;
  paths: AcademyConnectionPath[];
}) {
  if (paths.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]">
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">{title}</p>
      <p className="mt-3 max-w-3xl text-[0.98rem] leading-8 text-[#5B4B55]">{description}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {paths.map((path) => (
          <Link
            key={`${path.href}-${path.label}`}
            href={path.href}
            className={`inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5 ${
              path.current
                ? 'border-[rgba(161,91,114,0.22)] bg-[rgba(252,241,245,0.96)] text-[#8F4C62]'
                : 'border-[rgba(215,161,175,0.18)] bg-white text-[#2F2430] hover:border-[rgba(161,91,114,0.24)]'
            }`}
          >
            {path.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
