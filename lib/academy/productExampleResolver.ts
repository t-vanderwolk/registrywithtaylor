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

const ACADEMY_PRODUCT_OVERRIDES: Partial<Record<string, Record<string, AcademyProductOverride>>> = {
  'where-to-register': {
    [normalizeKey('Universal Registry Platform')]: {
      name: 'MyRegistry Best Baby Registry',
      brand: 'MyRegistry',
      affiliateUrl: 'https://www.myregistry.com/best-baby-registry.aspx',
      imageSrc: EDITORIAL_IMAGES.registry,
      imageAlt: 'MyRegistry baby registry setup example.',
    },
    [normalizeKey('Retailer-Based Registry')]: {
      name: 'Target Baby Registry',
      brand: 'Target',
      affiliateUrl: 'https://www.target.com/gift-registry/create-baby-registry',
      imageSrc: EDITORIAL_IMAGES.registryAlt,
      imageAlt: 'Target baby registry example.',
    },
  },
  'shop-local-get-support': {
    [normalizeKey('Target Baby Concierge')]: {
      name: 'Target Baby Concierge',
      brand: 'Target',
      affiliateUrl: 'https://www.target.com/gift-registry/create-baby-registry',
      imageSrc: EDITORIAL_IMAGES.registry,
      imageAlt: 'Target baby registry support example.',
    },
    [normalizeKey('Independent Baby Store Consultation')]: {
      name: 'MacroBaby Registry Support',
      brand: 'MacroBaby',
      affiliateUrl: 'https://www.macrobaby.com/',
      imageSrc: EDITORIAL_IMAGES.registry,
      imageAlt: 'Independent baby store registry support example.',
    },
    [normalizeKey('Specialty Retailer Hybrid Support')]: {
      name: 'Hip Baby Gear Virtual Consultation',
      brand: 'Hip Baby Gear',
      affiliateUrl: 'https://www.hipbabygear.com/brands/hip-baby-gear/',
      imageSrc: EDITORIAL_IMAGES.registryAlt,
      imageAlt: 'Hybrid stroller and registry support example.',
    },
  },
  'welcome-boxes-perks': {
    [normalizeKey('Registry Welcome Kit')]: {
      name: 'Babylist Hello Baby Box',
      brand: 'Babylist',
      affiliateUrl: 'https://www.babylist.com/hello-baby/whats-inside-babylist-hello-baby-box',
      imageSrc: EDITORIAL_IMAGES.welcome,
      imageAlt: 'Babylist Hello Baby Box example.',
    },
  },
  'rewards-completion-discounts': {
    [normalizeKey('Registry Discount Program')]: {
      name: 'Target Registry Completion Offer',
      brand: 'Target',
      affiliateUrl: 'https://www.target.com/gift-registry/create-baby-registry',
      imageSrc: EDITORIAL_IMAGES.registryAlt,
      imageAlt: 'Registry completion discount example.',
    },
  },
  'vision-and-lifestyle': {
    [normalizeKey('Crib (Foundation Piece)')]: {
      name: 'DaVinci Charlie 4-in-1 Convertible Crib',
      brand: 'DaVinci',
      affiliateUrl: 'https://davincibaby.com/products/charlie-4-in-1-convertible-crib',
      imageSrc: EDITORIAL_IMAGES.nurserySleep,
      imageAlt: 'Convertible crib example for nursery planning.',
    },
    [normalizeKey('Bassinet (Early Flexibility)')]: {
      name: 'HALO BassiNest Connected Swivel Sleeper 3.0',
      brand: 'HALO',
      affiliateUrl: 'https://www.babylist.com/gp/halo-bassinest-connected-swivel-sleeper-3-0/69906/2391208',
      imageSrc: EDITORIAL_IMAGES.nurserySleep,
      imageAlt: 'Bedside bassinet example for early sleep setup.',
    },
    [normalizeKey('Dresser + Changing Setup')]: {
      name: 'DaVinci Charlie 4-in-1 Convertible Crib and Changer Combo',
      brand: 'DaVinci',
      affiliateUrl: 'https://davincibaby.com/products/charlie-4-in-1-convertible-crib-and-changer-combo',
      imageSrc: EDITORIAL_IMAGES.nurseryFurniture,
      imageAlt: 'Nursery dresser and changer combo example.',
    },
  },
  'sleep-space-decisions': {
    [normalizeKey('Bedside Bassinet')]: {
      name: 'HALO BassiNest Connected Swivel Sleeper 3.0',
      brand: 'HALO',
      affiliateUrl: 'https://www.babylist.com/gp/halo-bassinest-connected-swivel-sleeper-3-0/69906/2391208',
      imageSrc: EDITORIAL_IMAGES.nurserySleep,
      imageAlt: 'Bedside bassinet example.',
    },
    [normalizeKey('Full-Size Crib')]: {
      name: 'DaVinci Charlie 4-in-1 Convertible Crib',
      brand: 'DaVinci',
      affiliateUrl: 'https://davincibaby.com/products/charlie-4-in-1-convertible-crib',
      imageSrc: EDITORIAL_IMAGES.nurserySleep,
      imageAlt: 'Full-size crib example.',
    },
    [normalizeKey('Convertible Crib')]: {
      name: 'DaVinci Charlie 4-in-1 Convertible Crib',
      brand: 'DaVinci',
      affiliateUrl: 'https://davincibaby.com/products/charlie-4-in-1-convertible-crib',
      imageSrc: EDITORIAL_IMAGES.nurserySleep,
      imageAlt: 'Convertible crib example.',
    },
  },
  'furniture-that-actually-works': {
    [normalizeKey('Convertible Crib')]: {
      name: 'DaVinci Charlie 4-in-1 Convertible Crib',
      brand: 'DaVinci',
      affiliateUrl: 'https://davincibaby.com/products/charlie-4-in-1-convertible-crib',
      imageSrc: EDITORIAL_IMAGES.nurseryFurniture,
      imageAlt: 'Convertible crib furniture example.',
    },
    [normalizeKey('Dresser + Changing Setup')]: {
      name: "Carter's by DaVinci Nolan 3-Drawer Dresser",
      brand: 'DaVinci',
      affiliateUrl: 'https://davincibaby.com/products/nolan-3-drawer-dresser',
      imageSrc: EDITORIAL_IMAGES.nurseryFurniture,
      imageAlt: 'Nursery dresser example.',
    },
    [normalizeKey('Glider Chair')]: {
      name: "Carter's by DaVinci Arlo Recliner and Swivel Glider",
      brand: 'DaVinci',
      affiliateUrl: 'https://www.babylist.com/gp/carter-s-by-davinci-arlo-recliner-and-swivel-glider/22440/852498',
      imageSrc: EDITORIAL_IMAGES.nurseryFurniture,
      imageAlt: 'Nursery glider chair example.',
    },
  },
  'layout-and-flow': {
    [normalizeKey('Soft Lighting Setup')]: {
      name: 'Hatch Rest 2nd Gen and Rest Go Bundle',
      brand: 'Hatch',
      affiliateUrl: 'https://www.babylist.com/gp/hatch-rest-2nd-gen-and-rest-go-bundle/42466/1635435',
      imageSrc: EDITORIAL_IMAGES.nurseryAtmosphere,
      imageAlt: 'Night light and sound machine setup example.',
    },
    [normalizeKey('Changing Station Organizer')]: {
      name: 'Ubbi Portable Diaper Caddy and Changing Mat',
      brand: 'Ubbi',
      affiliateUrl: 'https://business.walmart.com/ip/Ubbi-Portable-Diaper-Caddy-and-Changing-Mat-for-Baby-Storage-Caddy-Organizer-Taupe/10531855651',
      imageSrc: EDITORIAL_IMAGES.nurseryOrganization,
      imageAlt: 'Changing station organizer example.',
    },
  },
  'storage-and-organization': {
    [normalizeKey('Drawer Organizers')]: {
      name: "Carter's by DaVinci Nolan 3-Drawer Dresser",
      brand: 'DaVinci',
      affiliateUrl: 'https://davincibaby.com/products/nolan-3-drawer-dresser',
      imageSrc: EDITORIAL_IMAGES.nurseryOrganization,
      imageAlt: 'Nursery drawer organization example.',
    },
    [normalizeKey('Storage Bins')]: {
      name: '3 Sprouts Storage Bin',
      brand: '3 Sprouts',
      affiliateUrl: 'https://www.3sprouts.com/products/shark-storage-bin',
      imageSrc: EDITORIAL_IMAGES.nurseryOrganization,
      imageAlt: 'Nursery storage bin example.',
    },
  },
  'atmosphere-and-safety': {
    [normalizeKey('Sound Machine')]: {
      name: 'Hatch Rest 2nd Gen and Rest Go Bundle',
      brand: 'Hatch',
      affiliateUrl: 'https://www.babylist.com/gp/hatch-rest-2nd-gen-and-rest-go-bundle/42466/1635435',
      imageSrc: EDITORIAL_IMAGES.nurseryAtmosphere,
      imageAlt: 'Sound machine example for nursery atmosphere.',
    },
    [normalizeKey('Blackout Curtains')]: {
      name: 'Sleepout Portable Blackout Curtain 3.0',
      brand: 'Sleepout',
      affiliateUrl: 'https://sleepoutcurtains.com/products/the-sleepout-curtain',
      imageSrc: EDITORIAL_IMAGES.nurseryAtmosphere,
      imageAlt: 'Blackout curtain example for nursery sleep setup.',
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
  'daily-use-gear': {
    [normalizeKey('Baby Carrier')]: {
      name: 'Omni Classic Mesh Baby Carrier',
      brand: 'Ergobaby',
      affiliateUrl: 'https://ergobaby.com/omni-classic-baby-carrier-mesh-soft-olive/',
      imageSrc: EDITORIAL_IMAGES.gearDaily,
      imageAlt: 'Baby carrier example for daily use.',
    },
    [normalizeKey('High Chair')]: {
      name: 'Tripp Trapp High Chair Complete',
      brand: 'Stokke',
      affiliateUrl: 'https://www.babylist.com/gp/stokke-tripp-trapp-high-chair-complete-newborn-set/46319/1873945',
      imageSrc: EDITORIAL_IMAGES.gearDaily,
      imageAlt: 'High chair example for daily use.',
    },
    [normalizeKey('Bouncer')]: {
      name: 'Bouncer Balance Soft',
      brand: 'BabyBjorn',
      affiliateUrl: 'https://www.babylist.com/gp/babybjorn-bouncer-balance-soft/3252/1231695',
      imageSrc: EDITORIAL_IMAGES.gearDaily,
      imageAlt: 'Baby bouncer example for daily use.',
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
