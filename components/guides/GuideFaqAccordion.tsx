export type GuideFaqAccordionItem = {
  question: string;
  answer: string;
};

export default function GuideFaqAccordion({
  id = 'guide-faq',
  title = 'Questions parents still have',
  description = 'The guide covers the framework. These are the quick answers that usually come right after.',
  items,
}: {
  id?: string;
  title?: string;
  description?: string;
  items: GuideFaqAccordionItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-2xl border border-black/6 bg-white p-6 shadow-sm md:p-8"
    >
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">FAQ</p>
        <h2 className="font-serif text-2xl tracking-tight text-charcoal md:text-3xl">{title}</h2>
        <p className="max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">{description}</p>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item, index) => (
          <details
            key={`${item.question}-${index}`}
            className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#FCFAFB] px-5 py-4"
          >
            <summary className="cursor-pointer list-none font-serif text-[1.25rem] leading-[1.12] tracking-tight text-charcoal">
              {item.question}
            </summary>
            <p className="mt-4 text-base leading-relaxed text-neutral-700">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
