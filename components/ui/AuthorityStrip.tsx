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
        'mt-6 space-y-2 text-center text-sm uppercase tracking-[0.2em] text-black/60 md:flex md:justify-center md:gap-6 md:space-y-0',
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
