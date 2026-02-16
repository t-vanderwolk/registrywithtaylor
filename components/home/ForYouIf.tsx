import { Body } from '@/components/Typography';

const qualificationItems = [
  {
    title: 'You crave thoughtful, personal guidance',
    copy: 'You want a steady, experienced voice helping you filter what actually matters.',
  },
  {
    title: 'You want clarity without the noise',
    copy: 'You are overwhelmed by opinions and ready for decisions that fit your life.',
  },
  {
    title: 'You value intentional choices over trends',
    copy: 'You care more about longevity and function than what is popular this month.',
  },
  {
    title: 'You desire confidence before the baby arrives',
    copy: 'You want a grounded plan that leaves space for calm, flexibility, and real life.',
  },
];

export default function ForYouIf() {
  return (
    <div className="space-y-10">
      <h2 className="this-for-you-header text-center">This is for you if…</h2>
      <div className="this-for-you-grid">
        {qualificationItems.map((item) => (
          <article key={item.title} className="this-for-you-card card-surface">
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
      <div className="this-for-you-thesis">
        <Body className="this-for-you-thesis__line">It’s not about buying more.</Body>
        <Body className="this-for-you-thesis__line this-for-you-thesis__line--emphasis">
          It’s about choosing with intention.
        </Body>
      </div>
    </div>
  );
}
