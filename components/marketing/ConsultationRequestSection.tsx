import Link from 'next/link';
import ConsultationRequestForm from '@/components/contact/ConsultationRequestForm';
import RibbonDivider from '@/components/layout/RibbonDivider';
import MarketingSurface from '@/components/ui/MarketingSurface';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

type ConsultationRequestSectionProps = {
  id?: string;
  errorCode?: string | null;
  returnPath?: string;
  successPath?: string;
  submitLabel?: string;
};

export default function ConsultationRequestSection({
  id = 'request-a-consult',
  errorCode = null,
  returnPath = '/#request-a-consult',
  successPath = '/consultation/confirmation',
  submitLabel = 'Request a Consultation',
}: ConsultationRequestSectionProps) {
  return (
    <section
      id={id}
      className="relative z-10 overflow-visible bg-[linear-gradient(180deg,#fff6f7_0%,#fbf7f2_100%)] pt-20 pb-8 md:pt-28 md:pb-10"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 z-30 w-screen -translate-x-1/2 -translate-y-1/2">
        <RibbonDivider />
      </div>
      <div className="relative z-20 mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(20rem,1fr)] lg:items-start lg:gap-12 xl:gap-16">
          <RevealOnScroll>
            <div className="max-w-[36rem]">
              <div className="relative z-10">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/78">
                  Request a Consultation
                </p>
                <h2 className="mt-4 font-serif text-[2.3rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.9rem]">
                  Start with confidence.
                </h2>
                <p className="mt-5 max-w-none text-[1rem] leading-8 text-neutral-700">
                  If you want expert eyes on your registry, stroller shortlist, car seat plan, or nursery setup, start
                  here.
                </p>
                <p className="mt-4 max-w-none text-[1rem] leading-8 text-neutral-700">
                  Submit a short request and Taylor will follow up directly. The first conversation is meant to bring
                  clarity, not more tabs to compare.
                </p>

                <div className="mt-8 space-y-4 text-sm leading-7 text-neutral-700">
                  <p>Complimentary first conversation</p>
                  <p>Available virtually or in person</p>
                  <p>Built for real homes, real routines, and the decisions that actually matter</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120}>
            <MarketingSurface className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(252,247,244,0.94)_100%)] p-6 shadow-[0_24px_58px_rgba(55,40,46,0.06)] sm:p-8">
              <div className="absolute inset-x-[12%] top-[-8%] h-24 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.18)_0%,rgba(232,154,174,0)_74%)] blur-2xl" />

              <div className="relative">
                <ConsultationRequestForm
                  errorCode={errorCode}
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
