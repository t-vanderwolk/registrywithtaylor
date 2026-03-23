import Link from 'next/link';
import GuideInkBadge from '@/components/guides/GuideInkBadge';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

export default function GuideJourneyIntro({
  title = 'Orientation',
  description = 'Use this section to get the decision grounded in real life before the details start multiplying.',
  intro,
  calloutBody,
  parentGuide,
  whoThisIsFor = [],
  whatThisIs,
  whyItExists,
}: {
  title?: string;
  description?: string;
  intro: string[];
  calloutBody: string;
  parentGuide?: {
    label: string;
    href: string;
  } | null;
  whoThisIsFor?: string[];
  whatThisIs?: string;
  whyItExists?: string;
}) {
  const introParagraphs = intro.map((paragraph) => paragraph.trim()).filter(Boolean);
  const audienceItems = whoThisIsFor.map((item) => item.trim()).filter(Boolean).slice(0, 4);
  const whatThisIsCopy = whatThisIs?.trim() || '';
  const whyItExistsCopy = whyItExists?.trim() || '';

  return (
    <RevealOnScroll>
      <section className="rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] md:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-3">
            <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">Orientation</p>
            <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.35rem]">{title}</h2>
            <p className="max-w-4xl text-base leading-8 text-[#5B4B55] md:text-lg">{description}</p>
          </div>

          <GuideInkBadge label="read this first" size="annotation" className="mt-0 shrink-0" />
        </div>

        {introParagraphs.length > 0 ? (
          <div className="mt-6 space-y-4">
            {introParagraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-4xl text-base leading-8 text-[#4B3641] md:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-[1.5rem] border border-[rgba(196,156,94,0.16)] bg-[linear-gradient(180deg,#fffaf7_0%,#f8efe8_100%)] p-5">
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/82">
              Start with your real life
            </p>
            <p className="mt-4 text-base leading-8 text-[#4B3641] md:text-lg">{calloutBody}</p>
          </div>

          <div className="space-y-4">
            {parentGuide ? (
              <Link
                href={parentGuide.href}
                className="group block rounded-[1.5rem] border border-[rgba(232,154,174,0.26)] bg-[linear-gradient(180deg,#fffdfd_0%,#f9edf1_100%)] p-5 shadow-[0_16px_36px_rgba(58,36,43,0.06)] transition duration-300 hover:-translate-y-1 hover:bg-white"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">New here?</p>
                <p className="mt-3 text-lg leading-8 text-[#2F2430]">Start with the main guide first.</p>
                <p className="mt-3 text-sm leading-7 text-[#5B4B55]">
                  Open {parentGuide.label} before you disappear into the narrower version of the decision.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-[#8F4C62]">
                  <span>Open {parentGuide.label}</span>
                  <span aria-hidden="true">-&gt;</span>
                </span>
              </Link>
            ) : null}

            {whatThisIsCopy ? (
              <div className="rounded-[1.5rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.9)] p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">What this is</p>
                <p className="mt-4 text-sm leading-7 text-[#4B3641] md:text-[0.98rem]">{whatThisIsCopy}</p>
              </div>
            ) : null}

            {whyItExistsCopy ? (
              <div className="rounded-[1.5rem] border border-[rgba(196,156,94,0.16)] bg-[linear-gradient(180deg,#fffaf7_0%,#f8efe8_100%)] p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/82">Why it exists</p>
                <p className="mt-4 text-sm leading-7 text-[#4B3641] md:text-[0.98rem]">{whyItExistsCopy}</p>
              </div>
            ) : null}

            {audienceItems.length > 0 ? (
              <div className="rounded-[1.5rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.9)] p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">Who this is for</p>
                <div className="mt-4 grid gap-3">
                  {audienceItems.map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.1rem] border border-[rgba(215,161,175,0.14)] bg-white/90 px-4 py-3"
                    >
                      <p className="text-sm leading-7 text-[#4B3641]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </RevealOnScroll>
  );
}
