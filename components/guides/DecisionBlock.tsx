import Link from 'next/link';
import {
  GUIDE_SECTION_FRAME_CLASSNAME,
  GUIDE_SUPPORT_CARD_CLASSNAME,
  GuideSectionHeading,
} from '@/components/guides/GuidePrimitives';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

export type DecisionBlockItem = {
  condition: string;
  recommendation: string;
  href?: string;
};

export default function DecisionBlock({
  title = 'Decision Framework',
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
      <section className={GUIDE_SECTION_FRAME_CLASSNAME}>
        <GuideSectionHeading eyebrow="Decision Framework" title={title} description={description} />

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {items.map((item) => {
            const content = (
              <div
                className={`${GUIDE_SUPPORT_CARD_CLASSNAME} px-5 py-5 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_36px_rgba(58,36,43,0.08)]`}
              >
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
