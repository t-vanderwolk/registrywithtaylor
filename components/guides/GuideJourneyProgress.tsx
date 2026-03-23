'use client';

import GuideProgressBar, { type GuideProgressBarItem } from '@/components/guides/GuideProgressBar';

export default function GuideJourneyProgress({
  items,
  pathLabels,
  containerId,
  className = '',
}: {
  items: GuideProgressBarItem[];
  pathLabels?: string[];
  containerId?: string;
  className?: string;
}) {
  return <GuideProgressBar items={items} pathLabels={pathLabels} containerId={containerId} className={className} />;
}
