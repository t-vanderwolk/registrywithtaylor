import type { ReactNode } from 'react';
import EcosystemStrip from '@/components/guides/EcosystemStrip';
import GuideStickyNav from '@/components/guides/GuideStickyNav';
import type { ProgressIndicatorItem } from '@/components/guides/ProgressIndicator';

type GuideSlideDeckLink = {
  href: string;
  label: string;
};

export default function GuideSlideDeck({
  containerId,
  items,
  backLink,
  ecosystemCurrentStep,
  children,
}: {
  containerId: string;
  items: ProgressIndicatorItem[];
  backLink?: GuideSlideDeckLink | null;
  ecosystemCurrentStep?: number | null;
  children: ReactNode;
}) {
  return (
    <div className="relative space-y-4 md:flex md:h-full md:min-h-0 md:flex-col md:space-y-0">
      <div
        className="fixed inset-x-0 z-40 px-3 sm:px-5 xl:px-0"
        style={{ top: 'var(--guide-sticky-top, calc(4rem + 10px))' }}
      >
        <div className="mx-auto w-full max-w-[1680px]">
          <GuideStickyNav items={items} containerId={containerId} backLink={backLink} />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="shrink-0"
        style={{ height: 'calc(var(--guide-sticky-nav-height, 76px) + 0.75rem)' }}
      />

      {typeof ecosystemCurrentStep === 'number' ? (
        <div className="pb-4">
          <EcosystemStrip currentStep={ecosystemCurrentStep} />
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[1680px] md:flex-1 md:min-h-0">
        <div
          id={containerId}
          className="snap-none scroll-smooth md:h-full md:min-h-0 md:snap-y md:snap-mandatory md:overflow-y-auto"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
