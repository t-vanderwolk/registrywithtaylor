import type { ReactNode } from 'react';

export default function BlogContent({
  children,
  className = '',
  variant = 'default',
}: {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'plain' | 'guide';
}) {
  return <article className={[variant === 'default' ? 'tmbc-blog' : '', className].filter(Boolean).join(' ')}>{children}</article>;
}
