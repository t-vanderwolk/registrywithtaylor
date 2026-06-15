import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import Link from 'next/link';
import { authOptions } from '@/lib/server/authOptions';
import prisma from '@/lib/server/prisma';
import {
  getAcademyPathSlugs,
  getAcademyModuleParams,
  getAcademyPathTitle,
  getAcademyModuleTitle,
  isAcademyPathSlug,
  isAcademyModuleSlug,
  type AcademyModuleSlug,
} from '@/lib/academy/content';
import styles from './AcademyPage.module.scss';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Academy | Taylor-Made Baby Co.',
  robots: { index: false, follow: false },
};

const PATH_META: Record<string, { icon: string; description: string }> = {
  registry:   { icon: '🎁', description: 'Build a registry that actually covers what you need — nothing more, nothing less.' },
  nursery:    { icon: '🛏', description: 'Set up a safe, functional space before baby arrives.' },
  gear:       { icon: '🛒', description: 'Cut through the noise on strollers, car seats, carriers, and more.' },
  postpartum: { icon: '🤱', description: 'Prepare your home and support system for life with a newborn.' },
};

export default async function AcademyDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/dashboard/academy');
  if (session.user.role === 'ADMIN') redirect('/admin');
  if (session.user.role === 'REVIEWER') redirect('/dashboard/reviewer');

  const email = session.user.email ?? '';

  const [learner, progressRows] = await Promise.all([
    prisma.learner.findUnique({
      where:  { email },
      select: { subscriptionTier: true },
    }).catch(() => null),
    prisma.lessonProgress.findMany({
      where:  { learner: { email } },
      select: { pathSlug: true, moduleSlug: true },
    }).catch(() => []),
  ]);

  const tier         = learner?.subscriptionTier ?? null;
  const hasAccess    = tier === 'academy' || tier === 'academy_plus' || tier === 'concierge';
  const completedSet = new Set(progressRows.map((r) => `${r.pathSlug}/${r.moduleSlug}`));

  const pathSlugs    = getAcademyPathSlugs();
  const allParams    = getAcademyModuleParams();

  // Group modules by path (preserving order)
  const modulesByPath: Record<string, string[]> = {};
  for (const { academyPath, module: moduleSlug } of allParams) {
    if (!modulesByPath[academyPath]) modulesByPath[academyPath] = [];
    modulesByPath[academyPath].push(moduleSlug);
  }

  const totalModules    = allParams.length;
  const doneModules     = hasAccess ? progressRows.length : 0;
  const overallPct      = totalModules > 0 ? Math.round((doneModules / totalModules) * 100) : 0;

  return (
    <div className={styles.page}>

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <p className={styles.eyebrow}>Taylor-Made Baby Academy</p>
        <h1 className={styles.heading}>Your courses</h1>
        {hasAccess && (
          <div className={styles.overallProgress}>
            <div className={styles.overallTrack}>
              <div className={styles.overallFill} style={{ width: `${overallPct}%` }} />
            </div>
            <span className={styles.overallLabel}>
              {doneModules} of {totalModules} modules visited · {overallPct}%
            </span>
          </div>
        )}
        {!hasAccess && (
          <div className={styles.upgradeBanner}>
            <p>You&apos;re on the free preview — module content is locked.</p>
            <a href="/learn/pricing" className={styles.upgradeLink}>Unlock full access →</a>
          </div>
        )}
      </header>

      {/* ── Path grid ────────────────────────────────────────────────────────── */}
      <div className={styles.pathGrid}>
        {pathSlugs.map((rawSlug) => {
          if (!isAcademyPathSlug(rawSlug)) return null;
          const pathSlug   = rawSlug;
          const modules    = modulesByPath[pathSlug] ?? [];
          const meta       = PATH_META[pathSlug] ?? { icon: '📚', description: '' };
          const pathTitle  = getAcademyPathTitle(pathSlug);
          const donePath   = modules.filter((m) => completedSet.has(`${pathSlug}/${m}`)).length;
          const pct        = modules.length > 0 ? Math.round((donePath / modules.length) * 100) : 0;
          const locked     = !hasAccess;

          return (
            <section key={pathSlug} className={styles.pathCard}>
              {/* Path header */}
              <div className={styles.pathHeader}>
                <span className={styles.pathIcon} aria-hidden>{meta.icon}</span>
                <div className={styles.pathMeta}>
                  <h2 className={styles.pathTitle}>{pathTitle}</h2>
                  <p className={styles.pathDesc}>{meta.description}</p>
                </div>
                {!locked && (
                  <span className={styles.pathBadge}>{donePath}/{modules.length}</span>
                )}
                {locked && (
                  <span className={styles.lockedBadge}>🔒 Locked</span>
                )}
              </div>

              {/* Progress bar */}
              {!locked && modules.length > 0 && (
                <div className={styles.pathTrack}>
                  <div className={styles.pathFill} style={{ width: `${pct}%` }} />
                </div>
              )}

              {/* Module list */}
              <ul className={styles.moduleList}>
                {modules.map((moduleSlug) => {
                  if (!isAcademyModuleSlug(moduleSlug)) return null;
                  const done        = completedSet.has(`${pathSlug}/${moduleSlug}`);
                  const moduleTitle = getAcademyModuleTitle(moduleSlug as AcademyModuleSlug);
                  const href        = `/academy/${pathSlug}/${moduleSlug}`;

                  return (
                    <li key={moduleSlug} className={styles.moduleItem}>
                      {locked ? (
                        <span className={styles.moduleLocked}>
                          <span className={styles.moduleDot} aria-hidden>○</span>
                          <span className={styles.moduleTitle}>{moduleTitle}</span>
                        </span>
                      ) : (
                        <Link href={href} className={`${styles.moduleLink} ${done ? styles.moduleDone : ''}`}>
                          <span className={styles.moduleDot} aria-hidden>
                            {done ? '✓' : '○'}
                          </span>
                          <span className={styles.moduleTitle}>{moduleTitle}</span>
                          <span className={styles.moduleArrow} aria-hidden>→</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Path CTA */}
              {!locked && (
                <div className={styles.pathCta}>
                  {pct === 0 && (
                    <Link href={`/academy/${pathSlug}/${modules[0] ?? ''}`} className={styles.startBtn}>
                      Start this path →
                    </Link>
                  )}
                  {pct > 0 && pct < 100 && (
                    <Link
                      href={`/academy/${pathSlug}/${modules.find((m) => !completedSet.has(`${pathSlug}/${m}`)) ?? modules[0] ?? ''}`}
                      className={styles.startBtn}
                    >
                      Continue →
                    </Link>
                  )}
                  {pct === 100 && (
                    <span className={styles.completeChip}>✓ Path complete</span>
                  )}
                </div>
              )}
              {locked && (
                <div className={styles.pathCta}>
                  <a href="/learn/pricing" className={styles.unlockBtn}>Unlock access →</a>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
