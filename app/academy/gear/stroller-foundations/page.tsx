import StrollerFoundationsHub from '@/components/academy/StrollerFoundationsHub';
import SiteShell from '@/components/SiteShell';
import {
  STROLLER_FOUNDATIONS_ACADEMY_DECK,
  STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH,
  STROLLER_FOUNDATIONS_ACADEMY_LEARNING_HIGHLIGHTS,
  STROLLER_FOUNDATIONS_ACADEMY_TITLE,
} from '@/lib/academy/strollerFoundationsAcademy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: `${STROLLER_FOUNDATIONS_ACADEMY_TITLE} | Gear | TMBC Baby Academy`,
  description: STROLLER_FOUNDATIONS_ACADEMY_DECK,
  path: STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH,
  imagePath: '/assets/editorial/strollers.png',
  imageAlt: 'Editorial stroller planning image for Taylor-Made Baby Co.',
  keywords: [
    STROLLER_FOUNDATIONS_ACADEMY_TITLE,
    ...STROLLER_FOUNDATIONS_ACADEMY_LEARNING_HIGHLIGHTS.slice(0, 4),
  ],
  category: 'TMBC Academy',
});

export default function StrollerFoundationsHubPage() {
  return (
    <SiteShell currentPath={STROLLER_FOUNDATIONS_ACADEMY_HUB_PATH}>
      <main className="site-main min-h-0">
        <StrollerFoundationsHub />
      </main>
    </SiteShell>
  );
}
