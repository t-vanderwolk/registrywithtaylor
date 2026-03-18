'use client';

import Link from 'next/link';
import { startTransition, useEffect, useId, useRef, useState } from 'react';
import PostContent from '@/components/blog/PostContent';
import Comparison from '@/components/content-widgets/Comparison';
import ProductCard from '@/components/content-widgets/ProductCard';
import GuideComparisonCards from '@/components/guides/GuideComparisonCards';
import GuideContinueExploring from '@/components/guides/GuideContinueExploring';
import GuideFaqAccordion, { type GuideFaqAccordionItem } from '@/components/guides/GuideFaqAccordion';
import GuideGlyph from '@/components/guides/GuideGlyph';
import type { ParsedStyledBlock } from '@/lib/blog/styledBlocks';
import { extractStyledBlocks, isStyledBlockStart, parseStyledBlock } from '@/lib/blog/styledBlocks';
import type { GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';
import { getGuidePath } from '@/lib/guides/routing';

type PlannerScenario = {
  id: string;
  label: string;
  icon: GuideHubIconKey;
  fitLabel: string;
  fitTone: 'yes' | 'maybe' | 'no';
  summary: string;
  signals: string[];
  priorities: string[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

type PriorityLens = {
  id: string;
  label: string;
  icon: GuideHubIconKey;
  verdict: string;
  tone: 'yes' | 'maybe' | 'no';
  summary: string;
  helpsWhen: string;
  watchout: string;
  href: string;
  ctaLabel: string;
};

type PlannerTopicCard = {
  id: string;
  eyebrow: string;
  title: string;
  content: string;
};

type PlannerTopicCompanion =
  | {
      kind: 'disclosure';
      text: string;
    }
  | {
      kind: 'continue';
      title: string;
      description?: string;
      links: GuideHubLink[];
    }
  | {
      kind: 'comparison';
      title: string;
      description?: string;
      cards: GuideHubLink[];
    };

export type CompactPlannerTopic = {
  id: string;
  label: string;
  title: string;
  summary: string;
  highlights: string[];
  overviewContent?: string;
  cards: PlannerTopicCard[];
  companions: PlannerTopicCompanion[];
  faqItems?: GuideFaqAccordionItem[];
};

const BEST_COMPACT_BLOG_PATH = '/blog/best-compact-strollers';
const FULL_SIZE_GUIDE_PATH = getGuidePath({ slug: 'full-size-modular-strollers' });
const TRAVEL_GUIDE_PATH = getGuidePath({ slug: 'travel-strollers' });

function buildPlannerScenarios(sourceRoute: string): PlannerScenario[] {
  return [
    {
      id: 'car-heavy',
      label: 'We are in and out of the car all day',
      icon: 'compact',
      fitLabel: 'Strong compact fit',
      fitTone: 'yes',
      summary:
        'When the stroller keeps getting folded, lifted, parked, and reopened, compact convenience usually earns its place very quickly.',
      signals: [
        'Load-in and load-out happen constantly.',
        'Most outings are quick errands, appointments, and short stops.',
        'The fold matters almost as much as the push.',
      ],
      priorities: ['Fold ease', 'Lift weight', 'Storage shape'],
      primaryHref: `${sourceRoute}#real-life-fit`,
      primaryLabel: 'Jump to Real-Life Fit',
      secondaryHref: BEST_COMPACT_BLOG_PATH,
      secondaryLabel: 'Read the compact shortlist',
    },
    {
      id: 'long-walks',
      label: 'We take longer neighborhood walks',
      icon: 'road',
      fitLabel: 'Proceed carefully',
      fitTone: 'maybe',
      summary:
        'Compact can still work here, but this is where parents often realize the smoother push and deeper comfort of full-size strollers matter more than the lighter fold.',
      signals: [
        'Walks are a real part of the week, not an occasional bonus.',
        'Rougher sidewalks or longer routes already feel important.',
        'You want the stroller to feel pleasant after a longer outing too.',
      ],
      priorities: ['Ride comfort', 'Seat comfort', 'Everyday ease'],
      primaryHref: FULL_SIZE_GUIDE_PATH,
      primaryLabel: 'Compare full-size strollers',
      secondaryHref: `${sourceRoute}#compact-vs-travel-strollers`,
      secondaryLabel: 'See the compact vs travel section',
    },
    {
      id: 'airport-heavy',
      label: 'We travel often',
      icon: 'plane',
      fitLabel: 'Sometimes you need the travel lane instead',
      fitTone: 'maybe',
      summary:
        'Compact and travel overlap, but they are not the same conversation. If flights, transit, and the smallest possible fold keep showing up, true travel-first design may win.',
      signals: [
        'Airport or transit movement is part of normal life.',
        'You care about the smallest possible fold.',
        'You are weighing carry ease more than everyday seat comfort.',
      ],
      priorities: ['Carry ease', 'Fold size', 'Travel readiness'],
      primaryHref: TRAVEL_GUIDE_PATH,
      primaryLabel: 'Compare travel strollers',
      secondaryHref: `${sourceRoute}#compact-vs-travel-strollers`,
      secondaryLabel: 'Review compact vs travel',
    },
    {
      id: 'small-space',
      label: 'Storage is tight and caregivers share the stroller',
      icon: 'storage',
      fitLabel: 'Another strong compact signal',
      fitTone: 'yes',
      summary:
        'Compact strollers often shine here because the easiest stroller to live with is usually the one everyone in the house can lift, store, and use without extra negotiation.',
      signals: [
        'Closet, entry, or trunk space is limited.',
        'Grandparents or other caregivers use the stroller too.',
        'You want less bulk without going fully travel-first.',
      ],
      priorities: ['Storage footprint', 'Shared ease', 'Daily convenience'],
      primaryHref: `${sourceRoute}#real-life-fit`,
      primaryLabel: 'See who this category helps',
      secondaryHref: BEST_COMPACT_BLOG_PATH,
      secondaryLabel: 'Read the compact shortlist',
    },
  ];
}

function buildPriorityLenses(sourceRoute: string): PriorityLens[] {
  return [
    {
      id: 'fold-lift',
      label: 'Fold + lift feel',
      icon: 'compact',
      verdict: 'Usually the main compact advantage',
      tone: 'yes',
      summary:
        'This category tends to justify itself here first. If the stroller is annoying to lift, store, or reset, compact design can remove more friction than one premium feature ever will.',
      helpsWhen: 'Your stroller gets folded and loaded constantly through the week.',
      watchout: 'Do not mistake a lighter spec sheet for an actually easier fold.',
      href: `${sourceRoute}#real-life-fit`,
      ctaLabel: 'See the real-life fit section',
    },
    {
      id: 'storage-shape',
      label: 'Storage footprint',
      icon: 'storage',
      verdict: 'One of the clearest compact wins',
      tone: 'yes',
      summary:
        'What matters is not just folded size. It is how the stroller fits the trunk, closet, hallway, and the person who has to move it.',
      helpsWhen: 'Home storage is limited or multiple caregivers need an easy setup.',
      watchout: 'A stroller can fold small and still be awkwardly shaped.',
      href: `${sourceRoute}#what-defines-a-compact-or-lightweight-stroller`,
      ctaLabel: 'Review what compact actually means',
    },
    {
      id: 'daily-comfort',
      label: 'Everyday comfort',
      icon: 'road',
      verdict: 'Important, but not unlimited',
      tone: 'maybe',
      summary:
        'The best compact strollers still need to feel pleasant enough for normal use. The category only stops making sense when comfort has been trimmed so far that you notice it every day.',
      helpsWhen: 'You want a compact stroller that can still handle regular errands and shorter walks comfortably.',
      watchout: 'If long walks or rough routes are constant, compact can start feeling too minimal.',
      href: FULL_SIZE_GUIDE_PATH,
      ctaLabel: 'Compare full-size comfort',
    },
    {
      id: 'travel-overlap',
      label: 'Travel overlap',
      icon: 'plane',
      verdict: 'Related, but not identical',
      tone: 'maybe',
      summary:
        'Many parents bounce between compact and travel because both sound small. The difference is whether you need easier everyday use or true airport-first portability.',
      helpsWhen: 'Flights, transit, or frequent travel are part of the stroller decision.',
      watchout: 'Do not buy a travel-first stroller if your real issue is ordinary daily convenience.',
      href: `${sourceRoute}#compact-vs-travel-strollers`,
      ctaLabel: 'Review compact vs travel',
    },
    {
      id: 'rougher-routes',
      label: 'Rougher routes',
      icon: 'terrain',
      verdict: 'Usually not the compact strong suit',
      tone: 'no',
      summary:
        'Compact strollers can absolutely handle normal daily life. They just stop feeling ideal when the route itself is rough enough that bigger wheels and deeper suspension would help more.',
      helpsWhen: 'The stroller mostly handles smooth sidewalks, stores, and quick local stops.',
      watchout: 'If gravel, broken sidewalks, and longer walks dominate the week, full-size usually feels calmer.',
      href: FULL_SIZE_GUIDE_PATH,
      ctaLabel: 'Compare full-size options',
    },
  ];
}

function toneClasses(tone: 'yes' | 'maybe' | 'no') {
  switch (tone) {
    case 'yes':
      return 'border-[rgba(143,182,154,0.28)] bg-[rgba(143,182,154,0.14)] text-[rgba(72,114,87,0.98)]';
    case 'no':
      return 'border-[rgba(217,134,162,0.28)] bg-[rgba(217,134,162,0.14)] text-[rgba(145,76,105,0.98)]';
    case 'maybe':
    default:
      return 'border-[rgba(196,156,94,0.26)] bg-[rgba(196,156,94,0.14)] text-[rgba(124,94,46,0.98)]';
  }
}

function getTopicIcon(topicId: string): GuideHubIconKey {
  switch (topicId) {
    case 'introduction':
      return 'compact';
    case 'why-this-category-feels-overwhelming':
      return 'strategy';
    case 'what-defines-a-compact-or-lightweight-stroller':
      return 'bag';
    case 'compact-vs-travel-strollers':
      return 'plane';
    case 'real-life-fit':
      return 'road';
    case 'expert-advice':
      return 'book';
    case 'product-examples':
      return 'bag';
    case 'common-mistakes-parents-make':
      return 'shield';
    case 'guide-faq':
      return 'checklist';
    case 'final-thoughts':
      return 'book';
    default:
      return 'book';
  }
}

function PlannerTopicCard({
  id,
  eyebrow,
  title,
  content,
  postId,
  className = '',
}: PlannerTopicCard & {
  postId: string;
  className?: string;
}) {
  return (
    <article
      id={id}
      className={`scroll-mt-28 rounded-[1.45rem] border border-stone-200/70 bg-[#fcfaf7] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.03)] sm:rounded-[1.6rem] sm:p-5 ${className}`.trim()}
    >
      <div className="space-y-2">
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
        <h4 className="font-serif text-[1.35rem] leading-[1.08] tracking-[-0.03em] text-neutral-900 sm:text-[1.5rem]">{title}</h4>
      </div>

      <div className="mt-4">
        <PostContent
          postId={postId}
          content={content}
          className="guide-post-content guide-hub-card-content"
          variant="plain"
          highlightBrandWordmark={true}
        />
      </div>
    </article>
  );
}

function TopicMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-[rgba(0,0,0,0.06)] bg-white/86 px-4 py-4">
      <p className="text-[0.64rem] uppercase tracking-[0.16em] text-black/42">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-neutral-900">{value}</p>
    </div>
  );
}

function PlannerDisclosureCard({ text }: { text: string }) {
  return (
    <div className="rounded-[1.75rem] border border-black/6 bg-white/90 p-5 text-sm leading-7 text-neutral-700">
      {text}
    </div>
  );
}

function stripStyledBlocksOfTypes(content: string, blockTypes: ParsedStyledBlock['type'][]) {
  const typesToStrip = new Set(blockTypes);
  const lines = content.split('\n');
  const keptLines: string[] = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index] ?? '';
    const trimmed = line.trim();

    if (!trimmed || !isStyledBlockStart(trimmed)) {
      keptLines.push(line);
      index += 1;
      continue;
    }

    const parsed = parseStyledBlock(lines, index);
    if (!parsed) {
      keptLines.push(line);
      index += 1;
      continue;
    }

    if (typesToStrip.has(parsed.block.type)) {
      index = parsed.nextIndex;
      continue;
    }

    keptLines.push(...lines.slice(index, parsed.nextIndex));
    index = parsed.nextIndex;
  }

  return keptLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function splitProductExampleContent(content: string) {
  const blocks = extractStyledBlocks(content);

  return {
    products: blocks.filter((block): block is Extract<ParsedStyledBlock, { type: 'product' }> => block.type === 'product'),
    comparisons: blocks.filter(
      (block): block is Extract<ParsedStyledBlock, { type: 'comparison' }> => block.type === 'comparison',
    ),
    narrative: stripStyledBlocksOfTypes(content, ['product', 'comparison']),
  };
}

function TopicCompanions({ companions }: { companions: PlannerTopicCompanion[] }) {
  if (companions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {companions.map((companion, index) => {
        switch (companion.kind) {
          case 'disclosure':
            return <PlannerDisclosureCard key={`disclosure-${index}`} text={companion.text} />;
          case 'continue':
            return (
              <GuideContinueExploring
                key={`continue-${index}`}
                title={companion.title}
                description={companion.description}
                links={companion.links}
              />
            );
          case 'comparison':
            return (
              <GuideComparisonCards
                key={`comparison-${index}`}
                title={companion.title}
                description={companion.description}
                cards={companion.cards}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function TopicNavigatorCard({
  topic,
  index,
  isActive,
  onSelect,
  buttonId,
  panelId,
}: {
  topic: CompactPlannerTopic;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  buttonId: string;
  panelId: string;
}) {
  const icon = getTopicIcon(topic.id);
  const previewItems =
    topic.highlights.length > 0
      ? topic.highlights.slice(0, 2)
      : topic.cards.length > 0
        ? topic.cards.slice(0, 2).map((card) => card.title)
        : topic.faqItems?.length
          ? [`${topic.faqItems.length} quick answers`]
          : [];

  return (
    <button
      id={buttonId}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      onClick={onSelect}
      className={`group flex h-full flex-col rounded-[1.45rem] border p-4 text-left transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)] sm:rounded-[1.6rem] sm:p-5 ${
        isActive
          ? 'border-[rgba(196,156,94,0.28)] bg-white shadow-[0_14px_32px_rgba(0,0,0,0.05)]'
          : 'border-black/8 bg-[rgba(255,255,255,0.72)] hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.22)] hover:bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
          <GuideGlyph icon={icon} />
        </div>
        <span className="text-[0.62rem] uppercase tracking-[0.16em] text-black/44">Topic {index + 1}</span>
      </div>

      <h4 className="mt-4 font-serif text-[1.2rem] leading-[1.08] tracking-[-0.02em] text-neutral-900 sm:text-[1.28rem]">
        {topic.label}
      </h4>
      <p className="mt-2 text-sm leading-6 text-neutral-700">{topic.summary}</p>

      {previewItems.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {previewItems.map((item) => (
            <span
              key={`${topic.id}-${item}`}
              className="inline-flex rounded-full border border-[rgba(196,156,94,0.16)] bg-[rgba(255,248,241,0.82)] px-2.5 py-1.5 text-[0.72rem] text-neutral-800"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-auto pt-4 text-sm font-semibold text-neutral-900">
        <span>{isActive ? 'Open now' : 'Open topic'}</span>
        <span aria-hidden="true" className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
          -&gt;
        </span>
      </div>
    </button>
  );
}

export default function GuideCompactInteractivePlanner({
  sourceRoute,
  topics,
}: {
  sourceRoute: string;
  topics: CompactPlannerTopic[];
}) {
  const scenarioBaseId = useId().replace(/:/g, '');
  const priorityBaseId = useId().replace(/:/g, '');
  const topicBaseId = useId().replace(/:/g, '');
  const topicPanelRef = useRef<HTMLElement | null>(null);
  const plannerScenarios = buildPlannerScenarios(sourceRoute);
  const priorityLenses = buildPriorityLenses(sourceRoute);
  const [activeScenarioId, setActiveScenarioId] = useState(plannerScenarios[0]!.id);
  const [activePriorityId, setActivePriorityId] = useState(priorityLenses[0]!.id);
  const [activeTopicId, setActiveTopicId] = useState(topics[0]?.id ?? '');

  useEffect(() => {
    if (!topics.length) {
      return;
    }

    const syncTopicFromHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash) {
        return;
      }

      const matchedTopic = topics.find((topic) => topic.id === hash);
      if (matchedTopic) {
        startTransition(() => {
          setActiveTopicId(matchedTopic.id);
        });
      }
    };

    syncTopicFromHash();
    window.addEventListener('hashchange', syncTopicFromHash);

    return () => {
      window.removeEventListener('hashchange', syncTopicFromHash);
    };
  }, [topics]);

  useEffect(() => {
    if (topics.length === 0) {
      return;
    }

    if (!topics.some((topic) => topic.id === activeTopicId)) {
      setActiveTopicId(topics[0]!.id);
    }
  }, [activeTopicId, topics]);

  const activateTopic = (topicId: string, options?: { scrollToPanel?: boolean }) => {
    startTransition(() => {
      setActiveTopicId(topicId);
    });

    if (typeof window !== 'undefined') {
      const nextUrl = `${window.location.pathname}${window.location.search}#${topicId}`;
      window.history.replaceState(null, '', nextUrl);

      if (options?.scrollToPanel) {
        window.requestAnimationFrame(() => {
          topicPanelRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        });
      }
    }
  };

  const activeScenario = plannerScenarios.find((scenario) => scenario.id === activeScenarioId) ?? plannerScenarios[0]!;
  const activePriority = priorityLenses.find((priority) => priority.id === activePriorityId) ?? priorityLenses[0]!;
  const activeTopic = topics.find((topic) => topic.id === activeTopicId) ?? topics[0] ?? null;
  const activeTopicIndex = activeTopic ? topics.findIndex((topic) => topic.id === activeTopic.id) : -1;
  const previousTopic = activeTopicIndex > 0 ? topics[activeTopicIndex - 1] ?? null : null;
  const nextTopic = activeTopicIndex >= 0 && activeTopicIndex < topics.length - 1 ? topics[activeTopicIndex + 1] ?? null : null;
  const productExampleContent =
    activeTopic?.id === 'product-examples' && activeTopic.overviewContent
      ? splitProductExampleContent(activeTopic.overviewContent)
      : null;
  const hasStructuredProductExamples = Boolean(
    productExampleContent && (productExampleContent.products.length > 0 || productExampleContent.comparisons.length > 0),
  );
  const activeTopicCardCount = activeTopic
    ? hasStructuredProductExamples && productExampleContent
      ? (productExampleContent.narrative ? 1 : 0) +
        productExampleContent.comparisons.length +
        productExampleContent.products.length +
        activeTopic.cards.length +
        (activeTopic.faqItems?.length ? 1 : 0)
      : (activeTopic.overviewContent ? 1 : 0) + activeTopic.cards.length + (activeTopic.faqItems?.length ? 1 : 0)
    : 0;
  const activeTopicSupportCount = activeTopic?.companions.length ?? 0;
  const activeTopicIcon = activeTopic ? getTopicIcon(activeTopic.id) : 'book';

  return (
    <section
      id="interactive-planner"
      className="scroll-mt-28 overflow-hidden rounded-[1.85rem] border border-stone-200/70 bg-[linear-gradient(180deg,#fffdf9_0%,#f7efe7_100%)] p-5 shadow-[0_22px_58px_rgba(0,0,0,0.05)] sm:p-6 md:rounded-[2rem] md:p-8"
    >
      <div className="space-y-3">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Interactive planner</p>
        <h2 className="font-serif text-[1.95rem] leading-[1.02] tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
          Test whether the compact lane actually fits your week
        </h2>
        <p className="max-w-[72ch] text-[0.98rem] leading-relaxed text-neutral-700">
          Start with your routine, then test the tradeoff that matters most. Then open the exact section of the guide that answers the next question.
        </p>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/48">Choose the routine that sounds most like your week</p>
          <div role="tablist" aria-label="Compact stroller routine planner" className="mt-4 grid gap-3 sm:grid-cols-2">
            {plannerScenarios.map((scenario) => {
              const isActive = scenario.id === activeScenario.id;
              const buttonId = `${scenarioBaseId}-${scenario.id}-tab`;
              const panelId = `${scenarioBaseId}-${scenario.id}-panel`;

              return (
                <button
                  key={scenario.id}
                  id={buttonId}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={panelId}
                  onClick={() => {
                    startTransition(() => {
                      setActiveScenarioId(scenario.id);
                    });
                  }}
                  className={`group rounded-[1.35rem] border p-4 text-left transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)] ${
                    isActive
                      ? 'border-[rgba(196,156,94,0.28)] bg-white shadow-[0_14px_32px_rgba(0,0,0,0.05)]'
                      : 'border-black/6 bg-[rgba(255,255,255,0.72)] hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.22)] hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                      <GuideGlyph icon={scenario.icon} />
                    </div>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] ${toneClasses(scenario.fitTone)}`}>
                      {scenario.fitLabel}
                    </span>
                  </div>
                  <p className="mt-4 font-serif text-[1.22rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">{scenario.label}</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{scenario.summary}</p>
                </button>
              );
            })}
          </div>
        </div>

        <article
          id={`${scenarioBaseId}-${activeScenario.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${scenarioBaseId}-${activeScenario.id}-tab`}
          className="rounded-[1.5rem] border border-black/6 bg-white/92 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)] md:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                <GuideGlyph icon={activeScenario.icon} />
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/48">Routine lens</p>
                <h3 className="mt-1 font-serif text-[1.55rem] leading-[1.06] tracking-[-0.03em] text-neutral-900">{activeScenario.label}</h3>
              </div>
            </div>
            <span className={`inline-flex rounded-full border px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.18em] ${toneClasses(activeScenario.fitTone)}`}>
              {activeScenario.fitLabel}
            </span>
          </div>

          <p className="mt-5 text-[0.98rem] leading-7 text-neutral-700">{activeScenario.summary}</p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.2rem] border border-[rgba(0,0,0,0.06)] bg-[#fcfaf7] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/48">Signals this is your situation</p>
              <ul className="mt-3 list-disc space-y-3 pl-5">
                {activeScenario.signals.map((signal) => (
                  <li key={signal} className="text-sm leading-6 text-neutral-700">
                    {signal}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.2rem] border border-[rgba(0,0,0,0.06)] bg-[#fcfaf7] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/48">What to prioritize first</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {activeScenario.priorities.map((priority) => (
                  <span
                    key={priority}
                    className="inline-flex rounded-full border border-[rgba(196,156,94,0.18)] bg-white px-3 py-2 text-sm text-neutral-800"
                  >
                    {priority}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={activeScenario.primaryHref}
              className="inline-flex items-center justify-center rounded-full border border-[rgba(196,156,94,0.24)] bg-[rgba(255,248,241,0.96)] px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.34)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
            >
              <span>{activeScenario.primaryLabel}</span>
              <span aria-hidden="true" className="ml-2">
                -&gt;
              </span>
            </Link>
            <Link
              href={activeScenario.secondaryHref}
              className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.24)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
            >
              <span>{activeScenario.secondaryLabel}</span>
              <span aria-hidden="true" className="ml-2">
                -&gt;
              </span>
            </Link>
          </div>
        </article>
      </div>

      <div className="mt-8 border-t border-[rgba(0,0,0,0.06)] pt-8">
        <div className="space-y-3">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/48">Pick the tradeoff you care about most</p>
          <div role="tablist" aria-label="Full-size and modular stroller tradeoff lenses" className="flex flex-wrap gap-2.5">
            {priorityLenses.map((priority) => {
              const isActive = priority.id === activePriority.id;
              const buttonId = `${priorityBaseId}-${priority.id}-tab`;
              const panelId = `${priorityBaseId}-${priority.id}-panel`;

              return (
                <button
                  key={priority.id}
                  id={buttonId}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={panelId}
                  onClick={() => {
                    startTransition(() => {
                      setActivePriorityId(priority.id);
                    });
                  }}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)] ${
                    isActive
                      ? 'border-[rgba(196,156,94,0.3)] bg-white text-neutral-900 shadow-[0_10px_24px_rgba(0,0,0,0.04)]'
                      : 'border-black/8 bg-[rgba(255,255,255,0.68)] text-neutral-700 hover:border-[rgba(196,156,94,0.22)] hover:bg-white'
                  }`}
                >
                  <GuideGlyph icon={priority.icon} className="h-4 w-4" />
                  <span>{priority.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <article
          id={`${priorityBaseId}-${activePriority.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${priorityBaseId}-${activePriority.id}-tab`}
          className="mt-6 rounded-[1.45rem] border border-black/6 bg-white/92 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)] md:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                <GuideGlyph icon={activePriority.icon} />
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/48">Decision lens</p>
                <h3 className="mt-1 font-serif text-[1.55rem] leading-[1.06] tracking-[-0.03em] text-neutral-900">{activePriority.label}</h3>
              </div>
            </div>
            <span className={`inline-flex rounded-full border px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.18em] ${toneClasses(activePriority.tone)}`}>
              {activePriority.verdict}
            </span>
          </div>

          <p className="mt-5 text-[0.98rem] leading-7 text-neutral-700">{activePriority.summary}</p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.2rem] border border-[rgba(0,0,0,0.06)] bg-[#fcfaf7] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/48">When this helps</p>
              <p className="mt-3 text-sm leading-7 text-neutral-700">{activePriority.helpsWhen}</p>
            </div>
            <div className="rounded-[1.2rem] border border-[rgba(0,0,0,0.06)] bg-[#fcfaf7] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/48">Watch out for</p>
              <p className="mt-3 text-sm leading-7 text-neutral-700">{activePriority.watchout}</p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={activePriority.href}
              className="inline-flex items-center rounded-full border border-black/8 bg-[rgba(255,248,241,0.92)] px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.24)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
            >
              <span>{activePriority.ctaLabel}</span>
              <span aria-hidden="true" className="ml-2">
                -&gt;
              </span>
            </Link>
          </div>
        </article>
      </div>

      {activeTopic ? (
        <div className="mt-8 border-t border-[rgba(0,0,0,0.06)] pt-8">
          <div className="space-y-3">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/48">Guide explorer</p>
            <h3 className="font-serif text-[1.7rem] leading-[1.04] tracking-[-0.03em] text-neutral-900 sm:text-[2rem]">
              Open the part of the guide you actually need
            </h3>
            <p className="max-w-[72ch] text-[0.98rem] leading-relaxed text-neutral-700">
              The rest of the education hub now lives inside this planner. Jump straight to the part that answers the next real-life question instead of scrolling through separate section blocks.
            </p>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] xl:items-start">
            <div role="tablist" aria-label="Full-size and modular guide topics" className="grid gap-3 sm:grid-cols-2 xl:sticky xl:top-28 xl:grid-cols-1">
              {topics.map((topic, index) => {
                const isActive = topic.id === activeTopic.id;
                const buttonId = `${topicBaseId}-${topic.id}-tab`;
                const panelId = `${topicBaseId}-${topic.id}-panel`;

                return (
                  <div key={topic.id} id={topic.id} className="scroll-mt-28">
                    <TopicNavigatorCard
                      topic={topic}
                      index={index}
                      isActive={isActive}
                      buttonId={buttonId}
                      panelId={panelId}
                      onSelect={() => activateTopic(topic.id, { scrollToPanel: true })}
                    />
                  </div>
                );
              })}
            </div>

            <article
              id={`${topicBaseId}-${activeTopic.id}-panel`}
              role="tabpanel"
              aria-labelledby={`${topicBaseId}-${activeTopic.id}-tab`}
              ref={topicPanelRef}
              className="scroll-mt-28 rounded-[1.75rem] border border-black/6 bg-white/92 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)] md:p-6"
            >
              <div className="space-y-6">
                <div className="rounded-[1.55rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(145deg,#fff8f1_0%,#fffdfb_45%,#f8f1e8_100%)] p-5 sm:p-6">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--color-accent-dark)] shadow-[0_10px_24px_rgba(0,0,0,0.04)]">
                          <GuideGlyph icon={activeTopicIcon} />
                        </div>
                        <div>
                          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/48">Guide topic</p>
                          <p className="mt-1 text-sm font-semibold text-neutral-900">
                            Topic {activeTopicIndex + 1} of {topics.length}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-serif text-[1.75rem] leading-[1.04] tracking-[-0.03em] text-neutral-900 sm:text-[2.1rem]">
                          {activeTopic.title}
                        </h3>
                        {activeTopic.summary ? (
                          <p className="max-w-[72ch] text-[0.98rem] leading-relaxed text-neutral-700">{activeTopic.summary}</p>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:w-[19rem]">
                      <TopicMetric label="Inside this topic" value={`${activeTopicCardCount} content card${activeTopicCardCount === 1 ? '' : 's'}`} />
                      <TopicMetric
                        label="Support built in"
                        value={
                          activeTopic.faqItems?.length
                            ? `${activeTopic.faqItems.length} quick answers`
                            : activeTopicSupportCount > 0
                              ? `${activeTopicSupportCount} next-step block${activeTopicSupportCount === 1 ? '' : 's'}`
                              : 'Core guidance only'
                        }
                      />
                    </div>
                  </div>

                  {activeTopic.highlights.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {activeTopic.highlights.map((highlight) => (
                        <span
                          key={`${activeTopic.id}-${highlight}`}
                          className="inline-flex rounded-full border border-[rgba(196,156,94,0.18)] bg-white/86 px-3 py-2 text-sm text-neutral-800"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                {activeTopic.faqItems && activeTopic.faqItems.length > 0 ? (
                  <GuideFaqAccordion
                    id={`${activeTopic.id}-content`}
                    title="Questions parents still have"
                    description="The guide covers the framework. These are the quick answers that usually come right after."
                    items={activeTopic.faqItems}
                  />
                ) : null}

                {activeTopic.overviewContent || activeTopic.cards.length > 0 ? (
                  hasStructuredProductExamples && productExampleContent ? (
                    <div className="space-y-5">
                      {productExampleContent.narrative ? (
                        <PlannerTopicCard
                          id={`${activeTopic.id}-overview-card`}
                          eyebrow="Section brief"
                          title="How to compare these models"
                          content={productExampleContent.narrative}
                          postId={`planner-${activeTopic.id}-overview`}
                        />
                      ) : null}

                      {productExampleContent.comparisons.length > 0 ? (
                        <div className="space-y-4 [&_.content-widget]:my-0">
                          {productExampleContent.comparisons.map((comparison, index) => (
                            <Comparison
                              key={`${activeTopic.id}-comparison-${index}`}
                              title={comparison.title}
                              rows={comparison.rows}
                            />
                          ))}
                        </div>
                      ) : null}

                      {productExampleContent.products.length > 0 ? (
                        <div className="grid gap-5 lg:grid-cols-2">
                          {productExampleContent.products.map((product, index) => (
                            <div key={`${activeTopic.id}-product-${product.brand}-${product.productName}-${index}`} className="[&_.content-widget]:my-0">
                              <ProductCard
                                brand={product.brand}
                                productName={product.productName}
                                review={product.shortReview}
                                bestFor={product.bestFor}
                                standout={product.standout ?? undefined}
                                pros={product.pros}
                                affiliateLinks={product.affiliateLinks}
                                imageUrl={product.imageUrl}
                                imageAlt={product.imageAlt}
                                variant="homepage"
                              />
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {activeTopic.cards.length > 0 ? (
                        <div className="grid gap-4 lg:grid-cols-2">
                          {activeTopic.cards.map((card) => (
                            <PlannerTopicCard
                              key={`${activeTopic.id}-${card.id}`}
                              id={`${activeTopic.id}-${card.id}`}
                              eyebrow={card.eyebrow}
                              title={card.title}
                              content={card.content}
                              postId={`planner-${activeTopic.id}-${card.id}`}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                      {activeTopic.overviewContent ? (
                        <PlannerTopicCard
                          id={`${activeTopic.id}-overview-card`}
                          eyebrow="Section brief"
                          title="What to know first"
                          content={activeTopic.overviewContent}
                          postId={`planner-${activeTopic.id}-overview`}
                          className="lg:col-span-2"
                        />
                      ) : null}

                      {activeTopic.cards.map((card) => (
                        <PlannerTopicCard
                          key={`${activeTopic.id}-${card.id}`}
                          id={`${activeTopic.id}-${card.id}`}
                          eyebrow={card.eyebrow}
                          title={card.title}
                          content={card.content}
                          postId={`planner-${activeTopic.id}-${card.id}`}
                        />
                      ))}
                    </div>
                  )
                ) : null}

                <TopicCompanions companions={activeTopic.companions} />

                {previousTopic || nextTopic ? (
                  <div className="grid gap-3 border-t border-[rgba(0,0,0,0.06)] pt-5 sm:grid-cols-2">
                    {previousTopic ? (
                      <button
                        type="button"
                        onClick={() => activateTopic(previousTopic.id, { scrollToPanel: true })}
                        className="group rounded-[1.25rem] border border-black/8 bg-[rgba(255,255,255,0.74)] p-4 text-left transition hover:border-[rgba(196,156,94,0.24)] hover:bg-white"
                      >
                        <p className="text-[0.66rem] uppercase tracking-[0.16em] text-black/44">Previous topic</p>
                        <p className="mt-2 font-serif text-[1.2rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">{previousTopic.label}</p>
                        <p className="mt-2 text-sm leading-6 text-neutral-700">{previousTopic.summary}</p>
                      </button>
                    ) : (
                      <div className="hidden sm:block" />
                    )}

                    {nextTopic ? (
                      <button
                        type="button"
                        onClick={() => activateTopic(nextTopic.id, { scrollToPanel: true })}
                        className="group rounded-[1.25rem] border border-[rgba(196,156,94,0.18)] bg-[rgba(255,248,241,0.74)] p-4 text-left transition hover:border-[rgba(196,156,94,0.28)] hover:bg-white"
                      >
                        <p className="text-[0.66rem] uppercase tracking-[0.16em] text-black/44">Next topic</p>
                        <p className="mt-2 font-serif text-[1.2rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">{nextTopic.label}</p>
                        <p className="mt-2 text-sm leading-6 text-neutral-700">{nextTopic.summary}</p>
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>
          </div>
        </div>
      ) : null}

      <div className="mt-8 rounded-[1.4rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fff8f3_0%,#fffdf9_100%)] p-5 md:p-6">
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/48">Ready for actual models?</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h3 className="font-serif text-[1.45rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
              Read the best compact stroller shortlist next
            </h3>
            <p className="mt-2 text-sm leading-7 text-neutral-700">
              Once you know this category fits your life, the best next move is the actual model shortlist, not another hour comparing marketing language.
            </p>
          </div>
          <Link
            href={BEST_COMPACT_BLOG_PATH}
            className="inline-flex items-center justify-center rounded-full border border-[rgba(196,156,94,0.24)] bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.34)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
          >
            <span>Open /blog/best-compact-strollers</span>
            <span aria-hidden="true" className="ml-2">
              -&gt;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
