import SiteShell from '@/components/SiteShell';
import RedeemForm from '@/components/gift/RedeemForm';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const dynamic = 'force-dynamic';

export const metadata = buildMarketingMetadata({
  title: 'Redeem Your Gift — Taylor-Made Baby Co.',
  description: 'Redeem your prepaid Registry Consult gift and book a time that works for you.',
  path: '/redeem',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Redeem your Registry Consult gift with Taylor-Made Baby Co.',
});

export default async function RedeemPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <SiteShell currentPath="/redeem">
      <main className="min-h-screen" style={{ backgroundColor: '#fbf7f4' }}>
        <section className="mx-auto max-w-lg px-6 py-20 text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]">
            Gift Redemption
          </p>
          <h1 className="mt-3 font-serif text-[2.2rem] leading-[1.1] tracking-[-0.03em] text-neutral-900">
            Redeem Your Session
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[1rem] leading-7 text-neutral-600">
            You&rsquo;ve been given a prepaid 1-hour Registry Consult. Enter your gift code to book your time —
            no payment needed.
          </p>

          <div className="mt-8 rounded-[1.25rem] border border-[rgba(215,161,175,0.2)] bg-white p-6 text-left shadow-[0_6px_18px_rgba(72,49,56,0.05)] sm:p-8">
            <RedeemForm initialCode={code ?? ''} />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
