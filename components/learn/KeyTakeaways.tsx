type KeyTakeawaysProps = {
  items: string[];
};

export default function KeyTakeaways({ items }: KeyTakeawaysProps) {
  return (
    <div className="rounded-[1.45rem] border border-[rgba(196,156,94,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(252,248,242,0.96)_100%)] px-6 py-7 shadow-[0_10px_28px_rgba(72,49,56,0.05)] sm:px-8 sm:py-8">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-soft)]">
        Key Takeaways
      </p>
      <h3 className="mt-3 font-serif text-[1.3rem] leading-tight tracking-[-0.025em] text-neutral-900 sm:text-[1.5rem]">
        What to carry with you from this lesson
      </h3>
      <ul className="mt-5 space-y-3.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3.5">
            <span
              aria-hidden="true"
              className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold-soft)]"
            />
            <span className="text-[0.98rem] leading-[1.75] text-neutral-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
