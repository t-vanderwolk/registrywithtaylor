'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { trackEvent } from '@/lib/analytics';
import { AnalyticsEvents } from '@/lib/analytics/events';
import Link from 'next/link';
import RegistrySection from './RegistrySection';
import AcademyProgressCard from './AcademyProgressCard';
import styles from './MemberDashboard.module.scss';

// Lazy-load heavy panels
const WorkbookPanel = dynamic(() => import('../../components/WorkbookPanel'), { ssr: false });
const ProfileSettingsPanel = dynamic(() => import('../../components/ProfileSettingsPanel'), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────

export type RegistryRecord = {
  id:             string;
  platform:       string;
  name:           string | null;
  url:            string;
  itemCount:      number | null;
  completedCount: number | null;
  notes:          string | null;
  createdAt:      string;
  updatedAt:      string;
};

export type RecentModule = {
  pathSlug:    string;
  moduleSlug:  string;
  pathTitle:   string;
  moduleTitle: string;
};

export type WorkbookNote = {
  pathSlug:    string;
  moduleSlug:  string;
  moduleTitle: string;
  content:     string;
  updatedAt:   string;
};

export type Props = {
  firstName:        string;
  partnerName:      string | null;
  tier:             string | null;
  dueDateIso:       string | null;
  registries:       RegistryRecord[];
  progressByPath:   Record<string, number>;
  pathTotals:       Record<string, number>;
  totalModules:     number;
  completedModules: number;
  recentModules:    RecentModule[];
  workbookNotes:    WorkbookNote[];
  notePathTitles:   Record<string, string>;
  consultationCount: number;
};

const TIER_LABELS: Record<string, string> = {
  free:         'Free Preview',
  academy:      'Academy',
  academy_plus: 'Academy+',
  concierge:    'Concierge',
};

function hasFullAccess(tier: string | null | undefined) {
  return tier === 'academy' || tier === 'academy_plus' || tier === 'concierge';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MemberDashboardClient({
  firstName,
  partnerName,
  tier,
  dueDateIso,
  registries: initialRegistries,
  progressByPath,
  pathTotals,
  totalModules,
  completedModules,
  recentModules,
  workbookNotes,
  notePathTitles,
  consultationCount,
}: Props) {
  const [panelOpen,      setPanelOpen]      = useState(false);
  const [localDueDate,   setLocalDueDate]   = useState(dueDateIso);
  const [localName,      setLocalName]      = useState(firstName);
  const [localPartner,   setLocalPartner]   = useState(partnerName);
  const [registries,     setRegistries]     = useState<RegistryRecord[]>(initialRegistries);

  useEffect(() => {
    trackEvent(AnalyticsEvents.DASHBOARD_VIEWED, {
      tier:              tier ?? 'unknown',
      registry_count:    initialRegistries.length,
      modules_completed: completedModules,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const greeting    = localPartner ? `${localName} & ${localPartner}` : localName;
  const tierLabel   = tier ? (TIER_LABELS[tier] ?? tier) : null;
  const fullAccess  = hasFullAccess(tier);

  function handleSaved(updates: {
    name?:        string;
    partnerName?: string;
    dueDate?:     string | null;
  }) {
    if (updates.name !== undefined)       setLocalName(updates.name || firstName);
    if (updates.partnerName !== undefined) setLocalPartner(updates.partnerName || null);
    if (updates.dueDate !== undefined)    setLocalDueDate(updates.dueDate);
  }

  return (
    <div className={styles.page}>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Welcome back</p>

        <div className={styles.greetingRow}>
          <h1 className={styles.greeting}>{greeting}</h1>
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => setPanelOpen(true)}
            aria-label="Edit profile"
          >
            Edit profile
          </button>
        </div>

        <div className={styles.heroMeta}>
          {tierLabel && <span className={styles.tierBadge}>{tierLabel}</span>}

          {localDueDate ? (
            <DueDateChip dueDate={localDueDate} onEdit={() => setPanelOpen(true)} />
          ) : (
            <button
              type="button"
              className={styles.dueDateCta}
              onClick={() => setPanelOpen(true)}
            >
              + Add due date
            </button>
          )}
        </div>

        {tier === 'free' && (
          <div className={styles.upgradeBanner}>
            <p>You&apos;re on the free preview. Upgrade to unlock all four Academy paths.</p>
            <a href="/learn/pricing" className={styles.upgradeLink}>View plans →</a>
          </div>
        )}
      </header>

      {/* ── Stats strip ────────────────────────────────────────────────────── */}
      <div className={styles.statsStrip} aria-label="Your progress at a glance">
        <StatCard value={registries.length}  label="Registries saved"   />
        <StatCard value={completedModules}   label={`of ${totalModules} modules done`} />
        <StatCard value={consultationCount}  label="Consultations"      />
      </div>

      {/* ── Registry section (primary feature) ─────────────────────────────── */}
      <section aria-label="Your baby registries" className={styles.section}>
        <RegistrySection
          registries={registries}
          onRegistriesChange={setRegistries}
        />
      </section>

      {/* ── Academy progress ───────────────────────────────────────────────── */}
      <section aria-label="Academy progress" className={styles.section}>
        <AcademyProgressCard
          progressByPath={progressByPath}
          pathTotals={pathTotals}
          recentModules={recentModules}
          fullAccess={fullAccess}
        />
      </section>

      {/* ── Workbook notes ───────────────────────────────────────────────────── */}
      {workbookNotes.length > 0 && (
        <section aria-label="Workbook notes" className={styles.section}>
          <WorkbookPanel notes={workbookNotes} pathTitles={notePathTitles} />
        </section>
      )}

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>Taylor-Made Baby Academy</p>
        <nav className={styles.footerNav} aria-label="Dashboard footer">
          <Link href="/learn" className={styles.footerLink}>Academy home</Link>
          <Link href="/consultation" className={styles.footerLink}>Book a consultation</Link>
        </nav>
      </footer>

      {/* Profile panel */}
      {panelOpen && (
        <ProfileSettingsPanel
          onClose={() => setPanelOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function DueDateChip({ dueDate, onEdit }: { dueDate: string; onEdit: () => void }) {
  const date = new Date(dueDate);
  const now  = new Date();
  const diffMs   = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / 86_400_000);

  const formatted = date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const countdown =
    diffDays > 0
      ? `${diffDays} day${diffDays !== 1 ? 's' : ''} to go`
      : diffDays === 0
      ? 'Due today'
      : 'Baby has arrived! 🎉';

  return (
    <button
      type="button"
      className={styles.dueDateChip}
      onClick={onEdit}
      aria-label={`Due date: ${formatted}. Click to edit.`}
    >
      🗓 {formatted} · {countdown}
    </button>
  );
}
