import AcademyHero from '@/components/guides/academy/AcademyHero';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { resolveGuideHeroImage } from '@/lib/guides/heroImages';

type HubHeroStat = {
  label: string;
  value: string;
};

type HubHeroHighlight = {
  label: string;
  text: string;
};

type HubHeroJumpLink = {
  href: string;
  label: string;
};

type HubHeroParentLink = {
  href: string;
  label: string;
};

export default function HubHero({
  slug,
  eyebrow,
  title,
  description,
  note,
  stats = [],
  highlights = [],
  jumpLinks = [],
  parentLink,
  imageSrc,
  imageAlt,
  category,
  topicCluster,
}: {
  slug?: string;
  eyebrow: string;
  title: string;
  description: string;
  note?: string | null;
  stats?: HubHeroStat[];
  highlights?: HubHeroHighlight[];
  jumpLinks?: HubHeroJumpLink[];
  parentLink?: HubHeroParentLink | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  category?: string | null;
  topicCluster?: string | null;
}) {
  const stageItems = jumpLinks.map((link, index) => ({
    id: `hub-stage-${index + 1}`,
    label: String(index + 1).padStart(2, '0'),
    title: link.label,
    description: 'Jump into this part of the Academy path next.',
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
  const resolvedHeroImage = resolveGuideHeroImage({
    slug,
    title,
    category: category ?? eyebrow,
    topicCluster,
    imageSrc,
    imageAlt,
  });

  return (
    <section className="bg-[linear-gradient(180deg,#FBF7F8_0%,#FFFFFF_100%)]">
      <div className="mx-auto w-full max-w-[1520px] px-6 pb-12 pt-20 md:px-10 md:pb-16 md:pt-24 xl:px-12">
        <RevealOnScroll>
          <div className="space-y-6">
            <AcademyHero
              eyebrow={eyebrow}
              title={title}
              description={description}
              note={note ?? undefined}
              primaryCta={primaryCta}
              secondaryCta={secondaryCta}
              stageItems={stageItems}
              stats={stats}
              parentLink={parentLink ? { href: parentLink.href, label: parentLink.label } : undefined}
              imageSrc={resolvedHeroImage.src}
              imageAlt={resolvedHeroImage.alt}
              imageAspectClassName="aspect-[16/11]"
              imageObjectClassName="object-cover object-[74%_center]"
              imagePriority
            />

            {highlights.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                {highlights.map((highlight, index) => (
                  <RevealOnScroll key={`${highlight.label}-${index}`} delayMs={index * 70}>
                    <div className="h-full rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-5 shadow-[0_18px_55px_rgba(58,36,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(58,36,43,0.12)]">
                      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">{highlight.label}</p>
                      <p className="mt-3 text-base leading-8 text-[#5B4B55]">{highlight.text}</p>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            ) : null}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
