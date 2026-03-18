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
  cruz: '/assets/strollers/cruz.png',
  dragonfly: '/assets/strollers/compact.png',
  donkey: '/assets/strollers/donkey.png',
  fox5: '/assets/strollers/fox5.png',
  gazelle: '/assets/strollers/gazelle.png',
  mixx: '/assets/strollers/mixx.png',
  mios: '/assets/strollers/mios.png',
  reef: '/assets/strollers/reef.png',
  ridge: '/assets/strollers/ridge.png',
  triv: '/assets/strollers/triv.png',
  trvllx: '/assets/strollers/trvllx.png',
  vista: '/assets/strollers/convertable.png',
  wave: '/assets/strollers/wave.png',
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

  if (includesAny(normalizedKey, ['cruz v2', 'cruz'])) {
    return {
      src: STROLLER_PRODUCT_IMAGES.cruz,
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

  if (includesAny(normalizedKey, ['dragonfly'])) {
    return {
      src: STROLLER_PRODUCT_IMAGES.dragonfly,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['triv'])) {
    return {
      src: STROLLER_PRODUCT_IMAGES.triv,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['mios'])) {
    return {
      src: STROLLER_PRODUCT_IMAGES.mios,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['trvl lx', 'trvl-lx', 'trvllx'])) {
    return {
      src: STROLLER_PRODUCT_IMAGES.trvllx,
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

  if (includesAny(normalizedKey, ['vista v2', 'vista'])) {
    return {
      src: STROLLER_PRODUCT_IMAGES.vista,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['donkey 6', 'donkey 5', 'donkey'])) {
    return {
      src: STROLLER_PRODUCT_IMAGES.donkey,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['gazelle s', 'gazelle'])) {
    return {
      src: STROLLER_PRODUCT_IMAGES.gazelle,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['wave 3', 'wave'])) {
    return {
      src: STROLLER_PRODUCT_IMAGES.wave,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['ridge'])) {
    return {
      src: STROLLER_PRODUCT_IMAGES.ridge,
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
