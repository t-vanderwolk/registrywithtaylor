type WhatMattersListProps = {
  title: string;
  items: readonly string[];
  className?: string;
};

function getSpecificItems(items: readonly string[]) {
  const cleaned = items
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index);

  const specific = cleaned.filter((item) => item.split(/\s+/).length >= 5);
  return (specific.length > 0 ? specific : cleaned).slice(0, 5);
}

export default function WhatMattersList({
  title,
  items,
  className = '',
}: WhatMattersListProps) {
  const visibleItems = getSpecificItems(items);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section
      className={[
        'rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-6 shadow-[0_18px_42px_rgba(58,36,43,0.07)] sm:px-7',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose,#A15B72)]">
        What Matters
      </p>
      <h2 className="mt-4 break-words font-serif text-[1.65rem] leading-[1.08] tracking-[-0.04em] text-[var(--tmbc-blog-charcoal,#2F2430)] sm:text-[2rem]">
        {title}
      </h2>
      <ul className="mt-5 space-y-3">
        {visibleItems.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--tmbc-blog-rose,#D986A2)]"
            />
            <span className="break-words text-[0.98rem] leading-8 text-[var(--tmbc-blog-soft-text,#5B4B55)]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
