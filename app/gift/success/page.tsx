import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import prisma from '@/lib/server/prisma';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const dynamic = 'force-dynamic';

export const metadata = {
  ...buildMarketingMetadata({
    title: 'Thank you — Taylor-Made Baby Co.',
    description: 'Your gift Registry Consult purchase is confirmed.',
    path: '/gift/success',
    imagePath: '/assets/hero/hero-06.jpg',
    imageAlt: 'Taylor-Made Baby Co.',
  }),
  robots: { index: false, follow: false },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export default async function GiftSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let gift: {
    code: string;
    recipientName: string;
    deliveryMode: string;
    recipientEmail: string | null;
  } | null = null;

  if (session_id) {
    gift = await db.giftCertificate
      .findUnique({
        where: { stripeSessionId: session_id },
        select: { code: true, recipientName: true, deliveryMode: true, recipientEmail: true },
      })
      .catch(() => null);
  }

  const deliveredNow = gift?.deliveryMode === 'now';

  return (
    <SiteShell currentPath="/gift">
      <main className="min-h-screen" style={{ backgroundColor: '#fbf7f4' }}>
        <section className="mx-auto max-w-xl px-6 py-20 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(216,137,160,0.14)] text-2xl">🎀</div>
          <h1 className="font-serif text-[2.1rem] leading-[1.1] tracking-[-0.03em] text-neutral-900">
            Thank you — your gift is confirmed
          </h1>

          {gift ? (
            <>
              <p className="mx-auto mt-4 max-w-md text-[1rem] leading-7 text-neutral-600">
                {deliveredNow ? (
                  <>
                    We&rsquo;ve emailed the gift certificate to <strong>{gift.recipientName}</strong>
                    {gift.recipientEmail ? <> at {gift.recipientEmail}</> : null}. You&rsquo;ll get a copy for
                    your records too.
                  </>
                ) : (
                  <>
                    Here&rsquo;s the gift certificate for <strong>{gift.recipientName}</strong> — download it and
                    share it whenever you&rsquo;d like. We&rsquo;ve emailed you a copy as well.
                  </>
                )}
              </p>

              <div className="mx-auto mt-7 max-w-xs rounded-[1rem] border border-[rgba(215,161,175,0.3)] bg-white px-6 py-5">
                <p className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-neutral-400">Gift Code</p>
                <p className="mt-1.5 font-mono text-[1.5rem] font-extrabold tracking-[0.12em] text-neutral-900">{gift.code}</p>
              </div>

              {!deliveredNow ? (
                <div className="mt-6">
                  <Link
                    href={`/gift/certificate/${encodeURIComponent(gift.code)}`}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--color-cta-pink)] px-6 py-3 text-[0.95rem] font-semibold text-white transition hover:bg-[var(--color-cta-pink-hover)]"
                  >
                    Download Gift Certificate →
                  </Link>
                </div>
              ) : null}
            </>
          ) : (
            <p className="mx-auto mt-4 max-w-md text-[1rem] leading-7 text-neutral-600">
              Your payment went through. If you don&rsquo;t see a confirmation email in a few minutes, just
              reply to any email from us and we&rsquo;ll sort it out.
            </p>
          )}

          <p className="mt-10 text-[0.85rem] text-neutral-500">
            Questions?{' '}
            <Link href="/contact" className="font-semibold text-[var(--color-accent-dark)] underline underline-offset-2">
              Get in touch
            </Link>
            .
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
