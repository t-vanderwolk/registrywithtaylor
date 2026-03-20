import { getGuidePageMetadata, renderGuideRoute } from '../guideRoute';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return getGuidePageMetadata({ slug: 'registry' });
}

export default async function RegistryGuideHubPage() {
  return renderGuideRoute({ slug: 'registry' });
}
