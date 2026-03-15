type ResolvedProductCardImage = {
  src: string;
  alt: string;
  objectClassName: 'object-contain' | 'object-cover';
  isFallback: boolean;
};

const STROLLER_AND_CAR_SEAT_IMAGE = '/assets/editorial/gear.jpg' as const;
const NURSERY_IMAGE = '/assets/editorial/nursery.jpg' as const;
const REGISTRY_IMAGE = '/assets/editorial/registry.jpg' as const;
const STROLLER_PRODUCT_IMAGES = {
  butterfly: '/assets/strollers/butterfly.png',
  fox5: '/assets/strollers/fox5.png',
  mixx: '/assets/strollers/mixx.png',
  reef: '/assets/strollers/reef.png',
} as const;

function normalizeValue(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? '';
}

function includesAny(value: string, candidates: string[]) {
  return candidates.some((candidate) => value.includes(candidate));
}

export function resolveProductCardImage({
  brand,
  productName,
  imageUrl,
  imageAlt,
}: {
  brand: string;
  productName: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
}): ResolvedProductCardImage | null {
  if (imageUrl?.trim()) {
    return {
      src: imageUrl.trim(),
      alt: imageAlt?.trim() || productName,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  const normalizedBrand = normalizeValue(brand);
  const normalizedProductName = normalizeValue(productName);
  const normalizedKey = `${normalizedBrand} ${normalizedProductName}`;

  if (includesAny(normalizedKey, ['fox 5', 'fox5'])) {
    return {
      src: STROLLER_PRODUCT_IMAGES.fox5,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['mixx next', 'mixx'])) {
    return {
      src: STROLLER_PRODUCT_IMAGES.mixx,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['butterfly'])) {
    return {
      src: STROLLER_PRODUCT_IMAGES.butterfly,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['reef 2', 'reef'])) {
    return {
      src: STROLLER_PRODUCT_IMAGES.reef,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (
    includesAny(normalizedKey, [
      'crib',
      'mini crib',
      'camera',
      'nanit',
      'babyletto',
      'lolly',
      'hudson',
      'origami',
    ])
  ) {
    return {
      src: NURSERY_IMAGE,
      alt: `${brand} ${productName} editorial image`,
      objectClassName: 'object-cover',
      isFallback: true,
    };
  }

  if (
    includesAny(normalizedKey, [
      'pipa',
      'mesa',
      'sirona',
      'car seat',
      'fox',
      'mixx',
      'butterfly',
      'vista',
      'donkey',
      'minu',
      'eezy',
      'revolution',
      'trvl',
      'cruz',
      'stroller',
    ])
  ) {
    return {
      src: STROLLER_AND_CAR_SEAT_IMAGE,
      alt: `${brand} ${productName} editorial image`,
      objectClassName: 'object-cover',
      isFallback: true,
    };
  }

  return {
    src: REGISTRY_IMAGE,
    alt: `${brand} ${productName} editorial image`,
    objectClassName: 'object-cover',
    isFallback: true,
  };
}
