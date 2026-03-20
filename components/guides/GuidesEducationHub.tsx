import CategoryGrid from '@/components/guides/CategoryGrid';
import GuideContinueExploring from '@/components/guides/GuideContinueExploring';
import GuidesLearningPath from '@/components/guides/GuidesLearningPath';
import HubDecisionCards from '@/components/guides/HubDecisionCards';
import HubHero from '@/components/guides/HubHero';
import { guidesEducationHubContent } from '@/lib/guides/educationHub';

export default function GuidesEducationHub() {
  const jumpLinks = [
    { href: '#guides-start-here', label: 'Start here' },
    { href: '#guides-category-hubs', label: 'Category hubs' },
    { href: '#guides-learning-path', label: 'How it works' },
    { href: '#guides-helpful-now', label: 'Helpful now' },
  ];

  return (
    <>
      <HubHero
        eyebrow={guidesEducationHubContent.hero.eyebrow}
        title={guidesEducationHubContent.hero.title}
        description={guidesEducationHubContent.hero.description}
        note={guidesEducationHubContent.hero.note}
        stats={guidesEducationHubContent.hero.stats}
        highlights={guidesEducationHubContent.hero.highlights}
        jumpLinks={jumpLinks}
      />

      <section className="bg-[var(--tmbc-blog-ivory)]">
        <div className="mx-auto max-w-[1300px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
          <div className="space-y-6 sm:space-y-8 lg:space-y-16">
            <HubDecisionCards
              id="guides-start-here"
              eyebrow={guidesEducationHubContent.startHere.eyebrow}
              title={guidesEducationHubContent.startHere.title}
              description={guidesEducationHubContent.startHere.description}
              cards={guidesEducationHubContent.startHere.cards}
            />

            <CategoryGrid
              id="guides-category-hubs"
              eyebrow={guidesEducationHubContent.categoryGrid.eyebrow}
              title={guidesEducationHubContent.categoryGrid.title}
              description={guidesEducationHubContent.categoryGrid.description}
              cards={guidesEducationHubContent.categoryGrid.cards}
              bestForLabel="What you'll learn"
            />

            <GuidesLearningPath
              id="guides-learning-path"
              eyebrow={guidesEducationHubContent.learningPath.eyebrow}
              title={guidesEducationHubContent.learningPath.title}
              description={guidesEducationHubContent.learningPath.description}
              steps={guidesEducationHubContent.learningPath.steps}
            />

            <GuideContinueExploring
              id="guides-helpful-now"
              title={guidesEducationHubContent.featured.title}
              description={guidesEducationHubContent.featured.description}
              links={guidesEducationHubContent.featured.links}
            />
          </div>
        </div>
      </section>
    </>
  );
}
