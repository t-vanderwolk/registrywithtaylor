export default function AuthorityStrip({
  items,
  className = '',
}: {
  items: string[];
  className?: string;
}) {
  return (
    <div
      className={[
        'mt-6 grid justify-items-center gap-3 text-center text-[0.72rem] uppercase tracking-[0.14em] text-black/60 sm:text-sm sm:tracking-[0.18em] md:flex md:justify-center md:gap-6 md:space-y-0 md:tracking-[0.2em]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {items.map((item, i) => (
        <span key={i}>{item}</span>
      ))}
    </div>
  );
}
