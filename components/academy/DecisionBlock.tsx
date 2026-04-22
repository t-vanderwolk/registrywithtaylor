import type { ReactNode } from 'react';

export type DecisionBlockContrast = {
  mostPeopleThink: string;
  reality: string;
};

type DecisionBlockProps = {
  title: string;
  description: string;
  contrast: DecisionBlockContrast;
  children?: ReactNode;
  className?: string;
};

export default function DecisionBlock({
  title,
  description,
  contrast,
  children,
  className = '',
}: DecisionBlockProps) {
  return (
    <section
      className={[
        'rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(255,248,251,0.93)_100%)] px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-7 sm:py-8',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose,#A15B72)]">
        Decision Block
      </p>
      <h2 className="mt-4 max-w-3xl break-words font-serif text-[clamp(1.85rem,3.4vw,2.45rem)] leading-[1.08] tracking-[-0.04em] text-[var(--tmbc-blog-charcoal,#2F2430)]">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl break-words text-[1rem] leading-8 text-[var(--tmbc-blog-soft-text,#5B4B55)] sm:text-[1.04rem]">
        {description}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.25rem] border border-[rgba(161,91,114,0.14)] bg-white/88 px-5 py-5">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--tmbc-blog-rose,#A15B72)]">
            Most people think
          </p>
          <p className="mt-3 break-words text-[0.98rem] leading-7 text-[var(--tmbc-blog-soft-text,#5B4B55)]">
            {contrast.mostPeopleThink}
          </p>
        </div>
        <div className="rounded-[1.25rem] border border-[rgba(161,91,114,0.18)] bg-[rgba(252,241,245,0.9)] px-5 py-5">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--tmbc-blog-rose,#A15B72)]">
            Reality
          </p>
          <p className="mt-3 break-words text-[0.98rem] leading-7 text-[var(--tmbc-blog-soft-text,#5B4B55)]">
            {contrast.reality}
          </p>
        </div>
      </div>

      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}
