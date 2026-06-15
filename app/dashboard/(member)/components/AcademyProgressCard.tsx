'use client';

import Link from 'next/link';
import type { RecentModule } from './MemberDashboardClient';
import styles from './AcademyProgressCard.module.scss';

const PATH_META: Record<string, { label: string; icon: string; slug: string }> = {
  registry:   { label: 'Registry Strategy',  icon: '🎁', slug: 'registry'   },
  nursery:    { label: 'Nursery Planning',    icon: '🛏', slug: 'nursery'    },
  gear:       { label: 'Baby Gear',           icon: '🛒', slug: 'gear'       },
  postpartum: { label: 'Postpartum Prep',     icon: '🤱', slug: 'postpartum' },
};

type Props = {
  progressByPath:  Record<string, number>;
  pathTotals:      Record<string, number>;
  recentModules:   RecentModule[];
  fullAccess:      boolean;
};

export default function AcademyProgressCard({
  progressByPath,
  pathTotals,
  recentModules,
  fullAccess,
}: Props) {
  const paths  = Object.keys(PATH_META);
  const total  = Object.values(pathTotals).reduce((a, b) => a + b, 0);
  const done   = Object.values(progressByPath).reduce((a, b) => a + b, 0);
  const overallPct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Progress</p>
          <h2 className={styles.heading}>Your Academy</h2>
        </div>
        <Link href="/dashboard/academy" className={styles.academyLink}>
          All modules →
        </Link>
      </div>

      {/* Overall */}
      {fullAccess && (
        <div className={styles.overall}>
          <div className={styles.overallTrack} role="progressbar" aria-valuenow={overallPct} aria-valuemin={0} aria-valuemax={100}>
            <div className={styles.overallFill} style={{ width: `${overallPct}%` }} />
          </div>
          <span className={styles.overallLabel}>
            {done} of {total} modules complete ({overallPct}%)
          </span>
        </div>
      )}

      {/* Per-path grid */}
      <div className={styles.pathGrid}>
        {paths.map((slug) => {
          const meta    = PATH_META[slug]!;
          const visited = progressByPath[slug] ?? 0;
          const total   = pathTotals[slug] ?? 1;
          const pct     = Math.round((visited / total) * 100);
          const locked  = !fullAccess;

          return (
            <div key={slug} className={`${styles.pathItem} ${locked ? styles.pathLocked : ''}`}>
              <div className={styles.pathTop}>
                <span className={styles.pathIcon} aria-hidden>{meta.icon}</span>
                <span className={styles.pathLabel}>{meta.label}</span>
                {!locked && (
                  <span className={styles.pathCount}>
                    {visited}/{total}
                  </span>
                )}
                {locked && (
                  <span className={styles.lockIcon} aria-label="Locked">🔒</span>
                )}
              </div>
              {!locked && (
                <div className={styles.pathTrack} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                  <div className={styles.pathFill} style={{ width: `${pct}%` }} />
                </div>
              )}
              {!locked && (
                <Link href={`/learn/${slug}`} className={styles.pathLink}>
                  {visited === 0 ? 'Start →' : pct === 100 ? 'Review →' : 'Continue →'}
                </Link>
              )}
              {locked && (
                <a href="/learn/pricing" className={styles.unlockLink}>
                  Unlock →
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Continue learning */}
      {fullAccess && recentModules.length > 0 && (
        <div className={styles.recent}>
          <p className={styles.recentLabel}>Pick up where you left off</p>
          <div className={styles.recentList}>
            {recentModules.slice(0, 3).map((m) => (
              <Link
                key={`${m.pathSlug}-${m.moduleSlug}`}
                href={`/learn/${m.pathSlug}/${m.moduleSlug}`}
                className={styles.recentItem}
              >
                <span className={styles.recentPath}>{m.pathTitle}</span>
                <span className={styles.recentModule}>{m.moduleTitle}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
