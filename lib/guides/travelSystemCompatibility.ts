import type { GuideHubIconKey } from '@/lib/guides/hubs';

export type TravelSystemEntityType = 'stroller' | 'carSeat';
export type TravelSystemConnectionType = 'direct' | 'includedAdapter' | 'adapterRequired';

export type TravelSystemEntity = {
  id: string;
  type: TravelSystemEntityType;
  brand: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: GuideHubIconKey;
  aliases: string[];
};

type TravelSystemCompatibilityPair = {
  strollerId: string;
  carSeatId: string;
  connection: TravelSystemConnectionType;
  note: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type TravelSystemResult = {
  id: string;
  stroller: TravelSystemEntity;
  carSeat: TravelSystemEntity;
  counterpart: TravelSystemEntity;
  connection: TravelSystemConnectionType;
  connectionLabel: string;
  note: string;
  sourceLabel: string;
  sourceUrl: string;
};

const TRAVEL_SYSTEM_ENTITIES: TravelSystemEntity[] = [
  {
    id: 'bugaboo-fox-5',
    type: 'stroller',
    brand: 'Bugaboo',
    label: 'Bugaboo Fox 5',
    shortLabel: 'Fox 5',
    description: 'Full-size everyday stroller',
    icon: 'stroller',
    aliases: ['fox 5', 'fox5', 'bugaboo fox', 'bugaboo fox 5'],
  },
  {
    id: 'bugaboo-butterfly',
    type: 'stroller',
    brand: 'Bugaboo',
    label: 'Bugaboo Butterfly',
    shortLabel: 'Butterfly',
    description: 'Travel stroller',
    icon: 'plane',
    aliases: ['butterfly', 'bugaboo butterfly'],
  },
  {
    id: 'bugaboo-donkey-5',
    type: 'stroller',
    brand: 'Bugaboo',
    label: 'Bugaboo Donkey 5',
    shortLabel: 'Donkey 5',
    description: 'Convertible single-to-double stroller',
    icon: 'double',
    aliases: ['donkey', 'donkey 5', 'bugaboo donkey', 'bugaboo donkey 5'],
  },
  {
    id: 'nuna-mixx-next',
    type: 'stroller',
    brand: 'Nuna',
    label: 'Nuna MIXX next',
    shortLabel: 'MIXX next',
    description: 'Full-size modular stroller',
    icon: 'stroller',
    aliases: ['mixx', 'mixx next', 'nuna mixx', 'nuna mixx next'],
  },
  {
    id: 'nuna-trvl-lx',
    type: 'stroller',
    brand: 'Nuna',
    label: 'Nuna TRVL lx',
    shortLabel: 'TRVL lx',
    description: 'Compact travel stroller',
    icon: 'plane',
    aliases: ['trvl', 'trvl lx', 'nuna trvl', 'nuna trvl lx'],
  },
  {
    id: 'uppababy-cruz-v2',
    type: 'stroller',
    brand: 'UPPAbaby',
    label: 'UPPAbaby Cruz V2',
    shortLabel: 'Cruz V2',
    description: 'Full-size everyday stroller',
    icon: 'stroller',
    aliases: ['cruz', 'cruz v2', 'uppababy cruz', 'uppababy cruz v2'],
  },
  {
    id: 'uppababy-vista-v2',
    type: 'stroller',
    brand: 'UPPAbaby',
    label: 'UPPAbaby Vista V2',
    shortLabel: 'Vista V2',
    description: 'Convertible single-to-double stroller',
    icon: 'layers',
    aliases: ['vista', 'vista v2', 'uppababy vista', 'uppababy vista v2'],
  },
  {
    id: 'uppababy-minu-v2',
    type: 'stroller',
    brand: 'UPPAbaby',
    label: 'UPPAbaby Minu V2',
    shortLabel: 'Minu V2',
    description: 'Compact travel stroller',
    icon: 'compact',
    aliases: ['minu', 'minu v2', 'uppababy minu', 'uppababy minu v2'],
  },
  {
    id: 'cybex-balios-s-lux',
    type: 'stroller',
    brand: 'CYBEX',
    label: 'CYBEX Balios S Lux',
    shortLabel: 'Balios S Lux',
    description: 'All-terrain modular stroller',
    icon: 'terrain',
    aliases: ['balios', 'balios s lux', 'cybex balios', 'cybex balios s lux'],
  },
  {
    id: 'cybex-gazelle-s',
    type: 'stroller',
    brand: 'CYBEX',
    label: 'CYBEX Gazelle S',
    shortLabel: 'Gazelle S',
    description: 'Convertible single-to-double stroller',
    icon: 'double',
    aliases: ['gazelle', 'gazelle s', 'cybex gazelle', 'cybex gazelle s'],
  },
  {
    id: 'cybex-libelle',
    type: 'stroller',
    brand: 'CYBEX',
    label: 'CYBEX Libelle',
    shortLabel: 'Libelle',
    description: 'Ultra-compact travel stroller',
    icon: 'plane',
    aliases: ['libelle', 'cybex libelle'],
  },
  {
    id: 'silver-cross-reef-2',
    type: 'stroller',
    brand: 'Silver Cross',
    label: 'Silver Cross Reef 2',
    shortLabel: 'Reef 2',
    description: 'Full-size modular stroller',
    icon: 'stroller',
    aliases: ['reef', 'reef 2', 'silver cross reef', 'silver cross reef 2'],
  },
  {
    id: 'silver-cross-wave-3',
    type: 'stroller',
    brand: 'Silver Cross',
    label: 'Silver Cross Wave 3',
    shortLabel: 'Wave 3',
    description: 'Convertible single-to-double stroller',
    icon: 'double',
    aliases: ['wave', 'wave 3', 'silver cross wave', 'silver cross wave 3'],
  },
  {
    id: 'silver-cross-jet-5',
    type: 'stroller',
    brand: 'Silver Cross',
    label: 'Silver Cross Jet 5',
    shortLabel: 'Jet 5',
    description: 'Travel stroller',
    icon: 'plane',
    aliases: ['jet', 'jet 5', 'silver cross jet', 'silver cross jet 5'],
  },
  {
    id: 'bugaboo-turtle-air',
    type: 'carSeat',
    brand: 'Bugaboo',
    label: 'Bugaboo Turtle Air by Nuna',
    shortLabel: 'Turtle Air',
    description: 'Infant car seat',
    icon: 'carseat',
    aliases: ['turtle air', 'bugaboo turtle air', 'bugaboo turtle air by nuna'],
  },
  {
    id: 'bugaboo-turtle-one',
    type: 'carSeat',
    brand: 'Bugaboo',
    label: 'Bugaboo Turtle One by Nuna',
    shortLabel: 'Turtle One',
    description: 'Infant car seat',
    icon: 'carseat',
    aliases: ['turtle one', 'bugaboo turtle one', 'bugaboo turtle one by nuna', 'turtle by nuna'],
  },
  {
    id: 'nuna-pipa-rx',
    type: 'carSeat',
    brand: 'Nuna',
    label: 'Nuna PIPA RX',
    shortLabel: 'PIPA RX',
    description: 'Infant car seat',
    icon: 'carseat',
    aliases: ['pipa', 'pipa rx', 'nuna pipa', 'nuna pipa rx'],
  },
  {
    id: 'nuna-pipa-lite-rx',
    type: 'carSeat',
    brand: 'Nuna',
    label: 'Nuna PIPA Lite RX',
    shortLabel: 'PIPA Lite RX',
    description: 'Infant car seat',
    icon: 'carseat',
    aliases: ['pipa lite rx', 'nuna pipa lite rx'],
  },
  {
    id: 'nuna-pipa-urbn',
    type: 'carSeat',
    brand: 'Nuna',
    label: 'Nuna PIPA urbn',
    shortLabel: 'PIPA urbn',
    description: 'Baseless infant car seat',
    icon: 'carseat',
    aliases: ['pipa urbn', 'urbn', 'nuna pipa urbn'],
  },
  {
    id: 'uppababy-aria',
    type: 'carSeat',
    brand: 'UPPAbaby',
    label: 'UPPAbaby Aria',
    shortLabel: 'Aria',
    description: 'Infant car seat',
    icon: 'carseat',
    aliases: ['aria', 'uppababy aria'],
  },
  {
    id: 'uppababy-mesa-max',
    type: 'carSeat',
    brand: 'UPPAbaby',
    label: 'UPPAbaby Mesa Max',
    shortLabel: 'Mesa Max',
    description: 'Infant car seat',
    icon: 'carseat',
    aliases: ['mesa', 'mesa max', 'uppababy mesa', 'uppababy mesa max'],
  },
  {
    id: 'cybex-aton-g',
    type: 'carSeat',
    brand: 'CYBEX',
    label: 'CYBEX Aton G',
    shortLabel: 'Aton G',
    description: 'Infant car seat',
    icon: 'carseat',
    aliases: ['aton', 'aton g', 'cybex aton', 'cybex aton g'],
  },
  {
    id: 'silver-cross-glide-plus-360',
    type: 'carSeat',
    brand: 'Silver Cross',
    label: 'Silver Cross Glide Plus 360',
    shortLabel: 'Glide Plus 360',
    description: 'Lie-flat infant carrier',
    icon: 'carseat',
    aliases: ['glide plus 360', 'glide 360', 'silver cross glide plus 360'],
  },
  {
    id: 'silver-cross-dream-i-size',
    type: 'carSeat',
    brand: 'Silver Cross',
    label: 'Silver Cross Dream i-Size',
    shortLabel: 'Dream i-Size',
    description: 'Infant carrier',
    icon: 'carseat',
    aliases: ['dream', 'dream i size', 'dream i-size', 'silver cross dream i-size'],
  },
];

const TRAVEL_SYSTEM_PAIRS: TravelSystemCompatibilityPair[] = [
  {
    strollerId: 'bugaboo-fox-5',
    carSeatId: 'bugaboo-turtle-air',
    connection: 'adapterRequired',
    note: 'Bugaboo says Fox 5 works with Turtle Air using the Bugaboo car seat adapter.',
    sourceLabel: 'Bugaboo Fox 5',
    sourceUrl: 'https://www.bugaboo.com/us-en/strollers/bugaboo-fox-5/bugaboo-fox-5-2-in-1-stroller-black-base-grey-melange-fabrics-astro-purple-sun-canopy-PV006257.html',
  },
  {
    strollerId: 'bugaboo-fox-5',
    carSeatId: 'bugaboo-turtle-one',
    connection: 'adapterRequired',
    note: 'Bugaboo lists Fox 5 among Turtle One compatible strollers when you use the Bugaboo adapter.',
    sourceLabel: 'Bugaboo Turtle One by Nuna',
    sourceUrl: 'https://www.bugaboo.com/us-en/car-seat/bugaboo-turtle-by-nuna-baby-capsule-with-isofix-base-MI002356AU.html',
  },
  {
    strollerId: 'bugaboo-butterfly',
    carSeatId: 'bugaboo-turtle-air',
    connection: 'adapterRequired',
    note: 'Use the Butterfly car seat adapter for Turtle Air by Nuna.',
    sourceLabel: 'Bugaboo Butterfly car seat adapter',
    sourceUrl: 'https://www.bugaboo.com/us-en/accessories/adapters/bugaboo-butterfly-car-seat-adapter-100045001.html',
  },
  {
    strollerId: 'bugaboo-butterfly',
    carSeatId: 'bugaboo-turtle-one',
    connection: 'adapterRequired',
    note: 'Use the Butterfly car seat adapter for Turtle One by Nuna.',
    sourceLabel: 'Bugaboo Butterfly car seat adapter',
    sourceUrl: 'https://www.bugaboo.com/us-en/accessories/adapters/bugaboo-butterfly-car-seat-adapter-100045001.html',
  },
  {
    strollerId: 'bugaboo-butterfly',
    carSeatId: 'nuna-pipa-rx',
    connection: 'adapterRequired',
    note: 'Bugaboo lists PIPA RX on the Butterfly adapter compatibility list.',
    sourceLabel: 'Bugaboo Butterfly car seat adapter',
    sourceUrl: 'https://www.bugaboo.com/us-en/accessories/adapters/bugaboo-butterfly-car-seat-adapter-100045001.html',
  },
  {
    strollerId: 'bugaboo-donkey-5',
    carSeatId: 'bugaboo-turtle-air',
    connection: 'adapterRequired',
    note: 'The Donkey car seat adapter supports Turtle Air on Donkey 5.',
    sourceLabel: 'Bugaboo Donkey adapter for Turtle/Maxi-Cosi',
    sourceUrl: 'https://www.bugaboo.com/us-en/accessories/adapters/bugaboo-donkey-adapter-for-maxi-cosi-car-seat---mono-na-855190MC01.html',
  },
  {
    strollerId: 'bugaboo-donkey-5',
    carSeatId: 'bugaboo-turtle-one',
    connection: 'adapterRequired',
    note: 'Bugaboo lists Turtle One across current Bugaboo stroller travel systems, including Donkey.',
    sourceLabel: 'Bugaboo travel systems',
    sourceUrl: 'https://www.bugaboo.com/us-en/strollers/travel-systems/',
  },
  {
    strollerId: 'nuna-mixx-next',
    carSeatId: 'nuna-pipa-rx',
    connection: 'includedAdapter',
    note: 'MIXX next includes the ring adapter and Nuna says all PIPA infant car seats are compatible.',
    sourceLabel: 'Nuna MIXX next FAQ',
    sourceUrl: 'https://usasupport.nunababy.com/hc/en-us/articles/12836208311311-MIXX-next-FAQ',
  },
  {
    strollerId: 'nuna-mixx-next',
    carSeatId: 'nuna-pipa-lite-rx',
    connection: 'includedAdapter',
    note: 'MIXX next includes the ring adapter and Nuna says all PIPA infant car seats are compatible.',
    sourceLabel: 'Nuna MIXX next FAQ',
    sourceUrl: 'https://usasupport.nunababy.com/hc/en-us/articles/12836208311311-MIXX-next-FAQ',
  },
  {
    strollerId: 'nuna-mixx-next',
    carSeatId: 'nuna-pipa-urbn',
    connection: 'includedAdapter',
    note: 'MIXX next includes the ring adapter and Nuna says all PIPA infant car seats are compatible.',
    sourceLabel: 'Nuna MIXX next FAQ',
    sourceUrl: 'https://usasupport.nunababy.com/hc/en-us/articles/12836208311311-MIXX-next-FAQ',
  },
  {
    strollerId: 'nuna-trvl-lx',
    carSeatId: 'nuna-pipa-rx',
    connection: 'direct',
    note: 'TRVL lx connects directly with Nuna PIPA series seats and does not need adapters.',
    sourceLabel: 'Nuna TRVL lx',
    sourceUrl: 'https://nunababy.com/usa/strollers/newborn-strollers-bassinets/trvl-lx-stroller-bmw-collection',
  },
  {
    strollerId: 'nuna-trvl-lx',
    carSeatId: 'nuna-pipa-lite-rx',
    connection: 'direct',
    note: 'TRVL lx connects directly with Nuna PIPA series seats and does not need adapters.',
    sourceLabel: 'Nuna TRVL lx',
    sourceUrl: 'https://nunababy.com/usa/strollers/newborn-strollers-bassinets/trvl-lx-stroller-bmw-collection',
  },
  {
    strollerId: 'nuna-trvl-lx',
    carSeatId: 'nuna-pipa-urbn',
    connection: 'direct',
    note: 'TRVL lx connects directly with Nuna PIPA series seats and does not need adapters.',
    sourceLabel: 'Nuna TRVL lx',
    sourceUrl: 'https://nunababy.com/usa/strollers/newborn-strollers-bassinets/trvl-lx-stroller-bmw-collection',
  },
  {
    strollerId: 'uppababy-cruz-v2',
    carSeatId: 'uppababy-aria',
    connection: 'direct',
    note: 'Aria attaches directly to the Cruz with no adapters.',
    sourceLabel: 'UPPAbaby Aria support',
    sourceUrl: 'https://support.uppababy.com/hc/en-us/articles/21520031651351-What-UB-strollers-is-the-Aria-compatible-with',
  },
  {
    strollerId: 'uppababy-cruz-v2',
    carSeatId: 'uppababy-mesa-max',
    connection: 'direct',
    note: 'Mesa Max attaches directly to the Cruz with no adapters.',
    sourceLabel: 'UPPAbaby Mesa Max support',
    sourceUrl: 'https://support.uppababy.com/hc/en-us/articles/8527621997719-Does-the-Mesa-Max-attach-to-UPPAbaby-strollers',
  },
  {
    strollerId: 'uppababy-cruz-v2',
    carSeatId: 'nuna-pipa-rx',
    connection: 'adapterRequired',
    note: 'Use the Vista/Cruz Nuna adapter for PIPA RX.',
    sourceLabel: 'UPPAbaby Vista/Cruz adapters',
    sourceUrl: 'https://uppababy.com/accessories/strollers-accessories/vista-cruz-maxi-cosi-adapter/',
  },
  {
    strollerId: 'uppababy-cruz-v2',
    carSeatId: 'nuna-pipa-lite-rx',
    connection: 'adapterRequired',
    note: 'Use the Vista/Cruz Nuna adapter for PIPA Lite RX.',
    sourceLabel: 'UPPAbaby Vista/Cruz adapters',
    sourceUrl: 'https://uppababy.com/accessories/strollers-accessories/vista-cruz-maxi-cosi-adapter/',
  },
  {
    strollerId: 'uppababy-cruz-v2',
    carSeatId: 'nuna-pipa-urbn',
    connection: 'adapterRequired',
    note: 'Use the Vista/Cruz Nuna adapter for PIPA urbn.',
    sourceLabel: 'UPPAbaby Vista/Cruz adapters',
    sourceUrl: 'https://uppababy.com/accessories/strollers-accessories/vista-cruz-maxi-cosi-adapter/',
  },
  {
    strollerId: 'uppababy-vista-v2',
    carSeatId: 'uppababy-aria',
    connection: 'direct',
    note: 'Aria attaches directly to the Vista with no adapters.',
    sourceLabel: 'UPPAbaby Aria support',
    sourceUrl: 'https://support.uppababy.com/hc/en-us/articles/21520031651351-What-UB-strollers-is-the-Aria-compatible-with',
  },
  {
    strollerId: 'uppababy-vista-v2',
    carSeatId: 'uppababy-mesa-max',
    connection: 'direct',
    note: 'Mesa Max attaches directly to the Vista with no adapters.',
    sourceLabel: 'UPPAbaby Mesa Max support',
    sourceUrl: 'https://support.uppababy.com/hc/en-us/articles/8527621997719-Does-the-Mesa-Max-attach-to-UPPAbaby-strollers',
  },
  {
    strollerId: 'uppababy-vista-v2',
    carSeatId: 'nuna-pipa-rx',
    connection: 'adapterRequired',
    note: 'Use the Vista/Cruz Nuna adapter for PIPA RX.',
    sourceLabel: 'UPPAbaby Vista/Cruz adapters',
    sourceUrl: 'https://uppababy.com/accessories/strollers-accessories/vista-cruz-maxi-cosi-adapter/',
  },
  {
    strollerId: 'uppababy-vista-v2',
    carSeatId: 'nuna-pipa-lite-rx',
    connection: 'adapterRequired',
    note: 'Use the Vista/Cruz Nuna adapter for PIPA Lite RX.',
    sourceLabel: 'UPPAbaby Vista/Cruz adapters',
    sourceUrl: 'https://uppababy.com/accessories/strollers-accessories/vista-cruz-maxi-cosi-adapter/',
  },
  {
    strollerId: 'uppababy-vista-v2',
    carSeatId: 'nuna-pipa-urbn',
    connection: 'adapterRequired',
    note: 'Use the Vista/Cruz Nuna adapter for PIPA urbn.',
    sourceLabel: 'UPPAbaby Vista/Cruz adapters',
    sourceUrl: 'https://uppababy.com/accessories/strollers-accessories/vista-cruz-maxi-cosi-adapter/',
  },
  {
    strollerId: 'uppababy-minu-v2',
    carSeatId: 'uppababy-aria',
    connection: 'adapterRequired',
    note: 'Minu V2 uses the UPPAbaby infant car seat adapter for Aria.',
    sourceLabel: 'UPPAbaby Minu adapters',
    sourceUrl: 'https://uppababy.com/accessories/strollers-accessories/minu-mesa-bassinet-adapters/',
  },
  {
    strollerId: 'uppababy-minu-v2',
    carSeatId: 'uppababy-mesa-max',
    connection: 'adapterRequired',
    note: 'Minu V2 uses adapters for Mesa Max.',
    sourceLabel: 'UPPAbaby Mesa Max support',
    sourceUrl: 'https://support.uppababy.com/hc/en-us/articles/8527621997719-Does-the-Mesa-Max-attach-to-UPPAbaby-strollers',
  },
  {
    strollerId: 'uppababy-minu-v2',
    carSeatId: 'nuna-pipa-rx',
    connection: 'adapterRequired',
    note: 'Use the Minu adapter for select Nuna seats, including PIPA RX.',
    sourceLabel: 'UPPAbaby Minu Nuna/Cybex adapters',
    sourceUrl: 'https://uppababy.com/accessories/strollers-accessories/minu-v2-maxi-cosi-adapter/',
  },
  {
    strollerId: 'uppababy-minu-v2',
    carSeatId: 'nuna-pipa-lite-rx',
    connection: 'adapterRequired',
    note: 'Use the Minu adapter for select Nuna seats, including PIPA Lite RX.',
    sourceLabel: 'UPPAbaby Minu Nuna/Cybex adapters',
    sourceUrl: 'https://uppababy.com/accessories/strollers-accessories/minu-v2-maxi-cosi-adapter/',
  },
  {
    strollerId: 'uppababy-minu-v2',
    carSeatId: 'nuna-pipa-urbn',
    connection: 'adapterRequired',
    note: 'Use the Minu adapter for select Nuna seats, including PIPA urbn.',
    sourceLabel: 'UPPAbaby Minu Nuna/Cybex adapters',
    sourceUrl: 'https://uppababy.com/accessories/strollers-accessories/minu-v2-maxi-cosi-adapter/',
  },
  {
    strollerId: 'cybex-balios-s-lux',
    carSeatId: 'cybex-aton-g',
    connection: 'includedAdapter',
    note: 'CYBEX says Balios S Lux works with all CYBEX infant seats using the included adapters.',
    sourceLabel: 'CYBEX Balios S Lux',
    sourceUrl: 'https://www.cybex-online.com/en/us/p/ST_GO_Balios_S_Lux_US.html',
  },
  {
    strollerId: 'cybex-balios-s-lux',
    carSeatId: 'nuna-pipa-rx',
    connection: 'adapterRequired',
    note: 'Use the Balios S Lux car seat adapter for PIPA RX.',
    sourceLabel: 'CYBEX Balios S Lux car seat adapter',
    sourceUrl: 'https://www.cybex-online.com/en/us/p/AC_GO_Adapter_CS_Balios_S_Talos_S_Line_EN.html',
  },
  {
    strollerId: 'cybex-balios-s-lux',
    carSeatId: 'nuna-pipa-lite-rx',
    connection: 'adapterRequired',
    note: 'Use the Balios S Lux car seat adapter for PIPA Lite RX.',
    sourceLabel: 'CYBEX Balios S Lux car seat adapter',
    sourceUrl: 'https://www.cybex-online.com/en/us/p/AC_GO_Adapter_CS_Balios_S_Talos_S_Line_EN.html',
  },
  {
    strollerId: 'cybex-gazelle-s',
    carSeatId: 'cybex-aton-g',
    connection: 'includedAdapter',
    note: 'CYBEX says Gazelle S works with any CYBEX infant seat using the included adapters.',
    sourceLabel: 'CYBEX Gazelle S',
    sourceUrl: 'https://www.cybex-online.com/en/us/p/Set_ST_GO_Gazelle_S_US.html',
  },
  {
    strollerId: 'cybex-libelle',
    carSeatId: 'cybex-aton-g',
    connection: 'includedAdapter',
    note: 'CYBEX says Libelle works with all CYBEX infant seats using the included adapters.',
    sourceLabel: 'CYBEX Libelle',
    sourceUrl: 'https://www.cybex-online.com/en/us/p/10102486.html',
  },
  {
    strollerId: 'silver-cross-reef-2',
    carSeatId: 'silver-cross-glide-plus-360',
    connection: 'adapterRequired',
    note: 'Silver Cross pairs Reef 2 with Glide Plus 360 for its current travel-system bundle.',
    sourceLabel: 'Silver Cross Reef 2 bundle',
    sourceUrl: 'https://www.silvercrossbaby.com/products/reef-2-special-edition-ultimate-360-bundle/',
  },
  {
    strollerId: 'silver-cross-wave-3',
    carSeatId: 'silver-cross-glide-plus-360',
    connection: 'adapterRequired',
    note: 'Silver Cross pairs Wave 3 with Glide Plus 360 in its growing-family travel system bundle.',
    sourceLabel: 'Silver Cross Wave 3 bundle',
    sourceUrl: 'https://www.silvercrossbaby.com/products/wave-3-growing-family-bundle-with-glide-plus-360/',
  },
  {
    strollerId: 'silver-cross-jet-5',
    carSeatId: 'silver-cross-dream-i-size',
    connection: 'adapterRequired',
    note: 'Jet 5 can be used with Dream i-Size using car seat adapters sold separately.',
    sourceLabel: 'Silver Cross Jet 5',
    sourceUrl: 'https://www.silvercrossbaby.com/products/jet-5/',
  },
];

export const FEATURED_TRAVEL_SYSTEM_ENTITY_IDS = [
  'bugaboo-butterfly',
  'nuna-pipa-rx',
  'uppababy-cruz-v2',
  'uppababy-mesa-max',
  'cybex-balios-s-lux',
  'silver-cross-glide-plus-360',
] as const;

const TRAVEL_SYSTEM_ENTITY_MAP = Object.fromEntries(TRAVEL_SYSTEM_ENTITIES.map((entity) => [entity.id, entity])) as Record<
  string,
  TravelSystemEntity
>;

function normalizeSearchValue(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function scoreEntityMatch(entity: TravelSystemEntity, query: string) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) {
    return -1;
  }

  const candidates = [entity.label, entity.shortLabel, entity.brand, ...entity.aliases].map(normalizeSearchValue);
  let bestScore = -1;

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    if (candidate === normalizedQuery) {
      return 100;
    }

    if (candidate.startsWith(normalizedQuery)) {
      bestScore = Math.max(bestScore, 80);
      continue;
    }

    if (normalizedQuery.split(' ').every((token) => candidate.includes(token))) {
      bestScore = Math.max(bestScore, 64);
      continue;
    }

    if (candidate.includes(normalizedQuery)) {
      bestScore = Math.max(bestScore, 48);
    }
  }

  return bestScore;
}

function connectionLabel(connection: TravelSystemConnectionType) {
  switch (connection) {
    case 'direct':
      return 'Direct attach';
    case 'includedAdapter':
      return 'Included adapter';
    case 'adapterRequired':
    default:
      return 'Adapter required';
  }
}

export function getTravelSystemEntity(entityId: string) {
  return TRAVEL_SYSTEM_ENTITY_MAP[entityId] ?? null;
}

export function getFeaturedTravelSystemEntities() {
  return FEATURED_TRAVEL_SYSTEM_ENTITY_IDS.map((entityId) => TRAVEL_SYSTEM_ENTITY_MAP[entityId]).filter(Boolean);
}

export function findTravelSystemEntities(query: string) {
  return TRAVEL_SYSTEM_ENTITIES.map((entity) => ({
    entity,
    score: scoreEntityMatch(entity, query),
  }))
    .filter((item) => item.score >= 0)
    .sort((left, right) => right.score - left.score || left.entity.label.localeCompare(right.entity.label))
    .map((item) => item.entity);
}

export function getTravelSystemResults(entityId: string): TravelSystemResult[] {
  return TRAVEL_SYSTEM_PAIRS.filter((pair) => pair.strollerId === entityId || pair.carSeatId === entityId)
    .map((pair) => {
      const stroller = TRAVEL_SYSTEM_ENTITY_MAP[pair.strollerId];
      const carSeat = TRAVEL_SYSTEM_ENTITY_MAP[pair.carSeatId];
      const counterpart = pair.strollerId === entityId ? carSeat : stroller;

      return {
        id: `${pair.strollerId}__${pair.carSeatId}`,
        stroller,
        carSeat,
        counterpart,
        connection: pair.connection,
        connectionLabel: connectionLabel(pair.connection),
        note: pair.note,
        sourceLabel: pair.sourceLabel,
        sourceUrl: pair.sourceUrl,
      };
    })
    .sort(
      (left, right) =>
        left.counterpart.label.localeCompare(right.counterpart.label) ||
        left.stroller.label.localeCompare(right.stroller.label) ||
        left.carSeat.label.localeCompare(right.carSeat.label),
    );
}
