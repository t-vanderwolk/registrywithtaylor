import { notFound } from 'next/navigation';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import GuideEducationLayout from '@/components/guides/GuideEducationLayout';
import SiteShell from '@/components/SiteShell';
import {
  getRegistrySubGuideBySlug,
  getRegistrySubGuideRelatedGuides,
  getRegistrySubGuideSlugs,
} from '@/lib/guides/registrySubguides';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

type RegistrySubGuidePageProps = {
  params: Promise<{ slug: string }>;
};

function getReadingTime(content: string) {
  const wordCount = content
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, ' ')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[*_`>#-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(3, Math.round(wordCount / 190));
}

export function generateStaticParams() {
  return getRegistrySubGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RegistrySubGuidePageProps) {
  const { slug } = await params;
  const guide = getRegistrySubGuideBySlug(slug);

  if (!guide) {
    return {};
  }

  return buildMarketingMetadata({
    title: guide.seoTitle,
    description: guide.seoDescription,
    path: guide.path,
    imagePath: '/assets/hero/hero-baby-editorial.jpg',
    imageAlt: guide.title,
  });
}

export default async function RegistrySubGuidePage({ params }: RegistrySubGuidePageProps) {
  const { slug } = await params;
  const guide = getRegistrySubGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const readingTime = getReadingTime(guide.content);
  const displayDate = new Date('2026-03-20T12:00:00-07:00');

  return (
    <SiteShell currentPath={guide.path}>
      <main className="site-main min-h-0">
        <PageViewTracker path={guide.path} pageType="guide" slug={`registry-${guide.slug}`} title={guide.title} />
        <GuideEducationLayout
          guide={{
            id: `registry-${guide.slug}`,
            title: guide.title,
            slug: `registry-${guide.slug}`,
            category: 'Registry Planning',
            content: guide.content,
            affiliateModules: [],
            faqItems: [],
            consultationCtaEnabled: false,
            newsletterCtaEnabled: false,
            nextStepCtaHref: guide.nextStepCtaHref,
            nextStepCtaLabel: guide.nextStepCtaLabel,
            takeaways: [],
          }}
          relatedGuides={getRegistrySubGuideRelatedGuides()}
          sourceRoute={guide.path}
          displayDate={displayDate}
          readingTime={readingTime}
        />
      </main>
    </SiteShell>
  );
}
