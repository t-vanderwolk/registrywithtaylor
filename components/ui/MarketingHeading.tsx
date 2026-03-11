import { ReactNode } from 'react';

type HeadingProps = {
  children: ReactNode;
  className?: string;
};

export function H1({ children, className = '' }: HeadingProps) {
  return (
    <h1
      className={[
        'font-serif text-[44px] font-medium leading-[0.94] tracking-[-0.05em] text-neutral-900 lg:text-[64px]',
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
        'font-serif text-[30px] leading-[1.02] tracking-[-0.045em] text-neutral-900 lg:text-[42px]',
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
        'font-serif text-[1.45rem] font-semibold leading-[1.12] tracking-[-0.03em] text-neutral-900 md:text-[1.85rem]',
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
        'max-w-[640px] text-[15.5px] leading-relaxed text-black/72 md:text-[17px]',
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
        'inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-black/52',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </p>
  );
}
