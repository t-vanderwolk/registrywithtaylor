import AcademyHero from '@/components/guides/academy/AcademyHero';
import GuideInkBadge from '@/components/guides/GuideInkBadge';
import { resolveGuideHeroImage } from '@/lib/guides/heroImages';
import type { GuideHeroJumpLink } from '@/lib/guides/hubs';

function normalizeGuideContext(value: string) {
  return value.toLowerCase();
}

function getGuideHeroNotes({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  const context = normalizeGuideContext(`${eyebrow} ${title}`);
  const isRegistryGuide = context.includes('registry');
  const isNurseryGuide = context.includes('nursery');
  const isStrollerGuide = context.includes('stroller');
  const isCarSeatGuide = context.includes('car seat');

  if (isRegistryGuide) {
    return {
      noteBody:
        'Registry is usually the organizing layer. Once it is clear what belongs now, what can wait, and what does not need a place at all, the rest of the prep work behaves a little better.',
      imageBadge: 'begin here',
      imageNote: 'This is the page that makes the rest easier to sort.',
    };
  }

  if (isNurseryGuide) {
    return {
      noteBody:
        'If the whole prep plan still feels scattered, go back and start with Registry first. The room gets easier once the bigger list has already stopped shouting.',
      imageBadge: 'after registry',
      imageNote: 'Room decisions land better once the registry logic is steadier.',
    };
  }

  if (isStrollerGuide || isCarSeatGuide) {
    return {
      noteBody:
        'These categories matter, but they do not need to go first when the whole plan is still fuzzy. Start with Registry if you need the broad structure, then come back here to narrow the gear decision.',
      imageBadge: 'use after registry',
      imageNote: 'Gear is easier to compare once the broader plan already has shape.',
    };
  }

  return {
    noteBody:
      'This guide can still help, but Registry is usually the cleaner first move when every category feels equally urgent. Then use this page once the next decision is actually the next decision.',
    imageBadge: 'registry first',
    imageNote: 'Come here after the first layer of planning has settled down.',
  };
}

export default function GuideHero({
  slug,
  eyebrow,
  category,
  title,
  description,
  readTime,
  publishedLabel,
  sectionCount,
  jumpLinks,
  topicCluster,
  imageSrc,
  imageAlt,
  variant = 'default',
  parentLink,
}: {
  slug?: string;
  eyebrow: string;
  category?: string | null;
  title: string;
  description: string;
  readTime: string;
  publishedLabel?: string;
  sectionCount?: number;
  jumpLinks: GuideHeroJumpLink[];
  topicCluster?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  variant?: 'default' | 'guide-hub' | 'stroller-hub' | 'stroller-category';
  parentLink?: {
    href: string;
    label: string;
  } | null;
}) {
  const displayTitle = variant === 'stroller-hub' ? 'The Taylor-Made Stroller Guide' : title;
  const isEditorialStrollerLayout =
    variant === 'guide-hub' || variant === 'stroller-hub' || variant === 'stroller-category';
  const resolvedHeroImage = resolveGuideHeroImage({
    slug,
    title: displayTitle,
    category: category ?? eyebrow,
    topicCluster,
    imageSrc,
    imageAlt,
  });
  const showHeroImage = Boolean(resolvedHeroImage.src && variant !== 'stroller-category');
  const heroImageClassName = isEditorialStrollerLayout
    ? 'object-cover object-[72%_center]'
    : 'object-cover object-[74%_center]';
  const heroNotes = getGuideHeroNotes({ eyebrow, title: displayTitle });
  const stats = [
    { label: 'Read time', value: readTime },
    ...(publishedLabel ? [{ label: 'Published', value: publishedLabel }] : []),
    ...(sectionCount ? [{ label: 'Sections', value: String(sectionCount) }] : []),
  ];
  const stageItems = jumpLinks.map((link, index) => ({
    id: `guide-stage-${index + 1}`,
    label: String(index + 1).padStart(2, '0'),
    title: link.label,
    description: 'Jump into this part of the guide next.',
    href: link.href,
  }));
  const primaryCta = jumpLinks[0]
    ? {
        href: jumpLinks[0].href,
        label: jumpLinks[0].label,
      }
    : undefined;
  const secondaryCta = jumpLinks[1]
    ? {
        href: jumpLinks[1].href,
        label: jumpLinks[1].label,
      }
    : parentLink
      ? {
          href: parentLink.href,
          label: parentLink.label,
        }
      : undefined;

  return (
    <section className="bg-[linear-gradient(180deg,#FBF7F8_0%,#FFFFFF_100%)]">
      <div className="mx-auto w-full max-w-[1520px] px-6 pb-12 pt-20 md:px-10 md:pb-16 md:pt-24 xl:px-12">
        <AcademyHero
          eyebrow={eyebrow}
          title={displayTitle}
          description={description}
          note={heroNotes.noteBody}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
          stageItems={stageItems}
          stats={stats}
          parentLink={parentLink ? { href: parentLink.href, label: parentLink.label } : undefined}
          imageSrc={showHeroImage ? resolvedHeroImage.src : undefined}
          imageAlt={resolvedHeroImage.alt}
          imageAspectClassName="aspect-[16/11]"
          imageObjectClassName={heroImageClassName}
          imagePriority
          imageOverlaySlot={
            showHeroImage ? (
              <>
                <div className="absolute left-3 top-3 z-[2] md:left-4 md:top-4">
                  <GuideInkBadge label={heroNotes.imageBadge} className="bg-white/84" />
                </div>

                <div className="pointer-events-none absolute bottom-3 right-3 z-[2] max-w-[13rem] rotate-[-4deg] rounded-[1rem] border border-[#D986A2]/20 bg-white/88 px-3 py-2 shadow-[0_12px_26px_rgba(58,36,43,0.08)] md:bottom-4 md:right-4">
                  <p
                    className="text-[1rem] leading-[1.05] text-[#B86584]"
                    style={{ fontFamily: '"Caveat", cursive' }}
                  >
                    {heroNotes.imageNote}
                  </p>
                </div>
              </>
            ) : undefined
          }
        />
      </div>
    </section>
  );
}
