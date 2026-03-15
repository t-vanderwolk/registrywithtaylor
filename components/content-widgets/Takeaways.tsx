import type { ReactNode } from 'react';

export default function Takeaways({
  items,
  title = 'Key takeaways',
}: {
  items: ReactNode[];
  title?: ReactNode;
}) {
  return (
    <section className="content-widget my-10 rounded-[20px] border border-[rgba(196,156,94,0.2)] bg-[linear-gradient(180deg,#fffdfa_0%,#f9f4eb_100%)] px-5 py-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] sm:px-6 sm:py-6">
      <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">{title}</p>
      <ul className="space-y-3 text-[1.02rem] leading-relaxed text-charcoal/85">
        {items.map((item, index) => (
          <li key={`takeaway-${index}`} className="flex items-start gap-3">
            <span className="mt-1 text-[var(--color-accent-dark)]">+</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
