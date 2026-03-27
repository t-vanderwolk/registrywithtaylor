import PageViewTracker from '@/components/analytics/PageViewTracker';
import DailyUseGearHub from '@/components/guides/DailyUseGearHub';
import SiteShell from '@/components/SiteShell';
import { DAILY_USE_GEAR_HUB_PATH } from '@/lib/guides/dailyUseGearLane';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Daily Use Gear | Taylor-Made Baby Co.',
  description:
    'Use the TMBC Daily Use Gear lane to sort carriers, highchairs, baby bath, bouncers, pack and play, and swings without overbuying the smaller everyday categories.',
  path: DAILY_USE_GEAR_HUB_PATH,
  imagePath: '/assets/editorial/babystuff.png',
  imageAlt: 'Editorial daily use baby gear image for Taylor-Made Baby Co.',
});

export default function DailyUseGearHubPage() {
  return (
    <SiteShell currentPath={DAILY_USE_GEAR_HUB_PATH}>
      <main className="site-main min-h-0">
        <PageViewTracker path={DAILY_USE_GEAR_HUB_PATH} pageType="guide" slug="daily-use-gear" title="Daily Use Gear" />
        <DailyUseGearHub />
      </main>
    </SiteShell>
  );
}
