type ResolvedProductCardImage = {
  src: string;
  alt: string;
  objectClassName: 'object-contain' | 'object-cover';
  isFallback: boolean;
};

const STROLLER_AND_CAR_SEAT_IMAGE = '/assets/editorial/gear.jpg' as const;
const NURSERY_IMAGE = '/assets/editorial/nursery.jpg' as const;
const REGISTRY_IMAGE = '/assets/editorial/registry.jpg' as const;
const CONTRACTED_GEARPATH_IMAGES = {
  colugo: '/assets/gearpath/cogulo.png',
  ergobabyCarrier: '/assets/gearpath/carrierergobaby.png',
  ergobabyOmni: '/assets/gearpath/omni.png',
  momcozyAir1: '/assets/gearpath/momcozyair1.png',
  momcozyBabyMonitor: '/assets/gearpath/momcozybabymonitor.png',
  momcozyDiaperPail: '/assets/gearpath/momcozydiperpail.png',
  momcozyHighChair: '/assets/gearpath/momcozyhighchair.png',
  momcozyHospitalGrade: '/assets/gearpath/momcozyhospitalgrade.png',
  momcozyMobileFlow: '/assets/gearpath/momcozymobileflow.png',
  momcozyPureHug: '/assets/gearpath/momcozypurehug.png',
} as const;
const CAR_SEAT_PRODUCT_IMAGES = {
  alta: '/assets/car-seats/alta.png',
  aria: '/assets/car-seats/aria.png',
  atonswivel: '/assets/car-seats/atonswivel.png',
  cloudt: '/assets/car-seats/cloudt.png',
  callisto: '/assets/car-seats/callisto.png',
  coral: '/assets/car-seats/coral.png',
  cypress: '/assets/car-seats/cypress.png',
  execnext: '/assets/car-seats/execnext.png',
  foonf: '/assets/car-seats/foonf2.png',
  joiemint: '/assets/car-seats/joiemint.png',
  joierue: '/assets/car-seats/joierue.png',
  keyfit2: '/assets/car-seats/keyfit2.png',
  keyfit35: '/assets/car-seats/keyfit35.png',
  liing: '/assets/car-seats/liing.png',
  liingo: '/assets/car-seats/liingobaseless.png',
  mesav3: '/assets/car-seats/mesav3.png',
  mico: '/assets/car-seats/mico.png',
  orbitbaby: '/assets/car-seats/orbitbaby.png',
  one4life: '/assets/car-seats/one4life.png',
  oobr: '/assets/car-seats/oobr.png',
  pegviaggio435: '/assets/car-seats/pegperago4-35.png',
  pipaaire: '/assets/car-seats/pipaaire.png',
  pipabaless: '/assets/car-seats/pipabaless.png',
  piparx: '/assets/car-seats/piparxbase.png',
  piparxcarrier: '/assets/car-seats/piparx.png',
  pipaurbn: '/assets/car-seats/pipaurbn.png',
  poplar: '/assets/car-seats/poplar.png',
  ravanext: '/assets/car-seats/ravanext.png',
  revvmaxx: '/assets/car-seats/revvmaxx.png',
  romi: '/assets/car-seats/romi.png',
  romerjuni: '/assets/car-seats/romerjuni.png',
  turtleair: '/assets/car-seats/turtleair.png',
  turtleone: '/assets/car-seats/turtleone.png',
  wayb: '/assets/car-seats/wayb.png',
  peri: '/assets/car-seats/peri.png',
  willow: '/assets/car-seats/willow.png',
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

  if (includesAny(normalizedKey, ['colugo compact stroller', 'colugo stroller', 'colugo'])) {
    return {
      src: CONTRACTED_GEARPATH_IMAGES.colugo,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['omni classic', 'ergobaby omni', 'omni baby carrier'])) {
    return {
      src: CONTRACTED_GEARPATH_IMAGES.ergobabyOmni,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['ergobaby carrier', 'mesh baby carrier', '360 cool air mesh'])) {
    return {
      src: CONTRACTED_GEARPATH_IMAGES.ergobabyCarrier,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (normalizedBrand === 'momcozy' && includesAny(normalizedProductName, ['high chair'])) {
    return {
      src: CONTRACTED_GEARPATH_IMAGES.momcozyHighChair,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['momcozy air 1', 'air 1 wearable'])) {
    return {
      src: CONTRACTED_GEARPATH_IMAGES.momcozyAir1,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['hospital grade breast pump', 'momcozy hospital grade'])) {
    return {
      src: CONTRACTED_GEARPATH_IMAGES.momcozyHospitalGrade,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['mobile flow', 'momcozy mobile flow'])) {
    return {
      src: CONTRACTED_GEARPATH_IMAGES.momcozyMobileFlow,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (includesAny(normalizedKey, ['purehug', 'pure hug'])) {
    return {
      src: CONTRACTED_GEARPATH_IMAGES.momcozyPureHug,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (normalizedBrand === 'momcozy' && includesAny(normalizedProductName, ['baby monitor', 'monitor'])) {
    return {
      src: CONTRACTED_GEARPATH_IMAGES.momcozyBabyMonitor,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

  if (normalizedBrand === 'momcozy' && includesAny(normalizedProductName, ['diaper pail', 'diper pail', 'pail'])) {
    return {
      src: CONTRACTED_GEARPATH_IMAGES.momcozyDiaperPail,
      alt: `${brand} ${productName}`,
      objectClassName: 'object-contain',
      isFallback: false,
    };
  }

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

type ResolvedCompatibilityCarSeatImage = {
  src: string;
  alt: string;
};

export function resolveCompatibilityCarSeatImage({
  brand,
  productName,
}: {
  brand: string;
  productName: string;
}): ResolvedCompatibilityCarSeatImage | null {
  const normalizedBrand = normalizeValue(brand);
  const normalizedProductName = normalizeValue(productName);
  const normalizedKey = `${normalizedBrand} ${normalizedProductName}`;

  if (includesAny(normalizedKey, ['pipa urbn', 'pipaurbn'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.pipabaless,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['pipa lite rx', 'pipalite', 'pipa aire', 'pipaaire'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.pipaaire,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['pipa rx', 'piparx'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.piparxcarrier,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['mesa max', 'mesa v3', 'mesa'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.mesav3,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['aria'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.aria,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['mico luxe', 'mico'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.mico,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['coral', 'coral xp'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.coral,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['peri 180', 'peri'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.peri,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['willow s', 'willow'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.willow,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['cypress'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.cypress,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['fit2', 'fit 2', 'keyfit 2', 'keyfit2'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.keyfit2,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['keyfit 35', 'keyfit35'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.keyfit35,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['aton g', 'aton swivel', 'atonswivel', 'aton'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.atonswivel,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['cloud t', 'cloudt'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.cloudt,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['joie infant', 'joie rue', 'joierue'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.joierue,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['joie mint', 'joiemint'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.joiemint,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['liingo', 'liingo baseless'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.liingo,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['liing'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.liing,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['turtle air', 'turtleair'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.turtleair,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['turtle one', 'turtleone'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.turtleone,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['orbit baby g5', 'g5 infant seat', 'orbitbaby'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.orbitbaby,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['primo viaggio 4-35', 'primo viaggio', 'pegperago4-35'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.pegviaggio435,
      alt: `${brand} ${productName}`,
    };
  }

  if (includesAny(normalizedKey, ['romer infant seat', 'infant seat series', 'romer juni', 'juni'])) {
    return {
      src: CAR_SEAT_PRODUCT_IMAGES.romerjuni,
      alt: `${brand} ${productName}`,
    };
  }

  return null;
}
