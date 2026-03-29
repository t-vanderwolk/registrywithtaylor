import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import ModuleLayout from '@/components/academy/ModuleLayout';
import SiteShell from '@/components/SiteShell';
import {
  buildStrollerFoundationsAcademySubmoduleModule,
  getStrollerFoundationsAcademySubmodulePath,
  isStrollerFoundationsAcademySubmoduleSlug,
} from '@/lib/academy/strollerFoundationsAcademy';
import { STROLLER_CATEGORY_GUIDE_SLUGS } from '@/lib/guides/strollerCluster';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

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
  const imagePath: `/${string}` = module.imagePath.startsWith('/')
    ? (module.imagePath as `/${string}`)
    : '/assets/editorial/strollers.png';

  return buildMarketingMetadata({
    title: `${module.title} | Stroller Foundations | TMBC Baby Academy`,
    description: module.description,
    path: module.href as `/${string}`,
    imagePath,
    imageAlt: module.imageAlt,
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
        <PageViewTracker
          path={path}
          pageType="guide"
          slug={`academy-gear-stroller-foundations-${lane}`}
          title={module.title}
        />
        <ModuleLayout module={module} />
      </main>
    </SiteShell>
  );
}
