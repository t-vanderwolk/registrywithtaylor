import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import SiteShell from '@/components/SiteShell';
import { authOptions } from '@/lib/server/authOptions';
import { getAcademyHomeData } from '@/lib/academy/content';
import prisma from '@/lib/server/prisma';
import ChangePasswordForm from './ChangePasswordForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Academy | Taylor-Made Baby Co.',
  robots: { index: false, follow: false },
};

// ─── Tier helpers ──────────────────────────────────────────────────────────────

const TIER_LABELS: Record<string, string> = {
  free: 'Free Preview',
  academy: 'Academy',
  academy_plus: 'Academy+',
  concierge: 'Concierge',
};

function hasFullAccess(tier: string | null | undefined): boolean {
  return tier === 'academy' || tier === 'academy_plus' || tier === 'concierge';
}

function getFirstName(
  learnerName: string | null | undefined,
  userName: string | null | undefined,
  email: string,
): string {
  const name = learnerName ?? userName;
  if (name) return name.split(' ')[0] ?? name;
  // Friendly fallback: use the part of the email before @
  return email.split('@')[0] ?? 'there';
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function MemberDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
  }

  // Admin and reviewer users have their own dashboards — send them there.
  if (session.user.role === 'ADMIN') redirect('/admin');
  if (session.user.role === 'REVIEWER') redirect('/dashboard/reviewer');

  const email = session.user.email ?? '';

  // Look up enrollment tier, display name, and module progress in parallel.
  const [learner, user, progressRows] = await Promise.all([
    prisma.learner.findUnique({
      where: { email },
      select: { id: true, name: true, subscriptionTier: true, dueDate: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    }),
    // We fetch this unconditionally; it returns [] if no learner/progress yet.
    prisma.lessonProgress.groupBy({
      by: ['pathSlug'],
      where: {
        learner: { email },
      },
      _count: { moduleSlug: true },
    }),
  ]);

  // Map pathSlug → modules visited
  const progressByPath: Record<string, number> = {};
  for (const row of progressRows) {
    progressByPath[row.pathSlug] = row._count.moduleSlug;
  }

  const PATH_TOTALS: Record<string, number> = {
    registry: 8, nursery: 6, gear: 9, postpartum: 6,
  };

  const tier = learner?.subscriptionTier ?? null;
  const fullAccess = hasFullAccess(tier);
  const tierLabel = tier ? (TIER_LABELS[tier] ?? tier) : null;
  const firstName = getFirstName(learner?.name, user?.name, email);

  const dueDateLabel = learner?.dueDate
    ? new Date(learner.dueDate).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  const academyHome = getAcademyHomeData();

  return (
    <SiteShell currentPath="/dashboard">
      <main className="site-main" style={{ backgroundColor: 'var(--color-ivory)' }}>
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">

          {/* ── Header ───────────────────────────────────────────────────── */}
          <header className="mb-10 sm:mb-14">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-accent-dark)]">
              Welcome back
            </p>
            <h1 className="mt-2 font-serif text-[2.2rem] leading-[1.06] tracking-[-0.03em] text-neutral-900 sm:text-[2.8rem]">
              {firstName}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {tierLabel ? (
                <span className="inline-flex items-center rounded-full bg-[var(--tmbc-soft-pink)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
                  {tierLabel}
                </span>
              ) : null}
              {dueDateLabel ? (
                <span className="text-[0.85rem] text-neutral-500">
                  Due {dueDateLabel}
                </span>
              ) : null}
            </div>
          </header>

          {/* ── Free-tier upgrade banner ──────────────────────────────────── */}
          {tier === 'free' ? (
            <div className="mb-10 rounded-[1.25rem] border border-[rgba(215,161,175,0.3)] bg-[rgba(255,248,249,0.85)] px-5 py-4 sm:flex sm:items-center sm:justify-between sm:px-6">
              <p className="text-[0.93rem] leading-[1.7] text-neutral-700">
                You&apos;re on the free preview. Upgrade to unlock all four Academy paths.
              </p>
              <Link
                href="/learn/pricing"
                className="mt-3 inline-block shrink-0 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-[0.85rem] font-semibold text-white transition-opacity hover:opacity-80 sm:ml-6 sm:mt-0"
              >
                View plans →
              </Link>
            </div>
          ) : null}

          {/* ── Path grid ────────────────────────────────────────────────── */}
          <section aria-label="Your Academy paths">
            <p className="mb-6 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]/72">
              Your paths
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              {academyHome.paths.map((path) => {
                const locked        = !fullAccess;
                const href          = locked ? '/learn/pricing' : `/learn/${path.slug}`;
                const visited       = progressByPath[path.slug] ?? 0;
                const total         = PATH_TOTALS[path.slug] ?? 0;
                const pct           = total > 0 ? Math.min(100, Math.round((visited / total) * 100)) : 0;
                const hasProgress   = visited > 0;

                return (
                  <article
                    key={path.slug}
                    className="group relative overflow-hidden rounded-[1.75rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(252,246,248,0.96)_100%)] shadow-[0_18px_44px_rgba(58,36,43,0.06)] transition-shadow duration-200 hover:shadow-[0_22px_56px_rgba(58,36,43,0.10)]"
                  >
                    {/* Path image */}
                    <div className="relative h-44 w-full overflow-hidden">
                      <Image
                        src={path.imagePath}
                        alt={path.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
                          locked ? 'opacity-50 grayscale' : ''
                        }`}
                      />
                      {locked ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/10">
                          <span className="rounded-full bg-white/90 px-3.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-neutral-500 shadow-sm">
                            Upgrade to unlock
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* Card body */}
                    <div className="p-5 sm:p-6">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/65">
                        {path.eyebrow}
                      </p>
                      <h2 className="mt-1.5 font-serif text-[1.45rem] leading-[1.1] tracking-[-0.03em] text-neutral-900">
                        {path.title}
                      </h2>
                      <p className="mt-2 text-[0.88rem] leading-[1.75] text-neutral-500">
                        {path.description}
                      </p>

                      {/* Progress bar — only shown for unlocked paths with activity */}
                      {!locked && hasProgress && (
                        <div className="mt-4">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-[0.7rem] text-neutral-400">
                              {visited} of {total} modules visited
                            </span>
                            <span className="text-[0.7rem] font-medium text-[var(--color-accent-dark)]">
                              {pct}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                            <div
                              className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <Link
                          href={href}
                          className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[0.85rem] font-semibold transition-opacity duration-150 hover:opacity-80 ${
                            locked
                              ? 'bg-neutral-100 text-neutral-500'
                              : 'bg-[var(--color-accent)] text-white'
                          }`}
                        >
                          {locked ? 'Upgrade to access' : hasProgress ? 'Continue →' : 'Enter path →'}
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* ── Free preview callout (always show) ───────────────────────── */}
          <section
            aria-label="Free preview lessons"
            className="mt-10 rounded-[1.5rem] border border-[rgba(215,161,175,0.18)] bg-white/70 px-5 py-5 sm:px-6"
          >
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]/65">
              Always available
            </p>
            <h2 className="mt-1 font-serif text-[1.2rem] leading-snug tracking-[-0.02em] text-neutral-800">
              Free preview lessons
            </h2>
            <p className="mt-2 text-[0.88rem] leading-[1.75] text-neutral-500">
              Three standalone lessons — no enrollment required — covering registry strategy, nursery planning, and stroller decisions.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {[
                { href: '/learn/art-of-the-registry', label: 'The Art of the Registry' },
                { href: '/learn/nursery-foundations', label: 'Nursery Foundations' },
                { href: '/learn/stroller-foundations', label: 'The Stroller Equation' },
              ].map((lesson) => (
                <Link
                  key={lesson.href}
                  href={lesson.href}
                  className="rounded-full border border-[rgba(215,161,175,0.3)] bg-[var(--tmbc-soft-pink)] px-4 py-2 text-[0.83rem] font-medium text-[var(--color-accent-dark)] transition-opacity hover:opacity-75"
                >
                  {lesson.label}
                </Link>
              ))}
            </div>
          </section>

          {/* ── Password change ──────────────────────────────────────────── */}
          <ChangePasswordForm />

          {/* ── Footer links ─────────────────────────────────────────────── */}
          <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(215,161,175,0.2)] pt-8">
            <p className="text-[0.8rem] text-neutral-400">Taylor-Made Baby Academy</p>
            <nav className="flex gap-5" aria-label="Dashboard footer">
              <Link
                href="/learn"
                className="text-[0.83rem] text-[var(--color-accent-dark)] underline underline-offset-2 hover:opacity-75"
              >
                Academy home
              </Link>
              <Link
                href="/consultation"
                className="text-[0.83rem] text-[var(--color-accent-dark)] underline underline-offset-2 hover:opacity-75"
              >
                Book a consultation
              </Link>
            </nav>
          </footer>

        </div>
      </main>
    </SiteShell>
  );
}
