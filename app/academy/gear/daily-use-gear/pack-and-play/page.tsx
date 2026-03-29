import PageViewTracker from '@/components/analytics/PageViewTracker';
import DailyUseGearSubmodulePage from '@/components/academy/DailyUseGearSubmodulePage';
import SiteShell from '@/components/SiteShell';
import {
  getDailyUseGearAcademySubmodule,
  getDailyUseGearAcademySubmodulePath,
} from '@/lib/academy/dailyUseGearAcademy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const submodule = getDailyUseGearAcademySubmodule('pack-and-play');
const path = getDailyUseGearAcademySubmodulePath('pack-and-play');

export const metadata = buildMarketingMetadata({
  title: `${submodule.title} | Daily Use Gear | TMBC Baby Academy`,
  description: submodule.metadataDescription,
  path,
  imagePath: submodule.heroImageSrc,
  imageAlt: submodule.heroImageAlt,
});

export default function DailyUseGearPackAndPlayPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <PageViewTracker path={path} pageType="guide" slug="academy-gear-daily-use-gear-pack-and-play" title={submodule.title} />
        <DailyUseGearSubmodulePage slug="pack-and-play" />
      </main>
    </SiteShell>
  );
}
