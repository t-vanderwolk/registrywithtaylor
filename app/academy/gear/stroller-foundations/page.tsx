import PageViewTracker from '@/components/analytics/PageViewTracker';
import StrollerFoundationsHub from '@/components/academy/StrollerFoundationsHub';
import SiteShell from '@/components/SiteShell';
import {
  STROLLER_FOUNDATIONS_ACADEMY_DECK,
  STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH,
  STROLLER_FOUNDATIONS_ACADEMY_TITLE,
} from '@/lib/academy/strollerFoundationsAcademy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: `${STROLLER_FOUNDATIONS_ACADEMY_TITLE} | Gear | TMBC Baby Academy`,
  description: STROLLER_FOUNDATIONS_ACADEMY_DECK,
  path: STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH,
  imagePath: '/assets/editorial/strollers.png',
  imageAlt: 'Editorial stroller planning image for Taylor-Made Baby Co.',
});

export default function StrollerFoundationsHubPage() {
  return (
    <SiteShell currentPath={STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH}>
      <main className="site-main min-h-0">
        <PageViewTracker
          path={STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH}
          pageType="guide"
          slug="academy-gear-stroller-foundations-hub"
          title={STROLLER_FOUNDATIONS_ACADEMY_TITLE}
        />
        <StrollerFoundationsHub />
      </main>
    </SiteShell>
  );
}
