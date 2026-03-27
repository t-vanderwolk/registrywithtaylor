import PageViewTracker from '@/components/analytics/PageViewTracker';
import NurseryFurnitureHub from '@/components/academy/NurseryFurnitureHub';
import SiteShell from '@/components/SiteShell';
import { NURSERY_FURNITURE_HUB_PATH } from '@/lib/academy/nurseryFurnitureAcademy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Furniture That Actually Works | Nursery | TMBC Baby Academy',
  description:
    'Use the TMBC nursery furniture module to understand cribs, gliders, dressers and changing setups, diaper pails, baby monitors, and baby proofing with calmer, more practical decision logic.',
  path: NURSERY_FURNITURE_HUB_PATH,
  imagePath: '/assets/editorial/nursery2.png',
  imageAlt: 'Editorial nursery furniture image for Taylor-Made Baby Co.',
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
