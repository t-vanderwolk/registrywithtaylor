'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './AcademyPage.module.scss';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModuleTile = {
  slug:        string;
  href:        string;
  title:       string;
  description: string;
  done:        boolean;
  locked:      boolean;
};

export type PathPanel = {
  slug:             string;
  title:            string;
  shortDescription: string;
  icon:             string;
  done:             number;
  total:            number;
  pct:              number;
  locked:           boolean;
  nextHref:         string | null;
  modules:          ModuleTile[];
};

export type NextUp = {
  pathSlug:    string;
  pathTitle:   string;
  pathIcon:    string;
  moduleTitle: string;
  href:        string;
} | null;

export type AcademyClientProps = {
  hasAccess:    boolean;
  tier:         string | null;
  totalModules: number;
  doneModules:  number;
  overallPct:   number;
  paths:        PathPanel[];
  nextUp:       NextUp;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AcademyClient({
  hasAccess,
  totalModules,
  doneModules,
  overallPct,
  paths,
  nextUp,
}: AcademyClientProps) {
  const [activeTab, setActiveTab] = useState(0);
  const activePath = paths[activeTab] ?? paths[0];

  return (
    <div className={styles.page}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <p className={styles.eyebrow}>Taylor-Made Baby Academy</p>
        <h1 className={styles.heading}>Your courses</h1>

        {hasAccess && totalModules > 0 && (
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

      {/* ── Next up hero card ──────────────────────────────────────────────── */}
      {hasAccess && nextUp ? (
        <div className={styles.nextUpCard}>
          <div className={styles.nextUpLeft}>
            <p className={styles.nextUpEyebrow}>
              <span className={styles.nextUpIcon} aria-hidden>{nextUp.pathIcon}</span>
              {nextUp.pathTitle} Path
            </p>
            <p className={styles.nextUpTitle}>{nextUp.moduleTitle}</p>
          </div>
          <Link href={nextUp.href} className={styles.nextUpBtn}>
            {doneModules === 0 ? 'Start here' : 'Continue'} →
          </Link>
        </div>
      ) : !hasAccess ? (
        <div className={styles.nextUpCard}>
          <div className={styles.nextUpLeft}>
            <p className={styles.nextUpEyebrow}>Ready to start?</p>
            <p className={styles.nextUpTitle}>
              {paths[0]?.modules[0]?.title ?? 'What to Register First'}
            </p>
          </div>
          <a href="/learn/pricing" className={styles.nextUpBtnLocked}>Unlock access →</a>
        </div>
      ) : null}

      {/* ── Tab bar ────────────────────────────────────────────────────────── */}
      <div className={styles.tabBar} role="tablist" aria-label="Academy paths">
        {paths.map((p, i) => (
          <button
            key={p.slug}
            role="tab"
            aria-selected={i === activeTab}
            aria-controls={`tabpanel-${p.slug}`}
            className={`${styles.tabBtn} ${i === activeTab ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab(i)}
            type="button"
          >
            <span className={styles.tabIcon} aria-hidden>{p.icon}</span>
            <span className={styles.tabLabel}>{p.title}</span>
            {hasAccess && p.pct > 0 && (
              <span className={styles.tabPct}>{p.pct}%</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Active path panel ──────────────────────────────────────────────── */}
      {activePath && (
        <div
          id={`tabpanel-${activePath.slug}`}
          role="tabpanel"
          className={styles.pathPanel}
          key={activePath.slug}
        >
          {/* Ring + summary */}
          <div className={styles.pathSummaryRow}>
            <ProgressRing
              pct={hasAccess ? activePath.pct : 0}
              done={hasAccess ? activePath.done : 0}
              total={activePath.total}
              locked={activePath.locked}
            />
            <div className={styles.pathSummaryMeta}>
              <h2 className={styles.pathSummaryTitle}>{activePath.title}</h2>
              <p className={styles.pathSummaryDesc}>{activePath.shortDescription}</p>
              {!activePath.locked && activePath.pct < 100 && activePath.nextHref && (
                <Link href={activePath.nextHref} className={styles.startBtn}>
                  {activePath.pct === 0 ? 'Start this path' : 'Continue'} →
                </Link>
              )}
              {!activePath.locked && activePath.pct === 100 && (
                <span className={styles.completeChip}>✓ Path complete</span>
              )}
              {activePath.locked && (
                <a href="/learn/pricing" className={styles.unlockBtn}>Unlock access →</a>
              )}
            </div>
          </div>

          {/* Module tile grid */}
          <div className={styles.tileGrid}>
            {activePath.modules.map((mod) => (
              <TileItem key={mod.slug} tile={mod} pathLocked={activePath.locked} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Progress ring ─────────────────────────────────────────────────────────────

function ProgressRing({
  pct,
  done,
  total,
  locked,
}: {
  pct:    number;
  done:   number;
  total:  number;
  locked: boolean;
}) {
  const size         = 96;
  const stroke       = 7;
  const r            = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset       = circumference - (pct / 100) * circumference;

  return (
    <div
      className={styles.ringWrap}
      aria-label={locked ? 'Locked' : `${pct}% complete`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
        style={{ display: 'block' }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(215,161,175,0.18)"
          strokeWidth={stroke}
        />
        {/* Fill */}
        {!locked && pct > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 600ms ease' }}
          />
        )}
      </svg>
      <div className={styles.ringLabel}>
        {locked ? (
          <span className={styles.ringLock}>🔒</span>
        ) : (
          <>
            <span className={styles.ringPct}>
              {pct}<span className={styles.ringPctSymbol}>%</span>
            </span>
            <span className={styles.ringDone}>{done}/{total}</span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Module tile ──────────────────────────────────────────────────────────────

function TileItem({ tile, pathLocked }: { tile: ModuleTile; pathLocked: boolean }) {
  const cls = [
    styles.tile,
    tile.done  ? styles.tileDone   : '',
    pathLocked ? styles.tileLocked : '',
  ].filter(Boolean).join(' ');

  if (pathLocked) {
    return (
      <div className={cls}>
        <span className={styles.tileStatus} aria-hidden>○</span>
        <div className={styles.tileMeta}>
          <p className={styles.tileTitle}>{tile.title}</p>
          <p className={styles.tileDesc}>{tile.description}</p>
        </div>
      </div>
    );
  }

  return (
    <Link href={tile.href} className={cls}>
      <span className={styles.tileStatus} aria-hidden>
        {tile.done ? '✓' : '○'}
      </span>
      <div className={styles.tileMeta}>
        <p className={styles.tileTitle}>{tile.title}</p>
        <p className={styles.tileDesc}>{tile.description}</p>
      </div>
      <span className={styles.tileArrow} aria-hidden>→</span>
    </Link>
  );
}
