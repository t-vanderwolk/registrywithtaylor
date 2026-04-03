import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import ConnectedContentSection from '@/components/content/ConnectedContentSection';
import GuideBreadcrumbs from '@/components/guides/GuideBreadcrumbs';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import type { AcademyBreadcrumbItem, AcademyModuleSlug, AcademyPathSlug } from '@/lib/academy/content';
import {
  buildAcademyBreadcrumbStructuredData,
  buildAcademyCollectionStructuredData,
} from '@/lib/academy/seo';
import { renderTextWithInternalLinks } from '@/lib/internal-links/render';
import { buildAcademyInternalLinkPlan } from '@/lib/internal-links/system';

export type AcademyModuleHubCard = {
  href: string;
  title: string;
  description: string;
  ctaLabel: string;
  eyebrow?: string;
};

type AcademyModuleHubProps = {
  pathSlug: AcademyPathSlug;
  moduleSlug: AcademyModuleSlug;
  breadcrumbs: AcademyBreadcrumbItem[];
  heroEyebrow: string;
  title: string;
  deck: string;
  intro: string[];
  heroImageSrc: string;
  heroImageAlt: string;
  pullQuote: string;
  progress: {
    current: number;
    total: number;
    label: string;
  };
  learningTitle: string;
  learningDescription: string;
  learningHighlights: string[];
  philosophyTitle: string;
  philosophy: string[];
  philosophyNoteTitle: string;
  philosophyNoteBody: string;
  submodulesTitle: string;
  submodulesDescription: string;
  submoduleCards: AcademyModuleHubCard[];
  guidanceEyebrow: string;
  guidanceTitle: string;
  guidanceDescription: string;
  guidanceLines: string[];
  taylorNoteTitle: string;
  taylorNoteBody: string;
  nextTitle: string;
  nextDescription: string;
  nextLinks: AcademyModuleHubCard[];
  primaryCta: {
    href: string;
    label: string;
  };
  secondaryCta: {
    href: string;
    label: string;
  };
};

function LinkCard({
  href,
  eyebrow,
  title,
  description,
  ctaLabel,
}: AcademyModuleHubCard) {
  return (
    <Link
      href={href}
      className="group flex h-full min-w-0 flex-col rounded-[1.7rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,247,250,0.92)_100%)] p-5 shadow-[0_20px_48px_rgba(58,36,43,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(161,91,114,0.28)] hover:shadow-[0_28px_62px_rgba(58,36,43,0.12)] sm:p-6"
    >
      {eyebrow ? <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">{eyebrow}</p> : null}
      <h3 className="mt-4 break-words font-serif text-[1.55rem] leading-[1.04] tracking-[-0.04em] text-[#2F2430] sm:text-[1.75rem]">
        {title}
      </h3>
      <p className="mt-4 break-words text-[1rem] leading-8 text-[#5B4B55]">{description}</p>
      <span className="mt-auto pt-6 text-sm font-medium uppercase tracking-[0.16em] text-[#8F4C62] transition duration-200 group-hover:translate-x-1">
        {ctaLabel}
      </span>
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl min-w-0">
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">{eyebrow}</p>
      <h2 className="mt-4 break-words font-serif text-[2rem] leading-[0.98] tracking-[-0.05em] text-[#2F2430] sm:text-[2.65rem]">
        {title}
      </h2>
      {description ? <p className="mt-4 break-words text-[1rem] leading-8 text-[#5B4B55] sm:text-[1.05rem]">{description}</p> : null}
    </div>
  );
}

function formatInlineList(items: string[]) {
  if (items.length === 0) {
    return '';
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function renderLinkedParagraphs(
  paragraphs: string[],
  suggestions: ReturnType<typeof buildAcademyInternalLinkPlan>['contextualLinks'],
  keyPrefix: string,
  paragraphClassName = 'break-words',
): ReactNode[] {
  const usedHrefs = new Set<string>();

  return paragraphs.map((paragraph, index) => (
    <p key={`${keyPrefix}-${index}`} className={paragraphClassName}>
      {renderTextWithInternalLinks({
        text: paragraph,
        suggestions,
        usedHrefs,
        keyPrefix: `${keyPrefix}-${index}`,
        maxLinks: 1,
        className: 'link-underline transition-colors duration-200 hover:text-neutral-900',
        placement: 'academy',
      })}
    </p>
  ));
}

export default function AcademyModuleHub({
  pathSlug,
  moduleSlug,
  breadcrumbs,
  heroEyebrow,
  title,
  deck,
  intro,
  heroImageSrc,
  heroImageAlt,
  pullQuote,
  progress,
  learningTitle,
  learningDescription,
  learningHighlights,
  philosophyTitle,
  philosophy,
  philosophyNoteTitle,
  philosophyNoteBody,
  submodulesTitle,
  submodulesDescription,
  submoduleCards,
  guidanceEyebrow,
  guidanceTitle,
  guidanceDescription,
  guidanceLines,
  taylorNoteTitle,
  taylorNoteBody,
  nextTitle,
  nextDescription,
  nextLinks,
  primaryCta,
  secondaryCta,
}: AcademyModuleHubProps) {
  const modulePath = `/academy/${pathSlug}/${moduleSlug}`;
  const moduleOverviewLine = `Inside this module: ${formatInlineList(
    submoduleCards.map((card) => card.title).slice(0, 4),
  )}.`;
  const pathLink =
    breadcrumbs.find((item) => item.href === `/academy/${pathSlug}`) ??
    breadcrumbs.find((item) => item.href?.startsWith('/academy/') && item.href !== '/academy' && item.href !== modulePath) ??
    null;
  const academyConnections = Array.from(
    new Map(
      [
        pathLink
          ? {
              href: pathLink.href!,
              title: pathLink.label,
              description: `Go back to the wider ${pathLink.label} path if you want the bigger sequence around this module.`,
              ctaLabel: 'View path ->',
              eyebrow: 'Path',
            }
          : null,
        ...nextLinks.map((link, index) => ({
          ...link,
          eyebrow: link.eyebrow ?? (index === 0 ? 'Next' : 'Related'),
        })),
      ]
        .flatMap((card) => (card ? [[card.href, card] as const] : [])),
    ).values(),
  );
  const internalLinkPlan = buildAcademyInternalLinkPlan({
    href: modulePath as `/${string}`,
    pathSlug,
    slug: moduleSlug,
    title,
    description: deck,
  });
  const structuredData = [
    buildAcademyBreadcrumbStructuredData({
      breadcrumbs,
      currentPath: modulePath,
    }),
    buildAcademyCollectionStructuredData({
      title,
      description: deck,
      path: modulePath,
      breadcrumbs,
      items: submoduleCards.map((card) => ({
        href: card.href,
        title: card.title,
        description: card.description,
      })),
      keywords: [
        heroEyebrow,
        learningTitle,
        ...learningHighlights.slice(0, 5),
      ],
    }),
  ];

  return (
    <section className="min-h-0 bg-[radial-gradient(circle_at_top_left,rgba(244,224,209,0.7),transparent_30%),radial-gradient(circle_at_top_right,rgba(232,154,174,0.2),transparent_28%),linear-gradient(180deg,#fffdfa_0%,#fcf3f5_34%,#fffdf8_100%)]">
      <AcademyStructuredData data={structuredData} />
      <div className="mx-auto max-w-6xl px-5 pb-8 pt-10 sm:px-8 md:pb-10 md:pt-14 lg:px-10">
        <GuideBreadcrumbs items={breadcrumbs} />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-10 sm:px-8 md:pb-12 lg:px-10">
        <section className="overflow-hidden rounded-[2.15rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,252,253,0.98)_0%,rgba(252,243,246,0.97)_45%,rgba(249,241,233,0.96)_100%)] shadow-[0_28px_72px_rgba(58,36,43,0.1)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)]">
            <div className="min-w-0 px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">{heroEyebrow}</p>
              <h1 className="mt-4 max-w-[10ch] break-words font-serif text-[2.2rem] leading-[0.92] tracking-[-0.06em] text-[#2F2430] sm:text-[4rem]">
                {title}
              </h1>
              <p className="mt-5 max-w-[42rem] break-words text-[1rem] leading-8 text-[#4B3641] sm:text-[1.18rem] sm:leading-9">
                {deck}
              </p>
              <p className="mt-4 max-w-[42rem] break-words text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1.02rem]">
                {moduleOverviewLine}
              </p>

              <div className="mt-6 max-w-[44rem] space-y-4 text-[1rem] leading-8 text-[#5B4B55] sm:text-[1.04rem]">
                {renderLinkedParagraphs(intro, internalLinkPlan.contextualLinks, `${moduleSlug}-hub-intro`)}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={primaryCta.href}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#A15B72] px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62]"
                >
                  {primaryCta.label}
                </Link>
                <Link
                  href={secondaryCta.href}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/92 px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(58,36,43,0.08)]"
                >
                  {secondaryCta.label}
                </Link>
              </div>
            </div>

            <div className="min-w-0 border-t border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,#fdf7f8_0%,#fffdf9_100%)] lg:border-l lg:border-t-0">
              <div className="relative aspect-[5/4] border-b border-[rgba(215,161,175,0.14)] bg-[linear-gradient(180deg,#f7efe6_0%,#f3e4dc_100%)]">
                <Image
                  src={heroImageSrc}
                  alt={heroImageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 34rem, 100vw"
                  className="object-contain p-6 sm:p-8"
                />
              </div>

              <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
                <div className="rounded-[1.45rem] border border-[rgba(215,161,175,0.18)] bg-white/88 p-5 shadow-[0_18px_34px_rgba(58,36,43,0.06)]">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Pull quote</p>
                  <p className="mt-3 break-words font-serif text-[1.38rem] leading-8 tracking-[-0.03em] text-[#4B3641]">{pullQuote}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.3rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Academy progress</p>
                    <p className="mt-2 text-base font-medium leading-7 text-[#2F2430]">
                      Module {progress.current} of {progress.total}
                    </p>
                  </div>
                  <div className="rounded-[1.3rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Inside this module</p>
                    <p className="mt-2 text-base font-medium leading-7 text-[#2F2430]">
                      {submoduleCards.length} focused submodules
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.55rem] border border-[rgba(215,161,175,0.16)] bg-white/84 px-5 py-5">
                  <AcademyProgressBar current={progress.current} total={progress.total} label={progress.label} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-12 sm:px-8 md:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] md:pb-16 lg:px-10">
        <section className="rounded-[1.85rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,248,251,0.92)_100%)] px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-8 sm:py-8">
          <SectionHeading eyebrow="What You'll Learn" title={learningTitle} description={learningDescription} />

          <ul className="mt-6 space-y-3">
            {learningHighlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-[1.2rem] border border-[rgba(215,161,175,0.14)] bg-[rgba(252,247,249,0.86)] px-4 py-4"
              >
                <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#D986A2]" />
                <span className="text-[1rem] leading-8 text-[#4B3641]">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[1.85rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,251,252,0.98)_0%,rgba(248,240,234,0.94)_100%)] px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-8 sm:py-8">
          <SectionHeading eyebrow="The TMBC Take" title={philosophyTitle} />

          <div className="mt-6 space-y-4 text-[1rem] leading-8 text-[#5B4B55]">
            {renderLinkedParagraphs(philosophy, internalLinkPlan.contextualLinks, `${moduleSlug}-hub-philosophy`)}
          </div>

          <GuideHandwrittenNote
            className="mt-6"
            tone="linen"
            size="compact"
            title={philosophyNoteTitle}
            description={<p>{philosophyNoteBody}</p>}
          />
        </section>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 md:pb-16 lg:px-10">
        <SectionHeading eyebrow="Submodules" title={submodulesTitle} description={submodulesDescription} />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {submoduleCards.map((card) => (
            <LinkCard key={card.href} {...card} />
          ))}
        </div>
      </div>

      {academyConnections.length > 0 ? (
        <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 md:pb-16 lg:px-10">
          <SectionHeading
            eyebrow="Keep Exploring"
            title="Keep this module connected in the Academy"
            description="These are the cleanest internal jumps when you want the wider path, the next module, or the bridge between this decision and the one it starts tugging on."
          />

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {academyConnections.map((card) => (
              <LinkCard key={`${moduleSlug}-${card.href}`} {...card} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 md:pb-16 lg:px-10">
        <ConnectedContentSection
          eyebrow="Keep The System Connected"
          title="Use the guide, the journal, or direct support when the next question changes"
          description="This module is one part of the bigger TMBC system. These are the best next stops when you want the wider decision map, a concrete example, or an advisor in the mix."
          cards={internalLinkPlan.journeyCards}
        />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 md:pb-16 lg:px-10">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
          <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,248,251,0.92)_100%)] px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-8 sm:py-8">
            <SectionHeading
              eyebrow={guidanceEyebrow}
              title={guidanceTitle}
              description={guidanceDescription}
            />

            <div className="mt-6 rounded-[1.6rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.86)] p-5 sm:p-6">
              <div className="space-y-3">
                {renderLinkedParagraphs(
                  guidanceLines,
                  internalLinkPlan.contextualLinks,
                  `${moduleSlug}-hub-guidance`,
                  'break-words text-[1.02rem] leading-8 text-[#4B3641] sm:text-[1.08rem] sm:leading-9',
                )}
              </div>
            </div>
          </div>

          <GuideHandwrittenNote
            title={taylorNoteTitle}
            description={<p>{taylorNoteBody}</p>}
            presentation="margin"
            showEyebrow
            eyebrow="Taylor's note"
          />
        </section>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 md:pb-24 lg:px-10">
        <SectionHeading eyebrow="Next Step" title={nextTitle} description={nextDescription} />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {nextLinks.map((card) => (
            <LinkCard key={card.href} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
