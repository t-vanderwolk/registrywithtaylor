type DecisionFilterProps = {
  title: string;
  chooseIf: readonly string[];
  skipIf: readonly string[];
  className?: string;
};

function getVisibleItems(items: readonly string[]) {
  return items
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index)
    .slice(0, 5);
}

function FilterList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[1.35rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-5 py-5">
      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--tmbc-blog-rose,#A15B72)]">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--tmbc-blog-rose,#D986A2)]"
            />
            <span className="break-words text-[0.98rem] leading-7 text-[var(--tmbc-blog-soft-text,#5B4B55)]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DecisionFilter({
  title,
  chooseIf,
  skipIf,
  className = '',
}: DecisionFilterProps) {
  const chooseItems = getVisibleItems(chooseIf);
  const skipItems = getVisibleItems(skipIf);

  if (chooseItems.length === 0 && skipItems.length === 0) {
    return null;
  }

  return (
    <section
      className={[
        'rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(255,248,251,0.94)_100%)] px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-7 sm:py-8',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose,#A15B72)]">
        Decision Filter
      </p>
      <h2 className="mt-4 max-w-3xl break-words font-serif text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.08] tracking-[-0.04em] text-[var(--tmbc-blog-charcoal,#2F2430)]">
        {title}
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {chooseItems.length > 0 ? <FilterList title="Choose if" items={chooseItems} /> : null}
        {skipItems.length > 0 ? <FilterList title="Skip if" items={skipItems} /> : null}
      </div>
    </section>
  );
}
