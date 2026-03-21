import type { ReactNode } from 'react';
import GuideStickyNav from '@/components/guides/GuideStickyNav';
import ProgressIndicator, { type ProgressIndicatorItem } from '@/components/guides/ProgressIndicator';

type GuideSlideDeckLink = {
  href: string;
  label: string;
};

export default function GuideSlideDeck({
  containerId,
  items,
  backLink,
  children,
}: {
  containerId: string;
  items: ProgressIndicatorItem[];
  backLink?: GuideSlideDeckLink | null;
  children: ReactNode;
}) {
  return (
    <div className="relative space-y-4 md:flex md:h-full md:min-h-0 md:flex-col md:space-y-0">
      <div className="mx-auto w-full max-w-[1680px] px-4 pt-4 sm:px-5 xl:px-0">
        <GuideStickyNav items={items} containerId={containerId} backLink={backLink} />
      </div>

      <div className="mx-auto w-full max-w-[1680px] md:flex-1 md:min-h-0 xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-6">
        <div
          id={containerId}
          className="snap-none scroll-smooth md:h-full md:min-h-0 md:snap-y md:snap-mandatory md:overflow-y-auto xl:pr-2"
        >
          {children}
        </div>

        {items.length > 1 ? (
          <div className="hidden xl:flex xl:items-center xl:justify-center">
            <ProgressIndicator items={items} containerId={containerId} className="w-full max-w-[12.5rem]" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
