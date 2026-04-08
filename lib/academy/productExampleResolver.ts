type AcademyProductExampleLike = {
  name: string;
  brand: string;
  description: string;
  pros: string[];
  affiliateUrl: string | null;
  category: string;
  imageSrc?: string | null;
  imageAlt?: string | null;
};

type AcademyProductOverride = Pick<
  AcademyProductExampleLike,
  'name' | 'brand' | 'affiliateUrl' | 'imageSrc' | 'imageAlt'
>;

function normalizeKey(value: string | null | undefined) {
  return value
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim() ?? '';
}

const EDITORIAL_IMAGES = {
  registry: '/assets/editorial/registry.jpg',
  registryAlt: '/assets/editorial/registry.png',
  welcome: '/assets/editorial/welcome.png',
  nurserySleep: '/assets/editorial/babyincrib.png',
  nurseryFurniture: '/assets/editorial/nursery2.png',
  nurseryOrganization: '/assets/editorial/organize.png',
  nurseryAtmosphere: '/assets/editorial/teddy-glow.png',
  gearDaily: '/assets/editorial/babystuff.png',
} as const;

const SUPPORT_LOGOS = {
  hipBabyGear: 'https://cdn.shoplightspeed.com/shops/607706/themes/15634/v/740329/assets/logo.png?20230511131332',
  macroBaby: 'https://www.macrobaby.com/cdn/shop/files/macrobaby-logo.webp?v=301422832542348940',
  targetBabyConcierge:
    'https://target.scene7.com/is/image/Target/GUEST_8fed714b-5ae7-4ca3-9d24-293ea2f643b6?wid=2160&qlt=80&fmt=pjpeg',
} as const;

const CONTRACTED_AFFILIATE_LINKS = {
  colugo: 'https://www.tkqlhce.com/click-101548494-15872703',
  momcozy: 'https://www.jdoqocy.com/click-101548494-17049857',
  dadadaBaby: 'https://dadadababy.com',
  ergobaby: 'https://ergobaby.com',
  joolBaby: 'https://joolbaby.com',
  medela: 'https://www.medela.com',
  munchkin: 'https://www.munchkin.com',
  nanit: 'https://www.nanit.com',
  newtonBaby: 'https://www.newtonbaby.com',
  owlet: 'https://owletcare.com',
} as const;

const GEARPATH_IMAGES = {
  colugo: '/assets/gearpath/cogulo.png',
  ergobabyCarrier: '/assets/gearpath/carrierergobaby.png',
  ergobabyOmni: '/assets/gearpath/omni.png',
  lifestyleInBraPump: '/assets/breastfeeding/lifestyleinbrapump.png',
  lifestylePump: '/assets/breastfeeding/lifestylepump.png',
  medelaInBra: '/assets/breastfeeding/medelainbra.png',
  medelaPump: '/assets/breastfeeding/medelapump.png',
  momcozyAir1: '/assets/breastfeeding/momcozyair1.png',
  momcozyHighChair: '/assets/gearpath/momcozyhighchair.png',
  momcozyHospitalGrade: '/assets/breastfeeding/momcozyhospitalgrade.png',
  momcozyMobileFlow: '/assets/breastfeeding/momcozymobileflow.png',
  momcozyPureHug: '/assets/gearpath/momcozypurehug.png',
  munchkinPump: '/assets/gearpath/munchkinpump.png',
  storageBags: '/assets/breastfeeding/storagebags.png',
  storageBagsMedela: '/assets/breastfeeding/storagebagsmedela.png',
  storageBottles: '/assets/breastfeeding/storagebottttles.png',
} as const;

const NURSERYPATH_IMAGES = {
  cribAndClouds: '/assets/nurserypath/cribandclouds.png',
  cribAndToys: '/assets/nurserypath/cribandtopys.png',
  dadadaCrib: '/assets/nurserypath/dadadacrib.png',
  dadadaDresser: '/assets/nurserypath/dadadadresser.png',
  duplicate: '/assets/nurserypath/duplicate.png',
  joolBabyDiaperPail: '/assets/nurserypath/joolbabydiperpail.png',
  miniVsStandardCrib: '/assets/nurserypath/minivsstandadcrib.png',
  momcozyBabyMonitor: '/assets/nurserypath/momcozybabymonitor.png',
  momcozyDiaperPail: '/assets/nurserypath/momcozydiperpail.png',
  nanit: '/assets/nurserypath/nanit.png',
  newton: '/assets/nurserypath/newton.png',
  newtonMattress: '/assets/nurserypath/newtonmatress.png',
  nurseryIdea: '/assets/nurserypath/nurseryidea.png',
  nurseryPlanning: '/assets/nurserypath/nurseryplanning.png',
  nurseryPlayroom: '/assets/nurserypath/nurseryplayroom.png',
  nurseryPrep: '/assets/nurserypath/nurseryprep.png',
  nurseryAtNight: '/assets/nurserypath/nurseyatnight.png',
  owlet: '/assets/nurserypath/owlet.png',
  sereneNursery: '/assets/nurserypath/serenenursery.png',
  simpleNursery: '/assets/nurserypath/simple%20nursery.png',
  space: '/assets/nurserypath/space.png',
  tealNursery: '/assets/nurserypath/tealnursery.png',
  vision: '/assets/nurserypath/vision.png',
} as const;

const ACADEMY_PRODUCT_OVERRIDES: Partial<Record<string, Record<string, AcademyProductOverride>>> = {
  'where-to-register': {
    [normalizeKey('Universal Registry Platform')]: {
      name: 'MyRegistry Best Baby Registry',
      brand: 'MyRegistry',
      affiliateUrl: 'https://www.myregistry.com/best-baby-registry.aspx',
      imageSrc: 'https://www.modernnursery.com/cdn/shop/files/myregistry_logo.jpg?v=1674761005&width=360',
      imageAlt: 'MyRegistry Best Baby Registry logo.',
    },
    [normalizeKey('Retailer-Based Registry')]: {
      name: 'Target Baby Registry',
      brand: 'Target',
      affiliateUrl: 'https://www.target.com/gift-registry/create-baby-registry',
      imageSrc:
        'https://i0.wp.com/happilytrista.com/wp-content/uploads/2021/01/happily-trista-target-registry.jpg?resize=1024%2C683&ssl=1',
      imageAlt: 'Target Baby Registry example.',
    },
  },
  'shop-local-get-support': {
    [normalizeKey('Target Baby Concierge')]: {
      name: 'Target Baby Concierge',
      brand: 'Target',
      affiliateUrl: 'https://www.target.com/gift-registry/create-baby-registry',
      imageSrc: SUPPORT_LOGOS.targetBabyConcierge,
      imageAlt: 'Target Baby Concierge logo.',
    },
    [normalizeKey('Independent Baby Store Consultation')]: {
      name: 'MacroBaby Registry Support',
      brand: 'MacroBaby',
      affiliateUrl: 'https://www.macrobaby.com/',
      imageSrc: SUPPORT_LOGOS.macroBaby,
      imageAlt: 'MacroBaby logo.',
    },
    [normalizeKey('Specialty Retailer Hybrid Support')]: {
      name: 'Hip Baby Gear Virtual Consultation',
      brand: 'Hip Baby Gear',
      affiliateUrl: 'https://www.hipbabygear.com/brands/hip-baby-gear/',
      imageSrc: SUPPORT_LOGOS.hipBabyGear,
      imageAlt: 'Hip Baby Gear logo.',
    },
  },
  'welcome-boxes-perks': {
    [normalizeKey('Registry Welcome Kit')]: {
      name: 'Babylist Hello Baby Box',
      brand: 'Babylist',
      affiliateUrl: 'https://www.babylist.com/hello-baby/whats-inside-babylist-hello-baby-box',
      imageSrc: 'https://images.babylist.com/image/upload/f_auto,q_auto,c_scale,w_800/v1634250920/hbb_y09ybf.png',
      imageAlt: 'Babylist Hello Baby Box.',
    },
  },
  'rewards-completion-discounts': {
    [normalizeKey('Registry Discount Program')]: {
      name: 'Target Registry Completion Offer',
      brand: 'Target',
      affiliateUrl: 'https://www.target.com/gift-registry/create-baby-registry',
      imageSrc: 'https://images.agoramedia.com/wte3.0/gcms/target-baby-registry-logo.jpg',
      imageAlt: 'Target baby registry completion offer example.',
    },
  },
  'vision-and-lifestyle': {
    [normalizeKey('Crib (Foundation Piece)')]: {
      name: 'dadada Baby Convertible Crib',
      brand: 'dadada Baby',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.dadadaBaby,
      imageSrc: NURSERYPATH_IMAGES.dadadaCrib,
      imageAlt: 'dadada Baby convertible crib.',
    },
    [normalizeKey('Crib Mattress')]: {
      name: 'Newton Baby Original Crib Mattress',
      brand: 'Newton Baby',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.newtonBaby,
      imageSrc: NURSERYPATH_IMAGES.newtonMattress,
      imageAlt: 'Newton Baby crib mattress.',
    },
    [normalizeKey('Dresser + Changing Setup')]: {
      name: 'dadada Baby Dresser + Changing Setup',
      brand: 'dadada Baby',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.dadadaBaby,
      imageSrc: NURSERYPATH_IMAGES.dadadaDresser,
      imageAlt: 'dadada Baby dresser and changing setup.',
    },
  },
  'sleep-space-decisions': {
    [normalizeKey('Full-Size Crib')]: {
      name: 'dadada Baby Full-Size Crib',
      brand: 'dadada Baby',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.dadadaBaby,
      imageSrc: NURSERYPATH_IMAGES.dadadaCrib,
      imageAlt: 'dadada Baby full-size crib.',
    },
    [normalizeKey('Crib Mattress')]: {
      name: 'Newton Baby Original Crib Mattress',
      brand: 'Newton Baby',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.newtonBaby,
      imageSrc: NURSERYPATH_IMAGES.newtonMattress,
      imageAlt: 'Newton Baby crib mattress.',
    },
    [normalizeKey('Video Monitor')]: {
      name: 'Nanit Pro Camera + Wall Mount',
      brand: 'Nanit',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.nanit,
      imageSrc: NURSERYPATH_IMAGES.nanit,
      imageAlt: 'Nanit Pro baby monitor.',
    },
  },
  'furniture-that-actually-works': {
    [normalizeKey('Convertible Crib')]: {
      name: 'dadada Baby Convertible Crib',
      brand: 'dadada Baby',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.dadadaBaby,
      imageSrc: NURSERYPATH_IMAGES.dadadaCrib,
      imageAlt: 'dadada Baby convertible crib.',
    },
    [normalizeKey('Dresser + Changing Setup')]: {
      name: 'dadada Baby Dresser + Changing Setup',
      brand: 'dadada Baby',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.dadadaBaby,
      imageSrc: NURSERYPATH_IMAGES.dadadaDresser,
      imageAlt: 'dadada Baby dresser.',
    },
    [normalizeKey('Diaper Pail')]: {
      name: 'Jool Baby Diaper Pail',
      brand: 'Jool Baby',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.joolBaby,
      imageSrc: NURSERYPATH_IMAGES.joolBabyDiaperPail,
      imageAlt: 'Jool Baby diaper pail.',
    },
  },
  'layout-and-flow': {
    [normalizeKey('Dresser + Changing Setup')]: {
      name: 'dadada Baby Dresser + Changing Setup',
      brand: 'dadada Baby',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.dadadaBaby,
      imageSrc: NURSERYPATH_IMAGES.dadadaDresser,
      imageAlt: 'dadada Baby dresser and changing setup.',
    },
    [normalizeKey('Baby Monitor')]: {
      name: 'Momcozy Baby Monitor',
      brand: 'Momcozy',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.momcozy,
      imageSrc: NURSERYPATH_IMAGES.momcozyBabyMonitor,
      imageAlt: 'Momcozy baby monitor.',
    },
    [normalizeKey('Diaper Pail')]: {
      name: 'Momcozy Diaper Pail',
      brand: 'Momcozy',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.momcozy,
      imageSrc: NURSERYPATH_IMAGES.momcozyDiaperPail,
      imageAlt: 'Momcozy diaper pail.',
    },
  },
  'storage-and-organization': {
    [normalizeKey('Dresser + Drawer Setup')]: {
      name: 'dadada Baby Dresser + Drawer Setup',
      brand: 'dadada Baby',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.dadadaBaby,
      imageSrc: NURSERYPATH_IMAGES.dadadaDresser,
      imageAlt: 'dadada Baby dresser and drawer setup.',
    },
    [normalizeKey('Diaper Pail')]: {
      name: 'Jool Baby Diaper Pail',
      brand: 'Jool Baby',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.joolBaby,
      imageSrc: NURSERYPATH_IMAGES.joolBabyDiaperPail,
      imageAlt: 'Jool Baby diaper pail.',
    },
  },
  'atmosphere-and-safety': {
    [normalizeKey('Crib Mattress')]: {
      name: 'Newton Baby Original Crib Mattress',
      brand: 'Newton Baby',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.newtonBaby,
      imageSrc: NURSERYPATH_IMAGES.newtonMattress,
      imageAlt: 'Newton Baby crib mattress.',
    },
    [normalizeKey('Video Monitor')]: {
      name: 'Nanit Pro Camera + Wall Mount',
      brand: 'Nanit',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.nanit,
      imageSrc: NURSERYPATH_IMAGES.nanit,
      imageAlt: 'Nanit Pro baby monitor.',
    },
    [normalizeKey('Smart Monitor')]: {
      name: 'Owlet Dream Sock',
      brand: 'Owlet',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.owlet,
      imageSrc: NURSERYPATH_IMAGES.owlet,
      imageAlt: 'Owlet Dream Sock.',
    },
  },
  'stroller-foundations': {
    [normalizeKey('Full-Size Stroller')]: {
      name: 'Fox 5',
      brand: 'Bugaboo',
      affiliateUrl:
        'https://www.dpbolvw.net/click-101548494-12218293?url=https%3A%2F%2Fwww.albeebaby.com%2Fproducts%2Fbugaboo-fox-5-renew-complete-stroller-black-heritage-black-heritage-black%3F_pos%3D1%26_psq%3Dfox%26_ss%3De%26_v%3D1.0',
      imageSrc: '/assets/strollers/fox5.png',
      imageAlt: 'Bugaboo Fox 5 stroller.',
    },
    [normalizeKey('Compact Stroller')]: {
      name: 'Dragonfly',
      brand: 'Bugaboo',
      affiliateUrl:
        'https://www.tkqlhce.com/click-101548494-12218293?url=https%3A%2F%2Fwww.albeebaby.com%2Fproducts%2Fbugaboo-dragonfly-complete-lightweight-compact-stroller-black-midnight-black-misty-white-albee-exclusive%3F_pos%3D8%26_sid%3D94123bcbc%26_ss%3Dr',
      imageSrc: '/assets/strollers/compact.png',
      imageAlt: 'Bugaboo Dragonfly stroller.',
    },
    [normalizeKey('Travel Stroller')]: {
      name: 'Butterfly Complete Stroller',
      brand: 'Bugaboo',
      affiliateUrl: 'https://www.babylist.com/gp/bugaboo-butterfly-complete-stroller/25163/1154565',
      imageSrc: '/assets/strollers/butterfly.png',
      imageAlt: 'Bugaboo Butterfly stroller.',
    },
  },
  'car-seat-foundations': {
    [normalizeKey('Infant Car Seat')]: {
      name: 'PIPA RX',
      brand: 'Nuna',
      affiliateUrl: 'https://www.babylist.com/gp/nuna-pipa-rx/16140/310275',
      imageSrc: '/assets/car-seats/piparx.png',
      imageAlt: 'Nuna PIPA RX infant car seat.',
    },
    [normalizeKey('Convertible Car Seat')]: {
      name: 'Foonf Convertible Car Seat',
      brand: 'Clek',
      affiliateUrl: 'https://www.babylist.com/gp/clek-clek-foonf-convertible-seat/14346/2283357',
      imageSrc: '/assets/car-seats/foonf2.png',
      imageAlt: 'Clek Foonf convertible car seat.',
    },
  },
  'travel-systems': {
    [normalizeKey('Full Travel System')]: {
      name: 'MIXX next',
      brand: 'Nuna',
      affiliateUrl:
        'https://www.anrdoezrs.net/click-101548494-12218293?url=https%3A%2F%2Fwww.albeebaby.com%2Fproducts%2Fnuna-mixx-next-stroller-with-magnetic-buckle-caviar%3F_pos%3D2%26_psq%3Dmixx%26_ss%3De%26_v%3D1.0',
      imageSrc: '/assets/strollers/mixxnext.png',
      imageAlt: 'Nuna MIXX next stroller.',
    },
    [normalizeKey('Adapter Setup')]: {
      name: 'Dragonfly',
      brand: 'Bugaboo',
      affiliateUrl:
        'https://www.tkqlhce.com/click-101548494-12218293?url=https%3A%2F%2Fwww.albeebaby.com%2Fproducts%2Fbugaboo-dragonfly-complete-lightweight-compact-stroller-black-midnight-black-misty-white-albee-exclusive%3F_pos%3D8%26_sid%3D94123bcbc%26_ss%3Dr',
      imageSrc: '/assets/strollers/compact.png',
      imageAlt: 'Bugaboo Dragonfly stroller.',
    },
  },
  'travel-with-baby': {
    [normalizeKey('Travel Stroller')]: {
      name: 'Colugo Compact Stroller',
      brand: 'Colugo',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.colugo,
      imageSrc: GEARPATH_IMAGES.colugo,
      imageAlt: 'Colugo Compact Stroller.',
    },
    [normalizeKey('Structured Carrier')]: {
      name: 'Omni Classic Mesh Baby Carrier',
      brand: 'Ergobaby',
      affiliateUrl: 'https://ergobaby.com/omni-classic-baby-carrier-mesh-soft-olive/',
      imageSrc: GEARPATH_IMAGES.ergobabyCarrier,
      imageAlt: 'Ergobaby Omni Classic Mesh Baby Carrier.',
    },
  },
  'daily-use-gear': {
    [normalizeKey('Baby Carrier')]: {
      name: 'Omni Classic Mesh Baby Carrier',
      brand: 'Ergobaby',
      affiliateUrl: 'https://ergobaby.com/omni-classic-baby-carrier-mesh-soft-olive/',
      imageSrc: GEARPATH_IMAGES.ergobabyOmni,
      imageAlt: 'Ergobaby Omni Classic Mesh Baby Carrier.',
    },
    [normalizeKey('Soft Carrier')]: {
      name: 'Momcozy PureHug Baby Carrier',
      brand: 'Momcozy',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.momcozy,
      imageSrc: GEARPATH_IMAGES.momcozyPureHug,
      imageAlt: 'Momcozy PureHug baby carrier.',
    },
    [normalizeKey('High Chair')]: {
      name: 'Momcozy High Chair',
      brand: 'Momcozy',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.momcozy,
      imageSrc: GEARPATH_IMAGES.momcozyHighChair,
      imageAlt: 'Momcozy high chair.',
    },
  },
  'breast-pump': {
    [normalizeKey('Double Electric Pump')]: {
      name: 'Medela Double Electric Breast Pump',
      brand: 'Medela',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.medela,
      imageSrc: GEARPATH_IMAGES.medelaPump,
      imageAlt: 'Medela double electric breast pump.',
    },
    [normalizeKey('Wearable Pump')]: {
      name: 'Momcozy Air 1 Wearable Breast Pump',
      brand: 'Momcozy',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.momcozy,
      imageSrc: GEARPATH_IMAGES.momcozyAir1,
      imageAlt: 'Momcozy Air 1 wearable breast pump.',
    },
    [normalizeKey('Milk Storage Bags')]: {
      name: 'Medela Breast Milk Storage Bags',
      brand: 'Medela',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.medela,
      imageSrc: GEARPATH_IMAGES.storageBagsMedela,
      imageAlt: 'Medela breast milk storage bags.',
    },
  },
  'feeding-and-lactation': {
    [normalizeKey('Double Electric Pump')]: {
      name: 'Momcozy Hospital-Grade Breast Pump',
      brand: 'Momcozy',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.momcozy,
      imageSrc: GEARPATH_IMAGES.momcozyHospitalGrade,
      imageAlt: 'Momcozy hospital-grade breast pump.',
    },
    [normalizeKey('Milk Storage Bags')]: {
      name: 'Medela Breast Milk Storage Bags',
      brand: 'Medela',
      affiliateUrl: CONTRACTED_AFFILIATE_LINKS.medela,
      imageSrc: GEARPATH_IMAGES.storageBags,
      imageAlt: 'Breast milk storage bags.',
    },
  },
} as const;

export function resolveAcademyProductExamples<T extends AcademyProductExampleLike>(
  moduleSlug: string,
  products: T[],
) {
  const overrides = ACADEMY_PRODUCT_OVERRIDES[moduleSlug];

  if (!overrides) {
    return products;
  }

  return products.map((product) => {
    const override = overrides[normalizeKey(product.name)];
    if (!override) {
      return product;
    }

    return {
      ...product,
      ...override,
    };
  });
}
