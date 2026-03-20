import Link from 'next/link';
import type { GuideHubLink } from '@/lib/guides/hubs';
import GuideGlyph from '@/components/guides/GuideGlyph';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

export default function GuideContinueExploring({
  id,
  title,
  description,
  links,
}: {
  id?: string;
  title: string;
  description?: string;
  links: GuideHubLink[];
}) {
  if (links.length === 0) {
    return null;
  }

  return (
    <RevealOnScroll>
      <section id={id} className="rounded-[1.65rem] border border-black/6 bg-white/84 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.04)] sm:p-5 md:rounded-[1.8rem] md:p-6">
        <div className="space-y-2">
          <p className="text-[0.72rem] uppercase tracking-[0.2em] text-black/48">Continue exploring</p>
          <h3 className="font-serif text-[1.55rem] leading-[1.02] tracking-[-0.03em] text-neutral-900 sm:text-[1.8rem]">{title}</h3>
          {description ? <p className="max-w-3xl text-sm leading-7 text-neutral-700">{description}</p> : null}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={`${link.href}-${link.title}`}
              href={link.href}
              className="group rounded-[1.25rem] border border-black/6 bg-[rgba(252,247,242,0.76)] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.24)] hover:bg-white"
            >
              <div className="flex items-center gap-3 text-[var(--color-accent-dark)]">
                <GuideGlyph icon={link.icon} />
                <span className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-accent-dark)]">Next read</span>
              </div>
              <p className="mt-3 font-serif text-[1.12rem] leading-[1.08] tracking-[-0.02em] text-neutral-900 sm:text-[1.25rem]">{link.title}</p>
              <p className="mt-2 text-sm leading-6 text-neutral-700 sm:leading-7">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
