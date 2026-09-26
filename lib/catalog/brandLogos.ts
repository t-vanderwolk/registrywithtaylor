/**
 * Brand → logo asset, keyed by the exact catalog brand string.
 *
 * Lives here rather than in a component so it can be shared by the finder's
 * brand cards, the checker, and `lib/retailerLogos.ts` — which falls back to
 * this map so a brand-direct affiliate CTA (Mima, Silver Cross, …) shows the
 * brand's own mark instead of its name as text.
 *
 * Drop a file in /public/assets/logos and add the brand to extend this.
 */
export const BRAND_LOGOS: Record<string, string> = {
  BOB: '/assets/logos/bob.png',
  'BOB Gear': '/assets/logos/bob.png',
  'Baby Jogger': '/assets/logos/babyjogger.png',
  'Baby Trend': '/assets/logos/babytrend.png',
  Bellini: '/assets/logos/bellini.png',
  Bombi: '/assets/logos/bombi.png',
  Britax: '/assets/logos/britax.png',
  Bugaboo: '/assets/logos/bugaboo.png',
  Bumbleride: '/assets/logos/bumbleride.png',
  Chicco: '/assets/logos/chicco.png',
  Clek: '/assets/logos/clek.png',
  Cybex: '/assets/logos/cybex.png',
  'Delta Children': '/assets/logos/deltachildren2.png',
  DFY: '/assets/logos/dfy2.png',
  Ergobaby: '/assets/logos/ergobabylogo.png',
  Evenflo: '/assets/logos/evenflo.png',
  Graco: '/assets/logos/graco.png',
  'Guava Family': '/assets/logos/guava.png',
  Ingenuity: '/assets/logos/ingenuity.png',
  Inglesina: '/assets/logos/inglesinalogo.png',
  Joie: '/assets/logos/joie.png',
  Joolz: '/assets/logos/joolz.png',
  Larktale: '/assets/logos/larktale.png',
  'Maxi-Cosi': '/assets/logos/maxi-cosi.png',
  Mercedes: '/assets/logos/mercedes.png',
  Mima: '/assets/logos/mimalogo.png',
  Mockingbird: '/assets/logos/mockingbird.png',
  Momcozy: '/assets/logos/momcozy.png',
  Mompush: '/assets/logos/mompush.png',
  Nuna: '/assets/logos/nuna.png',
  'Orbit Baby': '/assets/logos/orbitbaby.png',
  'Peg Perego': '/assets/logos/pegperego.png',
  'Radio Flyer': '/assets/logos/radioflyer.png',
  Romer: '/assets/logos/romer.png',
  'Safety 1st': '/assets/logos/safetyfirst.png',
  'Silver Cross': '/assets/logos/silver-cross-logo-1.webp',
  Stokke: '/assets/logos/stokke.png',
  Thule: '/assets/logos/thule.png',
  UPPAbaby: '/assets/logos/uppababy.png',
  Veer: '/assets/logos/veer.png',
  WonderFold: '/assets/logos/wonderfold2.png',
  'WonderFold Wagon': '/assets/logos/wonderfold2.png',
  Zoe: '/assets/logos/zoe.png',
};
