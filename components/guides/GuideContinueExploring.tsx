import type { GuideHubLink } from '@/lib/guides/hubs';
import {
  GUIDE_SECTION_FRAME_CLASSNAME,
  GuideRouteCard,
  GuideSectionHeading,
} from '@/components/guides/GuidePrimitives';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

export default function GuideContinueExploring({
  id,
  title,
  description,
  links,
}: {
  id?: string;
  title: string;
  description?: string;
  links: GuideHubLink[];
}) {
  if (links.length === 0) {
    return null;
  }

  return (
    <RevealOnScroll>
      <section id={id} className={GUIDE_SECTION_FRAME_CLASSNAME}>
        <GuideSectionHeading eyebrow="Continue exploring" title={title} description={description} titleAs="h3" />

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {links.map((link) => (
            <GuideRouteCard
              key={`${link.href}-${link.title}`}
              href={link.href}
              title={link.title}
              description={link.description}
              icon={link.icon}
              eyebrow="Next read"
            />
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
