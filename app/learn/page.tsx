import SiteShell from '@/components/SiteShell';
import LearnHero from '@/components/learn/LearnHero';
import FreeLessonCard, { type LessonCardData } from '@/components/learn/FreeLessonCard';
import AcademyUpsellCard from '@/components/learn/AcademyUpsellCard';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import SectionIntro from '@/components/ui/SectionIntro';
import MarketingSection from '@/components/layout/MarketingSection';
import FinalCTA from '@/components/layout/FinalCTA';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Taylor-Made Baby Academy — Learn',
  description:
    'Expert-led lessons, planning tools, and checklists to help you prepare for baby with confidence. Start with a free preview lesson from Taylor-Made Baby Co.',
  path: '/learn',
  imagePath: '/assets/editorial/registry.jpg',
  imageAlt: 'Taylor-Made Baby Academy course preview',
  keywords: [
    'baby preparation course',
    'baby academy',
    'registry lesson',
    'free baby planning lesson',
  ],
});

const freeLessons: LessonCardData[] = [
  {
    lessonNumber: 1,
    title: 'The Art of the Registry',
    description:
      'Why most registries fail and how to create one that actually supports your lifestyle.',
    estimatedMinutes: 15,
    href: '/learn/art-of-the-registry',
    badge: 'Free Lesson',
    available: true,
  },
  {
    lessonNumber: 2,
    title: 'Nursery Foundations',
    description:
      'Everything you need to know about sleep spaces, furniture, layout, storage, and safety — before you buy a thing.',
    estimatedMinutes: 18,
    href: '/learn/nursery-foundations',
    badge: 'Free Lesson',
    available: true,
  },
  {
    lessonNumber: 3,
    title: 'The Stroller Equation',
    description:
      'The best stroller for someone else might be completely wrong for you. Learn the variables and all six categories so you can solve the equation with your own life.',
    estimatedMinutes: 20,
    href: '/learn/stroller-foundations',
    badge: 'Free Lesson',
    available: true,
  },
];

export default function LearnPage() {
  return (
    <SiteShell currentPath="/learn">
      <main className="site-main" style={{ backgroundColor: 'var(--color-ivory)' }}>
        {/* Hero */}
        <LearnHero />

        {/* Free Preview Lessons */}
        <MarketingSection
          id="preview-lessons"
          tone="white"
          spacing="spacious"
          reveal={false}
        >
          <RevealOnScroll>
            <SectionIntro
              eyebrow="Free Preview Lessons"
              title="Start your journey here."
              description="A few expert-created lessons before unlocking the full Academy. No account required."
              contentWidthClassName="max-w-3xl"
            />
          </RevealOnScroll>

          <div className="mt-10 grid gap-5 sm:gap-6 md:grid-cols-3">
            {freeLessons.map((lesson, index) => (
              <RevealOnScroll key={lesson.title} delayMs={index * 80}>
                <FreeLessonCard lesson={lesson} />
              </RevealOnScroll>
            ))}
          </div>
        </MarketingSection>

        {/* Full Academy Upsell */}
        <MarketingSection tone="ivory" spacing="spacious" reveal={false}>
          <RevealOnScroll>
            <AcademyUpsellCard />
          </RevealOnScroll>
        </MarketingSection>

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
