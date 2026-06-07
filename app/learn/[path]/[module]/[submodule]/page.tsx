import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import LearnModuleLayout from '@/components/learn/LearnModuleLayout';
import SiteShell from '@/components/SiteShell';
import { buildAcademyPageMetadata } from '@/lib/academy/routeMetadata';
import {
  getLearnSubmoduleStaticParams,
  resolveLearnSubmodule,
} from '@/lib/learn/submoduleResolver';

type LearnSubmodulePageProps = {
  params: Promise<{
    path: string;
    module: string;
    submodule: string;
  }>;
};

export function generateStaticParams() {
  return getLearnSubmoduleStaticParams();
}

export async function generateMetadata({
  params,
}: LearnSubmodulePageProps): Promise<Metadata> {
  const { path, module, submodule } = await params;
  const moduleData = resolveLearnSubmodule(path, module, submodule);

  if (!moduleData) return {};

  return buildAcademyPageMetadata({
    defaultTitle: `${moduleData.title} | Taylor-Made Baby Academy`,
    description: moduleData.description,
    path: moduleData.href as `/${string}`,
    imagePath: moduleData.imagePath,
    imageAlt: moduleData.imageAlt,
    keywords: [
      moduleData.title,
      moduleData.subhead,
      ...moduleData.coreSections.map((s) => s.title).slice(0, 3),
      ...moduleData.decisionBullets.slice(0, 4),
    ],
  });
}

export default async function LearnSubmodulePage({
  params,
}: LearnSubmodulePageProps) {
  const { path, module, submodule } = await params;
  const moduleData = resolveLearnSubmodule(path, module, submodule);

  if (!moduleData) notFound();

  return (
    <SiteShell currentPath={moduleData.href}>
      <main className="site-main min-h-0">
        <LearnModuleLayout module={moduleData} />
      </main>
    </SiteShell>
  );
}
