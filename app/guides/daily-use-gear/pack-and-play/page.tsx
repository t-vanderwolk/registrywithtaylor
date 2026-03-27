import PageViewTracker from '@/components/analytics/PageViewTracker';
import DailyUseGearCategoryPage from '@/components/guides/DailyUseGearCategoryPage';
import SiteShell from '@/components/SiteShell';
import { getDailyUseGearCategory, getDailyUseGearCategoryPath } from '@/lib/guides/dailyUseGearLane';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const category = getDailyUseGearCategory('pack-and-play');
const path = getDailyUseGearCategoryPath('pack-and-play');

export const metadata = buildMarketingMetadata({
  title: `${category.title} | Daily Use Gear | Taylor-Made Baby Co.`,
  description:
    'Compare playards, bassinet add-ons, travel-friendly models, and the real use cases that make a pack and play worth owning.',
  path,
  imagePath: category.heroImageSrc,
  imageAlt: category.heroImageAlt,
});

export default function DailyUseGearPackAndPlayPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <PageViewTracker path={path} pageType="guide" slug="pack-and-play" title={category.title} />
        <DailyUseGearCategoryPage slug="pack-and-play" />
      </main>
    </SiteShell>
  );
}
