export default function AuthorityStrip({
  items,
  className = '',
  itemClassName = '',
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div
      className={[
        'mt-6 flex flex-wrap items-center gap-2.5 text-[0.66rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/78 sm:text-[0.7rem]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {items.map((item, i) => (
        <span
          key={i}
          className={[
            'inline-flex min-h-[38px] items-center rounded-full border border-[rgba(232,154,174,0.18)] bg-white/82 px-3.5 py-1.5 shadow-[0_12px_24px_rgba(184,116,138,0.07)] backdrop-blur-sm',
            itemClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
