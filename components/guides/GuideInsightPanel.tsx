export default function GuideInsightPanel({
  id,
  title,
  paragraphs,
}: {
  id?: string;
  title: string;
  paragraphs: readonly string[];
}) {
  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className="rounded-[1.75rem] border border-[#F1D9DF] bg-[#FAF5F6] px-5 py-7 sm:px-6 sm:py-8 md:rounded-2xl md:px-10 md:py-10"
    >
      <div className="space-y-3 sm:space-y-4">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Editorial insight</p>
        <h2 className="font-serif text-[1.85rem] tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">{title}</h2>
      </div>

      <div className="mt-5 max-w-[70ch] space-y-4 text-neutral-700 sm:mt-6">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-[0.98rem] leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
