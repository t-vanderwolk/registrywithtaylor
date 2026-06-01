import Link from 'next/link';
import ConsultationRequestForm from '@/components/contact/ConsultationRequestForm';
import RibbonDivider from '@/components/layout/RibbonDivider';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

type ConsultationRequestSectionProps = {
  id?: string;
  returnPath?: string;
  successPath?: string;
  submitLabel?: string;
};

export default function ConsultationRequestSection({
  id = 'request-a-consult',
  returnPath = '/#request-a-consult',
  successPath = '/consultation/confirmation',
  submitLabel = 'Request a Consultation',
}: ConsultationRequestSectionProps) {
  return (
    <section
      id={id}
      className="relative z-10 overflow-visible bg-[linear-gradient(180deg,#fff6f7_0%,#fbf7f2_100%)] pb-4 pt-10 sm:pt-14 md:pb-10 md:pt-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 z-30 w-screen -translate-x-1/2 -translate-y-[44%] sm:-translate-y-1/2">
        <RibbonDivider />
      </div>
      <div className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-5 sm:gap-7 lg:grid-cols-[minmax(0,0.88fr)_minmax(20rem,1fr)] lg:items-start lg:gap-12 xl:gap-16">
          <RevealOnScroll>
            <div className="max-w-[32rem] sm:max-w-[36rem]">
              <div className="relative z-10">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/78">
                  Request a Consultation
                </p>
                <h2 className="mt-4 font-serif text-[1.85rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.9rem]">
                  Start with confidence.
                </h2>
                <p className="mt-4 max-w-none text-[0.98rem] leading-7 text-neutral-700 sm:mt-5 sm:text-[1rem] sm:leading-8">
                  If you want expert eyes on your registry, stroller shortlist, car seat plan, or nursery setup, start
                  here.
                </p>
                <p className="mt-4 max-w-none text-[0.98rem] leading-7 text-neutral-700 sm:text-[1rem] sm:leading-8">
                  Walk through the guided intake and Taylor will follow up directly. The first conversation is meant to
                  bring clarity, not more tabs to compare.
                </p>

                <div className="mt-6 space-y-3 text-sm leading-7 text-neutral-700 sm:mt-7 sm:space-y-3.5">
                  <p>Complimentary first conversation</p>
                  <p>Available virtually or in person</p>
                  <p>Built for real homes, real routines, and the decisions that actually matter</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120}>
            <MarketingSurface className="relative overflow-hidden rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(252,247,244,0.94)_100%)] p-3.5 shadow-[0_24px_58px_rgba(55,40,46,0.06)] sm:rounded-[2rem] sm:p-7">
              <div className="absolute inset-x-[12%] top-[-8%] h-24 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.18)_0%,rgba(232,154,174,0)_74%)] blur-2xl" />

              <div className="relative">
                <ConsultationRequestForm
                  returnPath={returnPath}
                  successPath={successPath}
                  submitLabel={submitLabel}
                />

                <p className="mt-6 text-center text-sm text-neutral-600">
                  Prefer to review the full page first?{' '}
                  <Link href="/consultation" className="link-underline">
                    View consultation details
                  </Link>
                </p>
              </div>
            </MarketingSurface>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
