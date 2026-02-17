import type { ReactNode } from 'react';

type QualificationItem = {
  id: string;
  title: ReactNode;
  copy: ReactNode;
};

const qualificationItems: QualificationItem[] = [
  {
    id: 'guidance',
    title: 'You crave thoughtful, personal guidance',
    copy: (
      <>
        You want a steady, experienced voice helping you filter what actually matters with more{' '}
        <strong className="font-semibold text-[#2f2b28]">clarity</strong>.
      </>
    ),
  },
  {
    id: 'clarity',
    title: (
      <>
        You want <strong className="font-semibold text-[#2f2b28]">clarity</strong> without the noise
      </>
    ),
    copy: 'You are overwhelmed by opinions and ready for decisions that fit your real life.',
  },
  {
    id: 'intentional',
    title: (
      <>
        You value <strong className="font-semibold text-[#2f2b28]">intentional</strong> choices over
        trends
      </>
    ),
    copy: 'You care more about longevity and function than what is popular this month.',
  },
  {
    id: 'confidence',
    title: (
      <>
        You desire <strong className="font-semibold text-[#2f2b28]">confidence</strong> before the baby
        arrives
      </>
    ),
    copy: 'You want a grounded plan that leaves space for calm, flexibility, and real life.',
  },
];

export default function ForYouIf() {
  return (
    <div className="space-y-10">
      <h2 className="this-for-you-header text-center">This Is For You If…</h2>
      <div className="this-for-you-grid">
        {qualificationItems.map((item) => (
          <article key={item.id} className="this-for-you-card card-surface">
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
      <div className="this-for-you-thesis !py-[clamp(2rem,4vw,3rem)]">
        <p className="this-for-you-thesis__line !text-[clamp(1.26rem,2.15vw,1.56rem)] italic font-light">
          It’s not about buying more.
        </p>
        <p className="this-for-you-thesis__line this-for-you-thesis__line--emphasis">
          It’s about choosing with <span className="font-semibold">intention</span>.
        </p>
      </div>
    </div>
  );
}
