import GuideContinueExploring from '@/components/guides/GuideContinueExploring';
import HubHero from '@/components/guides/HubHero';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import type { FutureGuideHubConfig } from '@/lib/guides/educationHub';

export default function GuideFutureHubPage({
  config,
}: {
  config: FutureGuideHubConfig;
}) {
  return (
    <>
      <HubHero
        parentLink={{ href: '/guides', label: 'TMBC Education Hub' }}
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        note={config.note}
        stats={config.stats}
        highlights={config.highlights}
        jumpLinks={[
          { href: '#future-hub-overview', label: 'What to expect' },
          { href: '#future-hub-start', label: 'Start here now' },
        ]}
      />

      <section className="bg-[var(--tmbc-blog-ivory)]">
        <div className="mx-auto max-w-[1300px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
          <div className="space-y-6 sm:space-y-8 lg:space-y-16">
            <RevealOnScroll>
              <section
                id="future-hub-overview"
                className="rounded-[1.8rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fffdf9_0%,#fbf3ec_100%)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-7 lg:p-8"
              >
                <div className="space-y-2">
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">What to expect</p>
                  <h2 className="font-serif text-[2.05rem] leading-[1.02] tracking-tight text-neutral-900 sm:text-[3rem]">
                    This hub is being built around real questions, not filler.
                  </h2>
                  <p className="max-w-[64ch] text-[1rem] leading-8 text-neutral-700 sm:text-[1.08rem] sm:leading-8">
                    Until the full pathway is live, these are the angles this hub is being shaped to cover.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {config.plannedTopics.map((topic) => (
                    <div
                      key={topic}
                      className="rounded-[1.35rem] border border-black/6 bg-white/88 px-4 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.04)]"
                    >
                      <p className="text-[0.98rem] leading-7 text-neutral-700">{topic}</p>
                    </div>
                  ))}
                </div>
              </section>
            </RevealOnScroll>

            <GuideContinueExploring
              id="future-hub-start"
              title={config.continueTitle}
              description={config.continueDescription}
              links={config.continueLinks}
            />
          </div>
        </div>
      </section>
    </>
  );
}
