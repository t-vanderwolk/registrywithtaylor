import type { ReactNode } from 'react';
import FadeInSection from '@/components/ui/FadeInSection';

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
      <FadeInSection className="mx-auto w-full max-w-[1520px] px-6 py-12 md:px-10 md:py-16 xl:px-12">
        <div className={`space-y-16 md:space-y-24 ${innerClassName}`.trim()}>{children}</div>
      </FadeInSection>
    </section>
  );
}
