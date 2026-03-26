export default function ExpertTipCallout({
  eyebrow = 'Expert Tip',
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body: string;
}) {
  return (
    <section className="tmbc-editorial-article-shell">
      <div className="relative z-[1]">
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose)]">{eyebrow}</p>
        <h3 className="mt-4 font-serif text-[clamp(1.9rem,3vw,2.35rem)] leading-[1.08] tracking-[-0.03em] text-[var(--tmbc-blog-charcoal)]">
          {title}
        </h3>
        <div className="mt-4 h-1 w-[78px] rounded-full bg-[linear-gradient(90deg,rgba(232,154,174,0.9)_0%,rgba(215,161,175,1)_100%)] shadow-[0_10px_24px_rgba(232,154,174,0.18)]" />
        <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-[var(--tmbc-blog-soft-text)] sm:text-[1.04rem]">{body}</p>
      </div>
    </section>
  );
}
