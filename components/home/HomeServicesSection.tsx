import Link from 'next/link';
import CheckIcon from '@/components/ui/CheckIcon';
import MotionCtaContent from '@/components/ui/MotionCtaContent';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
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
    description: 'For families who want clarity on a few high-stakes gear or registry decisions.',
    detailGroups: [
      {
        title: 'Common topics include',
        items: ['stroller comparisons', 'car seat selection', 'registry review', 'nursery planning'],
      },
      {
        title: "You'll leave with",
        items: ['clear product recommendations', 'a simpler next-step plan'],
      },
    ],
    availability: 'Available virtually or in person.',
  },
  {
    key: 'signature-plan',
    eyebrow: 'Full Baby Prep',
    title: 'Signature Edit',
    subtitle: 'Complete baby planning experience',
    description: 'A guided planning process for families who want registry, nursery, and home prep decisions to work together.',
    detailGroups: [
      {
        title: 'Includes',
        items: [
          'three 90-minute planning sessions',
          'personalized registry blueprint',
          'complimentary in-home babyproofing walkthrough',
          'safety planning through trusted partners',
        ],
      },
    ],
    availability: 'Available virtually or in person.',
    badge: 'Most popular',
    featured: true,
  },
  {
    key: 'private-concierge',
    eyebrow: 'Ongoing Support',
    title: 'Private Concierge',
    subtitle: 'Ongoing planning support',
    description: 'For families who want hands-on support through pregnancy, setup, and early transitions.',
    detailGroups: [
      {
        title: 'Includes everything in',
        items: ['Focused Edit', 'Signature Edit'],
      },
      {
        title: 'Plus',
        items: [
          'ongoing planning support',
          'guidance through gear transitions',
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
      <div className="mt-4 space-y-2.5">
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
          description="Private support for families who want clearer decisions, calmer prep, and a registry that fits real life."
          contentWidthClassName="max-w-4xl"
        />

        <div className="mt-8 grid gap-6 sm:mt-12 sm:gap-8 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.08fr)_minmax(0,0.96fr)] lg:items-stretch">
          {homeServiceCards.map((service, index) => (
            <RevealOnScroll key={service.key} delayMs={index * 70}>
              <article
                className={[
                  'flex h-full flex-col rounded-[1.75rem] border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(55,40,46,0.08)] sm:rounded-2xl sm:p-7',
                  service.featured
                    ? 'relative border-[rgba(216,137,160,0.34)] shadow-[0_24px_70px_rgba(216,137,160,0.12)] lg:-translate-y-2 lg:scale-[1.02]'
                    : 'border-[rgba(0,0,0,0.06)]',
                ].join(' ')}
              >
                {service.featured ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-[16%] top-5 h-16 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.18)_0%,rgba(232,154,174,0)_74%)] blur-2xl"
                  />
                ) : null}

                <div className="relative">
                  {service.badge ? (
                    <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/78">
                      {service.badge}
                    </p>
                  ) : null}

                  <div className="flex flex-col items-start gap-3">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                      {service.eyebrow}
                    </p>
                  </div>

                  <div
                    className={[
                      'mt-4 rounded-[1.4rem] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fff6f3_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:rounded-2xl sm:p-5',
                      service.featured ? 'bg-[linear-gradient(180deg,#ffffff_0%,#fff1f4_100%)] text-center shadow-[0_14px_34px_rgba(216,137,160,0.08)]' : '',
                    ].join(' ')}
                  >
                    <h3
                      className={[
                        'font-serif leading-[1.06] tracking-[-0.035em] text-neutral-900',
                        service.featured ? 'text-[1.72rem] sm:text-[2rem]' : 'text-[1.5rem] sm:text-[1.75rem]',
                      ].join(' ')}
                    >
                      {service.title}
                    </h3>
                    <p className="mt-2 max-w-none text-[0.95rem] leading-7 text-neutral-600">{service.subtitle}</p>
                  </div>

                  <p className="mt-5 max-w-none text-[0.98rem] leading-7 text-neutral-700">{service.description}</p>

                  <div className="mt-6 space-y-5">
                    {service.detailGroups.map((group) => (
                      <ServiceDetailCard key={`${service.key}-${group.title}`} {...group} />
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  <p className="text-sm text-neutral-500">{service.availability}</p>
                  <Link
                    href={`/contact?service=${service.key}`}
                    className={[
                      'mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-shadow duration-200 hover:shadow-[0_16px_34px_rgba(55,40,46,0.08)]',
                      service.featured
                        ? 'bg-[var(--color-accent-dark)] text-white shadow-[0_16px_34px_rgba(55,40,46,0.12)]'
                        : 'border border-[rgba(196,156,94,0.18)] bg-white text-neutral-900 hover:shadow-sm',
                    ].join(' ')}
                  >
                    <MotionCtaContent>Book a Consultation</MotionCtaContent>
                  </Link>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delayMs={180}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/guides/strollers"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(196,156,94,0.16)] bg-white/78 px-5 py-3 text-sm font-semibold text-[var(--color-accent-dark)] transition duration-200 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <MotionCtaContent showArrow>Explore real product guidance</MotionCtaContent>
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
