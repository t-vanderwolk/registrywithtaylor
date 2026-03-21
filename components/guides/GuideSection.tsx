import { ReactNode } from 'react';
import FadeInSection from '@/components/ui/FadeInSection';

interface GuideSectionProps {
  title: string;
  children: ReactNode;
  id?: string;
}

export default function GuideSection({ title, children, id }: GuideSectionProps) {
  return (
    <FadeInSection className="mb-20">
      <section id={id} className="rounded-2xl border border-neutral-100 bg-white p-10 shadow-sm">
        <h2 className="mb-8 text-3xl font-serif text-charcoal">{title}</h2>
        <div className="prose prose-lg max-w-none">
          {children}
        </div>
      </section>
    </FadeInSection>
  );
}
