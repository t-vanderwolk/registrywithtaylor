import type { ReactNode } from 'react';

type StartHereProps = {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
};

export default function StartHere({
  title,
  description,
  children,
  className = '',
}: StartHereProps) {
  return (
    <section
      className={[
        'rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-7 shadow-[0_18px_42px_rgba(58,36,43,0.07)] sm:px-7 sm:py-8',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose,#A15B72)]">
        Start Here
      </p>
      <h2 className="mt-4 max-w-3xl break-words font-serif text-[clamp(1.85rem,3.4vw,2.45rem)] leading-[1.08] tracking-[-0.04em] text-[var(--tmbc-blog-charcoal,#2F2430)]">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl break-words text-[1rem] leading-8 text-[var(--tmbc-blog-soft-text,#5B4B55)] sm:text-[1.04rem]">
        {description}
      </p>
      {children ? (
        <div className="mt-6 max-w-3xl space-y-4 break-words text-[0.98rem] leading-8 text-[var(--tmbc-blog-soft-text,#5B4B55)] sm:text-[1rem]">
          {children}
        </div>
      ) : null}
    </section>
  );
}
