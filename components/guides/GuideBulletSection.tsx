import GuideEditorialImage from '@/components/guides/GuideEditorialImage';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import GuideInkBadge from '@/components/guides/GuideInkBadge';
import {
  GUIDE_SECTION_FRAME_CLASSNAME,
  GUIDE_SUPPORT_CARD_CLASSNAME,
  GuideSectionHeading,
} from '@/components/guides/GuidePrimitives';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

function getSectionAnnotation({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow?: string;
}) {
  const normalized = `${eyebrow ?? ''} ${title}`.toLowerCase();

  if (normalized.includes('editorial intro') || normalized.includes('orientation')) {
    return {
      badge: 'read this first',
      noteTitle: 'Read for the shape of the decision first.',
      noteBody:
        'You are not trying to collect every detail on the first pass. You are trying to see what changes the next move.',
      noteTone: 'blush' as const,
      showPlaceholderImage: true,
      imageEyebrow: 'Editorial image placeholder',
      imageCaption: 'Placeholder image: add the editorial visual that helps this section feel grounded in real life.',
    };
  }

  if (normalized.includes('common mistakes') || normalized.includes('what people get wrong')) {
    return {
      badge: 'circle this',
      noteTitle: 'Most mistakes start with the wrong order.',
      noteBody:
        'When a category feels harder than it should, it is usually because the page got treated like a product hunt before it got used like a guide.',
      noteTone: 'white' as const,
      showPlaceholderImage: false,
    };
  }

  if (normalized.includes('how to use')) {
    return {
      badge: 'margin note',
      noteTitle: 'Use the guide like a map, not homework.',
      noteBody:
        'The goal is not to finish every panel. The goal is to leave with one cleaner decision than you had when you arrived.',
      noteTone: 'linen' as const,
      showPlaceholderImage: false,
    };
  }

  if (normalized.includes('keep in mind')) {
    return {
      badge: 'keep this',
      noteTitle: 'These are the parts worth carrying forward.',
      noteBody:
        'If the page did its job, you should leave with fewer open loops, not a stronger urge to keep doom-scrolling.',
      noteTone: 'linen' as const,
      showPlaceholderImage: false,
    };
  }

  return {
    badge: 'tmbc note',
    noteTitle: 'Take the part that makes the next step easier.',
    noteBody:
      'You do not need to squeeze every sentence for value. Keep the part that lowers the noise and leave the rest for later.',
    noteTone: 'white' as const,
    showPlaceholderImage: false,
  };
}

export default function GuideBulletSection({
  title,
  description,
  items,
  eyebrow,
  editorialImage,
}: {
  title: string;
  description?: string;
  items: string[];
  eyebrow?: string;
  editorialImage?: {
    eyebrow?: string;
    src: string;
    alt: string;
    caption: string;
  };
}) {
  if (items.length === 0) {
    return null;
  }

  const annotation = getSectionAnnotation({ title, eyebrow });

  return (
    <RevealOnScroll>
      <section className={GUIDE_SECTION_FRAME_CLASSNAME}>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <GuideSectionHeading eyebrow={eyebrow ?? title} title={title} description={description} />

          <GuideInkBadge label={annotation.badge} size="annotation" className="mt-0 shrink-0 sm:mt-[-0.35rem]" />
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {items.map((item) => (
            <div
              key={item}
              className={`${GUIDE_SUPPORT_CARD_CLASSNAME} border-[rgba(215,161,175,0.14)] px-4 py-4`}
            >
              <p className="text-[1.04rem] leading-8 text-[#4B3641] md:text-[1.08rem]">{item}</p>
            </div>
          ))}
        </div>

        {annotation.showPlaceholderImage || editorialImage ? (
          <div className="mt-6">
            <GuideEditorialImage
              eyebrow={editorialImage?.eyebrow ?? annotation.imageEyebrow}
              src={editorialImage?.src ?? '/assets/placeholders/tmbc-guide-image-placeholder.svg'}
              alt={editorialImage?.alt ?? 'Placeholder editorial image'}
              caption={
                editorialImage?.caption ??
                annotation.imageCaption ??
                'Placeholder image: add the editorial visual that supports this section.'
              }
            />
          </div>
        ) : null}

        <GuideHandwrittenNote
          className="mt-6"
          tone={annotation.noteTone}
          size="compact"
          title={annotation.noteTitle}
          description={<p>{annotation.noteBody}</p>}
        />
      </section>
    </RevealOnScroll>
  );
}
