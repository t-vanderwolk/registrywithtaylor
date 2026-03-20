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
      <section id={id} className="rounded-2xl border border-black/6 bg-white p-6 shadow-sm md:p-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-black/48">Continue exploring</p>
          <h3 className="font-serif text-2xl tracking-tight text-charcoal md:text-3xl">{title}</h3>
          {description ? <p className="max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">{description}</p> : null}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={`${link.href}-${link.title}`}
              href={link.href}
              className="group rounded-xl border border-black/6 bg-[#FCFAFB] p-5 transition duration-200 hover:-translate-y-1 hover:border-[rgba(196,156,94,0.24)] hover:bg-white hover:shadow-md"
            >
              <div className="flex items-center gap-3 text-[var(--color-accent-dark)]">
                <GuideGlyph icon={link.icon} />
                <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">Next read</span>
              </div>
              <p className="mt-3 font-serif text-[1.3rem] leading-[1.08] tracking-tight text-charcoal">{link.title}</p>
              <p className="mt-2 text-base leading-relaxed text-neutral-700">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
