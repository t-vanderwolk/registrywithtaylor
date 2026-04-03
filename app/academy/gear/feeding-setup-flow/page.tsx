import PageViewTracker from '@/components/analytics/PageViewTracker';
import FeedingSetupFlowModule from '@/components/academy/FeedingSetupFlowModule';
import SiteShell from '@/components/SiteShell';
import {
  FEEDING_SETUP_FLOW_ACADEMY_DESCRIPTION,
  FEEDING_SETUP_FLOW_ACADEMY_IMAGE_ALT,
  FEEDING_SETUP_FLOW_ACADEMY_IMAGE_PATH,
  FEEDING_SETUP_FLOW_ACADEMY_KEYWORDS,
  FEEDING_SETUP_FLOW_ACADEMY_PATH,
  FEEDING_SETUP_FLOW_ACADEMY_TITLE,
} from '@/lib/academy/feedingSetupFlowAcademy';
import { buildAcademyPageMetadata } from '@/lib/academy/routeMetadata';

export const metadata = buildAcademyPageMetadata({
  defaultTitle: `${FEEDING_SETUP_FLOW_ACADEMY_TITLE} | Gear | TMBC Baby Academy`,
  description: FEEDING_SETUP_FLOW_ACADEMY_DESCRIPTION,
  path: FEEDING_SETUP_FLOW_ACADEMY_PATH,
  imagePath: FEEDING_SETUP_FLOW_ACADEMY_IMAGE_PATH,
  imageAlt: FEEDING_SETUP_FLOW_ACADEMY_IMAGE_ALT,
  keywords: [
    FEEDING_SETUP_FLOW_ACADEMY_TITLE,
    ...FEEDING_SETUP_FLOW_ACADEMY_KEYWORDS,
  ],
});

export default function FeedingSetupFlowPage() {
  return (
    <SiteShell currentPath={FEEDING_SETUP_FLOW_ACADEMY_PATH}>
      <main className="site-main min-h-0">
        <PageViewTracker
          path={FEEDING_SETUP_FLOW_ACADEMY_PATH}
          pageType="guide"
          slug="academy-gear-feeding-setup-flow"
          title={FEEDING_SETUP_FLOW_ACADEMY_TITLE}
        />
        <FeedingSetupFlowModule />
      </main>
    </SiteShell>
  );
}
