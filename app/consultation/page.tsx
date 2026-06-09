import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import ConsultationSimpleForm from '@/components/contact/ConsultationSimpleForm';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Book a Free Consultation — Taylor-Made Baby Co.',
  description:
    'Request a free 30-minute consultation with Taylor for expert baby gear, registry, and baby-preparation guidance.',
  path: '/consultation',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Free consultation request form',
});

export default function ConsultationPage() {
  return (
    <SiteShell currentPath="/consultation">
      <main className="site-main">
        <PageViewTracker path="/consultation" pageType="book" />

        <Hero
          className="homepage-hero"
          eyebrow="Free Consultation"
          title="Let's figure out what you actually need."
          subtitle="Share a few details and I'll follow up personally within 24 hours. You'll receive an intake form by email — it helps me come to our call fully prepared, so every minute counts."
          image="/assets/hero/hero-06.jpg"
          imageAlt="Consultation planning"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        <MarketingSection tone="white" spacing="default" container="narrow">
          <RevealOnScroll>
            <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_minmax(0,1.6fr)] lg:items-start lg:gap-12">

              {/* Left: what to expect */}
              <div className="space-y-7">
                <div>
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">What to expect</p>
                  <h2 className="mt-4 font-serif text-[1.6rem] leading-[1.1] tracking-[-0.03em] text-neutral-900">
                    Simple. Personal. No pressure.
                  </h2>
                </div>

                <div className="space-y-5">
                  {[
                    {
                      step: '01',
                      title: 'Submit this form',
                      body: "Just your name, email, and what's on your mind. Takes under a minute.",
                    },
                    {
                      step: '02',
                      title: 'Complete your intake',
                      body: "You'll receive an intake form by email. Fill it out so I can come to our call fully prepared.",
                    },
                    {
                      step: '03',
                      title: 'Free 30-minute call',
                      body: 'We connect directly — just you and me — to talk through your situation and figure out the best next step together.',
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <span className="mt-0.5 shrink-0 font-serif text-[0.85rem] text-[var(--color-accent-dark)]/70">
                        {item.step}
                      </span>
                      <div>
                        <p className="font-medium text-neutral-900">{item.title}</p>
                        <p className="mt-1 text-[0.9rem] leading-6 text-neutral-500">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <figure className="border-l-2 border-[var(--color-accent-dark)]/30 pl-4">
                  <blockquote className="font-serif text-[1.1rem] leading-relaxed tracking-[-0.01em] text-neutral-700">
                    &ldquo;Taylor and I laughed the whole time but still able to get it done! Support I didn&rsquo;t know I needed.&rdquo;
                  </blockquote>
                  <figcaption className="mt-2 text-[0.72rem] uppercase tracking-[0.18em] text-black/40">
                    Expecting parent
                  </figcaption>
                </figure>
              </div>

              {/* Right: form */}
              <RevealOnScroll delayMs={80}>
                <MarketingSurface className="space-y-6">
                  <div>
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">Get started</p>
                    <h3 className="mt-3 font-serif text-[1.5rem] leading-[1.1] tracking-[-0.02em] text-neutral-900">
                      Request your free consultation
                    </h3>
                  </div>
                  <ConsultationSimpleForm />
                </MarketingSurface>
              </RevealOnScroll>

            </div>
          </RevealOnScroll>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
