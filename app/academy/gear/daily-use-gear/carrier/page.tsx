import type { Metadata } from 'next';
import DailyUseGearSubmodulePage from '@/components/academy/DailyUseGearSubmodulePage';
import SiteShell from '@/components/SiteShell';
import {
  getDailyUseGearAcademySubmodule,
  getDailyUseGearAcademySubmodulePath,
} from '@/lib/academy/dailyUseGearAcademy';
import { buildAcademyPageMetadata } from '@/lib/academy/routeMetadata';

const submodule = getDailyUseGearAcademySubmodule('carrier');
const path = getDailyUseGearAcademySubmodulePath('carrier');

export async function generateMetadata(): Promise<Metadata> {
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
  });
}

export default function DailyUseGearCarrierPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <DailyUseGearSubmodulePage slug="carrier" />
      </main>
    </SiteShell>
  );
}
