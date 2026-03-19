type ResolvedProductCardImage = {
  src: string;
  alt: string;
  objectClassName: 'object-contain' | 'object-cover';
  isFallback: boolean;
};

const STROLLER_AND_CAR_SEAT_IMAGE = '/assets/editorial/gear.jpg' as const;
const NURSERY_IMAGE = '/assets/editorial/nursery.jpg' as const;
const REGISTRY_IMAGE = '/assets/editorial/registry.jpg' as const;
const CAR_SEAT_PRODUCT_IMAGES = {
  alta: '/assets/car-seats/alta.png',
  aria: '/assets/car-seats/aria.png',
  atonswivel: '/assets/car-seats/atonswivel.png',
  cloudt: '/assets/car-seats/cloudt.png',
  callisto: '/assets/car-seats/callisto.png',
  execnext: '/assets/car-seats/execnext.png',
  foonf: '/assets/car-seats/foonf2.png',
  liing: '/assets/car-seats/liing.png',
  liingo: '/assets/car-seats/liingobaseless.png',
  mesav3: '/assets/car-seats/mesav3.png',
  one4life: '/assets/car-seats/one4life.png',
  oobr: '/assets/car-seats/oobr.png',
  piparx: '/assets/car-seats/piparxbase.png',
  poplar: '/assets/car-seats/poplar.png',
  ravanext: '/assets/car-seats/ravanext.png',
  revvmaxx: '/assets/car-seats/revvmaxx.png',
  romi: '/assets/car-seats/romi.png',
  wayb: '/assets/car-seats/wayb.png',
  peri: '/assets/car-seats/peri.png',
} as const;
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

  if (includesAny(normalizedKey, ['pipa rx', 'piparx'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.piparx,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['mesa v3', 'mesa'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.mesav3,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['aria'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.aria,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['liingo'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.liingo,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['liing'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.liing,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['rava next', 'ravanext', 'rava'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.ravanext,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['poplar'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.poplar,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['foonf'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.foonf,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['exec next', 'execnext', 'exec'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.execnext,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['one4life'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.one4life,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['revv maxx', 'revvmaxx', 'revv'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.revvmaxx,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['aton swivel', 'atonswivel'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.atonswivel,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['peri 180', 'peri'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.peri,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['wayb', 'pico'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.wayb,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['oobr'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.oobr,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['alta'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.alta,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['cloud t', 'cloudt'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.cloudt,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['callisto'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.callisto,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['romi'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.romi,
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
