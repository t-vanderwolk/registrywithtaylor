import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

import PageViewTracker from '@/components/analytics/PageViewTracker';
import { GuideTrackingProvider } from '@/components/analytics/TrackingContext';
import ModuleLayout from '@/components/academy/ModuleLayout';
import GuideViewTracker from '@/components/guides/GuideViewTracker';
import SiteShell from '@/components/SiteShell';
import {
  getAcademyModuleData,
  isAcademyModuleSlug,
  isAcademyPathSlug,
} from '@/lib/academy/content';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import {
  getPublishedAcademyGuideForModule,
  mergeAcademyModuleWithGuideRecord,
} from '@/lib/server/academyGuides';
import { isRemoteImageUrl } from '@/lib/blog/images';

function resolveMetadataImagePath(
  preferredPath: string | null | undefined,
  fallbackPath: string,
) {
  const normalizedPreferredPath = preferredPath?.trim();

  if (!normalizedPreferredPath) {
    return fallbackPath;
  }

  return normalizedPreferredPath.startsWith('/') || isRemoteImageUrl(normalizedPreferredPath)
    ? normalizedPreferredPath
    : fallbackPath;
}

type AcademyModulePageProps = {
  params: Promise<{
    academyPath: string;
    module: string;
  }>;
};

export async function generateMetadata({ params }: AcademyModulePageProps): Promise<Metadata> {
  const { academyPath, module } = await params;

  if (!isAcademyPathSlug(academyPath) || !isAcademyModuleSlug(module)) {
    return {};
  }

  const moduleData = await getAcademyModuleData(module);
  if (moduleData.pathSlug !== academyPath) {
    return {};
  }

  const academyGuide = await getPublishedAcademyGuideForModule({
    pathSlug: academyPath,
    moduleSlug: module,
  });
  const renderedModule = academyGuide ? mergeAcademyModuleWithGuideRecord(moduleData, academyGuide) : moduleData;

  return buildMarketingMetadata({
    title: `${renderedModule.title} | TMBC Baby Academy`,
    description: academyGuide?.seoDescription?.trim() || renderedModule.description,
    path: renderedModule.href as `/${string}`,
    imagePath: resolveMetadataImagePath(
      academyGuide?.ogImageUrl?.trim() || academyGuide?.heroImageUrl?.trim(),
      renderedModule.imagePath,
    ),
    imageAlt:
      academyGuide?.ogImageAlt?.trim() ||
      academyGuide?.heroImageAlt?.trim() ||
      renderedModule.imageAlt,
  });
}

export default async function AcademyModulePage({ params }: AcademyModulePageProps) {
  const { academyPath, module } = await params;

  if (!isAcademyPathSlug(academyPath) || !isAcademyModuleSlug(module)) {
    notFound();
  }

  const moduleData = await getAcademyModuleData(module);

  if (moduleData.pathSlug !== academyPath) {
    notFound();
  }

  const academyGuide = await getPublishedAcademyGuideForModule({
    pathSlug: academyPath,
    moduleSlug: module,
  });
  const renderedModule = academyGuide
    ? mergeAcademyModuleWithGuideRecord(moduleData, academyGuide)
    : moduleData;

  return (
    <SiteShell currentPath={renderedModule.href}>
      <main className="site-main min-h-0">
        {academyGuide ? (
          <GuideTrackingProvider
            value={{
              guideId: academyGuide.id,
              sourceRoute: renderedModule.href,
              slug: academyGuide.slug,
              title: academyGuide.title,
            }}
          >
            <GuideViewTracker
              guideId={academyGuide.id}
              sourceRoute={renderedModule.href}
              slug={academyGuide.slug}
              title={academyGuide.title}
            />
            <ModuleLayout module={renderedModule} />
          </GuideTrackingProvider>
        ) : (
          <>
            <PageViewTracker
              path={renderedModule.href}
              pageType="guide"
              slug={`academy-${renderedModule.pathSlug}-${renderedModule.slug}`}
              title={renderedModule.title}
            />
            <ModuleLayout module={renderedModule} />
          </>
        )}
      </main>
    </SiteShell>
  );
}
