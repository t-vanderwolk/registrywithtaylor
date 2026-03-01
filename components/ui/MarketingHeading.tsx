import { ReactNode } from 'react';

type HeadingProps = {
  children: ReactNode;
  className?: string;
};

export function H1({ children, className = '' }: HeadingProps) {
  return (
    <h1 className={['text-4xl tracking-tight md:text-5xl', className].filter(Boolean).join(' ')}>
      {children}
    </h1>
  );
}

export function H2({ children, className = '' }: HeadingProps) {
  return (
    <h2 className={['text-2xl tracking-tight md:text-3xl', className].filter(Boolean).join(' ')}>
      {children}
    </h2>
  );
}

export function H3({ children, className = '' }: HeadingProps) {
  return (
    <h3 className={['text-xl md:text-2xl', className].filter(Boolean).join(' ')}>
      {children}
    </h3>
  );
}

export function Body({ children, className = '' }: HeadingProps) {
  return (
    <p className={['text-base leading-relaxed text-black/80', className].filter(Boolean).join(' ')}>
      {children}
    </p>
  );
}
