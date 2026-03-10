import { ReactNode } from 'react';

type HeadingProps = {
  children: ReactNode;
  className?: string;
};

export function H1({ children, className = '' }: HeadingProps) {
  return (
    <h1
      className={[
        'font-serif text-[clamp(3rem,7vw,5.75rem)] font-medium leading-[0.95] tracking-[-0.05em] text-neutral-900',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className = '' }: HeadingProps) {
  return (
    <h2
      className={[
        'font-serif text-[clamp(2.35rem,4.4vw,4rem)] leading-[1.02] tracking-[-0.045em] text-neutral-900',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className = '' }: HeadingProps) {
  return (
    <h3
      className={[
        'font-serif text-[1.45rem] font-semibold leading-[1.12] tracking-[-0.03em] text-neutral-900 md:text-[1.9rem]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </h3>
  );
}

export function Body({ children, className = '' }: HeadingProps) {
  return (
    <p
      className={[
        'text-base leading-7 text-black/72 md:text-[1.08rem] md:leading-[1.85]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </p>
  );
}

export function Eyebrow({ children, className = '' }: HeadingProps) {
  return (
    <p
      className={[
        'inline-flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]/80 md:text-[0.76rem]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </p>
  );
}
