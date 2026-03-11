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
            'inline-flex min-h-[38px] items-center rounded-full border border-rose-100 bg-white/88 px-4 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.03)] backdrop-blur-sm transition duration-300 ease-out',
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
