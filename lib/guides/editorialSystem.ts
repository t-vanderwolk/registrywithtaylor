import { stripMarkdown } from '@/lib/blog/contentText';
import type { GuideOutline, GuideSection } from '@/lib/guides/articleOutline';
import { stripLeadingGuideHeading } from '@/lib/guides/articleOutline';
import { buildTakeawayBulletsFromOutline, dedupeTextItems, extractMarkdownListItems, getFallbackTakeaways } from '@/lib/guides/guideFlow';

type EditorialGuideInput = {
  slug: string;
  title: string;
  category?: string | null;
  topicCluster?: string | null;
  founderSignatureEnabled?: boolean;
  founderSignatureText?: string | null;
};

const DEFAULT_TMBC_SIGN_OFF = 'xoxo -T';
const LEGACY_TMBC_SIGN_OFF = `Start with confidence.

XOXO
— Taylor

Founder, Taylor-Made Baby Co.`;

function normalizeValue(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getGuideFamily({ slug, category, topicCluster }: Pick<EditorialGuideInput, 'slug' | 'category' | 'topicCluster'>) {
  const context = normalizeValue([slug, category, topicCluster].filter(Boolean).join(' '));

  if (context.includes('registry')) {
    return 'registry';
  }

  if (context.includes('nursery')) {
    return 'nursery';
  }

  if (context.includes('stroller')) {
    return 'strollers';
  }

  if (context.includes('car seat') || context.includes('carseat')) {
    return 'car-seats';
  }

  if (context.includes('travel')) {
    return 'travel';
  }

  if (context.includes('feeding')) {
    return 'feeding';
  }

  if (context.includes('postpartum')) {
    return 'postpartum';
  }

  if (context.includes('essential')) {
    return 'essentials';
  }

  return 'general';
}

function stripWidgetsAndSignature(content: string) {
  return content
    .replace(/::cta-slot[^\n]*\n?/gi, '')
    .replace(/\n+Start with confidence\.[\s\S]*$/i, '')
    .replace(/\n+xoxo\s*[—-]?\s*t(?:aylor)?\s*$/i, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizeSignatureText(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  const normalized = normalizeValue(trimmed);

  if (
    normalized === normalizeValue(LEGACY_TMBC_SIGN_OFF) ||
    normalized === normalizeValue(DEFAULT_TMBC_SIGN_OFF) ||
    normalized === 'xoxo' ||
    normalized === 'xoxo t' ||
    normalized === 'xoxo taylor'
  ) {
    return DEFAULT_TMBC_SIGN_OFF;
  }

  return trimmed;
}

function getMeaningfulParagraphs(content: string, maxParagraphs = 2) {
  return stripWidgetsAndSignature(stripLeadingGuideHeading(content))
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(
      (paragraph) =>
        Boolean(paragraph) &&
        !paragraph.startsWith(':::') &&
        !paragraph.startsWith('![') &&
        !paragraph.startsWith('- ') &&
        !paragraph.startsWith('* ') &&
        !/^\d+\.\s/.test(paragraph),
    )
    .slice(0, maxParagraphs)
    .map((paragraph) => stripMarkdown(paragraph));
}

function findSection(sections: GuideSection[], matchers: string[]) {
  return (
    sections.find((section) => {
      const normalized = normalizeValue(section.title);
      return matchers.some((matcher) => normalized.includes(matcher));
    }) ?? null
  );
}

function getFamilyWhatThisIs({ title, slug, category, topicCluster }: Pick<EditorialGuideInput, 'title' | 'slug' | 'category' | 'topicCluster'>) {
  switch (getGuideFamily({ slug, category, topicCluster })) {
    case 'registry':
      return 'A registry-first planning guide that helps you decide what belongs on the list now, what can wait, and what never needed a dramatic entrance in the first place.';
    case 'nursery':
      return 'A practical nursery planning guide built around room flow, caregiving routes, and the parts of the setup that still matter when everyone is tired.';
    case 'strollers':
      return 'A stroller decision guide that helps you sort the category or lane before you waste energy comparing products that were never solving the same job.';
    case 'car-seats':
      return 'A car seat guide meant to make the stage, fit, install reality, and convenience tradeoffs feel clearer before the features start auditioning for attention.';
    case 'travel':
      return 'A travel-with-baby guide that treats movement, portability, and routine friction like the real decision, because they usually are.';
    case 'feeding':
      return 'A feeding guide that helps you build one workable setup before backup systems and hypothetical scenarios start multiplying.';
    case 'postpartum':
      return 'A postpartum guide focused on recovery, support, and the adult side of early parenting that deserves far more oxygen than it usually gets.';
    case 'essentials':
      return 'An essentials guide designed to keep the first stretch grounded in what earns space quickly instead of what sounds reassuring in bulk.';
    default:
      return `${title} is meant to function like a calmer decision guide, not a louder shopping list.`;
  }
}

function getFamilyWhyItExists({ slug, category, topicCluster }: Pick<EditorialGuideInput, 'slug' | 'category' | 'topicCluster'>) {
  switch (getGuideFamily({ slug, category, topicCluster })) {
    case 'registry':
      return 'Registry planning gets noisy when parents start with products instead of order. This exists to fix that sequence first.';
    case 'nursery':
      return 'Nursery planning gets overdecorated quickly. This exists to bring the room back to function, flow, and real caregiving use.';
    case 'strollers':
      return 'Stroller shopping gets confusing when every model tries to sound universal. This exists to separate lane fit from product hype.';
    case 'car-seats':
      return 'Car seat research gets louder than it needs to be. This exists to sort the real stage and fit question before convenience language starts sounding like a safety rule.';
    case 'travel':
      return 'Travel planning with a baby can sprawl fast. This exists to narrow the setup around the trips and outings you actually take.';
    case 'feeding':
      return 'Feeding categories multiply quickly. This exists to help you start with a workable setup instead of five backup identities.';
    case 'postpartum':
      return 'Postpartum planning is too often treated like an optional appendix. This exists to put recovery back inside the real preparation plan.';
    case 'essentials':
      return 'The essentials conversation gets longer every time everything is treated like a must-have. This exists to shorten the list with better logic.';
    default:
      return 'This exists to make the decision smaller, steadier, and more usable in real life.';
  }
}

export function getGuideWhatThisIs({
  guide,
  outline,
}: {
  guide: Pick<EditorialGuideInput, 'slug' | 'title' | 'category' | 'topicCluster'>;
  outline: GuideOutline;
}) {
  const matchedSection = findSection(outline.sections, [
    'what this is',
    'what this guide covers',
    'what this category actually',
    'what this category really',
    'what an infant car seat actually is',
    'what all in one actually solves',
    'what convertible actually solves',
    'what booster actually does',
    'what rotating actually solves',
    'what a travel stroller should actually do',
    'what full size and modular really mean',
    'what full size and modular',
    'what full size',
    'what defines a compact',
    'what a travel system actually means',
    'what actually matters more',
    'car seat categories',
    'major types and categories',
  ]);

  const paragraphs = matchedSection ? getMeaningfulParagraphs(matchedSection.content, 1) : [];
  return paragraphs[0] || getFamilyWhatThisIs(guide);
}

export function getGuideWhyItExists({
  guide,
  outline,
}: {
  guide: Pick<EditorialGuideInput, 'slug' | 'category' | 'topicCluster'>;
  outline: GuideOutline;
}) {
  const matchedSection = findSection(outline.sections, [
    'why it exists',
    'why this category feels overwhelming',
    'why this category exists',
    'why all in one sounds so good',
    'why convertible seats appeal so early',
    'why booster is a different conversation',
    'why rotating seats keep pulling parents in',
    'why stroller feels so confusing',
    'why strollers feel so confusing',
  ]);

  const paragraphs = matchedSection ? getMeaningfulParagraphs(matchedSection.content, 1) : [];
  return paragraphs[0] || getFamilyWhyItExists(guide);
}

export function getGuideFinalThought({
  guide,
  outline,
}: {
  guide: Pick<EditorialGuideInput, 'slug' | 'category' | 'topicCluster'>;
  outline: GuideOutline;
}) {
  const matchedSection = findSection(outline.sections, ['final thoughts', 'final thought']);
  const paragraphs = matchedSection ? getMeaningfulParagraphs(matchedSection.content, 2) : [];

  if (paragraphs.length > 0) {
    return paragraphs.join(' ');
  }

  switch (getGuideFamily(guide)) {
    case 'registry':
      return 'The calmer registry is usually the better registry. Fewer guesses. Better order. More room for real life to tell you what belongs later.';
    case 'nursery':
      return 'A strong nursery rarely wins by doing more. It wins by making the sleepy parts of daily life easier to move through.';
    case 'strollers':
      return 'The best stroller answer is usually the lane that feels less dramatic and more useful once it enters your actual week.';
    case 'car-seats':
      return 'The right car seat decision usually feels simpler after the stage and routine are clear. That is a good sign, not a boring one.';
    case 'travel':
      return 'Travel gear should lighten the real trip, not the imaginary one. That rule quietly solves a lot.';
    default:
      return 'The clearer decision is usually the one that asks less from your life while still doing its job well.';
  }
}

export function getGuideTakeaways({
  guide,
  outline,
  extraItems = [],
}: {
  guide: Pick<EditorialGuideInput, 'slug'>;
  outline: GuideOutline;
  extraItems?: string[];
}) {
  const takeawaysSection = findSection(outline.sections, ['takeaways', 'keep in mind']);
  const explicitTakeaways = takeawaysSection ? extractMarkdownListItems(takeawaysSection.content, 4) : [];

  if (explicitTakeaways.length > 0) {
    return explicitTakeaways;
  }

  return dedupeTextItems(
    [
      ...buildTakeawayBulletsFromOutline(outline),
      ...extraItems,
      ...getFallbackTakeaways(guide.slug),
    ],
    4,
  );
}

export function getGuideSignOff({
  founderSignatureEnabled,
  founderSignatureText,
}: Pick<EditorialGuideInput, 'founderSignatureEnabled' | 'founderSignatureText'>) {
  if (founderSignatureEnabled === false) {
    return '';
  }

  const cleaned = normalizeSignatureText(founderSignatureText ?? '');
  return cleaned || DEFAULT_TMBC_SIGN_OFF;
}
