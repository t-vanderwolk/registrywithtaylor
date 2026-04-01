import PageViewTracker from '@/components/analytics/PageViewTracker';
import DailyUseGearHub from '@/components/academy/DailyUseGearHub';
import SiteShell from '@/components/SiteShell';
import {
  DAILY_USE_GEAR_ACADEMY_DECK,
  DAILY_USE_GEAR_ACADEMY_HUB_PATH,
  DAILY_USE_GEAR_ACADEMY_LEARNING_HIGHLIGHTS,
  DAILY_USE_GEAR_ACADEMY_TITLE,
} from '@/lib/academy/dailyUseGearAcademy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: `${DAILY_USE_GEAR_ACADEMY_TITLE} | Gear | TMBC Baby Academy`,
  description: DAILY_USE_GEAR_ACADEMY_DECK,
  path: DAILY_USE_GEAR_ACADEMY_HUB_PATH,
  imagePath: '/assets/editorial/babystuff.png',
  imageAlt: 'Editorial daily use baby gear image for Taylor-Made Baby Co.',
  keywords: [
    DAILY_USE_GEAR_ACADEMY_TITLE,
    ...DAILY_USE_GEAR_ACADEMY_LEARNING_HIGHLIGHTS.slice(0, 4),
  ],
  category: 'TMBC Academy',
});

export default function DailyUseGearHubPage() {
  return (
    <SiteShell currentPath={DAILY_USE_GEAR_ACADEMY_HUB_PATH}>
      <main className="site-main min-h-0">
        <PageViewTracker
          path={DAILY_USE_GEAR_ACADEMY_HUB_PATH}
          pageType="guide"
          slug="academy-gear-daily-use-gear-hub"
          title={DAILY_USE_GEAR_ACADEMY_TITLE}
        />
        <DailyUseGearHub />
      </main>
    </SiteShell>
  );
}
