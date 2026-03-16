import { ReactNode } from 'react';

interface GuideSectionProps {
  title: string;
  children: ReactNode;
  id?: string;
}

export default function GuideSection({ title, children, id }: GuideSectionProps) {
  return (
    <section id={id} className="bg-white border border-neutral-100 rounded-2xl shadow-sm p-10 mb-20">
      <h2 className="text-3xl font-serif text-charcoal mb-8">{title}</h2>
      <div className="prose prose-lg max-w-none">
        {children}
      </div>
    </section>
  );
}