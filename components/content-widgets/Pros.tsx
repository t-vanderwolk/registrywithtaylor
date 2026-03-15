import type { ReactNode } from 'react';

export default function Pros({
  items,
  title = 'Pros',
}: {
  items: ReactNode[];
  title?: ReactNode;
}) {
  return (
    <section className="content-widget my-10 rounded-[20px] border border-[rgba(232,154,174,0.28)] bg-[linear-gradient(180deg,#fffafc_0%,rgba(243,227,232,0.72)_100%)] px-5 py-5 shadow-[0_14px_36px_rgba(0,0,0,0.04)] sm:px-6 sm:py-6">
      <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)]">
        {title}
      </p>
      <ul className="tmbc-widget-copy space-y-3 text-[1.02rem] leading-relaxed">
        {items.map((item, index) => (
          <li key={`pro-${index}`} className="flex items-start gap-3">
            <span className="mt-1 text-sm text-[var(--tmbc-blog-rose)]">+</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
