import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AcademyRouteCard } from '@/components/academy/AcademyPrimitives';
import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import CaseStudyCTA from '@/components/academy/CaseStudyCTA';
import CaseStudyDecisions from '@/components/academy/CaseStudyDecisions';
import CaseStudyHeader from '@/components/academy/CaseStudyHeader';
import CaseStudyScenarios from '@/components/academy/CaseStudyScenarios';
import CaseStudySnapshot from '@/components/academy/CaseStudySnapshot';
import SiteShell from '@/components/SiteShell';
import {
  getCaseStudies,
  getCaseStudyBySlug,
  getCaseStudyHref,
  getCaseStudyLinkItems,
  getRelatedCaseStudies,
} from '@/lib/caseStudies';
import {
  buildAcademyBreadcrumbStructuredData,
  buildAcademyLearningResourceStructuredData,
} from '@/lib/academy/seo';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

type CaseStudyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getCaseStudies().map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    return {};
  }

  return buildMarketingMetadata({
    title: `${study.title} | TMBC Academy Case Study`,
    description: study.deck,
    path: getCaseStudyHref(study.slug),
    imagePath: study.imageSrc,
    imageAlt: study.imageAlt,
    keywords: [
      study.title,
      study.snapshot.home,
      study.snapshot.priority,
      ...study.whatMatters.slice(0, 3),
    ],
    category: 'TMBC Academy',
    type: 'article',
  });
}

export default async function AcademyCaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  const path = getCaseStudyHref(study.slug);
  const breadcrumbs = [
    { label: 'Academy', href: '/academy' },
    { label: 'Case Studies', href: '/academy/case-studies' },
    { label: study.title },
  ];
  const relatedStudies = getRelatedCaseStudies(study);
  const academyLinks = getCaseStudyLinkItems(study);

  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0 bg-[radial-gradient(circle_at_top_right,rgba(232,154,174,0.16),transparent_24%),radial-gradient(circle_at_top_left,rgba(243,216,196,0.3),transparent_28%),linear-gradient(180deg,#fef9f7_0%,#fdf1f4_34%,#fffdfa_100%)]">
        <AcademyStructuredData
          data={[
            buildAcademyBreadcrumbStructuredData({
              breadcrumbs,
              currentPath: path,
            }),
            buildAcademyLearningResourceStructuredData({
              title: study.title,
              description: study.deck,
              path,
              breadcrumbs,
              keywords: [
                study.snapshot.home,
                study.snapshot.priority,
                ...study.whatMatters.slice(0, 4),
              ],
              teaches: study.decisions.map((decision) => decision.title),
              hasPart: academyLinks.map((link) => ({
                href: link.href,
                title: link.label,
                description: `Academy module connected to ${study.title}.`,
              })),
              learningResourceType: 'TMBC Academy Case Study',
            }),
          ]}
        />

        <section className="mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-8 md:pb-14 md:pt-14 lg:px-10">
          <CaseStudyHeader study={study} breadcrumbs={breadcrumbs} />
        </section>

        <div className="mx-auto max-w-6xl space-y-12 px-5 pb-20 sm:px-8 md:space-y-14 md:pb-24 lg:px-10">
          <CaseStudySnapshot study={study} />
          <CaseStudyDecisions study={study} />
          <CaseStudyScenarios study={study} />

          <section className="space-y-6">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">Connected Academy Modules</p>
              <h2 className="mt-4 break-words font-serif text-[clamp(1.9rem,3.6vw,2.55rem)] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
                Keep learning where this case study points
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {academyLinks.map((link) => (
                <AcademyRouteCard
                  key={link.href}
                  href={link.href}
                  eyebrow="Academy Module"
                  title={link.label}
                  description="Use this module to go deeper on the decision layer behind the case study."
                  ctaLabel="Open module ->"
                />
              ))}
            </div>
          </section>

          <CaseStudyCTA
            studies={relatedStudies}
            eyebrow="Related Case Studies"
            title="Read another real-life version"
            description="The same framework can look different once the home, routine, and constraints change."
          />

          <div className="pt-2">
            <Link
              href="/academy/case-studies"
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/92 px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(58,36,43,0.08)]"
            >
              Back to all case studies
            </Link>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
