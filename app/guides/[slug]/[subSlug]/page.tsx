import { getGuidePageMetadata, renderGuideRoute } from '../../guideRoute';

export const dynamic = 'force-dynamic';

type NestedGuidePageProps = {
  params: Promise<{ slug: string; subSlug: string }>;
};

export async function generateMetadata({ params }: NestedGuidePageProps) {
  const { slug, subSlug } = await params;
  return getGuidePageMetadata({ slug, subSlug });
}

export default async function NestedGuideDetailPage({ params }: NestedGuidePageProps) {
  const { slug, subSlug } = await params;
  return renderGuideRoute({ slug, subSlug });
}
