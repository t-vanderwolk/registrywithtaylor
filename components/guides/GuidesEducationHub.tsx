import CategoryGrid from '@/components/guides/CategoryGrid';
import GuideContinueExploring from '@/components/guides/GuideContinueExploring';
import GuideSlideDeck from '@/components/guides/GuideSlideDeck';
import GuidesLearningPath from '@/components/guides/GuidesLearningPath';
import HubDecisionCards from '@/components/guides/HubDecisionCards';
import HubHero from '@/components/guides/HubHero';
import SlideSection from '@/components/guides/SlideSection';
import { guidesEducationHubContent } from '@/lib/guides/educationHub';

export default function GuidesEducationHub() {
  const slideDeckId = 'guide-slide-deck-guides-hub';
  const jumpLinks = [
    { href: '#guides-start-here', label: 'Start here' },
    { href: '#guides-category-hubs', label: 'Category hubs' },
    { href: '#guides-learning-path', label: 'How it works' },
    { href: '#guides-helpful-now', label: 'Helpful now' },
  ];
  const slideItems = [
    { id: 'guides-overview', label: 'Overview', shortLabel: 'Start' },
    { id: 'guides-start-here', label: 'Start Here', shortLabel: 'Path' },
    { id: 'guides-category-hubs', label: 'Category Hubs', shortLabel: 'Hubs' },
    { id: 'guides-learning-path', label: 'How It Works', shortLabel: 'Flow' },
    { id: 'guides-helpful-now', label: 'Helpful Now', shortLabel: 'Now' },
  ];

  return (
    <GuideSlideDeck containerId={slideDeckId} items={slideItems}>
      <SlideSection id="guides-overview" background="ivory" innerClassName="max-w-none px-0 py-0">
        <HubHero
          eyebrow={guidesEducationHubContent.hero.eyebrow}
          title={guidesEducationHubContent.hero.title}
          description={guidesEducationHubContent.hero.description}
          note={guidesEducationHubContent.hero.note}
          stats={guidesEducationHubContent.hero.stats}
          highlights={guidesEducationHubContent.hero.highlights}
          jumpLinks={jumpLinks}
        />
      </SlideSection>

      <SlideSection id="guides-start-here" background="white">
        <HubDecisionCards
          eyebrow={guidesEducationHubContent.startHere.eyebrow}
          title={guidesEducationHubContent.startHere.title}
          description={guidesEducationHubContent.startHere.description}
          cards={guidesEducationHubContent.startHere.cards}
        />
      </SlideSection>

      <SlideSection id="guides-category-hubs" background="blush">
        <CategoryGrid
          eyebrow={guidesEducationHubContent.categoryGrid.eyebrow}
          title={guidesEducationHubContent.categoryGrid.title}
          description={guidesEducationHubContent.categoryGrid.description}
          cards={guidesEducationHubContent.categoryGrid.cards}
          bestForLabel="What you'll learn"
        />
      </SlideSection>

      <SlideSection id="guides-learning-path" background="ivory">
        <GuidesLearningPath
          eyebrow={guidesEducationHubContent.learningPath.eyebrow}
          title={guidesEducationHubContent.learningPath.title}
          description={guidesEducationHubContent.learningPath.description}
          steps={guidesEducationHubContent.learningPath.steps}
        />
      </SlideSection>

      <SlideSection id="guides-helpful-now" background="white">
        <GuideContinueExploring
          title={guidesEducationHubContent.featured.title}
          description={guidesEducationHubContent.featured.description}
          links={guidesEducationHubContent.featured.links}
        />
      </SlideSection>
    </GuideSlideDeck>
  );
}
