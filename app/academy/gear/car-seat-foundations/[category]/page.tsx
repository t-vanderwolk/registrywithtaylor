import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AcademyModuleRenderer from '@/components/academy/AcademyModuleRenderer';
import SiteShell from '@/components/SiteShell';
import {
  buildCarSeatFoundationsAcademySubmoduleModule,
  getCarSeatFoundationsAcademySubmodulePath,
  isCarSeatFoundationsAcademySubmoduleSlug,
} from '@/lib/academy/carSeatFoundationsAcademy';
import { CAR_SEAT_CATEGORY_GUIDE_SLUGS } from '@/lib/guides/carSeatCategoryGuides';
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

type CarSeatFoundationsCategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export function generateStaticParams() {
  return CAR_SEAT_CATEGORY_GUIDE_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: CarSeatFoundationsCategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  if (!isCarSeatFoundationsAcademySubmoduleSlug(category)) {
    return {};
  }

  const fallbackModule = buildCarSeatFoundationsAcademySubmoduleModule(category);
  const academyGuide = await getPublishedAcademyGuideForPath(fallbackModule.href);
  const module = academyGuide ? mergeAcademyModuleWithGuideRecord(fallbackModule, academyGuide) : fallbackModule;
  const imagePath = resolveMetadataImagePath(
    academyGuide?.ogImageUrl?.trim() || academyGuide?.heroImageUrl?.trim(),
    module.imagePath,
  );
  const resolvedImagePath: `/${string}` = imagePath.startsWith('/')
    ? (imagePath as `/${string}`)
    : '/assets/editorial/gear.jpg';

  return buildMarketingMetadata({
    title: `${module.title} | Car Seat Foundations | TMBC Baby Academy`,
    description: academyGuide?.seoDescription?.trim() || module.description,
    path: module.href as `/${string}`,
    imagePath: resolvedImagePath,
    imageAlt: academyGuide?.ogImageAlt?.trim() || academyGuide?.heroImageAlt?.trim() || module.imageAlt,
  });
}

export default async function CarSeatFoundationsCategoryPage({
  params,
}: CarSeatFoundationsCategoryPageProps) {
  const { category } = await params;

  if (!isCarSeatFoundationsAcademySubmoduleSlug(category)) {
    notFound();
  }

  const fallbackModule = buildCarSeatFoundationsAcademySubmoduleModule(category);
  const path = getCarSeatFoundationsAcademySubmodulePath(category);
  const academyGuide = await getPublishedAcademyGuideForPath(path);
  const module = academyGuide ? mergeAcademyModuleWithGuideRecord(fallbackModule, academyGuide) : fallbackModule;

  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <AcademyModuleRenderer
          module={module}
          guide={academyGuide}
          fallbackSlug={`academy-gear-car-seat-foundations-${category}`}
        />
      </main>
    </SiteShell>
  );
}
