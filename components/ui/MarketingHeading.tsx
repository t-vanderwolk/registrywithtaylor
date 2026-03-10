import { ReactNode } from 'react';

type HeadingProps = {
  children: ReactNode;
  className?: string;
};

export function H1({ children, className = '' }: HeadingProps) {
  return (
    <h1
      className={[
        'font-serif text-5xl leading-[0.98] tracking-[-0.04em] text-neutral-900 md:text-6xl',
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
        'font-serif text-3xl leading-[1.08] tracking-[-0.03em] text-neutral-900 md:text-4xl',
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
        'font-serif text-xl font-semibold leading-[1.16] tracking-[-0.02em] text-neutral-900 md:text-[1.7rem]',
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
        'text-base leading-8 text-black/75 md:text-lg md:leading-9',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </p>
  );
}
