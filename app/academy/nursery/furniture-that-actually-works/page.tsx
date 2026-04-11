import PageViewTracker from '@/components/analytics/PageViewTracker';
import NurseryFurnitureHub from '@/components/academy/NurseryFurnitureHub';
import SiteShell from '@/components/SiteShell';
import {
  NURSERY_FURNITURE_HUB_PATH,
  NURSERY_FURNITURE_HUB_WHY_THIS_MATTERS,
} from '@/lib/academy/nurseryFurnitureAcademy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Furniture That Actually Works | Nursery | TMBC Baby Academy',
  description:
    'Use the TMBC nursery furniture module to understand cribs, gliders, dressers and changing setups, diaper pails, baby monitors, and baby proofing with calmer, more practical decision logic.',
  path: NURSERY_FURNITURE_HUB_PATH,
  imagePath: '/assets/nurserypath/nurseryprep.png',
  imageAlt: 'Nursery furniture image for Taylor-Made Baby Co.',
  keywords: [
    'Furniture That Actually Works',
    ...NURSERY_FURNITURE_HUB_WHY_THIS_MATTERS.slice(0, 4),
  ],
  category: 'TMBC Academy',
});

export default function NurseryFurnitureHubPage() {
  return (
    <SiteShell currentPath={NURSERY_FURNITURE_HUB_PATH}>
      <main className="site-main min-h-0">
        <PageViewTracker
          path={NURSERY_FURNITURE_HUB_PATH}
          pageType="guide"
          slug="academy-nursery-furniture-that-actually-works"
          title="Furniture That Actually Works"
        />
        <NurseryFurnitureHub />
      </main>
    </SiteShell>
  );
}
