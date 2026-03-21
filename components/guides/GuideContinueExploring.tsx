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
      <section id={id} className="rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-5 shadow-[0_18px_55px_rgba(58,36,43,0.08)] md:p-7">
        <div className="space-y-3">
          <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">Continue exploring</p>
          <h3 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.3rem]">{title}</h3>
          {description ? <p className="max-w-4xl text-base leading-8 text-[#5B4B55] md:text-lg">{description}</p> : null}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {links.map((link) => (
            <Link
              key={`${link.href}-${link.title}`}
              href={link.href}
              className="group rounded-[1.4rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.9)] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(58,36,43,0.10)]"
            >
              <div className="flex items-center gap-3 text-[#A15B72]">
                <GuideGlyph icon={link.icon} />
                <span className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Next read</span>
              </div>
              <p className="mt-3 text-[1.3rem] font-medium leading-[1.08] tracking-[-0.02em] text-[#2F2430]">{link.title}</p>
              <p className="mt-2 text-base leading-8 text-[#5B4B55]">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
