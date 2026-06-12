'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './WorkbookPanel.module.scss';

type Note = {
  pathSlug:    string;
  moduleSlug:  string;
  moduleTitle: string;
  content:     string;
  updatedAt:   string;
};

type Props = {
  notes:      Note[];
  pathTitles: Record<string, string>;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });
}

export default function WorkbookPanel({ notes, pathTitles }: Props) {
  const paths       = Object.keys(pathTitles);
  const [active, setActive] = useState<string>(paths[0] ?? '');

  const filtered = notes.filter((n) => n.pathSlug === active);

  return (
    <div className={styles.panel}>
      <p className={styles.eyebrow}>Your notes</p>
      <h2 className={styles.heading}>Workbook</h2>
      <p className={styles.subtext}>
        Notes you&apos;ve saved while working through the Academy paths.
      </p>

      {/* Path filter tabs */}
      {paths.length > 1 && (
        <div className={styles.pathTabs}>
          {paths.map((slug) => (
            <button
              key={slug}
              className={`${styles.tab} ${active === slug ? styles.active : ''}`}
              onClick={() => setActive(slug)}
            >
              {pathTitles[slug]}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className={styles.empty}>
          No notes saved for this path yet. Start a module and use the workbook to save your thoughts.
        </p>
      ) : (
        <ul className={styles.noteList}>
          {filtered.map((note) => (
            <li key={`${note.pathSlug}-${note.moduleSlug}`} className={styles.noteItem}>
              <div className={styles.noteMeta}>
                <span className={styles.noteModule}>{note.moduleTitle}</span>
                <span className={styles.noteDate}>{formatDate(note.updatedAt)}</span>
              </div>
              <p className={styles.noteContent}>{note.content}</p>
              <Link
                href={`/learn/${note.pathSlug}/${note.moduleSlug}`}
                className={styles.editLink}
              >
                Go to module →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
