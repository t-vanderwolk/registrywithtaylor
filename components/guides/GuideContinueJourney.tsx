'use client';

import { useEffect, useState } from 'react';
import GuideCTARibbon from '@/components/guides/GuideCTARibbon';
import {
  TMBC_BUY_STEP,
  TMBC_GUIDE_JOURNEY_STORAGE_KEY,
  TMBC_MASTER_GUIDE_FLOW,
  type TmbcGuideJourneyState,
} from '@/lib/guides/masterJourney';

export default function GuideContinueJourney() {
  const [journeyState, setJourneyState] = useState<TmbcGuideJourneyState | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(TMBC_GUIDE_JOURNEY_STORAGE_KEY);
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as TmbcGuideJourneyState;
      if (!parsed?.slug || !parsed?.sourceRoute) {
        return;
      }

      setJourneyState(parsed);
    } catch {
      return;
    }
  }, []);

  if (!journeyState) {
    return null;
  }

  const nextLane =
    journeyState.nextLaneSlug === 'buy'
      ? TMBC_BUY_STEP
      : TMBC_MASTER_GUIDE_FLOW.find((item) => item.slug === journeyState.nextLaneSlug) ?? null;

  return (
    <GuideCTARibbon
      eyebrow="Continue Journey"
      title={nextLane ? `You left off at ${journeyState.title}.` : 'Pick up where you left off.'}
      description={
        nextLane
          ? `The next TMBC move is usually ${nextLane.title}. Keep the sequence clean while the last decision is still fresh.`
          : 'Open the last guide you visited and keep moving while the decision logic is still fresh.'
      }
      primaryCta={{
        href: nextLane?.href ?? journeyState.sourceRoute,
        label: nextLane ? `Continue to ${nextLane.title}` : 'Resume guide',
      }}
      secondaryCta={{
        href: journeyState.sourceRoute,
        label: 'Reopen last guide',
      }}
    />
  );
}
