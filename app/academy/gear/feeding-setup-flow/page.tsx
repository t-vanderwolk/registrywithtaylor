import LearnModuleLayout from '@/components/learn/LearnModuleLayout';
import SiteShell from '@/components/SiteShell';
import { getAcademyModuleData } from '@/lib/academy/content';
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
  defaultTitle: `${FEEDING_SETUP_FLOW_ACADEMY_TITLE} | Gear | Taylor-Made Baby Academy`,
  description: FEEDING_SETUP_FLOW_ACADEMY_DESCRIPTION,
  path: FEEDING_SETUP_FLOW_ACADEMY_PATH,
  imagePath: FEEDING_SETUP_FLOW_ACADEMY_IMAGE_PATH,
  imageAlt: FEEDING_SETUP_FLOW_ACADEMY_IMAGE_ALT,
  keywords: [
    FEEDING_SETUP_FLOW_ACADEMY_TITLE,
    ...FEEDING_SETUP_FLOW_ACADEMY_KEYWORDS,
  ],
});

export default async function FeedingSetupFlowPage() {
  const moduleData = await getAcademyModuleData('feeding-setup-flow');

  return (
    <SiteShell currentPath={FEEDING_SETUP_FLOW_ACADEMY_PATH}>
      <main className="site-main min-h-0">
        <LearnModuleLayout module={moduleData} />
      </main>
    </SiteShell>
  );
}
