import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Consultation Request Received - Taylor-Made Baby Co.',
  description: 'Your consultation request has been received.',
  path: '/consultation/confirmation',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Consultation request received',
});

export default function ConsultationConfirmationPage() {
  return (
    <SiteShell currentPath="/consultation">
      <main className="site-main">
        <MarketingSection tone="white" spacing="default" container="narrow">
          <MarketingSurface className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] px-5 py-6 text-center sm:px-8 sm:py-8">
            <div
              className="consult-success-card mx-auto flex max-w-[24rem] flex-col items-center"
              role="status"
              aria-live="polite"
            >
              <div className="relative flex h-28 w-28 items-center justify-center">
                <span
                  aria-hidden="true"
                  className="consult-success-orb absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(216,137,160,0.2)_0%,rgba(216,137,160,0.04)_58%,rgba(216,137,160,0)_76%)]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-[16%] rounded-full border border-[rgba(216,137,160,0.32)] bg-white/88 shadow-[0_14px_36px_rgba(47,36,48,0.08)]"
                />
                <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(180deg,#d889a0_0%,#c97691_100%)] text-white shadow-[0_14px_28px_rgba(201,118,145,0.32)]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-7 w-7"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
              </div>

              <p className="mt-4 text-[0.72rem] uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/82">
                Intake received
              </p>
              <h1 className="mt-3 font-serif text-[2.5rem] leading-[0.96] tracking-[-0.05em] text-neutral-900 sm:text-[3rem]">
                You&apos;re in.
              </h1>
              <p className="mt-4 text-base leading-8 text-neutral-700 sm:text-lg">
                Your consultation intake has been received. Taylor will review your notes and follow up shortly with next steps that fit your session goals.
              </p>
            </div>

            <div className="mt-7 grid gap-3 text-left sm:grid-cols-3">
              {[
                {
                  title: 'Taylor reviews your notes',
                  body: 'The session starts with context already in place, not scratch-paper backstory.',
                },
                {
                  title: 'The reply fits your week',
                  body: 'Your timing and meeting preference help shape the follow-up instead of getting sorted later.',
                },
                {
                  title: 'The goal is clarity',
                  body: 'You do not need to prepare anything else right now. The intake did its job.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.3rem] border border-[rgba(216,137,160,0.16)] bg-[linear-gradient(180deg,rgba(255,249,250,0.98)_0%,rgba(255,244,246,0.92)_100%)] px-4 py-4 shadow-[0_14px_28px_rgba(47,36,48,0.04)]"
                >
                  <p className="text-sm font-semibold leading-6 text-neutral-900">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/#journey" className="btn btn--secondary">
                Back to the Journey
              </Link>
              <Link href="/" className="btn btn--primary">
                Return Home
              </Link>
            </div>
          </MarketingSurface>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
