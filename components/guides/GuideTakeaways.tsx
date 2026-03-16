interface GuideTakeawaysProps {
  items: string[];
}

export default function GuideTakeaways({ items }: GuideTakeawaysProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-20">
      <div className="bg-gradient-to-br from-blush-50 to-mauve-50 rounded-2xl border border-blush-100 shadow-sm p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-charcoal mb-4">Key Takeaways</h2>
          <p className="text-lg text-neutral-700">
            What most parents don't realize about this category.
          </p>
        </div>

        <div className="grid gap-4 max-w-4xl mx-auto">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm border border-neutral-100"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blush-100 rounded-full flex items-center justify-center">
                <span className="text-blush-700 font-semibold text-sm">{index + 1}</span>
              </div>
              <p className="text-neutral-800 leading-relaxed pt-1">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}