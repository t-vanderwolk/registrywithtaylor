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
import { buildAcademyPageMetadata } from '@/lib/academy/routeMetadata';
import {
  getPublishedAcademyGuideForPath,
  mergeAcademyModuleWithGuideRecord,
} from '@/lib/server/academyGuides';

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

  return buildAcademyPageMetadata({
    defaultTitle: `${module.title} | Car Seat Foundations | TMBC Baby Academy`,
    description: module.description,
    path: module.href as `/${string}`,
    imagePath: module.imagePath,
    imageAlt: module.imageAlt,
    keywords: [
      module.title,
      'car seat foundations',
      ...module.coreSections.map((section) => section.title).slice(0, 3),
      ...module.decisionBullets.slice(0, 4),
    ],
    guide: academyGuide,
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
