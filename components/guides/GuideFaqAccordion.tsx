export type GuideFaqAccordionItem = {
  question: string;
  answer: string;
};

export default function GuideFaqAccordion({
  title = 'Questions parents still have',
  description = 'The guide covers the framework. These are the quick answers that usually come right after.',
  items,
}: {
  title?: string;
  description?: string;
  items: GuideFaqAccordionItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id="guide-faq"
      className="scroll-mt-24 rounded-[2rem] border border-black/6 bg-white/94 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] md:p-8"
    >
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">FAQ</p>
        <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.04em] text-neutral-900">{title}</h2>
        <p className="max-w-3xl text-sm leading-7 text-neutral-700">{description}</p>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item, index) => (
          <details
            key={`${item.question}-${index}`}
            className="rounded-[1.4rem] border border-[rgba(0,0,0,0.06)] bg-[#fdf9f4] px-5 py-4"
          >
            <summary className="cursor-pointer list-none font-serif text-[1.28rem] leading-[1.1] tracking-[-0.03em] text-neutral-900">
              {item.question}
            </summary>
            <p className="mt-4 text-sm leading-7 text-neutral-700">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
