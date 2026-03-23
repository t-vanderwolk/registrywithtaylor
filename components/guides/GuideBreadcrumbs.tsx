import Link from 'next/link';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import type { GuideBreadcrumbItem } from '@/lib/guides/experience';

export default function GuideBreadcrumbs({
  items,
}: {
  items: GuideBreadcrumbItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <RevealOnScroll>
      <nav
        aria-label="Breadcrumb"
        className="rounded-[1.5rem] border border-[rgba(215,161,175,0.18)] bg-white/92 px-4 py-4 shadow-[0_18px_42px_rgba(58,36,43,0.08)] sm:px-5"
      >
        <ol className="flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-[#8F4C62] sm:text-[0.72rem] sm:tracking-[0.24em]">
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true" className="text-[#C090A1]">/&nbsp;</span> : null}
              {item.href ? (
                <Link href={item.href} className="transition duration-200 hover:text-[#6E3148]">
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#4B3641]">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </RevealOnScroll>
  );
}
