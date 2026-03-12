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
  price: string;
  subtitle: string;
  description: string;
  detailGroups: ServiceDetailGroup[];
  availability: string;
  badge?: string;
  featured?: boolean;
};

type AddOnService = {
  title: string;
  description: string;
};

const homeServiceCards: HomeServiceCard[] = [
  {
    key: 'focused-edit',
    eyebrow: 'One Decision',
    title: 'Focused Edit',
    price: '$300',
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
    price: '$1,500',
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
    price: '$3,000',
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

const optionalAddOns: AddOnService[] = [
  {
    title: 'Nursery Layout Planning',
    description: 'Furniture placement, room flow, and sleep environment guidance.',
  },
  {
    title: 'Registry Refresh',
    description: 'Review and refine your registry after your baby shower or later in pregnancy.',
  },
  {
    title: 'Baby Gear Troubleshooting',
    description: 'Help with strollers, carriers, monitors, feeding gear, and everyday gear questions.',
  },
  {
    title: 'Travel With Baby Planning',
    description: 'Guidance on travel strollers, car seats, and flying with an infant.',
  },
  {
    title: 'Postpartum Preparation',
    description: 'Support planning feeding stations, recovery supplies, and home organization.',
  },
  {
    title: 'Sibling and Animal Introduction Prep',
    description: 'Guidance for smoother introductions, safer transitions, and realistic prep before baby comes home.',
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

function OptionalAddOnCard({ title, description }: AddOnService) {
  return (
    <article className="h-full rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-sm sm:p-7">
      <h3 className="font-serif text-[1.45rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
        {title}
      </h3>
      <p className="mt-4 max-w-none text-[0.98rem] leading-7 text-neutral-700">{description}</p>
    </article>
  );
}

export default function HomeServicesSection() {
  return (
    <section className="bg-[linear-gradient(180deg,#fff8f6_0%,#fbf6f1_100%)] py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionIntro
          title="Services"
          description="All consultations are available virtually or in person."
          contentWidthClassName="max-w-4xl"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {homeServiceCards.map((service) => (
            <article
              key={service.key}
              className={[
                'flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm sm:p-7',
                service.featured ? 'border-[rgba(216,137,160,0.34)]' : 'border-[rgba(0,0,0,0.06)]',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                  {service.eyebrow}
                </p>
                {service.badge ? (
                  <span className="rounded-full border border-[rgba(196,156,94,0.28)] bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)]">
                    {service.badge}
                  </span>
                ) : null}
              </div>

              <div
                className={[
                  'mt-4 rounded-2xl border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fff6f3_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]',
                  service.featured ? 'bg-[linear-gradient(180deg,#ffffff_0%,#fff1f4_100%)] text-center' : '',
                ].join(' ')}
              >
                <p className="mb-1 font-serif text-sm text-neutral-500">{service.price}</p>
                <h3 className="font-serif text-[1.65rem] leading-[1.06] tracking-[-0.035em] text-neutral-900 sm:text-[1.75rem]">
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

        <div className="mt-24">
          <SectionIntro
            title="Optional Add-Ons"
            description="Additional support for families who want help with specific preparation areas."
            contentWidthClassName="max-w-4xl"
          />

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {optionalAddOns.map((addOn) => (
              <OptionalAddOnCard key={addOn.title} {...addOn} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
