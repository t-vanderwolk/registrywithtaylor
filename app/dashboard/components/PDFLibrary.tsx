import styles from './PDFLibrary.module.scss';

type PDFResource = {
  label:    string;
  sublabel: string;
  href:     string;
  emoji:    string;
};

const FREE_RESOURCES: PDFResource[] = [
  {
    label:    'Registry Checklist',
    sublabel: 'Printable · PDF',
    href:     '/printables/registry-checklist',
    emoji:    '📋',
  },
  {
    label:    'Nursery Planning Guide',
    sublabel: 'Printable · PDF',
    href:     '/printables/nursery-planning-guide',
    emoji:    '🏠',
  },
];

export default function PDFLibrary({ hasFullAccess }: { hasFullAccess: boolean }) {
  return (
    <div className={styles.panel}>
      <p className={styles.eyebrow}>Downloads</p>
      <h2 className={styles.heading}>PDF library</h2>
      <p className={styles.subtext}>
        {hasFullAccess
          ? 'Printable guides and checklists to complement your Academy paths.'
          : 'Free printable resources available to all members.'}
      </p>

      {FREE_RESOURCES.length === 0 ? (
        <p className={styles.comingSoon}>Printable resources coming soon.</p>
      ) : (
        <div className={styles.grid}>
          {FREE_RESOURCES.map((r) => (
            <a key={r.href} href={r.href} className={styles.item} target="_blank" rel="noreferrer">
              <span className={styles.icon} aria-hidden="true">
                {r.emoji}
              </span>
              <span>
                <span className={styles.label}>{r.label}</span>
                <span className={styles.sublabel}>{r.sublabel}</span>
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
