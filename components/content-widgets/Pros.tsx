import type { ReactNode } from 'react';

export default function Pros({
  items,
  title = 'Pros',
}: {
  items: ReactNode[];
  title?: ReactNode;
}) {
  return (
    <section className="content-widget my-10 rounded-[20px] border border-[rgba(184,116,138,0.2)] bg-[rgba(243,227,232,0.6)] px-5 py-5 shadow-[0_14px_36px_rgba(0,0,0,0.04)] sm:px-6 sm:py-6">
      <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
        {title}
      </p>
      <ul className="space-y-3 text-[1.02rem] leading-relaxed text-charcoal/85">
        {items.map((item, index) => (
          <li key={`pro-${index}`} className="flex items-start gap-3">
            <span className="mt-1 text-sm text-[var(--color-accent-dark)]">+</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
