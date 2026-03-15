import type { ReactNode } from 'react';

export default function Takeaways({
  items,
  title = 'Key takeaways',
}: {
  items: ReactNode[];
  title?: ReactNode;
}) {
  return (
    <section className="content-widget my-10 rounded-[20px] border border-[rgba(232,154,174,0.28)] bg-[linear-gradient(180deg,#fffdfd_0%,#f9eef2_100%)] px-5 py-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] sm:px-6 sm:py-6">
      <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--tmbc-blog-rose)]">{title}</p>
      <ul className="tmbc-widget-copy space-y-3 text-[1.02rem] leading-relaxed">
        {items.map((item, index) => (
          <li key={`takeaway-${index}`} className="flex items-start gap-3">
            <span className="mt-1 text-[var(--tmbc-blog-rose)]">+</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
