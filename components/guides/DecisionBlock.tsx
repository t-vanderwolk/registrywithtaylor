import Link from 'next/link';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

export type DecisionBlockItem = {
  condition: string;
  recommendation: string;
  href?: string;
};

export default function DecisionBlock({
  title = 'Decision Section',
  description = 'Use the quick fit logic below to keep the next move practical.',
  items,
}: {
  title?: string;
  description?: string;
  items: DecisionBlockItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <RevealOnScroll>
      <section className="rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] md:p-8">
        <div className="space-y-3">
          <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">Decision Section</p>
          <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.35rem]">{title}</h2>
          <p className="max-w-3xl text-base leading-8 text-[#5B4B55] md:text-lg">{description}</p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {items.map((item) => {
            const content = (
              <div className="rounded-[1.5rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.9)] px-5 py-5 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_36px_rgba(58,36,43,0.08)]">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">If you</p>
                <p className="mt-3 text-lg leading-8 text-[#2F2430]">{item.condition}</p>
                <div className="mt-4 flex items-start gap-3">
                  <span aria-hidden="true" className="text-lg leading-none text-[#A15B72]">
                    &rarr;
                  </span>
                  <p className="text-base leading-7 text-[#4B3641]">{item.recommendation}</p>
                </div>
              </div>
            );

            if (item.href) {
              return (
                <Link key={`${item.condition}-${item.recommendation}`} href={item.href} className="block">
                  {content}
                </Link>
              );
            }

            return <div key={`${item.condition}-${item.recommendation}`}>{content}</div>;
          })}
        </div>
      </section>
    </RevealOnScroll>
  );
}
