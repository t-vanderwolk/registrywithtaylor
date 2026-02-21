import Script from 'next/script';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';

export default function BookPage() {
  return (
    <SiteShell currentPath="/book">
      <Script
        src="https://babyconcierge.totsquad.com/embed.js"
        strategy="lazyOnload"
      />

      <main className="site-main">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#f3ece5] via-[#f8f4f0] to-white pt-24 md:pt-28 pb-12">
          <div className="max-w-3xl mx-auto text-center px-6">
            <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] tracking-[-0.01em] mb-6">
              Book Your Complimentary Consultation
            </h1>
            <p className="text-neutral-700 text-lg leading-relaxed">
              Choose a time that works for you. Your session will be virtual and tailored to your home, lifestyle, and priorities.
            </p>
          </div>
        </section>

        {/* Scheduler Section */}
        <MarketingSection
          tone="white"
          spacing="spacious"
          container="default"
        >
          <div className="max-w-4xl mx-auto">
            <div className="rounded-[24px] bg-[var(--color-ivory)] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 md:p-10">
              <div
                className="embedded-booking"
                data-url="https://babyconcierge.totsquad.com"
                data-query="&t=s&uuid=ec6a0d0c-5a41-4f81-92d5-df142be0b551"
                data-employee="taylor-vanderwolk"
                data-lang="en"
                data-autoresize="0"
                data-showsidebar="1"
                data-showservices="0"
                style={{ minWidth: '320px', height: '768px' }}
              />
            </div>
          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
