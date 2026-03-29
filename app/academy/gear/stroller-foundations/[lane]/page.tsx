import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AcademyModuleRenderer from '@/components/academy/AcademyModuleRenderer';
import SiteShell from '@/components/SiteShell';
import {
  buildStrollerFoundationsAcademySubmoduleModule,
  getStrollerFoundationsAcademySubmodulePath,
  isStrollerFoundationsAcademySubmoduleSlug,
} from '@/lib/academy/strollerFoundationsAcademy';
import { STROLLER_CATEGORY_GUIDE_SLUGS } from '@/lib/guides/strollerCluster';
import { isRemoteImageUrl } from '@/lib/blog/images';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import {
  getPublishedAcademyGuideForPath,
  mergeAcademyModuleWithGuideRecord,
} from '@/lib/server/academyGuides';

function resolveMetadataImagePath(preferredPath: string | null | undefined, fallbackPath: string) {
  const normalizedPreferredPath = preferredPath?.trim();

  if (!normalizedPreferredPath) {
    return fallbackPath;
  }

  return normalizedPreferredPath.startsWith('/') || isRemoteImageUrl(normalizedPreferredPath)
    ? normalizedPreferredPath
    : fallbackPath;
}

type StrollerFoundationsLanePageProps = {
  params: Promise<{
    lane: string;
  }>;
};

export function generateStaticParams() {
  return STROLLER_CATEGORY_GUIDE_SLUGS.map((lane) => ({ lane }));
}

export async function generateMetadata({
  params,
}: StrollerFoundationsLanePageProps): Promise<Metadata> {
  const { lane } = await params;

  if (!isStrollerFoundationsAcademySubmoduleSlug(lane)) {
    return {};
  }

  const fallbackModule = buildStrollerFoundationsAcademySubmoduleModule(lane);
  const academyGuide = await getPublishedAcademyGuideForPath(fallbackModule.href);
  const module = academyGuide ? mergeAcademyModuleWithGuideRecord(fallbackModule, academyGuide) : fallbackModule;
  const imagePath = resolveMetadataImagePath(
    academyGuide?.ogImageUrl?.trim() || academyGuide?.heroImageUrl?.trim(),
    module.imagePath,
  );
  const resolvedImagePath: `/${string}` = imagePath.startsWith('/')
    ? (imagePath as `/${string}`)
    : '/assets/editorial/strollers.png';

  return buildMarketingMetadata({
    title: `${module.title} | Stroller Foundations | TMBC Baby Academy`,
    description: academyGuide?.seoDescription?.trim() || module.description,
    path: module.href as `/${string}`,
    imagePath: resolvedImagePath,
    imageAlt: academyGuide?.ogImageAlt?.trim() || academyGuide?.heroImageAlt?.trim() || module.imageAlt,
  });
}

export default async function StrollerFoundationsLanePage({
  params,
}: StrollerFoundationsLanePageProps) {
  const { lane } = await params;

  if (!isStrollerFoundationsAcademySubmoduleSlug(lane)) {
    notFound();
  }

  const fallbackModule = buildStrollerFoundationsAcademySubmoduleModule(lane);
  const path = getStrollerFoundationsAcademySubmodulePath(lane);
  const academyGuide = await getPublishedAcademyGuideForPath(path);
  const module = academyGuide ? mergeAcademyModuleWithGuideRecord(fallbackModule, academyGuide) : fallbackModule;

  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <AcademyModuleRenderer
          module={module}
          guide={academyGuide}
          fallbackSlug={`academy-gear-stroller-foundations-${lane}`}
        />
      </main>
    </SiteShell>
  );
}
