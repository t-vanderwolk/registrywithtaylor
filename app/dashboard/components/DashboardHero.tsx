'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import DueDateCountdown from './DueDateCountdown';
import styles from './DashboardHero.module.scss';

// Lazy-load so the panel JS isn't in the initial page bundle
const ProfileSettingsPanel = dynamic(() => import('./ProfileSettingsPanel'), { ssr: false });

type Props = {
  firstName:   string;
  partnerName: string | null;
  tierLabel:   string | null;
  tier:        string | null;
  dueDateIso:  string | null;
};

export default function DashboardHero({
  firstName,
  partnerName,
  tierLabel,
  tier,
  dueDateIso,
}: Props) {
  const [panelOpen,    setPanelOpen]    = useState(false);
  const [panelTab,     setPanelTab]     = useState<'pregnancy' | undefined>(undefined);
  const [localDueDate, setLocalDueDate] = useState(dueDateIso);
  const [localName,    setLocalName]    = useState(firstName);
  const [localPartner, setLocalPartner] = useState(partnerName);

  const greeting = localPartner
    ? `${localName} & ${localPartner}`
    : localName;

  function openPanel(tab?: 'pregnancy') {
    setPanelTab(tab);
    setPanelOpen(true);
  }

  function handleSaved(updates: {
    name?: string;
    partnerName?: string;
    dueDate?: string | null;
  }) {
    if (updates.name !== undefined)        setLocalName(updates.name || firstName);
    if (updates.partnerName !== undefined)  setLocalPartner(updates.partnerName || null);
    if (updates.dueDate !== undefined)      setLocalDueDate(updates.dueDate);
  }

  return (
    <>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Welcome back</p>

        <div className={styles.greetingRow}>
          <h1 className={styles.greeting}>{greeting}</h1>
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => openPanel()}
            aria-label="Edit profile"
          >
            Edit profile
          </button>
        </div>

        <div className={styles.meta}>
          {tierLabel && (
            <span className={styles.tierBadge}>{tierLabel}</span>
          )}
        </div>

        {tier === 'free' && (
          <div className={styles.upgradeBanner}>
            <p>You&apos;re on the free preview. Upgrade to unlock all four Academy paths.</p>
            <a href="/learn/pricing">View plans →</a>
          </div>
        )}

        <DueDateCountdown
          dueDateIso={localDueDate}
          onAddDueDate={() => openPanel('pregnancy')}
        />
      </header>

      {panelOpen && (
        <ProfileSettingsPanel
          initialTab={panelTab}
          onClose={() => { setPanelOpen(false); setPanelTab(undefined); }}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
