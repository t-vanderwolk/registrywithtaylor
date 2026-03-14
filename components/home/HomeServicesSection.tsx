import Link from 'next/link';
import CheckIcon from '@/components/ui/CheckIcon';
import SectionIntro from '@/components/ui/SectionIntro';

type HomeServiceKey = 'focused-edit' | 'signature-plan' | 'private-concierge';

type ServiceDetailGroup = {
  title: string;
  items: string[];
};

type HomeServiceCard = {
  key: HomeServiceKey;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  detailGroups: ServiceDetailGroup[];
  availability: string;
  badge?: string;
  featured?: boolean;
};

const homeServiceCards: HomeServiceCard[] = [
  {
    key: 'focused-edit',
    eyebrow: 'One Decision',
    title: 'Focused Edit',
    subtitle: '90-minute private consultation',
    description:
      'Perfect for families who need clarity around a few key baby gear or registry decisions.',
    detailGroups: [
      {
        title: 'Common topics include',
        items: [
          'stroller comparisons',
          'car seat selection',
          'registry review',
          'nursery planning',
          'baby gear troubleshooting',
        ],
      },
      {
        title: "You'll leave with",
        items: [
          'clear product recommendations',
          'a simplified registry strategy',
          'practical next steps for preparation',
        ],
      },
    ],
    availability: 'Available virtually or in person.',
  },
  {
    key: 'signature-plan',
    eyebrow: 'Full Baby Prep',
    title: 'Signature Edit',
    subtitle: 'Complete baby planning experience',
    description:
      'A guided planning process designed to help families prepare their registry, nursery, and home with clarity.',
    detailGroups: [
      {
        title: 'Includes',
        items: [
          'three 90-minute planning sessions',
          'personalized registry blueprint',
          'complimentary in-home babyproofing walkthrough',
          'Taylor-Made safety quote via AZ Childproofers',
          'car seat installation guidance with CPST partner',
        ],
      },
    ],
    availability: 'Available virtually or in person.',
    badge: 'Most Popular',
    featured: true,
  },
  {
    key: 'private-concierge',
    eyebrow: 'Ongoing Support',
    title: 'Private Concierge',
    subtitle: 'Ongoing planning support',
    description:
      'Designed for families who want hands-on support throughout pregnancy and early parenthood.',
    detailGroups: [
      {
        title: 'Includes everything in',
        items: ['Focused Edit', 'Signature Edit'],
      },
      {
        title: 'Plus',
        items: [
          'ongoing planning support',
          'guidance through gear upgrades and transitions',
          'preparation for a second child',
          'priority access for additional questions',
        ],
      },
    ],
    availability: 'Available virtually or in person.',
  },
];

function ServiceDetailCard({ title, items }: ServiceDetailGroup) {
  return (
    <div className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#fcf8f4_0%,#f8efe6_100%)] p-4">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/45">{title}</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-4">
            <CheckIcon frameClassName="mt-0.5" />
            <p className="max-w-none text-[0.94rem] leading-7 text-neutral-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomeServicesSection() {
  return (
    <section className="bg-[linear-gradient(180deg,#fff8f6_0%,#fbf6f1_100%)] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionIntro
          spacing="tight"
          title="Services"
          description="All consultations are available virtually or in person."
          contentWidthClassName="max-w-4xl"
        />

        <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-3">
          {homeServiceCards.map((service) => (
            <article
              key={service.key}
              className={[
                'flex h-full flex-col rounded-[1.75rem] border bg-white p-5 shadow-sm sm:rounded-2xl sm:p-7',
                service.featured ? 'border-[rgba(216,137,160,0.34)]' : 'border-[rgba(0,0,0,0.06)]',
              ].join(' ')}
            >
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                  {service.eyebrow}
                </p>
                {service.badge ? (
                  <span className="self-start rounded-full border border-[rgba(196,156,94,0.28)] bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)]">
                    {service.badge}
                  </span>
                ) : null}
              </div>

              <div
                className={[
                  'mt-4 rounded-[1.4rem] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fff6f3_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:rounded-2xl sm:p-5',
                  service.featured ? 'bg-[linear-gradient(180deg,#ffffff_0%,#fff1f4_100%)] text-center' : '',
                ].join(' ')}
              >
                <h3 className="font-serif text-[1.5rem] leading-[1.06] tracking-[-0.035em] text-neutral-900 sm:text-[1.75rem]">
                  {service.title}
                </h3>
                <p className="mt-2 max-w-none text-[0.95rem] leading-7 text-neutral-600">{service.subtitle}</p>
              </div>

              <p className="mt-5 max-w-none text-[0.98rem] leading-7 text-neutral-700">{service.description}</p>

              <div className="mt-5 space-y-5">
                {service.detailGroups.map((group) => (
                  <ServiceDetailCard key={`${service.key}-${group.title}`} {...group} />
                ))}
              </div>

              <div className="mt-auto pt-6">
                <p className="text-sm text-neutral-500">{service.availability}</p>
                <Link href={`/contact?service=${service.key}`} className="btn btn--primary mt-4 w-full justify-center pt-0">
                  Start a Consultation
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
