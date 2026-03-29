import DailyUseGearSubmodulePage from '@/components/academy/DailyUseGearSubmodulePage';
import SiteShell from '@/components/SiteShell';
import {
  getDailyUseGearAcademySubmodule,
  getDailyUseGearAcademySubmodulePath,
} from '@/lib/academy/dailyUseGearAcademy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const submodule = getDailyUseGearAcademySubmodule('daily-support-gear');
const path = getDailyUseGearAcademySubmodulePath('daily-support-gear');

export const metadata = buildMarketingMetadata({
  title: `${submodule.title} | Daily Use Gear | TMBC Baby Academy`,
  description: submodule.metadataDescription,
  path,
  imagePath: submodule.heroImageSrc,
  imageAlt: submodule.heroImageAlt,
});

export default function DailyUseGearDailySupportGearPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <DailyUseGearSubmodulePage slug="daily-support-gear" />
      </main>
    </SiteShell>
  );
}
