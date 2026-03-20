import type { ReactNode } from 'react';

export default function GuidePageSection({
  id,
  tone = 'white',
  className = '',
  innerClassName = '',
  children,
}: {
  id?: string;
  tone?: 'white' | 'blush';
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${tone === 'blush' ? 'bg-[#FAF7F8]' : 'bg-white'} ${className}`.trim()}>
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className={`space-y-16 md:space-y-24 ${innerClassName}`.trim()}>{children}</div>
      </div>
    </section>
  );
}
