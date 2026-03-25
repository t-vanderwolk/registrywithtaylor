import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import ModuleLayout from '@/components/academy/ModuleLayout';
import SiteShell from '@/components/SiteShell';
import {
  getAcademyModuleData,
  getAcademyModuleParams,
  isAcademyModuleSlug,
  isAcademyPathSlug,
} from '@/lib/academy/content';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

type AcademyModulePageProps = {
  params: Promise<{
    academyPath: string;
    module: string;
  }>;
};

export function generateStaticParams() {
  return getAcademyModuleParams();
}

export async function generateMetadata({ params }: AcademyModulePageProps): Promise<Metadata> {
  const { academyPath, module } = await params;

  if (!isAcademyPathSlug(academyPath) || !isAcademyModuleSlug(module)) {
    return {};
  }

  const moduleData = await getAcademyModuleData(module);
  if (moduleData.pathSlug !== academyPath) {
    return {};
  }

  return buildMarketingMetadata({
    title: `${moduleData.title} | TMBC Baby Academy`,
    description: moduleData.description,
    path: moduleData.href as `/${string}`,
    imagePath: moduleData.imagePath as `/${string}`,
    imageAlt: moduleData.imageAlt,
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

  return (
    <SiteShell currentPath={moduleData.href}>
      <main className="site-main min-h-0">
        <PageViewTracker
          path={moduleData.href}
          pageType="guide"
          slug={`academy-${moduleData.pathSlug}-${moduleData.slug}`}
          title={moduleData.title}
        />
        <ModuleLayout module={moduleData} />
      </main>
    </SiteShell>
  );
}
