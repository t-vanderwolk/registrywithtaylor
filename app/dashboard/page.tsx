import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import { authOptions } from '@/lib/server/authOptions';
import {
  getAcademyHomeData,
  getAcademyPathTitle,
  getAcademyModuleTitle,
  isAcademyPathSlug,
  isAcademyModuleSlug,
} from '@/lib/academy/content';
import prisma from '@/lib/server/prisma';
import DashboardHero from './components/DashboardHero';
import PathCard from './components/PathCard';
import ContinueLearning from './components/ContinueLearning';
import WorkbookPanel from './components/WorkbookPanel';
import PDFLibrary from './components/PDFLibrary';
import ChangePasswordForm from './ChangePasswordForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Academy | Taylor-Made Baby Co.',
  robots: { index: false, follow: false },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIER_LABELS: Record<string, string> = {
  free:         'Free Preview',
  academy:      'Academy',
  academy_plus: 'Academy+',
  concierge:    'Concierge',
};

const PATH_TOTALS: Record<string, number> = {
  registry: 8, nursery: 6, gear: 9, postpartum: 6,
};

function hasFullAccess(tier: string | null | undefined) {
  return tier === 'academy' || tier === 'academy_plus' || tier === 'concierge';
}

function getFirstName(
  learnerName: string | null | undefined,
  userName: string | null | undefined,
  email: string,
) {
  const name = learnerName ?? userName;
  if (name) return name.split(' ')[0] ?? name;
  return email.split('@')[0] ?? 'there';
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function MemberDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login?callbackUrl=/dashboard');
  if (session.user.role === 'ADMIN') redirect('/admin');
  if (session.user.role === 'REVIEWER') redirect('/dashboard/reviewer');

  const email = session.user.email ?? '';

  const [learner, user, progressRows, recentRows, noteRows] = await Promise.all([
    prisma.learner.findUnique({
      where:  { email },
      select: { id: true, name: true, subscriptionTier: true, dueDate: true },
    }),
    prisma.user.findUnique({
      where:  { id: session.user.id },
      select: { name: true },
    }),
    // Per-path module counts for progress bars
    prisma.lessonProgress.groupBy({
      by:    ['pathSlug'],
      where: { learner: { email } },
      _count: { moduleSlug: true },
    }),
    // Recent module visits for "Continue learning"
    prisma.lessonProgress.findMany({
      where:   { learner: { email } },
      orderBy: { lastSeenAt: 'desc' },
      take:    6,
      select:  { pathSlug: true, moduleSlug: true },
    }),
    // Saved workbook notes
    prisma.moduleNote.findMany({
      where:   { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      select:  { pathSlug: true, moduleSlug: true, content: true, updatedAt: true },
    }),
  ]);

  // ── Derived data ────────────────────────────────────────────────────────────

  const tier       = learner?.subscriptionTier ?? null;
  const fullAccess = hasFullAccess(tier);
  const tierLabel  = tier ? (TIER_LABELS[tier] ?? tier) : null;
  const firstName  = getFirstName(learner?.name, user?.name, email);

  const dueDateLabel = learner?.dueDate
    ? new Date(learner.dueDate).toLocaleDateString('en-US', {
        month: 'long', year: 'numeric',
      })
    : null;

  const progressByPath: Record<string, number> = {};
  for (const row of progressRows) {
    progressByPath[row.pathSlug] = row._count.moduleSlug;
  }

  type ProgressRow = { pathSlug: string; moduleSlug: string };
  type NoteRow     = { pathSlug: string; moduleSlug: string; content: string; updatedAt: Date };

  // Build ContinueLearning items (deduplicate by path)
  const recentModules = (recentRows as ProgressRow[])
    .filter((r: ProgressRow) => isAcademyPathSlug(r.pathSlug) && isAcademyModuleSlug(r.moduleSlug))
    .slice(0, 4)
    .map((r: ProgressRow) => ({
      pathSlug:    r.pathSlug,
      moduleSlug:  r.moduleSlug,
      pathTitle:   isAcademyPathSlug(r.pathSlug) ? getAcademyPathTitle(r.pathSlug) : r.pathSlug,
      moduleTitle: isAcademyModuleSlug(r.moduleSlug) ? getAcademyModuleTitle(r.moduleSlug) : r.moduleSlug,
    }));

  // Build WorkbookPanel notes
  const notePathTitles: Record<string, string> = {};
  const workbookNotes = (noteRows as NoteRow[])
    .filter((n: NoteRow) => n.content.trim().length > 0)
    .map((n: NoteRow) => {
      if (isAcademyPathSlug(n.pathSlug)) {
        notePathTitles[n.pathSlug] = getAcademyPathTitle(n.pathSlug);
      }
      return {
        pathSlug:    n.pathSlug,
        moduleSlug:  n.moduleSlug,
        moduleTitle: isAcademyModuleSlug(n.moduleSlug) ? getAcademyModuleTitle(n.moduleSlug) : n.moduleSlug,
        content:     n.content,
        updatedAt:   n.updatedAt.toISOString(),
      };
    });

  const academyHome = getAcademyHomeData();

  return (
    <SiteShell currentPath="/dashboard">
      <main className="site-main" style={{ backgroundColor: 'var(--color-ivory)' }}>
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">

          <DashboardHero
            firstName={firstName}
            tierLabel={tierLabel}
            tier={tier}
            dueDateLabel={dueDateLabel}
          />

          {/* ── Path grid ──────────────────────────────────────────────────── */}
          <section aria-label="Your Academy paths">
            <p
              className="mb-6 text-[0.68rem] font-semibold uppercase tracking-[0.28em]"
              style={{ color: 'var(--color-accent-dark)', opacity: 0.72 }}
            >
              Your paths
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              {academyHome.paths.map((path) => (
                <PathCard
                  key={path.slug}
                  path={path}
                  locked={!fullAccess}
                  visited={progressByPath[path.slug] ?? 0}
                  total={PATH_TOTALS[path.slug] ?? 0}
                />
              ))}
            </div>
          </section>

          {/* ── Continue learning ───────────────────────────────────────────── */}
          {fullAccess && (
            <ContinueLearning recent={recentModules} />
          )}

          {/* ── Free preview callout ─────────────────────────────────────────── */}
          <section
            aria-label="Free preview lessons"
            className="mt-10 rounded-[1.5rem] border border-[rgba(215,161,175,0.18)] bg-white/70 px-5 py-5 sm:px-6"
          >
            <p
              className="text-[0.68rem] font-semibold uppercase tracking-[0.28em]"
              style={{ color: 'var(--color-accent-dark)', opacity: 0.65 }}
            >
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
                { href: '/learn/art-of-the-registry',   label: 'The Art of the Registry' },
                { href: '/learn/nursery-foundations',    label: 'Nursery Foundations' },
                { href: '/learn/stroller-foundations',   label: 'The Stroller Equation' },
              ].map((lesson) => (
                <Link
                  key={lesson.href}
                  href={lesson.href}
                  className="rounded-full border border-[rgba(215,161,175,0.3)] px-4 py-2 text-[0.83rem] font-medium transition-opacity hover:opacity-75"
                  style={{
                    background: 'var(--tmbc-soft-pink)',
                    color:      'var(--color-accent-dark)',
                  }}
                >
                  {lesson.label}
                </Link>
              ))}
            </div>
          </section>

          {/* ── Workbook notes ───────────────────────────────────────────────── */}
          {workbookNotes.length > 0 && (
            <WorkbookPanel notes={workbookNotes} pathTitles={notePathTitles} />
          )}

          {/* ── PDF library ─────────────────────────────────────────────────── */}
          <PDFLibrary hasFullAccess={fullAccess} />

          {/* ── Password change ──────────────────────────────────────────────── */}
          <ChangePasswordForm />

          {/* ── Footer ──────────────────────────────────────────────────────── */}
          <footer
            className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-8"
            style={{ borderColor: 'rgba(215,161,175,0.2)' }}
          >
            <p className="text-[0.8rem] text-neutral-400">Taylor-Made Baby Academy</p>
            <nav className="flex gap-5" aria-label="Dashboard footer">
              <Link
                href="/learn"
                className="text-[0.83rem] underline underline-offset-2 hover:opacity-75"
                style={{ color: 'var(--color-accent-dark)' }}
              >
                Academy home
              </Link>
              <Link
                href="/consultation"
                className="text-[0.83rem] underline underline-offset-2 hover:opacity-75"
                style={{ color: 'var(--color-accent-dark)' }}
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
