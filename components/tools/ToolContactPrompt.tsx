import Link from 'next/link';

type ToolContactPromptProps = {
  /** One line tailored to the tool the prompt sits under. */
  prompt: string;
};

/**
 * Small "still deciding? message Taylor" band that sits under a free tool and
 * links to /contact. Gives every tool page an inbound internal link to the
 * contact page (SEO PageRank flow) plus a soft conversion nudge.
 */
export default function ToolContactPrompt({ prompt }: ToolContactPromptProps) {
  return (
    <section className="bg-[linear-gradient(180deg,#fdf9f5_0%,#f7efe6_100%)] py-14 md:py-16">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/80">
          Still deciding?
        </p>
        <p className="mt-3 text-[1.02rem] leading-8 text-neutral-700">{prompt}</p>
        <div className="mt-6">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-cta-pink)] px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Message Taylor →
          </Link>
        </div>
        <p className="mt-3 text-[0.78rem] text-neutral-500">
          A certified baby gear consultant reads every question and replies within 24 hours.
        </p>
      </div>
    </section>
  );
}
