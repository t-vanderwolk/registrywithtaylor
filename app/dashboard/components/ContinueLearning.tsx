import Link from 'next/link';
import styles from './ContinueLearning.module.scss';

type RecentModule = {
  pathSlug:   string;
  moduleSlug: string;
  pathTitle:  string;
  moduleTitle: string;
};

export default function ContinueLearning({ recent }: { recent: RecentModule[] }) {
  return (
    <div className={styles.panel}>
      <p className={styles.eyebrow}>Pick up where you left off</p>
      <h2 className={styles.heading}>Continue learning</h2>

      {recent.length === 0 ? (
        <p className={styles.empty}>
          You haven&apos;t started any modules yet. Enter a path above to begin.
        </p>
      ) : (
        <ul className={styles.list}>
          {recent.map((item) => (
            <li key={`${item.pathSlug}-${item.moduleSlug}`} className={styles.item}>
              <div className={styles.itemInfo}>
                <p className={styles.itemPath}>{item.pathTitle}</p>
                <p className={styles.itemModule}>{item.moduleTitle}</p>
              </div>
              <Link
                href={`/learn/${item.pathSlug}/${item.moduleSlug}`}
                className={styles.resumeBtn}
              >
                Resume →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
