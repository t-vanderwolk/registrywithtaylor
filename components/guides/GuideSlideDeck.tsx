import type { ReactNode } from 'react';
import GuideCarouselLayout from '@/components/guides/GuideCarouselLayout';
import type { GuideProgressBarItem } from '@/components/guides/GuideProgressBar';

type GuideSlideDeckLink = {
  href: string;
  label: string;
};

export default function GuideSlideDeck({
  containerId,
  items,
  backLink,
  ecosystemCurrentStep,
  journeyPathLabels,
  children,
}: {
  containerId: string;
  items: GuideProgressBarItem[];
  backLink?: GuideSlideDeckLink | null;
  ecosystemCurrentStep?: number | null;
  journeyPathLabels?: string[];
  children: ReactNode;
}) {
  return (
    <GuideCarouselLayout
      containerId={containerId}
      items={items}
      backLink={backLink}
      ecosystemCurrentStep={ecosystemCurrentStep}
      journeyPathLabels={journeyPathLabels}
    >
      {children}
    </GuideCarouselLayout>
  );
}
