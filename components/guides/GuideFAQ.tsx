interface GuideFAQProps {
  items: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}

export default function GuideFAQ({ items }: GuideFAQProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-20">
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-charcoal mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-neutral-700">
            Common questions parents ask when researching this category.
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {items.map((item, index) => (
            <details
              key={item.id || `faq-${index}`}
              className="group rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-white transition-colors"
            >
              <summary className="cursor-pointer p-6 font-serif text-lg text-charcoal flex items-center justify-between">
                <span>{item.question}</span>
                <svg
                  className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-neutral-700 leading-relaxed">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}