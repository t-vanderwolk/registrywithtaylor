import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ModuleLayout from '@/components/academy/ModuleLayout';
import SiteShell from '@/components/SiteShell';
import {
  getAcademyModuleData,
  getAcademyModuleParams,
  isAcademyModuleSlug,
  isAcademyPathSlug,
} from '@/lib/academy/content';
import { buildAcademyPageMetadata } from '@/lib/academy/routeMetadata';

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

  return buildAcademyPageMetadata({
    defaultTitle: `${moduleData.title} | TMBC Baby Academy`,
    description: moduleData.description,
    path: moduleData.href as `/${string}`,
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
        <ModuleLayout module={moduleData} />
      </main>
    </SiteShell>
  );
}
