type ClarityCalloutProps = {
  insight: string;
  className?: string;
};

export default function ClarityCallout({
  insight,
  className = '',
}: ClarityCalloutProps) {
  if (!insight.trim()) {
    return null;
  }

  return (
    <section
      className={[
        'rounded-[1.65rem] border border-[rgba(215,161,175,0.2)] bg-[linear-gradient(135deg,rgba(252,241,245,0.98)_0%,rgba(255,250,252,0.96)_54%,rgba(249,240,231,0.92)_100%)] px-6 py-6 shadow-[0_18px_42px_rgba(58,36,43,0.08)] sm:px-7',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose,#A15B72)]">
        Clarity Callout
      </p>
      <p className="mt-4 max-w-3xl break-words font-serif text-[1.45rem] leading-[1.18] tracking-[-0.03em] text-[var(--tmbc-blog-charcoal,#2F2430)] sm:text-[1.85rem]">
        {insight}
      </p>
    </section>
  );
}
