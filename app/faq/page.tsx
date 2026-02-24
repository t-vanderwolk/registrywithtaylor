import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'FAQ — Taylor-Made Baby Co.',
  description:
    'Frequently asked questions about Taylor-Made Baby Co.\'s services, process, and support.',
  path: '/faq',
  imagePath: '/assets/hero/hero-05.jpg',
  imageAlt: 'Frequently asked questions',
});

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border-b border-neutral-200 pb-4">
      <summary className="cursor-pointer font-medium text-neutral-900 flex justify-between items-center py-3">
        {question}
        <span className="text-neutral-400 group-open:rotate-45 transition-transform">+</span>
      </summary>
      <p className="text-neutral-700 leading-relaxed pt-2">
        {answer}
      </p>
    </details>
  );
}

export default function FAQPage() {
  return (
    <SiteShell currentPath="/faq">
      <main className="site-main">
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="max-w-3xl mx-auto space-y-16">

            {/* Page Header */}
            <div className="text-center space-y-6">
              <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-neutral-900">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-neutral-700">
                A little clarity before we begin.
              </p>
            </div>

            {/* FAQ Groups */}
            <div className="space-y-12">

              {/* Complimentary Consultation */}
              <div className="space-y-6">
                <h2 className="font-serif text-3xl tracking-tight text-neutral-900">
                  Complimentary Consultation
                </h2>

                <FAQItem
                  question="Is the consultation really complimentary?"
                  answer="Yes. The virtual consultation is offered through the Target Baby Concierge program powered by Tot Squad. There is no cost to book the session."
                />

                <FAQItem
                  question="Do I need to register at Target first?"
                  answer="Yes. The consultation is part of the Target Baby Concierge experience. Once your registry is created, you can schedule your session and I’ll serve as your dedicated Baby Specialist through Tot Squad."
                />

                <FAQItem
                  question="Will I be meeting with you directly?"
                  answer="Yes. When you book through the Tot Squad platform, you’ll meet with me personally for your consultation."
                />

                <FAQItem
                  question="What happens during the session?"
                  answer="We review your registry, your space, your lifestyle, and your timeline. Together, we identify what’s essential, what may be unnecessary, and what best supports how you actually live. The goal is clarity — not more things."
                />

                <FAQItem
                  question="How long is the consultation?"
                  answer="Most sessions are 30–60 minutes, depending on your needs."
                />

                <FAQItem
                  question="What should I prepare beforehand?"
                  answer="Come with your registry (even if it’s unfinished), your biggest questions, and a sense of your space. You don’t need to have everything figured out — that’s what the session is for."
                />
              </div>

              {/* After the Consultation */}
              <div className="space-y-6">
                <h2 className="font-serif text-3xl tracking-tight text-neutral-900">
                  After the Consultation
                </h2>

                <FAQItem
                  question="What happens after our session?"
                  answer="Some families feel fully confident moving forward independently. Others choose continued support through Taylor-Made Baby Co. for more structured, private planning. There is no obligation either way."
                />

                <FAQItem
                  question="Am I required to book private services?"
                  answer="No. The complimentary consultation stands on its own. If you’d like additional support — nursery planning, registry refinement, gear strategy, or ongoing guidance — those services are available separately through Taylor-Made Baby Co."
                />

                <FAQItem
                  question="What’s the difference between Tot Squad and Taylor-Made Baby Co.?"
                  answer="Tot Squad powers the Target Baby Concierge program, which provides complimentary registry consultations. Taylor-Made Baby Co. offers private, personalized planning services for families who want continued guidance beyond that initial session."
                />
              </div>

              {/* Private Planning Services */}
              <div className="space-y-6">
                <h2 className="font-serif text-3xl tracking-tight text-neutral-900">
                  Private Planning Services
                </h2>

                <FAQItem
                  question="What do private services include?"
                  answer="Private services may include registry refinement, nursery layout and design guidance, product comparison and gear strategy, personal shopping support, and ongoing planning sessions. Each engagement is tailored to your family."
                />

                <FAQItem
                  question="Do you work with families outside Chicago?"
                  answer="Yes. Most consultations are virtual and available nationwide. In-home support may be available for select clients."
                />

                <FAQItem
                  question="Do you receive commission on products you recommend?"
                  answer="I may receive affiliate compensation from certain retail partners, but recommendations are always based on what fits your lifestyle, space, and priorities — not on commission. Clarity and trust come first."
                />

                <FAQItem
                  question="How do I know if private planning is right for me?"
                  answer="If you’re looking for continued structure, thoughtful decision-making, and a calm, guided approach to preparation — private planning may be a strong fit. If you’re unsure, begin with your complimentary consultation."
                />
              </div>

            </div>

          </div>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="spacious" container="narrow">
          <div className="text-center space-y-6">

            <p className="text-lg text-neutral-700 leading-relaxed">
              Not sure if private planning is the right fit?
            </p>

            <Link href="/how-it-works" className="btn btn--secondary">
              Start with a Complimentary Consultation
            </Link>

          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
