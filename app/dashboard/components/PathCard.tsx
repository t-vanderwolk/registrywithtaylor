import Image from 'next/image';
import Link from 'next/link';
import type { AcademyHomePathCard } from '@/lib/academy/content';
import styles from './PathCard.module.scss';

type Props = {
  path: AcademyHomePathCard;
  locked: boolean;
  visited: number;
  total: number;
};

export default function PathCard({ path, locked, visited, total }: Props) {
  const pct         = total > 0 ? Math.min(100, Math.round((visited / total) * 100)) : 0;
  const hasProgress = visited > 0;
  const href        = locked ? '/learn/pricing' : `/learn/${path.slug}`;

  return (
    <article className={`${styles.card} ${locked ? styles.locked : ''}`}>
      <div className={styles.imageWrap}>
        <Image
          src={path.imagePath}
          alt={path.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className={styles.image}
        />
        {locked && (
          <div className={styles.lockOverlay}>
            <span>Upgrade to unlock</span>
          </div>
        )}
      </div>

      <div className={styles.body}>
        <p className={styles.eyebrow}>{path.eyebrow}</p>
        <h2 className={styles.title}>{path.title}</h2>
        <p className={styles.description}>{path.description}</p>

        {!locked && hasProgress && (
          <div className={styles.progressWrap}>
            <div className={styles.progressLabels}>
              <span className={styles.progressCount}>
                {visited} of {total} modules visited
              </span>
              <span className={styles.progressPct}>{pct}%</span>
            </div>
            <div className={styles.track}>
              <div className={styles.fill} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <div className={styles.cta}>
          <Link
            href={href}
            className={locked ? styles.ghost : undefined}
          >
            {locked ? 'Upgrade to access' : hasProgress ? 'Continue →' : 'Enter path →'}
          </Link>
        </div>
      </div>
    </article>
  );
}
