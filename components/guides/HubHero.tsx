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

export default function HubHero({
  eyebrow,
  title,
  description,
  note,
  stats = [],
  highlights = [],
  jumpLinks = [],
}: {
  eyebrow: string;
  title: string;
  description: string;
  note?: string | null;
  stats?: HubHeroStat[];
  highlights?: HubHeroHighlight[];
  jumpLinks?: HubHeroJumpLink[];
}) {
  return (
    <section className="border-b border-black/5 bg-[linear-gradient(180deg,#fffaf7_0%,#f4ede3_100%)]">
      <div className="mx-auto max-w-[1300px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
        <RevealOnScroll>
          <div className="overflow-hidden rounded-[2rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(249,240,235,0.96)_100%)] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.06)] sm:p-7 md:rounded-[2.2rem] md:p-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-start">
              <div className="space-y-5">
                <div className="space-y-4">
                  <p className="text-[0.78rem] uppercase tracking-[0.26em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
                  <h1 className="max-w-[11ch] font-serif text-[2.7rem] leading-[0.92] tracking-[-0.05em] text-neutral-900 sm:text-[3.7rem] lg:text-[4.85rem]">
                    {title}
                  </h1>
                  <p className="max-w-[40rem] text-[1.05rem] leading-8 text-neutral-700 sm:text-[1.2rem] sm:leading-9">
                    {description}
                  </p>
                </div>

                {stats.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {stats.map((stat) => (
                      <div
                        key={`${stat.label}-${stat.value}`}
                        className="rounded-full border border-black/6 bg-white/88 px-4 py-2.5 text-[0.98rem] text-neutral-800"
                      >
                        <span className="mr-2 text-[0.68rem] uppercase tracking-[0.18em] text-black/42">{stat.label}</span>
                        <span>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {jumpLinks.length > 0 ? (
                  <div className="rounded-[1.45rem] border border-black/6 bg-white/88 p-4 shadow-[0_16px_36px_rgba(0,0,0,0.04)]">
                    <p className="text-[0.74rem] uppercase tracking-[0.2em] text-black/48">Jump to</p>
                    <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:pb-0">
                      {jumpLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="shrink-0 rounded-full border border-[rgba(196,156,94,0.18)] bg-[rgba(255,251,247,0.96)] px-4 py-2.5 text-[0.98rem] text-neutral-800 transition hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.28)] hover:bg-white"
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
                  <div className="rounded-[1.5rem] border border-[rgba(232,154,174,0.24)] bg-[linear-gradient(180deg,#fffdfd_0%,#f8edf1_100%)] p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)]">
                    <p className="text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/82">TMBC note</p>
                    <p className="mt-3 text-[1.08rem] leading-8 text-[var(--color-accent-dark)]/92 sm:text-[1.18rem] sm:leading-9">{note}</p>
                  </div>
                ) : null}

                {highlights.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {highlights.map((highlight, index) => (
                      <RevealOnScroll key={`${highlight.label}-${index}`} delayMs={index * 70}>
                        <div className="h-full rounded-[1.45rem] border border-stone-200/70 bg-white/90 p-4 shadow-[0_14px_32px_rgba(0,0,0,0.04)]">
                          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">{highlight.label}</p>
                          <p className="mt-3 text-[1rem] leading-8 text-neutral-700">{highlight.text}</p>
                        </div>
                      </RevealOnScroll>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
