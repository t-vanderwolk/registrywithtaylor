export type GlossaryCardProps = {
  term: string;
  definition: string;
  whyItMatters: string;
};

/** A single glossary term: definition + a "why it matters" note. */
export default function GlossaryCard({ term, definition, whyItMatters }: GlossaryCardProps) {
  return (
    <div className="flex h-full flex-col rounded-[1.4rem] border border-[var(--color-card-border)] bg-white p-6 shadow-[0_6px_22px_rgba(55,40,46,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(216,137,160,0.5)] hover:shadow-[0_16px_38px_rgba(184,116,138,0.11)]">
      <h3 className="font-serif text-[1.32rem] leading-[1.14] tracking-[-0.02em] text-neutral-900">{term}</h3>
      <p className="mt-2.5 text-[1rem] leading-[1.55] text-neutral-700">{definition}</p>
      <div className="mt-4 border-t border-[rgba(215,161,175,0.28)] pt-3.5">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)]">
          Why it matters
        </p>
        <p className="mt-1.5 text-[0.95rem] leading-[1.55] text-neutral-600">{whyItMatters}</p>
      </div>
    </div>
  );
}
