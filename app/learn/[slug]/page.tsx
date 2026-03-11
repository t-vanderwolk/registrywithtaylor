type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

import { redirect } from 'next/navigation';

export default async function GuidePillarPage({ params }: GuidePageProps) {
  const { slug } = await params;
  redirect(`/guides/${slug}`);
}
