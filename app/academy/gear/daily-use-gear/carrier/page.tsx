import PageViewTracker from '@/components/analytics/PageViewTracker';
import DailyUseGearSubmodulePage from '@/components/academy/DailyUseGearSubmodulePage';
import SiteShell from '@/components/SiteShell';
import {
  getDailyUseGearAcademySubmodule,
  getDailyUseGearAcademySubmodulePath,
} from '@/lib/academy/dailyUseGearAcademy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const submodule = getDailyUseGearAcademySubmodule('carrier');
const path = getDailyUseGearAcademySubmodulePath('carrier');

export const metadata = buildMarketingMetadata({
  title: `${submodule.title} | Daily Use Gear | TMBC Baby Academy`,
  description: submodule.metadataDescription,
  path,
  imagePath: submodule.heroImageSrc,
  imageAlt: submodule.heroImageAlt,
});

export default function DailyUseGearCarrierPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <PageViewTracker path={path} pageType="guide" slug="academy-gear-daily-use-gear-carrier" title={submodule.title} />
        <DailyUseGearSubmodulePage slug="carrier" />
      </main>
    </SiteShell>
  );
}
