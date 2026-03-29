import PageViewTracker from '@/components/analytics/PageViewTracker';
import CarSeatFoundationsHub from '@/components/academy/CarSeatFoundationsHub';
import SiteShell from '@/components/SiteShell';
import {
  CAR_SEAT_FOUNDATIONS_ACADEMY_DECK,
  CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_PATH,
  CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE,
} from '@/lib/academy/carSeatFoundationsAcademy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: `${CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE} | Gear | TMBC Baby Academy`,
  description: CAR_SEAT_FOUNDATIONS_ACADEMY_DECK,
  path: CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_PATH,
  imagePath: '/assets/editorial/gear.jpg',
  imageAlt: 'Editorial car seat planning image for Taylor-Made Baby Co.',
});

export default function CarSeatFoundationsHubPage() {
  return (
    <SiteShell currentPath={CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_PATH}>
      <main className="site-main min-h-0">
        <PageViewTracker
          path={CAR_SEAT_FOUNDATIONS_ACADEMY_HUB_PATH}
          pageType="guide"
          slug="academy-gear-car-seat-foundations-hub"
          title={CAR_SEAT_FOUNDATIONS_ACADEMY_TITLE}
        />
        <CarSeatFoundationsHub />
      </main>
    </SiteShell>
  );
}
