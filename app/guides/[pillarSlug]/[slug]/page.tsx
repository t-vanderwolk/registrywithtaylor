import { getGuidePageMetadata, renderGuideRoute } from '../../guideRoute';

export const dynamic = 'force-dynamic';

type NestedGuidePageProps = {
  params: Promise<{ pillarSlug: string; slug: string }>;
};

export async function generateMetadata({ params }: NestedGuidePageProps) {
  const { pillarSlug, slug } = await params;
  return getGuidePageMetadata({ slug, parentSlug: pillarSlug });
}

export default async function NestedGuideDetailPage({ params }: NestedGuidePageProps) {
  const { pillarSlug, slug } = await params;
  return renderGuideRoute({ slug, parentSlug: pillarSlug });
}
