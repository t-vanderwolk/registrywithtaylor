import Link from 'next/link';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

type HubHeroStat = {
  label: string;
  value: string;
};

type HubHeroHighlight = {
  label: string;
  text: string;
};

type HubHeroJumpLink = {
  href: string;
  label: string;
};

type HubHeroParentLink = {
  href: string;
  label: string;
};

export default function HubHero({
  eyebrow,
  title,
  description,
  note,
  stats = [],
  highlights = [],
  jumpLinks = [],
  parentLink,
}: {
  eyebrow: string;
  title: string;
  description: string;
  note?: string | null;
  stats?: HubHeroStat[];
  highlights?: HubHeroHighlight[];
  jumpLinks?: HubHeroJumpLink[];
  parentLink?: HubHeroParentLink | null;
}) {
  return (
    <section className="bg-[linear-gradient(180deg,#FBF7F8_0%,#FFFFFF_100%)]">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-24 md:px-10 md:pb-20 md:pt-32">
        <RevealOnScroll>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
              <div className="space-y-5">
                <div className="space-y-5">
                  {parentLink ? (
                    <Link
                      href={parentLink.href}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-black/6 bg-white px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--color-accent-dark)] transition duration-200 hover:-translate-y-1 hover:shadow-md"
                    >
                      <span aria-hidden="true">-&lt;</span>
                      <span>{parentLink.label}</span>
                    </Link>
                  ) : null}
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
                  <h1 className="max-w-2xl text-4xl font-serif tracking-tight text-charcoal md:text-5xl">
                    {title}
                  </h1>
                  <p className="max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">
                    {description}
                  </p>
                </div>

                {stats.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {stats.map((stat) => (
                      <div
                        key={`${stat.label}-${stat.value}`}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] bg-white/92 px-4 py-2 text-sm text-neutral-700"
                      >
                        <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/78">{stat.label}</span>
                        <span className="text-charcoal">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {jumpLinks.length > 0 ? (
                  <div className="rounded-2xl border border-black/6 bg-white/90 p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/78">Jump to</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {jumpLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="inline-flex min-h-[44px] items-center rounded-full border border-[rgba(215,161,175,0.22)] bg-[#FCFAFB] px-4 py-2 text-sm text-charcoal transition duration-200 hover:-translate-y-1 hover:shadow-md"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="space-y-4">
                {note ? (
                  <div className="rounded-2xl border border-[rgba(232,154,174,0.24)] bg-[linear-gradient(180deg,#FFFDFD_0%,#F8EDEE_100%)] p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">TMBC note</p>
                    <p className="mt-3 text-base leading-relaxed text-charcoal md:text-lg">{note}</p>
                  </div>
                ) : null}

                {highlights.length > 0 ? (
                  <div className="grid gap-4">
                    {highlights.map((highlight, index) => (
                      <RevealOnScroll key={`${highlight.label}-${index}`} delayMs={index * 70}>
                        <div className="h-full rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">{highlight.label}</p>
                          <p className="mt-3 text-base leading-relaxed text-neutral-700">{highlight.text}</p>
                        </div>
                      </RevealOnScroll>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
