type QuoteMarkProps = {
  className?: string;
};

export default function QuoteMark({
  className = 'absolute left-0 top-0 select-none text-[88px] leading-[0.8] text-[var(--tmbc-rose)]/12 md:text-[104px]',
}: QuoteMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={className}
    >
      “
    </span>
  );
}
