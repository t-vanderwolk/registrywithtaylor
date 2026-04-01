import type { Metadata } from 'next';
import DailyUseGearSubmodulePage from '@/components/academy/DailyUseGearSubmodulePage';
import SiteShell from '@/components/SiteShell';
import {
  getDailyUseGearAcademySubmodule,
  getDailyUseGearAcademySubmodulePath,
} from '@/lib/academy/dailyUseGearAcademy';
import { buildAcademyPageMetadata } from '@/lib/academy/routeMetadata';
import { getPublishedAcademyGuideForPath } from '@/lib/server/academyGuides';

const submodule = getDailyUseGearAcademySubmodule('baby-bath');
const path = getDailyUseGearAcademySubmodulePath('baby-bath');

export async function generateMetadata(): Promise<Metadata> {
  const academyGuide = await getPublishedAcademyGuideForPath(path);

  return buildAcademyPageMetadata({
    defaultTitle: `${submodule.title} | Daily Use Gear | TMBC Baby Academy`,
    description: submodule.metadataDescription,
    path,
    imagePath: submodule.heroImageSrc,
    imageAlt: submodule.heroImageAlt,
    keywords: [
      submodule.title,
      submodule.deck,
      ...submodule.decisionBullets.slice(0, 4),
    ],
    guide: academyGuide,
  });
}

export default function DailyUseGearBabyBathPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <DailyUseGearSubmodulePage slug="baby-bath" />
      </main>
    </SiteShell>
  );
}
