import PageViewTracker from '@/components/analytics/PageViewTracker';
import { GuideTrackingProvider } from '@/components/analytics/TrackingContext';
import ModuleLayout, { type ModuleLayoutData } from '@/components/academy/ModuleLayout';
import GuideViewTracker from '@/components/guides/GuideViewTracker';

type GuideTrackingRecord = {
  id: string;
  slug: string;
  title: string;
};

export default function AcademyModuleRenderer({
  module,
  guide,
  fallbackSlug,
}: {
  module: ModuleLayoutData;
  guide: GuideTrackingRecord | null;
  fallbackSlug: string;
}) {
  if (guide) {
    return (
      <GuideTrackingProvider
        value={{
          guideId: guide.id,
          sourceRoute: module.href,
          slug: guide.slug,
          title: guide.title,
        }}
      >
        <GuideViewTracker
          guideId={guide.id}
          sourceRoute={module.href}
          slug={guide.slug}
          title={guide.title}
        />
        <ModuleLayout module={module} />
      </GuideTrackingProvider>
    );
  }

  return (
    <>
      <PageViewTracker path={module.href} pageType="guide" slug={fallbackSlug} title={module.title} />
      <ModuleLayout module={module} />
    </>
  );
}
