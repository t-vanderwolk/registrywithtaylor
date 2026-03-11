export type GuideFaqItem = {
  question: string;
  answer: string;
};

export type GuideAffiliateModule = {
  id: string;
  title: string;
  productName: string;
  description: string;
  ctaLabel: string;
  destinationUrl: string;
  retailerLabel: string | null;
  partnerId: string | null;
  imageUrl: string | null;
  notes: string | null;
};

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const asNullableText = (value: unknown) => {
  const normalized = asText(value);
  return normalized.length > 0 ? normalized : null;
};

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);
const isImageUrl = (value: string) => isHttpUrl(value) || value.startsWith('/');

export function sanitizeStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .flatMap((entry) => (typeof entry === 'string' ? [entry.trim()] : []))
    .filter((entry, index, collection) => entry.length > 0 && collection.indexOf(entry) === index);
}

export function sanitizeGuideFaqItems(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as GuideFaqItem[];
  }

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') {
      return [];
    }

    const question = asText((entry as Record<string, unknown>).question);
    const answer = asText((entry as Record<string, unknown>).answer);

    if (!question || !answer) {
      return [];
    }

    return [{ question, answer } satisfies GuideFaqItem];
  });
}

export function sanitizeGuideAffiliateModules(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as GuideAffiliateModule[];
  }

  return value.flatMap((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      return [];
    }

    const record = entry as Record<string, unknown>;
    const title = asText(record.title);
    const productName = asText(record.productName);
    const description = asText(record.description);
    const ctaLabel = asText(record.ctaLabel);
    const destinationUrl = asText(record.destinationUrl);
    const id = asText(record.id) || `guide-affiliate-${index + 1}`;
    const imageUrl = asNullableText(record.imageUrl);

    if (!title || !productName || !description || !ctaLabel || !isHttpUrl(destinationUrl)) {
      return [];
    }

    if (imageUrl && !isImageUrl(imageUrl)) {
      return [];
    }

    return [
      {
        id,
        title,
        productName,
        description,
        ctaLabel,
        destinationUrl,
        retailerLabel: asNullableText(record.retailerLabel),
        partnerId: asNullableText(record.partnerId),
        imageUrl,
        notes: asNullableText(record.notes),
      } satisfies GuideAffiliateModule,
    ];
  });
}

