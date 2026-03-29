import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import ModuleLayout from '@/components/academy/ModuleLayout';
import SiteShell from '@/components/SiteShell';
import {
  buildCarSeatFoundationsAcademySubmoduleModule,
  getCarSeatFoundationsAcademySubmodulePath,
  isCarSeatFoundationsAcademySubmoduleSlug,
} from '@/lib/academy/carSeatFoundationsAcademy';
import { CAR_SEAT_CATEGORY_GUIDE_SLUGS } from '@/lib/guides/carSeatCategoryGuides';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

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

  const module = buildCarSeatFoundationsAcademySubmoduleModule(category);
  const imagePath: `/${string}` = module.imagePath.startsWith('/')
    ? (module.imagePath as `/${string}`)
    : '/assets/editorial/gear.jpg';

  return buildMarketingMetadata({
    title: `${module.title} | Car Seat Foundations | TMBC Baby Academy`,
    description: module.description,
    path: module.href as `/${string}`,
    imagePath,
    imageAlt: module.imageAlt,
  });
}

export default async function CarSeatFoundationsCategoryPage({
  params,
}: CarSeatFoundationsCategoryPageProps) {
  const { category } = await params;

  if (!isCarSeatFoundationsAcademySubmoduleSlug(category)) {
    notFound();
  }

  const module = buildCarSeatFoundationsAcademySubmoduleModule(category);
  const path = getCarSeatFoundationsAcademySubmodulePath(category);

  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <PageViewTracker
          path={path}
          pageType="guide"
          slug={`academy-gear-car-seat-foundations-${category}`}
          title={module.title}
        />
        <ModuleLayout module={module} />
      </main>
    </SiteShell>
  );
}
