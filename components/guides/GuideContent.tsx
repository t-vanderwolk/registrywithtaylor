import { ReactNode } from 'react';
import GuideSection from './GuideSection';
import FeatureCard from './FeatureCard';
import GuideProductGrid from './GuideProductGrid';
import PostContent from '@/components/blog/PostContent';

interface GuideContentProps {
  postId: string;
  content: string;
  className?: string;
  highlightBrandWordmark?: boolean;
}

export default function GuideContent({
  postId,
  content,
  className,
  highlightBrandWordmark
}: GuideContentProps) {
  // Split content into sections based on H2 headings
  const sections = parseGuideSections(content);

  return (
    <div className={className}>
      {sections.map((section, index) => (
        <GuideSection
          key={index}
          title={section.title}
          id={section.id}
        >
          <GuideSectionContent
            postId={postId}
            content={section.content}
            highlightBrandWordmark={highlightBrandWordmark}
          />
        </GuideSection>
      ))}
    </div>
  );
}

function parseGuideSections(content: string) {
  const lines = content.split('\n');
  const sections: Array<{ title: string; id: string; content: string }> = [];
  let currentSection: { title: string; id: string; content: string[] } | null = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      // Save previous section if exists
      if (currentSection) {
        sections.push({
          title: currentSection.title,
          id: currentSection.id,
          content: currentSection.content.join('\n')
        });
      }

      // Start new section
      const title = line.replace(/^##\s+/, '').trim();
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      currentSection = {
        title,
        id,
        content: []
      };
    } else if (currentSection) {
      currentSection.content.push(line);
    } else {
      // Content before first H2
      if (sections.length === 0) {
        sections.push({
          title: '',
          id: '',
          content: line
        });
      } else {
        sections[sections.length - 1].content += '\n' + line;
      }
    }
  }

  // Save last section
  if (currentSection) {
    sections.push({
      title: currentSection.title,
      id: currentSection.id,
      content: currentSection.content.join('\n')
    });
  }

  return sections;
}

function GuideSectionContent({
  postId,
  content,
  highlightBrandWordmark
}: {
  postId: string;
  content: string;
  highlightBrandWordmark?: boolean;
}) {
  // Process content for education-specific transformations
  const processedElements = processGuideContent(content);

  return (
    <>
      {processedElements.map((element, index) => {
        if (element.type === 'section' && element.title && element.content) {
          return (
            <GuideSection key={index} title={element.title}>
              <PostContent
                postId={postId}
                content={element.content}
                variant="guide"
                highlightBrandWordmark={highlightBrandWordmark}
              />
            </GuideSection>
          );
        }

        return (
          <PostContent
            key={index}
            postId={postId}
            content={element.content || ''}
            variant="guide"
            highlightBrandWordmark={highlightBrandWordmark}
          />
        );
      })}
    </>
  );
}

function processGuideContent(content: string): Array<{ type: 'content' | 'feature-cards' | 'section'; content?: string; items?: Array<{ title: string; description: string }>; title?: string }> {
  const lines = content.split('\n');
  const elements: Array<{ type: 'content' | 'feature-cards' | 'section'; content?: string; items?: Array<{ title: string; description: string }>; title?: string }> = [];
  let currentContent: string[] = [];
  let currentSectionTitle = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for H2 headings
    if (line.startsWith('## ')) {
      // Save any accumulated content as a section
      if (currentContent.length > 0) {
        elements.push({
          type: 'section',
          title: currentSectionTitle,
          content: currentContent.join('\n')
        });
        currentContent = [];
      }

      // Start new section
      currentSectionTitle = line.substring(3).trim();
    }
    // Check for bullet lists (3+ items)
    else if ((line.startsWith('- ') || line.startsWith('* ')) && isPartOfList(lines, i)) {
      // Save any accumulated content
      if (currentContent.length > 0) {
        elements.push({
          type: 'content',
          content: currentContent.join('\n')
        });
        currentContent = [];
      }

      // Extract the list
      const listItems = extractListItems(lines, i);
      const featureCards = listItems.map(item => {
        const colonIndex = item.indexOf(':');
        if (colonIndex > 0) {
          return {
            title: item.substring(0, colonIndex).trim(),
            description: item.substring(colonIndex + 1).trim()
          };
        }
        return {
          title: item,
          description: ''
        };
      });

      elements.push({
        type: 'feature-cards',
        items: featureCards
      });

      // Skip the processed list items
      i += listItems.length - 1;
    } else {
      currentContent.push(line);
    }
  }

  // Add any remaining content as a section
  if (currentContent.length > 0) {
    elements.push({
      type: 'section',
      title: currentSectionTitle,
      content: currentContent.join('\n')
    });
  }

  return elements;
}

function isPartOfList(lines: string[], startIndex: number): boolean {
  let count = 0;
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.startsWith('- ') || line.startsWith('* ')) {
      count++;
      i++;
    } else if (line === '') {
      i++;
    } else {
      break;
    }
  }

  return count >= 3;
}

function extractListItems(lines: string[], startIndex: number): string[] {
  const items: string[] = [];
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.startsWith('- ') || line.startsWith('* ')) {
      items.push(line.substring(2));
      i++;
    } else if (line === '') {
      i++;
    } else {
      break;
    }
  }

  return items;
}