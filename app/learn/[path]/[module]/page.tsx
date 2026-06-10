import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import LearnModuleLayout from '@/components/learn/LearnModuleLayout';
import TrackProgress from '@/components/learn/TrackProgress';
import SiteShell from '@/components/SiteShell';
import {
  getAcademyModuleData,
  getAcademyModuleParams,
  isAcademyModuleSlug,
  isAcademyPathSlug,
} from '@/lib/academy/content';
import { buildAcademyPageMetadata } from '@/lib/academy/routeMetadata';

type LearnModulePageProps = {
  params: Promise<{
    path: string;
    module: string;
  }>;
};

export function generateStaticParams() {
  // Reuse the same static params as /academy/[academyPath]/[module]
  // Maps { academyPath, module } → { path, module }
  return getAcademyModuleParams().map(({ academyPath, module }) => ({
    path: academyPath,
    module,
  }));
}

export async function generateMetadata({ params }: LearnModulePageProps): Promise<Metadata> {
  const { path, module } = await params;

  if (!isAcademyPathSlug(path) || !isAcademyModuleSlug(module)) {
    return {};
  }

  const moduleData = await getAcademyModuleData(module);
  if (moduleData.pathSlug !== path) {
    return {};
  }

  return buildAcademyPageMetadata({
    defaultTitle: `${moduleData.title} | Taylor-Made Baby Academy`,
    description: moduleData.description,
    path: `/learn/${path}/${module}` as `/${string}`,
    imagePath: moduleData.imagePath,
    imageAlt: moduleData.imageAlt,
    keywords: [
      moduleData.title,
      moduleData.subhead,
      ...moduleData.coreSections.map((section) => section.title).slice(0, 3),
      ...moduleData.decisionBullets.slice(0, 4),
    ],
  });
}

export default async function LearnModulePage({ params }: LearnModulePageProps) {
  const { path, module } = await params;

  if (!isAcademyPathSlug(path) || !isAcademyModuleSlug(module)) {
    notFound();
  }

  const moduleData = await getAcademyModuleData(module);

  if (moduleData.pathSlug !== path) {
    notFound();
  }

  // Override the href to point to /learn routes
  const learnModuleData = {
    ...moduleData,
    href: `/learn/${path}/${module}`,
    breadcrumb: [
      { label: 'Academy', href: '/learn' },
      {
        label: moduleData.breadcrumb[1]?.label ?? path,
        href: `/learn/${path}`,
      },
      { label: moduleData.title },
    ],
  };

  return (
    <SiteShell currentPath={`/learn/${path}/${module}`}>
      <TrackProgress pathSlug={path} moduleSlug={module} />
      <main className="site-main min-h-0">
        <LearnModuleLayout module={learnModuleData} />
      </main>
    </SiteShell>
  );
}
