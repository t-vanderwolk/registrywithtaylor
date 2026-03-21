import RevealOnScroll from '@/components/ui/RevealOnScroll';

export default function GuideBulletSection({
  title,
  description,
  items,
  eyebrow,
}: {
  title: string;
  description?: string;
  items: string[];
  eyebrow?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <RevealOnScroll>
      <section className="rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] md:p-8">
        <div className="space-y-3">
          <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">{eyebrow ?? title}</p>
          <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.35rem]">{title}</h2>
          {description ? <p className="max-w-4xl text-base leading-8 text-[#5B4B55] md:text-lg">{description}</p> : null}
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {items.map((item) => (
            <div
              key={item}
              className="rounded-[1.35rem] border border-[rgba(215,161,175,0.14)] bg-[rgba(252,247,249,0.9)] px-4 py-4"
            >
              <p className="text-base leading-7 text-[#4B3641]">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
