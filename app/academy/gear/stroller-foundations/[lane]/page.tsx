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
import { buildAcademyPageMetadata } from '@/lib/academy/routeMetadata';

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

  const module = buildStrollerFoundationsAcademySubmoduleModule(lane);

  return buildAcademyPageMetadata({
    defaultTitle: `${module.title} | Stroller Foundations | TMBC Baby Academy`,
    description: module.description,
    path: module.href as `/${string}`,
    imagePath: module.imagePath,
    imageAlt: module.imageAlt,
    keywords: [
      module.title,
      'stroller foundations',
      ...module.coreSections.map((section) => section.title).slice(0, 3),
      ...module.decisionBullets.slice(0, 4),
    ],
  });
}

export default async function StrollerFoundationsLanePage({
  params,
}: StrollerFoundationsLanePageProps) {
  const { lane } = await params;

  if (!isStrollerFoundationsAcademySubmoduleSlug(lane)) {
    notFound();
  }

  const module = buildStrollerFoundationsAcademySubmoduleModule(lane);
  const path = getStrollerFoundationsAcademySubmodulePath(lane);

  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <AcademyModuleRenderer module={module} />
      </main>
    </SiteShell>
  );
}
