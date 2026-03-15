import Link from 'next/link';
import type { GuideHubLink } from '@/lib/guides/hubs';
import GuideGlyph from '@/components/guides/GuideGlyph';

export default function GuideContinueExploring({
  title,
  description,
  links,
}: {
  title: string;
  description?: string;
  links: GuideHubLink[];
}) {
  if (links.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[1.8rem] border border-black/6 bg-white/84 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)] md:p-6">
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-[0.2em] text-black/48">Continue exploring</p>
        <h3 className="font-serif text-[1.8rem] leading-[1.02] tracking-[-0.03em] text-neutral-900">{title}</h3>
        {description ? <p className="max-w-3xl text-sm leading-7 text-neutral-700">{description}</p> : null}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
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
            <p className="mt-3 font-serif text-[1.25rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">{link.title}</p>
            <p className="mt-2 text-sm leading-7 text-neutral-700">{link.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
