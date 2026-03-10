import type { ReactNode } from 'react';

export default function PullQuote({ children }: { children: ReactNode }) {
  return <blockquote className="tmbc-quote font-accent italic">{children}</blockquote>;
}
