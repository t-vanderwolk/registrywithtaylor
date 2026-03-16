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
      className="rounded-2xl border border-[#F1D9DF] bg-[#FAF5F6] px-6 py-8 md:px-10 md:py-10"
    >
      <div className="space-y-4">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Editorial insight</p>
        <h2 className="font-serif text-3xl tracking-tight text-neutral-900 md:text-4xl">{title}</h2>
      </div>

      <div className="mt-6 max-w-[70ch] space-y-4 text-neutral-700">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
