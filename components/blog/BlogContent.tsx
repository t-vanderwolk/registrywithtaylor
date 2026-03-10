import type { ReactNode } from 'react';

export default function BlogContent({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <article className={['tmbc-blog', className].filter(Boolean).join(' ')}>{children}</article>;
}
