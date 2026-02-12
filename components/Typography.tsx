import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

type ParagraphProps = {
  children?: ReactNode;
  className?: string;
} & DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;

type HeadingProps = {
  children?: ReactNode;
  className?: string;
} & DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

export function Eyebrow({ children, className = '', ...rest }: ParagraphProps) {
  return (
    <p className={`eyebrow ${className}`.trim()} {...rest}>
      {children}
    </p>
  );
}

export function Display({ children, className = '', ...rest }: HeadingProps) {
  return (
    <h1 className={`display ${className}`.trim()} {...rest}>
      {children}
    </h1>
  );
}

export function SectionTitle({ children, className = '', ...rest }: HeadingProps) {
  return (
    <h2 className={`section-title ${className}`.trim()} {...rest}>
      {children}
    </h2>
  );
}

export function Lead({ children, className = '', ...rest }: ParagraphProps) {
  return (
    <p className={`lead ${className}`.trim()} {...rest}>
      {children}
    </p>
  );
}

export function Body({ children, className = '', ...rest }: ParagraphProps) {
  return (
    <p className={`body-copy ${className}`.trim()} {...rest}>
      {children}
    </p>
  );
}
