export type AffiliatePartnerLogo = {
  src: string;
  isFallback: boolean;
};

const FALLBACK_LOGO_SRC = '/assets/logos/partnericon.png';

const SCANNED_LOGO_SOURCES = [
  '/assets/brand/albeebaby.png',
  '/assets/logos/Colugo.png',
  '/assets/logos/anbbaby.png',
  '/assets/logos/babubath.png',
  '/assets/logos/babyquip.png',
  '/assets/logos/babyshusher.png',
  '/assets/logos/babytrend.png',
  '/assets/logos/bcbabycare.png',
  '/assets/logos/bebcare.png',
  '/assets/logos/bellaluna.png',
  '/assets/logos/dadadadalogo.png',
  '/assets/logos/earthmama.png',
  '/assets/logos/ergobabylogo.png',
  '/assets/logos/happiestbaby-logo.png',
  '/assets/logos/huggies-logo.png',
  '/assets/logos/inglesinalogo.png',
  '/assets/logos/inklinglogo.jpeg',
  '/assets/logos/joolbabylogo.png',
  '/assets/logos/kids2shop-logo.png',
  '/assets/logos/kytebaby-logo.png',
  '/assets/logos/lelolologo.png',
  '/assets/logos/macrobaby-logo.webp',
  '/assets/logos/momcozy.png',
  '/assets/logos/mustela-logo.png',
  '/assets/logos/myregistry-logo.png',
  '/assets/logos/newtonbaby-logo.png',
  '/assets/logos/owlet-logo.png',
  '/assets/logos/petitfrompoalogo.png',
  '/assets/logos/robellogo.png',
  '/assets/logos/silver-cross-logo-1.webp',
  '/assets/logos/slumberpod.png',
  '/assets/logos/snugglemeorganics.png',
  '/assets/logos/thebabybrew.png',
  '/assets/logos/tommee-tippee-logo.png',
  '/assets/logos/wayblogo.png',
] as const;

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/['’.]/g, '')
    .replace(/[^a-z0-9]+/g, '');
}

function fileNameWithoutExtension(src: string) {
  const fileName = src.split('/').pop() ?? src;
  return fileName.replace(/\.[^.]+$/, '');
}

function normalizeLogoKey(src: string) {
  return normalizeName(fileNameWithoutExtension(src).replace(/logo|icon/gi, ''));
}

const EXACT_LOGO_ALIASES: Record<string, string> = {
  albeebaby: '/assets/brand/albeebaby.png',
  anbbaby: '/assets/logos/anbbaby.png',
  anbabyny: '/assets/logos/anbbaby.png',
  babubath: '/assets/logos/babubath.png',
  babyquip: '/assets/logos/babyquip.png',
  babyshusher: '/assets/logos/babyshusher.png',
  babytrend: '/assets/logos/babytrend.png',
  bcbabycare: '/assets/logos/bcbabycare.png',
  bebcare: '/assets/logos/bebcare.png',
  bellalunatoys: '/assets/logos/bellaluna.png',
  colugo: '/assets/logos/Colugo.png',
  dadadababy: '/assets/logos/dadadadalogo.png',
  earthmamaorganics: '/assets/logos/earthmama.png',
  ergobaby: '/assets/logos/ergobabylogo.png',
  ergobabycarrierinc: '/assets/logos/ergobabylogo.png',
  happiestbaby: '/assets/logos/happiestbaby-logo.png',
  huggiesamazonmarketplace: '/assets/logos/huggies-logo.png',
  inglesina: '/assets/logos/inglesinalogo.png',
  inklingsbaby: '/assets/logos/inklinglogo.jpeg',
  joolbaby: '/assets/logos/joolbabylogo.png',
  kids2shop: '/assets/logos/kids2shop-logo.png',
  kytebaby: '/assets/logos/kytebaby-logo.png',
  lelolopostpartum: '/assets/logos/lelolologo.png',
  macrobaby: '/assets/logos/macrobaby-logo.webp',
  makeafort: '/assets/logos/make-a-fortlogo.png',
  momcozy: '/assets/logos/momcozy.png',
  mustelausa: '/assets/logos/mustela-logo.png',
  myregistry: '/assets/logos/myregistry-logo.png',
  myregistrycom: '/assets/logos/myregistry-logo.png',
  newtonbaby: '/assets/logos/newtonbaby-logo.png',
  owlet: '/assets/logos/owlet-logo.png',
  owletbabycare: '/assets/logos/owlet-logo.png',
  petitfrompoa: '/assets/logos/petitfrompoalogo.png',
  rebel: '/assets/logos/robellogo.png',
  silvercross: '/assets/logos/silver-cross-logo-1.webp',
  slumberpod: '/assets/logos/slumberpod.png',
  snugglemeorganic: '/assets/logos/snugglemeorganics.png',
  thebabysbrew: '/assets/logos/thebabybrew.png',
  tommeetippee: '/assets/logos/tommee-tippee-logo.png',
  wayb: '/assets/logos/wayblogo.png',
};

const SCANNED_LOGO_INDEX = new Map(
  SCANNED_LOGO_SOURCES.map((src) => [normalizeLogoKey(src), src]),
);

export function getAffiliatePartnerLogo(name: string): AffiliatePartnerLogo {
  const normalizedName = normalizeName(name);
  const alias = EXACT_LOGO_ALIASES[normalizedName];

  if (alias) {
    return { src: alias, isFallback: false };
  }

  const exactMatch = SCANNED_LOGO_INDEX.get(normalizedName);
  if (exactMatch) {
    return { src: exactMatch, isFallback: false };
  }

  for (const [logoKey, src] of SCANNED_LOGO_INDEX.entries()) {
    if (!logoKey) {
      continue;
    }

    if (normalizedName.includes(logoKey) || logoKey.includes(normalizedName)) {
      return { src, isFallback: false };
    }
  }

  return { src: FALLBACK_LOGO_SRC, isFallback: true };
}
