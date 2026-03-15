import { getGuidePageMetadata, renderGuideRoute } from '../guideRoute';

export const dynamic = 'force-dynamic';

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;
  return getGuidePageMetadata({ slug });
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  return renderGuideRoute({ slug });
}
