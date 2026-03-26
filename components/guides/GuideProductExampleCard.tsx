import ProductCard from '@/components/ui/ProductCard';
import type { GuideProductSpecGroup } from '@/lib/guides/productExamples';
import { resolveGuideAffiliateUrl } from '@/lib/guides/resolveGuideAffiliateUrl';

function normalizeText(value: string | null | undefined) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function toSentence(value: string | null | undefined) {
  const trimmed = normalizeText(value);

  if (!trimmed) {
    return '';
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function buildDescription({
  whyItMatters,
  bestFor,
  typeLabel,
}: {
  whyItMatters?: string | null;
  bestFor?: string | null;
  typeLabel?: string | null;
}) {
  const review = toSentence(whyItMatters);
  if (review) {
    return review;
  }

  const fit = normalizeText(bestFor);
  if (fit) {
    return toSentence(`A useful fit for ${fit}`);
  }

  const category = normalizeText(typeLabel);
  if (category) {
    return toSentence(`${category} example selected to keep the decision grounded in real-life use`);
  }

  return 'A useful example to make the decision feel more concrete in real life.';
}

function buildPros({
  pros = [],
  standout,
  specGroups = [],
  notes = [],
}: {
  pros?: string[];
  standout?: string | null;
  specGroups?: GuideProductSpecGroup[];
  notes?: string[];
}) {
  const specItems = specGroups.flatMap((group) => group.items);

  return Array.from(
    new Set(
      [...pros, standout ?? '', ...specItems, ...notes]
        .map((item) => normalizeText(item))
        .filter(Boolean),
    ),
  ).slice(0, 3);
}

export default function GuideProductExampleCard({
  name,
  imageSrc,
  imageAlt,
  brand,
  productName,
  typeLabel,
  whyItMatters,
  bestFor,
  standout,
  specGroups = [],
  notes = [],
  pros = [],
  affiliateUrl,
  imageHref,
  category,
  guide,
  position = 1,
}: {
  name: string;
  imageSrc?: string | null;
  imageAlt?: string | null;
  brand?: string;
  productName?: string;
  typeLabel?: string | null;
  whyItMatters?: string | null;
  bestFor?: string | null;
  whoItFits?: string | null;
  standout?: string | null;
  watchout?: string | null;
  specGroups?: GuideProductSpecGroup[];
  notes?: string[];
  pros?: string[];
  affiliateUrl?: string | null;
  imageHref?: string | null;
  category?: string | null;
  guide?: string;
  position?: number | string;
}) {
  const resolvedName = normalizeText(name) || normalizeText(productName) || 'Guided example';
  const resolvedBrand = normalizeText(brand);
  const resolvedCategory = normalizeText(category) || normalizeText(typeLabel) || 'Product example';
  const resolvedAffiliateUrl = resolveGuideAffiliateUrl({
    affiliateUrl: normalizeText(affiliateUrl) || normalizeText(imageHref) || null,
    brand: resolvedBrand,
    productName: normalizeText(productName),
    name: resolvedName,
  });

  if (!resolvedAffiliateUrl) {
    return null;
  }

  return (
    <ProductCard
      name={resolvedName}
      brand={resolvedBrand}
      description={buildDescription({ whyItMatters, bestFor, typeLabel })}
      pros={buildPros({ pros, standout, specGroups, notes })}
      affiliateUrl={resolvedAffiliateUrl}
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      category={resolvedCategory}
      guide={guide}
      position={position}
    />
  );
}
