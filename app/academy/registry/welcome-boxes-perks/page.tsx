import PageViewTracker from '@/components/analytics/PageViewTracker';
import RegistryWelcomeBoxesHub from '@/components/academy/RegistryWelcomeBoxesHub';
import SiteShell from '@/components/SiteShell';
import {
  REGISTRY_WELCOME_BOXES_DECK,
  REGISTRY_WELCOME_BOXES_HUB_PATH,
  REGISTRY_WELCOME_BOXES_TITLE,
} from '@/lib/academy/registryWelcomeBoxesAcademy';
import { REGISTRY_PATH_IMAGES } from '@/lib/academy/registryModules';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: `${REGISTRY_WELCOME_BOXES_TITLE} | Registry | TMBC Baby Academy`,
  description: REGISTRY_WELCOME_BOXES_DECK,
  path: REGISTRY_WELCOME_BOXES_HUB_PATH,
  imagePath: REGISTRY_PATH_IMAGES.welcomeBox,
  imageAlt: 'Editorial registry welcome boxes image for Taylor-Made Baby Co.',
});

export default function RegistryWelcomeBoxesHubPage() {
  return (
    <SiteShell currentPath={REGISTRY_WELCOME_BOXES_HUB_PATH}>
      <main className="site-main min-h-0">
        <PageViewTracker
          path={REGISTRY_WELCOME_BOXES_HUB_PATH}
          pageType="guide"
          slug="academy-registry-welcome-boxes-perks-hub"
          title={REGISTRY_WELCOME_BOXES_TITLE}
        />
        <RegistryWelcomeBoxesHub />
      </main>
    </SiteShell>
  );
}
