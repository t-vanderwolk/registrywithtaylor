import { ReactNode } from 'react';
import GuideHero from './GuideHero';
import GuideIntro from './GuideIntro';
import GuideDecisionHelper from './GuideDecisionHelper';
import GuideSection from './GuideSection';
import GuideProductGrid from './GuideProductGrid';
import GuideFAQ from './GuideFAQ';
import GuideTakeaways from './GuideTakeaways';
import GuideSidebarNav from './GuideSidebarNav';
import GuideContent from './GuideContent';

interface GuideEducationLayoutProps {
  children?: ReactNode;
  guide: {
    id: string;
    title: string;
    slug: string;
    category: string;
    content: string;
    affiliateModules: any[];
    faqItems: any[];
    founderSignatureEnabled?: boolean;
    founderSignatureText?: string;
    consultationCtaEnabled?: boolean;
    consultationCtaLabel?: string;
    newsletterCtaEnabled?: boolean;
    newsletterCtaHref?: string;
    newsletterCtaLabel?: string;
    nextStepCtaHref?: string;
    nextStepCtaLabel?: string;
    takeaways?: string[];
  };
  preview?: boolean;
}

export default function GuideEducationLayout({
  children,
  guide,
  preview = false,
}: GuideEducationLayoutProps) {
  // Extract sections from content for sidebar navigation
  const extractSections = (content: string) => {
    const lines = content.split('\n');
    const sections: Array<{ id: string; title: string; level: number }> = [];

    lines.forEach((line) => {
      const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const title = headingMatch[2].trim();
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        sections.push({ id, title, level });
      }
    });

    return sections;
  };

  const sections = extractSections(guide.content);
  return (
    <div className="guide-education-layout">
      <GuideHero
        eyebrow={guide.category}
        title={guide.title}
        description="A comprehensive guide to help you make the best choice for your family."
        readTime="10 min"
        publishedLabel="Updated guide"
        sectionCount={sections.length}
        jumpLinks={[]}
        imageSrc={undefined}
        imageAlt={guide.title}
        variant="default"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <GuideIntro guide={guide} />
            <GuideDecisionHelper
              title="What Actually Matters"
              description="Most parents focus on the wrong things. Here's what really determines success with this category."
              items={[]}
            />

            {/* Content sections will be rendered here */}
            <div className="guide-content-sections space-y-20">
              <GuideContent
                postId={guide.id}
                content={guide.content}
                highlightBrandWordmark={guide.category === 'Strollers'}
              />
            </div>

            <GuideProductGrid
              modules={guide.affiliateModules}
              guideId={guide.id}
              preview={preview}
            />

            <GuideFAQ items={guide.faqItems} />

            <GuideTakeaways items={guide.takeaways || []} />

            {guide.founderSignatureEnabled && guide.founderSignatureText && (
              <div className="bg-gradient-to-b from-blush-50 to-mauve-50 rounded-2xl border border-blush-200 p-8 mt-20">
                <p className="font-script text-3xl leading-none text-[var(--color-accent-dark)] mb-4">Taylor</p>
                <p className="text-sm leading-7 text-neutral-700">{guide.founderSignatureText}</p>
              </div>
            )}
          </div>

          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <GuideSidebarNav sections={sections} currentSection={undefined} />
          </div>
        </div>
      </div>
    </div>
  );
}