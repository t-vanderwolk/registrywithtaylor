type TaylorsNoteCardProps = {
  title: string;
  body: string;
  supportingLine?: string;
  className?: string;
};

export default function TaylorsNoteCard({
  title,
  body,
  supportingLine,
  className = '',
}: TaylorsNoteCardProps) {
  return (
    <section
      className={[
        'rounded-[1.75rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,250,252,0.98)_0%,rgba(252,242,246,0.96)_56%,rgba(249,240,231,0.94)_100%)] px-6 py-6 shadow-[0_18px_42px_rgba(58,36,43,0.08)] sm:px-7 sm:py-7',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">Taylor&apos;s note</p>
      <h2 className="mt-4 max-w-3xl font-serif text-[clamp(1.8rem,3vw,2.25rem)] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-[#5B4B55] sm:text-[1.04rem]">{body}</p>
      {supportingLine ? <p className="academy-handwritten-aside mt-5">{supportingLine}</p> : null}
    </section>
  );
}
