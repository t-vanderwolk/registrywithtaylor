import PageViewTracker from '@/components/analytics/PageViewTracker';
import MarketingSection from '@/components/layout/MarketingSection';
import SiteShell from '@/components/SiteShell';
import StrollerQuiz from '@/components/tools/StrollerQuiz';
import SectionIntro from '@/components/ui/SectionIntro';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Stroller Matchmaker Quiz | Taylor-Made Baby Co.',
  description:
    'Answer 7 quick questions and find your stroller category — full size, compact, travel, convertible, double, or jogging. Specific product picks included.',
  path: '/tools/stroller-quiz',
  imagePath: '/assets/editorial/strollers.png',
  imageAlt: 'Stroller Matchmaker Quiz',
  keywords: [
    'stroller quiz',
    'which stroller is right for me',
    'stroller category finder',
    'best stroller for my lifestyle',
    'stroller matchmaker',
    'how to choose a stroller',
  ],
});

export default function StrollerQuizPage() {
  return (
    <SiteShell currentPath="/tools/stroller-quiz">
      <main className="site-main">
        <PageViewTracker path="/tools/stroller-quiz" pageType="other" />

        <MarketingSection tone="ivory" spacing="spacious" reveal={false}>
          <SectionIntro
            eyebrow="Free Tool"
            title="Stroller Matchmaker"
            description="There is no universal best stroller — only the one that fits your actual life. Answer 7 questions and we'll match you to one of the six stroller categories, with specific picks for your result."
            contentWidthClassName="max-w-2xl"
          />

          <div className="mt-10 max-w-3xl mx-auto">
            <StrollerQuiz />
          </div>
        </MarketingSection>
      </main>
    </SiteShell>
  );
}
