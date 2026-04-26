import Link from 'next/link';
import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import CaseStudyCTA from '@/components/academy/CaseStudyCTA';
import SiteShell from '@/components/SiteShell';
import { getCaseStudies } from '@/lib/caseStudies';
import {
  buildAcademyBreadcrumbStructuredData,
  buildAcademyCollectionStructuredData,
} from '@/lib/academy/seo';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const CASE_STUDIES_PATH = '/academy/case-studies' as const;
const CASE_STUDIES_TITLE = 'Academy Case Studies';
const CASE_STUDIES_DESCRIPTION =
  'Real-life TMBC Academy case studies that show how registry, nursery, gear, and postpartum decisions change when the home, routine, and constraints get named first.';

const breadcrumbs = [
  { label: 'Academy', href: '/academy' },
  { label: 'Case Studies' },
];

export const metadata = buildMarketingMetadata({
  title: `${CASE_STUDIES_TITLE} | Taylor-Made Baby Co.`,
  description: CASE_STUDIES_DESCRIPTION,
  path: CASE_STUDIES_PATH,
  imagePath: '/assets/hero/hero-baby-editorial-v2.jpg',
  imageAlt: 'TMBC Academy case studies editorial image.',
  keywords: [
    'TMBC Academy case studies',
    'baby registry case studies',
    'baby gear planning examples',
    'nursery planning examples',
  ],
  category: 'TMBC Academy',
});

export default function AcademyCaseStudiesPage() {
  const studies = getCaseStudies();

  return (
    <SiteShell currentPath={CASE_STUDIES_PATH}>
      <main className="site-main min-h-0 bg-[radial-gradient(circle_at_top_right,rgba(232,154,174,0.16),transparent_24%),radial-gradient(circle_at_top_left,rgba(243,216,196,0.3),transparent_28%),linear-gradient(180deg,#fef9f7_0%,#fdf1f4_34%,#fffdfa_100%)]">
        <AcademyStructuredData
          data={[
            buildAcademyBreadcrumbStructuredData({
              breadcrumbs,
              currentPath: CASE_STUDIES_PATH,
            }),
            buildAcademyCollectionStructuredData({
              title: CASE_STUDIES_TITLE,
              description: CASE_STUDIES_DESCRIPTION,
              path: CASE_STUDIES_PATH,
              breadcrumbs,
              items: studies.map((study) => ({
                href: `${CASE_STUDIES_PATH}/${study.slug}`,
                title: study.title,
                description: study.deck,
              })),
              keywords: studies.map((study) => study.title),
            }),
          ]}
        />

        <section className="mx-auto max-w-6xl px-5 pb-10 pt-10 sm:px-8 md:pb-12 md:pt-14 lg:px-10">
          <nav aria-label="Breadcrumb" className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">
            <ol className="flex min-w-0 flex-wrap items-center gap-2 text-[0.68rem] tracking-[0.18em] sm:text-[0.72rem] sm:tracking-[0.22em]">
              <li>
                <Link href="/academy" className="transition duration-200 hover:text-[#8F4C62]">
                  Academy
                </Link>
              </li>
              <li className="inline-flex items-center gap-2">
                <span aria-hidden="true" className="text-[rgba(161,91,114,0.35)]">/</span>
                <span className="text-[#8F4C62]">Case Studies</span>
              </li>
            </ol>
          </nav>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-14 sm:px-8 md:pb-20 lg:px-10">
          <div className="overflow-hidden rounded-[2.2rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,252,253,0.98)_0%,rgba(252,243,246,0.97)_48%,rgba(249,241,233,0.96)_100%)] px-6 py-8 shadow-[0_28px_70px_rgba(58,36,43,0.1)] sm:px-8 md:px-10 md:py-12">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">TMBC Academy Case Studies</p>
            <h1 className="mt-4 max-w-[13ch] break-words font-serif text-[2.45rem] leading-[0.94] tracking-[-0.06em] text-[#2F2430] sm:text-[4.2rem]">
              Real homes. Real constraints. Calmer decisions.
            </h1>
            <p className="mt-6 max-w-[44rem] break-words text-[1.02rem] leading-8 text-[#4B3641] sm:text-[1.16rem] sm:leading-9">
              Sometimes the framework clicks faster when you can see it living in an actual routine. These case studies show how the Academy decisions change when space, travel, cars, pets, siblings, and overwhelm get a vote.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 md:pb-24 lg:px-10">
          <CaseStudyCTA
            studies={studies}
            eyebrow="Case Study Library"
            title="Choose the situation that sounds closest to your real life"
            description="You do not need to match a case study perfectly. Use the one that feels closest, then borrow the decision logic."
          />
        </section>
      </main>
    </SiteShell>
  );
}
